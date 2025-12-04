import Header from '../../components/header/header';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Cpu, MonitorSmartphone, HardDrive, Headphones, Zap, Fan, MemoryStick, CircuitBoard, ShoppingCart, TrendingUp, Package, Smartphone, Cable, Sparkles, Clock, DollarSign, Bot, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';



const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // This will now also cover the user check
  // States for new recommendation sections
  const [newestProducts, setNewestProducts] = useState([]);
  const [greatDeals, setGreatDeals] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  // State for PC Build Suggestions
  const [budget, setBudget] = useState('');
  const [pcBuilds, setPcBuilds] = useState([]);
  const [buildsLoading, setBuildsLoading] = useState(false);
  const [buildsError, setBuildsError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth(); // 💡 Get user directly from context

  // Category configuration with icons
  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'Processor (CPU)', name: 'Processor', icon: Cpu },
    { id: 'Graphics Card (GPU)', name: 'Graphics Card', icon: MonitorSmartphone },
    { id: 'Memory (RAM)', name: 'Memory (RAM)', icon: MemoryStick },
    { id: 'Motherboard', name: 'Motherboard', icon: CircuitBoard },
    { id: 'Storage', name: 'Storage', icon: HardDrive },
    { id: 'Power Supply (PSU)', name: 'Power Supply', icon: Zap },
    { id: 'Cooling System', name: 'Cooling System', icon: Fan },
    { id: 'Cabinet / Case', name: 'Cabinet / Case', icon: Package },
    { id: 'Mobile', name: 'Mobile', icon: Smartphone },
    { id: 'Accessories', name: 'Accessories', icon: Cable },
    { id: 'Other', name: 'Other', icon: Headphones }
  ];

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
    fetchNewestProducts();
    fetchGreatDeals();
    // The loading state is now simpler as user is handled globally
    setLoading(false);
  }, []);

  // Filter products when search or category changes
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  // Fetch recommendations when cart changes
  useEffect(() => {
    fetchRecommendedProducts();
  }, [cart]);

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
      // setLoading(false); // This is now handled in the initial useEffect
    }
  };

  const fetchNewestProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products/newest');
      const data = await response.json();
      setNewestProducts(data);
    } catch (error) {
      console.error('Error fetching newest products:', error);
    }
  };

  const fetchGreatDeals = async () => {
    try {
      const response = await fetch('http://localhost:5000/products/deals');
      const data = await response.json();
      setGreatDeals(data);
    } catch (error) {
      console.error('Error fetching great deals:', error);
    }
  };

  const fetchRecommendedProducts = async () => {
    if (cart.length === 0) {
      setRecommendedProducts([]);
      return;
    }

    try {
      const categories = [...new Set(cart.map(item => item.category))];
      const exclude_ids = cart.map(item => item.product_id);

      const response = await fetch('http://localhost:5000/products/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories, exclude_ids }),
      });
      const data = await response.json();
      setRecommendedProducts(data);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
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

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleLogout = () => {
    setCart([]);
  };

  const handleGetBuilds = async () => {
    if (!budget || isNaN(budget) || budget <= 0) {
      setBuildsError('Please enter a valid budget amount.');
      return;
    }
    setBuildsLoading(true);
    setBuildsError('');
    setPcBuilds([]);

    try {
      const response = await fetch(`http://localhost:5000/products/pc-build?budget=${budget}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch builds.');
      }
      setPcBuilds(data);
    } catch (error) {
      setBuildsError(error.message);
      console.error('Error fetching PC builds:', error);
    } finally {
      setBuildsLoading(false);
    }
  };

  const banners = [
      "../../banner/banner1.webp",
      "../../banner/banner2.webp",
      "../../banner/banner3.webp",
      // "../../banner/banner4.webp",s
      "../../banner/banner5.webp",
      ];

      const [currentBanner, setCurrentBanner] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  // 💡 Render a loading screen until user and products are checked/loaded
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--background-dark)', color: 'var(--text-head)' }}>
        <h2>Loading Your Experience...</h2>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background-dark)',
      paddingBottom: '60px'
    }}>
      {/* Header Section */}
      <Header cart={cart} onLogout={handleLogout} style={{
        backgroundColor: 'var(--background-elevate)',
        padding: '24px',
        borderBottom: '1px solid var(--grey-900)',
        position: 'sticky',
        top: 0,
        zIndex: 110
      }} />

      {/* 💡 Welcome message for logged-in user */}
      {user && (
        <div style={{
          maxWidth: '1400px',
          margin: '24px auto 0 auto',
          padding: '0 24px',
          color: 'var(--text-head)'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600 }}>Welcome back, {user.name}!</h1>
          <p style={{ color: 'var(--text-para)', marginTop: '4px' }}>Let's find your next piece of tech.</p>
        </div>
      )}

      

<div className="banner-wrapper" 
     style={{ maxWidth: '1400px', margin: '0 auto', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>

  <img 
    key={currentBanner}
    src={banners[currentBanner]}
    alt="PC Parts Store Banner"
    style={{ width: '100%', height: 'auto', transition: 'opacity 0.5s ease-in-out', opacity: 1 }}
  />
</div>




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



      <div className="search-bar" style={{
        // backgroundColor: 'var(--background-elevate)',
        padding: '24px',
        // borderBottom: '1px solid var(--grey-900)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        maxWidth: '1400px',
        height: '120px',
        margin: '0 auto',
      }}>
            {/* Search Bar */}
          <div style={{ position: 'relative', width: '500px' }}>
            <Search
              size={20}
              color="var(--text-para)"
              style={{ 
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
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
                key={product.product_id}
                onClick={() => handleProductClick(product.product_id)}
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
                      src={`http://localhost:5000/${product.photo.replace(/\\/g, "/")}`}
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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation when clicking the button
                        addToCart(product);
                      }}
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

      {/* 💡 Recommendation Sections */}
      <ProductCarousel title="Great Value Deals" products={greatDeals} icon={Sparkles} onProductClick={handleProductClick} onAddToCart={addToCart} />
      <ProductCarousel title="Recommended For You" products={recommendedProducts} icon={Star} onProductClick={handleProductClick} onAddToCart={addToCart} />
      <ProductCarousel title="Newest Arrivals" products={newestProducts} icon={Clock} onProductClick={handleProductClick} onAddToCart={addToCart} />


      {/* 💡 PC Build Helper Section */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{
          backgroundColor: 'var(--background-elevate)',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid var(--grey-900)',
          textAlign: 'center'
        }}>
          <Bot size={48} color="var(--primary-color)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '28px', color: 'var(--text-head)', fontWeight: 700, marginBottom: '8px' }}>
            PC Build Helper
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-para)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            Tell us your budget, and our AI will suggest the best PC builds for your needs, from budget-friendly to high-end gaming rigs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <DollarSign size={20} color="var(--text-para)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="number"
                placeholder="Enter your budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{ width: '100%', paddingLeft: '48px' }}
              />
            </div>
            <button onClick={handleGetBuilds} disabled={buildsLoading} className="btn-primary" style={{ height: '48px' }}>
              {buildsLoading ? 'Finding Builds...' : 'Get Suggestions'}
            </button>
          </div>
          {buildsError && <p style={{ color: '#F44336', marginTop: '16px' }}>{buildsError}</p>}
        </div>

        {/* PC Builds Results */}
        {buildsLoading && <p style={{ textAlign: 'center', color: 'var(--text-para)', marginTop: '24px' }}>Loading suggestions...</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          {pcBuilds.map((build) => (
            <div key={build.buildType} style={{
              backgroundColor: 'var(--background-elevate)',
              borderRadius: '12px',
              border: '1px solid var(--grey-900)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                color: 'var(--text-head)',
                fontWeight: 600,
                textTransform: 'capitalize',
                marginBottom: '16px',
                borderBottom: '1px solid var(--grey-900)',
                paddingBottom: '16px'
              }}>
                {build.buildType.replace('-', ' ')} Build
              </h3>

              <div style={{ marginBottom: '16px' }}>
                {build.components.map(component => (
                  <div key={component.product_id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: 'var(--text-para)'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--background-dark)'
                    }}>
                      <img
                        src={`http://localhost:5000/${component.photo.replace(/\\/g, "/")}`}
                        alt={component.product_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{component.product_name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-head)' }}>${parseFloat(component.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{
                borderTop: '1px solid var(--grey-900)',
                paddingTop: '16px',
                marginTop: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '16px', color: 'var(--text-para)' }}>Total Cost:</span>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary-color)' }}>
                    ${build.totalCost}
                  </span>
                </div>
                <button
                  onClick={() => build.components.forEach(c => addToCart(c))}
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ShoppingCart size={18} />
                  Add Build to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default Homepage;
const ProductCarousel = ({ title, products, icon: Icon, onProductClick, onAddToCart }) => {
  if (!products || products.length === 0) {
    return null; // Don't render if there are no products
  }

  return (
    <section style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '48px 24px 0 24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {Icon && <Icon size={24} color="var(--primary-color)" />}
        <h2 style={{
          fontSize: '24px',
          color: 'var(--text-head)',
          fontWeight: 600
        }}>
          {title}
        </h2>
      </div>
      <div style={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(280px, 1fr)',
        gap: '24px',
        overflowX: 'auto',
        paddingBottom: '24px' // For scrollbar visibility
      }}>
        {products.map((product) => (
          <div
            key={product.product_id}
            onClick={() => onProductClick(product.product_id)}
            style={{
              backgroundColor: 'var(--background-elevate)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--grey-900)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              width: '280px' // Fixed width for carousel items
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--primary-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--grey-900)';
            }}
          >
            {/* Product Image */}
            <div style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'var(--background-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {product.photo ? (
                <img
                  src={`http://localhost:5000/${product.photo.replace(/\\/g, "/")}`}
                  alt={product.product_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Package size={64} color="var(--text-para)" />
              )}
            </div>

            {/* Product Info */}
            <div style={{ padding: '16px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-head)',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {product.product_name}
              </h3>

              <p style={{
                fontSize: '12px',
                color: 'var(--primary-color)',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                {product.category}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--primary-color)'
                }}>
                  ${parseFloat(product.price).toFixed(2)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="btn-primary"
                  style={{ height: '36px', padding: '0 16px' }}
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
