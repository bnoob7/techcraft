import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./cart.css";
import { useAuth } from "../../context/AuthContext"; // 💡 1. Import the useAuth hook

const Cart = () => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); // 💡 2. Get the currently logged-in user from context

  useEffect(() => {
    const userId = user?.id; // 💡 3. Use the user ID from the context

    if (userId) {
      axios
        .get(`http://localhost:5000/cart/${userId}`)
        .then((response) => {
          console.log("Received cart items for user:", userId, response.data);
          if (response.data.cart && typeof response.data.cart === "object") {
            setCartItems(response.data.cart);
          } else {
            console.error("Received data is not in the expected format:", response.data);
            setCartItems({});
          }
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
          setCartItems({});
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("User ID not found in localStorage");
      // If no user, redirect to home/login page
      navigate('/');
      setLoading(false);
    }
  }, [user, navigate]); // 💡 4. Re-run this effect if the user changes

  // handleBuy function to store the order in the database
  const handleBuy = (shopName) => {
    const userId = user?.id; // 💡 5. Use the user ID from context here as well
    if (!userId) return alert("You must be logged in to place an order.");
    const shopItems = cartItems[shopName];
  
    // Request the owner_id from the backend using shop_name from the products table
    axios
      .get(`http://localhost:5000/products/owner/${encodeURIComponent(shopName)}`)
      .then((response) => {
        const ownerId = response.data.owner_id;
  
        // Prepare the order data
        const orderData = {
          shop_name: shopName,
          customer_id: userId,   // User ID from localStorage
          owner_id: ownerId, // Owner ID fetched from the backend
          items: shopItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
  
        // Post the order data to the backend
        axios
          .post("http://localhost:5000/orders/add", orderData)
          .then((response) => {
            alert(`Order placed successfully for ${shopName}!`);
          })
          .catch((error) => {
            console.error("Error placing order:", error);
            alert("Failed to place the order. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Error fetching owner ID:", error.response ? error.response.data : error);
        alert("Failed to fetch owner information. Please try again.");
      });
  };
  

  if (loading) return <p>Loading...</p>;

  const shopNames = Object.keys(cartItems);

  return (
    <div className="cart-cart-container">
      <Header />
      <div className="cart-item-wrapper">
        {shopNames.length > 0 ? (
          shopNames.map((shopName) => (
            <div key={shopName} className="shop-group">
              <h2>Order from {shopName}</h2>
              <div className="order">
                {cartItems[shopName].map((item, index) => (
                  <div className="order-item" key={`${item.product_id}-${index}`}>
                    <img
                      src={`http://localhost:5000/${item.photo.replace(/\\/g, "/")}`}
                      alt={item.product_name}
                      className="order-image"
                    />
                    <div className="order-content">
                      <h3>{item.product_name}</h3>
                      <p>{item.description}</p>
                      <p className="order-price">Rs {item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => handleBuy(shopName)} className="btn-buy btn btn-primary">
                Buy
              </button>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
