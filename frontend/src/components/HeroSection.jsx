import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import video1 from '../assets/video1.mp4';
import video2 from '../assets/video2.mp4';

const HeroSection = () => {

    const navigate = useNavigate();
    const findHotels = () => {
        navigate("/hotels");
    };
    return (
        <div className="flex flex-col items-center mt-6 lg:mt-20">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
                Welcome to Your
                <span className='bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text'>
                    {" "}
                    Next Adventure!
                </span>
            </h1>
            <h3 className='mt-10 text-lg text-center max-w-4xl'>Discover the best hotels, attractions, and experiences around the world.</h3>
            <div className="flex justify-center my-10">
                <button onClick={findHotels} className='bg-gradient-to-r from-orange-500 to-red-800 py-3 px-4 mx-3 rounded-md'>
                    Find a hotel
                </button>
            </div>
            <div className="flex mt-10 justify-center">
                <video autoPlay loop muted className='rounded-lg w-1/2 border border-orange-700 shadow-orange-400 mx-2 my-4 '>
                    <source src={video1} type='video/mp4' />
                </video>
                <video autoPlay loop muted className='rounded-lg w-1/2 border border-orange-700 shadow-orange-400 mx-2 my-4 '>
                    <source src={video2} type='video/mp4' />
                </video>
            </div>
        </div>
    );
};

export default HeroSection;
