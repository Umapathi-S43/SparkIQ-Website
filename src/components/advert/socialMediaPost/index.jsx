import { useState, useRef, useEffect } from "react";
import { FaCheck, FaGlobe } from "react-icons/fa";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { FaFacebookF, FaGoogle, FaYoutube, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

export default function SocialMediaPost({
  isNextSectionOpen,
  toggleNextSectionAccordion,
  handleNextSection,
  isCompleted,
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [objective, setObjective] = useState("");
  const sectionRef = useRef(null);

  const platforms = [
    { name: "Instagram", icon: "src/assets/media/insta.png" },
    { name: "Facebook", icon: "src/assets/media/facebook.png" },
    { name: "LinkedIn", icon: "src/assets/media/linkedin.png" },
    { name: "Twitter", icon: "src/assets/media/twitter.png" },
    { name: "WhatsApp", icon: "src/assets/media/whatsapp.png" },
    { name: "YouTube", icon: "src/assets/media/youtube.png" },
  ];
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
  const linkedInSizes = [
    { name: "Post Size", size: "(1200*628)" },
    { name: "Ad Size", size: "(1200*300)" },
    { name: "Banner Size", size: "(1584*396)" },
  ];

  const twitterSizes = [
    { name: "Post Size", size: "(1024*512)" },
    { name: "Ad Size", size: "(1200*600)" },
    { name: "Header Size", size: "(1500*500)" },
  ];

  const whatsappSizes = [
    { name: "Status Size", size: "(1080*1920)" },
    { name: "Profile Photo Size", size: "(500*500)" },
    { name: "Ad Banner Size", size: "(1200*600)" },
  ];

  const instagramSizes = [
    { name: "Post Size", size: "(1080*1080)" },
    { name: "Story Size", size: "(1080*1920)" },
    { name: "Reel Size", size: "(1080*1350)" },
  ];

  const youtubeSizes = [
    { name: "Thumbnail Size", size: "(1280*720)" },
    { name: "Channel Art Size", size: "(2560*1440)" },
    { name: "Ad Video Size", size: "(1920*1080)" },
  ];


  const [selectedPlatform, setSelectedPlatform] = useState(null);
  localStorage.setItem('imageSize', JSON.stringify(selectedSize));

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
    } else if (selectedPlatform === "linkedin") {
      return linkedInSizes;
    } else if (selectedPlatform === "whatsapp") {
      return whatsappSizes;
    } else if (selectedPlatform === "twitter") {
      return twitterSizes;
    } else if (selectedPlatform === "instagram") {
      return instagramSizes;
    } else if (selectedPlatform === "youtube") {
      return youtubeSizes;
    }
    return mediaSizes;
  };

  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  const togglePlatformSelection = (platformName) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformName)) {
        return prev.filter((platform) => platform !== platformName);
      }
      return [...prev, platformName];
    });
    setSelectedSize(""); // Reset size selection when platforms are toggled
  };



  return (
    <div ref={sectionRef}>
      <section
        className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] pb-2 ${!isNextSectionOpen ? "p-2 lg:p-3" : "p-0"
          } flex flex-col gap-6 relative z-10`}
        style={{ height: "auto" }} // Ensure the height is dynamic
      >
        <div
          className={`flex flex-wrap justify-between items-center bg-[rgba(252,252,252,0.40)] ${!isNextSectionOpen ? "rounded-[20px] p-2" : "rounded-t-[20px] p-4"
            } relative cursor-pointer`}
          onClick={toggleNextSectionAccordion}
        >
          {isCompleted && (
            <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
              Completed <MdArrowDropUp size={20} />
            </span>
          )}
          <span className="flex items-center gap-4">
            <img src="/icon4.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Creative Objective
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Select your preferred platforms and sizes below.
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
            {/* Text Area for Objective */}
            <div className="mb-6 bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
              <h3 className="text-[#374151] text-lg mb-3">Describe Your Objective</h3>
              <textarea
                className="w-full p-3 rounded-lg shadow-md border border-[#E5E7EB] mb-2"
                rows="4"
                placeholder="Example: I want to create an educational post about my services"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button className="text-sm custom-button text-white px-4 py-2 rounded-md">
                  Enhance with AI
                </button>
                <button className="custom-button text-sm text-white px-4 py-2 rounded-md">
                  Submit
                </button>
              </div>
            </div>
            {/* AI Suggestions Section */}
            <div className="mb-6 bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
              <h3 className="text-[#082A66] text-lg font-bold mb-4">AI Suggestions</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { title: "Daily Quote", icon: <FaLinkedinIn />, text: "LinkedIn Post" },
                  { title: "Educational Post", icon: <FaInstagram />, text: "Instagram Post" },
                  { title: "Week Calender", icon: <FaWhatsapp />, text: "WhatsApp Status" },
                  { title: "Story", icon: <FaGlobe />, text: "Social Media Story" },
                  { title: "Offers", icon: <FaInstagram />, text: "Instagram Story" },
                ].map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-center gap-2 w-full py-6 rounded-[20px] shadow border border-[#E5E7EB] bg-white cursor-pointer ${selectedPlatforms.includes(suggestion.title)
                      ? ""
                      : "bg-white text-[#082A66]"
                      }`}
                    onClick={() => togglePlatformSelection(suggestion.title)}
                  >
                    {/* Suggestion Title */}
                    <p className="font-bold text-center">{suggestion.title}</p>

                    {/* Suggestion Icon and Text */}
                    <p className="text-sm flex items-center gap-2">
                      {suggestion.icon}
                      {suggestion.text}
                    </p>

                    {/* Checkmark for Selected Suggestion */}
                    {selectedPlatforms.includes(suggestion.title) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                        <FaCheck className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Select Platforms */}
            <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
            <h4 className="text-[#082A66] font-bold lg:text-lg text-base">
                        Select Social Media Platform
                      </h4>
              <div className="flex flex-wrap gap-4 p-4">
                {platforms.map((platform, idx) => (
                  <div
                    key={idx}
                    className={`relative w-36 h-36 rounded-md bg-gray-50 border hover:shadow-md cursor-pointer p-4 flex flex-col items-center justify-center ${selectedPlatforms.includes(platform.name) ? "" : ""
                      }`}
                    onClick={() => togglePlatformSelection(platform.name)}
                  >
                    {/* Platform Icon */}
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      className="w-20 h-20 object-contain mb-2" // Adjusted for proper spacing
                    />
                    {/* Platform Name */}
                    <span className="text-sm font-medium text-center">{platform.name}</span>
                    {/* BiCheck for Selected Platforms */}
                    {selectedPlatforms.includes(platform.name) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                        <FaCheck className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Select Size */}
            <>
              {/* <h3 className="text-[#374151] text-lg mt-4 mb-3">Select Size</h3> */}
              <div className="mt-6">
                <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
                  <div className="flex flex-wrap justify-between items-center">
                    <span>
                    <h4 className="text-[#082A66] font-bold lg:text-lg text-base">
                        Select Social Media Size
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
                      <FaLinkedinIn
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handlePlatformClick("linkedin")}
                      />
                      <FaWhatsapp
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handlePlatformClick("whatsapp")}
                      />
                      <FaTwitter
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handlePlatformClick("twitter")}
                      />
                      <FaInstagram
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handlePlatformClick("instagram")}
                      />
                      <FaYoutube
                        className="bg-[#00279926] p-1 cursor-pointer"
                        size={20}
                        onClick={() => handlePlatformClick("youtube")}
                      />
                    </span>

                  </div>
                  <div
                    className={`pt-4 grid gap-4 ${selectedPlatform
                      ? "grid-cols-1 sm:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                      }`}
                  >
                    {getSizes().map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center gap-2 w-full py-4 rounded-[20px] shadow cursor-pointer ${selectedSize === item.size
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
              </div>
            </>
            <div className="flex items-center justify-center w-full py-12">
              <button
                className="custom-button rounded-[20px] text-white py-4 px-10 whitespace-pre font-medium"
                onClick={() => {
                  handleNextSection();
                  setIsCompleted(true);
                  setIsLoading(true);
                }}
              >
                Generate Creatives
              </button>
            </div>
          </div>

        )}
      </section>
    </div>
  );
}
