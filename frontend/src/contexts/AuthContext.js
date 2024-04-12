import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, login: true }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Login successful') {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          // Handle login error
          console.error('Error logging in:', data.error);
        }
      } else {
        // Handle login error
        const error = await response.text();
        console.error('Error logging in:', error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const register = async (
    firstName,
    lastName,
    email,
    password,
    successCallback,
    errorCallback
  ) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          registration: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);
        setIsAuthenticated(true); // Set isAuthenticated to true after successful registration
        setUser(data.user);
        successCallback();
      } else {
        const error = await response.text();
        console.error('Error registering user:', error);
        errorCallback(error);
      }
    } catch (error) {
      console.error('Error:', error);
      errorCallback('An error occurred. Please try again later.');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};