const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');

const userdb = mongoose.createConnection('mongodb+srv://vocalsoda50:tXlQT8dGVB3BcdhR@clusterfuck.369d4.mongodb.net/Users');

userdb.on('connected', () => console.log('Connected to MongoDB (Users)'));
userdb.on('error', (err) => console.error('MongoDB connection error (Users):', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 40, minlength: 3, match: /^[a-zA-Z0-9_]+$/ },
    email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, minlength: 8 }
});

userSchema.pre('save', async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

const User = userdb.model('User', userSchema);

const listingdb = mongoose.createConnection('mongodb+srv://vocalsoda50:tXlQT8dGVB3BcdhR@clusterfuck.369d4.mongodb.net/Listings');

listingdb.on('connected', () => console.log('Connected to MongoDB (Listings)'));
listingdb.on('error', (err) => console.error('MongoDB connection error (Listings):', err));

const listingsSchema = new mongoose.Schema({
    Listname: { type: String, required: true, unique: true },
    Country: { type: String, required: true },
    City: { type: String, required: true },
    Price: { type: Number, required: true },
    Rooms: { type: Number, required: true },
    Description: { type: String, required: true }
});

const Listing = listingdb.model('Listings', listingsSchema);



const booking = mongoose.createConnection('mongodb+srv://vocalsoda50:tXlQT8dGVB3BcdhR@clusterfuck.369d4.mongodb.net/Bookings');

booking.on('connected', () => console.log('Connected to MongoDB (Bookings)'));
booking.on('error', (err) => console.error('MongoDB connection error (Bookings):', err));

const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    listingID: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true},
    guests: {type: Number, required: true},
    total_price: {type: Number, required: true}
});




const Booking = booking.model('Bookings', bookingSchema);

// Export the models
module.exports = {
    User,
    Listing,
    Booking
};


