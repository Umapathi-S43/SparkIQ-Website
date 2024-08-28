import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../components/utils/Constant";
import "./GeneratedCreatives.css";
import { jwtToken } from "../../components/utils/jwtToken";

const GeneratedCreatives = ({
  isThirdSectionOpen,
  toggleThirdSectionAccordion,
  isLoading,
  setIsLoading,
  setPage,
  openModalCreativeSize,
  isPreviousSectionsCompleted = true,
  initialBrandAwarenessData = [],  // Add these props
  initialSaleData = [],            // Add these props
  initialRetargetingData = [],     // Add these props
  initialSelectedTab = "Brand Color",  // Add this prop

}) => {
  const [brandAwarenessData, setBrandAwarenessData] = useState(initialBrandAwarenessData.length > 0 ? initialBrandAwarenessData : []);
  const [saleData, setSaleData] = useState(initialSaleData.length > 0 ? initialSaleData : []);
  const [retargetingData, setRetargetingData] = useState(initialRetargetingData.length > 0 ? initialRetargetingData : []);
  
  const [loadingBrandAwareness, setLoadingBrandAwareness] = useState(true);
  const [loadingSale, setLoadingSale] = useState(true);
  const [loadingRetargeting, setLoadingRetargeting] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  // The selectedTab can be directly assigned from the initialSelectedTab
  const [selectedTab, setSelectedTab] = useState(initialSelectedTab);
  
  const storedProductID = JSON.parse(localStorage.getItem("productID")) || null;
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
    "solution aware": ["AIDA", "FAB", "USP"],
    "product aware": ["AIDA", "FAB", "USP"],
    "most aware": ["USP"],
  };

  const modelLabels = {
    "PAS": "Brand Awareness",
    "AIDA": "Sale",
    "FAB": "Sale",
    "USP": "Retargeting Audience",
  };

  const navigate = useNavigate();

  const fetchModelData = async (modelName, appendToData, setLoading, apiCallsRef) => {
    const url = `${baseUrl}/generate/${storedProductID}/${cleanedSize}/${templateColors[selectedTab]}/${modelName}`;
    console.log("Generated URL:", url);
  
    const models = modelMapping[modelName];
    try {
      for (let i = 0; i < models.length; i++) {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }
  
        // Log token to check if it's valid
        console.log('JWT Token:', jwtToken);
  
        // Perform the POST request
        const postResponse = await axios.post(url, {}, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
  
        // Log response status and data for debugging
        console.log('Response status:', postResponse.status);
        console.log('Response data:', postResponse.data);
  
        // Check if POST was successful
        if (postResponse.status === 200 || postResponse.status === 201) {
          // Perform the GET request only after successful POST
          const res = await axios.get(
            `${baseUrl}/generated-images/model/${models[i]}/${storedProductID}`, 
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
  
          const labeledData = res.data.map(item => ({
            ...item,
            label: modelLabels[models[i]] || modelName,
          }));
  
          if (labeledData.length > 0) {
            appendToData(prevData => [...prevData, ...labeledData]);
            setLoading(false);  // Only set loading to false if data is not empty
            apiCallsRef.current = true; // Set the reference to true if any API call succeeds
            return; // Exit the loop if the call was successful
          } else {
            console.log('Received empty data array, keeping loading state active.');
          }
        } else {
          console.log(`POST request failed with status: ${postResponse.status}`);
        }
      }
    } catch (error) {
      console.error(`Failed to fetch ${models.join(", ")} model`, error);
  
      // Additional error handling
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
    }
  };
  

  const loadCreatives = async () => {
    if (!isThirdSectionOpen || !isPreviousSectionsCompleted) {
      return;
    }

    const apiCallsRef = { current: false }; // Using an object to pass by reference

    await fetchModelData("unaware", setBrandAwarenessData, setLoadingBrandAwareness, apiCallsRef);
    await fetchModelData("problem aware", setBrandAwarenessData, setLoadingBrandAwareness, apiCallsRef);
    await fetchModelData("solution aware", setSaleData, setLoadingSale, apiCallsRef);
    await fetchModelData("product aware", setSaleData, setLoadingSale, apiCallsRef);
    await fetchModelData("most aware", setRetargetingData, setLoadingRetargeting, apiCallsRef);

    // Show the error message only once after all API calls if none succeeded
    if (!apiCallsRef.current) {
      showToast("Action failed: please try after some time", "error");
    }
  };

  useEffect(() => {
    if (isThirdSectionOpen && isPreviousSectionsCompleted) {
      loadCreatives();
    }
  }, [selectedTab, isThirdSectionOpen, isPreviousSectionsCompleted]);


  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setIsLoading(true);
    setBrandAwarenessData([]); // Clear data to prevent old data from showing
    setSaleData([]);
    setRetargetingData([]);
    setLoadingBrandAwareness(true);
    setLoadingSale(true);
    setLoadingRetargeting(true);
};


  const showToast = (message, type) => {
    toast(message, {
      position: "top-center",
      type: type,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const retryLoading = () => {
    loadCreatives();
  };

  // Updated to display 3 cards per row
  const CardLoaderRow = ({ label, delay, rows = 1 }) => {
    const [visible, setVisible] = useState(false);
    const [loadedCards, setLoadedCards] = useState([]);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(true);
        let cardLoadDelay = 0;
        const totalCards = rows * 3; // number of rows * 3 cards per row
        const cards = [...Array(totalCards)].map((_, index) => {
          cardLoadDelay += 300; // delay between each card
          return setTimeout(() => {
            setLoadedCards((prev) => [...prev, index]);
          }, cardLoadDelay);
        });
        return () => cards.forEach(clearTimeout);
      }, delay);
  
      return () => clearTimeout(timer);
    }, [delay, rows]);
  
    if (!visible) {
      return null;
    }
  
    return (
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">{label}</h3>
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`card-shimmer rounded-lg shadow-md flex flex-col items-center justify-center bg-[#F2F4F8] 
              w-full p-4 mb-4 
                ${loadedCards.includes(rowIndex * 3 + index) ? 'opacity-100' : 'opacity-0'} 
                transition-opacity duration-300 ease-in-out`}
                style={{ transitionDelay: `${index * 300}ms`,height: "24rem" }} // Adds delay to each card's animation
              >
                <div className="h-56 w-full bg-[#E8ECF2] rounded-lg"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  // Updated to display 3 cards per row
  const FilteredData = ({ filteredModel, modelName }) => {

    const handlePreviewClick = (imageUrl) => {
      const currentState = {
        isThirdSectionOpen,
        brandAwarenessData,
        saleData,
        retargetingData,
        selectedTab
      };
      localStorage.setItem('generateAdState', JSON.stringify(currentState));
      
      navigate('/customsample', {
        state: {
          image: imageUrl,
        },
      });
    };
    
    

    const filteredProducts = filteredModel.filter((product) => {
      return (
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
         && product.templateColor === templateColors[selectedTab] // Ensure matching template color
        
      );
    });

    return (
      <>
        <h3 className="font-bold text-lg mb-2">{modelName}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.25)] p-4 pb-1 flex flex-col items-center justify-between"
               // Adjust height and width here
            >
              <img
                src={product.imageURL || product.generatedImageURL}
                alt={product.title}
                className="object-cover w-full rounded-lg h-full" // Adjust height here
              />
              <div className="button-wrapper mt-1 gap-2">
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
                    navigate(
                      `/edit_template?id=${encodeURIComponent(product.id)}`
                    )
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
                onClick={() => handlePreviewClick(product.imageURL || product.generatedImageURL)} // Pass the image URL on preview click
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

  return (
    <div className="container mb-4 lg:p-0 flex-grow">
      <section
        className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] ${
          isThirdSectionOpen ? "p-0" : "p-3"
        } flex flex-col gap-2 relative z-10`}
      >
        <div
          className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] ${
            isThirdSectionOpen ? "rounded-t-[20px] p-4" : "rounded-[20px] p-2"
          } relative cursor-pointer`}
          onClick={toggleThirdSectionAccordion}
        >
          <span className="flex items-center gap-4">
            <img src="/icon5.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Generated Creatives
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
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
            <div className="flex justify-center">
              <div className="tab-buttons flex justify-center items-center gap-2 px-2 mb-0 w-fit border-4 py-1 rounded-xl shadow-md">
                {["Brand Color", "Single Color", "Gradient Color","Templates"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-2 rounded-lg ${
                      selectedTab === tab
                        ? "bg-gradient-to-r from-[#004367] to-[#00A7FF] text-white"
                        : "bg-[#FCFCFC20] text-gray-700 border-2"
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="mx-4">
              {/* Brand Awareness */}
              {loadingBrandAwareness ? (
                <CardLoaderRow label="Brand Awareness" delay={100} rows={2} />
              ) : (
                <FilteredData filteredModel={brandAwarenessData} modelName="Brand Awareness" />
              )}

              {/* Sale */}
              {loadingSale ? (
                <CardLoaderRow label="Sale" delay={2000} rows={2} />
              ) : (
                <FilteredData filteredModel={saleData} modelName="Sale" />
              )}

              {/* Retargeting Audience */}
              {loadingRetargeting ? (
                <CardLoaderRow label="Retargeting Audience" delay={3000} rows={1} />
              ) : (
                <FilteredData filteredModel={retargetingData} modelName="Retargeting Audience" />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default GeneratedCreatives;
