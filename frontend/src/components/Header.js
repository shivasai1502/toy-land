import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/Header.css';
import ToyLogo from '../toy_images/toy-land-logo.png';

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

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
        {isAuthenticated ? (
          <li className="dropdown">
            <Link>Account</Link>
            <div className="dropdown-content">
              <Link to="/profile">Profile</Link>
              <Link to="/purchase-history">Purchase History</Link>
              <a href="/" onClick={handleLogout}>Sign Out</a>
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

export default Header;