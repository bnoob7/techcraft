import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the hook

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    try {
      // Send the login request
      const response = await axios.post('http://localhost:5000/admin/login', { email, password });

      console.log(response); // Log the response to see what's being returned

      if (response.status === 200) {
        // Check if the response status is 200
        navigate('/admin-home'); // Redirect to Admin page
      } else {
        // If response status is not 200, set an error message
        setError('Login failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className='btn btn-primary' type="submit">Login</button>
    </form>
  );
};

export default AdminLoginForm;
