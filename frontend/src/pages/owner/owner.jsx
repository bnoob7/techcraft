// import React, { useEffect, useState } from "react";
// // import Header from "../../components/header/header";
// import ProductForm from "../../components/productForm/productForm";
// import ProductList from "../../components/productList/productList";
// import logo from "./../../../public/logo/logo.svg";
// import { Boxes, ClipboardList } from "lucide-react"
// import axios from "axios";
// import "./owner.css";

// const Owner = () => {
//   const [ownerId, setOwnerId] = useState(null);
//   const [ownerName, setOwnerName] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [ownerPhoto, setOwnerPhoto] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [orders, setOrders] = useState([]);
//   const [activeView, setActiveView] = useState("products"); // State to track which view to show

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT
//       console.log("Decoded Token:", decodedToken); // Check if token contains `id`
//       setOwnerId(decodedToken.id); // Set the owner ID from the token

//       axios
//         .get(`http://localhost:5000/owner/${decodedToken.id}`) // Fetch the owner details by owner ID
//         .then((response) => {
//           console.log("Owner Details Response:", response); // Log the response to verify
//           setOwnerName(response.data.owner_name); // Set the owner name
//           setCompanyName(response.data.company_name); // Set the company name
//           setOwnerPhoto(response.data.photo); // Set the owner photo
//           setLoading(false); // Set loading to false once data is fetched
//         })
//         .catch((error) => {
//           console.error("Error fetching owner details:", error);
//           setLoading(false);
//         });

//       // Fetch orders for the owner
//       axios
//         .get(`http://localhost:5000/orders/owner/${decodedToken.id}`)
//         .then((response) => {
//           console.log("Orders Response:", response); // Log orders response
//           setOrders(response.data); // Set orders for display
//         })
//         .catch((error) => {
//           console.error("Error fetching orders:", error);
//         });
//     } else {
//       console.error("Token not found!");
//       setLoading(false); // If no token, stop loading
//     }
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Show loading state until data is fetched
//   }

//   return (
//     <div className="owner-container">



//       <div className="owner-form sidebar">
//         <a className="logo" href="#">
//           <img className="logo" src={logo} alt="Logo" />
//         </a>

//         <div className="sidebar-nav h-full flex flex-col gap-0">

//           {/* Product List */}
//           <button
//             className={`w-full nav-btn flex items-center gap-3 px-4 py-3 text-left 
//         border-b transition
//         ${activeView === "products"
//                 ? "bg-blue-600 text-white border-blue-700"
//                 : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             onClick={() => setActiveView("products")}
//           >
//             <Boxes size={20} />
//             Product List
//           </button>

//           {/* Order List */}
//           <button
//             className={`w-full flex nav-btn items-center gap-3 px-4 py-3 text-left 
//         border-b transition
//         ${activeView === "orders"
//                 ? "bg-blue-600 text-white border-blue-700"
//                 : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             onClick={() => setActiveView("orders")}
//           >
//             <ClipboardList size={20} />
//             Order List
//           </button>

//         </div>
//       </div>



//       <div className="product-table right w-full">

//         <div className="topbar">
//           <div className="name">
//             <h1 className="user">Hello, {ownerName}!</h1> {/* Display the owner name */}
//             <p>Scale your Business with techcraft</p>
//           </div>
//           <div className="profile flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
//             {ownerPhoto && (
//               <img
//                 src={`http://localhost:5000/${ownerPhoto}`}
//                 alt={ownerName}
//                 className="w-full h-full rounded-full object-contain border-2 border-blue-500"
//               />
//             )}
//             <div className="flex flex-col">
//               <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{ownerName}</h2>
//               <p className="text-sm text-slate-600 dark:text-slate-400">{companyName}</p>
//             </div>
//           </div>
//         </div>      

//         <div className="bottom-bar w-full h-full">
//           {activeView === "products" && (
//           <>
//             <div className="product_form">
//               <ProductForm owner_id={ownerId} />
//             </div>
//             <div className="wrap">
//               <ProductList ownerId={ownerId} />
//             </div>
//           </>
//         )}

//         {activeView === "orders" && (
//           <div className="wrap">
//             {/* Display orders */}
//             <div className="orders_section">
//               <h2>Orders List</h2>
//               <table className="orders_table">
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Customer Name</th>
//                     <th>Shop Name</th>
//                     <th>Total Amount</th>
//                     <th>Order Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.length > 0 ? (
//                     orders.map((order) => (
//                       <tr key={order.order_id}>
//                         <td>{order.order_id}</td>
//                         <td>{order.customer_name}</td> {/* Display customer name */}
//                         <td>{order.shop_name}</td>
//                         <td>{order.total_amount}</td>
//                         <td>{new Date(order.created_at).toLocaleString()}</td> {/* Display order time */}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5">No orders placed yet.</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//         </div>



//       </div>
//     </div>
//   );
// };

// export default Owner;





// v2

// import React, { useEffect, useState } from "react";
// import { Boxes, ClipboardList, Package, DollarSign, ShoppingBag } from "lucide-react";

// const Owner = () => {
//   const [ownerId, setOwnerId] = useState(null);
//   const [ownerName, setOwnerName] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [ownerPhoto, setOwnerPhoto] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [activeView, setActiveView] = useState("products");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       const decodedToken = JSON.parse(atob(token.split(".")[1]));
//       setOwnerId(decodedToken.id);

//       // Fetch owner details
//       fetch(`http://localhost:5000/owner/${decodedToken.id}`)
//         .then(res => res.json())
//         .then((data) => {
//           setOwnerName(data.owner_name);
//           setCompanyName(data.company_name);
//           setOwnerPhoto(data.photo);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error fetching owner details:", error);
//           setLoading(false);
//         });

//       // Fetch orders
//       fetch(`http://localhost:5000/orders/owner/${decodedToken.id}`)
//         .then(res => res.json())
//         .then((data) => {
//           setOrders(data);
//         })
//         .catch((error) => {
//           console.error("Error fetching orders:", error);
//         });

//       // Fetch products
//       fetch(`http://localhost:5000/products?owner_id=${decodedToken.id}`)
//         .then(res => res.json())
//         .then((data) => {
//           setProducts(data);
//         })
//         .catch((error) => {
//           console.error("Error fetching products:", error);
//         });
//     } else {
//       console.error("Token not found!");
//       setLoading(false);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <div style={{
//         minHeight: '100vh',
//         backgroundColor: 'var(--background-dark)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
//         <p style={{ color: 'var(--text-para)', fontSize: '18px' }}>Loading...</p>
//       </div>
//     );
//   }

//   // Calculate statistics
//   const totalProducts = products.length;
//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

//   return (
//     <div style={{
//       width: '100%',
//       minHeight: '100vh',
//       backgroundColor: 'var(--background-dark)',
//       display: 'flex',
//       padding: '16px',
//       gap: '24px'
//     }}>
//       {/* Sidebar */}
//       <aside style={{
//         padding: '16px',
//         maxWidth: '300px',
//         width: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: 'var(--background-elevate)',
//         borderRadius: '8px',
//         height: 'fit-content',
//         position: 'sticky',
//         top: '16px'
//       }}>
//         <div style={{
//           marginBottom: '32px',
//           paddingBottom: '16px',
//           borderBottom: '1px solid var(--grey-900)'
//         }}>
//           <h2 style={{
//             fontSize: '24px',
//             fontWeight: '700',
//             color: 'var(--text-head)'
//           }}>
//             TechCraft
//           </h2>
//         </div>

//         <nav style={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '8px'
//         }}>
//           <button
//             onClick={() => setActiveView("products")}
//             style={{
//               width: '100%',
//               padding: '12px 16px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px',
//               backgroundColor: activeView === "products" ? 'var(--primary-color)' : 'transparent',
//               color: activeView === "products" ? '#FFFFFF' : 'var(--text-para)',
//               border: activeView === "products" ? 'none' : '1px solid var(--grey-900)',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: '500',
//               transition: 'all 0.3s ease'
//             }}
//             onMouseEnter={(e) => {
//               if (activeView !== "products") {
//                 e.currentTarget.style.backgroundColor = 'var(--grey-900)';
//                 e.currentTarget.style.color = 'var(--text-head)';
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (activeView !== "products") {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = 'var(--text-para)';
//               }
//             }}
//           >
//             <Boxes size={20} />
//             Product List
//           </button>

//           <button
//             onClick={() => setActiveView("orders")}
//             style={{
//               width: '100%',
//               padding: '12px 16px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px',
//               backgroundColor: activeView === "orders" ? 'var(--primary-color)' : 'transparent',
//               color: activeView === "orders" ? '#FFFFFF' : 'var(--text-para)',
//               border: activeView === "orders" ? 'none' : '1px solid var(--grey-900)',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: '500',
//               transition: 'all 0.3s ease'
//             }}
//             onMouseEnter={(e) => {
//               if (activeView !== "orders") {
//                 e.currentTarget.style.backgroundColor = 'var(--grey-900)';
//                 e.currentTarget.style.color = 'var(--text-head)';
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (activeView !== "orders") {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = 'var(--text-para)';
//               }
//             }}
//           >
//             <ClipboardList size={20} />
//             Order List
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main style={{
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '24px',
//         overflow: 'auto'
//       }}>
//         {/* Top Bar */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '24px',
//           backgroundColor: 'var(--background-elevate)',
//           borderRadius: '16px'
//         }}>
//           <div>
//             <h1 style={{
//               fontSize: '28px',
//               fontWeight: '600',
//               color: 'var(--text-head)',
//               marginBottom: '4px'
//             }}>
//               Hello, {ownerName}!
//             </h1>
//             <p style={{
//               fontSize: '16px',
//               color: 'var(--text-para)'
//             }}>
//               Scale your Business with TechCraft
//             </p>
//           </div>

//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '16px'
//           }}>
//             <div style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               overflow: 'hidden',
//               border: '2px solid var(--primary-color)',
//               backgroundColor: 'var(--grey-900)'
//             }}>
//               {ownerPhoto && (
//                 <img
//                   src={`http://localhost:5000/${ownerPhoto}`}
//                   alt={ownerName}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover'
//                   }}
//                 />
//               )}
//             </div>
//             <div>
//               <h3 style={{
//                 fontSize: '16px',
//                 fontWeight: '600',
//                 color: 'var(--text-head)',
//                 marginBottom: '2px'
//               }}>
//                 {ownerName}
//               </h3>
//               <p style={{
//                 fontSize: '14px',
//                 color: 'var(--text-para)'
//               }}>
//                 {companyName}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//           gap: '16px'
//         }}>
//           <div style={{
//             padding: '20px',
//             backgroundColor: 'var(--background-elevate)',
//             borderRadius: '12px',
//             border: '1px solid var(--grey-900)'
//           }}>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'flex-start',
//               marginBottom: '12px'
//             }}>
//               <div>
//                 <p style={{
//                   fontSize: '14px',
//                   color: 'var(--text-para)',
//                   marginBottom: '8px'
//                 }}>
//                   Total Products
//                 </p>
//                 <h2 style={{
//                   fontSize: '32px',
//                   fontWeight: '700',
//                   color: 'var(--text-head)'
//                 }}>
//                   {totalProducts}
//                 </h2>
//               </div>
//               <div style={{
//                 width: '48px',
//                 height: '48px',
//                 borderRadius: '12px',
//                 backgroundColor: 'var(--primary-elevate)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 <Package size={24} color="var(--primary-color)" />
//               </div>
//             </div>
//           </div>

//           <div style={{
//             padding: '20px',
//             backgroundColor: 'var(--background-elevate)',
//             borderRadius: '12px',
//             border: '1px solid var(--grey-900)'
//           }}>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'flex-start',
//               marginBottom: '12px'
//             }}>
//               <div>
//                 <p style={{
//                   fontSize: '14px',
//                   color: 'var(--text-para)',
//                   marginBottom: '8px'
//                 }}>
//                   Total Orders
//                 </p>
//                 <h2 style={{
//                   fontSize: '32px',
//                   fontWeight: '700',
//                   color: 'var(--text-head)'
//                 }}>
//                   {totalOrders}
//                 </h2>
//               </div>
//               <div style={{
//                 width: '48px',
//                 height: '48px',
//                 borderRadius: '12px',
//                 backgroundColor: 'var(--primary-elevate)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 <ShoppingBag size={24} color="var(--primary-color)" />
//               </div>
//             </div>
//           </div>

//           <div style={{
//             padding: '20px',
//             backgroundColor: 'var(--background-elevate)',
//             borderRadius: '12px',
//             border: '1px solid var(--grey-900)'
//           }}>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'flex-start',
//               marginBottom: '12px'
//             }}>
//               <div>
//                 <p style={{
//                   fontSize: '14px',
//                   color: 'var(--text-para)',
//                   marginBottom: '8px'
//                 }}>
//                   Total Revenue
//                 </p>
//                 <h2 style={{
//                   fontSize: '32px',
//                   fontWeight: '700',
//                   color: 'var(--text-head)'
//                 }}>
//                   ${totalRevenue.toFixed(2)}
//                 </h2>
//               </div>
//               <div style={{
//                 width: '48px',
//                 height: '48px',
//                 borderRadius: '12px',
//                 backgroundColor: 'var(--primary-elevate)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 <DollarSign size={24} color="var(--primary-color)" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div style={{
//           backgroundColor: 'var(--background-elevate)',
//           borderRadius: '16px',
//           padding: '24px'
//         }}>
//           {activeView === "products" && (
//             <div>
//               <h2 style={{
//                 fontSize: '24px',
//                 fontWeight: '600',
//                 color: 'var(--text-head)',
//                 marginBottom: '24px'
//               }}>
//                 Your Products
//               </h2>
              
//               <div style={{
//                 overflowX: 'auto',
//                 borderRadius: '8px',
//                 border: '1px solid var(--grey-900)'
//               }}>
//                 <table style={{
//                   width: '100%',
//                   borderCollapse: 'collapse'
//                 }}>
//                   <thead>
//                     <tr style={{
//                       backgroundColor: 'var(--table-odd)'
//                     }}>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Product Name
//                       </th>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Category
//                       </th>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Price
//                       </th>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Shop Name
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.length > 0 ? (
//                       products.map((product, index) => (
//                         <tr
//                           key={product.product_id}
//                           style={{
//                             backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--table-odd)',
//                             transition: 'background-color 0.2s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = 'var(--grey-900)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'var(--table-odd)';
//                           }}
//                         >
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--text-para)',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             {product.product_name}
//                           </td>
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--text-para)',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             {product.category}
//                           </td>
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--primary-color)',
//                             fontWeight: '600',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             ${parseFloat(product.price).toFixed(2)}
//                           </td>
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--text-para)',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             {product.shop_name}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="4"
//                           style={{
//                             padding: '32px',
//                             textAlign: 'center',
//                             fontSize: '16px',
//                             color: 'var(--text-para)'
//                           }}
//                         >
//                           No products added yet.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {activeView === "orders" && (
//             <div>
//               <h2 style={{
//                 fontSize: '24px',
//                 fontWeight: '600',
//                 color: 'var(--text-head)',
//                 marginBottom: '24px'
//               }}>
//                 Orders List
//               </h2>
              
//               <div style={{
//                 overflowX: 'auto',
//                 borderRadius: '8px',
//                 border: '1px solid var(--grey-900)'
//               }}>
//                 <table style={{
//                   width: '100%',
//                   borderCollapse: 'collapse'
//                 }}>
//                   <thead>
//                     <tr style={{
//                       backgroundColor: 'var(--table-odd)'
//                     }}>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Order ID
//                       </th>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Customer Name
//                       </th>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Shop Name
//                       </th>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Total Amount
//                       </th>
//                       <th style={{
//                         padding: '16px',
//                         textAlign: 'left',
//                         fontSize: '14px',
//                         fontWeight: '600',
//                         color: 'var(--text-head)',
//                         borderBottom: '1px solid var(--grey-900)'
//                       }}>
//                         Order Date
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.length > 0 ? (
//                       orders.map((order, index) => (
//                         <tr
//                           key={order.order_id}
//                           style={{
//                             backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--table-odd)',
//                             transition: 'background-color 0.2s ease'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = 'var(--grey-900)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'var(--table-odd)';
//                           }}
//                         >
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--text-para)',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             #{order.order_id}
//                           </td>
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--text-para)',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             {order.name}
//                           </td>
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--text-para)',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             {order.shop_name}
//                           </td>
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--primary-color)',
//                             fontWeight: '600',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             ${parseFloat(order.total_amount).toFixed(2)}
//                           </td>
//                           <td style={{
//                             padding: '16px',
//                             fontSize: '14px',
//                             color: 'var(--text-para)',
//                             borderBottom: '1px solid var(--grey-900)'
//                           }}>
//                             {new Date(order.order_date).toLocaleDateString()}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="5"
//                           style={{
//                             padding: '32px',
//                             textAlign: 'center',
//                             fontSize: '16px',
//                             color: 'var(--text-para)'
//                           }}
//                         >
//                           No orders placed yet.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Owner;



import React, { useEffect, useState } from "react";
import { Boxes, ClipboardList, Package, DollarSign, ShoppingBag, X } from "lucide-react";
import ProductForm from "../../components/productForm/productForm";

const Owner = () => {
  const [ownerId, setOwnerId] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeView, setActiveView] = useState("products");
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setOwnerId(decodedToken.id);

      // Fetch owner details
      fetch(`http://localhost:5000/owner/${decodedToken.id}`)
        .then(res => res.json())
        .then((data) => {
          setOwnerName(data.owner_name);
          setCompanyName(data.company_name);
          setOwnerPhoto(data.photo);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching owner details:", error);
          setLoading(false);
        });

      // Fetch orders
      fetch(`http://localhost:5000/orders/owner/${decodedToken.id}`)
        .then(res => res.json())
        .then((data) => {
          setOrders(data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });

      // Fetch products
      fetch(`http://localhost:5000/products?owner_id=${decodedToken.id}`)
        .then(res => res.json())
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    } else {
      console.error("Token not found!");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-dark)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p style={{ color: 'var(--text-para)', fontSize: '18px' }}>Loading...</p>
      </div>
    );
  }

  // Calculate statistics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--background-dark)',
      display: 'flex',
      padding: '16px',
      gap: '24px'
    }}>
      {/* Sidebar */}
      <aside style={{
        padding: '16px',
        maxWidth: '300px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background-elevate)',
        borderRadius: '8px',
        height: 'fit-content',
        position: 'sticky',
        top: '16px'
      }}>
        <div style={{
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--grey-900)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-head)'
          }}>
            TechCraft
          </h2>
        </div>

        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={() => setActiveView("products")}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: activeView === "products" ? 'var(--primary-color)' : 'transparent',
              color: activeView === "products" ? '#FFFFFF' : 'var(--text-para)',
              border: activeView === "products" ? 'none' : '1px solid var(--grey-900)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeView !== "products") {
                e.currentTarget.style.backgroundColor = 'var(--grey-900)';
                e.currentTarget.style.color = 'var(--text-head)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== "products") {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-para)';
              }
            }}
          >
            <Boxes size={20} />
            Product List
          </button>

          <button
            onClick={() => setActiveView("orders")}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: activeView === "orders" ? 'var(--primary-color)' : 'transparent',
              color: activeView === "orders" ? '#FFFFFF' : 'var(--text-para)',
              border: activeView === "orders" ? 'none' : '1px solid var(--grey-900)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeView !== "orders") {
                e.currentTarget.style.backgroundColor = 'var(--grey-900)';
                e.currentTarget.style.color = 'var(--text-head)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== "orders") {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-para)';
              }
            }}
          >
            <ClipboardList size={20} />
            Order List
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflow: 'auto'
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          backgroundColor: 'var(--background-elevate)',
          borderRadius: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'var(--text-head)',
              marginBottom: '4px'
            }}>
              Hello, {ownerName}!
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--text-para)'
            }}>
              Scale your Business with TechCraft
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--primary-color)',
              backgroundColor: 'var(--grey-900)'
            }}>
              {ownerPhoto && (
                <img
                  src={`http://localhost:5000/${ownerPhoto}`}
                  alt={ownerName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-head)',
                marginBottom: '2px'
              }}>
                {ownerName}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-para)'
              }}>
                {companyName}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: 'var(--background-elevate)',
            borderRadius: '12px',
            border: '1px solid var(--grey-900)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-para)',
                  marginBottom: '8px'
                }}>
                  Total Products
                </p>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--text-head)'
                }}>
                  {totalProducts}
                </h2>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-elevate)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={24} color="var(--primary-color)" />
              </div>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: 'var(--background-elevate)',
            borderRadius: '12px',
            border: '1px solid var(--grey-900)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-para)',
                  marginBottom: '8px'
                }}>
                  Total Orders
                </p>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--text-head)'
                }}>
                  {totalOrders}
                </h2>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-elevate)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={24} color="var(--primary-color)" />
              </div>
            </div>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: 'var(--background-elevate)',
            borderRadius: '12px',
            border: '1px solid var(--grey-900)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-para)',
                  marginBottom: '8px'
                }}>
                  Total Revenue
                </p>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--text-head)'
                }}>
                  ${totalRevenue.toFixed(2)}
                </h2>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-elevate)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} color="var(--primary-color)" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          backgroundColor: 'var(--background-elevate)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          {activeView === "products" && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'var(--text-head)'
                }}>
                  Your Products
                </h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="btn-primary"
                  style={{
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Package size={18} />
                  Add Product
                </button>
              </div>

              {/* Product Form Modal/Popup */}
              {showProductForm && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000,
                  padding: '20px'
                }}>
                  <div style={{
                    backgroundColor: 'var(--background-elevate)',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    border: '1px solid var(--grey-900)'
                  }}>
                    {/* Close Button */}
                    <button
                      onClick={() => setShowProductForm(false)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--grey-900)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <X size={24} color="var(--text-head)" />
                    </button>

                    {/* Product Form Component */}
                    <ProductForm 
                      ownerId={ownerId}
                      onSuccess={() => {
                        setShowProductForm(false);
                        // Refresh products list
                        fetch(`http://localhost:5000/products?owner_id=${ownerId}`)
                          .then(res => res.json())
                          .then(data => setProducts(data))
                          .catch(err => console.error('Error refreshing products:', err));
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div style={{
                overflowX: 'auto',
                borderRadius: '8px',
                border: '1px solid var(--grey-900)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: 'var(--table-odd)'
                    }}>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Product Name
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Category
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Price
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Shop Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product, index) => (
                        <tr
                          key={product.product_id}
                          style={{
                            backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--table-odd)',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--grey-900)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'var(--table-odd)';
                          }}
                        >
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--text-para)',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            {product.product_name}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--text-para)',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            {product.category}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--primary-color)',
                            fontWeight: '600',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            ${parseFloat(product.price).toFixed(2)}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--text-para)',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            {product.shop_name}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          style={{
                            padding: '32px',
                            textAlign: 'center',
                            fontSize: '16px',
                            color: 'var(--text-para)'
                          }}
                        >
                          No products added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === "orders" && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--text-head)',
                marginBottom: '24px'
              }}>
                Orders List
              </h2>
              
              <div style={{
                overflowX: 'auto',
                borderRadius: '8px',
                border: '1px solid var(--grey-900)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: 'var(--table-odd)'
                    }}>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Order ID
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Customer Name
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Shop Name
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Total Amount
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-head)',
                        borderBottom: '1px solid var(--grey-900)'
                      }}>
                        Order Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr
                          key={order.order_id}
                          style={{
                            backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--table-odd)',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--grey-900)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'var(--table-odd)';
                          }}
                        >
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--text-para)',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            #{order.order_id}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--text-para)',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            {order.name}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--text-para)',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            {order.shop_name}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--primary-color)',
                            fontWeight: '600',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            ${parseFloat(order.total_amount).toFixed(2)}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: 'var(--text-para)',
                            borderBottom: '1px solid var(--grey-900)'
                          }}>
                            {new Date(order.order_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            padding: '32px',
                            textAlign: 'center',
                            fontSize: '16px',
                            color: 'var(--text-para)'
                          }}
                        >
                          No orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Owner;