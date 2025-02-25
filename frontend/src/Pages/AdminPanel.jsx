import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
const AdminPanel = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:3000/profile", {
                    credentials: "include",
                });
                const data = await response.json();

                if (data.user && data.user.role === "admin") {
                    setIsAdmin(true);
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                navigate("/");
            }
        };
        fetchProfile();
    }, [navigate]);

    if (!isAdmin) return null;

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 flex-1">
                <h1 className="text-4xl font-bold">Welcome, Admin!</h1>
                <p className="mt-4 text-lg">Manage hotel listings, edit details, and add new accommodations.</p>
            </div>
        </div>
    );
};

export default AdminPanel;
