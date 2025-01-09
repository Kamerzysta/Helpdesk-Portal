# Flask SQLAlchemy Configuration
# Filename: flask_sqlalchemy_setup.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import app
import os


class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///helpdesk.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Configure the SQLAlchemy connection for MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = Config.SQLALCHEMY_TRACK_MODIFICATIONS

db = SQLAlchemy(app)

# Initialize the database
def setup_database():
    with app.app_context():
        db.create_all()
        print("Database tables created.")
    return db

if __name__ == '__main__':
    setup_database()
    app.run(debug=True)

