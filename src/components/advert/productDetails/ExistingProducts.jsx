import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BiCheck } from 'react-icons/bi';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import axios from 'axios';
import { baseUrl } from '../../utils/Constant'; // Update this path as needed

const companyId = '123'; // Replace with your actual company ID

const ExistingProducts = ({ setIsNextSectionOpen, isCompleted, setIsCompleted, setShowProductDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState(['All Brands']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('all'); // Set 'all' as the default value

  const fetchProducts = async (brandId) => {
    try {
      const response = await axios.get(`${baseUrl}/product`);
      console.log('Fetched Products:', response.data);
      if (brandId) {
        setProducts(response.data.data.filter(product => product.brandID === brandId));
      } else {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${baseUrl}/brand/company/${companyId}`);
      console.log('Fetched Brands:', response.data);
      const brandNames = response.data.data.map(brand => ({ id: brand.id, name: brand.name }));
      setBrands([{ id: 'all', name: 'All Brands' }, ...brandNames]);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch all products initially
    fetchBrands();
  }, []);

  const handleCreateProduct = () => {
    setShowProductDetails(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleBrandChange = (event) => {
    const brandId = event.target.value;
    setSelectedBrand(brandId);
    fetchProducts(brandId === 'all' ? null : brandId);
  };

  const filteredProducts = products.filter(product => {
    return (selectedBrand === 'all' || product.brandID === selectedBrand) &&
      ((product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())));
  });

  

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleProductClick = (product) => {
    console.log("Setting product:", product);
    setSelectedProduct(product);
    handleNextStep(product);
  };
  
  const handleNextStep = (product) => {
    console.log("Handling next step with product:", product);
    setIsOpen(false);
    setIsNextSectionOpen(true);
    setIsCompleted(true);
    localStorage.setItem('selectedProduct', JSON.stringify(product)); // Store entire product
    localStorage.setItem('productID', JSON.stringify(product.id)); // Store product ID separately
  };
  
  

  const isNextStepDisabled = selectedProduct === null;

  return (
    <div className="border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] p-2 lg:p-4 flex flex-col gap-6 relative z-10">
      <div
        className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-[32px] lg:p-4 p-4 relative cursor-pointer"
        onClick={toggleAccordion}
      >
        {isCompleted && (
          <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
            Completed <BiCheck size={20} />
          </span>
        )}
        <div className="flex items-center gap-4">
          <img src="/icon2.svg" alt="" />
          <span className="flex flex-col">
            <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">Add Product Details</h4>
            <p className="text-[#374151] text-xs lg:text-base">Choose an existing product to proceed or Create a new Product</p>
          </span>
        </div>
        <div className="flex items-center gap-6">
          {isCompleted && (
            <div className="flex items-center gap-2">
              <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                <p className="text-[#1E1154] font-medium">Selected Product</p>
              </div>
              <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                <p className="text-[#1E1154] font-medium">{selectedProduct?.name}</p>
              </div>
            </div>
          )}
          {isOpen ? (
            <MdArrowDropUp size={32} className="cursor-pointer" />
          ) : (
            <MdArrowDropDown size={32} className="cursor-pointer" />
          )}
        </div>
      </div>

      {isOpen && (
        <>
          <div className="flex justify-end w-full px-5">
            <div className="flex items-center justify-end bg-white rounded-xl mr-10">
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
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                className="ml-4 p-2 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                style={{ maxHeight: '10vh', overflowY: 'auto' }}
              >
                {brands.map((brand, index) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 ml-2 pl-2 justify-start" >
            <div className="border border-[#FCFCFC] bg-[rgba(252,252,252,0.70)] rounded-2xl m-1 flex items-center justify-center p-2 lg:w-80 lg:h-80 w-72 h-72 hover:bg-[rgba(252,252,252,0.10)]">
              <div
                onClick={handleCreateProduct}
                className="relative cursor-pointer bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] rounded-xl shadow-cyan-100 shadow-2xl p-4 w-full h-full flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(to left bottom, rgba(92, 198, 255, 0.15), rgba(0, 160, 245, 0.3))' }}
              >
                <div className="bg-[#00A0F5] w-8 h-8 rounded-xl flex items-center justify-center">
                  <FaPlus className="text-white w-6 h-6 flex justify-center text-xs" />
                </div>
                <p className="mt-4 text-lg text-[#00a7ff]">Create a Product</p>
                <p className="text-sm text-center mt-2">Click here to add a new product that you can use to generate assets.</p>
              </div>
            </div>
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className={`group border ${selectedProduct === product ? 'border-transparent' : 'border-[#FCFCFC]'} rounded-xl m-1 bg-[rgba(252,252,252,0.25)] p-3 lg:w-80 lg:h-80 md:w-80 md:h-80 w-72 h-72 flex flex-col items-center justify-between hover:transition-colors duration-200 glass-gradient-hover ${selectedProduct === product ? 'border-gradient' : ''}`}
                onClick={() => handleProductClick(product)}
                style={selectedProduct === product ? { border: '4px solid transparent', borderImage: 'linear-gradient(201.07deg, #00A7FF 0.53%, #004367 98.24%) 1', borderRadius: '16px' } : { borderRadius: '16px' }}
              >
                {product.productImagesList?.length ? (
                  product.productImagesList.map((item, idx) => (
                    <img
                      key={idx}
                      src={item.imageURL}
                      alt={item.bucketName}
                      className="object-cover w-full h-48 rounded-lg"
                    />
                  ))
                ) : (
                  <div className="object-cover w-full h-48 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <div className="text-center flex justify-between w-full px-2">
                  <h3 className="text-xl font-bold text-[#082A66] group-hover:text-white">{product.name}</h3>
                  <span className="font-semibold text-[#082A66] group-hover:text-white">{product.price} {product.priceType}</span>
                </div>
                <div className="text-justify w-full px-2 line-clamp-3">
                  <p className="text-sm text-[#374151] group-hover:text-white">{product.description}</p>
                </div>
                {selectedProduct === product && (
                  <div className="absolute top-2 right-2 bg-[#059669] text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <BiCheck size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExistingProducts;
