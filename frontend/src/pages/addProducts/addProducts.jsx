import React, { useState } from 'react';
import './addProducts.css';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null, // Store the selected image
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value, // If file input, store the file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData(); // Create a new FormData object to handle the file upload

    // Append form data, including the file
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('price', formData.price);
    formDataToSubmit.append('stock', formData.stock);
    if (formData.image) {
      formDataToSubmit.append('image', formData.image); // Append the image file
    }

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: formDataToSubmit, // Send form data as body
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Product added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          image: null,
        });
      } else {
        alert(result.error || 'Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An error occurred while adding the product.');
    }
  };

  return (
    <div>
      <h1>TechCraft: Add a New Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Stock Quantity:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Product Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*" // Optional: restrict to image files only
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
