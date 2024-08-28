/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

const mediaSizes = [
  { name: "Post Size", size: "(1080*1080)" },
  { name: "Landscape Size", size: "(1200*628)" },
  { name: "Story Size", size: "(1080*1920)" },
  { name: "Portrait Size", size: "(1080*1350)" },
  { name: "Pin Size", size: "(1000*1500)" },
];

const facebookSizes = [
  { name: "Post Size", size: "(1080*1080)" },
  { name: "Landscape Size", size: "(1200*628)" },
  { name: "Story Size", size: "(1080*1920)" },
];

const googleSizes = [
  { name: "Story Size", size: "(1080*1920)" },
  { name: "Portrait Size", size: "(1080*1350)" },
  { name: "Pin Size", size: "(1000*1500)" },
];

export default function CreativeSize({
  toggleNextSectionAccordion,
  isNextSectionOpen,
  handleNextSection,
  setIsLoading,
  openModalProductDetails,
  isCompleted,
  setIsCompleted,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  localStorage.setItem('imageSize', JSON.stringify(selectedSize));
  const sectionRef = useRef(null);

  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isNextSectionOpen]);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    setSelectedSize("");
  };

  const getSizes = () => {
    if (selectedPlatform === "facebook") {
      return facebookSizes;
    } else if (selectedPlatform === "google") {
      return googleSizes;
    }
    return mediaSizes;
  };

  return (
    <div ref={sectionRef}>
       <section className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] ${!isNextSectionOpen ? 'p-2 lg:p-3' : 'p-0'} flex flex-col gap-6 relative z-10`}>
        <div
          className={`flex flex-wrap justify-between items-center bg-[rgba(252,252,252,0.40)] ${!isNextSectionOpen ? 'rounded-[20px] p-2' : 'rounded-t-[20px] p-4'}  relative cursor-pointer`}
          onClick={() =>
            openModalProductDetails ? toggleNextSectionAccordion() : null
          }
        >
          {isCompleted && (
            <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
              Completed <BiCheck size={20} />
            </span>
          )}
          <span className="flex items-center gap-4">
            <img src="/icon4.svg" alt="" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Select Creative Size
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Select your creative size below depending on the platform you
                want to advertise on.
              </p>
            </span>
          </span>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
            {selectedSize && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                  <p className="text-[#1E1154] font-medium">Format</p>
                </div>
                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                  <p className="text-[#1E1154] font-medium">{selectedSize}</p>
                </div>
              </div>
            )}
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
              <div className="flex flex-wrap justify-between items-center">
                <span>
                  <h4 className="text-[#082A66] font-bold lg:text-lg text-base">
                    Social Media Size
                  </h4>
                  <p className="text-[#374151] lg:text-lg text-xs">
                    Most common size for social media advertising
                  </p>
                </span>
                <span className="flex gap-4">
                  <FaFacebookF
                    className="bg-[#00279926] p-1 cursor-pointer"
                    size={20}
                    onClick={() => handlePlatformClick("facebook")}
                  />
                  <FaGoogle
                    className="bg-[#00279926] p-1 cursor-pointer"
                    size={20}
                    onClick={() => handlePlatformClick("google")}
                  />
                </span>
              </div>
              <div
                className={`pt-4 grid gap-4 ${
                  selectedPlatform
                    ? "grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                }`}
              >
                {getSizes().map((item, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center gap-2 w-full py-4 rounded-[20px] shadow cursor-pointer ${
                      selectedSize === item.size
                        ? "bg-[#00A0F5] text-white"
                        : "bg-white"
                    }`}
                    onClick={() => handleSizeClick(item.size)}
                  >
                    <img src="/image2.svg" alt="" className="" />
                    <p className="font-bold text-center">{item.name}</p>
                    <p className="text-sm">{item.size}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center w-full py-12">
              <button
                disabled={!selectedSize}
                className="custom-button rounded-[20px] text-white py-4 px-20 whitespace-pre font-medium"
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