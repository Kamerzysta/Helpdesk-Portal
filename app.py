from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load configuration for SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///helpdesk.db'  # Use SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models
class User(db.Model):
    """User model with unique username and email."""
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    tickets = db.relationship('Ticket', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Ticket(db.Model):
    """Ticket model."""
    __tablename__ = 'ticket'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Open')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Ticket {self.title}>'

# Initialize the database
def setup_database():
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
        print("Database tables created.")

# Call the setup function before running the app
setup_database()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.all()
    return jsonify([{
        'id': ticket.id,
        'title': ticket.title,
        'description': ticket.description,
        'status': ticket.status,
        'user_id': ticket.user_id
    } for ticket in tickets])

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    user_id = data.get('user_id')

    if not all([title, description, user_id]):
        return jsonify({'error': 'Missing data'}), 400

    new_ticket = Ticket(title=title, description=description, user_id=user_id)
    db.session.add(new_ticket)
    try:
        db.session.commit()
        print(f"Ticket created: {new_ticket.id}")  # Log the created ticket ID
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create ticket'}), 500

    return jsonify({'message': 'Ticket created successfully'}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email
    } for user in users])

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    if not all([username, email]):
        return jsonify({'error': 'Missing data'}), 400

    new_user = User(username=username, email=email)
    db.session.add(new_user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/tickets/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if ticket is None:
        return jsonify({'error': 'Ticket not found'}), 404

    db.session.delete(ticket)
    db.session.commit()
    return jsonify({'message': 'Ticket deleted successfully'}), 200

@app.route('/api/tickets/<int:ticket_id>', methods=['PUT'])
def update_ticket_status(ticket_id):
    data = request.get_json()
    new_status = data.get('status')

    ticket = Ticket.query.get(ticket_id)
    if ticket is None:
        return jsonify({'error': 'Ticket not found'}), 404

    ticket.status = new_status
    db.session.commit()
    return jsonify({'message': 'Ticket status updated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
