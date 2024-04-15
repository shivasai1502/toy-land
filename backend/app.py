from flask import Flask
from flask_cors import CORS
from routes import auth_routes
from products import products_bp
from cart import cart_bp
from wishlist import wishlist_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(cart_bp, url_prefix='/api/cart')
app.register_blueprint(wishlist_bp, url_prefix='/api/wishlist')


if __name__ == '__main__':
    app.run(debug=True)