import React, { useState } from "react";
import "./header.css";
import Logo from "../../../public/logo/logo.svg";
import { FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 💡 Import the useAuth hook

const Header = ({ cart, onLogout }) => {
  const [menu, setMenu] = useState("menu");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: authLogout } = useAuth(); // 💡 Get user and logout from context

  // Check if the user is navigating admin/owner pages
  const isAdminOrOwner = location.pathname === "/admin" || location.pathname === "/owner";

  // 💡 The user object from context is now the source of truth
  const isLoggedIn = !!user;

  // Handle cart button click using the user from context
  const handleCartClick = () => {
    if (user && user.id) {
      navigate(`/cart/${user.id}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    authLogout(); // 💡 Call the logout function from context
    if (onLogout) onLogout(); // Call the passed onLogout function to clear cart state
    navigate('/'); // Redirect to home/login page
  };

  const handleNavigation = (page) => {
    setMenu(page);
    if (page === "Home") {
      if (location.pathname === "/admin") {
        navigate("/admin");
      } else if (location.pathname === "/owner-home") {
        navigate("/owner-home");
      } else {
        navigate("/home");
      }
    } else if (page === "About-Us") {
      navigate("/about-us");
    } else if (page === "Contact-Us") {
      navigate("/contact-us");
    }
  };

  return (
    <div className="container">
      <header>
        <a className="logo" href="#">
          <img src={Logo} alt="Logo" />
        </a>
        <div className="pages">
          <ul>
            <li
              onClick={() => handleNavigation("Home")}
              className={menu === "Home" ? "active" : ""}
            >
              Home
            </li>
            <li
              onClick={() => handleNavigation("About-Us")}
              className={menu === "About-Us" ? "active" : ""}
            >
              About-Us
            </li>
            <li
              onClick={() => handleNavigation("Contact-Us")}
              className={menu === "Contact-Us" ? "active" : ""}
            >
              Contact-Us
            </li>
          </ul>
        </div>
        <div className="link-wrapper">
          {/* Conditionally render based on login status and page */}
          {isLoggedIn && !isAdminOrOwner && (
            <>
              <button className="btn-text" onClick={handleCartClick}>
                <FaShoppingBag />
                {cart && cart.length > 0 && (
                  <div className="dot">{cart.length}</div>
                )}
              </button>
              <button className="btn-text" onClick={handleLogout} title="Logout">
                <FaSignOutAlt />
              </button>
            </>
          )}
          {!isLoggedIn && !isAdminOrOwner && (
             <button className="btn-primary" onClick={() => navigate('/')}>
                Login
             </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
