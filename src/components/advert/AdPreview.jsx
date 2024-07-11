import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaFacebookF, FaInstagram } from "react-icons/fa";
import Loader from "./Loader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { BiBookmark, BiComment, BiLike } from "react-icons/bi";
import { GoShare } from "react-icons/go";

const textCaption =
  "🎨 Explore Infinite Creativity with fdg adfwerw 🌈🌟 Discover a Hint of Enigma, Infused with Grace💖 Embrace the Magic of tr5vy5✨ Elevate Your Sensory Journey for Just BDT 500 🌟";

const AdPreview = ({ setPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();


  const handleCustomizeAds = () => {
    navigate('/CustomizationAdsPage');
  };

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
    <div className={`bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 ${highlighted ? '' : windowWidth >= 750 ? 'opacity-60' : ''} ${size === 'large' ? 'lg:w-1/3' : 'lg:w-1/4'}`}>
      <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <FaFacebook className={`text-blue-600 ${size === 'large' ? 'text-3xl' : 'text-xl'}`} />
            <div className="ml-3">
              <h3 className="font-semibold text-xs">Brand</h3>
              <p className="text-xs text-gray-500">Sponsored</p>
            </div>
          </div>
          <p className={`mb-4 text-[082A66] ${size === 'large' ? 'text-sm' : 'text-xs'} max-w-[20rem]`}>
            {textCaption}
          </p>
          <img
            src="/image3.png"
            alt="Ad Image"
            className={`rounded-lg mb-4 object-cover w-full h-auto ${size === 'large' ? 'h-[300px]' : 'h-[150px]'}`}
          />
          <div className="flex items-center justify-between mt-4 gap-4">
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
    <div className={`bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 ${highlighted ? '' : windowWidth >= 750 ? 'opacity-60' : ''} ${size === 'large' ? 'lg:w-1/3' : 'lg:w-1/4'}`}>
      <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <FaInstagram className={`text-pink-600 ${size === 'large' ? 'text-3xl' : 'text-xl'}`} />
            <div className="ml-3">
              <h3 className="font-semibold text-xs">Brand</h3>
              <p className="text-xs text-gray-500">Sponsored</p>
            </div>
          </div>
          <img
            src="/image3.png"
            alt="Ad Image"
            className={`rounded-lg mb-4 object-cover w-full h-auto ${size === 'large' ? 'h-[300px]' : 'h-[150px]'}`}
          />
          <div className="flex gap-2 justify-between pb-2">
            <span className="flex gap-2">
              <BiLike className="cursor-pointer" />{" "}
              <BiComment className="cursor-pointer" />{" "}
              <GoShare className="cursor-pointer" />
            </span>{" "}
            <BiBookmark className="cursor-pointer" />
          </div>
          <p className={`mb-4 text-[082A66] ${size === 'large' ? 'text-sm' : 'text-xs'} max-w-[20rem]`}>
            {textCaption}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-grow overflow-auto">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 border border-[#FCFCFC] rounded-3xl h-[calc(100vh-180px)]">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-6 relative pb-4">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="/icon1.svg" alt="" className="w-10 lg:w-14" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl lg:text-2xl">
                Ads Preview
              </h4>
              <p className="text-[#374151] text-xs lg:text-base">
                Generate conversion-focused ad creatives using our unique AI.
              </p>
            </span>
          </span>
          <img
            src="/image1.png"
            alt=""
            className="absolute bottom-0 lg:right-24 right-28 w-32 lg:w-44 hidden md:block"
          />
        </div>
        {isLoading ? (
          <div className=" justify-center overflow-auto hide-scrollbar" style={{maxHeight:'60vh'}}>
            <Loader />
          </div>
        ) : (
          <div className="sticky overflow-auto hide-scrollbar" style={{ maxHeight: '70vh' }}>
            <Tabs
              selectedTabClassName="outline-none bg-white text-[#082A66] font-bold rounded-[20px] shadow"
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList className="border border-[#FCFCFC] rounded-[20px] shadow-sm px-2 py-2 bg-[#FCFCFC40] w-fit mx-auto flex">
                <Tab className="cursor-pointer flex items-center p-3 font-bold text-sm gap-1">
                  <FaFacebookF className="bg-[#1977F3] text-white rounded-full w-5 h-5" />{" "}
                  Facebook
                </Tab>
                <Tab className="cursor-pointer flex items-center p-3 font-bold text-sm gap-1">
                  <FaInstagram className="rounded-full w-5 h-5" /> Instagram
                </Tab>
              </TabList>
              <TabPanel>
                <div className="py-8 lg:m-0 m-2">
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
                    <div className="flex justify-center mt-6 gap-4">
                      <button
                        className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-2 px-6 whitespace-pre font-medium border border-[#0086CD80]"
                        onClick={() => setPage("customizationAd")}
                      >
                        Customize Ads
                      </button>
                      <button
                        className="w-fit custom-button rounded-[10px] text-white py-2 px-6 whitespace-pre font-medium"
                        onClick={() => setPage("lauchCampaign")}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="py-8">
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
                    <div className="flex justify-center mt-6 gap-4">
                      <button
                        className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-2 px-6 whitespace-pre font-medium border border-[#0086CD80]"
                        onClick={() => setPage("customizationAd")}
                      >
                        Customize Ads
                      </button>
                      <button
                        className="w-fit custom-button rounded-[10px] text-white py-2 px-6 whitespace-pre font-medium"
                        onClick={() => setPage("lauchCampaign")}
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
