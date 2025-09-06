import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./CustomerList.css";


const fetchCustomers = async () => {
    const response = await axios.get("http://localhost:5000/customers");
    return response.data;
};

const CustomerList = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["customers"], // Use queryKey as an object property
        queryFn: fetchCustomers, // Use queryFn as an object property
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Customer List</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.contact_number}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerList;
