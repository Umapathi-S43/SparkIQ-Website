import React, { useState, useEffect } from "react";
import { FaFacebook, FaFacebookF, FaInstagram } from "react-icons/fa";
import Loader from "./Loader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FiMoreVertical } from 'react-icons/fi';
import "react-tabs/style/react-tabs.css";
import { FaRegHeart, FaRegComment } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { PiShareFat } from "react-icons/pi";
import { BiBookmark, BiComment, BiLike } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";

const textCaption = "🎨 Explore Infinite Creativity with fdg adfwerw 🌈🌟 Discover a Hint of Enigma, Infused with Grace💖 Embrace the Magic of tr5vy5✨ Elevate Your Sensory Journey for Just BDT 500 🌟";

const AdPreview = ({ setPage }) => {
  const location = useLocation();
  const { aimodel, templateColor } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeCard, setActiveCard] = useState(null); // Track which card is active
  
  const navigate = useNavigate();

  // Extract the passed preview image from location state
  const previewImage = location.state?.preview_img || "/image3.png"; // Default image if none is passed

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to handle the download of the ad image
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = previewImage; // previewImage is the image you want to download
    link.download = 'ad_image.jpg'; // Default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleMenu = (index) => {
    setActiveCard(activeCard === index ? null : index); // Toggle the menu for the specific card
  };

  const renderFacebookAd = (size, index) => {
    // Set the width based on the size prop
    const widthClass = size === 'large' ? 'w-[265px]' : size === 'medium' ? 'w-[300px]' : 'w-[210px]';

    return (
      <div className={`bg-white border border-[#e0e0e0] rounded-[12px] ml-0 p-2 shadow-sm ${size==='large'? '' : windowWidth >= 750 ? 'opacity-60' : ''} ${widthClass}`} key={index}>
        <div className="p-2 pt-0 pb-0 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <FaFacebook className={`text-blue-600 ${size === 'large' ? 'text-2xl' : 'text-xl'}`} />
              <div className="ml-2">
                <h3 className="font-semibold text-sm text-[#082A66]">Brand</h3>
                <p className="text-xs text-gray-500">Sponsored</p>
              </div>
            </div>

            {/* Three-dot menu */}
            <div className="relative">
              <button
                className={`text-gray-800 focus:outline-none p-1 rounded-full hover:bg-[#f1f1f1] ${activeCard === index  && size==='large'? 'bg-[#f1f1f1]' : size!='large'?'cursor-none':''}`}
                onClick={() => toggleMenu(index)}
              >
                <FiMoreVertical className="w-4 h-4" />
              </button>
              {activeCard === index && size==='large' && (
                <div className="absolute left-8 -mt-6 text-nowrap bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={handleDownload}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    Download Ad
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Top text with ellipses */}
          <p className={`mb-2 text-[#082A66] ${size === 'large' ? 'text-sm' : 'text-xs'}`} 
            style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 1, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'normal',
            }}>
            {textCaption}
          </p>  
          <img
            src={previewImage} // Use the passed image here
            alt="Ad Image"
            className={`rounded-[10px] mb-1 object-cover w-full h-auto`}
          />
          <div className="flex items-center justify-between bg-[#f0f0f0] p-1 gap-1 -mx-4 mb-2">
            {/* Bottom text with ellipses */}
            <p className={`text-${size === 'large' ? 'xs' : 'xs'} text-gray-800 truncate`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Ashiqur Rahman art work for sale - Only BDT 500!
            </p>
            <button className={`text-${size === 'large' ? 'xs' : 'xs'} px-3 py-1 whitespace-pre rounded-md border border-[#605880] bg-[#e5e7eb]`}>
              Learn More
            </button>
          </div>
          <div className="flex justify-between items-center border-t border-gray-300 pt-1">
            <button className="flex items-center text-gray-600 gap-1">
              <BiLike className="w-4 h-4" />
              <span className="text-xs">Like</span>
            </button>
            <button className="flex items-center text-gray-600 text-sm gap-1">
              <FaRegComment className="w-4 h-4" />
              <span className="text-xs">Comment</span>
            </button>
            <button className="flex items-center text-gray-600 text-sm gap-1">
              <PiShareFat className="w-4 h-4" />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderInstagramAd = (size, index, highlighted = false) => {
    // Set the width and height based on the size prop
    const widthClass = size === 'large' ? 'w-[270px]' : 'w-[200px]';
  
    return (
      <div className={`bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[18px] ml-0 p-2 ${size==='large' ? '' : windowWidth >= 750 ? 'opacity-60' : ''} ${widthClass}`} key={index}>
        <div className="bg-white shadow-lg rounded-[16px] relative"> {/* Added relative positioning */}
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaInstagram className={`text-pink-600 ${size === 'large' ? 'text-3xl' : 'text-xl'}`} />
                <div className="ml-3">
                  <h3 className="font-semibold text-xs">Brand</h3>
                  <p className="text-xs text-gray-500">Sponsored</p>
                </div>
              </div>
  
              {/* Three-dot menu */}
              <div className="relative">
                <button
                  className={`text-gray-800 focus:outline-none p-1 rounded-full hover:bg-[#f1f1f1] ${activeCard === index  && size==='large'? 'bg-[#f1f1f1]' : size!='large'?'cursor-none':''}`}
                  onClick={() => toggleMenu(index)}
                >
                  <FiMoreVertical className="w-4 h-4" />
                </button>
                {activeCard === index && size==='large' && (
                  <div className="absolute left-8 -mt-6 text-nowrap bg-white rounded-md shadow-lg z-10">
                    <button
                      onClick={handleDownload}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                    >
                      Download Ad
                    </button>
                  </div>
                )}
              </div>
            </div>
  
            <img
              src={previewImage} // Use the passed image here
              alt="Ad Image"
              className={`rounded-lg mb-2 object-cover w-full h-auto`}
            />
  
            <div className="flex gap-2 justify-between pb-2">
              <span className="flex gap-2">
                <FaRegHeart className="cursor-pointer" />{" "}
                <FaRegComment className="cursor-pointer" />{" "}
                <LuSend className="cursor-pointer" />
              </span>{" "}
              <BiBookmark className="cursor-pointer" />
            </div>
  
            {/* Bottom text with ellipses */}
            <p className={`mb-1 text-[082A66] ${size === 'large' ? 'text-xs' : 'text-xs'}`} 
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {textCaption}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  const handleCustomizeAds = () => {
    navigate("/customsample", { state: {
      preview_img: previewImage,
      aimodel: aimodel,
      templateColor: templateColor,
    },});
  };

  const handleNextStep = () => {
    navigate("/launchCampaign1", { state: { preview_img: previewImage } });
  };

  return (
    <div className="flex-grow mr-8 -mt-3 overflow-auto">
      <div className="max-w-7xl w-full mx-auto mt-0 flex flex-col gap-4 border border-[#FCFCFC] rounded-3xl h-[calc(100vh-135px)]">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-4 pb-0 relative">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="/icon1.svg" alt="" className="w-10 lg:w-12" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl lg:text-2xl">
                Ads Preview
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Generate conversion-focused ad creatives using our unique AI.
              </p>
            </span>
          </span>
          <img
            src="/image1.png"
            alt=""
            className="absolute bottom-0 lg:right-24 right-28 w-32 lg:w-40 hidden md:block"
          />
        </div>

        {isLoading ? (
          <div className="overflow-auto hide-scrollbar mb-4 pb-6" style={{ maxHeight: '70vh' }}>
            <Loader />
          </div>
        ) : (
          <div className="sticky overflow-auto">
            <Tabs
              selectedTabClassName="outline-none bg-white text-[#082A66] font-bold rounded-[20px] shadow"
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList className="border border-[#FCFCFC] rounded-xl shadow-sm px-1 py-1 bg-[#FCFCFC40] w-fit mx-auto flex">
                <Tab className="cursor-pointer flex items-center px-3 py-2 font-bold text-sm gap-1 rounded-lg">
                  <FaFacebookF className="bg-[#1977F3] text-white rounded-full w-5 h-5" />{" "}
                  Facebook
                </Tab>
                <Tab className="cursor-pointer flex items-center px-3 py-2 font-bold text-sm gap-1 rounded-lg">
                  <FaInstagram className="rounded-full w-5 h-5" /> Instagram
                </Tab>
              </TabList>
              <TabPanel>
                <div className="py-2 lg:m-0 m-2">
                  <div className="rounded-[30px]">
                    <div className={`flex items-center justify-center gap-8 ${windowWidth < 750 ? 'flex-col' : ''}`}>
                      {windowWidth < 750 ? (
                        <>
                          {renderFacebookAd('medium', true)}
                        </>
                      ) : (
                        <>
                          {renderFacebookAd('small')}
                          {renderFacebookAd('large', true)}
                          {renderFacebookAd('small')}
                        </>
                      )}
                    </div>
                    <div className="flex justify-center mt-2 gap-4">
                      <button
                        className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-1 px-3 whitespace-pre font-medium border border-[#0086CD80]"
                        onClick={handleCustomizeAds}
                      >
                        Customize Ads
                      </button>
                      <button
                        className="w-fit custom-button rounded-[10px] text-white py-1 px-3 whitespace-pre font-medium"
                        onClick={handleDownload}
                      >
                        Download Ad
                      </button>
                      <button
                        className="w-fit custom-button rounded-[10px] text-white py-1 px-3 whitespace-pre font-medium"
                        onClick={handleNextStep}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="py-3 lg:m-0 m-2">
                  <div className="rounded-[30px]">
                    <div className={`flex items-center justify-center gap-8 ${windowWidth < 750 ? 'flex-col' : ''}`}>
                      {windowWidth < 750 ? (
                        <>
                          {renderInstagramAd('medium', true)}
                        </>
                      ) : (
                        <>
                          {renderInstagramAd('small')}
                          {renderInstagramAd('large', true)}
                          {renderInstagramAd('small')}
                        </>
                      )}
                    </div>
                    <div className="flex justify-center mt-2 gap-4">
                      <button
                        className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-1 px-3 whitespace-pre font-medium border border-[#0086CD80]"
                        onClick={handleCustomizeAds}
                      >
                        Customize Ads
                      </button>
                      <button
                        className="w-fit custom-button rounded-[10px] text-white py-1 px-3 whitespace-pre font-medium"
                        onClick={handleNextStep}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPreview;
