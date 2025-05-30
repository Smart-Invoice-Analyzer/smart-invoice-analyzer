# app/config.py
import os
from dotenv import load_dotenv

#load_dotenv()

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key")

    @staticmethod
    def get_database_url():
        url = os.getenv("DATABASE_URL", "postgresql://postgres:admin@localhost/postgres")
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    SQLALCHEMY_DATABASE_URI = get_database_url()
