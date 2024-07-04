/* eslint-disable react/prop-types */
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import { FaFacebook, FaFacebookF, FaInstagram } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Creative from "./Creative";
import Caption from "./Caption";

export default function Customization({
  toggleThirdSectionAccordion,
  isThirdSectionOpen,
  isLoading,
  setIsLoading,
  setPage,
  openModalCreativeSize,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const [selectedCaption, setSelectedCaption] = useState(
    "🎨 Discover Uniqueness with Ashiqur Rahman: A Blend of Abstract and Precision  🧩 Thought-Provoking Artistry 💲 Priced at USD 400 A Touch of Elegance to Your Collection."
  );

  const [captionDetails, setCaptionDetails] = useState({
    cta: "Discover more",
    content: "Transform your routine",
  });
  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div>
      <section className="border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] p-2 lg:p-4 flex flex-col gap-6 relative z-10">
        <div
          className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-[32px] lg:p-4 p-4 relative cursor-pointer"
         onClick={() =>
            openModalCreativeSize ? toggleThirdSectionAccordion() : ull
          }
        >
          <span className="flex items-center gap-4">
            <img src="/icon5.svg" alt="" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Ad Customization
              </h4>
              <p className="text-[#374151] text-xs lg:text-base">
                Customize your ad based on your preferences.
              </p>
            </span>
          </span>
          {isThirdSectionOpen ? (
            <MdArrowDropUp size={32} className="cursor-pointer" />
          ) : (
            <MdArrowDropDown size={32} className="cursor-pointer" />
          )}
        </div>
        {isThirdSectionOpen && (
          <>
            {isLoading ? (
              <div className="w-full py-8">
              <Loader />
            </div>
            ) : (
              <div className="flex">
                <div className="adCustomizationBg rounded-2xl lg:w-1/2 flex flex-col relative items-center justify-center px-6 py-20">
                  <div className="border border-white rounded-[30px] p-8 relative flex justify-center">
                    <div className="flex justify-center absolute -top-9">
                      <button className="slider_btn text-white rounded-[20px] rounded-b-none text-sm py-2 px-6">
                        Preview
                      </button>
                    </div>
                    <div className="bg-white rounded-[30px]">
                      <div className="flex items-center justify-center">
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
                            <p className="mb-4 text-[082A66] max-w-[20rem]">
                              {selectedCaption}
                            </p>
                            {selectedImage ? (
                              <img
                                src={selectedImage}
                                alt="Ad Image"
                                className="w-[350px] h-[300px] rounded-lg mb-4 object-cover"
                              />
                            ) : (
                              <img
                                src="/image3.png"
                                alt="Ad Image"
                                className="w-[350px] h-[300px] rounded-lg mb-4 object-cover"
                              />
                            )}

                            <div className="flex items-center justify-between mt-4 gap-4">
                              <p className="text-xs">
                                {randomPhrase
                                  ? randomPhrase
                                  : captionDetails.content}
                              </p>
                              <button className="text-xs px-2 py-1 whitespace-pre rounded-lg border border-[#605880]">
                                {captionDetails.cta}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4 absolute bottom-4">
                    <span className="h-6 w-6 bg-blue-600 rounded-full mx-1"></span>
                    <span className="h-6 w-6 bg-yellow-600 rounded-full mx-1"></span>
                    <span className="h-6 w-6 bg-red-600 rounded-full mx-1"></span>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <Tabs
                    selectedTabClassName="outline-none bg-white text-[#082A66] font-bold rounded-[20px] shadow"
                    selectedIndex={tabIndex}
                    onSelect={(index) => setTabIndex(index)}
                  >
                    <TabList className="border border-[#FCFCFC] rounded-[20px] shadow-sm px-2 py-2 bg-[#FCFCFC40] w-fit mx-auto flex">
                      <Tab className="cursor-pointer flex items-center px-6 py-2 font-bold text-sm gap-1">
                        Creative
                      </Tab>
                      <Tab className="cursor-pointer flex items-center px-6 py-2 font-bold text-sm gap-1">
                        Caption
                      </Tab>
                    </TabList>

                    <TabPanel>
                      <Creative
                        setRandomPhrase={setRandomPhrase}
                        setCaptionDetails={setCaptionDetails}
                        setSelectedImage={setSelectedImage}
                        randomPhrase={randomPhrase}
                        captionDetails={captionDetails}
                        setPage={setPage}
                      />
                    </TabPanel>
                    <TabPanel className="pt-4 px-6">
                      <Caption
                        setPage={setPage}
                        setSelectedCaption={setSelectedCaption}
                        selectedCaption={selectedCaption}
                      />
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
