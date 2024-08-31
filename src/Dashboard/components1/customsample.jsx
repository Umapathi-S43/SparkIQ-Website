import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { RiArrowGoBackLine } from "react-icons/ri";
import "react-tabs/style/react-tabs.css";
import brandImage from '../../assets/dashboard_img/brand_img.png';
import Creative from "../../components/advert/customization/Creative";
import Caption from "../../components/advert/customization/Caption";
import '../../components/advert/index.css';

export default function CustomSample({
  isLoading,
  setPage,
  openModalCreativeSize,
}) {
  const location = useLocation();
  const { state } = location;
  const [generatedImageURL, setGeneratedImageURL] = useState(state?.image ||state?.preview_img|| null);
  const [selectedImage, setSelectedImage] = useState(state?.image ||state?.preview_img|| null);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCaption, setSelectedCaption] = useState(
    "🎨 Discover Uniqueness with Ashiqur Rahman: A Blend of Abstract and Precision  🧩 Thought-Provoking Artistry 💲 Priced at USD 400 A Touch of Elegance to Your Collection."
  );

  const [captionDetails, setCaptionDetails] = useState({
    cta: "Discover more",
    content: "Transform your routine",
  });

  const [randomPhrase, setRandomPhrase] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/campaigns', {
      state: {
        fromSection: state?.fromSection || 3,
        image: selectedImage,
      },
    });
  };

  const handleNextClick = () => {
    navigate('/adPreview', {
      state: {
        preview_img: selectedImage || generatedImageURL, // Pass the selected or generated image as preview_img
      },
    });
  };

  return (
    <div className="min-h-screen p-3 py-1 bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col items-center justify-center">
      <div className="border-2 border-white rounded-[32px] w-full">
        <div className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-t-[32px] p-5 w-full">
          <span className="flex items-center gap-4">
            <img src="/icon5.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl">
                Ad Customization
              </h4>
              <p className="text-[#374151] text-sm">
                Customize your ad based on your preferences.
              </p>
            </span>
          </span>
          <img src={brandImage} alt="Brand Banner" className="-mb-5 right-24 w-36 hidden lg:block" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 p-4">
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="adCustomizationBg rounded-2xl flex flex-col relative items-center justify-left px-4 py-2 w-full" style={{ background: "linear-gradient(315.4deg, rgba(76, 161, 175, 0.2) 0.35%, rgba(196, 224, 229, 0.4) 99.65%)" }}>
            <div className="absolute top-0 left-0 m-4 mt-0">
              {/* Your top-left content here */}
              <span className="text-base font-bold" onClick={handleBackClick}><RiArrowGoBackLine />back</span>
            </div>
              <div className="border border-white rounded-[24px] p-3 relative flex justify-center max-w-xs">
                <div className="flex-col justify-center absolute -top-7">
                  <button
                    className="text-white rounded-[8px] rounded-b-none text-sm py-1 px-4 mt-3"
                    style={{ background: "linear-gradient(115deg, #004367 0%, #00A7FF 100%)" }}
                  >
                    Preview
                  </button>
                </div>
                <div className="bg-white rounded-[24px] w-full">
                  <div className="flex items-center justify-center w-full">
                    <div className="bg-white shadow-lg rounded-[20px] overflow-hidden w-full">
                      <div className="p-4">
                        <div className="flex items-center mb-4">
                          <FaFacebook className="text-blue-600 text-3xl" />
                          <div className="ml-3">
                            <h3 className="font-semibold text-sm">Brand</h3>
                            <p className="text-xs text-gray-500">Sponsored</p>
                          </div>
                        </div>
                        <p className="mb-4 text-[#082A66] text-sm text-justify w-[16rem]">
                          {selectedCaption}
                        </p>
                        {selectedImage ? (
                          <img src={selectedImage} alt="Ad Image" className="w-[20rem] rounded-md mb-4 object-cover" />
                        ) : (
                          <div className="w-[20rem] flex justify-center items-center rounded-md mb-4 bg-gray-100">
                            <img
                              src={generatedImageURL}
                              alt="Ad Image"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-4 gap-4">
                          <p className="text-sm">
                            {randomPhrase ? randomPhrase : captionDetails.content}
                          </p>
                          <button className="text-sm px-2 py-1 whitespace-pre rounded-lg border border-[#605880]">
                            {captionDetails.cta}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <span className="h-4 w-4 bg-blue-600 rounded-full mx-1"></span>
                <span className="h-4 w-4 bg-yellow-600 rounded-full mx-1"></span>
                <span className="h-4 w-4 bg-red-600 rounded-full mx-1"></span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-6">
           <Tabs
              selectedTabClassName="outline-none bg-white text-[#082A66] font-bold rounded-[20px] shadow"
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
              className="w-full"
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
                  handleBackClick={handleBackClick}
                  aimodel={state?.aimodel}
                  templateColor={state?.templateColor}
                  handleNextClick={handleNextClick} // Pass handleNextClick to Creative
                />
              </TabPanel>
              <TabPanel className="pt-4 px-2 sm:px-6">
                <Caption
                  setPage={setPage}
                  setSelectedCaption={setSelectedCaption}
                  selectedCaption={selectedCaption}
                  handleBackClick={handleBackClick}
                  handleNextClick={handleNextClick} // Pass handleNextClick to Caption
                />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
