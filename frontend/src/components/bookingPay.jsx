import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


const PaymentForm = ({ amount, onPaymentSuccess, bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        try {
            

            const paymentIntentResponse = await axios.post("https://travel-vite-backend.onrender.com/create-payment-intent", {

                amount,
                bookingId,
            });
            
            const { clientSecret } = paymentIntentResponse.data;

            if (!clientSecret) {
                throw new Error("Failed to retrieve client secret");
            }

            
            const cardElement = elements.getElement(CardElement);
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
            });

            if (error) {
                console.error("Payment method creation error:", error);
                return;
            }

           
            const { paymentIntent, error: confirmationError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmationError) {
                console.error("Payment confirmation error:", confirmationError);
                return;
            }

            

            await axios.post("https://travel-vite-backend.onrender.com/confirm-payment", { bookingId });

            onPaymentSuccess(paymentIntent);
        } catch (error) {
            console.error("Payment processing error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm">Card Details</label>
                <CardElement className="py-2 px-4 bg-neutral-700 text-white rounded-md" />
            </div>
            <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                disabled={!stripe}
            >
                Pay {amount}€
            </button>
        </form>
    );
};

const BookingConfirmation = ({ onClose, bookingId, amount }) => {
    const navigate = useNavigate();
    const [payNow, setPayNow] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await axios.post("https://travel-vite-backend.onrender.com/booking_by_id", { id: bookingId });
                setBookingDetails(response.data);
            } catch (error) {
                console.error("Error fetching booking details:", error);
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const handlePaymentSuccess = (paymentMethod) => {
        console.log("Payment Successful with ID:", paymentMethod.id);
        onClose();
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg text-white w-96">
                {payNow ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Payment</h2>
                        <p className="mb-4">Choose your payment method: Booking ID: {bookingDetails?._id}</p>
                        <Elements stripe={stripePromise}>
                            <PaymentForm
                                amount={bookingDetails?.total_price}
                                bookingId={bookingDetails?._id}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        </Elements>
                        <button
                            onClick={() => setPayNow(false)}
                            className="block mt-4 text-sm text-gray-400 hover:underline"
                        >
                            Go Back
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Pay to confirm booking</h2>
                        <p className="mb-4">Would you like to pay now or later?</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setPayNow(true)}
                                className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Pay Now
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    
                                }}
                                className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Pay Later
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingConfirmation;
