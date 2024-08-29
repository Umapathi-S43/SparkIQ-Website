import React, { useState, useEffect } from "react";
import { FaFacebook, FaFacebookF, FaInstagram } from "react-icons/fa";
import Loader from "./Loader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { BiBookmark, BiComment, BiLike } from "react-icons/bi";
import { GoShare } from "react-icons/go";
import { useNavigate, useLocation } from "react-router-dom";

const textCaption = "🎨 Explore Infinite Creativity with fdg adfwerw 🌈🌟 Discover a Hint of Enigma, Infused with Grace💖 Embrace the Magic of tr5vy5✨ Elevate Your Sensory Journey for Just BDT 500 🌟";

const AdPreview = ({ setPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();
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

  const renderFacebookAd = (size, highlighted = false) => (
    <div className={`bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] ml-4 p-3 ${highlighted ? '' : windowWidth >= 750 ? 'opacity-60' : ''} ${size === 'large' ? 'lg:w-2/6' : 'lg:w-1/5'}`}>
      <div className="bg-white shadow-lg rounded-[20px] ">
        <div className="p-2">
          <div className="flex items-center mb-1">
            <FaFacebook className={`text-blue-600 ${size === 'large' ? 'text-3xl' : 'text-xl'}`} />
            <div className="ml-3">
              <h3 className="font-semibold text-xs">Brand</h3>
              <p className="text-xs text-gray-500">Sponsored</p>
            </div>
          </div>
          <p className={`mb-2 text-[082A66] ${size === 'large' ? 'text-xs' : 'text-xs'}`}>
            {textCaption}
          </p>
          <img
            src={previewImage} // Use the passed image here
            alt="Ad Image"
            className={`rounded-lg mb-2 object-cover w-full h-full ${size === 'large' ? 'lg:w-3/6' : 'lg:w-1/5'}`}
          />
          <div className="flex items-center justify-between mt-3 gap-1">
            <p className={`text-${size === 'large' ? 'xs' : '[10px]'}`}>
              Ashiqur Rahman artwork for sale - Only BDT 500!
            </p>
            <button className={`text-${size === 'large' ? 'xs' : '[10px]'} px-2 py-1 whitespace-pre rounded-lg border border-[#605880]`}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstagramAd = (size, highlighted = false) => (
    <div className={`bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] ml-0 p-2 ${highlighted ? '' : windowWidth >= 750 ? 'opacity-60' : ''} ${size === 'large' ? 'lg:w-1/5' : 'lg:w-1/5'}`}>
      <div className="bg-white shadow-lg rounded-[20px]">
        <div className="p-2">
          <div className="flex items-center mb-2">
            <FaInstagram className={`text-pink-600 ${size === 'large' ? 'text-3xl' : 'text-xl'}`} />
            <div className="ml-3">
              <h3 className="font-semibold text-xs">Brand</h3>
              <p className="text-xs text-gray-500">Sponsored</p>
            </div>
          </div>
          <img
            src={previewImage} // Use the passed image here
            alt="Ad Image"
            className={`rounded-lg mb-2 object-cover w-full ${size === 'large' ? 'h-[120px]' : 'h-[90px]'}`}
          />
          <div className="flex gap-2 justify-between pb-2">
            <span className="flex gap-2">
              <BiLike className="cursor-pointer" />{" "}
              <BiComment className="cursor-pointer" />{" "}
              <GoShare className="cursor-pointer" />
            </span>{" "}
            <BiBookmark className="cursor-pointer" />
          </div>
          <p className={`mb-2 text-justify text-[082A66] ${size === 'large' ? 'text-xs' : 'text-xs'} max-w-[20rem]`}>
            {textCaption}
          </p>
        </div>
      </div>
    </div>
  );

  const handleCustomizeAds = () => {
    navigate("/customsample", { state: { preview_img: previewImage } });
  };

  const handleNextStep = () => {
    navigate("/launchCampaign1", { state: { preview_img: previewImage } });
  };

  return (
    <div className="flex-grow mr-8 mt-0 overflow-auto">
      <div className="max-w-7xl w-full mx-auto mt-0 flex flex-col gap-4 border border-[#FCFCFC] rounded-3xl h-[calc(100vh-140px)]">
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
              <TabList className="border border-[#FCFCFC] rounded-[20px] shadow-sm px-2 py-1 bg-[#FCFCFC40] w-fit mx-auto flex">
                <Tab className="cursor-pointer flex items-center px-3 py-2 font-bold text-sm gap-1">
                  <FaFacebookF className="bg-[#1977F3] text-white rounded-full w-5 h-5" />{" "}
                  Facebook
                </Tab>
                <Tab className="cursor-pointer flex items-center px-3 py-2 font-bold text-sm gap-1">
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
