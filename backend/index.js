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
        secure: false
    }
}))



app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [
                { username: req.body.identifier },
                { email: req.body.identifier },
            ]
        });

        if (user && await bcrypt.compare(req.body.password, user.password)) {

            const token = jwt.sign(
                { id: user._id, username: user.username, email: user.email },
                secret_key,
                { expiresIn: '1h' }
            );

            req.session.token = token;

            res.json({
                message: "User is logged in",
                user: { username: user.username, email: user.email },
                token
            });
        } else {
            res.status(401).send('Invalid login credentials');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send('Server Error');
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
    const { _id, checkIn, checkOut, guests, total_price } = req.body;

    if (!_id || !checkIn || !checkOut || guests == null || total_price == null) {
        return res.status(400).json({ message: 'All fields (_id, checkIn, checkOut, guests, total_price) are required.' });
    }

    try {

        const updatedBooking = await Booking.findByIdAndUpdate(
            _id,
            { checkIn, checkOut, guests, total_price },
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

app.post("/booking_by_email", async (req, res) => {
    const email = req.body.email;
    try {

        const findbook = await Booking.find({ email: email });

        res.status(200).json(findbook);
    } catch (err) {

        console.error("Error finding bookings:", err);
        res.status(400).json({ message: "Error fetching bookings" });
    }
});


app.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password

        })
        await newUser.save();
        res.status(201).json({ message: 'user added successfully', user: newUser })
    } catch (err) {
        res.status(400).json({ message: 'error while creating user', error: err.message })
    }
})



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


app.delete('/users', async (req, res) => {
    const userName = req.body.name
    try {
        const delUser = await User.deleteOne({ name: userName });
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
            guests: req.body.guests,
            total_price: req.body.total_price || req.body.totalp, // Support both naming conventions
            payed: req.body.payed || false, // Default to false if not provided
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

app.post('/createList', async (req, res) => {
    try {
        const newList = new Listing({
            Listname: req.body.Listname,
            Country: req.body.Country,
            City: req.body.City,
            Price: req.body.Price,
            Rooms: req.body.Rooms,
            Description: req.body.Description

        })
        await newList.save();
        res.status(201).json({ message: 'Listing added successfully', user: newList })
    } catch (err) {
        res.status(400).json({ message: 'error while adding listing', error: err.message })
    }
})

app.delete('/delelist', async (req, res) => {
    const ListingId = req.body._id
    try {
        const delList = await Listing.deleteOne({ _id: LitsingId });
        if (delList.deletedCount === 1) {
            res.status(200).json({ message: 'Listing deleted successfully' })
        } else {
            res.status(400).json({ message: 'Listing not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'error', error: err.message })
    }
})


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



app.post('/bookings_by_email', async (req, res) => {
    const { email } = req.body; // Destructure email from the request body

    if (!email) {
        return res.status(400).json({ error: "Email is required to fetch bookings." });
    }

    try {
        // Query the Booking model for bookings matching the email
        const bookings = await Booking.find({ email });

        // If no bookings are found, return an appropriate message
        if (!bookings.length) {

        }

        res.status(200).json(bookings); // Respond with the found bookings
    } catch (error) {
        console.error("Error fetching bookings by email:", error);
        res.status(500).json({ error: "An error occurred while fetching bookings." });
    }
});


app.post('/add_photo', async (req, res) => {
    const { listingID, URL } = req.body;

    if (!listingID || !URL) {
        return res.status(400).json({ message: 'Both listingID and URL are required.' });
    }

    try {
        const newPhoto = new photos({
            listingID,
            URL,
        });

        await newPhoto.save();

        res.status(201).json({ message: 'Photo added successfully.', newPhoto });
    } catch (error) {
        console.error('Error adding photo:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


app.get('/photos/:listingID', async (req, res) => {
    const { listingID } = req.params;
    
    try {
        // Check if listingID is valid
        if (!listingID) {
            return res.status(400).json({ message: 'Listing ID is required.' });
        }

        const Photos = await photos.find({ listingID }); // Ensure the model is correct

        if (!Photos || Photos.length === 0) {
            return res.status(404).json({ message: 'No photos found for this listing.' });
        }

        res.status(200).json(Photos); // Return all photos for this listing
      
    } catch (error) {
        console.error('Error fetching photos:', error);  // Logs the error for debugging
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});



app.get('/all-photos', async (req, res) => {
    try {
        const allPhotos = await photos.find(); 
        const photosMap = allPhotos.reduce((acc, photo) => {
            acc[photo.listingID] = photo.URL;
            return acc;
        }, {});

        res.status(200).json(photosMap); 
    } catch (error) {
        console.error('Error fetching all photos:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});






app.get("/logout", (req, res) => {
    req.session.destroy()
    res.send({ message: "successfully logged out" })
})




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