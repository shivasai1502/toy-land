import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignInUp.css";

function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    successMessage: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          login: true,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data); // Log the server's response
        setFormData({ ...formData, successMessage: "Login successful" });
        setTimeout(() => {
          setFormData({ ...formData, successMessage: "" });
          navigate("/");
        }, 1000);
      } else {
        setFormData({ ...formData, successMessage: "Invalid email or password" });
        console.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <span>use your email for SignIn</span>
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
        {formData.successMessage && (
          <div className="success-message">{formData.successMessage}</div>
        )}
      </form>
    </div>
  );
}

export default SignInForm;