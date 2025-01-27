import React, { useState } from "react";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [isSuccess, setIsSuccess] = useState(false); // State to handle success message visibility
    const [isSubmitting, setIsSubmitting] = useState(false); // State to handle form submission

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation (you can expand on this)
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true); // Set form as submitting

        // Send the email using EmailJS (to you)
        emailjs
            .sendForm(
                'service_kru80bj', // Your service ID
                'template_1y4uaaj', // Your template ID
                e.target, // The form DOM element
                'LW_7ISn3lTZ5Vf4tB' // Your EmailJS user ID
            )
            .then(
                (result) => {
                    console.log(result.text); // You can log the result or do something with it
                    setIsSuccess(true); // Show success message
                    setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                    });

                    // Send a confirmation email to the user
                    emailjs.send(
                        'service_kru80bj',        // Your service ID
                        'template_cqox02m',        // Confirmation template ID
                        {
                            to_email: formData.email, // The user's email
                            user_name: formData.name,  // The user's name
                            message: formData.message  // The message the user submitted
                        },
                        'LW_7ISn3lTZ5Vf4tB'          // Your EmailJS user ID
                    )
                        .then(() => {
                            console.log("Confirmation email sent successfully.");
                        })
                        .catch((error) => {
                            console.error("Error sending confirmation email:", error);
                        });
                },
                (error) => {
                    console.error(error.text); // Log errors
                    alert("There was an error sending your message. Please try again.");
                }
            )
            .finally(() => {
                setIsSubmitting(false); // Reset form submission state
            });
    };

    return (
        <>
            <Navbar />
            <div className="contact-container py-10 px-6 md:px-14 text-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-semibold mb-6 ">Leave us a message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="w-full py-2 px-4 bg-neutral-700 text-white rounded-md border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                className="w-full py-2 px-4 bg-neutral-700 text-white rounded-md border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                className="w-full py-2 px-4 bg-neutral-700 text-white rounded-md border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                rows="6"
                                className="w-full py-2 px-4 bg-neutral-700 text-white rounded-md border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type="submit"
                                id="form-button"
                                className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-800 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>

                    {/* Confirmation message */}
                    {isSuccess && (
                        <div className="mt-6 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg text-center">
                            <p>Your message has been successfully sent. We’ll get back to you shortly!</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Contact;
