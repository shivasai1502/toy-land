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
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      console.log(response.data.token);
      navigate('/home');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleLogin}>
        <h1>Sign In</h1>
        <span>Use your email for SignIn</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange= {(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange= {(e) => setPassword(e.target.value)}
          required
        />
        <a href="/forget-password">Forgot your password?</a>
        <button type="submit">Sign In</button>
        {error && (
          <div className="error-message">{error}</div>
        )}
      </form>
    </div>
  );
}

export default SignInForm;