import jwt
import datetime
import re
from app.config import Config
from decimal import Decimal
import re
from phonenumbers import parse, is_valid_number, phonenumberutil
import pycountry
from forex_python.converter import CurrencyCodes

SECRET_KEY = Config.SECRET_KEY

def validate_email(email):
    """Validate email format"""
    # Regex improved to allow more valid email formats.
    email_regex = r"(^[a-z0-9]+([._+-]?[a-z0-9]+)*@[a-z0-9-]+\.[a-z]{2,})"
    if not re.match(email_regex, email, re.IGNORECASE):
        raise ValueError("Invalid email format.")

def validate_phone(phone):
    """Validate phone number"""
    try:
        parsed_phone = parse(phone)
        if not is_valid_number(parsed_phone):
            raise ValueError("Invalid phone number.")
    except phonenumberutil.NumberParseException:
        raise ValueError("Invalid phone number format.")

def validate_country(country):
    """Validate country with flexible support for Kosovo"""
    # Normalize input (convert to lowercase)
    country = country.strip().lower()

    # List of variations for Kosovo
    kosovo_variants = [
        "kosovo", 
        "xk", 
        "rks", 
        "republic of kosovo"
    ]

    # Check if the country matches any of the Kosovo variations
    if country in [k.lower() for k in kosovo_variants]:
        return  # Valid Kosovo entry

    # Check using pycountry for other countries
    country_obj = pycountry.countries.get(name=country.title())
    if country_obj is None:
        raise ValueError(f"{country} is not a valid country.")


def validate_currency(currency):
    """Validate currency"""
    c = CurrencyCodes()
    if not c.get_currency_name(currency):
        raise ValueError(f"{currency} is not a valid currency.")

def validate_positive_amount(amount):
    """Ensure amount is positive"""
    if amount <= 0:
        raise ValueError("Amount must be greater than zero.")

# Function to generate JWT token
def generate_jwt(user_id):
    expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1)  # Token expires in 1 day
    payload = {
        'user_id': user_id,
        'exp': expiration_time
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    

# Function to decode JWT token
def decode_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None  # Token is expired
    except jwt.InvalidTokenError:
        return None  # Invalid token

def is_strong_password(password):
    """Check if the password meets security requirements."""
    return bool(re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', password))

def convert_decimal(obj):
    """Recursively convert all Decimal instances to float."""
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, dict):
        return {key: convert_decimal(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_decimal(item) for item in obj]
    else:
        return obj
