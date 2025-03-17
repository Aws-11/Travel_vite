import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios

const EditHotel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState({
        Listname: "",
        Country: "",
        City: "",
        Price: "",
        Rooms: "",
        Description: "",
        AvailableFrom: "",
        AvailableTo: "",
        images: []
    });

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axios.get(`https://travel-vite-backend.onrender.com/showlist/${id}`);
                const data = response.data;
                setHotel({
                    ...data,
                    images: data.images || [],
                    AvailableFrom: new Date(data.AvailableFrom).toISOString().split("T")[0],
                    AvailableTo: new Date(data.AvailableTo).toISOString().split("T")[0]
                });
            } catch (error) {
                console.error("Error fetching hotel:", error);
            }
        };
        fetchHotel();
    }, [id]);

    const handleChange = (e) => {
        setHotel({ ...hotel, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setHotel({ ...hotel, images: e.target.value.split(",") });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token'); // Get the token from sessionStorage
        if (!token) {
            console.error("No token found. User not authenticated.");
            return;
        }

        try {
            const response = await axios.put(`https://travel-vite-backend.onrender.com/admin/edit-hotel/${id}`, hotel, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include the token in the headers
                }
            });

            if (response.status === 200) {
                alert("Hotel updated successfully!");
                navigate("/admin/manage-hotels");
            } else {
                alert("Error updating hotel");
            }
        } catch (error) {
            console.error("Error updating hotel:", error);
            if(error.response && error.response.data){
                alert(error.response.data.error || "Error updating hotel");
            } else {
                alert("Error updating hotel");
            }

        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 border rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4">Edit Hotel</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="Listname"
                    value={hotel.Listname}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    placeholder="Hotel Name"
                    required
                />
                <input
                    type="text"
                    name="Country"
                    value={hotel.Country}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    placeholder="Country"
                    required
                />
                <input
                    type="text"
                    name="City"
                    value={hotel.City}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    placeholder="City"
                    required
                />
                <input
                    type="number"
                    name="Price"
                    value={hotel.Price}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    placeholder="Price"
                    required
                />
                <input
                    type="number"
                    name="Rooms"
                    value={hotel.Rooms}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    placeholder="Rooms"
                    required
                />
                <textarea
                    name="Description"
                    value={hotel.Description}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    placeholder="Description"
                    required
                />

                <input
                    type="date"
                    name="AvailableFrom"
                    value={hotel.AvailableFrom}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />

                <input
                    type="date"
                    name="AvailableTo"
                    value={hotel.AvailableTo}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />

                <label className="block text-sm font-semibold">Images (comma-separated URLs):</label>
                <input
                    type="text"
                    name="Images"
                    value={hotel.images ? hotel.images.join(",") : ""}
                    onChange={handleImageChange}
                    className="border p-2 w-full"
                    placeholder="Image URLs (comma-separated)"
                />

                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                    Update Hotel
                </button>
            </form>
        </div>
    );
};

export default EditHotel;