import React, { useState } from "react";
import axios from "axios";

const AdminSignup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/admin/signup", { name, email, password });
            alert(response.data.message);
        } catch (err) {
            console.error(err);
            alert("Error signing up. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* <h2>Admin Signup</h2> */}
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="btn btn-primary" type="submit">Signup</button>
        </form>
    );
};

export default AdminSignup;
