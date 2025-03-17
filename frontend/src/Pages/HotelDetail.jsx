import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import BookingConfirmation from "../components/bookingPay";


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
        guests_adults: 1,
        guests_children: 0,
        booked_rooms: 1
    });

    

const [clicked, setClicked] = useState(false);
const [bookingBool, setBookingBool] = useState(false);
const [collorstate, seCollorstate] = useState(true);
const [selected, setSelected] = useState(null);
const [Rooms, setRooms] = useState(0);
const minValue = 1;
const [Adults, setAdults] = useState(0);
const [Children, setChildren] = useState(0);
    const [photos, setPhotos] = useState({}); 

    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    useEffect(() => {
        // Fetch the hotel details by ID
        const fetchHotelDetails = async () => {
            try {
                const response = await fetch(`https://travel-vite-backend.onrender.com/hotels/${id}`);
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
        navigate("/login");
    };

    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const dateDiff = Math.max(0, (checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const adults = bookingDetails.guests_adults ;
    const children = bookingDetails.guests_children || 0;
    const rooms = bookingDetails.booked_rooms ;
    
    const totalGuestsPrice = adults + children * 0.5;
    const totalp = hotel && hotel.Price ? dateDiff * hotel.Price * totalGuestsPrice * rooms : 0;
  

    const handleBooking = async () => {
        if (!isLoggedIn) {
            alert("You need to log in to make a booking!");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("https://travel-vite-backend.onrender.com/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: storedUser.email,
                    listingID: id,
                    checkIn: bookingDetails.checkInDate,
                    checkOut: bookingDetails.checkOutDate,
                    guests_adults: bookingDetails.guests_adults,
                    guests_children: bookingDetails.guests_children,
                    booked_rooms: bookingDetails.booked_rooms,
                    total_price: totalp,
                    payed: false,
                }),
            });

            if (response.ok) {
                setBookingBool(true);
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
        setClicked(!clicked);
    };


const maxVal = 20;
const maxValChildren = 10;
const maxValRooms = 10;



const handleIncrement = (type) => {
    switch (type) {
case "rooms":
    setRooms(prevRooms => {
        const newRooms = Math.min(maxValRooms, prevRooms + 1);
        setBookingDetails(prev => ({ ...prev, booked_rooms: newRooms }));
        return newRooms;
    });
    break;

case "adults":
    setAdults(prevAdults => {
        const newAdults = Math.min(maxVal, prevAdults + 1);
        setBookingDetails(prev => ({ ...prev, guests_adults: newAdults }));
        return newAdults;
    });
    break;
    case "children":
        setChildren(prevChildren => {
            const newChild = Math.min(maxValChildren, prevChildren + 1);
            setBookingDetails(prev => ({ ...prev, guests_children: newChild }));
            return newChild;
        });
        break;
    default:
        break;
};

};




const handleDecrement = (type) => {
    switch (type) {
case "rooms":
    setRooms(prevRooms => {
        const newRooms = Math.max(1, prevRooms - 1);
        setBookingDetails(prev => ({ ...prev, booked_rooms: newRooms }));
        return newRooms;
    });
    break;

case "adults":
    setAdults(prevAdults => {
        const newAdults = Math.max(1, prevAdults - 1);
        setBookingDetails(prev => ({ ...prev, guests_adults: newAdults }));
        return newAdults;
    });
    break;
    case "children":
        setChildren(prevChildren => {
            const newChild = Math.max(0, prevChildren - 1);
            setBookingDetails(prev => ({ ...prev, guests_children: newChild }));
            return newChild;
        });
        break;
    default:
        break;
};

};





    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
        );
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
        );
    };


    return (
        <>    
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="min-h-screen bg-neutral-900 text-white p-20">
                <div className="container mx-auto py-10 px-6 lg:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Hotel Image Section (Carousel) */}
                        <div className="relative w-full">
                            {hotel.images && hotel.images.length > 0 ? (
                                <div className="relative">
                                    <img
                                        src={hotel.images[currentImageIndex]}
                                        alt={`Hotel Image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover rounded-lg shadow-lg"
                                    />
                                    {/* Left Button */}
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-white p-8 rounded-full transition-all hover:bg-opacity-100"
                                    >
                                        <i className="fas fa-chevron-left text-xl"></i>
                                    </button>
                                    {/* Right Button */}
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-white p-8 rounded-full transition-all hover:bg-opacity-100"
                                    >
                                        <i className="fas fa-chevron-right text-xl"></i>
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center bg-gray-700 text-white rounded-lg">
                                    No Image Available
                                </div>
                            )}

                        </div>

                       
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
                                            <span className="text-sm font-medium">Guests Adults </span>
                                                <br />

                                                
                                                <button onClick={() => handleDecrement("adults")} id="1h"  className={`px-4 py-2 border`}>-</button>
                                            <button  id="2h" className={`px-4 py-2 border`}>{Adults}</button>
                                            <button onClick={() => handleIncrement('adults')} id="3h" className={`px-4 py-2 border`}>+</button>

  
                                        </label>
                               <label className="block">
                                            <span className="text-sm font-medium">Guests Children</span>
                                            <br />
                                            <button onClick={() => handleDecrement("children")} id="1h"  className={`px-4 py-2 border`}>-</button>
                                            <button  id="2h" className={`px-4 py-2 border`}>{Children }</button>
                                            <button onClick={() => handleIncrement('children')} id="3h" className={`px-4 py-2 border`}>+</button>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium">Rooms</span>
                                            <br />
                                            <button onClick={() => handleDecrement("rooms")} id="1h"  className={`px-4 py-2 border`}>-</button>
                                            <button  id="2h" className={`px-4 py-2 border`}>{Rooms}</button>
                                            <button onClick={() => handleIncrement('rooms')} id="3h" className={`px-4 py-2 border`}>+</button>
                                        </label>
                                       
                                        <button
                                            onClick={() => { handleBooking(); handleClick(); setBookingDetails({ ...bookingDetails, booked_rooms: Rooms })}}
                                            className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                                        >
                                            Confirm Booking
                                        </button>


                                    </div>                 


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
                {bookingBool && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-md">
                        <div className="bg-neutral-800 p-8 rounded-lg shadow-xl max-w-md w-full">

                            <h2 className="text-3xl font-bold text-white mb-6 text-center">Continue with payment in the Profile Tab</h2>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Proceed to the Profile Tab
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default HotelDetail;
