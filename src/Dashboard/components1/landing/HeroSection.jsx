import React from "react";
import { useNavigate } from "react-router-dom";
import { FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen h-full flex flex-col items-center justify-center text-center px-6 md:px-12 w-full pt-24 md:pt-32 pb-20 overflow-hidden">
            
            {/* Background Video */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="pct-video.mp4" type="video/mp4" />
            </video>

            {/* Glassmorphism Effect (Overlay) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] opacity-85 backdrop-blur-md"></div>
            {/* <div className="absolute inset-0 bg-[#000000] opacity-85 backdrop-blur-md"></div> */}

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center">
                
                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#082A66] py-8">
                    <span>Get Started with AI-Driven <br /></span>
                    <span className="text-white mt-2">Marketing in Just 10 secs</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-white mt-4 max-w-xl">
                    Enter your website URL & let AI create stunning Ads, Social Media Posts & Blogs instantly.
                </p>

                {/* Input & CTA - Centered Properly */}
                <div className="mt-6 flex flex-col md:flex-row items-center justify-center w-full max-w-lg p-2 rounded-lg mb-6">
                    <input
                        type="text"
                        placeholder="Example: https://yourwebsite.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-l-lg shadow-sm text-[#082A66] focus:ring-2 focus:ring-blue-400"
                    />
                    <button className="custom-button px-6 py-3 text-white font-semibold transition-all text-nowrap rounded-r-lg">
                        Make My Marketing Shine!
                    </button>
                </div>
            </div>

            {/* Social Media Analysis Section */}
            <div className="relative z-10 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl pb-10">

                {/* Twitter (X) Strategy */}
                <div className="bg-[#E8F5E9] p-6 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <FaXTwitter className="text-black text-2xl" />
                        <h2 className="text-xl font-semibold text-[#082A66]">Your Twitter Post</h2>
                    </div>
                    <img
                        src="https://sparkiq-image-upload.s3.amazonaws.com/e241f3b5-4a02-4839-b439-db0b172790c3.png"
                        alt="X (Twitter) Strategy"
                        className="w-full rounded-lg mt-4"
                    />
                    <p className="mt-4 text-[#082A66] text-sm">
                        Optimize your tweets with AI-powered content that trends faster.
                    </p>
                </div>

                {/* LinkedIn Strategy */}
                <div className="bg-[#E3F2FD] p-6 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <FaLinkedin className="text-blue-700 text-2xl" />
                        <h2 className="text-xl font-semibold text-[#082A66]">Your LinkedIn Post</h2>
                    </div>
                    <img
                        src="https://sparkiq-image-upload.s3.amazonaws.com/eb9d218d-bf57-4247-b3ac-7fe49d80d885.png"
                        alt="LinkedIn Strategy"
                        className="w-full rounded-lg mt-4"
                    />
                    <p className="mt-4 text-[#082A66] text-sm">
                        Write meaningful posts, engage in conversations, and grow your professional network.
                    </p>
                </div>

                {/* Instagram Strategy */}
                <div className="bg-[#FFF3E0] p-6 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <FaInstagram className="text-pink-500 text-2xl" />
                        <h2 className="text-xl font-semibold text-[#082A66]">Your Instagram Post</h2>
                    </div>
                    <img
                        src="https://sparkiq-image-upload.s3.amazonaws.com/f1823956-4e60-44c0-96bc-46cd287c13af.png"
                        alt="Instagram Strategy"
                        className="w-full rounded-lg mt-4"
                    />
                    <p className="mt-4 text-[#082A66] text-sm">
                        Craft AI-powered Instagram posts with visually stunning content.
                    </p>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="relative z-10 text-center">
                <h2 className="text-xl md:text-2xl font-semibold text-[#082A66]">
                    Are you ready to generate more original Creatives with SparkIQ.AI?
                </h2>
                <button
                    onClick={() => navigate("/signup")}
                    className="custom-button mt-6 px-6 py-3 text-white font-semibold text-lg rounded-lg">Get Started</button>
            </div>
        </section>
    );
};

export default HeroSection;
