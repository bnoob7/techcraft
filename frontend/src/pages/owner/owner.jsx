import React, { useEffect, useState } from "react";
// import Header from "../../components/header/header";
import ProductForm from "../../components/productForm/productForm";
import ProductList from "../../components/productList/productList";
import logo from "./../../../public/logo/logo.svg";
import { Boxes, ClipboardList } from "lucide-react"
import axios from "axios";
import "./owner.css";

const Owner = () => {
  const [ownerId, setOwnerId] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeView, setActiveView] = useState("products"); // State to track which view to show

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
          setCompanyName(response.data.company_name); // Set the company name
          setOwnerPhoto(response.data.photo); // Set the owner photo
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

        <div className="sidebar-nav h-full flex flex-col gap-0">

          {/* Product List */}
          <button
            className={`w-full nav-btn flex items-center gap-3 px-4 py-3 text-left 
        border-b transition
        ${activeView === "products"
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            onClick={() => setActiveView("products")}
          >
            <Boxes size={20} />
            Product List
          </button>

          {/* Order List */}
          <button
            className={`w-full flex nav-btn items-center gap-3 px-4 py-3 text-left 
        border-b transition
        ${activeView === "orders"
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            onClick={() => setActiveView("orders")}
          >
            <ClipboardList size={20} />
            Order List
          </button>

        </div>
      </div>



      <div className="product-table right w-full">

        <div className="topbar">
          <div className="name">
            <h1 className="user">Hello, {ownerName}!</h1> {/* Display the owner name */}
            <p>Scale your Business with techcraft</p>
          </div>
          <div className="profile flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            {ownerPhoto && (
              <img
                src={`http://localhost:5000/${ownerPhoto}`}
                alt={ownerName}
                className="w-full h-full rounded-full object-contain border-2 border-blue-500"
              />
            )}
            <div className="flex flex-col">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{ownerName}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{companyName}</p>
            </div>
          </div>
        </div>      

        <div className="bottom-bar w-full h-full">
          {activeView === "products" && (
          <>
            <div className="product_form">
              <ProductForm owner_id={ownerId} />
            </div>
            <div className="wrap">
              <ProductList ownerId={ownerId} />
            </div>
          </>
        )}

        {activeView === "orders" && (
          <div className="wrap">
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
        )}
        </div>



      </div>
    </div>
  );
};

export default Owner;