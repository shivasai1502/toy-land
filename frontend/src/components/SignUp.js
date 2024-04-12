import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignInUp.css";

function SignUpForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    successMessage: "",
    errorMessage: "",
  });

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
    // Add your password validation logic here
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!validateName(formData.first_name) || !validateName(formData.last_name)) {
      setFormData({ ...formData, errorMessage: "Names must contain only alphabets" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormData({ ...formData, errorMessage: "Invalid email address" });
      return;
    }

    if (!validatePassword(formData.password)) {
      setFormData({ ...formData, errorMessage: "Password must be at least 8 characters long" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          registration: true,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data);
        setFormData({
          ...formData,
          successMessage: "User registered successfully",
          errorMessage: "",
        });
        setTimeout(() => {
          setFormData({
            ...formData,
            successMessage: "",
            errorMessage: "",
          });
          navigate("/");
        }, 1000);
      } else {
        console.error("Error registering user:", response.status);
        setFormData({ ...formData, errorMessage: "Error registering user" });
      }
    } catch (error) {
      console.error("Error:", error);
      setFormData({ ...formData, errorMessage: "An error occurred. Please try again later." });
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