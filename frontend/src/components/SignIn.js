import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../css/SignInUp.css';

function SignInForm() {
  const [formData, setFormData] = useState({ email: '', password: '', errorMessage: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/home');
    } catch (error) {
      setFormData({ ...formData, errorMessage: error.message });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <span>Use your email for SignIn</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <a href="/forget-password">Forgot your password?</a>
        <button type="submit">Sign In</button>
        {formData.errorMessage && (
          <div className="error-message">{formData.errorMessage}</div>
        )}
      </form>
    </div>
  );
}

export default SignInForm;