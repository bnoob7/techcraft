import React, { useState } from "react";
import axios from "axios";
import './signupForm.css';

const SignupForm = () => {
    const [customer, setCustomer] = useState({ name: "", email: "", password: "", contact_number: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/customers/signup", customer);
            setMessage(response.data.message);
            setCustomer({ name: "", email: "", password: "", contact_number: "" });
        } catch (error) {
            setMessage(error.response?.data || "An error occurred!");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="name" value={customer.name} onChange={handleChange} placeholder="Name" required />
                <input name="email" value={customer.email} onChange={handleChange} placeholder="Email" required />
                <input name="password" value={customer.password} onChange={handleChange} placeholder="Password" required />
                <input name="contact_number" value={customer.contact_number} onChange={handleChange} placeholder="Contact" required />
                <button className="btn-primary" type="submit">Signup</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignupForm;
