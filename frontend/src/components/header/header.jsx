import React, { useState } from "react";
import "./header.css";
import Logo from "../../../public/logo/logo.svg";
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ userId }) => {  // Receive userId as a prop
  const [menu, setMenu] = useState("menu");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is navigating admin/owner pages
  const isAdminOrOwner = location.pathname === "/admin" || location.pathname === "/owner";

  // Handle cart button click
  const handleCartClick = () => {
    if (userId) {
      navigate(`/cart/${userId}`);
    } else {
      console.error("User is not logged in, no userId found.");
      // Handle unlogged-in users, e.g., redirect to login page
      navigate("/login");
    }
  };

  const handleNavigation = (page) => {
    setMenu(page);
    if (page === "Home") {
      if (location.pathname === "/admin-home") {
        navigate("/admin-home");
      } else if (location.pathname === "/owner-home") {
        navigate("/owner-home");
      } else {
        navigate("/customer-home");
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
          {/* Display cart icon unless on admin or owner page */}
          {!isAdminOrOwner && (
            <button className="btn-text" onClick={handleCartClick}>
              <FaShoppingBag /> <div className="dot"></div>
              <span className="user-id">{userId}</span> {/* Display userId here */}
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
