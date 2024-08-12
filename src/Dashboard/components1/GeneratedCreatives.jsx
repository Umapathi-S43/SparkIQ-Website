import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../components/utils/Constant";
import "./GeneratedCreatives.css";

const GeneratedCreatives = ({
  isThirdSectionOpen,
  toggleThirdSectionAccordion,
  isLoading,
  setIsLoading,
  setPage,
  openModalCreativeSize,
  isPreviousSectionsCompleted = true // Default to true or false if not provided
}) => {
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("Brand Color");
  const [modelData, setModelData] = useState([]);
  const [loadingModel, setLoadingModel] = useState(true);

  const storedProductID = JSON.parse(localStorage.getItem("productId")) || null;
  const storedImageSize = JSON.parse(localStorage.getItem("imageSize")) || "";
  const cleanedSize = storedImageSize.replace(/[()]/g, "");

  const templateColors = {
    "Brand Color": "brand_color",
    "Single Color": "plain_color",
    "Gradient Color": "gradient_color",
  };

  const modelMapping = {
    "unaware": ["PAS"],
    "problem aware": ["PAS"],
    "solution aware": ["AIDA", "FAB"],
    "product aware": ["AIDA", "FAB", "USP"],
    "most aware": ["FAB", "USP"],
  };

  const navigate = useNavigate();

  const fetchModelData = async (modelName) => {
    const url = `${baseUrl}/generate/${storedProductID}/${cleanedSize}/${templateColors[selectedTab]}/${modelName}`;
    console.log("Generated URL:", url);

    const models = modelMapping[modelName];
    for (let i = 0; i < models.length; i++) {
      try {
        const response = await axios.post(url);
        if (response.data.message) {
          const res = await axios.get(
            `${baseUrl}/generated-images/model/${models[i]}`
          );
          return res.data;
        }
      } catch (error) {
        console.error(`Failed to fetch ${models[i]} model`, error);
        continue; // Try the next model if the current one fails
      }
    }
    return []; // Return empty if all models fail
  };

  const loadCreatives = async () => {
    // Check if the third section is open and previous sections are completed
    if (!isThirdSectionOpen || !isPreviousSectionsCompleted) {
      return; // Do not proceed if conditions are not met
    }

    setLoadingModel(true);
    const models = ["unaware", "problem aware", "solution aware", "product aware", "most aware"];

    for (let i = 0; i < models.length; i++) {
      const data = await fetchModelData(models[i]);
      setModelData(prevData => [...prevData, { modelName: models[i], creatives: data }]);
    }

    setLoadingModel(false);
  };

  useEffect(() => {
    if (isThirdSectionOpen && isPreviousSectionsCompleted) {
      loadCreatives();
    }
  }, [selectedTab, isThirdSectionOpen, isPreviousSectionsCompleted]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setModelData([]);
    setIsLoading(true);
  };

  const FilteredData = ({ filteredModel, modelName }) => {
    const filteredProducts = filteredModel.filter((product) => {
      return (
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    return (
      <>
        <h3 className="font-bold text-lg mb-2">{modelName}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:px-5 pb-2 w-full overflow-auto">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.25)] p-3 pb-1 flex flex-col items-center justify-between"
            >
              <img
                src={product.imageURL || product.generatedImageURL}
                alt={product.title}
                className="object-cover w-full rounded-lg"
              />
              <div className="button-wrapper mt-1">
                <button className="text-sm text-[#A8A8A8]">
                  <div className="button-container">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        stroke="#A8A8A8"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    <span>Save</span>
                  </div>
                </button>
                <button
                  className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                  onClick={() =>
                    navigate(`/edit_template?id=${encodeURIComponent(product.id)}`)
                  }
                >
                  <div className="button-container">
                    <svg
                      className="edit-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="edit-icon-path"
                        d="M11.6564 3.65685C11.8469 3.46632 12.1531 3.46632 12.3436 3.65685L14.3436 5.65685C14.5342 5.84737 14.5342 6.15353 14.3436 6.34406L6.37492 14.3127C6.28097 14.4067 6.15792 14.4645 6.02724 14.4746L3.02724 14.7246C2.88342 14.7365 2.74001 14.6882 2.63433 14.584C2.52865 14.4797 2.47272 14.3361 2.48451 14.1923L2.73451 11.1923C2.74455 11.0616 2.80233 10.9385 2.89635 10.8446L10.865 2.87592L11.6564 3.65685Z"
                        stroke="#A8A8A8"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <rect
                        className="edit-icon-rect"
                        x="3"
                        y="16"
                        width="10"
                        height="1.5"
                        fill="#A8A8A8"
                      />
                    </svg>
                    <span className="-ml-1">Edit</span>
                  </div>
                </button>
                <button
                  className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                  onClick={() => navigate("/customsample")}
                >
                  <div className="button-container">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#A8A8A8"
                      width="20"
                      height="20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                      />
                    </svg>
                    <span>Preview</span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const CardLoader = () => {
    return (
      <div className="animate-pulse rounded-lg shadow-md">
        <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
      </div>
    );
  };

  return (
    <div className="container lg:mb-4 sm:mx-auto mb-4 lg:p-0 sm:p-4 flex-grow">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#004367", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#00A7FF", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
      </svg>
      <section className="border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] p-2 sm:p-4 flex flex-col gap-6 relative z-10">
        <div
          className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-[32px] p-2 sm:p-4 relative cursor-pointer"
          onClick={toggleThirdSectionAccordion}
        >
          <span className="flex items-center gap-4">
            <img src="/icon5.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Generated Creatives
              </h4>
              <p className="text-[#374151] text-xs lg:text-base">
                Choose one for your ad. If you are happy with more than one save
                it for future!
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
            {loadingModel ? (
              <div className="w-full py-8">
                {[...Array(4)].map((_, index) => (
                  <CardLoader key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row w-full max-w-full">
                <div className="lg:w-full mt-6 lg:mt-0 w-full max-w-full">
                  <div className="flex justify-end w-full px-5 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-white rounded-xl mr-4">
                        <div className="relative w-full">
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                          />
                          <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 focus:text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="tab-buttons flex justify-center items-center gap-12 w-4/6 mb-2 border-4 py-1 rounded-xl shadow-md">
                      {["Brand Color", "Single Color", "Gradient Color"].map(
                        (tab) => (
                          <button
                            key={tab}
                            className={`px-5 py-2 rounded-lg ${
                              selectedTab === tab
                                ? "bg-gradient-to-r from-[#004367] to-[#00A7FF] text-white"
                                : "bg-[#FCFCFC20] text-gray-700 border-2"
                            }`}
                            onClick={() => handleTabChange(tab)}
                          >
                            {tab}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div style={{ maxHeight: "80vh" }}>
                    {modelData.map((data, index) => (
                      <FilteredData
                        key={index}
                        filteredModel={data.creatives}
                        modelName={data.modelName}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default GeneratedCreatives;
