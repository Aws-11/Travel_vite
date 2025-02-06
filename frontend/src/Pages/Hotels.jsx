import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [maxPrice, setMaxPrice] = useState(500);
    const [photos, setPhotos] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {

                const response = await fetch("https://travel-vite-backend.onrender.com/showlist");

                if (!response.ok) {
                    throw new Error("Failed to fetch hotels data");
                }
                const data = await response.json();
                setHotels(data);
            } catch (error) {
                console.error("Error fetching hotels data:", error);
                setError("Failed to fetch hotels data");
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch('http://localhost:3000/all-photos');  // Adjusted URL to back-end
                if (!response.ok) {
                    throw new Error("Failed to fetch photos");
                }
                const data = await response.json();
                setPhotos(data);
            } catch (error) {
                console.error("Error fetching photos:", error);
                setError("Failed to fetch photos");
            }
        };

        fetchPhotos();
    }, []);

    const filteredHotels = hotels.filter((hotel) => {
        return (
            (location.length < 3 || hotel.City.toLowerCase().includes(location.toLowerCase())) &&
            hotel.Price <= maxPrice
        );
    });

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 mt-10">
                <h1 className="text-3xl font-semibold text-center mb-8">
                    Our Hotels
                </h1>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    {/* Location Filter */}
                    <input
                        type="text"
                        placeholder="Search by City"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 md:mb-0"
                    />

                    {/* Price Filter */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <label
                            htmlFor="price"
                            className="text-sm font-medium mb-2"
                        >
                            Max Price: ${maxPrice}
                        </label>
                        <input
                            type="range"
                            id="price"
                            min="50"
                            max="1000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Hotel List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel) => (
                            <div
                                key={hotel._id}
                                className="border rounded-lg shadow-md overflow-hidden bg-white">
                                    
                                         <img
                                            src={photos[hotel._id] ? photos[hotel._id] : 'fallback_image_url'} // Fallback if no photo exists
                                            alt={`${hotel.Listname} fallback photo`}
                                            className="h-48 w-full object-cover"
                                        />


                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
                                        {hotel.Listname}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        <strong>Country:</strong> {hotel.Country}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>City:</strong> {hotel.City}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Price:</strong> ${hotel.Price}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4">
                                        <strong>Rooms:</strong> {hotel.Rooms}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        <strong>Description:</strong> {hotel.Description}
                                    </p>
                                    <Link
                                        to={`/hotels/${hotel._id}`}
                                        className="block mt-4 text-center bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">
                            No hotels found matching the criteria.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Hotels;
