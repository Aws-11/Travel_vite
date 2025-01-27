import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import axios from "axios";

const ProfilePage = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

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

    const fetchBookingsByEmail = async (userEmail) => {
        try {
            const response = await fetch("http://localhost:3000/bookings_by_email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userEmail }),
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
            const response = await fetch("http://localhost:3000/fetchbasedonid", {
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

        if (!/^[\w.-]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/.test(email)) {
            setMessage("Invalid email format.");
            return;
        }

        if (password.length < 8 && password !== "*******") {
            setMessage("Password must be at least 8 characters.");
            return;
        }

        const updatedData = {
            email: email.trim(),
            password: password !== "*******" ? password : undefined,
        };

        fetch("http://localhost:3000/user/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.error || "Failed to update profile.");
                    });
                }
                return response.json();
            })
            .then((data) => {
                setMessage("Profile updated successfully!");
                sessionStorage.setItem("user", JSON.stringify(data.updatedUser));
            })
            .catch((error) => {
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
        const url = "http://localhost:3000/del_Booking";
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

                    <form onSubmit={(e) => { handleSubmit(e); handleRestart(e) }} className="bg-neutral-800 p-6 rounded shadow-md max-w-lg mx-auto">
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
                                            <p><strong>Check-in:</strong>
                                                <input
                                                    type="date"
                                                    value={formatDate(booking.checkIn)}
                                                    onChange={(e) => handleCheckInChange(e, booking.listingID)}
                                                    className="mt-2 p-2 border border-gray-600 rounded bg-neutral-700 text-white"
                                                />
                                            </p>
                                            <p><strong>Check-out:</strong>
                                                <input
                                                    type="date"
                                                    value={formatDate(booking.checkOut)}
                                                    onChange={(e) => handleCheckOutChange(e, booking.listingID)}
                                                    className="mt-2 p-2 border border-gray-600 rounded bg-neutral-700 text-white"
                                                />
                                            </p>
                                            <p><strong>Number of guests:</strong>
                                                <input
                                                    type="number"
                                                    value={booking.guests}
                                                    onChange={(e) => handleGuestChange(e, booking.listingID)}
                                                    className="mt-2 p-2 border border-gray-600 rounded bg-neutral-700 text-white"
                                                />
                                            </p>
                                            <p><strong>Price for one night:</strong> {listingData[booking.listingID]?.Price}</p>
                                            <p><strong>Total Price:</strong> <strong>${booking.total_price}</strong></p>
                                        </div>

                                        <div className="flex space-x-4">
                                            <button onClick={handleRestart2} className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">Update Data</button>
                                            <button onClick={() => deleteBooking(booking._id)} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Delete Booking</button>
                                        </div>
                                    </div>

                                    <img
                                        src={`/images/${booking.listingID}.jpg`}
                                        alt="hotel-photo"
                                        className="mt-4 md:mt-0 md:ml-6 w-48 h-48 object-cover rounded-lg"
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ProfilePage;
