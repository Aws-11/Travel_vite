import React, { useEffect, useState } from "react";
import Sidebar from '../components/SideBar';

const ManageHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch hotels
    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await fetch("http://localhost:3000/showlist");
            const data = await response.json();
            setHotels(data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    // Delete hotel
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hotel?")) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/admin/delete-hotel/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });

            if (response.ok) {
                setHotels(hotels.filter(hotel => hotel._id !== id));
                alert("Hotel deleted successfully!");
            } else {
                const data = await response.json();
                alert("Error deleting hotel: " + data.error);
            }
        } catch (error) {
            console.error("Error deleting hotel:", error);
        } finally {
            setLoading(false);
        }
    };

    // Edit hotel (Redirect to edit page)
    const handleEdit = (id) => {
        window.location.href = `/admin/edit-hotel/${id}`;
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 flex-1">
                <h1 className="text-3xl font-bold">Manage Hotels</h1>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map(hotel => (
                        <div key={hotel._id} className="border p-4 rounded-md shadow-md">
                            <h2 className="text-xl font-semibold">{hotel.Listname}</h2>
                            <p>{hotel.City}, {hotel.Country}</p>
                            <p>Price: ${hotel.Price} per night</p>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleEdit(hotel._id)}
                                    className="bg-blue-500 text-white px-3 py-2 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(hotel._id)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageHotels;
