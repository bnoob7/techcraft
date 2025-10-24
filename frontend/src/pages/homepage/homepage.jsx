import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/header"; 
import Footer from "../../components/footer/footer";
import SearchBar from "../../components/searchBar/searchBar";
import "./homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // State to manage the quantity

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
        const userId = decodedToken.id; // Extract user ID
  
        // Store userId in localStorage if not already set
        if (!localStorage.getItem("user_id")) {
          localStorage.setItem("user_id", userId);
        }

        axios
          .get(`http://localhost:5000/customers/${userId}`)
          .then((response) => {
            setUserName(response.data.name); // Set user name from response
          })
          .catch((error) => {
            console.error("Error fetching customer details:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error decoding token:", error);
        setLoading(false);
      }
    } else {
      console.error("Token not found!");
      setLoading(false);
    }
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.id;

    try {
      const response = await axios.post("http://localhost:5000/cart/add", {
        user_id: userId,
        product_id: productId,
        quantity: quantity, // Pass the quantity
      });

      console.log("Add to Cart Response:", response); // Log the full response for debugging

      if (response.status === 200 && response.data.message === "Item added to cart successfully!") {
        alert(response.data.message); // Show success message
        // Navigate to the cart page
        navigate(`/cart/${userId}`);
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  // Handle quantity increment and decrement
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  if (loading) return <p>Loading...</p>;

  // Retrieve userId from localStorage
  const userId = localStorage.getItem("user_id");
  console.log("UserId from localStorage:", userId); // Debugging the userId value

  return (
    <div className="head-container">
      <div className="">
        <p>Welcome, {userName}!</p>
        <p>Welcome, UserId: {userId}</p> {/* Show the userId for debugging */}
      </div>
      {/* Pass the userId to Header as a prop */}
      <Header userId={userId} />
      <div className="hero">
        <div className="laptop">
          <div className="search-bar">
            <SearchBar setSearchResults={setSearchResults} />
          </div>
        </div>
      </div>

      <div className="search-results">
        {searchResults.length > 0 ? (
          <div className="cart-container">
            {searchResults.map((item) => (
              <div className="cart-item" key={item.product_id}>
                <img
                  src={`http://localhost:5000/${item.photo.replace(/\\/g, "/")}`}
                  alt={item.product_name}
                  className="cart-image"
                />
                <div className="content">
                  <h3>{item.product_name}</h3>
                  <p>{item.description}</p>
                  <p className="price">${item.price}</p>
                  
                  {/* Quantity Selector */}
                  <div className="quantity-selector">
                    <button onClick={decreaseQuantity}>-</button>
                    <span>{quantity}</span>
                    <button onClick={increaseQuantity}>+</button>
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => handleAddToCart(item.product_id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
