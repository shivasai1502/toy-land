import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Cart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/cart/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
    updateQuantity(itemId, quantity);
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item._id));
    navigate('/checkout', { state: { selectedItems: selectedCartItems } });
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.delete('http://localhost:5000/api/cart/delete', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: {
          product_ids: selectedItems,
        },
      });
      setCartItems((prevItems) => prevItems.filter((item) => !selectedItems.includes(item._id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting items from cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.put(
        'http://localhost:5000/api/cart/update',
        {
          product_id: itemId,
          quantity: quantity,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  return (
    <div className="cart-page">
      <h2>Items in Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-checkbox">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                />
              </div>
              <div className="cart-item-image">
                <img
                  src={`http://localhost:5000/api/products/images/${item.image_id}`}
                  alt={item.name}
                />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">Price: ${item.price}</div>
              </div>
              <div className="cart-item-quantity">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                <span className="cart-item-total">Total: ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <div className="total-amount">
              <span>Total Amount: ${calculateTotal()}</span>
            </div>
            <div className="cart-actions">
              <button className="delete-button" onClick={handleDelete} disabled={selectedItems.length === 0}>
                Delete
              </button>
              <button className="checkout-button" onClick={handleCheckout} disabled={selectedItems.length === 0}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;