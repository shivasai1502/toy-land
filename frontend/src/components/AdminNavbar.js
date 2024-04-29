import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import ToyLogo from '../toy_images/toy-land-logo1.png';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/home');
  };

  return (
    <nav className="navbar">
      <Link to="/admin/home">
        <img src={ToyLogo} alt="Company Logo" />
      </Link>
      <ul>
        {token ? (
          <>
            <li>
              <Link to="/admin/categories">Categories</Link>
            </li>
            <li>
              <Link to="/admin/products">Products</Link>
            </li>
            <li>
              <Link to="/admin/orders">Orders</Link>
            </li>
            <li>
              <a href="/admin/login" onClick={handleLogout}>
                SignOut
              </a> 
            </li>
          </>
        ) : (
          <li>
            <Link to="/admin/login">SignIn</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default AdminNavbar;