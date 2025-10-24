// src/components/Navigation.jsx
import { Link } from "react-router-dom";
// import productList from "./productList";


const Navigation = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/owner">Owner Page</Link>
                </li>
                <li>
                    <Link to="productList">Product List</Link>
                </li>
                <li>
                    <Link to="roleSelector">selectlogin</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
