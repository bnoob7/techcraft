import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./productList.css"

const fetchProducts = async (ownerId) => {
    const response = await axios.get(`http://localhost:5000/products?owner_id=${ownerId}`);
    return response.data;
};


const ProductList = ({ ownerId }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["products", ownerId],
        queryFn: () => fetchProducts(ownerId), // Pass ownerId to the fetch function
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Product List</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Owner ID</th>
                        <th>Shop Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
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
