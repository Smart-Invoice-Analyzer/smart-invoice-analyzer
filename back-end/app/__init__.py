# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restx import Api  # Import Flask-RESTx for Swagger
from app.config import Config  # Import Config class
from flask_migrate import Migrate

# Create the Flask app instance
app = Flask(__name__)

@app.route('/')
def index():
    return 'Welcome to Smart Invoice Analyzer API!, to access the API documentation go to /docs/'

# Load configuration from config.py
app.config.from_object(Config)

# Initialize SQLAlchemy
app.db = SQLAlchemy(app)

# Initialize Flask-Migrate
migrate = Migrate(app, app.db)

# Enable CORS for all domains during development (optional)
CORS(app, supports_credentials=True)

# Initialize Flask-RESTx API (Swagger documentation)
api = Api(
    app,
    version='1.0',
    title='Smart Invoice Analyzer API',
    description='Here you can find the operations and the requests needed to execute them',
    doc='/docs/',  # path to Swagger UI
)


# Import and register blueprints (routes)
from app.user_routes import user_ns
from app.invoice_routes import invoice_ns
# from app.test_routes import test_ns

# Register namespaces with the API
api.add_namespace(user_ns, path='/users')
api.add_namespace(invoice_ns, path='/invoices')

