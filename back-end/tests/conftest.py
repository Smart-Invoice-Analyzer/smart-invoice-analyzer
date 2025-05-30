import pytest
import sys
import os

# Ensure 'app' is in the system path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app  # Import the app instance
db = app.db  # Extract the database instance

@pytest.fixture(scope='module')
def test_client():
    """Set up test client and database"""
    app.config["TESTING"] = True

    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()
        yield testing_client  # Provide the test client

    # Teardown: Remove session and drop database
    with app.app_context():
        db.session.remove()
        db.drop_all()
