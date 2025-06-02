
from flask import Blueprint, request, jsonify
from database import get_user_orders, get_user_tickets, generate_ticket_pdf
from auth import verify_token

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders/user/<int:user_id>', methods=['GET'])
def get_user_orders_endpoint(user_id):
    """Get all orders and bookings for a specific user"""
    try:
        # Get the authorization token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization token required"}), 401
        
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        
        if "error" in payload:
            return jsonify(payload), 401
        
        # Check if the user is requesting their own orders or is an admin
        if payload.get("sub") != user_id and not payload.get("is_admin"):
            return jsonify({"error": "Access denied"}), 403
        
        # Get user orders and bookings
        result = get_user_orders(user_id)
        
        if "error" in result:
            return jsonify(result), 500
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in get_user_orders_endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

@orders_bp.route('/tickets/user/<int:user_id>', methods=['GET'])
def get_user_tickets_endpoint(user_id):
    """Get all tickets for a specific user"""
    try:
        # Get the authorization token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization token required"}), 401
        
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        
        if "error" in payload:
            return jsonify(payload), 401
        
        # Check if the user is requesting their own tickets or is an admin
        if payload.get("sub") != user_id and not payload.get("is_admin"):
            return jsonify({"error": "Access denied"}), 403
        
        # Get user tickets
        result = get_user_tickets(user_id)
        
        if "error" in result:
            return jsonify(result), 500
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in get_user_tickets_endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

@orders_bp.route('/tickets/generate/<int:booking_id>', methods=['GET'])
def generate_ticket_endpoint(booking_id):
    """Generate a PDF ticket for an exhibition booking"""
    try:
        # Get the authorization token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization token required"}), 401
        
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        
        if "error" in payload:
            return jsonify(payload), 401
        
        # Generate the ticket
        result = generate_ticket_pdf(booking_id)
        
        if "error" in result:
            return jsonify(result), 400
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in generate_ticket_endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500
