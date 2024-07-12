import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import Loader from '../../components/advert/Loader';
import brandImage from '../../assets/dashboard_img/brand_img.png'; // Adjust the path as needed
import brandIcon from '../../assets/dashboard_img/brand.svg'; // Adjust the path as needed
import defaultAdImage from '../../assets/dashboard_img/saved_products.svg'; // Adjust the path as needed

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedSavedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];
    const updatedProducts = storedProducts.map(product => {
      if (!product.price) {
        product.price = Math.floor(Math.random() * 400) + 100;
      }
      return product;
    });
    setProducts(updatedProducts);
    setSavedProducts(storedSavedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // Save updated products back to localStorage
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
    const isSaved = savedProducts.some(savedProduct => savedProduct.name === product.name);
    if (isSaved) {
      alert('Product is already saved to wishlist!');
    } else {
      const updatedSavedProducts = [...savedProducts, product];
      setSavedProducts(updatedSavedProducts);
      localStorage.setItem('savedProducts', JSON.stringify(updatedSavedProducts));
      
    }
  };

  const handleEdit = () => {
    navigate('/CustomizationAdsPage');
  };

  const handleLaunch = () => {
    navigate('/AdPreview');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    return matchesSearchQuery && matchesBrand;
  });

  return (
    <div className="container lg:mb-4 sm:mx-auto mb-4 lg:p-0 sm:p-4 flex-grow ">
      <style>{`
        .launch-button {
          background: linear-gradient(115deg, #004367 0%, #00A7FF 100%);
          color: white;
        }

        .launch-button:hover {
          background: #082A66;
          color: white;
        }
      `}</style>
      <section className="border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] p-2 sm:p-4 flex flex-col gap-6 relative z-10 ">
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
                Choose one for your ad. If you are happy with more than one save it for future!
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:px-5 pb-2 w-full">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={index}
                        className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.25)] p-3 flex flex-col items-center justify-between hover:transition-colors duration-200 glass-gradient-hover"
                      >
                        <img
                          src={defaultAdImage}
                          alt={product.name}
                          className="object-cover w-full rounded-lg"
                        />
                        <div className="flex justify-center gap-2 mt-2 w-full">
                          <button
                            className={`text-sm ${savedProducts.some(savedProduct => savedProduct.name === product.name) ? 'bg-gray-200 cursor-not-allowed' : 'text-[#082A66] bg-white border border-[#082A66] hover:bg-[#082A66] hover:text-white'} rounded-lg py-1 px-3 w-1/3`}
                            onClick={() => handleSave(product)}
                            disabled={savedProducts.some(savedProduct => savedProduct.name === product.name)}
                          >
                            Save
                          </button>
                          <button
                            className="text-sm text-[#082A66] bg-white border border-[#082A66] rounded-lg py-1 px-3 hover:bg-[#082A66] hover:text-white w-1/3"
                            onClick={() => {
                              console.log("Save Template clicked");
                              setPage("customizationAd");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-sm text-white rounded-lg py-1 px-3 w-1/3 launch-button"
                            onClick={() => {
                              console.log("Save Template clicked");
                              setPage("adPreview");
                            }}
                          >
                            Launch
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
    </div>
  );
};

export default GeneratedCreatives;
