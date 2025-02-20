import React from "react";

const HowItWorks = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#0086CD] via-[#00A7FF] to-[#006499]">
          How It Works?
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Discover how SparkIQ AI simplifies marketing by creating high-performing ad creatives effortlessly.
        </p>
      </div>

      {/* Video Container */}
      <div className="mt-12 flex justify-center relative">
        {/* Glow Effect - Multi-Colored Background */}
        <div className="absolute inset-0 w-full max-w-4xl mx-auto rounded-xl blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(255,165,0,0.3) 20%, rgba(0,255,0,0.3) 40%, rgba(0,0,255,0.3) 60%, rgba(255,20,147,0.3) 80%, rgba(255,255,0,0.3) 100%)",
            filter: "blur(35px)",
          }}>
        </div>

        {/* Video Player */}
        <div className="relative w-full max-w-4xl rounded-xl overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="relative z-10 w-full rounded-xl shadow-lg border"
          >
<source src="pct-video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
