import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // On initial load, check localStorage for a user
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        // 💡 Check if the stored value is not null and not the string "undefined"
        if (storedUser && storedUser !== 'undefined') {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
            }
        }
    }, []);

    // The login function can be called from your login page
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    // The logout function will be used by the header
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // We can navigate here or let the component do it
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);