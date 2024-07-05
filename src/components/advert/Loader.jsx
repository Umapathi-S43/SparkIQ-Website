import { IoEllipse } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function Loader() {
  const steps = [
    "Our AI is analyzing your texts and background images",
    "We’re fetching the best practices from your brand category",
    "We’re generating components & arranging them for high ROI",
    "We’re rendering over 150 images using Artificial Intelligence",
    "Finalizing your ad creative"
  ];
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
              ${index < currentStep ? "bg-blue-gradient" : "bg-[#D1D5DB]"}
              ${
                index === currentStep
                  ? "border-2 border-[#4F46E5] text-[#4F46E5] bg-white animated-step"
                  : ""
              }`}
                style={{
                  background:
                    index < currentStep
                      ? "linear-gradient(90deg, #004367 0%, #00A7FF 100%)"
                      : ""
                }}
              >
                {index <= currentStep ? (
                  "✓"
                ) : (
                  <IoEllipse className="w-[10px] h-[10px]" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full ${
                    index < currentStep ? "bg-blue-gradient" : "bg-[#D1D5DB]"
                  }`}
                  style={{
                    background:
                      index < currentStep
                        ? "linear-gradient(90deg, #004367 0%, #00A7FF 100%)"
                        : ""
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-between gap-8 p-4 m-4 rounded-[32px] shadow-lg transition-all duration-1000
              ${index <= currentStep ? "bg-white" : "bg-white opacity-50"}`}
            >
              <span className="text-xl text-[#082A66] font-bold">
                {step}
              </span>
              <div
                className={`loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 transition-transform duration-700 ${
                  index <= currentStep ? "animate-spin" : ""
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
