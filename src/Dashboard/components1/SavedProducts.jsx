import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import brandImage from "../../assets/dashboard_img/brand_img.png";
import brandIcon from "../../assets/dashboard_img/brand.svg";
import defaultAdImage from "../../assets/dashboard_img/saved_products.svg";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import "./SavedProducts.css";

const SavedProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v2/user/templates`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const templates = response.data?.data || [];
        setProducts(templates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (template) => {
    navigate("/editor", { state: { templateData: template } });
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "template-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this template permanently? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${baseUrl}/v2/user/templates/${id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setProducts(products.filter((product) => product.templateId !== id));
        alert("Template deleted successfully.");
      } catch (error) {
        console.error("Error deleting template:", error);
        alert("Failed to delete the template. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.templateJson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow overflow-y-auto hide-scrollbar">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl pb-4">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-7 relative">
          <span className="flex items-center gap-4">
            <div className="relative flex items-center justify-center ml-1">
              <div className="absolute w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl"></div>
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" alt="Brand Icon" />
              </div>
            </div>
            <span className="flex flex-col ml-2">
              <h4 className="text-[#082A66] font-bold text-xl">
                Saved Creatives
              </h4>
              <p className="text-[#374151] ">View your Favorite Ads Here.</p>
            </span>
          </span>
          <img
            src={brandImage}
            alt="Brand Banner"
            className="absolute bottom-0 right-24 w-44 hidden lg:block"
          />
        </div>
        <div className="flex justify-end w-full px-3">
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading...</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 pb-2 overflow-auto hide-scrollbar"
            style={{ maxHeight: "45vh" }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.templateId}
                className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.35)] p-3 lg:w-80 lg:h-80 md:w-80 md:h-80 w-72 h-72 flex flex-col items-center justify-between hover:transition-colors duration-200 glass-gradient-hover cursor-pointer"
              >
                <div className="relative w-full h-full overflow-hidden rounded-lg mb-2">
                  <img
                    src={product.url || defaultAdImage}
                    alt="Creative Thumbnail"
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="button-wrapper flex justify-between w-full gap-2 px-2">
                  <button
                    className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                    onClick={() => handleEdit(product)}
                  >
                    <div className="button-container flex items-center">
                      <svg
                        className="edit-svg"
                        viewBox="0 0 24 24"
                        fill="url(#hoverGradient)"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#004367" />
                            <stop offset="100%" stopColor="#00A7FF" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M11.6564 3.65685C11.8469 3.46632 12.1531 3.46632 12.3436 3.65685L14.3436 5.65685C14.5342 5.84737 14.5342 6.15353 14.3436 6.34406L6.37492 14.3127C6.28097 14.4067 6.15792 14.4645 6.02724 14.4746L3.02724 14.7246C2.88342 14.7365 2.74001 14.6882 2.63433 14.584C2.52865 14.4797 2.47272 14.3361 2.48451 14.1923L2.73451 11.1923C2.74455 11.0616 2.80233 10.9385 2.89635 10.8446L10.865 2.87592L11.6564 3.65685Z"
                         
                          stroke="#A8A8A8" 
                          strokeWidth="1.5"
                        />
                        <rect x="3" y="16" width="10" height="1.5" fill="#A8A8A8" />
                      </svg>
                      <span>Edit</span>
                    </div>
                  </button>
                  {/* <button
                    className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                    onClick={() => handlePreviewClick(product.imageURL || product.generatedImage)}
                  >
                    <div className="button-container flex items-center">
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
                  </button> */}
                  <button
                    className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                    onClick={() => handleDownloadClick(product.imageURL || product.generatedImage)}
                  >
                    <div className="button-container flex items-center">
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
                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5"
                        />
                        <rect
                          className="arrow-rect"
                          x="11.25"
                          y="3"
                          width="1.5"
                          height="11.5"
                          fill="#A8A8A8"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12L12 16.5L7.5 12"
                          fill="none"
                          stroke="#A8A8A8"
                        />
                      </svg>
                      <span>Download</span>
                    </div>
                  </button>
                  <button
                    className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                    onClick={() => {
                      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
                      if (confirmDelete) handleRemove(product.templateId);
                    }}
                  >
                    <div className="button-container flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        className="delete-icon"
                        stroke="#A8A8A8"
                      >
                        <defs>
                          <linearGradient id="deleteHoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#004367" />
                            <stop offset="100%" stopColor="#00A7FF" />
                          </linearGradient>
                        </defs>
                        <path
                          d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
                          className="delete-path"
                          fill="#A8A8A8" 
                          stroke="#A8A8A8" 
                        />
                      </svg>

                      <span>Delete</span>
                    </div>
                  </button>
                </div>

              </div>
            ))}
          </div>

        )}
      </div>
    </div>
  );
};

export default SavedProducts;
