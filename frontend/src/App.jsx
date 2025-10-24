import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import RoleSelector from './pages/roleSelector/roleSelector'

import Home from './pages/homepage/homepage'
import OwnerHome from './pages/owner/owner';
import AdminHome from './pages/admin/admin';
import CartPage from './pages/cart/cart'

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
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/owner-home" element={<OwnerHome />} />
          <Route path="/cart/:userId" element={<CartPage />} />




          {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}






          <Route path="/" element={<RoleSelector />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App  