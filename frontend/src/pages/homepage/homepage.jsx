import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/header"; 
import Footer from "../../components/footer/footer";
import SearchBar from "../../components/searchBar/searchBar";
import CategoryShop from "../../components/categoryShop/categoryShop";
import "./homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  // Handle category selection
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    try {
      const response = await axios.get("http://localhost:5000/products", {
        params: { category },
      });
      setCategoryResults(response.data);
      // Scroll to category results
      setTimeout(() => {
        document.querySelector(".category-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setCategoryResults([]);
    }
  };

  if (loading) return <p>Loading...</p>;

  // Retrieve userId from localStorage
  const userId = localStorage.getItem("user_id");
  console.log("UserId from localStorage:", userId); // Debugging the userId value

  return (
    <div className="head-container">
      {/* <div className="">
        <p>Welcome, {userName}!</p>
        <p>Welcome, UserId: {userId}</p>
      </div> */}
      {/* Pass the userId to Header as a prop */}
      <Header userId={userId} />
      <div className="hero">
        <div className="laptop">
          <div className="search-bar">
            <SearchBar setSearchResults={setSearchResults} />
          </div>
        </div>
      </div>

      {/* Category Shop Section */}
      <CategoryShop onCategorySelect={handleCategorySelect} />

      {/* Category Results Section */}
      {selectedCategory && (
        <div className="category-results">
          <div className="results-header">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedCategory} - {categoryResults.length} products found
            </h2>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCategoryResults([]);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear Filter
            </button>
          </div>
          
          {categoryResults.length > 0 ? (
            <div className="cart-container">
              {categoryResults.map((item) => (
                <div className="cart-item" key={item.product_id}>
                  <img
                    src={`http://localhost:5000/${item.photo.replace(/\\/g, "/")}`}
                    alt={item.product_name}
                    className="cart-image"
                  />
                  <div className="content">
                    <h3>{item.product_name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
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
            <p className="text-center text-gray-600 py-8">No products in this category</p>
          )}
        </div>
      )}

      {/* PC Build Suggestions Section */}
      {searchResults.length > 0 && searchResults[0].buildType && (
        <div className="pc-builds-section">
          <div className="results-header">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              🖥️ PC Build Suggestions
            </h2>
            <button
              onClick={() => setSearchResults([])}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear Results
            </button>
          </div>

          <div className="builds-grid">
            {searchResults.map((build, index) => (
              <div className="build-card" key={index}>
                <div className="build-header">
                  <h3 className="text-xl font-bold capitalize">
                    {build.buildType === "gpu-focused" && "🎮 Gaming Build"}
                    {build.buildType === "cpu-focused" && "💻 Workstation Build"}
                    {build.buildType === "high-end" && "⚡ High-End Build"}
                    {build.buildType === "balanced" && "⚙️ Balanced Build"}
                    {build.buildType === "budget" && "💰 Budget Build"}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    Rs {parseFloat(build.totalCost).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Remaining Budget: Rs {parseFloat(build.remainingBudget).toLocaleString()}
                  </p>
                </div>

                <div className="components-list">
                  {build.components.map((component) => (
                    <div className="component-item" key={component.product_id}>
                      <img
                        src={`http://localhost:5000/${component.photo.replace(/\\/g, "/")}`}
                        alt={component.product_name}
                        className="component-image"
                      />
                      <div className="component-info">
                        <p className="component-category capitalize">
                          {component.category}
                        </p>
                        <p className="component-name">{component.product_name}</p>
                        <p className="component-price">
                          Rs {parseFloat(component.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-primary add-build-to-cart"
                  onClick={() => {
                    // Add all components to cart
                    build.components.forEach((component) => {
                      handleAddToCart(component.product_id);
                    });
                  }}
                >
                  Add Entire Build to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Standard Search Results (existing code) */}
      <div className="search-results">
        {searchResults.length > 0 && !searchResults[0].buildType ? (
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
