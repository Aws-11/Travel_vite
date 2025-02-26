import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";
import axios from "axios";
const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in by looking at sessionStorage
        const user = sessionStorage.getItem("user");
        setIsLoggedIn(!!user);
    }, []);

    const handleLogout = async () => {
        try {
          await axios.get('http://localhost:3000/logout', { withCredentials: true }); // Call backend to destroy session
          sessionStorage.removeItem("user"); // Remove user data
          sessionStorage.removeItem("token"); // Remove token
         setIsLoggedIn(false) // Redirect to login page
         navigate("/")
        } catch (error) {
          console.error("Logout failed:", error);
        }
      };
      

    const MenuItems = [
        { title: "Home", url: "/", },
        { title: "About", url: "/about", },
        { title: "Contact", url: "/contact", },
        

    ];

    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
            <div className="container px-4 mx-auto relative text-sm">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center flex-shrink-0">
                        <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
                       
                        <Link to="/" className="text-xl tracking-tight">
                                    Sunset Travel
                                </Link>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden lg:flex ml-14 space-x-12">
                        {MenuItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.url} className={item.cName}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                        {/* Profile Link (Only visible if logged in) */}
                        {isLoggedIn && (
                            <li>
                                <Link to="/profile" className="nav-links">
                                    Profile
                                </Link>
                            </li>
                        )}

                            {storedUser?.role === "admin" && (
                                <li className="pb-4"> {/* Add bottom padding */}
                                    <Link to="/admin" className="nav-links px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition">
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}

                    </ul>

                    {/* Desktop Authentication Links */}
                    <div className="hidden lg:flex justify-center space-x-12 items-center">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="py-2 px-3 border rounded-md">
                                    Log In
                                </Link>
                                <Link
                                    to="/registration"
                                    className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                                >
                                    Create an Account
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="py-2 px-3 border rounded-md"
                            >
                                Log Out
                            </button>
                        )}
                    </div>
                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden md:flex flex-col justify-end">
                        <button onClick={toggleNavbar}>
                            {mobileDrawerOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileDrawerOpen && (
                    <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                        <ul>
                            {MenuItems.map((item, index) => (
                                <li className="py-4" key={index}>
                                    <Link to={item.url} className={item.cName}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                            {/* Profile Link for Mobile */}
                            {isLoggedIn && (
                                <li className="py-4">
                                    <Link to="/profile" className="nav-links">
                                        Profile
                                    </Link>
                                </li>
                            )}

                            {storedUser?.role === "admin" && (
                                <li className="pb-4 "> {/* Add bottom padding */}
                                    <Link to="/admin" className="nav-links px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition">
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}

                        </ul>
                        <div className="flex space-x-6">
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/login" className="py-2 px-3 border rounded-md">
                                        Log In
                                    </Link>
                                    <Link
                                        to="/registration"
                                        className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                                    >
                                        Create an Account
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="py-2 px-3 border rounded-md"
                                >
                                    Log Out
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
