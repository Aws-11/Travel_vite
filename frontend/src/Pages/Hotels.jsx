import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Slider from "react-slider";

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [minPrice, setMinPrice] = useState(50);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableTo, setAvailableTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const hotelsPerPage = 6; // Show only 6 hotels per page

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch("http://localhost:3000/showlist");
                if (!response.ok) {
                    throw new Error("Failed to fetch hotels data");
                }
                const data = await response.json();
                setHotels(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-lg text-neutral-600">Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    // Filter hotels based on location, price, and availability dates
    const filteredHotels = hotels.filter((hotel) => {
        const fromDate = new Date(availableFrom);
        const toDate = new Date(availableTo);
        const availableFromDate = new Date(hotel.AvailableFrom[0]);
        const availableToDate = new Date(hotel.AvailableTo[0]);

        return (
            (location.length < 3 || hotel.City.toLowerCase().includes(location.toLowerCase())) &&
            hotel.Price >= minPrice &&
            hotel.Price <= maxPrice &&
            (availableFrom ? availableFromDate <= fromDate : true) &&
            (availableTo ? availableToDate >= toDate : true)
        );
    });

    // Paginate hotels based on currentPage and hotelsPerPage
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

    const handleChange = (values) => {
        setMinPrice(values[0]);
        setMaxPrice(values[1]);
    };

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



                        {/* Date Filters */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                        <label
                            htmlFor="availableFrom"
                            className="text-sm font-medium mb-2"
                        >
                            Available From:
                        </label>
                        <input
                            type="date"
                            value={availableFrom}
                            onChange={(e) => setAvailableFrom(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                        />

                        <label
                            htmlFor="availableTo"
                            className="text-sm font-medium mb-2"
                        >
                            Available To:
                        </label>
                        <input
                            type="date"
                            value={availableTo}
                            onChange={(e) => setAvailableTo(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                        />
                    </div>






                    {/* Price Filter */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <label
                            htmlFor="price"
                            className="text-sm font-medium mb-2"
                        >
                            Price Range: ${minPrice} - ${maxPrice}
                        </label>
                        <Slider
                            min={50}
                            max={1000}
                            step={1}
                            value={[minPrice, maxPrice]}
                            onChange={handleChange}
                            className="w-full"
                            renderTrack={(props, state) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(to right, #1e3a8a, #0f172a)',
                                    }}
                                />
                            )}
                            renderThumb={(props, state) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '50%',
                                        background: '#1e40af',
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                    }}
                                />
                            )}
                        />
                        <div className="flex justify-between w-full mt-2 pt-4">
                            <span>Min Price: ${minPrice}</span>
                            <span>Max Price: ${maxPrice}</span>
                        </div>
                    </div>

                   
                </div>

                {/* Hotel List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentHotels.length > 0 ? (
                        currentHotels.map((hotel) => (
                            <div
                                key={hotel._id}
                                className="border rounded-lg shadow-md overflow-hidden bg-white"
                            >
                                <img
                                    src={`/images/${hotel._id}.jpg`}
                                    alt={`${hotel.Listname} photo`}
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

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={prevPage}
                        className="px-4 py-2 mx-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextPage}
                        className="px-4 py-2 mx-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    >
                        Next
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Hotels;
