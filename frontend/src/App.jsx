import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import RoleSelector from './pages/roleSelector/roleSelector'

import Home from './pages/homepage/homepage'
import Owner from './pages/owner/owner';
import Admin from './pages/admin/admin';
import CartPage from './pages/cart/cart'
import ProductDetails from './pages/productDetails'; // 💡 Import the new page

import './app.css'


const App = () => {

  // const [userId, setUserId] = useState(null);


  return (
    <div className="app">
      
      <Router>
        {/* <Navigation /> */}
        <Routes>
          {/* Define the routes */}

          {/* <Route path="/admin" element={<Admin />} /> */}
          {/* <Route path="/owner" element={<Owner />} /> */}


          <Route path="/home" element={<Home />} /> 
          <Route path="/admin" element={<Admin />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/cart/:userId" element={<CartPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} /> {/* 💡 Add route for product details */}




          {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}






          <Route path="/" element={<RoleSelector />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App  