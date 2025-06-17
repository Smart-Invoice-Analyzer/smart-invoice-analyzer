from flask import request
from flask_restx import Namespace, Resource, fields
from flask import current_app as app
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from app.helper_functions import decode_jwt, convert_decimal, validate_phone, validate_country, validate_currency, validate_positive_amount
import json
from datetime import date
import joblib
import os
import re
import app.module.invoiceocr.function as function

# Get the absolute path to the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build paths relative to this script's directory
VECTORIZER_PATH = os.path.join(BASE_DIR, "classification", "vectorizer.joblib")
MODEL_PATH = os.path.join(BASE_DIR, "classification", "lr_full.joblib")
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, "classification", "labelencoder.joblib")

# Load components
with open(VECTORIZER_PATH, "rb") as f:
    vectorizer = joblib.load(f)

with open(MODEL_PATH, "rb") as f:
    model = joblib.load(f)

with open(LABEL_ENCODER_PATH, "rb") as f:
    label_encoder = joblib.load(f)

invoice_ns = Namespace(
    'invoices',
    description='Invoice-related operations',
    authorizations={
        'Bearer': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization'
        }
    }
)

# Swagger models
item_model = invoice_ns.model('Item', {
    'description': fields.String(required=True, description='Item description', example='Laptop'),
    'quantity': fields.Float(required=True, description='Quantity of the item', example=2),
    'unit_price': fields.Float(required=True, description='Unit price of the item', example=999.99),
    'category': fields.String(description='Category of the item', example='Electronics')
})

vendor_model = invoice_ns.model('Vendor', {
    'name': fields.String(required=True, description='Vendor name', example='ACME Corp'),
    'address': fields.String(description='Vendor address', example='123 Main St, City, Country'),
    'country': fields.String(description='Vendor country', example='USA'),
    'phone': fields.String(description='Vendor phone number', pattern=r'^\+?\d{1,4}?[-. \(\)]?(\d{1,3}){1}[-. \(\)]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,9}$', example='+1-800-555-1234')
})

invoice_model = invoice_ns.model('Invoice', {
    'date': fields.String(required=True, description='Invoice date (ISO format)', example='2025-03-14'),
    'total_amount': fields.Float(required=True, description='Total amount of the invoice', example=2999.98),
    'currency': fields.String(required=True, description='Currency used for the invoice', example='USD'),
    'qr_data': fields.String(description='QR code data for the invoice', example='someqrdatahere'),
    'vendor': fields.Nested(vendor_model, required=True, description='Vendor details'),
    'items': fields.List(fields.Nested(item_model), required=True, description='List of items in the invoice')
})

# Define the expected payload schema (can be just one field: qr_data)
qr_data_model = invoice_ns.model('QRData', {
    'qr_data': fields.String(required=True, description='QR code URL/data from the invoice')
})


@invoice_ns.route('/process_qr')
class ProcessQR(Resource):
    @invoice_ns.expect(qr_data_model)
    @invoice_ns.response(201, 'Invoice added successfully from QR')
    @invoice_ns.response(400, 'Invalid input or extraction error')
    @invoice_ns.response(401, 'Invalid or expired token')
    @invoice_ns.response(500, 'Internal server error')
    @invoice_ns.doc(security='Bearer')
    def post(self):
        import traceback
        """Extract invoice from QR data and add it to the database."""
        # Extract JSON payload
        data = request.get_json()
        qr_data = data.get('qr_data')

        if not qr_data:
            return {'error': 'qr_data is required'}, 400

        # Validate and decode JWT token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401

        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if user_id is None:
            return {'error': 'Unauthorized'}, 401

        # Process the QR data and add invoice
        try:
            # This function should return a Python dict matching your invoice schema
            function.init()
            if 'monitoring.e-kassa.gov.az' in qr_data:
                invoice_data = extract_data_from_link_azerbaijan(qr_data)
            else:
                invoice_data = extract_data_from_link_turkish(qr_data)

            if not isinstance(invoice_data, dict):
                return {'error': 'Failed to extract invoice data from QR'}, 400

            # Optionally attach qr_data if not already present in returned dict
            invoice_data['qr_data'] = qr_data

            invoice_id = add_invoice_from_data(invoice_data, user_id, app.db.session)
            return {'message': 'Invoice added successfully', 'invoice_id': invoice_id}, 201

        except ValueError as ve:
            return {'error': f'Validation error: {str(ve)}'}, 400

        except IntegrityError:
            return {'error': 'An error occurred while inserting invoice. Please try again later.'}, 500

        except SQLAlchemyError:
            app.db.session.rollback()
            return {'error': 'A database error occurred.'}, 500

        except Exception as e:
            # Handle any other unexpected error
            traceback.print_exc()  # Log the traceback for debugging
            return {'error': f'Unexpected error: {str(e)}'}, 500


@invoice_ns.route('/add_invoice')
class AddInvoice(Resource):
    @invoice_ns.expect(invoice_model)
    @invoice_ns.response(201, 'Invoice added successfully')
    @invoice_ns.response(400, 'Missing required fields or invalid data')
    @invoice_ns.response(401, 'Invalid or expired token')
    @invoice_ns.response(403, 'Unauthorized: You can only add invoices for your own account')
    @invoice_ns.response(500, 'An error occurred while processing your request. Please try again later.')
    @invoice_ns.doc(security='Bearer')
    def post(self):
        """Add a new invoice."""
        invoice_data = request.get_json()

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401

        token = auth_header.split(" ")[1]
        if not token:
            return {'error': 'Missing JWT'}, 400

        decoded_user_id = decode_jwt(token)
        if decoded_user_id is None:
            return {'error': 'Unauthorized'}, 401

        try:
            invoice_id = add_invoice_from_data(invoice_data, decoded_user_id, app.db.session)
            return {'message': 'Invoice added successfully', 'invoice_id': invoice_id}, 201

        except ValueError as ve:
            return {'error': str(ve)}, 400

        except IntegrityError:
            return {'error': 'An error occurred while processing your request. Please try again later.'}, 500

        except SQLAlchemyError:
            app.db.session.rollback()
            return {'error': 'An unexpected error occurred. Please try again later.'}, 500


@invoice_ns.route('/delete_invoice/<int:invoice_id>')
class DeleteInvoice(Resource):
    @invoice_ns.response(200, 'Invoice deleted successfully')
    @invoice_ns.response(400, 'Invalid invoice ID')
    @invoice_ns.response(401, 'Invalid or expired token')
    @invoice_ns.response(403, 'Unauthorized: You can only delete your own invoices')
    @invoice_ns.response(404, 'Invoice not found')
    @invoice_ns.response(500, 'An error occurred while processing your request. Please try again later.')
    @invoice_ns.doc(security='Bearer')
    def delete(self, invoice_id):
        """Delete an invoice by ID"""
        # Extract JWT from Authorization header
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401

        # Extract the token (removing "Bearer " prefix)
        token = auth_header.split(" ")[1]
        decoded_user_id = decode_jwt(token)

        if decoded_user_id is None:
            return {'error': 'Unauthorized'}, 401

        try:
            # Check if the invoice exists and belongs to the user
            query_check = text("SELECT user_id FROM invoices WHERE id = :invoice_id")
            result = app.db.session.execute(query_check, {'invoice_id': invoice_id}).fetchone()

            if not result:
                return {'error': 'Invoice not found'}, 404

            invoice_user_id = result[0]
            if invoice_user_id != decoded_user_id:
                return {'error': 'Unauthorized: You can only delete your own invoices'}, 403

            # Call the delete_invoice function in PostgreSQL
            query_delete = text("SELECT delete_invoice(:invoice_id)")
            app.db.session.execute(query_delete, {'invoice_id': invoice_id})

            # Commit the transaction
            app.db.session.commit()

            return {'message': 'Invoice deleted successfully'}, 200

        except SQLAlchemyError:
            app.db.session.rollback()
            return {'error': 'An error occurred while processing your request. Please try again later.'}, 500


@invoice_ns.route('/get_invoices')
class GetInvoices(Resource):
    @invoice_ns.response(200, 'Invoices fetched successfully')
    @invoice_ns.response(400, 'Invalid or expired token')
    @invoice_ns.response(401, 'Unauthorized')
    @invoice_ns.response(404, 'No invoices found for the user')
    @invoice_ns.doc(security='Bearer')
    def get(self):
        """Get all invoices for the authenticated user."""
        # Extract JWT from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401

        # Extract the token (removing "Bearer " prefix)
        token = auth_header.split(" ")[1]
        decoded_user_id = decode_jwt(token)

        if decoded_user_id is None:
            return {'error': 'Invalid or expired token'}, 400

        try:
            # SQL query to get invoices for the user, with vendor details and items
            query = text("""
                SELECT
                    invoices.id AS invoice_id,
                    invoices.date,
                    invoices.total_amount,
                    invoices.currency,
                    invoices.qr_data,
                    invoices.created_at,
                    vendors.id AS vendor_id,
                    vendors.name AS vendor_name,
                    vendors.address AS vendor_address,
                    vendors.country AS vendor_country,
                    vendors.phone AS vendor_phone,
                    invoice_items.id AS item_id,
                    invoice_items.description AS item_description,
                    invoice_items.quantity AS item_quantity,
                    invoice_items.unit_price AS item_unit_price,
                    invoice_items.total_price AS item_total_price,
                    invoice_items.category AS item_category
                FROM
                    invoices
                LEFT JOIN
                    vendors ON invoices.vendor_id = vendors.id
                LEFT JOIN
                    invoice_items ON invoices.id = invoice_items.invoice_id
                WHERE
                    invoices.user_id = :user_id
            """)

            result = app.db.session.execute(query, {'user_id': decoded_user_id}).mappings()

            invoices = {}
            for row in result:
                invoice_id = row['invoice_id']
                created_at = row['created_at']
                if isinstance(created_at, date):
                    created_at = created_at.isoformat() if isinstance(created_at, date) else created_at
                if invoice_id not in invoices:
                    invoices[invoice_id] = {
                        'id': row['invoice_id'],
                        'date': row['date'].isoformat() if isinstance(row['date'], date) else row['date'],
                        'total_amount': row['total_amount'],
                        'currency': row['currency'],
                        'qr_data': row['qr_data'],
                        'created_at': created_at,
                        'vendor': {
                            'id': row['vendor_id'],
                            'name': row['vendor_name'],
                            'address': row['vendor_address'],
                            'country': row['vendor_country'],
                            'phone': row['vendor_phone'],
                        },
                        'items': []
                    }

                invoice_item = {
                    'description': row['item_description'],
                    'quantity': row['item_quantity'],
                    'unit_price': row['item_unit_price'],
                    'total_price': row['item_total_price'],
                    'category': row['item_category']
                }

                invoices[invoice_id]['items'].append(invoice_item)

            # Convert all Decimal values to float
            invoices_list = list(invoices.values())
            invoices_list = convert_decimal(invoices_list)

            if not invoices_list:
                return {'error': 'No invoices found for the user'}, 404
            
            # get number of invoices added today
            today = date.today()
            invoices_added_today = sum(1 for inv in invoices_list if inv['created_at'].startswith(today.isoformat()))
            
            return {'added_today': invoices_added_today, 'invoices': invoices_list}, 200

        except SQLAlchemyError:
            return {'error': 'An error occurred while fetching invoices. Please try again later.'}, 500


def add_invoice_from_data(invoice_data, user_id, db_session):
    required_fields = ["date", "total_amount", "currency", "items", "vendor"]
    
    for field in required_fields:
        if field not in invoice_data:
            raise ValueError(f'Missing required field: {field}')
    
    if "name" not in invoice_data["vendor"]:
        raise ValueError('Missing required vendor field: name')

    if not invoice_data["items"]:
        raise ValueError('Items list cannot be empty')

    for index, item in enumerate(invoice_data["items"]):
        required_item_fields = ["description", "quantity", "unit_price"]
        for field in required_item_fields:
            if field not in item:
                raise ValueError(f'Missing required field in item at index {index}: {field}')
        validate_positive_amount(item["quantity"])
        validate_positive_amount(item["unit_price"])

    # Normalize and extract fields
    vendor_data = invoice_data['vendor']
    vendor_name = vendor_data.get('name', '').strip().title()
    vendor_address = vendor_data.get('address')
    vendor_country = vendor_data.get('country', '').strip().lower() if vendor_data.get('country') else None
    vendor_phone = vendor_data.get('phone')
    invoice_date = invoice_data['date']
    total_amount = invoice_data['total_amount']
    currency = invoice_data['currency'].upper()
    qr_data = invoice_data.get('qr_data')
    items = invoice_data['items']

    if vendor_phone:
        validate_phone(vendor_phone)

    validate_currency(currency)
    validate_positive_amount(total_amount)

    items_json = json.dumps(items)

    query = text(""" 
        SELECT insert_invoice(
            :user_id, :vendor_name, :vendor_address, :vendor_country,
            :vendor_phone, :invoice_date,
            :total_amount, :currency, :qr_data, :items
        );
    """)

    result = db_session.execute(query, {
        'user_id': user_id,
        'vendor_name': vendor_name,
        'vendor_address': vendor_address,
        'vendor_country': vendor_country,
        'vendor_phone': vendor_phone,
        'invoice_date': invoice_date,
        'total_amount': total_amount,
        'currency': currency,
        'qr_data': qr_data,
        'items': items_json
    })

    db_session.commit()
    return result.scalar()  # Return invoice ID


def extract_data_from_link_azerbaijan(link):

    image_id = function.get_id(link)
    image_path = f"app/images/{image_id}.jpg"

    # Ensure images folder exists
    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    # Process image
    content = function.read(image_path)

    result = extract_invoice_data_azerbaijan(content, link)

    return result


def extract_invoice_data_azerbaijan(lines, link):
        from datetime import datetime

        def get_value_after(label):
            try:
                idx = lines.index(label)
                return lines[idx + 1].strip()
            except (ValueError, IndexError):
                return None

        raw_date = get_value_after("Date:")
        date = datetime.strptime(raw_date, "%d.%m.%Y").strftime("%Y-%m-%d") if raw_date else None

        name = None
        address = None
        for i in range(len(lines)):
            if lines[i].startswith("Object"):
                if 'oba' in lines[i].lower():
                    name = 'OBA MARKET SARAY'
                elif 'araz' in lines[i].lower():
                    name = 'ARAZ MARKET'
                else:
                    name = 'Vendor Unspecified'
                try:
                    address = lines[i+1].split(":", 1)[1].strip() if i + 1 < len(lines) else None
                except IndexError:
                    address = None
                break

        total_amount_line = next((line.strip() for line in lines if line.strip().lower() == "total"), None)
        if total_amount_line:
            idx = lines.index(total_amount_line)
            try:
                total_amount = float(lines[idx + 1].strip())
            except:
                total_amount = None
        else:
            total_amount = None

        result = {
            "date": date,
            "total_amount": total_amount,
            "currency": "AZN",
            "qr_data": link,
            "vendor": {
                "name": name,
                "address": address,
                "country": "AZ",
                "phone": None
            },
            "items": extract_invoice_items("\n".join(lines)),
        }

        return result


def extract_invoice_items(ocr_text: str):
    lines = ocr_text.strip().splitlines()
    items = []

    # Find the start and end of the items section
    try:
        start_index = next(i for i, line in enumerate(lines)
                        if 'Quantity' in line and 'Price' in line and 'Total' in line) + 1
        end_index = next(i for i, line in enumerate(lines)
                        if line.strip().lower().startswith('total'))
    except StopIteration:
        return []

    i = start_index
    descriptions = []
    temp_items = []

    while i < end_index:
        description_lines = []
        while i < end_index and not re.match(r"^\d+(\.\d+)?$", lines[i].strip()):
            description_lines.append(lines[i].strip())
            i += 1

        description = " ".join(description_lines).strip()

        quantity = None
        unit_price = None
        total_price = None

        if i < end_index:
            quantity_line = lines[i].strip()
            if re.match(r"^\d+(\.\d+)?$", quantity_line):
                quantity = float(quantity_line)
                i += 1

        if i < end_index:
            price_line = lines[i].strip()
            numbers = re.findall(r"\d+\.\d+", price_line)

            if len(numbers) == 2:
                unit_price = float(numbers[0])
                total_price = float(numbers[1])
                i += 1
            elif len(numbers) == 1:
                unit_price = float(numbers[0])
                i += 1
                if i < end_index:
                    next_line = lines[i].strip()
                    if re.match(r"^\d+\.\d+$", next_line):
                        total_price = float(next_line)
                        i += 1

        if description and quantity is not None and unit_price is not None:
            descriptions.append(description)
            temp_items.append({
                "description": description,
                "quantity": quantity,
                "unit_price": unit_price,
                "category": None
            })
        else:
            i += 1

    # Translate and predict categories
    if descriptions:
        translated = translate_to_en(descriptions, language='az')
        X_vec = vectorizer.transform(translated)
        y_pred = model.predict(X_vec)
        predicted_labels = label_encoder.inverse_transform(y_pred)
        # The words with all 0 vectors are unknown
        for i in range(X_vec.shape[0]):
            if X_vec[i].nnz == 0: 
                predicted_labels[i] = "Unknown" 
        for item, label in zip(temp_items, predicted_labels):
            item["category"] = label

    return temp_items


def translate_to_en(text_list, language='tr'):
    from deep_translator import GoogleTranslator
    # translate from turkish to english
    try:
        translated = GoogleTranslator(source=language, target='en').translate_batch(text_list)
        return translated
    except Exception as e:
        print(f"Translation error: {e}")
        return []

def extract_data_from_link_turkish(link):

    import requests
    import time

    try:

        # Extract InqueryHash from the link
        InqueryHash = link.split("?q=")[1]

        # Endpoint URL
        url = "https://pavopay.pavo.com.tr/api/InquiryOperations/SaleInquiry/LoadSalesSummary"

        # JSON payload
        payload = {
            "InqueryHash": InqueryHash,
            "IsCheckStatus": False
        }

        # Optional headers, might be required depending on server expectations
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        }

        # Send POST request
        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)
            time.sleep(1)
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")

        invoice_data = response.json()

        extracted_data = {}

        # Using SaleDate and formatting it to "YYYY-MM-DD"
        extracted_data["date"] = invoice_data["SaleDate"].split("T")[0]

        # Total Amount
        extracted_data["total_amount"] = invoice_data["TotalPrice"]

        # Currency
        extracted_data["currency"] = invoice_data["CurrencyCode"]

        # QR Data
        extracted_data["qr_data"] = link

        # Vendor
        extracted_data["vendor"] = {
            "name": "Vendor Unspecified",
            "address": None,
            "country": None, 
            "phone": None
        }

        # Items
        extracted_data["items"] = []
        item_descriptions_tr = []
        original_items = [] # To store original item data for re-populating

        for item in invoice_data["AddedSaleItems"]:
            item_descriptions_tr.append(item["Name"])
            original_items.append({
                "description": item["Name"],
                "quantity": item["ItemQuantity"],
                "unit_price": item["UnitPriceAmount"],
                "category": None # Placeholder for category
            })

        # Translate item descriptions to English
        translated_descriptions_en = translate_to_en(item_descriptions_tr)
        print("Translations: ", translated_descriptions_en)

        # Predict categories for each translated item description
        if translated_descriptions_en:
            # Transform the translated descriptions using the loaded vectorizer
            X_new = vectorizer.transform(translated_descriptions_en)
            # Predict the categories
            predictions = model.predict(X_new)
            # Decode the numerical predictions back to original labels
            predicted_categories = label_encoder.inverse_transform(predictions)
            # The words with all 0 vectors are unknown
            for i in range(X_new.shape[0]):
                if X_new[i].nnz == 0: 
                    predicted_categories[i] = "Unknown" 
            # Assign predicted categories back to the items
            for i, item_data in enumerate(original_items):
                item_data["category"] = predicted_categories[i]

        extracted_data["items"] = original_items

        return extracted_data

    except Exception as e:
        return {"server_error": str(e)}