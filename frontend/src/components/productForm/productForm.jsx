import React, { useState } from "react";
// Import useQueryClient to access the cache
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "./productForm.css";

// 💡 Pass a new prop 'onSubmissionSuccess' to close the form and handle logic
const ProductForm = ({ ownerId, onSubmissionSuccess }) => {
    // Access the query client for cache invalidation
    const queryClient = useQueryClient();
    
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [photo, setPhoto] = useState(null);
    const [shopName, setShopName] = useState("");
    const [category, setCategory] = useState(""); 

    const CATEGORIES = [
    "Mobile", 
    "Processor (CPU)",
    "Motherboard",
    "Graphics Card (GPU)",
    "Memory (RAM)",
    "Storage",
    "Power Supply (PSU)",
    "Cabinet / Case",
    "Cooling System",
    "Acessories",
    "Other"
];





    const mutation = useMutation({
        mutationFn: async (newProduct) => {
            const formData = new FormData();
            Object.keys(newProduct).forEach((key) => {
                formData.append(key, newProduct[key]);
            });
            
            const response = await axios.post("http://localhost:5000/products", formData);
            return response.data;
        },
        
        onSuccess: () => {
            // 1. Invalidate the cache to trigger ProductList re-fetch
            queryClient.invalidateQueries(["products", ownerId]); 
            
            alert("Product added successfully!");
            
            // 2. Call the prop function to close the form in the parent component
            onSubmissionSuccess(); 

            // Reset local state (optional, as the form closes)
            setProductName("");
            setDescription("");
            setPrice("");
            setPhoto(null);
            setShopName("");
            setCategory(""); 
        },
        onError: (error) => {
            const errorMessage = error.response?.data || error.message;
            alert(`Error adding product: ${errorMessage}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!photo) {
            alert("Please upload a product photo.");
            return;
        }
        const newProduct = {
            product_name: productName,
            description,
            price,
            photo,
            // 💡 Fix: The prop is called 'ownerId', but the backend expects 'owner_id'. 
            // We ensure we send 'owner_id' to match the backend controller's req.body structure.
            owner_id: ownerId, 
            shop_name: shopName,
            category, 
        };
        mutation.mutate(newProduct);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Product</h2>
            <div className="form-wrapper">
                <label>Product Name:</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
            </div>
            <div className="form-wrapper">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className="form-wrapper">
                <label>Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="form-wrapper">
                <label>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="form-select"
                >
                    <option value="" disabled>Select a Category</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="form-wrapper">
                <label>Photo:</label>
                <input
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    required
                />
            </div>
            <div className="form-wrapper">
                <label>Shop Name:</label>
                <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                />
            </div>
            <button className="btn btn-primary" type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Adding..." : "Add Product"}
            </button>
            {mutation.isError && (
                <p style={{ color: "red" }}>Error: {mutation.error.message}</p>
            )}
            {mutation.isSuccess && <p style={{ color: "green" }}>Product added successfully!</p>}
        </form>
    );
};

export default ProductForm;