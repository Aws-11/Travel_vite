const express = require("express");
const { MongoClient, MinKey, Int32 } = require("mongodb");
const mongoose = require("mongoose");
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')
const cors = require('cors')
const { User, Listing, Booking, photos } = require('./models.js');
const jwt = require("jsonwebtoken")
const secret_key = "secret"
const app = express();
require("dotenv").config();



const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
app.use(bodyparser.json());
app.use(cors({
    origin: "https://travel-vite-frontend.onrender.com",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    secure: true
}));


app.use(express.urlencoded({ extended: true }));

app.use(session({
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    }
}));





const adminAuth = async (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    try {

        const decoded = jwt.verify(token, secret_key);

        console.log('Decoded JWT:', decoded);

        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token or session expired." });
    }
};




app.post('/login', async (req, res) => {
    try {
        // Look for the user based on the identifier (username or email)
        const user = await User.findOne({
            $or: [
                { username: req.body.identifier },
                { email: req.body.identifier }
            ]
        });


        if (user) {


            // bcrypt.compare will check if the entered password matches the stored hash
            const isMatch = await bcrypt.compare(req.body.password, user.password);


            if (isMatch) {
                // If passwords match, proceed to generate a JWT token


                const token = jwt.sign(
                    { id: user._id, username: user.username, email: user.email, role: user.role },
                    secret_key,
                    { expiresIn: '1h' }
                );

                req.session.token = token; // Store token in the session
                console.log('Session Token Set:', req.session.token);

                res.json({
                    message: "User is logged in",
                    user: { username: user.username, email: user.email, role: user.role },
                    token
                });
            } else {
                res.status(401).send('Invalid login credentials');
            }
        } else {
            res.status(401).send('User not found');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send('Server Error');
    }
});




app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (password.length < 8) {
            return res.status(400);
        }
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Ensure the hashed password is stored
        });

        // Save the new user
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error('Error in Registration:', err);
        res.status(400).json({ error: err.message });
    }
});




app.post("/create-payment-intent", async (req, res) => {
    try {

        const { amount, bookingId } = req.body;

        if (!amount || !bookingId) {
            return res.status(400).json({ error: "Missing amount or bookingId" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Amount in cents
            currency: "eur",
            payment_method_types: ["card"], // Correct parameter format
        });


        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {

        res.status(500).json({ error: "Payment processing error" });
    }
});


app.post("/confirm-payment", async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ error: "Booking not found" });
        booking.payed = true;
        await booking.save();
        res.json({ message: "Payment confirmed", booking });
    } catch (error) {
        res.status(500).json({ error: "Error updating payment status" });
    }
});



app.post("/booking_by_id", async (req, res) => {
    const { id } = req.body;
    try {
        const findbook = await Booking.findOne({ _id: id });

        if (!findbook) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(findbook);
    } catch (err) {
        console.error("Error finding booking:", err);
        res.status(400).json({ message: "Error fetching booking" });
    }
});





app.put('/update_booking', async (req, res) => {
    const { _id, checkIn, checkOut, guests_adults, guests_children, booked_rooms, total_price } = req.body;

    if (!_id || !checkIn || !checkOut || guests_adults == null || guests_children == null || booked_rooms == null || total_price == null) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            _id,
            { checkIn, checkOut, guests_adults, guests_children, booked_rooms, total_price },  // ✅ Fixed: Includes booked_rooms
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({
            message: 'Booking updated successfully.',
            updatedBooking,
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});





app.delete('/del_Booking', async (req, res) => {
    const _id = req.body._id
    try {
        const delBook = await Booking.deleteOne({ _id: _id });
        if (delBook.deletedCount === 1) {
            res.status(200).json({ message: 'booking deleted successfully' })
        } else {
            res.status(400).json({ message: 'booking not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'error', error: err.message })
    }
})

app.get('/users', async (req, res) => {

    try {
        const users = await User.find();

        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: 'error while fetching', error: err.message })
    }
});

app.post("/bookings_by_email", async (req, res) => {
    const email = req.body.email;
    try {

        const findbook = await Booking.find({ email: email });

        res.status(200).json(findbook);
    } catch (err) {

        console.error("Error finding bookings:", err);
        res.status(400).json({ message: "Error fetching bookings" });
    }
});



app.post('/fetchbasedonid', async (req, res) => {
    const { listingID } = req.body;
    try {

        const listing = await Listing.findById(listingID);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }


        res.status(200).json(listing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.delete('/admin/userdel/:id', adminAuth, async (req, res) => {
    const id = req.params.id
    try {
        const delUser = await User.deleteOne({ _id: id });
        if (delUser.deletedCount === 1) {
            res.status(200).json({ message: 'user deleted successfully' })
        } else {
            res.status(400).json({ message: 'user not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'error', error: err.message })
    }
})


app.post('/bookings', async (req, res) => {
    try {
        const newBook = new Booking({
            email: req.body.email,
            listingID: req.body.listingID || req.body.hotelId, // Support both naming conventions
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            guests_adults: req.body.guests_adults,
            guests_children: req.body.guests_children,
            booked_rooms: req.body.booked_rooms , // Support both naming conventions
            total_price: req.body.total_price || req.body.totalp, // Support both naming conventions
            payed: req.body.payed || false, 
        });
        await newBook.save();
        res.status(200).json({ message: "Booking created successfully", booking: newBook });
    } catch (err) {
        console.error("Booking creation error:", err);
        res.status(400).json({ error: err.message || "Invalid data" });
    }
});


app.get('/hotels/:id', async (req, res) => {
    try {
        const hotelId = req.params.id; // Extract hotel ID from the URL
        const hotel = await Listing.findById(hotelId); // Query the database

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.status(200).json(hotel); // Send hotel data as JSON
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).json({ error: 'An error occurred while fetching hotel details' });
    }
});

app.get('/showlist', async (req, res) => {



    try {
        const users = await Listing.find();

        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: 'error while fetching', error: err.message })
    }
});






app.get('/showbook', async (req, res) => {

    try {
        const books = await Booking.find();

        res.status(200).json(books)
    } catch (err) {
        res.status(500).json({ message: 'error while fetching', error: err.message })
    }
});

app.get("/admin/bookings", adminAuth, async (req, res) => {
    try {
        const bookings = await Booking.find();
        console.log('Bookings:', bookings); // Add this for debugging
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});





app.get("/loged", (req, res) => {
    const token = req.session.token;

    if (token) {
        jwt.verify(token, secret_key, (err, user) => {
            if (err) {
                return res.send({ logIn: false });
            }
            res.send({ logIn: true, user: user });
        });
    } else {

        res.send({ logIn: false, message: "No token provided" });
    }
});



app.get('/profile', async (req, res) => {
    const token = req.session.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access. Please log in." });
    }

    try {
        jwt.verify(token, secret_key, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const bookings = await Booking.find({ email: user.email });

            res.status(200).json({
                user: {
                    username: user.username,
                    email: user.email,
                    role: user.role,  // ✅ Include the role here
                    password: '********'
                },
                bookings
            });
        });
    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ message: "Server error while fetching profile data" });
    }
});



app.put('/user/update', async (req, res) => {



    const { currentEmail, newEmail, password } = req.body;

    if (!currentEmail) {
        return res.status(400).json({ error: "Current email is required." });

   

    }
    try {
        // Find the currently logged-in user by their stored email
        const user = await User.findOne({ email: currentEmail });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Prepare the update object
        const updatedData = {};
        if (newEmail) updatedData.email = newEmail.trim();
        if (password && password !== "*******") {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        if (newEmail && newEmail.trim()) { 
            const existingUser = await User.findOne({ email: newEmail.trim() });
            if (existingUser) {
                return res.status(400).json({ error: "Email already in use." });
            }
        }
        
        // Update user in database
        const updatedUser = await User.findOneAndUpdate(
            { email: currentEmail },
            updatedData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ error: "User update failed." });
        }
        if (newEmail) {
            await Booking.updateMany(
                { email: currentEmail },
                { $set: { email: newEmail.trim() } }
            );
        }
        res.status(200).json({
            message: "Profile updated successfully",
            updatedUser,
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/admin/add-hotel', adminAuth, async (req, res) => {
    try {
        const { Listname, Country, City, Price, Rooms, Description, AvailableFrom, AvailableTo, images } = req.body;

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: 'At least one image URL is required' });
        }

        const newHotel = new Listing({
            Listname,
            Country,
            City,
            Price,
            Rooms,
            Description,
            AvailableFrom: new Date(AvailableFrom),
            AvailableTo: new Date(AvailableTo),
            images,  // Store image URLs as an array
        });

        await newHotel.save();
        res.status(201).json({ message: 'Hotel added successfully', hotel: newHotel });
    } catch (err) {
        res.status(400).json({ error: 'Error adding hotel', details: err.message });
    }
});




app.put('/admin/edit-hotel/:id', adminAuth, async (req, res) => {
    try {
        const { Listname, Country, City, Price, Rooms, Description, AvailableFrom, AvailableTo, images } = req.body; // Use images lowercase

        const updatedHotel = await Listing.findByIdAndUpdate(
            req.params.id,
            {
                Listname,
                Country,
                City,
                Price,
                Rooms,
                Description,
                AvailableFrom: new Date(AvailableFrom),
                AvailableTo: new Date(AvailableTo),
                images: images && images.length ? images : undefined // Use images lowercase
            },
            { new: true }
        );

        if (!updatedHotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
    } catch (err) {
        res.status(400).json({ error: 'Error updating hotel', details: err.message });
    }
});





app.get('/showlist/:id', async (req, res) => {

    const id = req.params.id
    try {
        const data = await Listing.findOne({ _id: id });

        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ message: 'error while fetching', error: err.message })
    }
});



app.delete('/admin/delete-hotel/:id', adminAuth, async (req, res) => {
    try {
        const deletedHotel = await Listing.findByIdAndDelete(req.params.id);
        if (!deletedHotel) return res.status(404).json({ error: 'Hotel not found' });
        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting hotel', details: err.message });
    }
});

app.delete('/admin/delete-book/:id', adminAuth, async (req, res) => {
    try {
        const deletedHotel = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedHotel) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting booking', details: err.message });
    }
});













app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.send({ message: "Successfully logged out" });
    });
});




app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("server is runing on port 3000")
    }

})



/*
{
"username":"jennifer",
"email":"jen@mail.com",
"password":"strongpassword"
 
*/ 