import React, { useState } from "react";
import axios from "axios";

const OwnerSignupForm = () => {
    const [formData, setFormData] = useState({
        owner_name: "",
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/owner/signup", formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div>
            {/* <h2>Owner Signup</h2> */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Owner Name:</label>
                    <input type="text" name="owner_name" onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button className="btn btn-primary" type="submit">Signup</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default OwnerSignupForm;
