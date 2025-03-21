const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
require("dotenv").config();
const userdb = mongoose.createConnection(process.env.MODEL_USER);

userdb.on('connected', () => console.log('Connected to MongoDB (Users)'));
userdb.on('error', (err) => console.error('MongoDB connection error (Users):', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 40, minlength: 3, match: /^[a-zA-Z0-9_]+$/ },
    email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // Add role field with default 'user'
});


const User = userdb.model('User', userSchema);

const listingdb = mongoose.createConnection(process.env.MODEL_LISTING);

listingdb.on('connected', () => console.log('Connected to MongoDB (Listings)'));
listingdb.on('error', (err) => console.error('MongoDB connection error (Listings):', err));

const listingsSchema = new mongoose.Schema({
    Listname: { type: String, required: true, unique: true },
    Country: { type: String, required: true },
    City: { type: String, required: true },
    Price: { type: Number, required: true },
    Rooms: { type: Number, required: true },
    Description: { type: String, required: true },
    AvailableFrom: { type: [Date], required: true },
    AvailableTo: { type: [Date], required: true },
    images: [{ type: String, required: false }]
});

const Listing = listingdb.model('Listings', listingsSchema);



const booking = mongoose.createConnection(process.env.MODEL_BOOKING);

booking.on('connected', () => console.log('Connected to MongoDB (Bookings)'));
booking.on('error', (err) => console.error('MongoDB connection error (Bookings):', err));

const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    listingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    total_price: { type: Number, required: true },
    payed: { type: Boolean, required: true }
});




const Booking = booking.model('Bookings', bookingSchema);


module.exports = {
    User,
    Listing,
    Booking
};


