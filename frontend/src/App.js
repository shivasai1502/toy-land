import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import CategoryProductsPage from './pages/CategoryProductsPage';
import ViewAllPage from './pages/viewAllPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import IndividualProductPage from './pages/IndividualProductPage';
import PaymentPage from './pages/PaymentPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import ForgetPasswordPage  from './pages/ForgetPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminHomePage from './pages/AdminHomePage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminHandleOrdersPage from './pages/AdminHandleOrdersPage';
import AdminProductViewPage from './pages/AdminProductViewPage';
import ViewOrderPage from './pages/ViewOrderPage';
import SignUpFormPage from './pages/SignUpFormPage';
import SignInFormPage from './pages/SignInFormPage';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/view-all-products" element={<ViewAllPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/view-individual-product/:productId" element={<IndividualProductPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/customer-orders" element={<CustomerOrdersPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/categories" element={<AdminCategoryPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminHandleOrdersPage />} />
        <Route path="/admin/product/:productId" element={<AdminProductViewPage />} />
        <Route path="/order/:orderId" element={<ViewOrderPage />} />
        <Route path="/signup" element={<SignUpFormPage />} />
        <Route path="/login" element={<SignInFormPage />} />
      </Routes>
    </div>
  );
};

export default App;