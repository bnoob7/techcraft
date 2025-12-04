// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "../../components/header/header"; 
// import Footer from "../../components/footer/footer";
// import SearchBar from "../../components/searchBar/searchBar";
// import CategoryShop from "../../components/categoryShop/categoryShop";
// import "./homepage.css";
// import { useNavigate } from "react-router-dom";

// const Homepage = () => {
//   const navigate = useNavigate();
//   const [searchResults, setSearchResults] = useState([]);
//   const [categoryResults, setCategoryResults] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [quantities, setQuantities] = useState({}); // Use an object to manage quantity for each product

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
//         const userId = decodedToken.id; // Extract user ID
  
//         // Store userId in localStorage if not already set
//         if (!localStorage.getItem("user_id")) {
//           localStorage.setItem("user_id", userId);
//         }

//         axios
//           .get(`http://localhost:5000/customers/${userId}`)
//           .then((response) => {
//             setUserName(response.data.name); // Set user name from response
//           })
//           .catch((error) => {
//             console.error("Error fetching customer details:", error);
//           })
//           .finally(() => {
//             setLoading(false);
//           });
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         setLoading(false);
//       }
//     } else {
//       console.error("Token not found!");
//       setLoading(false);
//     }
//   }, []);

//   const handleAddToCart = async (productId, quantity) => {
//     const token = localStorage.getItem("token");
//     const decodedToken = JSON.parse(atob(token.split(".")[1]));
//     const userId = decodedToken.id;

//     try {
//       const response = await axios.post("http://localhost:5000/cart/add", {
//         user_id: userId,
//         product_id: productId,
//         quantity: quantity || 1, // Pass the specific quantity, default to 1 if not set
//       });

//       console.log("Add to Cart Response:", response); // Log the full response for debugging

//       if (response.status === 200 && response.data.message === "Item added to cart successfully!") {
//         alert(response.data.message); // Show success message
//         // Navigate to the cart page
//         navigate(`/cart/${userId}`);
//       } else {
//         alert("Failed to add item to cart.");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       alert("Failed to add item to cart.");
//     }
//   };

//   // Handle quantity increment and decrement
//   const increaseQuantity = (productId) => {
//     setQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [productId]: (prevQuantities[productId] || 1) + 1,
//     }));
//   };

//   const decreaseQuantity = (productId) => {
//     setQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [productId]: Math.max(1, (prevQuantities[productId] || 1) - 1),
//     }));
//   };

//   // Handle category selection
//   const handleCategorySelect = async (category) => {
//     setSelectedCategory(category);
//     try {
//       const response = await axios.get("http://localhost:5000/products", {
//         params: { category },
//       });
//       setCategoryResults(response.data);
//       // Scroll to category results
//       setTimeout(() => {
//         document.querySelector(".category-results")?.scrollIntoView({ behavior: "smooth" });
//       }, 100);
//     } catch (error) {
//       console.error("Error fetching products by category:", error);
//       setCategoryResults([]);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   // Retrieve userId from localStorage
//   const userId = localStorage.getItem("user_id");
//   //console.log("UserId from localStorage:", userId); // Debugging the userId value

//   return (
//     <div className="head-container">
//       {/* <div className="">
//         <p>Welcome, {userName}!</p>
//         <p>Welcome, UserId: {userId}</p>
//       </div> */}
//       {/* Pass the userId to Header as a prop */}
//       <Header userId={userId} />
//       <div className="hero">
//         <div className="laptop">
//           <div className="search-bar">
//             {/* 💡 Use the new search endpoint */}
//             <SearchBar 
//               setSearchResults={setSearchResults} 
//               searchEndpoint="http://localhost:5000/products/search" />
//           </div>
//         </div>
//       </div>

//       {/* Category Shop Section */}
//       <CategoryShop onCategorySelect={handleCategorySelect} />

//       {/* Category Results Section */}
//       {selectedCategory && (
//         <div className="category-results">
//           <div className="results-header">
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//               {selectedCategory} - {categoryResults.length} products found
//             </h2>
//             <button
//               onClick={() => {
//                 setSelectedCategory(null);
//                 setCategoryResults([]);
//               }}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//             >
//               Clear Filter
//             </button>
//           </div>
          
//           {categoryResults.length > 0 ? (
//             <div className="cart-container">
//               {categoryResults.map((item) => (
//                 <div className="cart-item" key={item.product_id}>
//                   <img
//                     src={item.photo ? `http://localhost:5000/${item.photo.replace(/\\/g, "/")}` : 'https://via.placeholder.com/150'}
//                     alt={item.product_name}
//                     style={!item.photo ? { width: '200px', height: '200px', objectFit: 'cover' } : {}}
//                     className="cart-image"
//                   />
//                   <div className="content">
//                     <h3>{item.product_name}</h3>
//                     <p className="text-sm text-gray-600">{item.description}</p>
//                     <p className="price">${item.price}</p>
                    
//                     {/* Quantity Selector */}
//                     <div className="quantity-selector">
//                       <button onClick={() => decreaseQuantity(item.product_id)}>-</button>
//                       <span>{quantities[item.product_id] || 1}</span>
//                       <button onClick={() => increaseQuantity(item.product_id)}>+</button>
//                     </div>

//                     <button
//                       className="btn-primary"
//                       onClick={() => handleAddToCart(item.product_id, quantities[item.product_id])}
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-600 py-8">No products in this category</p>
//           )}
//         </div>
//       )}

//       {/* PC Build Suggestions Section */}
//       {searchResults.length > 0 && searchResults[0].buildType && (
//         <div className="pc-builds-section">
//           <div className="results-header">
//             <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
//               🖥️ PC Build Suggestions
//             </h2>
//             <button
//               onClick={() => setSearchResults([])}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//             >
//               Clear Results
//             </button>
//           </div>

//           <div className="builds-grid">
//             {searchResults.map((build, index) => (
//               <div className="build-card" key={index}>
//                 <div className="build-header">
//                   <h3 className="text-xl font-bold capitalize">
//                     {build.buildType === "gpu-focused" && "🎮 Gaming Build"}
//                     {build.buildType === "cpu-focused" && "💻 Workstation Build"}
//                     {build.buildType === "high-end" && "⚡ High-End Build"}
//                     {build.buildType === "balanced" && "⚙️ Balanced Build"}
//                     {build.buildType === "budget" && "💰 Budget Build"}
//                   </h3>
//                   <p className="text-2xl font-bold text-green-600">
//                     Rs {parseFloat(build.totalCost).toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Remaining Budget: Rs {parseFloat(build.remainingBudget).toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="components-list">
//                   {build.components.map((component) => (
//                     <div className="component-item" key={component.product_id}>
//                       <img
//                         src={`http://localhost:5000/${component.photo.replace(/\\/g, "/")}`}
//                         alt={component.product_name}
//                         style={!component.photo ? { width: '50px', height: '50px', objectFit: 'cover' } : {}}
//                         className="component-image"
//                       />
//                       <div className="component-info">
//                         <p className="component-category capitalize">
//                           {component.category}
//                         </p>
//                         <p className="component-name">{component.product_name}</p>
//                         <p className="component-price">
//                           Rs {parseFloat(component.price).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   className="btn-primary add-build-to-cart"
//                   onClick={() => {
//                     // Add all components to cart
//                     build.components.forEach((component) => {
//                       handleAddToCart(component.product_id, 1); // Add each component with quantity 1
//                     });
//                   }}
//                 >
//                   Add Entire Build to Cart
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Standard Search Results (existing code) */}
//       <div className="search-results">
//         {searchResults.length > 0 && !searchResults[0].buildType ? (
//           <div className="cart-container">
//             {searchResults.map((item) => (
//               <div className="cart-item" key={item.product_id}>
//                 <img
//                   src={item.photo ? `http://localhost:5000/${item.photo.replace(/\\/g, "/")}` : 'https://via.placeholder.com/150'}
//                   alt={item.product_name}
//                   style={!item.photo ? { width: '200px', height: '200px', objectFit: 'cover' } : {}}
//                   className="cart-image"
//                 />
//                 <div className="content">
//                   <h3>{item.product_name}</h3>
//                   <p>{item.description}</p>
//                   <p className="price">${item.price}</p>
                  
//                   {/* Quantity Selector */}
//                   <div className="quantity-selector">
//                     <button onClick={() => decreaseQuantity(item.product_id)}>-</button>
//                     <span>{quantities[item.product_id] || 1}</span>
//                     <button onClick={() => increaseQuantity(item.product_id)}>+</button>
//                   </div>

//                   <button
//                     className="btn-primary"
//                     onClick={() => handleAddToCart(item.product_id, quantities[item.product_id])}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No results found</p>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Homepage;




import React, { useState, useEffect } from 'react';
import { Search, Cpu, MonitorSmartphone, HardDrive, Mic, Zap, Fan, MemoryStick, CircuitBoard, ShoppingCart, TrendingUp, Package } from 'lucide-react';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  // Category configuration with icons
  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'cpu', name: 'CPU', icon: Cpu },
    { id: 'gpu', name: 'GPU', icon: MonitorSmartphone },
    { id: 'ram', name: 'RAM', icon: MemoryStick },
    { id: 'motherboard', name: 'Motherboard', icon: CircuitBoard },
    { id: 'storage', name: 'Storage', icon: HardDrive },
    { id: 'psu', name: 'PSU', icon: Zap },
    { id: 'cooling', name: 'Cooling', icon: Fan },
    { id: 'peripherals', name: 'Peripherals', icon: Mic }
  ];

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search or category changes
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Optional: Use the search API endpoint for more advanced search
    if (query.trim().length > 2) {
      try {
        const response = await fetch(`http://localhost:5000/products/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    // You can add toast notification here
    console.log('Added to cart:', product.product_name);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background-dark)',
      paddingBottom: '60px'
    }}>
      {/* Header Section */}
      <header style={{
        backgroundColor: 'var(--background-elevate)',
        padding: '24px',
        borderBottom: '1px solid var(--grey-900)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h1 style={{ 
              fontSize: '32px', 
              color: 'var(--text-head)',
              fontWeight: 700
            }}>
              PC Parts Store
            </h1>
            <div style={{ position: 'relative' }}>
              <ShoppingCart 
                size={28} 
                color="var(--text-head)"
                style={{ cursor: 'pointer' }}
              />
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'var(--primary-color)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {cart.length}
                </span>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search 
              size={20} 
              color="var(--text-para)"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                width: '100%',
                paddingLeft: '48px',
                backgroundColor: 'var(--background-dark)',
                color: 'var(--text-head)',
                border: '1px solid var(--grey-900)',
                marginBottom: 0
              }}
            />
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <section style={{
        backgroundColor: 'var(--primary-elevate)',
        padding: '24px',
        borderBottom: '1px solid var(--grey-900)',
        overflowX: 'auto'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            minWidth: 'max-content'
          }}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px 24px',
                    backgroundColor: isActive ? 'var(--primary-color)' : 'var(--background-elevate)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isActive ? 'none' : '1px solid var(--grey-900)',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--background-dark)';
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--background-elevate)';
                      e.currentTarget.style.borderColor = 'var(--grey-900)';
                    }
                  }}
                >
                  <IconComponent 
                    size={32} 
                    color={isActive ? '#FFFFFF' : 'var(--text-head)'}
                  />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isActive ? '#FFFFFF' : 'var(--text-head)',
                    textAlign: 'center'
                  }}>
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: 'var(--text-head)',
            fontWeight: 600
          }}>
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            <span style={{
              marginLeft: '12px',
              fontSize: '16px',
              color: 'var(--text-para)',
              fontWeight: 400
            }}>
              ({filteredProducts.length} items)
            </span>
          </h2>
          <TrendingUp size={20} color="var(--primary-color)" />
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <p style={{ color: 'var(--text-para)', fontSize: '18px' }}>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Package size={64} color="var(--text-para)" />
            <p style={{ color: 'var(--text-para)', fontSize: '18px' }}>
              No products found
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'var(--background-elevate)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--grey-900)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 100, 100, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--grey-900)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Product Image */}
                <div style={{
                  width: '100%',
                  height: '220px',
                  backgroundColor: 'var(--background-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {product.photo ? (
                    <img
                      src={`http://localhost:5000/${product.photo}`}
                      alt={product.product_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Package size={64} color="var(--text-para)" />
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--text-head)',
                      lineHeight: '1.4',
                      flex: 1
                    }}>
                      {product.product_name}
                    </h3>
                  </div>

                  <p style={{
                    fontSize: '12px',
                    color: 'var(--primary-color)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '8px'
                  }}>
                    {product.category}
                  </p>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-para)',
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>

                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-para)',
                    marginBottom: '12px'
                  }}>
                    Shop: {product.shop_name}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: 'var(--primary-color)'
                    }}>
                      ${parseFloat(product.price).toFixed(2)}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="btn-primary"
                      style={{
                        height: '40px',
                        padding: '0 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
