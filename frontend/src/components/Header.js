import React from 'react';
import '../css/Header.css';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <nav className="navbar">
      <a href="/"><img src={ToyLogo} alt="Company Logo" /></a>
      <ul>
        <li className="dropdown">
          <a href="/shop">Shop</a>
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
          <a href="/wishlist">Wishlist</a>
        </li>
        <li>
          <a href="/cart">Cart</a>
        </li>
        <li className="dropdown">
          <a href="/account">Account</a>
          <div className="dropdown-content">
            <a href="/profile">Profile</a>
            <a href="/purchase-history">Purchase History</a>
            <a href="/sign-out">Sign Out</a>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
