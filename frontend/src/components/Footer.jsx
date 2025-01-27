import React from 'react'
import { Link } from "react-router-dom";

const Footer = () => {

    const resourcesLinks = [
        { to: "/home", text: "How It Works" },
        { to: "/home", text: "Booking Guide" },
        { to: "/home", text: "FAQs" },
        { to: "/home", text: "Customer Support" },
        { to: "/home", text: "Travel Tips" },
    ];

    const platformLinks = [
        { to: "/home", text: "Hotel Features" },
        { to: "/home", text: "Popular Destinations" },
        { to: "/home", text: "Special Offers" },
        { to: "/home", text: "Mobile App" },
        { to: "/home", text: "Loyalty Program" },
    ];

    const communityLinks = [
        { to: "/home", text: "Travel Stories" },
        { to: "/home", text: "Customer Reviews" },
        { to: "/home", text: "Local Events" },
        { to: "/home", text: "Group Bookings" },
        { to: "/home", text: "Partnership Opportunities" },
    ];



    return (
        <footer className='mt-20 border-t py-10 border-neutral-700'>
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                    <h3 className='text-md font-semibold mb-4'>Resources</h3>
                    <ul className='space-y-2'>
                        {resourcesLinks.map((link, index) => (
                            <li key={index}>
                                <Link className='text-neutral-300 hover:text-white' to={link.to}>{link.text}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className='text-md font-semibold mb-4'>Platforms</h3>
                    <ul className='space-y-2'>
                        {platformLinks.map((link, index) => (
                            <li key={index}>
                                <Link className='text-neutral-300 hover:text-white' to={link.to}>{link.text}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className='text-md font-semibold mb-4'>Community</h3>
                    <ul className='space-y-2'>
                        {communityLinks.map((link, index) => (
                            <li key={index}>
                                <Link className='text-neutral-300 hover:text-white' to={link.to}>{link.text}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

        </footer>
    )
}

export default Footer
