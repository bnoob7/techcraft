
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OwnerLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://localhost:5000/owner/login', { 
        email, 
        password 
      });
  
      if (response.status === 200) {
        const { owner_id } = response.data; // Ensure this matches the backend response
        // localStorage.setItem('owner_id', owner_id); // Save owner_id
        localStorage.setItem('token', response.data.token);

        navigate('/owner-home'); // Redirect to Owner page
      }
    } catch (err) {
      console.error("AxiosError:", err); // Log detailed error
      setError(err.response?.data?.message || 'Invalid email or password');
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

export default OwnerLoginForm;

