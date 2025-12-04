import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./loginForm.css";
import { useAuth } from "../../context/AuthContext"; // 💡 1. Standardized Import Path

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // 💡 2. Get the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/customers/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // The backend should return the user object in response.data.user
        const { user } = response.data;
        
        if (user && user.id && user.name) {
          // 💡 3. Use the context's login function to set the user globally
          login(user);
          navigate("/home"); // Redirect to customer homepage
        } else {
          // This error occurs if the backend response is missing the user object.
          setError("Login successful, but user data is missing in the response.");
        }
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      // Provide more specific feedback from the backend if available
      setError(err.response?.data?.message || "Invalid email or password");
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
