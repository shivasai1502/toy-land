import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './components/LogInForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryProducts from './components/CategoryProducts';
import ViewAll from './components/viewAll';
import Home from './pages/Home';

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
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/view-all-products" element={<ViewAll />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;