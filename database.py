# Flask SQLAlchemy Configuration
# Filename: flask_sqlalchemy_setup.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from database import Database
import os


app = Flask(__name__)

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///helpdesk.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
# Configure the SQLAlchemy connection for MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/helpdesk_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Initialize the database
def setup_database():
    with app.app_context():
        db.create_all()
        print("Database tables created.")

if __name__ == '__main__':
    setup_database()
    app.run(debug=True)
