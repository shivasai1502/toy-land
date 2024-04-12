import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/SignInUp.css';

function SignUpForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    successMessage: '',
    errorMessage: '',
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateName(formData.first_name) || !validateName(formData.last_name)) {
        throw new Error('Names must contain only alphabets');
      }
      if (!validateEmail(formData.email)) {
        throw new Error('Invalid email address');
      }
      if (!validatePassword(formData.password)) {
        throw new Error('Password must be at least 8 characters long');
      }
      await register(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.password
      );
      setFormData({
        ...formData,
        successMessage: 'User registered successfully',
        errorMessage: '',
      });
      setTimeout(() => {
        setFormData({
          ...formData,
          successMessage: '',
          errorMessage: '',
        });
        navigate('/home');
      }, 1000);
    } catch (error) {
      setFormData({ ...formData, errorMessage: error.message });
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <span>use your email for registration</span>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
        {formData.successMessage && (
          <div className="success-message">{formData.successMessage}</div>
        )}
        {formData.errorMessage && (
          <div className="error-message">{formData.errorMessage}</div>
        )}
      </form>
    </div>
  );
}

export default SignUpForm;