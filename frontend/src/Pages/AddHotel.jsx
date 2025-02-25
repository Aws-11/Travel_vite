import React, { useState } from "react";
import Sidebar from '../components/SideBar';

const AddHotel = () => {
    const [form, setForm] = useState({
        Listname: "",
        Country: "",
        City: "",
        Price: "",
        Rooms: "",
        Description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/admin/add-hotel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (response.ok) {
                alert("Hotel added successfully!");
                setForm({
                    Listname: "",
                    Country: "",
                    City: "",
                    Price: "",
                    Rooms: "",
                    Description: "",
                });
            } else {
                alert("Failed to add hotel");
            }
        } catch (error) {
            console.error("Error adding hotel:", error);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 flex-1">
                <h1 className="text-3xl font-bold">Add New Hotel</h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input type="text" name="Listname" placeholder="Hotel Name" onChange={handleChange} required className="border p-2 w-full" />
                    <input type="text" name="Country" placeholder="Country" onChange={handleChange} required className="border p-2 w-full" />
                    <input type="text" name="City" placeholder="City" onChange={handleChange} required className="border p-2 w-full" />
                    <input type="number" name="Price" placeholder="Price per night" onChange={handleChange} required className="border p-2 w-full" />
                    <input type="number" name="Rooms" placeholder="Total Rooms" onChange={handleChange} required className="border p-2 w-full" />
                    <textarea name="Description" placeholder="Hotel Description" onChange={handleChange} required className="border p-2 w-full"></textarea>
                    <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded mt-4">
                        Add Hotel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddHotel;
