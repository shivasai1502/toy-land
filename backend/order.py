from datetime import datetime
from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_mail import Message
from database import db
from auth_utils import token_required
from werkzeug.security import generate_password_hash

order_bp = Blueprint('orders', __name__)

@order_bp.route('/payments', methods=['GET'])
@token_required
def get_saved_payment_methods(user):
    email = user['email']
    saved_payments = db.payments.find({'email': email})
    payment_methods = []
    for payment in saved_payments:
        payment_method = {
            '_id': str(payment['_id']),
            'cardholderName': payment.get('cardholderName', ''),
            'cardNumber': payment['cardNumber'],
            'expiryDate': payment['expiryDate'],
            'paymentMethodName': payment.get('paymentMethodName', '')
        }
        payment_methods.append(payment_method)
    return jsonify(payment_methods), 200

@order_bp.route('/place', methods=['POST'])
@token_required
def place_order(user):
    order_data = request.json
    items = order_data.get('items')
    cost = order_data.get('cost')
    tax_rate = order_data.get('taxRate')
    discount = order_data.get('discount')
    card_details = order_data.get('cardDetails')
    email = user['email']
    address = order_data.get('address')
    delivery_status = order_data.get('deliveryStatus')
    refund_message = order_data.get('refundMessage') if order_data.get('refundMessage') else None
    
    if not items or not cost or not email or not address:
        return jsonify({'error': 'Required fields are missing'}), 400

    payment_id = None
    if card_details:
        # Check if the card number already exists in the payments collection
        cn = card_details.get('cardNumber')
        existing_payment = db.payments.find_one({'cardNumber': cn, 'email': email})
        if existing_payment:
            payment_id = str(existing_payment['_id'])
        else:
            # Hash the CVV using a secure hashing algorithm
            hashed_cvv = generate_password_hash(card_details.get('cvv'))
            # Save card details in the payments collection
            payment = {
                'cardholderName': card_details.get('cardholderName', ''),
                'cardNumber': card_details.get('cardNumber'),
                'expiryDate': card_details.get('expiryDate'),
                'cvv': hashed_cvv,
                'email': email,
                'paymentMethodName': card_details.get('paymentMethodName', '')
            }
            payment_result = db.payments.insert_one(payment)
            payment_id = str(payment_result.inserted_id)

    # Get the current timestamp
    order_time = datetime.now()
    delivery_time = None

    # Create the order object
    order = {
        'userId': user['_id'],
        'items': items,
        'cost': cost,
        'taxRate': tax_rate,
        'discount': discount,
        'paymentId': payment_id,
        'email': email,
        'address': address,
        'deliveryStatus': delivery_status,
        'orderTime': order_time,
        'refundMessage': refund_message,
        'deliveryTime': delivery_time
    }

    # Save the order in the orders collection
    order_result = db.orders.insert_one(order)
    order_id = str(order_result.inserted_id)

    return jsonify({'orderId': order_id}), 201

@order_bp.route('/customer', methods=['GET'])
@token_required
def get_customer_orders(user):
    user_id = user['_id']
    orders = db.orders.find({'userId': user_id}).sort('orderTime', -1)
    
    customer_orders = []
    for order in orders:
        order_items = []
        for item in order['items']:
            product = db.products.find_one({'_id': ObjectId(item['_id'])})
            order_item = {
                'product_id': str(item['_id']),
                'name': product['name'],
                'quantity': item['quantity']
            }
            order_items.append(order_item)
        
        # Calculate the number of days between the current date and the delivery date
        delivery_time = order['deliveryTime']
        cancellation_eligible = False
        if order['deliveryStatus'] == 'Delivered' and delivery_time:
            current_time = datetime.now()
            time_diff = current_time - delivery_time
            days_diff = time_diff.days
            cancellation_eligible = days_diff <= 5
        else:
            cancellation_eligible = order['deliveryStatus'] != 'Delivered'
        
        customer_order = {
            '_id': str(order['_id']),
            'items': order_items,
            'cost': order['cost'],
            'deliveryStatus': order['deliveryStatus'],
            'orderTime': order['orderTime'].strftime('%Y-%m-%d %H:%M:%S'),
            'cancellationEligible': cancellation_eligible,
            'refundMessage': order.get('refundMessage', ''),
            'deliveryTime': delivery_time.strftime('%Y-%m-%d %H:%M:%S') if delivery_time else "Not yet delivered"
        }
        customer_orders.append(customer_order)
    
    return jsonify(customer_orders), 200

@order_bp.route('/<order_id>/cancel', methods=['PUT'])
@token_required
def cancel_order(user, order_id):
    user_id = user['_id']
    order = db.orders.find_one({'_id': ObjectId(order_id), 'userId': user_id})
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    if order['deliveryStatus'] == 'Cancelled':
        return jsonify({'error': 'Order is already cancelled'}), 400
    
    refund_amount = order['cost']
    refund_message = f"Refund of ${refund_amount} issued to your bank account."
    
    db.orders.update_one(
        {'_id': ObjectId(order_id)},
        {'$set': {
            'deliveryStatus': 'Cancelled',
            'refundMessage': refund_message
        }}
    )
    
    return jsonify({'message': 'Order cancelled successfully', 'refundMessage': refund_message}), 200