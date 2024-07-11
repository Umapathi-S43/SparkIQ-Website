import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import brandImage from '../../assets/dashboard_img/brand_img.png'; // Adjust the path as needed
import brandIcon from '../../assets/dashboard_img/brand.svg'; // Adjust the path as needed
import defaultAdImage from '../../assets/dashboard_img/saved_products.svg'; // Adjust the path as needed

const SavedProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    // Load saved products from local storage
    const storedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];
    setProducts(storedProducts);

    const initialFavorites = {};
    storedProducts.forEach((_, index) => {
      initialFavorites[index] = true;
    });
    setFavorites(initialFavorites);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleFavoriteClick = (index) => {
    const confirmRemoval = window.confirm('Do you want to remove this item from the wishlist?');
    if (confirmRemoval) {
      const newFavorites = { ...favorites };
      delete newFavorites[index];
      setFavorites(newFavorites);

      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
      localStorage.setItem('savedProducts', JSON.stringify(updatedProducts));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    return matchesSearchQuery && matchesBrand;
  });

  return (
    <div className="flex-grow overflow-y-auto hide-scrollbar">      
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 border border-[#FCFCFC] rounded-3xl pb-4">
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
              <p className="text-[#374151] ">
                View your Favorite Ads Here.
              </p>
            </span>
          </span>
          <img
            src={brandImage}
            alt="Brand Banner"
            className="absolute bottom-0 right-24 w-44 hidden lg:block"
          />
        </div>
        <div className="flex justify-end w-full px-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-5 pb-2 overflow-auto hide-scrollbar" style={{ maxHeight: '45vh' }}>
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="relative group border border-[#FCFCFC] rounded-xl m-1 p-3 w-full bg-[rgba(146,210,245,0.25)] flex flex-col items-center justify-between hover:transition-colors duration-200 glass-gradient-hover"
            >
              <div className='mb-10'>
                <button
                  className="absolute top-2 right-2 p-1 rounded-md bg-white bg-opacity-40 border border-[#FCFCFC]"
                  onClick={() => handleFavoriteClick(index)}
                >
                 
                    <HeartIconSolid className="w-6 h-6" style={{ fill: 'url(#gradient)' }} />
                    
                 
                </button>
              </div>
              <img
                src={defaultAdImage}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg"
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" style={{ stopColor: '#082A66', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#0C3F99', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#1054CC', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedProducts;