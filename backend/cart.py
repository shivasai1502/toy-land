from flask import Blueprint, request, jsonify
from database import db
from auth_utils import token_required
from bson import ObjectId

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/insert', methods=['POST'])
@token_required
def add_to_cart(current_user):
    data = request.json
    product_id = data['product_id']

    cart = db.cart.find_one({'user_id': current_user['_id']})

    if cart:
        # If cart exists, add the product to the existing cart
        db.cart.update_one(
            {'_id': cart['_id']},
            {'$push': {'products': ObjectId(product_id)}}
        )
    else:
        # If cart doesn't exist, create a new cart with the product
        new_cart = {
            'user_id': current_user['_id'],
            'products': [ObjectId(product_id)]
        }
        db.cart.insert_one(new_cart)

    return jsonify({'message': 'Product added to cart successfully'})

@cart_bp.route('/delete', methods=['DELETE'])
@token_required
def remove_from_cart(current_user):
    data = request.json
    product_id = data['product_id']

    cart = db.cart.find_one({'user_id': current_user['_id']})

    if cart:
        # Remove the product from the cart
        db.cart.update_one(
            {'_id': cart['_id']},
            {'$pull': {'products': ObjectId(product_id)}}
        )
        return jsonify({'message': 'Product removed from cart successfully'})
    else:
        return jsonify({'error': 'Cart not found'}), 404

@cart_bp.route('/all', methods=['GET'])
@token_required
def get_cart_products(current_user):
    cart = db.cart.find_one({'user_id': current_user['_id']})

    if cart:
        products = list(db.products.find({'_id': {'$in': cart['products']}}))
        return jsonify(products)
    else:
        return jsonify({'error': 'Cart not found'}), 404