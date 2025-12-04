
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Cpu, MonitorSmartphone, HardDrive, Headphones, Zap, Fan, MemoryStick, CircuitBoard, ShoppingCart, TrendingUp, Package, Smartphone, Cable } from 'lucide-react';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
    </div>
  );
};

export default Homepage;




