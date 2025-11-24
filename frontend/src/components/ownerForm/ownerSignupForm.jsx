import React, { useState } from "react";
import axios from "axios";

const OwnerSignupForm = () => {
    const [formData, setFormData] = useState({
        owner_name: "",
        email: "",
        password: "",
        company_name: ""
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!photo) {
            setMessage("Please select a photo!");
            return;
        }

        try {
            // Create FormData to send file and form data
            const data = new FormData();
            data.append("owner_name", formData.owner_name);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("company_name", formData.company_name);
            data.append("photo", photo);

            const response = await axios.post("http://localhost:5000/owner/signup", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage(response.data.message);
            // Reset form
            setFormData({ owner_name: "", email: "", password: "", company_name: "" });
            setPhoto(null);
            setPhotoPreview("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Owner Name:</label>
                    <input 
                        type="text" 
                        name="owner_name" 
                        value={formData.owner_name}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Company Name:</label>
                    <input 
                        type="text" 
                        name="company_name" 
                        value={formData.company_name}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Photo:</label>
                    <input 
                        type="file" 
                        name="photo" 
                        accept="image/*"
                        onChange={handlePhotoChange} 
                        required 
                    />
                    {photoPreview && (
                        <div>
                            <p>Preview:</p>
                            <img 
                                src={photoPreview} 
                                alt="Preview" 
                                style={{ maxWidth: "200px", maxHeight: "200px" }} 
                            />
                        </div>
                    )}
                </div>
                <button className="btn btn-primary" type="submit">Signup</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default OwnerSignupForm;
