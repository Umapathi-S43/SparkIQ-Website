import React, { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import brandIcon from "../../../assets/dashboard_img/brand.svg"; // Adjust path as needed
import brandImage from "../../../assets/dashboard_img/brand_img.png"; // Adjust path as needed
import "./BrandSetup.css"; // Adjust the import path as needed
import axios from "axios"; // Adjust the import path as needed
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

const BrandSetup = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // Track current loading step
  const [fetchedData, setFetchedData] = useState({
    logo: null,
    brandAnalysis: null,
    targetAudience: null,
  });

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(0);
  
    try {
      // 1) Call the API with the entered URL
      const response = await fetchBrandData(url);
  
      // 2) Merge the user-typed URL into the response so it's available later
      const finalData = {
        ...response,
        websiteUrl: url,   // or whichever field name you want
      };
  
      // 3) Log and navigate with the merged data
      console.log("Merged data:", finalData);
      navigateToBrandSettings(finalData);
    } catch (error) {
      console.error("Error fetching brand data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const fetchBrandData = async (url) => {
    const payload={url:encodeURIComponent(url)}
    try {
      const response = await axios.post(
        `${baseUrl}/v2/api/brands/extract-brand-info`,payload, // Empty body for POST
        {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              }
      );
  
      // Access the response data
      const data = response.data.data;
      console.log("API Response:", data);
      return data;
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  };
  
  const navigateToBrandSettings = (response) => {
    console.log("Navigating to BrandSettings with data:", response);
    navigate('/brand-settings', { state: { response: response } });
  };
  
const navigate=useNavigate();

  const handleManualSetup = () => {
    navigate('/brand-settings');
  };

  return (
    <div className="flex-grow">
      <div className="max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl lg:p-1 p-4">
          <div className="flex items-center ml-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl">
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" alt="Brand Icon" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#082a66] ml-4 md:mr-auto text-nowrap">
              Brand Setup
            </h1>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-24 h-12 sm:w-32 sm:h-16 md:w-[180px] md:h-[90px] lg:mr-20 sm:ml-4 md:m-auto hidden lg:block"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row p-8 w-full mb-2 overflow-y-auto hide-scrollbar">
          {/* URL Input Section */}
          <div className="w-full flex flex-col items-center">
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="border border-gray-300 rounded-md p-1 bg-white shadow-md mr-2 w-full">
                  <input
                    type="text"
                    placeholder="Enter Your URL"
                    value={url}
                    onChange={handleInputChange}
                    className="flex-grow p-2 rounded-sm outline-none text-sm focus:ring-2 focus-within:ring-blue-400 focus:outline-none w-full"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className={`custom-button text-white rounded-md px-4 py-2 text-sm w-full sm:w-auto ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  Submit
                </button>
              </div>
            </form>

            {isLoading && (
              <div className="mt-6 flex flex-col space-y-4">
                {/* Step 1 */}
                <div className="flex items-center space-x-2">
                  {loadingStep >= 1 ? (
                    <div className="done-icon bg-blue-500 rounded-full p-1 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 50 50"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {[...Array(16)].map((_, i) => (
                        <line
                          key={i}
                          x1="25"
                          y1="5"
                          x2="25"
                          y2="10"
                          stroke="#082A66"
                          strokeWidth="3"
                          strokeLinecap="round"
                          transform={`rotate(${i * 22.5}, 25, 25)`}
                          className={`fade-line fade-line-${i}`}
                        />
                      ))}
                    </svg>
                  )}
                  <p className="text-sm">Fetching logo & Brand elements</p>
                </div>

                {/* Step 2 */}
                <div className="flex items-center space-x-2">
                  {loadingStep >= 2 ? (
                    <div className="done-icon bg-blue-500 rounded-full p-1 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 50 50"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {[...Array(16)].map((_, i) => (
                        <line
                          key={i}
                          x1="25"
                          y1="5"
                          x2="25"
                          y2="10"
                          stroke="#082A66"
                          strokeWidth="3"
                          strokeLinecap="round"
                          transform={`rotate(${i * 22.5}, 25, 25)`}
                          className={`fade-line fade-line-${i}`}
                        />
                      ))}
                    </svg>
                  )}
                    <p>Analyzing your brand</p>
                 
                </div>

                {/* Step 3 */}
                <div className="flex items-center space-x-2">
                  {loadingStep >= 3 ? (
                    <div className="done-icon bg-blue-500 rounded-full p-1 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 50 50"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {[...Array(16)].map((_, i) => (
                        <line
                          key={i}
                          x1="25"
                          y1="5"
                          x2="25"
                          y2="10"
                          stroke="#082A66"
                          strokeWidth="3"
                          strokeLinecap="round"
                          transform={`rotate(${i * 22.5}, 25, 25)`}
                          className={`fade-line fade-line-${i}`}
                        />
                      ))}
                    </svg>
                  )}
                    <p>Determining Target Audience</p>
                  
                </div>
              </div>
            )}

            {!isLoading && (
              <p
                onClick={handleManualSetup}
                className="mt-4 text-sm text-blue-500 cursor-pointer hover:underline"
              >
                I don't have a website - Setup manually
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;
