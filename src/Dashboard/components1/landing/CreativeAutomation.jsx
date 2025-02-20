import React from "react";

const features = [
  {
    title: "Image Generation",
    description:
      "Instantly generate high-quality visuals for your ads with AI-powered image creation. Simply input a prompt, browse options, and pick the perfect creative.",
    bgColor: "bg-[#1A3A5D]", // Dark Blue
    video: "/icons-12934_256.gif",
  },
  {
    title: "Cohort Generation",
    description:
      "AI-driven audience segmentation helps you create targeted campaigns by understanding your customers' preferences and behaviors.",
    bgColor: "bg-[#2C3E50]", // Dark Grayish Blue
    video: "/icons-12934_256.gif",
  },
  {
    title: "Cohort Wise Image Generation",
    description:
      "Generate highly personalized ad creatives based on audience segments. Increase engagement with custom AI-powered visuals.",
    bgColor: "bg-[#283C2E]", // Dark Green
    video: "/icons-12934_256.gif",
  },
//   {
//     title: "One-Click Translations",
//     description:
//       "Translate ad creatives into multiple languages instantly, ensuring global reach and audience engagement without losing context.",
//     bgColor: "bg-[#5A3D2E]", // Dark Brown
//     video: "/icons-12934_256.gif",
//   },
  {
    title: "Ad Creative Editing",
    description:
      "Refine your ad creative with AI-driven editing. Get real-time suggestions to enhance clarity, engagement, and conversion rates.",
    bgColor: "bg-[#3B2D56]", // Dark Purple
    video: "/icons-12934_256.gif",
  },
  {
    title: "AI-Based Performance Prediction",
    description:
      "Predict ad success before publishing. AI-driven insights analyze engagement potential, helping you optimize ad strategies effectively.",
    bgColor: "bg-[#4A2E1E]", // Dark Reddish Brown
    video: "/icons-12934_256.gif",
  },
];

const CreativeAutomation = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#082A66]">
          AI-Powered Creative Automation
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Supercharge your ads with AI! Generate, refine, and optimize ad creatives effortlessly.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-start">
            {/* Text Outside */}
            
            {/* Dark Background Card */}
            <div
              className={`p-6 rounded-lg shadow-lg ${feature.bgColor} flex flex-col items-center w-full`}
            >
              {/* Video Placeholder */}
              <video
                src="pct-video.mp4"
                className="w-full h-auto rounded-lg"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <h3 className="text-xl font-semibold text-[#082A66] mt-6">{feature.title}</h3>
            <p className="text-gray-700 mt-2 mb-4 max-w-sm mb-6">{feature.description}</p>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default CreativeAutomation;
