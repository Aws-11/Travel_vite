import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 flex flex-col py-6 px-4">
            <h1 className="text-2xl font-bold text-center mb-8">Admin Panel</h1>

            <nav className="flex flex-col space-y-4">
                <Link to="/admin" className="hover:bg-gray-700 py-2 px-4 rounded">🏠 Dashboard</Link>
                <Link to="/admin/manage-hotels" className="hover:bg-gray-700 py-2 px-4 rounded">🏨 Manage Hotels</Link>
                <Link to="/admin/add-hotel" className="hover:bg-gray-700 py-2 px-4 rounded">➕ Add Hotel</Link>
                <Link to="/admin/manage-bookings" className="hover:bg-gray-700 py-2 px-4 rounded">📅 Manage Bookings</Link>
                <Link to="/admin/manage-users" className="hover:bg-gray-700 py-2 px-4 rounded">👤 Manage users</Link>
                 <button
                    className="mt-auto bg-green-600 hover:bg-green-700 py-2 px-4 rounded text-white"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                     Go Back to the Website
                </button>
                <button
                    className="mt-auto bg-red-600 hover:bg-red-700 py-2 px-4 rounded text-white"
                    onClick={() => {
                        handleLogout()
                        navigate("/");
                    }}
                >
                    🚪 Logout
                </button>
           
            </nav>
        </div>
    );
};

export default Sidebar;
