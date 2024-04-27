import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CustomerOrders.css';

const CustomerOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/orders/customer', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const cancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.put(
                `http://localhost:5000/api/orders/${orderId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { refundMessage } = response.data;
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, deliveryStatus: 'Cancelled', refundMessage }
                        : order
                )
            );
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const formatCost = (cost) => {
        return cost.toFixed(2);
    };

    return (
        <div className="customer-order-container">
            <h2>Orders</h2>
            <p className='note'>Note: Returns are not possible once Items are Delivered.</p>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Cost</th>
                            <th>Delivery Status</th>
                            <th>Order Date</th>
                            <th>Delivery Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id.slice(-5)}</td>
                                <td>
                                    {order.items.map((item, index) => (
                                        <p key={item.product_id}>
                                            {index + 1}. {item.name} <span className="quantity">x {item.quantity}</span>
                                        </p>
                                    ))}
                                </td>
                                <td>${formatCost(order.cost)}</td>
                                <td>{order.deliveryStatus}</td>
                                <td>{order.orderTime}</td>
                                <td>{order.deliveryTime}</td>
                                <td>
                                    {order.cancellationEligible && order.deliveryStatus !== 'Cancelled' && (
                                        <button onClick={() => cancelOrder(order._id)}>Cancel Order</button>
                                    )}
                                    {!order.cancellationEligible && order.deliveryStatus !== 'Cancelled' && (
                                        <p>Cancellation not possible.</p>
                                    )}
                                    {order.deliveryStatus === 'Cancelled' && order.refundMessage && (
                                        <p>{order.refundMessage}</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CustomerOrder;