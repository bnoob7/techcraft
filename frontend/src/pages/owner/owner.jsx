import React, { useEffect, useState } from "react";
// import Header from "../../components/header/header";
import ProductForm from "../../components/productForm/productForm";
import ProductList from "../../components/productList/productList";
import logo from "./../../../public/logo/logo.svg";
import axios from "axios";
import "./owner.css";

const Owner = () => {
  const [ownerId, setOwnerId] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT
      console.log("Decoded Token:", decodedToken); // Check if token contains `id`
      setOwnerId(decodedToken.id); // Set the owner ID from the token

      axios
        .get(`http://localhost:5000/owner/${decodedToken.id}`) // Fetch the owner details by owner ID
        .then((response) => {
          console.log("Owner Details Response:", response); // Log the response to verify
          setOwnerName(response.data.owner_name); // Set the owner name
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching owner details:", error);
          setLoading(false);
        });

      // Fetch orders for the owner
      axios
        .get(`http://localhost:5000/orders/owner/${decodedToken.id}`)
        .then((response) => {
          console.log("Orders Response:", response); // Log orders response
          setOrders(response.data); // Set orders for display
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    } else {
      console.error("Token not found!");
      setLoading(false); // If no token, stop loading
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state until data is fetched
  }

  return (
    <div className="owner-container">

      <div className="owner-form sidebar">
        <a className="logo" href="#">
          <img className="logo" src={logo} alt="Logo" />
        </a>
      </div>


      <div className="product-table right">
        <div className="topbar">
            <p>Welcome, {ownerName}!</p> {/* Display the owner name */}
        </div>
        <div className="product_form">
          <ProductForm  owner_id={ownerId} />
        </div>


        <div className="wrap">
          
          <ProductList ownerId={ownerId} />

          {/* Display orders */}
          <div className="orders_section">
            <h2>Orders List</h2>
            <table className="orders_table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Shop Name</th>
                  <th>Total Amount</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>{order.customer_name}</td> {/* Display customer name */}
                      <td>{order.shop_name}</td>
                      <td>{order.total_amount}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td> {/* Display order time */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No orders placed yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;