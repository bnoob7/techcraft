import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import "./productForm.css";

const ProductForm = ({ owner_id }) => {
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [photo, setPhoto] = useState(null);
    const [shopName, setShopName] = useState("");

    // React Query mutation for adding a new product
    const mutation = useMutation({
        mutationFn: async (newProduct) => {
            // Sending POST request to the backend
            const formData = new FormData();
            Object.keys(newProduct).forEach((key) => {
                formData.append(key, newProduct[key]);
            });
            const response = await axios.post("http://localhost:5000/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            return response.data;
        },
        
        
        onSuccess: () => {
            alert("Product added successfully!");
            // Optionally reset the form
            setProductName("");
            setDescription("");
            setPrice("");
            setPhoto(null);
            setShopName("");
        },
        onError: (error) => {
            alert(`Error adding product: ${error.message}`);
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
            owner_id,
            shop_name: shopName,
        };
        mutation.mutate(newProduct); // Trigger the mutation
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
