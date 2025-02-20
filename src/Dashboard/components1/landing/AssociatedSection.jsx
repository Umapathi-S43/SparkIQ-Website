import React from "react";
import thub from "../../../assets/dashboard_img/thub.svg";
import blitz from "../../../assets/dashboard_img/blitz.svg";
import math from "../../../assets/dashboard_img/mathlab.svg";
import microsoft from "../../../assets/dashboard_img/microsoft.svg"; // Microsoft logo
import azure from "../../../assets/dashboard_img/microsoft-azure.svg"; // Azure Cloud logo

const partners = [
  { name: "Microsoft for Startups", logo: microsoft, size: "h-10" }, // Increased size
  { name: "Cloud for Startups", logo: azure, size: "h-16" }, // Increased size
  { name: "T-hub for Startups", logo: thub, size: "h-16" }, // Increased size
  { name: " ", logo: blitz, size: "h-16" },
  { name: " ", logo: math, size: "h-12" },
];

const AssociatedSection = () => {
  return (
    <section className="relative w-full py-16 px-6 md:px-12">
      {/* Background Image with Pure Black Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://sparkiq-image-upload.s3.amazonaws.com/f1823956-4e60-44c0-96bc-46cd287c13af.png')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold">
          <span className="text-white">Proudly </span>
          <span className="text-[#082A66]">Associated </span>
          <span className="text-white">With</span>
        </h2>

        {/* Partner Logos */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className={`${partner.size} object-contain`}
              />
              <p className="text-gray-800 font-medium text-sm mt-2">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssociatedSection;
