import React from 'react'
import user1 from '../assets/profile-pictures/user1.jpg'
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";


const Testimonials = () => {

    const testimonials = [
        {
            user: "John Doe",
            company: "Frequent Traveler",
            image: user1,
            text: "Booking through this website was so easy! I found a perfect hotel for my family vacation, and the customer support was outstanding. Highly recommend!",
        },
        {
            user: "Jane Smith",
            company: "Business Professional",
            image: user2,
            text: "The site made finding a hotel for my business trip a breeze. The filters helped me find the exact amenities I needed, and the booking process was seamless.",
        },
        {
            user: "David Johnson",
            company: "Adventure Enthusiast",
            image: user3,
            text: "I love how user-friendly this website is! I found a hotel near all the attractions I wanted to visit, and the reviews were super helpful.",
        },
        {
            user: "Ronee Brown",

            company: "Vacation Planner",
            image: user4,
            text: "This platform made it incredibly easy to book a luxury hotel for my anniversary trip. The photos and detailed descriptions helped me choose with confidence.",
        },
        {
            user: "Michael Wilson",
            company: "Family Guy",
            image: user5,
            text: "We booked a family-friendly hotel with great facilities for kids. It was exactly as described on the website, and we had a wonderful time!",
        },
        {
            user: "Emily Davis",

            company: "Solo Traveler",
            image: user6,
            text: "I was able to book a cozy, budget-friendly hotel for my solo trip. The booking process was quick and hassle-free, and everything went perfectly.",
        },
    ];

    return (
        <div className='mt-20 tracking-wide '>


            <h2 className=' text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20'>What people are saying </h2>
            <div className='flex flex-wrap justify-center'>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className='w-full sm:w-1/2 lg:w-1/3 px-4 py-2'>
                        <div className='bg-neutral rounded-md p-6 text-md border border-neutral-800 font-thin'>
                            <p>{testimonial.text}</p>
                            <div className='flex mt-8 items-start'>
                                <img className='w-12 h-12 mr-6 rounded-full border border-neutral-300 ' src={testimonial.image} alt={testimonial.user} />
                            </div>
                            <div>
                                <h6>{testimonial.user}</h6>
                                <span className='text-sm font-normal italic text-neutral-600'>{testimonial.company}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Testimonials
