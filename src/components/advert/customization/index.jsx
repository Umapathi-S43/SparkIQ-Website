import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
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

  useEffect(() => {
    console.log('Customization setPage:', setPage); // Check if setPage is passed correctly
  }, [setPage]);

  return (
    <div className="container lg:mb-4 sm:mx-auto mb-4 lg:p-0 sm:p-4">
      <section className="border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] p-2 sm:p-4 flex flex-col gap-6 relative z-10 w-full max-w-full">
        <div
          className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-[32px] p-2 sm:p-4 relative cursor-pointer w-full max-w-full"
          onClick={() =>
            openModalCreativeSize ? toggleThirdSectionAccordion() : null
          }
        >
          <span className="flex items-center gap-4">
            <img src="/icon5.svg" alt="Icon" />
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
              <div className="flex flex-col lg:flex-row w-full max-w-full">
                <div
                  className="adCustomizationBg rounded-2xl lg:w-1/2 flex flex-col relative items-center justify-center px-2 sm:px-6 py-6 lg:py-20 w-full max-w-full"
                  style={{
                    background:
                      "linear-gradient(315.4deg, rgba(76, 161, 175, 0.2) 0.35%, rgba(196, 224, 229, 0.4) 99.65%)",
                  }}
                >
                  <div className="border border-white rounded-[30px] p-2 sm:p-4 relative flex justify-center w-11/12 lg:w-10/12">
                    <div className="flex justify-center absolute -top-5 sm:-top-9">
                      <button
                        className="slider_btn text-white rounded-[14px] rounded-b-none text-xs sm:text-sm py-1 sm:py-2 px-3 sm:px-6"
                        style={{
                          background: "linear-gradient(115deg, #004367 0%, #00A7FF 100%)",
                        }}
                      >
                        Preview
                      </button>
                    </div>
                    <div className="bg-white rounded-[30px] w-full max-w-full">
                      <div className="flex items-center justify-center w-full max-w-full">
                        <div className="bg-white shadow-lg rounded-[20px] overflow-hidden w-full max-w-full">
                          <div className="p-2 sm:p-4">
                            <div className="flex items-center mb-2 sm:mb-4">
                              <FaFacebook className="text-blue-600 text-xl sm:text-2xl md:text-3xl lg:text-4xl" />
                              <div className="ml-2 sm:ml-3">
                                <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
                                  Brand
                                </h3>
                                <p className="text-xs sm:text-sm md:text-base text-gray-500">
                                  Sponsored
                                </p>
                              </div>
                            </div>
                            <p className="mb-2 sm:mb-4 text-[#082A66] text-xs sm:text-sm md:text-base lg:text-md max-w-[20rem]">
                              {selectedCaption}
                            </p>
                            {selectedImage ? (
                              <img
                                src={selectedImage}
                                alt="Ad Image"
                                className="w-full h-[150px] sm:h-[200px] lg:w-[350px] lg:h-[300px] rounded-md mb-2 sm:mb-4 object-cover"
                              />
                            ) : (
                              <img
                                src="/image3.png"
                                alt="Ad Image"
                                className="w-full h-[150px] sm:h-[200px] lg:w-[350px] lg:h-[300px] rounded-md mb-2 sm:mb-4 object-cover"
                              />
                            )}

                            <div className="flex items-center justify-between mt-2 sm:mt-4 gap-2 sm:gap-4">
                              <p className="text-xs lg:text-sm">
                                {randomPhrase
                                  ? randomPhrase
                                  : captionDetails.content}
                              </p>
                              <button className="text-xs lg:text-sm px-2 py-1 whitespace-pre rounded-lg border border-[#605880]">
                                {captionDetails.cta}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2 sm:mt-4 lg:absolute lg:bottom-8 bottom-2">
                    <span className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-blue-600 rounded-full mx-1"></span>
                    <span className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-yellow-600 rounded-full mx-1"></span>
                    <span className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-red-600 rounded-full mx-1"></span>
                  </div>
                </div>
                <div className="lg:w-1/2 mt-6 lg:mt-0 w-full max-w-full">
                  <Tabs
                    selectedTabClassName="outline-none bg-white text-[#082A66] font-bold rounded-[20px] shadow"
                    selectedIndex={tabIndex}
                    onSelect={(index) => setTabIndex(index)}
                    className="w-full max-w-full"
                  >
                    <TabList className="border border-[#FCFCFC] rounded-[20px] shadow-sm px-2 sm:px-4 py-2 bg-[#FCFCFC40] w-fit mx-auto flex">
                      <Tab className="cursor-pointer flex items-center px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-md font-bold gap-1">
                        Creative
                      </Tab>
                      <Tab className="cursor-pointer flex items-center px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-md font-bold gap-1">
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
                    <TabPanel className="pt-4 px-2 sm:px-6">
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
