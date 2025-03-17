import React, { useEffect, useState } from "react";
import Sidebar from '../components/SideBar';

const ManageHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const hotelsPerPage = 6; // Show only 6 hotels per page

    // Fetch hotels
    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const response = await fetch("https://travel-vite-backend.onrender.com/showlist");
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
            const response = await fetch(`https://travel-vite-backend.onrender.com/admin/delete-hotel/${id}`, {
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

    // Filter hotels by input search
    const filteredHotels = hotels.filter((hotel) => 
        input.length === 0 || hotel.Listname?.toLowerCase().includes(input.toLowerCase())
    );

    // Pagination: Calculate which hotels to show
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

    // Pagination: Go to the previous page
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Pagination: Go to the next page
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredHotels.length / hotelsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 flex-1">
                <h1 className="text-3xl font-bold">Manage Hotels</h1>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search by listing name" 
                    className="bg-gray-100 border border-gray-300 text-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {currentHotels.length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentHotels.map(hotel => (
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
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No hotels found matching the criteria.
                    </p>
                )}

                {/* Pagination Controls */}
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

export default ManageHotels;
