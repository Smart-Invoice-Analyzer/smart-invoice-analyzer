def extract_data_from_link_turkish(link):

    import requests
    import json

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
            "name": "None",
            "address": None,
            "country": None, 
            "phone": None
        }

        # Items
        extracted_data["items"] = []
        for item in invoice_data["AddedSaleItems"]:
            extracted_data["items"].append({
                "description": item["Name"],
                "quantity": item["ItemQuantity"],
                "unit_price": item["UnitPriceAmount"],
                "category": None
            })

        return json.dumps(extracted_data, indent=2)

    except Exception as e:
        return {"server_error": str(e)}
    

if __name__ == "__main__":

    link = "https://pavopay.pavo.com.tr/InquiryOperations/SaleInquiryView/Index?q=E37q2wQCtl"

    extracted_data = extract_data_from_link_turkish(link)

    print("Extracted Data:")
    print(extracted_data)
