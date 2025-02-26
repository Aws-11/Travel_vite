import React, { useEffect, useState } from "react";
import Sidebar from '../components/SideBar';


const ManageBookings = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput]=useState("");
    // Fetch hotels
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch("http://localhost:3000/showbook");
            const data = await response.json();
            setHotels(data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };

    // Delete hotel
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Booking?")) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/admin/delete-book/${id}`, {
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
    const filteredHotels = hotels.filter((hotel) => 
        input.length === 0 || hotel.email?.toLowerCase().includes(input.toLowerCase())
    );
    

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 flex-1">
                <h1 className="text-3xl font-bold">Manage Bookings</h1>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search by user email" 
                    className="bg-gray-100 border border-gray-300 text-gray-900 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                                { filteredHotels.length > 0 ?   (
                                    
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                              {filteredHotels.map(hotel => (
                        <div key={hotel._id} className="border p-4 rounded-md shadow-md">
                            <h2 className="text-xl font-semibold">{hotel.listingID}</h2>
                           
                            <p>Booking email: {hotel.email} </p>
                            
                            <p>ListingID: {hotel.listingID} </p>
                            <div className="mt-4 flex gap-2">
                               
                                <button
                                    onClick={() => handleDelete(hotel._id)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                                 {hotel.payed ? (
                                <div className="bg-green-500 text-white p-2">
                                    Payed
                                </div>
                                ) : (
                                <div className="bg-red-500 text-white p-2">
                                    Not payed
                                </div>
                                )
                                } 
                            </div>
                        </div>

                    ))}
                             </div>) :  (
                            <p className="col-span-full text-center text-gray-500">
                             No hotels found matching the criteria
                              </p>
                         )}
            </div>
        </div>
    );
};

export default ManageBookings;
