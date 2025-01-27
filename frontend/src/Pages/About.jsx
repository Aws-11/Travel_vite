import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";

function About() {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));

    return (
        <>
            <Navbar />
            <div className="bg-neutral-900 min-h-screen text-white py-12">
                <div className="container mx-auto px-6 lg:px-20">
                    {/* About Header */}
                    <div className="mb-16 text-center">
                        <h1 className="text-4xl font-bold mb-4">About</h1>
                        <p className="text-lg text-gray-300">
                            Welcome to Travel Agency, your trusted partner in discovering
                            unforgettable experiences and comfortable accommodations. We take pride
                            in providing exceptional travel services, ensuring your journeys are as seamless
                            and enjoyable as possible.
                        </p>
                    </div>

                    {/* About Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                            <p className="text-lg text-gray-300">
                                To create meaningful and inspiring travel experiences by offering top-tier
                                hotels and personalized services that cater to every traveler’s needs.
                            </p>
                        </div>
                        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                            <p className="text-lg text-gray-300">
                                To become the leading travel agency known for innovation, reliability, and
                                unparalleled customer satisfaction in the hospitality industry.
                            </p>
                        </div>
                        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h2>
                            <p className="text-lg text-gray-300">
                                With years of experience, a dedicated team, and a passion for travel, we
                                strive to make your adventures unforgettable. We connect you to the best
                                hotels and services tailored to your preferences.
                            </p>
                        </div>
                    </div>
                </div>
                <Testimonials />
            </div>

            <Footer />
        </>
    );
}

export default About;
