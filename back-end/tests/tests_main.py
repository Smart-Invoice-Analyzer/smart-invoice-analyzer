import requests
import json

# Base URL for the API
BASE_URL = "https://smart-invoice-analyzer-server.onrender.com"
# Alternate URL: https://smart-invoice-analyzer-server.onrender.com/

# --- Test Data ---
# Data for creating a new user
new_user_data = {
    "name": "Test",
    "surname": "Person",
    "username": "test_person42",
    "email": "test_person42@test.test",
    "password_hash": "StrongPassword123$",
    "date_of_birth": "2000-01-13",
    "gender": "other"
}

# Data for user login
login_data = {
    "username_or_email": "test_person42",
    "password": "StrongPassword123$"
}

# Data for updating user information (will be populated dynamically)
update_user_data = {
    "name": "firstname",
    "surname": "lastname",
    "new_email": "new.email.address@example.com",
    "date_of_birth": "1990-01-13",
    "gender": None,
    "new_password": "NewPassword123$",
    "confirm_password": "NewPassword123$",
    "current_password": "StrongPassword123$"
}

new_invoice_data = {
    "date": "2025-03-14",
    "total_amount": 2999.98,
    "currency": "USD",
    "qr_data": "someqrdatahere",
    "vendor": {
        "name": "ACME Corp",
        "address": "123 Main St, City, Country",
        "country": "USA",
        "phone": "+1-800-555-1234"
    },
    "items": [
        {
            "description": "Laptop",
            "quantity": 2,
            "unit_price": 999.99,
            "category": "Electronics"
        }
    ]
}


# Variable to store the authentication token
AUTH_TOKEN = None
# Variable to store the created user ID
CREATED_USER_ID = None
# Variable to store the created invoice ID
CREATED_INVOICE_ID = None

# --- Test Counters ---
TOTAL_TESTS = 0
PASSED_TESTS = 0

# --- Helper Functions for API Calls ---

def create_user():
    """
    Sends a POST request to create a new user.
    Returns True if successful, False otherwise.
    """
    global CREATED_USER_ID, TOTAL_TESTS, PASSED_TESTS
    TOTAL_TESTS += 1
    print("\n--- Creating New User ---")
    endpoint = f"{BASE_URL}/users/add_user"
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(endpoint, data=json.dumps(new_user_data), headers=headers)
        print(f"Request URL: {endpoint}")
        print(f"Request Body: {json.dumps(new_user_data, indent=2)}")
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 201:
            print("User created successfully!")
            PASSED_TESTS += 1
            try:
                response_json = response.json()
                CREATED_USER_ID = response_json.get("user_id")
                if CREATED_USER_ID:
                    print(f"Obtained User ID: {CREATED_USER_ID}")
                    update_user_data["user_id"] = CREATED_USER_ID
                else:
                    print("Warning: 'user_id' not found in the create user response. Deletion and update might fail without a valid ID.")
                return True
            except json.JSONDecodeError:
                print("Warning: Could not decode JSON from create user response. User ID might not be available.")
                return False
        else:
            print(f"Failed to create user. Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the server at {BASE_URL}. Is the server running? {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during user creation: {e}")
        return False

def login_user():
    """
    Sends a POST request to log in a user and retrieves the authentication token.
    Returns True if successful, False otherwise.
    """
    global AUTH_TOKEN, TOTAL_TESTS, PASSED_TESTS
    TOTAL_TESTS += 1
    print("\n--- Logging In User ---")
    endpoint = f"{BASE_URL}/users/login"
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(endpoint, data=json.dumps(login_data), headers=headers)
        print(f"Request URL: {endpoint}")
        print(f"Request Body: {json.dumps(login_data, indent=2)}")
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 200:
            print("Login successful!")
            PASSED_TESTS += 1
            try:
                response_json = response.json()
                AUTH_TOKEN = response_json.get("token") # Changed from "access_token" to "token" based on your previous code
                if AUTH_TOKEN:
                    print(f"Obtained Auth Token: {AUTH_TOKEN[:30]}...") # Print first 30 chars for brevity
                else:
                    print("Warning: 'token' not found in login response.")
                return True
            except json.JSONDecodeError:
                print("Warning: Could not decode JSON from login response. Token might not be available.")
                return False
        else:
            print(f"Login failed. Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the server at {BASE_URL}. Is the server running? {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during login: {e}")
        return False

def update_user():
    """
    Sends a PUT request to update user information, requiring an auth token.
    Returns True if successful, False otherwise.
    """
    global TOTAL_TESTS, PASSED_TESTS
    TOTAL_TESTS += 1
    print("\n--- Updating User Information ---")
    if not AUTH_TOKEN:
        print("Error: No authentication token available. Cannot update user.")
        return False
    if "user_id" not in update_user_data or not update_user_data["user_id"]: # Check if user_id is set
        print("Error: No user ID available for update. Cannot update user.")
        return False

    endpoint = f"{BASE_URL}/users/update_user"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}"
    }
    try:
        response = requests.put(endpoint, data=json.dumps(update_user_data), headers=headers)
        print(f"Request URL: {endpoint}")
        print(f"Request Body: {json.dumps(update_user_data, indent=2)}")
        print(f"Request Headers: {headers}")
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 200:
            print("User information updated successfully!")
            PASSED_TESTS += 1
            return True
        else:
            print(f"Failed to update user. Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the server at {BASE_URL}. Is the server running? {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during user update: {e}")
        return False

def add_invoice():
    """
    Sends a POST request to add a new invoice.
    Requires AUTH_TOKEN and CREATED_USER_ID to be set.
    Returns True if successful, False otherwise.
    """
    global CREATED_INVOICE_ID, TOTAL_TESTS, PASSED_TESTS
    TOTAL_TESTS += 1
    print("\n--- Adding New Invoice ---")
    if not AUTH_TOKEN:
        print("Error: No authentication token available. Cannot add invoice.")
        return False
    if not CREATED_USER_ID:
        print("Error: No user ID available for invoice. Cannot add invoice.")
        return False

    # Set the user_id in the invoice data before sending
    # Ensure this is done if your Invoice schema requires user_id
    # new_invoice_data["user_id"] = CREATED_USER_ID # This line might cause an error if your swagger.json definition
                                                 # for Invoice does not have a user_id field.
                                                 # Based on the swagger, Invoice has date, total_amount, currency,
                                                 # qr_data, vendor, items. User_id is likely implicitly handled by the token.
                                                 # Remove or comment out the above line if it causes issues.


    endpoint = f"{BASE_URL}/invoices/add_invoice"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}"
    }
    try:
        response = requests.post(endpoint, data=json.dumps(new_invoice_data), headers=headers)
        print(f"Request URL: {endpoint}")
        print(f"Request Body: {json.dumps(new_invoice_data, indent=2)}")
        print(f"Request Headers: {headers}")
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 201:
            print("Invoice added successfully!")
            PASSED_TESTS += 1
            try:
                response_json = response.json()
                CREATED_INVOICE_ID = response_json.get("invoice_id")
                if CREATED_INVOICE_ID:
                    print(f"Obtained Invoice ID: {CREATED_INVOICE_ID}")
                else:
                    print("Warning: 'invoice_id' not found in the add invoice response. Deletion might fail without a valid ID.")
                return True
            except json.JSONDecodeError:
                print("Warning: Could not decode JSON from add invoice response. Invoice ID might not be available.")
                return False
        else:
            print(f"Failed to add invoice. Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the server at {BASE_URL}. Is the server running? {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during adding invoice: {e}")
        return False

def get_user_invoices():
    """
    Sends a GET request to retrieve all invoices for the authenticated user.
    Requires AUTH_TOKEN to be set.
    Returns True if successful, False otherwise.
    """
    global TOTAL_TESTS, PASSED_TESTS
    TOTAL_TESTS += 1
    print("\n--- Getting User Invoices ---")
    if not AUTH_TOKEN:
        print("Error: No authentication token available. Cannot get invoices.")
        return False

    endpoint = f"{BASE_URL}/invoices/get_invoices"
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}"
    }
    try:
        response = requests.get(endpoint, headers=headers)
        print(f"Request URL: {endpoint}")
        print(f"Request Headers: {headers}")
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 200:
            print("User invoices fetched successfully!")
            PASSED_TESTS += 1
            return True
        else:
            print(f"Failed to get user invoices. Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the server at {BASE_URL}. Is the server running? {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during getting invoices: {e}")
        return False

def delete_invoice():
    """
    Sends a DELETE request to delete a specific invoice.
    Requires AUTH_TOKEN and CREATED_INVOICE_ID to be set.
    Returns True if successful, False otherwise.
    """
    global TOTAL_TESTS, PASSED_TESTS
    TOTAL_TESTS += 1
    print("\n--- Deleting Invoice ---")
    if not AUTH_TOKEN:
        print("Error: No authentication token available. Cannot delete invoice.")
        return False
    if not CREATED_INVOICE_ID:
        print("Error: No invoice ID available for deletion. Cannot delete invoice.")
        return False

    endpoint = f"{BASE_URL}/invoices/delete_invoice/{CREATED_INVOICE_ID}"
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}"
    }
    try:
        response = requests.delete(endpoint, headers=headers)
        print(f"Request URL: {endpoint}")
        print(f"Request Headers: {headers}")
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 200:
            print("Invoice deleted successfully!")
            PASSED_TESTS += 1
            return True
        else:
            print(f"Failed to delete invoice. Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the server at {BASE_URL}. Is the server running? {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during invoice deletion: {e}")
        return False

def delete_user():
    """
    Sends a DELETE request to delete a user, requiring an auth token and user ID.
    Returns True if successful, False otherwise.
    """
    global TOTAL_TESTS, PASSED_TESTS
    TOTAL_TESTS += 1
    print("\n--- Deleting User ---")
    if not AUTH_TOKEN:
        print("Error: No authentication token available. Cannot delete user.")
        return False
    if not CREATED_USER_ID:
        print("Error: No user ID available for deletion. Cannot delete user.")
        return False

    endpoint = f"{BASE_URL}/users/delete_user/{CREATED_USER_ID}"
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}"
    }
    try:
        response = requests.delete(endpoint, headers=headers)
        print(f"Request URL: {endpoint}")
        print(f"Request Headers: {headers}")
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")

        if response.status_code == 200:
            print("User deleted successfully!")
            PASSED_TESTS += 1
            return True
        else:
            print(f"Failed to delete user. Error: {response.text}")
            return False
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the server at {BASE_URL}. Is the server running? {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred during user deletion: {e}")
        return False

# --- Main Test Sequence ---
if __name__ == "__main__":
    print("Starting API test sequence...\n")

    # 1. Create a new user
    if create_user():
        # 2. Log in the newly created user
        if login_user():
            # 3. Update the user's information
            if update_user():
                # 4. Add a new invoice for the user
                if add_invoice():
                    # 5. Get all invoices for the user
                    if get_user_invoices():
                        # 6. Delete the invoice
                        delete_invoice() # Delete is the last step for invoice, no need to chain
                else:
                    print("Skipping invoice operations due to failed add_invoice.")
            else:
                print("Skipping invoice and deletion operations due to failed update_user.")
        else:
            print("Skipping update, invoice, and deletion operations due to failed login_user.")
    else:
        print("Skipping all subsequent operations due to failed create_user.")


    # Ensure user deletion happens if possible, even if other steps failed, for cleanup.
    # This check ensures we only try to delete if a user ID was obtained and a token is present.
    if CREATED_USER_ID and AUTH_TOKEN:
        delete_user() # This will contribute to TOTAL_TESTS and PASSED_TESTS internally

    print("\n--- Test Summary ---")
    print(f"Tests Passed: {PASSED_TESTS} / {TOTAL_TESTS}")
    print("API test sequence completed.")
