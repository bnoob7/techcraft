import { useState } from "react";
import ProductForm from "../productForm/productForm"; // adjust path if different

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import ProductForm from "./productForm.jsx";
import "./productList.css"

const fetchProducts = async (ownerId) => {
    const response = await axios.get(`http://localhost:5000/products?owner_id=${ownerId}`);
    return response.data;
};


const ProductList = ({ ownerId }) => {

    const [showForm, setShowForm] = useState(false);

    const handleAddProductClick = () => {
        setShowForm((prev) => !prev);
    };







    const { data, isLoading, error } = useQuery({
        queryKey: ["products", ownerId],
        queryFn: () => fetchProducts(ownerId),
    });

    if (isLoading) return <p>Loading...</p>;
    // Check if data is available before mapping
    if (error || !data) return <p>Error fetching products or no data available: {error?.message}</p>;
    

    // Define the base URL for the images (must match your Express static setup)
    const BASE_IMAGE_URL = "http://localhost:5000/";

    return (
        <div className="product_list">
            <div className="head">
                <h1>Product List</h1>
                <button onClick={handleAddProductClick}>
                    {showForm ? "Close Form" : "Add Product"}
                </button>
            </div>

            <div className="form_wrapper">
                {showForm && <ProductForm className="product_form" ownerId={ownerId} onSubmissionSuccess={handleAddProductClick}/>}
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Image</th> {/* Changed header for clarity */}
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Owner ID</th>
                        <th>Shop Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((product) => (
                        <tr className="pid" key={product.product_id}>
                            <td className="pid" >{product.product_id}</td>

                            {/* 💡 CHANGE 1: Create the cell for the image */}
                            <td>
                                {product.photo ? (
                                    <img
                                        // The 'photo' path is 'uploads/filename.jpg'. 
                                        // We prepend the base URL for the server to load it.
                                        className="image"
                                        src={`${BASE_IMAGE_URL}${product.photo}`}
                                        alt={product.product_name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>

                            <td>{product.product_name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.owner_id}</td>
                            <td>{product.shop_name}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;





// while the button is clicked, i want you to show the productForm .jsx. i ve already created the productForm.jsx, you just import and create a function on click.


