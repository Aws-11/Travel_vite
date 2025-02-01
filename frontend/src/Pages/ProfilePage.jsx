import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BookingConfirmation from "../components/bookingPay";
import axios from "axios";
import {QRCodeSVG} from 'qrcode.react';
const ProfilePage = () => {
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const navigate = useNavigate();
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
const [showPayment, setShowPayment] = useState(false);
    // State for form fields and bookings
    const [email, setEmail] = useState(storedUser?.email || "");
    const [password, setPassword] = useState("*******");
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (email) {
            fetchBookingsByEmail(email);
        }
    }, [email]);

    const fetchBookingsByEmail = async () => {
        try {

            const storedUser = JSON.parse(sessionStorage.getItem("user"));
            if (!storedUser || !storedUser.email) {
                setMessage("User not authenticated.");
                return;
            }
    
            const response = await fetch("http://localhost:3000/bookings_by_email", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: storedUser.email }), // <-- Fix here
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch bookings.");
            }
    
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error(error);
            setMessage("Error fetching bookings.");
        }
    };
    

    const getListingData = async (listingID) => {
        try {
            const response = await fetch("https://travel-vite-backend.onrender.com/fetchbasedonid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ listingID: listingID }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch listing data.");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching listing data:", error);
            return null;
        }
    };

    const [listingData, setListingData] = useState({});

    useEffect(() => {
        if (bookings.length > 0) {
            const fetchAllData = async () => {
                const fetchedData = {};
                for (const booking of bookings) {
                    const data = await getListingData(booking.listingID);
                    if (data) {
                        fetchedData[booking.listingID] = data;
                    }
                }
                setListingData(fetchedData);
            };

            fetchAllData();
        }
    }, [bookings]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        
        if (!storedUser || !storedUser.email) {
            setMessage("User not authenticated.");
            return;
        }
    
        if (!/^[\w.-]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/.test(email)) {
            setMessage("Invalid email format.");
            return;
        }
    
        if (password.length < 8 && password !== "*******") {
            setMessage("Password must be at least 8 characters.");
            return;
        }
    
        const updatedData = {
            currentEmail: storedUser.email,  // Send stored user's email for lookup
            newEmail: email.trim() !== storedUser.email ? email.trim() : undefined,
            password: password !== "*******" ? password : undefined,
        };


        fetch("https://travel-vite-backend.onrender.com/user/update", {

            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            setMessage("Profile updated successfully!");
            sessionStorage.setItem("user", JSON.stringify(data.updatedUser));
        })
        .catch(error => {
            console.error("Error updating profile:", error);
            setMessage("An error occurred while updating your profile.");
        });
    };
    

    const handleRestart = () => {
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    const handleRestart2 = () => {
        window.location.reload();
    };

    const deleteBooking = async (bookingId) => {
        const url = "https://travel-vite-backend.onrender.com/del_Booking";
        try {
            const response = await axios.delete(url, {
                data: { _id: bookingId },
            });

            if (response.status === 200) {
                setMessage("Booking deleted successfully!");

                setBookings((prevBookings) => prevBookings.filter((b) => b._id !== bookingId));
            } else {
                setMessage("Failed to delete the booking.");
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            setMessage("An error occurred while deleting the booking.");
        }
    };



    const updateBooking = async (updatedBookingData) => {
        const { _id, checkIn, checkOut, guests, total_price } = updatedBookingData;
    
        if (!_id || !checkIn || !checkOut || guests == null || total_price == null) {
            console.error("All fields (_id, checkIn, checkOut, guests, total_price) are required.");
            return { error: "All fields are required." };
        }
    
        try {
            const response = await fetch("https://travel-vite-backend.onrender.com/update_booking", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id, checkIn, checkOut, guests, total_price }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to update booking:", errorData.message);
                return { error: errorData.message };
            }
    
            const result = await response.json();
            console.log("Booking updated successfully:", result.updatedBooking);
            return result.updatedBooking;
        } catch (error) {
            console.error("Error updating booking:", error);
            return { error: "Failed to update booking due to a network error." };
        }
    };




const handleCheckInChange = async (e, listingID) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];

    if (newDate < today) {
        alert("Check-in date cannot be in the past.");
        return;
    }

    const checkOutDate = bookings.find(booking => booking.listingID === listingID)?.checkOut;
    if (checkOutDate && newDate === checkOutDate) {
        alert("Check-in date cannot be the same as the check-out date.");
        return;
    }

    // Update check-in date in local state
    setBookings((prevBookings) =>
        prevBookings.map((booking) =>
            booking.listingID === listingID ? { ...booking, checkIn: newDate } : booking
        )
    );

    // Find the updated booking data
    const updatedBooking = bookings.find(booking => booking.listingID === listingID);
    const pricePerNight = listingData[listingID]?.Price || 0;
    const numberGuests = updatedBooking.guests;

    // Calculate the new total price
    const newTotalPrice = await calculateTotalPrice(newDate, updatedBooking.checkOut, pricePerNight, numberGuests);

    // Send the updated data to the database
    const updatedBookingData = await updateBooking({
        ...updatedBooking,
        checkIn: newDate,
        total_price: newTotalPrice, // Update the total price in the database
    });

    if (!updatedBookingData.error) {
        console.log("Booking updated with new total price", updatedBookingData);
    } else {
        alert("Failed to update booking.");
    }
};


const handleCheckOutChange = async (e, listingID) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];

    if (newDate < today) {
        alert("Check-out date cannot be in the past.");
        return;
    }

    const checkInDate = bookings.find(booking => booking.listingID === listingID)?.checkIn;
    if (checkInDate && newDate === checkInDate) {
        alert("Check-out date cannot be the same as the check-in date.");
        return;
    }

    // Update check-out date in local state
    setBookings((prevBookings) =>
        prevBookings.map((booking) =>
            booking.listingID === listingID ? { ...booking, checkOut: newDate } : booking
        )
    );

    // Find the updated booking data
    const updatedBooking = bookings.find(booking => booking.listingID === listingID);
    const pricePerNight = listingData[listingID]?.Price || 0;
    const numberGuests = updatedBooking.guests;

    // Calculate the new total price
    const newTotalPrice = await calculateTotalPrice(updatedBooking.checkIn, newDate, pricePerNight, numberGuests);

    // Send the updated data to the database
    const updatedBookingData = await updateBooking({
        ...updatedBooking,
        checkOut: newDate,
        total_price: newTotalPrice, // Update the total price in the database
    });

    if (!updatedBookingData.error) {
        console.log("Booking updated with new total price", updatedBookingData);
    } else {
        alert("Failed to update booking.");
    }
};

const handleGuestChange = async (e, listingID) => {
    const newGuest = e.target.value;

    if (isNaN(newGuest) || newGuest < 1) {
        alert("Guests must be a valid number and at least 1.");
        return;
    }

    // Update guest count in local state immediately
    setBookings((prevBookings) =>
        prevBookings.map((booking) =>
            booking.listingID === listingID ? { ...booking, guests: newGuest } : booking
        )
    );

    // Find the updated booking data from local state (after the update)
    const updatedBooking = {
        ...bookings.find(booking => booking.listingID === listingID),
        guests: newGuest
    };

    // Calculate the new total price with the new guest count
    const newTotalPrice = await calculateTotalPrice(updatedBooking.checkIn, updatedBooking.checkOut, listingData[listingID]?.Price || 0, newGuest);

    // After calculating total price, update it in the database
    const updatedBookingData = await updateBooking({
        ...updatedBooking,
        total_price: newTotalPrice,
    });

    if (!updatedBookingData.error) {
        console.log("Booking updated with new total price", updatedBookingData);
    } else {
        alert("Failed to update booking.");
    }
};


const calculateTotalPrice = (checkInDate, checkOutDate, pricePerNight, numberGuests) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const dateDiff = Math.max(0, (checkOut - checkIn) / (1000 * 60 * 60 * 24)); // Calculate the number of days
    const newTotalPrice = dateDiff * pricePerNight * numberGuests; 
    return newTotalPrice;

};


    const formatDate = (date) => {
        if (!date) return "2024-01-01";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <Navbar />
            <div className="bg-neutral-900 min-h-screen text-white">
                <div className="container mx-auto p-6">
                    <h1 className="text-4xl font-bold text-center mb-6">Your Profile</h1>
                    {message && <p className="text-red-500 text-center">{message}</p>}

                    <form onSubmit={(e) => { handleSubmit(e); handleRestart(e)}} className="bg-neutral-800 p-6 rounded shadow-md max-w-lg mx-auto">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-white">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-neutral-700 text-white"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-white">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-neutral-700 text-white"
                            />
                            <small className="text-gray-400">Leave unchanged if you don't want to update the password.</small>
                        </div>
                        <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">Update Profile</button>
                    </form>

                    <h2 className="text-3xl font-semibold text-white mt-12 mb-6">Your Bookings</h2>
                    {bookings.length > 0 ? (
                        <ul className="space-y-6">
                            {bookings.map((booking) => (
                                <li key={booking._id} className="bg-neutral-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white">Hotel Name: {listingData[booking.listingID]?.Listname || "Loading..."}</h3>
                                        <p className="text-sm text-gray-400"><strong>Booking ID:</strong> {booking._id}</p>

                                        <div className="my-4">
                                            <p><strong>Check-in:</strong></p>
                                              { !booking.payed ?  <input
                                                    type="date"
                                                    value={formatDate(booking.checkIn)}
                                                    onChange={(e) => handleCheckInChange(e, booking.listingID)}
                                                    className="mt-2 p-2 border border-gray-600 rounded bg-neutral-700 text-white"
                                                /> : <p>  {formatDate(booking.checkIn)}</p> }
                                            
                                            <p><strong>Check-out:</strong> </p>
                                                {  !booking.payed ?  <input
                                                    type="date"
                                                    value={formatDate(booking.checkOut)}
                                                    onChange={(e) => handleCheckOutChange(e, booking.listingID)}
                                                    className="mt-2 p-2 border border-gray-600 rounded bg-neutral-700 text-white"
                                                />  : <p>  {formatDate(booking.checkOut)}</p> }
                                           
                                            <p><strong>Number of guests:</strong></p>
                                                {  !booking.payed ? <input
                                                    type="number"
                                                    value={booking.guests}
                                                    onChange={(e) => handleGuestChange(e, booking.listingID)}
                                                    className="mt-2 p-2 border border-gray-600 rounded bg-neutral-700 text-white"
                                                />  : <p>  {(booking.guests)}</p>  }
                                            
                                            <p><strong>Price for one night:</strong> {listingData[booking.listingID]?.Price}</p>
                                            <p><strong>Total Price:</strong> <strong>€{booking.total_price}</strong></p>
                                        </div>

                                        <div className="flex space-x-4">
                                            {  !booking.payed && <button onClick={handleRestart2} className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">Update Data</button>}
                                           {  !booking.payed && <button onClick={() => deleteBooking(booking._id)} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Delete Booking</button> }
                                            {!booking.payed && (
                                                             <button
                                                            onClick={() => {
                                                                setSelectedBookingId(booking._id);
                                                                setShowPayment(true);
                                                                }}
                                                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                                                                Pay
                                                            </button>
                                                            )}

                                            <button className="bg-green-500 text-white"> {booking.payed && "payed"} </button>
                                           {  booking.payed && <div>
                                                <QRCodeSVG
                                                level="Q"
                                                style={{ width: 126 }}
                                                value={JSON.stringify({
                                                    bookingID: booking._id,
                                                    bookingcheckIn: booking.checkIn,
                                                    bookingcheckOut: booking.checkOut,
                                                    bookingguests: booking.guests,
                                                    bookingtotal_price: booking.total_price,
                                                    bookingPayed: booking.payed,
                                                    info: "show this qr to the hotel staff"
                                                })}/> <p>Provide this QR code to the hotel staff</p></div>
                                                }

                                            
                                        </div>
                                                
                                    </div>
                                           
                                    <img
                                        src={`/images/${booking.listingID}.jpg`}
                                        alt="hotel-photo"
                                        className="mt-4 md:mt-0 md:ml-6 w-64 h-64 object-cover rounded-lg"
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
                <Footer />
                {showPayment && <BookingConfirmation onClose={() => setShowPayment(false)} bookingId={selectedBookingId} />}
            </div>
        </>
    );
};

export default ProfilePage;
