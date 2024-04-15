from flask import Blueprint, request, jsonify
from database import db
from auth_utils import token_required
from bson import ObjectId

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('/insert', methods=['POST'])
@token_required
def add_to_wishlist(current_user):
    data = request.json
    product_id = data['product_id']

    wishlist = db.wishlist.find_one({'user_id': current_user['_id']})

    if wishlist:
        # If wishlist exists, add the product to the existing wishlist
        db.wishlist.update_one(
            {'_id': wishlist['_id']},
            {'$push': {'products': ObjectId(product_id)}}
        )
    else:
        # If wishlist doesn't exist, create a new wishlist with the product
        new_wishlist = {
            'user_id': current_user['_id'],
            'products': [ObjectId(product_id)]
        }
        db.wishlist.insert_one(new_wishlist)

    return jsonify({'message': 'Product added to wishlist successfully'})

@wishlist_bp.route('/delete', methods=['DELETE'])
@token_required
def remove_from_wishlist(current_user):
    data = request.json
    product_id = data['product_id']

    wishlist = db.wishlist.find_one({'user_id': current_user['_id']})

    if wishlist:
        # Remove the product from the wishlist
        db.wishlist.update_one(
            {'_id': wishlist['_id']},
            {'$pull': {'products': ObjectId(product_id)}}
        )
        return jsonify({'message': 'Product removed from wishlist successfully'})
    else:
        return jsonify({'error': 'Wishlist not found'}), 404

@wishlist_bp.route('/', methods=['GET'])
@token_required
def get_wishlist_products(current_user):
    wishlist = db.wishlist.find_one({'user_id': current_user['_id']})

    if wishlist:
        products = list(db.products.find({'_id': {'$in': wishlist['products']}}))
        return jsonify(products)
    else:
        return jsonify({'error': 'Wishlist not found'}), 404