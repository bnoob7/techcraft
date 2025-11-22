import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./loginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/customers/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data; // Ensure your backend returns a JWT token
        
        // Decode the JWT token to extract the user_id
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
        const userId = decodedToken.id; // Extract user ID from decoded token

        // Store the token and user_id in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", userId); // Save user_id

        navigate("/home"); // Redirect to customer homepage
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Invalid email or password");
    }
  };

  return (
      
      <>
      <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="btn-primary" type="submit">
          Login
        </button>
      </form>
      </>
  );
};

export default LoginForm;
