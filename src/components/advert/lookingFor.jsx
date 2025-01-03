import { useState, useRef, useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

export default function LookingFor({
  isNextSectionOpen,
  toggleNextSectionAccordion,
  handleNextSection,
  setIsLoading,
  isCompleted,
  setIsCompleted,
}) {
  const [selectedOption, setSelectedOption] = useState("");
  const sectionRef = useRef(null);

  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    localStorage.setItem("lookingFor", option); // Store the selected option in localStorage
  };

  const options = [
    {
      name: "Social Media Post",
      description: "Generate creative for social media platforms",
      image: "src/assets/dashboard_img/ads.svg",
    },
    {
      name: "Advertisement (Ad)",
      description: "Generate creatives for advertising campaigns",
      image: "src/assets/dashboard_img/social_media.svg",
    },
  ];

  return (
    <div ref={sectionRef}>
      <section className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] ${!isNextSectionOpen ? 'p-2 lg:p-3' : 'p-0'} flex flex-col gap-6 relative z-10`}>
        <div
          className={`flex flex-wrap justify-between items-center bg-[rgba(252,252,252,0.40)] ${!isNextSectionOpen ? 'rounded-[20px] p-2' : 'rounded-t-[20px] p-4'} relative cursor-pointer`}
          onClick={toggleNextSectionAccordion}
        >
          {isCompleted && (
            <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
              Completed <BiCheck size={20} />
            </span>
          )}
          <span className="flex items-center gap-4">
            <img src="/icon4.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Creative Formats
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Select the purpose for generating your creatives below.
              </p>
            </span>
          </span>
          <div className="flex items-center gap-2">
            {isNextSectionOpen ? (
              <MdArrowDropUp size={32} className="cursor-pointer" />
            ) : (
              <MdArrowDropDown size={32} className="cursor-pointer" />
            )}
          </div>
        </div>
        {isNextSectionOpen && (
          <div className="px-6">
            <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
              <h3 className="text-[#374151] text-lg mb-3">Common Formats for Sharing Creatives Across Platforms</h3>
              <div className="grid w-1/2 gap-4 grid-cols-1 sm:grid-cols-2">
                {options.map((item, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[20px] shadow cursor-pointer ${
                      selectedOption === item.name ? "bg-[#00A0F5] text-white" : "bg-white"
                    }`}
                    onClick={() => handleOptionClick(item.name)}
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12" />
                    <p className="font-bold text-center">{item.name}</p>
                    <p className="text-sm text-center">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center w-full py-12">
              <button
                disabled={!selectedOption}
                className={`custom-button rounded-[20px] text-white py-4 px-20 whitespace-pre font-medium ${
                  selectedOption ? "" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  handleNextSection();
                  setIsCompleted(true);
                  setIsLoading(true);
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
