import bcrypt
from flask import request
from flask_restx import Namespace, Resource, fields
from flask import current_app as app
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from app.helper_functions import validate_email, is_strong_password, generate_jwt, decode_jwt
from datetime import datetime

user_ns = Namespace(
    'users',
    description="User operations",
    authorizations={
        'Bearer': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization'
        }
    }
)

# Swagger Models
user_model = user_ns.model('User', {
    'name': fields.String(required=True, description='First Name', example='John'),
    'surname': fields.String(required=True, description='Last Name', example='Doe'),
    'username': fields.String(required=True, description='Username', example='johndoe'),
    'email': fields.String(required=True, description='Email Address', example='johndoe@example.com'),
    'password_hash': fields.String(required=True, description='User Password', example='StrongPassword123$'),
    'date_of_birth': fields.String(required=True, description='Date of Birth', example='1990-01-13'),
    'gender': fields.String(description='Gender (male, female, other)', example='male')
})

login_model = user_ns.model('Login', {
    'username_or_email': fields.String(required=True, description='Username or Email', example='username'),
    'password': fields.String(required=True, description='User Password', example='password')
})

update_user_model = user_ns.model('UpdateUser', {
    'name': fields.String(description='First Name', example='firstname'),
    'surname': fields.String(description='Last Name', example='lastname'),
    'new_email': fields.String(description='New Email Address', example='new.email.address@example.com'),
    'date_of_birth': fields.String(description='Date of Birth', example='1990-01-13'),
    'gender': fields.String(description='Updated Gender', example='updated_gender'),
    'new_password': fields.String(description='New Password', example='NewPassword123$'),
    'confirm_password': fields.String(description='Confirm New Password', example='NewPassword123$'),
    'current_password': fields.String(description='Current Password', example='CurrentPassword123$')
})

# User Routes
@user_ns.route('/add_user')
class AddUser(Resource):
    @user_ns.expect(user_model)
    @user_ns.response(201, 'User created successfully')
    @user_ns.response(400, 'Bad Request')
    def post(self):
        """Create a new user"""
        user_data = request.get_json()

        required_fields = ['name', 'surname', 'username', 'email', 'password_hash', 'date_of_birth']
        if not all(key in user_data for key in required_fields):
            return {'error': 'Missing required fields'}, 400

        name = user_data['name']
        surname = user_data['surname']
        username = user_data['username'].lower().strip()
        email = user_data['email'].lower().strip()
        password = user_data['password_hash']
        gender = user_data.get('gender')
        date_of_birth = user_data.get('date_of_birth')

        # Validate gender
        if gender:
            gender = gender.lower().strip()
            if gender not in {'male', 'female', 'other'}:
                return {'error': 'Invalid gender'}, 400

        # Validate email
        try:
            validate_email(email)
        except ValueError as e:
            return {'error': str(e)}, 400
        
        try:
            email_check_query = text("""
                    SELECT 1 FROM users WHERE email = :new_email
                """)
            email_check_result = app.db.session.execute(email_check_query, {'new_email': email}).scalar()
            if email_check_result:
                return {'error': 'Email is already in use'}, 400
        except Exception as e:
            return {'error': str(e)}, 400

        # Validate password
        if not is_strong_password(password):
            return {'error': 'Weak password'}, 400
        
        # Validate date of birth
        date_of_birth_string = date_of_birth
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%Y-%m-%d')
        except ValueError:
            return {'error': 'Invalid date of birth. Must be in the format YYYY-MM-DD'}, 400
        
        # Vallidate age from date of birth
        calculated_age = datetime.now().year - date_of_birth.year
        if calculated_age < 1 or calculated_age > 130:
            return {'error': 'Invalid date of birth. Age must be between 1 and 130 years'}, 400

        try:
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            query = text("SELECT create_user(:name, :surname, :username, :email, :password_hash, :date_of_birth, :gender);")
            result = app.db.session.execute(query, {
                'name': name, 'surname': surname, 'username': username, 
                'email': email, 'password_hash': password_hash, 'date_of_birth': date_of_birth_string, 'gender': gender
            })
            app.db.session.commit()
            return {'message': 'User created successfully', 'user_id': result.scalar()}, 201

        except Exception as e:
            app.db.session.rollback()
            return {'error': str(e)}, 400


@user_ns.route('/login')
class LoginUser(Resource):
    @user_ns.expect(login_model)
    @user_ns.response(200, 'Login successful')
    @user_ns.response(401, 'Invalid credentials')
    def post(self):
        """User login"""
        login_data = request.get_json()

        if not all(key in login_data for key in ['username_or_email', 'password']):
            return {'error': 'Missing required fields'}, 400

        username_or_email = login_data['username_or_email'].lower().strip()
        password = login_data['password']

        try:
            query = text("SELECT verify_user_login(:username_or_email);")
            result = app.db.session.execute(query, {'username_or_email': username_or_email})
            user_id = result.scalar()

            if not user_id:
                return {'error': 'Invalid username/email'}, 401

            user_query = text("SELECT name, surname, username, email, gender, DATE_PART('year', AGE(date_of_birth)) AS age, password_hash, date_of_birth FROM users WHERE id = :user_id")
            user_result = app.db.session.execute(user_query, {'user_id': user_id}).fetchone()

            if not user_result:
                return {'error': 'User not found'}, 404

            name, surname, username, email, gender, age, stored_password_hash, date_of_birth = user_result

            if not bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                return {'error': 'Invalid password'}, 401

            token = generate_jwt(user_id)

            return {
                'message': 'Login successful',
                'user_id': user_id,
                'token': token,
                'name': name,
                'surname': surname,
                'username': username,
                'email': email,
                'gender': gender,
                "age": age,
                "date_of_birth": date_of_birth.strftime('%Y-%m-%d') if date_of_birth else None
            }, 200

        except SQLAlchemyError:
            return {'error': 'Database error'}, 500


@user_ns.route('/delete_user/<int:user_id>')
class DeleteUser(Resource):
    @user_ns.response(200, 'User deleted successfully')
    @user_ns.response(401, 'Unauthorized')
    @user_ns.response(404, 'User not found')
    @user_ns.doc(security='Bearer')
    def delete(self, user_id):
        """Delete a user"""
        # Extract JWT from Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401

        # Extract the token (removing "Bearer " prefix)
        token = auth_header.split(" ")[1]

        decoded_user_id = decode_jwt(token)
        if decoded_user_id is None:
            return {'error': 'Invalid or expired token'}, 401

        if decoded_user_id != user_id:
            return {'error': 'Unauthorized: You can only delete your own account'}, 401

        try:
            query = text("SELECT delete_user(:user_id);")
            result = app.db.session.execute(query, {'user_id': user_id})
            
            if result.rowcount == 0:  # If no rows were affected, user was not found
                return {'error': 'User not found'}, 404
            
            app.db.session.commit()
            return {'message': 'User deleted successfully'}, 200

        except SQLAlchemyError:
            app.db.session.rollback()
            return {'error': 'Error deleting user'}, 400
        

@user_ns.route('/update_user')
class UpdateUser(Resource):
    @user_ns.expect(update_user_model)
    @user_ns.response(200, 'User updated successfully')
    @user_ns.response(400, 'Bad Request')
    @user_ns.response(401, 'Unauthorized')
    @user_ns.response(403, 'Forbidden')
    @user_ns.doc(security='Bearer')
    def put(self):
        """Update user information"""
        user_data = request.get_json()

        # Extract JWT from Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"error": "Missing or invalid Authorization header"}, 401

        # Extract the token (removing "Bearer " prefix)
        token = auth_header.split(" ")[1]

        name = user_data.get('name')
        surname = user_data.get('surname')
        new_email = user_data.get('new_email')
        gender = user_data.get('gender')
        date_of_birth = user_data.get('date_of_birth')

        new_password = user_data.get('new_password')
        confirm_password = user_data.get('confirm_password')
        current_password = user_data.get('current_password')

        decoded_user_id = decode_jwt(token)

        if decoded_user_id is None:
            return {'error': 'Invalid or expired token'}, 401

        user_query = text("""
            SELECT password_hash, email FROM users WHERE id = :user_id
        """)
        user_result = app.db.session.execute(user_query, {'user_id': decoded_user_id}).fetchone()

        if not user_result:
            return {'error': 'User not found'}, 404

        stored_password_hash, current_email = user_result

        # validate date of birth
        date_of_birth_string = date_of_birth
        if date_of_birth:
            try:
                date_of_birth = datetime.strptime(date_of_birth, '%Y-%m-%d')

                # Vallidate age from date of birth
                calculated_age = datetime.now().year - date_of_birth.year
                if calculated_age < 1 or calculated_age > 130:
                    return {'error': 'Invalid date of birth. Age must be between 1 and 130 years'}, 400
                
            except ValueError:
                return {'error': 'Invalid date of birth. Must be in the format YYYY-MM-DD'}, 400

        allowed_genders = {'male', 'female', 'other', None}
        if gender:
            gender = gender.lower().strip()
            if gender not in allowed_genders:
                return {'error': 'Invalid gender. Must be "male", "female", "other", or null.'}, 400

        if new_email and new_email != current_email:
            try:
                validate_email(new_email)
            except ValueError as e:
                return {'error': str(e)}, 400

            email_check_query = text("""
                SELECT 1 FROM users WHERE email = :new_email
            """)
            email_check_result = app.db.session.execute(email_check_query, {'new_email': new_email}).scalar()
            if email_check_result:
                return {'error': 'Email is already in use'}, 400

        password_hash = None
        if new_password or confirm_password:
            if not current_password:
                return {'error': 'Current password is required to change password'}, 400

            if not bcrypt.checkpw(current_password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                return {'error': 'Incorrect current password'}, 401

            if new_password != confirm_password:
                return {'error': 'New passwords do not match'}, 400
            if not is_strong_password(new_password):
                return {'error': 'New password is not strong enough'}, 400

            password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        if not any([name, surname, new_email, password_hash, date_of_birth_string, gender]):
            return {'error': 'No updates provided'}, 400

        try:
            query = text("""
                SELECT update_user(:user_id, :name, :surname, :new_email, :password_hash, :date_of_birth, :gender);
            """)
            app.db.session.execute(query, {
                'user_id': decoded_user_id,
                'name': name,
                'surname': surname,
                'new_email': new_email.lower().strip() if new_email else None,
                'password_hash': password_hash,
                'date_of_birth': date_of_birth_string,
                'gender': gender.lower().strip() if gender else None
            })

            app.db.session.commit()
            return {'message': 'User updated successfully'}, 200

        except Exception as e:
            app.db.session.rollback()
            return {'error': str(e)}, 400
