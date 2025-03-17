import React, { useEffect, useState } from "react";
import Sidebar from '../components/SideBar';
import axios from 'axios'; // Import axios

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://travel-vite-backend.onrender.com/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        const token = sessionStorage.getItem('token'); // Get the token from sessionStorage
        if (!token) {
            console.error("No token found. User not authenticated.");
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`https://travel-vite-backend.onrender.com/admin/userdel/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the headers
                }
            });

            setUsers(users.filter(user => user._id !== id));
            alert("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            if(error.response && error.response.data){
                alert(error.response.data.error || "Error deleting user");
            } else {
                alert("Error deleting user");
            }

        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        input.length === 0 || user.email?.toLowerCase().includes(input.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 flex-1">
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search by user email"
                    className="bg-gray-100 border border-gray-300 text-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {currentUsers.length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentUsers.map(user => (
                            <div key={user._id} className="border p-4 rounded-md shadow-md">
                                <h2 className="text-xl font-semibold">{user.listingID}</h2>
                                <p>User email: {user.email} </p>
                                <p>Username: {user.username}</p>
                                <p>User ID: {user._id} </p>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="bg-red-500 text-white px-3 py-2 rounded-md"
                                        disabled={loading}
                                    >
                                        {loading ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No users found matching the criteria.
                    </p>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        onClick={prevPage}
                        className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextPage}
                        className="px-4 py-2 mx-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;