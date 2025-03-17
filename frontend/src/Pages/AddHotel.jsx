import React, { useState } from "react";
import Sidebar from '../components/SideBar';
import axios from 'axios'; // Import axios

const AddHotel = () => {
    const [form, setForm] = useState({
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...form.images];
        updatedImages[index] = value;
        setForm({ ...form, images: updatedImages });
    };

    const addImageField = () => {
        setForm({ ...form, images: [...form.images, ""] });
    };

    const removeImageField = (index) => {
        const updatedImages = form.images.filter((_, i) => i !== index);
        setForm({ ...form, images: updatedImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token'); // Get the token from sessionStorage
        if (!token) {
            console.error("No token found. User not authenticated.");
            return;
        }

        try {
            const response = await axios.post("https://travel-vite-backend.onrender.com/admin/add-hotel", form, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include the token in the headers
                }
            });

            if (response.status === 200) {
                alert("Hotel added successfully!");
                setForm({
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
            } else {
                alert("Failed to add hotel");
            }
        } catch (error) {
            console.error("Error adding hotel:", error);
            if(error.response && error.response.data){
                alert(error.response.data.error || "Failed to add hotel");
            } else {
                alert("Failed to add hotel");
            }

        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 flex-1">
                <h1 className="text-3xl font-bold">Add New Hotel</h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Input fields... */}
                    <input
                        type="text"
                        name="Listname"
                        placeholder="Hotel Name"
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    <input
                        type="text"
                        name="Country"
                        placeholder="Country"
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    <input
                        type="text"
                        name="City"
                        placeholder="City"
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    <input
                        type="number"
                        name="Price"
                        placeholder="Price per night"
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    <input
                        type="number"
                        name="Rooms"
                        placeholder="Total Rooms"
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    />
                    <textarea
                        name="Description"
                        placeholder="Hotel Description"
                        onChange={handleChange}
                        required
                        className="border p-2 w-full"
                    ></textarea>

                    <div className="flex space-x-4">
                        <div className="w-full">
                            <label htmlFor="AvailableFrom" className="block text-sm font-medium mb-1">Available From</label>
                            <input
                                type="date"
                                name="AvailableFrom"
                                onChange={handleChange}
                                required
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="AvailableTo" className="block text-sm font-medium mb-1">Available To</label>
                            <input
                                type="date"
                                name="AvailableTo"
                                onChange={handleChange}
                                required
                                className="border p-2 w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Image URLs</label>
                        {form.images.map((image, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={image}
                                    placeholder={`Image URL ${index + 1}`}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    className="border p-2 w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Add Image URL
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-orange-500 text-white py-2 px-4 rounded mt-4"
                    >
                        Add Hotel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddHotel;