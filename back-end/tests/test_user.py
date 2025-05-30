import json

def test_add_user_success(test_client):
    """Test successful user registration"""
    new_user = {
        "name": "Test",
        "surname": "Person",
        "username": "test_person42",
        "email": "test_person42@test.test",
        "password_hash": "StrongPassword123$",
        "date_of_birth": "2000-01-13",
        "gender": "other"
    }
    
    response = test_client.post('/users/add_user', data=json.dumps(new_user), content_type='application/json')
    
    assert response.status_code == 201
    assert 'User created successfully' in response.json['message']

def test_add_user_missing_fields(test_client):
    """Test user registration with missing fields"""
    incomplete_user = {
        "name": "Jane",
        "email": "janedoe@example.com"
    }
    
    response = test_client.post('/users/add_user', data=json.dumps(incomplete_user), content_type='application/json')

    assert response.status_code == 400
    assert 'Missing required fields' in response.json['error']

def test_login_success(test_client):
    """Test successful login"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }

    response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')

    assert response.status_code == 200
    assert 'Login successful' in response.json['message']
    assert 'token' in response.json

def test_login_invalid_credentials(test_client):
    """Test login failure with incorrect password"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "WrongPassword"
    }

    response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')

    assert response.status_code == 401
    assert 'Invalid password' in response.json['error']

def test_update_user_success(test_client):
    """Test successful user update"""
    # Login to get token
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")

    update_data = {
        "name": "NewName",
        "surname": "NewSurname",
        "new_email": "newemail@example.com",
        "gender": "male",
        "date_of_birth": "1995-06-15"
    }

    response = test_client.put('/users/update_user', 
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json['message'] == "User updated successfully"


def test_update_user_missing_auth(test_client):
    """Test update without Authorization header"""
    update_data = {"name": "NewName"}
    
    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json')

    assert response.status_code == 401
    assert response.json['error'] == "Missing or invalid Authorization header"


def test_update_user_invalid_token(test_client):
    """Test update with an invalid token"""
    update_data = {"name": "NewName"}

    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": "Bearer invalid_token"})

    assert response.status_code == 401
    assert response.json['error'] == "Invalid or expired token"


def test_update_user_after_deletion(test_client):
    """Test update when user is deleted"""
    
    # Step 1: Create a new user
    user_data = {
        "name": "Test",
        "surname": "Person",
        "username": "test_person43",
        "email": "test_person43@test.test",
        "password_hash": "StrongPassword123$",
        "date_of_birth": "2000-01-13",
        "gender": "other"
    }
    create_response = test_client.post('/users/add_user', 
                                       data=json.dumps(user_data),
                                       content_type='application/json')
    assert create_response.status_code == 201
    user_id = create_response.json.get("user_id")

    # Step 2: Log in with the created user
    login_data = {
        "username_or_email": "test_person43",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', 
                                      data=json.dumps(login_data),
                                      content_type='application/json')
    token = login_response.json.get("token")

    # Step 3: Delete the user
    delete_response = test_client.delete(f'/users/delete_user/{user_id}',
                                         headers={"Authorization": f"Bearer {token}"})
    assert delete_response.status_code == 200
    assert "User deleted successfully" in delete_response.json['message']

    # Step 4: Try to update the deleted user
    update_data = {"name": "NewName"}
    update_response = test_client.put('/users/update_user',
                                      data=json.dumps(update_data),
                                      content_type='application/json',
                                      headers={"Authorization": f"Bearer {token}"})
    
    # Step 5: Assert that the user cannot update after deletion
    assert update_response.status_code == 404
    assert update_response.json['error'] == "User not found"


def test_update_user_invalid_date_of_birth(test_client):
    """Test update with invalid date of birth"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")

    update_data = {"date_of_birth": "invalid-date"}

    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json['error'] == "Invalid date of birth. Must be in the format YYYY-MM-DD"


def test_update_user_invalid_gender(test_client):
    """Test update with an invalid gender"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")

    update_data = {"gender": "unknown_gender"}

    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json['error'] == 'Invalid gender. Must be "male", "female", "other", or null.'


def test_update_user_duplicate_email(test_client):
    """Test update with an email that is already taken"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")

    update_data = {"new_email": "johndoe@example.com"}

    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json['error'] == "Email is already in use"


def test_update_user_weak_password(test_client):
    """Test update with a weak password"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")

    update_data = {
        "new_password": "weak",
        "confirm_password": "weak",
        "current_password": "StrongPassword123$"
    }

    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json['error'] == "New password is not strong enough"


def test_update_user_password_mismatch(test_client):
    """Test update when new passwords do not match"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")

    update_data = {
        "new_password": "NewPassword123$",
        "confirm_password": "DifferentPassword123$",
        "current_password": "StrongPassword123$"
    }

    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 400
    assert response.json['error'] == "New passwords do not match"


def test_update_user_wrong_current_password(test_client):
    """Test update with incorrect current password"""
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")

    update_data = {
        "new_password": "NewPassword123$",
        "confirm_password": "NewPassword123$",
        "current_password": "WrongPassword123$"
    }

    response = test_client.put('/users/update_user',
                               data=json.dumps(update_data),
                               content_type='application/json',
                               headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 401
    assert response.json['error'] == "Incorrect current password"


def test_add_invoice_success(test_client):
    """Test successful invoice creation"""
    # Log in first to get the token
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")
    
    new_invoice = {
        "date": "2025-03-14",
        "total_amount": 2999.98,
        "currency": "USD",
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

    response = test_client.post('/invoices/add_invoice', 
                                data=json.dumps(new_invoice), 
                                content_type='application/json',
                                headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 201
    assert 'Invoice added successfully' in response.json['message']
    assert 'invoice_id' in response.json

def test_add_invoice_missing_fields(test_client):
    """Test adding an invoice with missing required fields"""
    # Log in first to get the token
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")
    
    incomplete_invoice = {
        "date": "2025-03-14",
        "total_amount": 2999.98,
        "currency": "USD",
        "vendor": {
            "name": "ACME Corp"
        },
        "items": []
    }

    response = test_client.post('/invoices/add_invoice', 
                                data=json.dumps(incomplete_invoice), 
                                content_type='application/json',
                                headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 400
    assert 'Items list cannot be empty' in response.json['error']

def test_delete_invoice_success(test_client):
    """Test successful invoice deletion"""
    # Log in and create an invoice first
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")
    
    new_invoice = {
        "date": "2025-03-14",
        "total_amount": 2999.98,
        "currency": "USD",
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

    invoice_response = test_client.post('/invoices/add_invoice', 
                                        data=json.dumps(new_invoice), 
                                        content_type='application/json',
                                        headers={"Authorization": f"Bearer {token}"})
    invoice_id = invoice_response.json['invoice_id']

    # Now, delete the invoice
    delete_response = test_client.delete(f'/invoices/delete_invoice/{invoice_id}', 
                                         headers={"Authorization": f"Bearer {token}"})
    
    assert delete_response.status_code == 200
    assert 'Invoice deleted successfully' in delete_response.json['message']

def test_delete_invoice_unauthorized(test_client):
    """Test deleting an invoice without authorization"""
    response = test_client.delete('/invoices/delete_invoice/1', 
                                  headers={"Authorization": "Bearer invalidtoken"})
    
    assert response.status_code == 401
    assert 'Unauthorized' in response.json['error']

def test_get_invoices_success(test_client):
    """Test retrieving invoices for the logged-in user"""
    # Log in first to get the token
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")
    
    # Create an invoice to fetch
    new_invoice = {
        "date": "2025-03-14",
        "total_amount": 2999.98,
        "currency": "USD",
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

    test_client.post('/invoices/add_invoice', 
                     data=json.dumps(new_invoice), 
                     content_type='application/json',
                     headers={"Authorization": f"Bearer {token}"})

    # Fetch invoices
    response = test_client.get('/invoices/get_invoices', 
                               headers={"Authorization": f"Bearer {token}"})
    
    assert response.status_code == 200
    assert 'invoices' in response.json
    assert len(response.json['invoices']) > 0

def test_delete_user_unauthorized(test_client):
    """Test deleting a user without a valid token"""
    response = test_client.delete('/users/delete_user/1', headers={"Authorization": "Bearer invalidtoken"})

    assert response.status_code == 401
    assert 'Invalid or expired token' in response.json['error']

def test_delete_user_success(test_client):
    """Test successful user deletion"""
    # First, login and get a token
    login_data = {
        "username_or_email": "test_person42",
        "password": "StrongPassword123$"
    }
    login_response = test_client.post('/users/login', data=json.dumps(login_data), content_type='application/json')
    token = login_response.json.get("token")
    user_id = login_response.json.get("user_id")
    # Now, delete the user
    response = test_client.delete(f'/users/delete_user/{user_id}', headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert 'User deleted successfully' in response.json['message']