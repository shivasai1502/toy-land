import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/SignInUp.css';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      console.log(response.data.token);
      navigate('/home');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleLogin} className="signin-form">
        <h1 className="signin-title">Sign In</h1>
        <span className="signin-subtitle">Use your email for SignIn</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signin-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signin-input"
        />
        <a href="/forget-password" className="signin-forgot-password">
          Forgot your password?
        </a>
        <button type="submit" className="signin-button">
          Sign In
        </button>
        {error && <div className="signin-error-message">{error}</div>}
      </form>
    </div>
  );
};

export default SignInForm;