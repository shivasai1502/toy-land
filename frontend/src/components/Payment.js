import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCardDetails, setSaveCardDetails] = useState(false);
  const [paymentMethodName, setPaymentMethodName] = useState('');
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [useExistingPayment, setUseExistingPayment] = useState(false);

  const {
    selectedItems,
    phoneNumber,
    address,
    totalCost,
  } = location.state;

  const fetchSavedPaymentMethods = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/orders/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching saved payment methods:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchSavedPaymentMethods();
  }, [fetchSavedPaymentMethods]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardholderNameChange = (e) => {
    setCardholderName(e.target.value);
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    setExpiryDate(formattedValue);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.slice(0, 3));
  };

  const isCardDetailsValid = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const [expiryMonth, expiryYear] = expiryDate.split('/');

    if (
      !cardholderName ||
      cardNumber.length !== 16 ||
      cvv.length !== 3 ||
      !expiryMonth ||
      !expiryYear ||
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  const placeOrder = async () => {
    if (useExistingPayment) {
      if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
      }
    } else {
      if (!isCardDetailsValid()) {
        alert('Please enter valid card details.');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const orderData = {
        items: selectedItems,
        cost: totalCost,
        taxRate: location.state.taxRate,
        discount: location.state.discount,
        cardDetails: useExistingPayment
          ? null
          : saveCardDetails
          ? {
              cardholderName,
              cardNumber,
              expiryDate,
              cvv,
              paymentMethodName,
            }
          : null,
        phoneNumber,
        address,
        deliveryStatus: 'Pending',
      };

      await axios.post('http://localhost:5000/api/orders/place', orderData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Delete selected items from the cart
      const selectedProductIds = selectedItems.map((item) => item._id);
      await axios.delete('http://localhost:5000/api/cart/delete', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: {
          product_ids: selectedProductIds,
        },
      });

      alert('Order placed successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Total Cost: ${totalCost.toFixed(2)}</p>
        <p>Number of Items: {selectedItems.length}</p>
      </div>
      <div className="payment-method">
        <h3>Payment Method</h3>
        {savedPaymentMethods.length > 0 && (
          <div className="saved-payment-methods">
            <label>
              <input
                type="checkbox"
                checked={useExistingPayment}
                onChange={(e) => setUseExistingPayment(e.target.checked)}
              />
              Use existing payment method
            </label>
            {useExistingPayment && (
              <select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <option value="">Select a payment method</option>
                {savedPaymentMethods.map((method) => (
                  <option key={method._id} value={method._id}>
                    {method.paymentMethodName}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        {!useExistingPayment && (
          <>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={handlePaymentMethodChange}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="debit-card"
                  checked={paymentMethod === 'debit-card'}
                  onChange={handlePaymentMethodChange}
                />
                Debit Card
              </label>
            </div>
            {(paymentMethod === 'credit-card' ||
              paymentMethod === 'debit-card') && (
              <div className="card-details">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardholderName}
                  onChange={handleCardholderNameChange}
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={16}
                />
                <input
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                />
                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={handleCvvChange}
                  maxLength={3}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={saveCardDetails}
                    onChange={(e) => setSaveCardDetails(e.target.checked)}
                  />
                  Save card details
                </label>
                {saveCardDetails && (
                  <input
                    type="text"
                    placeholder="Payment Method Name"
                    value={paymentMethodName}
                    onChange={(e) => setPaymentMethodName(e.target.value)}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
      <button className="button-payment" onClick={placeOrder}>
        Pay
      </button>
    </div>
  );
};

export default Payment;