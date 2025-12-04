import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Package, 
  Store,
  ShoppingBag,
  CheckCircle,
  Truck,
  Shield
} from 'lucide-react';

const ProductDetails = () => {
  const { productId } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  // Mock user ID - Replace with actual user authentication
  const userId = localStorage.getItem('user_id') || '1';

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0); // Scroll to top on new product
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch all products first
      const productResponse = await fetch('http://localhost:5000/products');
      const allProducts = await productResponse.json();
      
      // Find the specific product
      const productInfo = allProducts.find(p => p.product_id.toString() === productId.toString());
      
      if (!productInfo) {
        console.error('Product not found');
        setLoading(false);
        return;
      }
      
      setProduct(productInfo);
      
      // Fetch owner details
      if (productInfo.owner_id) {
        try {
          // NOTE: This endpoint seems to expect owner_id, not shop_name.
          // If it's /owner/:shop_name, this might need adjustment.
          // Assuming an endpoint /owner/:id exists or will be created.
          const ownerResponse = await fetch(`http://localhost:5000/owner/${productInfo.owner_id}`);
          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json();
            setOwnerDetails(ownerData);
          }
        } catch (err) {
          console.error('Error fetching owner:', err);
        }
      }
      
      // Get related products (same category, excluding current)
      if (productInfo.category) {
        const related = allProducts
          .filter(p => 
            p.category === productInfo.category && 
            p.product_id.toString() !== productId.toString()
          )
          .slice(0, 4);
        setRelatedProducts(related);
      }
      
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.product_id,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Product added to cart successfully!');
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setOrderLoading(true);
      const response = await fetch('http://localhost:5000/orders/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userId,
          owner_id: product.owner_id,
          shop_name: product.shop_name,
          items: [{
            product_id: product.product_id,
            quantity: quantity,
            price: product.price
          }],
          total_amount: (parseFloat(product.price) * quantity).toFixed(2),
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Order placed successfully!');
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-dark)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p style={{ color: 'var(--text-para)', fontSize: '18px' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-dark)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Package size={64} color="var(--text-para)" />
        <p style={{ color: 'var(--text-para)', fontSize: '18px' }}>Product not found</p>
      </div>
    );
  }

  const totalPrice = (parseFloat(product.price) * quantity).toFixed(2);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background-dark)',
      paddingBottom: '60px'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--background-elevate)',
        padding: '24px',
        borderBottom: '1px solid var(--grey-900)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-head)',
              cursor: 'pointer',
              padding: 0,
              height: 'auto'
            }}
          >
            <ArrowLeft size={20} />
            <span style={{ fontSize: '16px' }}>Back</span>
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Product Details Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Product Images */}
          <div>
            <div style={{
              backgroundColor: 'var(--background-elevate)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--grey-900)',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '100%',
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background-dark)'
              }}>
                {product.photo ? (
                  <img
                    src={`http://localhost:5000/${product.photo.replace(/\\/g, "/")}`}
                    alt={product.product_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '20px'
                    }}
                  />
                ) : (
                  <Package size={120} color="var(--text-para)" />
                )}
              </div>
            </div>

            {/* Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              {[
                { icon: Truck, text: 'Free Delivery' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: CheckCircle, text: 'Verified Seller' }
              ].map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--background-elevate)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid var(--grey-900)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <IconComponent size={24} color="var(--primary-color)" />
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-para)',
                      textAlign: 'center'
                    }}>
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: 'var(--primary-color)',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                textTransform: 'uppercase'
              }}>
                {product.category}
              </span>
            </div>

            <h1 style={{
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--text-head)',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}>
              {product.product_name}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <span style={{
                fontSize: '42px',
                fontWeight: 700,
                color: 'var(--primary-color)'
              }}>
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span style={{
                fontSize: '16px',
                color: '#4CAF50',
                fontWeight: 600
              }}>
                ● In Stock
              </span>
            </div>

            <div style={{
              padding: '24px',
              backgroundColor: 'var(--background-elevate)',
              borderRadius: '12px',
              border: '1px solid var(--grey-900)',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-head)',
                marginBottom: '12px'
              }}>
                Description
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'var(--text-para)',
                lineHeight: '1.6'
              }}>
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-head)',
                marginBottom: '12px'
              }}>
                Quantity
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: 'var(--background-elevate)',
                    border: '1px solid var(--grey-900)',
                    borderRadius: '8px',
                    color: 'var(--text-head)',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '80px',
                    height: '44px',
                    textAlign: 'center',
                    backgroundColor: 'var(--background-elevate)',
                    border: '1px solid var(--grey-900)',
                    color: 'var(--text-head)',
                    fontSize: '16px',
                    borderRadius: '8px',
                    margin: 0,
                    padding: 0
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: 'var(--background-elevate)',
                    border: '1px solid var(--grey-900)',
                    borderRadius: '8px',
                    color: 'var(--text-head)',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text-head)',
                  marginLeft: '16px'
                }}>
                  Total: ${totalPrice}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-primary"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: addingToCart ? 0.6 : 1
                }}
              >
                <ShoppingCart size={20} />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={orderLoading}
                className="btn-outline"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: orderLoading ? 0.6 : 1
                }}
              >
                <ShoppingBag size={20} />
                {orderLoading ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

            {/* Seller Info */}
            {ownerDetails && (
              <div style={{
                padding: '24px',
                backgroundColor: 'var(--primary-elevate)',
                borderRadius: '12px',
                border: '1px solid var(--grey-900)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--background-elevate)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '2px solid var(--primary-color)'
                  }}>
                    {ownerDetails.photo ? (
                      <img
                        src={`http://localhost:5000/${ownerDetails.photo.replace(/\\/g, "/")}`}
                        alt={ownerDetails.owner_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Store size={30} color="var(--text-para)" />
                    )}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--text-head)',
                      marginBottom: '4px'
                    }}>
                      {product.shop_name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-para)'
                    }}>
                      by {ownerDetails.owner_name}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-para)'
                }}>
                  Company: {ownerDetails.company_name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--text-head)',
              marginBottom: '24px'
            }}>
              Related Products
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.product_id}
                  onClick={() => navigate(`/product/${relatedProduct.product_id}`)}
                  style={{
                    backgroundColor: 'var(--background-elevate)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--grey-900)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
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
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: 'var(--background-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {relatedProduct.photo ? (
                      <img
                        src={`http://localhost:5000/${relatedProduct.photo.replace(/\\/g, "/")}`}
                        alt={relatedProduct.product_name}
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
                  <div style={{ padding: '16px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--text-head)',
                      marginBottom: '8px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {relatedProduct.product_name}
                    </h3>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: 'var(--primary-color)'
                    }}>
                      ${parseFloat(relatedProduct.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;