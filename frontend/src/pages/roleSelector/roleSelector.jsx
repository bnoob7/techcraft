import React, { useState } from "react";
import AdminLoginForm from "../../components/adminForm/adminLogin";
import AdminSignupForm from "../../components/adminForm/adminSignup";
import OwnerLoginForm from "../../components/ownerForm/ownerLoginForm";
import OwnerSignupForm from "../../components/ownerForm/ownerSignupForm";
import CustomerLoginForm from "../../components/customerForm/loginForm";
import CustomerSignupForm from "../../components/customerForm/signupForm";


import './roleSelector.css'

const RoleSelector = () => {
    const [selectedRole, setSelectedRole] = useState("customer"); // Default role
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

    const renderForm = () => {
        switch (selectedRole) {
            case "admin":
                return isLogin ? <AdminLoginForm /> : <AdminSignupForm />;
            case "customer":
                return isLogin ? <CustomerLoginForm /> : <CustomerSignupForm />;
            case "owner":
                return isLogin ? <OwnerLoginForm /> : <OwnerSignupForm />;
            default:
                return null;
        }
    };

    return (
        <div className="wrapper">
            <div className="img-wrapper">

            </div>
            <div className="content-wrapper">
            <h1>
                {isLogin ? "Login" : "Signup"} as{" "}
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </h1>
            <div className="role-select">
                <label htmlFor="role-select">Select Role:</label>
                <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                    <option value="owner">Owner</option>
                </select>
            </div>
            <div className="form">{renderForm()}</div>
            <button className="btn btn-danger toggle-button" onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? "Signup" : "Login"}
            </button>
            </div>
        </div>
    );
};

export default RoleSelector;
