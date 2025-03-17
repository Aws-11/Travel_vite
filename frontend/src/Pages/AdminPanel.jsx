import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
const AdminPanel = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);


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
