import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import ToyLogo from '../toy_images/toy-land-logo1.png';

const categories = [
  { name: "Action Figures", link: "/action-figures" },
  { name: "Dolls", link: "/dolls" },
  { name: "Stuffed Animals", link: "/stuffed-animals" },
  { name: "Building Blocks and Construction", link: "/building-blocks-and-construction" },
  { name: "Sets", link: "/sets" },
  { name: "Puzzles", link: "/puzzles" },
  { name: "Board Games", link: "/board-games" },
  { name: "Card Games", link: "/card-games" },
  { name: "Educational Toys", link: "/educational-toys" },
  { name: "Arts and Crafts", link: "/arts-and-crafts" },
  { name: "Outdoor Toys", link: "/outdoor-toys" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/home');
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={ToyLogo} alt="Company Logo" />
      </Link>
      <ul>
        <li className="dropdown">
          <Link>Shop</Link>
          <div className="dropdown-content">
            {categories.map((category, index) => (
              <a
                key={index}
                href=""
                onClick={() => handleCategoryClick(category.link.slice(1))}
              >
                {category.name}
              </a>
            ))}
          </div>
        </li>
        <li>
          <Link to="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
        {token ? (
          <li className="dropdown">
            <Link>Account</Link>
            <div className="dropdown-content">
              <Link to="/profile">Profile</Link>
              <Link to="/purchase-history">Purchase History</Link>
              <a href="/login" onClick={handleLogout}>Sign Out</a>
            </div>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">SignIn/SignUp</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;