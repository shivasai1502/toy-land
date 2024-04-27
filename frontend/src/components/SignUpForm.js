import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/SignInUp.css';

const SignUpForm = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!validateName(firstname) || !validateName(lastname)) {
      setError("Names must contain only alphabets");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        firstname,
        lastname,
        email,
        password,
      });
      setError("User Registered Successfully");
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleRegistration}>
        <h1>Create Account</h1>
        <span>use your email for registration</span>
        <input
          type="text"
          name="first_name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="last_name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="confirm_password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Sign Up</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default SignUpForm;