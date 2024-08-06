import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import Loader from "../../components/advert/Loader";
import brandImage from "../../assets/dashboard_img/brand_img.png"; // Adjust the path as needed
import brandIcon from "../../assets/dashboard_img/brand.svg"; // Adjust the path as needed
import defaultAdImage from "../../assets/dashboard_img/saved_products.svg"; // Adjust the path as needed
import axios from "axios";
import { baseUrl } from "../../components/utils/Constant";

const GeneratedCreatives = ({
  isThirdSectionOpen,
  toggleThirdSectionAccordion,
  isLoading,
  setIsLoading,
  setPage,
  openModalCreativeSize,
}) => {
  const [products, setProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [modelData, setModelData] = useState({
    model1: [],
    model2: [],
    model3: [],
  });
  const [loadingModel1, setLoadingModel1] = useState(true);
  const [loadingModel2, setLoadingModel2] = useState(true);
  const [loadingModel3, setLoadingModel3] = useState(true);

  const storedProductID = JSON.parse(localStorage.getItem("productId")) || null;
  const storedImageSize = JSON.parse(localStorage.getItem("imageSize")) || "";
  const cleanedSize = storedImageSize.replace(/[()]/g, "");

  const modelName1 = "PAS";
  const modelName2 = "AIDA";
  const modelName3 = "USP";

  console.log(modelData, storedProductID, storedImageSize, "storedImageSize");

  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const storedSavedProducts =
      JSON.parse(localStorage.getItem("savedProducts")) || [];
    const updatedProducts = storedProducts.map((product) => {
      if (!product.price) {
        product.price = Math.floor(Math.random() * 400) + 100;
      }
      return product;
    });
    setProducts(updatedProducts);
    setSavedProducts(storedSavedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts)); // Save updated products back to localStorage
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleSave = (product) => {
    const isSaved = savedProducts.some(
      (savedProduct) => savedProduct.name === product.name
    );
    if (isSaved) {
      alert("Product is already saved to wishlist!");
    } else {
      const updatedSavedProducts = [...savedProducts, product];
      setSavedProducts(updatedSavedProducts);
      localStorage.setItem(
        "savedProducts",
        JSON.stringify(updatedSavedProducts)
      );
    }
  };

  const handleEdit = () => {
    navigate("/CustomizationAdsPage");
  };

  const handleLaunch = () => {
    navigate("/AdPreview");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    return matchesSearchQuery && matchesBrand;
  });

  useEffect(() => {
    if (isLoading) {
      const fetchModels = async () => {
        const data1 = {
          productId: storedProductID,
          imageSize: cleanedSize,
          modelName: modelName1,
        };
        const data2 = {
          productId: storedProductID,
          imageSize: cleanedSize,
          modelName: modelName2,
        };
        const dat3 = {
          productId: storedProductID,
          imageSize: cleanedSize,
          modelName: modelName3,
        };
        try {
          const response1 = await axios.post(
            `${baseUrl}/generate/${storedProductID}/${cleanedSize}/${modelName1},`,
            data1
          );
          setModelData((prevData) => ({
            ...prevData,
            model1: response1.data.data,
          }));
          setLoadingModel1(false);
        } catch (error) {
          console.error("Failed to fetch PAS model", error);
          setLoadingModel1(false);
        }

        try {
          const response2 = await axios.post(
            `${baseUrl}/generate/${storedProductID}/${cleanedSize}/${modelName2}`,
            data2
          );
          setModelData((prevData) => ({
            ...prevData,
            model2: response2.data.data,
          }));
          setLoadingModel2(false);
        } catch (error) {
          console.error("Failed to fetch AIDA model", error);
          setLoadingModel2(false);
        }

        try {
          const response3 = await axios.post(
            `${baseUrl}/generate/${storedProductID}/${cleanedSize}/${modelName3}`,
            data3
          );
          setModelData((prevData) => ({
            ...prevData,
            model3: response3.data.data,
          }));
          setLoadingModel3(false);
        } catch (error) {
          console.error("Failed to fetch USP model.", error);
          setLoadingModel3(false);
        } finally {
          setIsLoading(false);
        }
      };

      fetchModels();
    }
  }, [
    isLoading,
    baseUrl,
    storedProductID,
    cleanedSize,
    modelName1,
    modelName2,
    modelName3,
  ]);

  return (
    <div className="container lg:mb-4 sm:mx-auto mb-4 lg:p-0 sm:p-4 flex-grow">
      <style>{`
        .button-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px; /* Adjusted gap between image and text */
          width: 100%;
          transition: all 0.3s ease;
        }

        .button-container img,
        .button-container svg {
          width: 14px; /* Adjusted size for consistency */
          height: 14px;
          transition: all 0.3s ease;
        }

        .button-container .edit-svg {
          width: 17px;
          height: 17px;
        
        }

        .button-container span {
          text-align: left;
          transition: all 0.3s ease;
          color: #A8A8A8;
        }

        .button-clear {
          border: none;
          background: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 8px; /* Adjusted padding */
          transition: all 0.3s ease;
          width: auto;
          flex: 1; /* Make buttons take up equal space */
        }

        .button-clear:hover {
          background: white;
          color: white;
        }

        .button-clear:hover .button-container img,
        .button-clear:hover .button-container svg path,
        .button-clear:hover .button-container svg rect {
          fill: url(#gradient); /* Applying gradient fill on hover */
          stroke: none;
        }

        .button-clear:hover .button-container span {
          background: linear-gradient(115deg, #004367 0%, #00A7FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 600;
        }

        .launch-button {
          background: linear-gradient(115deg, #004367 0%, #00A7FF 100%);
          color: white;
        }

        .launch-button:hover {
          background: #082A66;
          color: white;
        }

        .button-wrapper {
          display: flex;
          justify-content: flex-start; /* Align buttons to the left */
          gap: 4px; /* Adjusted gap between buttons */
          width: 100%;
        }
      `}</style>
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
            {isLoading ? (
              <div className="w-full py-8">
                <Loader />
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
                            onChange={handleSearchChange}
                            className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                          />
                          <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 focus:text-blue-500" />
                        </div>
                      </div>
                      <div className="flex items-center bg-white rounded-xl mr-4">
                        <select
                          value={selectedBrand}
                          onChange={handleBrandChange}
                          className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                        >
                          <option value="">All Brands</option>
                          {/* Add your brand options here */}
                          <option value="Brand1">Brand1</option>
                          <option value="Brand2">Brand2</option>
                          <option value="Brand3">Brand3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:px-5 pb-2 w-full overflow-auto"
                    style={{ maxHeight: "80vh" }}
                  >
                    {filteredProducts.map((product, index) => (
                      <div
                        key={index}
                        className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.25)] p-3 pb-1 flex flex-col items-center justify-between h"
                      >
                        <img
                          src={defaultAdImage}
                          alt={product.name}
                          className="object-cover w-full rounded-lg"
                        />
                        <div className="button-wrapper mt-1">
                          <button
                            className={`text-sm ${
                              savedProducts.some(
                                (savedProduct) =>
                                  savedProduct.name === product.name
                              )
                                ? "bg-gray-200 cursor-not-allowed"
                                : "text-[#A8A8A8]"
                            } rounded-lg py-1 px-2 button-clear`}
                            onClick={() => handleSave(product)}
                            disabled={savedProducts.some(
                              (savedProduct) =>
                                savedProduct.name === product.name
                            )}
                          >
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
                                  stroke-width="1.5"
                                  fill="none"
                                />
                              </svg>
                              <span>Save</span>
                            </div>
                          </button>
                          <button
                            className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                            onClick={() => navigate("/edit_template")}
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
                                  stroke-width="1.5"
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
                                stroke-width="1.5"
                                stroke="#A8A8A8"
                                width="20"
                                height="20"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
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
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* <div className="flex justify-around">
        <div className="text-center">
          {loadingModel1 ? (
            <div className="loader animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
          ) : (
            <>
              <img
                src={modelData.model1}
                alt="Post Size"
                className="mx-auto mb-2"
              />
              <p>
                Post Size
                <br />
                (1080x1080)
              </p>
            </>
          )}
        </div>
        <div className="text-center">
          {loadingModel2 ? (
            <div className="loader animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
          ) : (
            <>
              <img
                src={modelData.model2}
                alt="Landscape Size"
                className="mx-auto mb-2"
              />
              <p>
                Landscape Size
                <br />
                (1200x628)
              </p>
            </>
          )}
        </div>
        <div className="text-center">
          {loadingModel3 ? (
            <div className="loader animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
          ) : (
            <>
              <img
                src={modelData.model3}
                alt="Story Size"
                className="mx-auto mb-2"
              />
              <p>
                Story Size
                <br />
                (1080x1920)
              </p>
            </>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default GeneratedCreatives;
