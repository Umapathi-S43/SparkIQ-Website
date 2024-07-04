import React, { useState, useEffect } from "react";
import { FaFacebook, FaFacebookF, FaInstagram } from "react-icons/fa";
import Loader from "./Loader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { BiBookmark, BiComment, BiLike } from "react-icons/bi";
import { GoShare } from "react-icons/go";
import brandImage from "../../assets/dashboard_img/brand_img.png";

const textCaption =
  "🎨 Explore Infinite Creativity with fdg adfwerw 🌈🌟 Discover a Hint of Enigma, Infused with Grace💖 Embrace the Magic of tr5vy5✨ Elevate Your Sensory Journey for Just BDT 500 🌟";

const AdPreview = ({ setPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-grow mt-4">
      <div className="w-full max-w-6xl mx-auto  border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl p-2 mb-2">
          <span className="flex flex-item-col items-center gap-4">
            <img src="/icon1.svg" alt="" className="w-14" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl">Ads Preview</h4>
              <p className="text-[#374151] pr-20">
                Generate conversion-focused ad creatives using our unique AI.
              </p>
            </span>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-[180px] h-[90px] ml-72 right-14 relative bottom-[-6px] pb-0"
            />
          </span>
        </div>
        {isLoading ? (
          <div className="w-4/5 py-8">
            <Loader />
          </div>
        ) : (
          <div className="sticky overflow-auto">
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
                <div className="py-8">
                  <div className="rounded-[30px]">
                    <div className="flex items-center justify-center gap-8">
                      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 lg:w-1/4 opacity-60">
                        <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <FaFacebook className="text-blue-600 text-xl" />
                              <div className="ml-3">
                                <h3 className="font-semibold text-xs">Brand</h3>
                                <p className="text-xs text-gray-500">
                                  Sponsored
                                </p>
                              </div>
                            </div>
                            <p className="mb-4 text-[082A66] text-xs max-w-[20rem]">
                              {textCaption}
                            </p>
                            <img
                              src="/image3.png"
                              alt="Ad Image"
                              className="w-[200px] h-[150px] rounded-lg mb-4 object-cover"
                            />
                            <div className="flex items-center justify-between mt-4 gap-4">
                              <p className="text-[10px]">
                                Ashiqur Rahman artwork for sale - Only BDT 500!
                              </p>
                              <button className="text-[10px] px-2 py-1 whitespace-pre rounded-lg border border-[#605880]">
                                Learn More
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 lg:w-1/3">
                        <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <FaFacebook className="text-blue-600 text-3xl" />
                              <div className="ml-3">
                                <h3 className="font-semibold text-sm">Brand</h3>
                                <p className="text-xs text-gray-500">
                                  Sponsored
                                </p>
                              </div>
                            </div>
                            <p className="mb-4 text-[#082A66] max-w-[20rem]">
                              {textCaption}
                            </p>
                            <img
                              src="/image3.png"
                              alt="Ad Image"
                              className="w-[350px] h-[300px] rounded-lg mb-4 object-cover"
                            />
                            <div className="flex items-center justify-between mt-4 gap-4">
                              <p className="text-xs">
                                Ashiqur Rahman artwork for sale - Only BDT 500!
                              </p>
                              <button className="text-xs px-2 py-1 whitespace-pre rounded-lg border border-[#605880]">
                                Learn More
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 lg:w-1/4 opacity-60">
                        <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <FaFacebook className="text-blue-600 text-xl" />
                              <div className="ml-3">
                                <h3 className="font-semibold text-xs">Brand</h3>
                                <p className="text-xs text-gray-500">
                                  Sponsored
                                </p>
                              </div>
                            </div>
                            <p className="mb-4 text-[082A66] text-xs max-w-[20rem]">
                              {textCaption}
                            </p>
                            <img
                              src="/image3.png"
                              alt="Ad Image"
                              className="w-[200px] h-[150px] rounded-lg mb-4 object-cover"
                            />
                            <div className="flex items-center justify-between mt-4 gap-4">
                              <p className="text-[10px]">
                                Ashiqur Rahman artwork for sale - Only BDT 500!
                              </p>
                              <button className="text-[10px] px-2 py-1 whitespace-pre rounded-lg border border-[#605880]">
                                Learn More
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-6 gap-4">
                      <button
                        className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-2 px-6 whitespace-pre font-medium border border-[#0086CD80]"
                        onClick={() => setPage("generateAd")}
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
                    <div className="flex items-center justify-center gap-8">
                      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 lg:w-1/4 opacity-60">
                        <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <FaFacebook className="text-blue-600 text-xl" />
                              <div className="ml-3">
                                <h3 className="font-semibold text-xs">Brand</h3>
                                <p className="text-xs text-gray-500">
                                  Sponsored
                                </p>
                              </div>
                            </div>
                            <img
                              src="/image3.png"
                              alt="Ad Image"
                              className="w-[200px] h-[150px] rounded-lg mb-4 object-cover"
                            />
                            <div className="flex gap-2 justify-between pb-2">
                              <span className="flex gap-2">
                                <BiLike className="cursor-pointer" />{" "}
                                <BiComment className="cursor-pointer" />{" "}
                                <GoShare className="cursor-pointer" />
                              </span>{" "}
                              <BiBookmark className="cursor-pointer" />
                            </div>
                            <p className="mb-4 text-[082A66] text-xs max-w-[20rem]">
                              {textCaption}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 lg:w-1/3">
                        <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <FaFacebook className="text-blue-600 text-3xl" />
                              <div className="ml-3">
                                <h3 className="font-semibold text-sm">Brand</h3>
                                <p className="text-xs text-gray-500">
                                  Sponsored
                                </p>
                              </div>
                            </div>
                            <img
                              src="/image3.png"
                              alt="Ad Image"
                              className="w-[350px] h-[300px] rounded-lg mb-4 object-cover"
                            />
                            <div className="flex gap-2 justify-between pb-2">
                              <span className="flex gap-2">
                                <BiLike className="cursor-pointer" />{" "}
                                <BiComment className="cursor-pointer" />{" "}
                                <GoShare className="cursor-pointer" />
                              </span>{" "}
                              <BiBookmark className="cursor-pointer" />
                            </div>
                            <p className="mb-4 text-[#082A66] max-w-[20rem]">
                              {textCaption}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[20px] p-4 lg:w-1/4 opacity-60">
                        <div className="bg-white shadow-lg rounded-[20px] overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <FaFacebook className="text-blue-600 text-xl" />
                              <div className="ml-3">
                                <h3 className="font-semibold text-xs">Brand</h3>
                                <p className="text-xs text-gray-500">
                                  Sponsored
                                </p>
                              </div>
                            </div>
                            <img
                              src="/image3.png"
                              alt="Ad Image"
                              className="w-[200px] h-[150px] rounded-lg mb-4 object-cover"
                            />
                            <div className="flex gap-2 justify-between pb-2">
                              <span className="flex gap-2">
                                <BiLike className="cursor-pointer" />{" "}
                                <BiComment className="cursor-pointer" />{" "}
                                <GoShare className="cursor-pointer" />
                              </span>
                              <BiBookmark className="cursor-pointer" />
                            </div>
                            <p className="mb-4 text-[082A66] text-xs max-w-[20rem]">
                              {textCaption}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-6 gap-4">
                      <button
                        className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-2 px-6 whitespace-pre font-medium border border-[#0086CD80]"
                        onClick={() => setPage("generateAd")}
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
