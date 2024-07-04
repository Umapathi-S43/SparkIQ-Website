import { IoEllipse } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function Loader() {
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) =>
        prevStep < steps.length ? prevStep + 1 : prevStep
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="bg-[#FCFCFC0D] p-3 shadow-md rounded-[20px] border border-white flex flex-col justify-center items-center gap-6 lg:w-3/5 mx-auto">
        <p className="font-bold lg:text-2xl text-[#082A66]">
          Your ad creative is being generated.
        </p>
        <div className="flex items-center w-full">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center w-full last:w-auto">
              <div
                className={`h-6 min-w-6 rounded-full flex items-center justify-center text-white font-bold
              ${index < currentStep ? "slider_btn" : "bg-[#D1D5DB]"}
              ${
                index === currentStep
                  ? "border-2 border-[#4F46E5] text-[#4F46E5] bg-white animated-step"
                  : ""
              }`}
              >
                {index === currentStep && currentStep === steps.length ? (
                  "✓"
                ) : index === currentStep ? (
                  <IoEllipse className="w-[10px] h-[10px] text-[#4F46E5]" />
                ) : index < currentStep ? (
                  "✓"
                ) : (
                  <IoEllipse className="w-[10px] h-[10px]" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full ${
                    index < currentStep ? "slider_btn" : "bg-[#D1D5DB]"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-8 bg-white shadow-lg rounded-[32px] p-4 m-4">
            <span className="text-xl text-[#082A66] font-bold">
              Our AI is analyzing your texts and background images
            </span>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
          </div>
          <div className="flex items-center justify-between gap-8 bg-white shadow-lg rounded-[32px] p-4 m-4 opacity-50">
            <span className="text-xl text-[#082A66] font-bold">
              We’re fetching the best practices from your brand category
            </span>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
          </div>
          <div className="flex items-center justify-between gap-8 bg-white shadow-lg rounded-[32px] p-4 m-4 opacity-50">
            <span className="text-xl text-[#082A66] font-bold">
              We’re generating components & arranging them for high ROI
            </span>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
          </div>
          <div className="flex items-center justify-between gap-8 bg-white shadow-lg rounded-[32px] p-4 m-4 opacity-50">
            <span className="text-xl text-[#082A66] font-bold">
              We’re rendering over 150 images using Artificial Intelligence
            </span>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
