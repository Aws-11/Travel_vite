import React from 'react'
import { Link } from "react-router-dom";

const Footer = () => {

    const resourcesLinks = [
        { to: "/", text: "How It Works" },
        { to: "/", text: "Booking Guide" },
        { to: "/", text: "FAQs" },
        { to: "/", text: "Customer Support" },
        { to: "/", text: "Travel Tips" },
    ];

    const platformLinks = [
        { to: "/", text: "Hotel Features" },
        { to: "/", text: "Popular Destinations" },
        { to: "/", text: "Special Offers" },
        { to: "/", text: "Mobile App" },
        { to: "/", text: "Loyalty Program" },
    ];

    const communityLinks = [
        { to: "/", text: "Travel Stories" },
        { to: "/", text: "Customer Reviews" },
        { to: "/", text: "Local Events" },
        { to: "/", text: "Group Bookings" },
        { to: "/", text: "Partnership Opportunities" },
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
