from io import BytesIO
import json
from bson import ObjectId
from flask import Blueprint, jsonify, send_file
from database import db
from gridfs import GridFS
from jsonencoder import JSONEncoder

category_bp = Blueprint('categories', __name__)
fs=GridFS(db)

@category_bp.route('/all', methods=['GET'])
def get_categories():
    categories = list(db.categories.find())
    for category in categories:
        category['_id'] = str(category['_id'])
        category['image_id'] = category['image_id']
    return json.dumps(categories, cls=JSONEncoder), 200


@category_bp.route('/images/<image_id>', methods=['GET'])
def get_image(image_id):
    try:
        image_file = fs.get(ObjectId(image_id))
        #print(f"Image file found: {image_file.filename}")
        #print(f"Image file length: {image_file.length}")
        return send_file(
            BytesIO(image_file.read()),
            mimetype='image/png',
            as_attachment=False
        )
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

def get_image_url(image_id):
    return f'images{image_id}'