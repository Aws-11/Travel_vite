import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
        AvailableTo: ""
    });

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await fetch(`http://localhost:3000/showlist/${id}`);
                const data = await response.json();
                setHotel({
                    ...data,
                    AvailableFrom: new Date(data.AvailableFrom).toISOString().split("T")[0], // Format the date to match input type="date"
                    AvailableTo: new Date(data.AvailableTo).toISOString().split("T")[0] // Format the date to match input type="date"
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/admin/edit-hotel/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hotel),
                credentials: "include"
            });

            if (response.ok) {
                alert("Hotel updated successfully!");
                navigate("/admin/manage-hotels");
            } else {
                const data = await response.json();
                alert("Error updating hotel: " + data.error);
            }
        } catch (error) {
            console.error("Error updating hotel:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 border rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4">Edit Hotel</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="Listname" value={hotel.Listname} onChange={handleChange} className="border p-2 w-full" placeholder="Hotel Name" required />
                <input type="text" name="Country" value={hotel.Country} onChange={handleChange} className="border p-2 w-full" placeholder="Country" required />
                <input type="text" name="City" value={hotel.City} onChange={handleChange} className="border p-2 w-full" placeholder="City" required />
                <input type="number" name="Price" value={hotel.Price} onChange={handleChange} className="border p-2 w-full" placeholder="Price" required />
                <input type="number" name="Rooms" value={hotel.Rooms} onChange={handleChange} className="border p-2 w-full" placeholder="Rooms" required />
                <textarea name="Description" value={hotel.Description} onChange={handleChange} className="border p-2 w-full" placeholder="Description" required />
                
                {/* Available From Date */}
                <input
                    type="date"
                    name="AvailableFrom"
                    value={hotel.AvailableFrom}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />

                {/* Available To Date */}
                <input
                    type="date"
                    name="AvailableTo"
                    value={hotel.AvailableTo}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
                    Update Hotel
                </button>

             
            </form>  
           
        </div>
    );
};

export default EditHotel;
