import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { IoIosAddCircle } from 'react-icons/io';
import { TiTick } from 'react-icons/ti';
import { MdCancel } from 'react-icons/md';
import '../css/AdminProduct.css';

const AdminProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [image, setImage] = useState(null);
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchCategories();
    }
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/category/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/admin/product/${productId}`);
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setAgeRange('');
    setImage(null);
    setStock('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('age_range', ageRange);
      if (image) {
        formData.append('image', image);
      }
      formData.append('stock', stock);

      await axios.post('http://localhost:5000/api/admin/product/insert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error adding product:', error);
      setError('An error occurred while adding the product');
    }
  };

  return (
    <div className="admin-product-container">
      <h2>Manage Products</h2>
      <button onClick={handleAddProduct}>
        <IoIosAddCircle /> Add New Product
      </button>
      {error && <p className="error-message">{error}</p>}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="admin-product-view-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.link}>
                  {cat.CategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ageRange">Age Range:</label>
            <input
              type="text"
              id="ageRange"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="submit">
              <TiTick /> Add Product
            </button>
            <button type="button" onClick={() => setShowAddForm(false)}>
              <MdCancel /> Cancel
            </button>
          </div>
        </form>
      )}
      <div className="admin-category-list">
        {categories.map((category) => (
          <div key={category._id} className="admin-category-item">
            <div
              className="admin-category-header"
              onClick={() => handleCategoryClick(category._id)}
            >
              <h3>{category.CategoryName}</h3>
              <span>{expandedCategory === category._id ? '-' : '+'}</span>
            </div>
            {expandedCategory === category._id && (
              <div className="admin-product-list">
                {category.products.map((product, index) => (
                  <div
                    key={product._id}
                    className="admin-product-item"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <span className="admin-product-number">{index + 1}.</span>
                    <p>{product.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProduct;