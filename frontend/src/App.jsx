import React from 'react'
import { Routes, Route } from 'react-router-dom'

import RoleSelector from './pages/roleSelector/roleSelector'
import Home from './pages/homepage/homepage'
import Owner from './pages/owner/owner';
import Admin from './pages/admin/admin';
import CartPage from './pages/cart/cart'
import ProductDetails from './pages/productDetails';

import './app.css'


const App = () => {

  // const [userId, setUserId] = useState(null);


  return (
    <div className="app">
      
      <Routes>
        {/* Define the routes */}
        <Route path="/home" element={<Home />} /> 
        <Route path="/admin" element={<Admin />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/cart/:userId" element={<CartPage />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        
        {/* The root path should be the last one to act as a catch-all for the entry page */}
        <Route path="/" element={<RoleSelector />} />
      </Routes>
    </div>
  )
}

export default App  