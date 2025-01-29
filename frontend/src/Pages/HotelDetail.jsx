import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HotelDetail = () => {
    const { id } = useParams(); // Get the hotel _id from the URL
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const [isLoggedIn, setIsLoggedIn] = useState(!!storedUser); // Detect login state
    const [bookingDetails, setBookingDetails] = useState({
        checkInDate: "",
        checkOutDate: "",
        guests: 1,
    });
const [clicked, setClicked] = useState(false);
const [bookingBool, setBookingBool] = useState(false);

    useEffect(() => {
        // Fetch the hotel details by ID
        const fetchHotelDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/hotels/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch hotel details");
                }
                const data = await response.json();
                setHotel(data);
            } catch (error) {
                console.error("Error fetching hotel details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelDetails();
    }, [id]);

    const login = () => {
        navigate("/login")
    }

    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const dateDiff = Math.max(0, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalp = hotel && hotel.Price ? dateDiff * hotel.Price : 0;

    const handleBooking = async () => {
        if (!isLoggedIn) {
            alert("You need to log in to make a booking!");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: storedUser.email,
                    listingID: id,
                    checkIn: bookingDetails.checkInDate,
                    checkOut: bookingDetails.checkOutDate,
                    guests: bookingDetails.guests,
                    total_price: totalp,
                }),
            });

            if (response.ok) {
                alert("Booking successful!");
                setBookingBool(true);
                navigate("/");
            } else {
                const errorData = await response.json();
                alert(`Booking failed: ${errorData.error || "Please try again."}`);
            }
        } catch (error) {
            console.error("Error making booking:", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <div className="flex justify-center items-center h-screen bg-neutral-900 text-white">
                    <p className="text-xl">Loading hotel details...</p>
                </div>
                <Footer />
            </div>
        );
    }




    const handleClick = () => {
        if (!clicked) {
          setClicked(true);     
        }else(setClicked(false));
      };


    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="min-h-screen bg-neutral-900 text-white p-20">
                <div className="container mx-auto py-10 px-6 lg:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Hotel Image Section */}
                        <div>
                            <img
                                src={`/images/${id}.jpg`}
                                alt={`Hotel ${hotel.Listname}`}
                                className="rounded-lg shadow-lg w-full h-96 object-cover"
                            />
                        </div>

                        {/* Hotel Details Section */}
                        <div>
                            <h1 className="text-4xl font-bold text-white">{hotel.Listname}</h1>
                            <p className="text-lg mt-4">
                                <strong>Country:</strong> {hotel.Country}
                            </p>
                            <p className="text-lg">
                                <strong>City:</strong> {hotel.City}
                            </p>
                            <p className="text-lg">
                                <strong>Price per Night:</strong> ${hotel.Price}
                            </p>
                            <p className="text-lg">
                                <strong>Rooms:</strong> {hotel.Rooms}
                            </p>
                            <p className="mt-6 text-lg text-gray-300">
                                <strong>Description:</strong> {hotel.Description}
                            </p>

                            {/* Booking Form */}
                            {isLoggedIn ? (
                                <div className="mt-12 bg-neutral-800 p-6 rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>
                                    <div className="grid gap-4">
                                        <label className="block">
                                            <span className="text-sm font-medium">Check-In Date</span>
                                            <input
                                                type="date"
                                                value={bookingDetails.checkInDate}
                                                min={new Date().toISOString().split("T")[0]} // Restrict past dates
                                                onChange={(e) =>
                                                    setBookingDetails({
                                                        ...bookingDetails,
                                                        checkInDate: e.target.value,
                                                    })
                                                }
                                                className="mt-1 block w-full border rounded-md py-2 px-3 bg-neutral-700 text-white"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium">Check-Out Date</span>
                                            <input
                                                type="date"
                                                value={bookingDetails.checkOutDate}
                                                onChange={(e) =>
                                                    setBookingDetails({
                                                        ...bookingDetails,
                                                        checkOutDate: e.target.value,
                                                    })
                                                }
                                                className="mt-1 block w-full border rounded-md py-2 px-3 bg-neutral-700 text-white"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium">Guests</span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={bookingDetails.guests}
                                                onChange={(e) =>
                                                    setBookingDetails({
                                                        ...bookingDetails,
                                                        guests: parseInt(e.target.value, 10),
                                                    })
                                                }
                                                className="mt-1 block w-full border rounded-md py-2 px-3 bg-neutral-700 text-white"
                                            />
                                        </label>
                                        <button
                                            onClick={() => { handleBooking(); handleClick(); }}
                                            className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                                        >
                                            Confirm Booking 
                                        </button>
                                    </div>
                                   
                                      {/*  <div style={{ bookingBool ? display: clicked ? "block" : "none" : console.log("hi")}}>Booking Confirmed!

                                        </div> */}
                                    
                                </div>
                            ) : (
                                <div className="mt-12 bg-neutral-800 p-6 rounded-lg shadow-lg text-center">
                                    <p className="text-lg">
                                        Please{" "}
                                        <button
                                            onClick={login}
                                            className="text-orange-500 underline hover:text-orange-700"
                                        >
                                            log in
                                        </button>{" "}
                                        to book this hotel.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default HotelDetail;
