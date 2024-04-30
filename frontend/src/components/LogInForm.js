import React, { useState } from 'react';
import '../css/SignInUp.css';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

export default function Login() {
  const [type, setType] = useState('signIn');

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };

  const containerClass =
    'container ' + (type === 'signUp' ? 'right-panel-active' : '');

  return (
    <div className="Login">
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="overlay-title">Welcome Back!</h1>
              <p className="overlay-description">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost overlay-button"
                id="signIn"
                onClick={() => handleOnClick('signIn')}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="overlay-title">Hello, Friend!</h1>
              <p className="overlay-description">
                Enter your personal details and start journey with us
              </p>
              <button
                className="ghost overlay-button"
                id="signUp"
                onClick={() => handleOnClick('signUp')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}