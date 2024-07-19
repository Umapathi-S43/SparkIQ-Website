import React, { useState } from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { GoTag } from "react-icons/go";
import link2 from '../../assets/dashboard_img/linksvg1.svg';
import facomment from '../../assets/dashboard_img/facomment.svg';
import { useNavigate } from "react-router-dom";
import brandImage from '../../assets/dashboard_img/brand_img.png'; // Adjust the path as needed
import brandIcon from '../../assets/dashboard_img/brand_b1.svg'; // Adjust the path as needed
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { RiDiscountPercentLine } from "react-icons/ri";

const currencies = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY", "CHF", "SEK", "NZD", "SGD", "HKD", "NOK", "KRW"];
const discountOptions = ["Price", "Percentage"];
const brandNames = ["Brand1", "Brand2", "Brand3"];

export default function AdProduct({ setIsNextSectionOpen }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [customDiscount, setCustomDiscount] = useState("");
  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
    productURL: "",
    brandName: brandNames[0],
    productPrice: "",
    currency: currencies[0],
    discount: discountOptions[0],
  });

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).slice(
        0,
        3 - images.length
      );
      setImages([...images, ...newFiles]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files).slice(
        0,
        3 - images.length
      );
      setImages([...images, ...newFiles]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    if (selectedImage === index) {
      setSelectedImage(null);
    }
  };

  const handleOnChangeProductDetails = (e) => {
    const { id, value } = e.target;
    if (id === "customDiscount") {
      setCustomDiscount(value);
    } else {
      setProductDetails({ ...productDetails, [id]: value });
    }
  };

  const handleDiscountChange = (e) => {
    if (e.target.value !== "Custom") {
      setProductDetails({ ...productDetails, discount: e.target.value, customDiscount: "" });
    } else {
      setProductDetails({ ...productDetails, discount: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productDetails);
  };

  const handleAdProduct = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    storedProducts.push({
      name: productDetails.productName,
      description: productDetails.productDescription,
      url: productDetails.productURL,
      brand: productDetails.brandName,
      price: `${productDetails.productPrice} ${productDetails.currency}`,
      discount: productDetails.discount === "Custom" ? customDiscount : productDetails.discount,
      image: images[selectedImage] ? URL.createObjectURL(images[selectedImage]) : null,
    });
    localStorage.setItem('products', JSON.stringify(storedProducts));

    navigate('/productspage');
  };

  const isNextStepDisabled =
    productDetails.productName === "" ||
    productDetails.productDescription === "" ||
    productDetails.productURL === "" ||
    productDetails.brandName === "" ||
    productDetails.productPrice === "" ||
    (productDetails.discount === "Custom" && customDiscount === "");

  const imageContainerClass =
    images.length === 2
      ? "w-full lg:w-1/2"
      : images.length === 3
      ? "w-full lg:w-1/3"
      : "w-full";

  const imageSectionWidth =
    images.length === 1
      ? 'w-full lg:w-2/6'
      : images.length === 2
      ? 'w-full lg:w-3/6'
      : 'w-full lg:w-4/6';

  return (
    <div className="overflow-auto hide-scrollbar">
      <section className="max-w-6xl flex justify-center lg:ml-8 mb-4 pb-4 border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] flex-col gap-6 relative z-10">
        <div className="flex justify-between items-center rounded-t-[32px] relative bg-[rgba(252,252,252,0.40)] h-28 p-6 m-0">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="/icon2.svg" alt="" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl md:text-2xl lg:text-2xl">Add Product Details</h4>
              <p className="text-[#374151] lg:text-sm text-xs">Upload photos and details of your product</p>
            </span>
          </span>
          <img
            src={brandImage}
            alt="Brand Banner"
            className="absolute bottom-0 right-24 w-44 hidden lg:block"
          />
        </div>
        <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '55vh' }}>
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-2">
            {images.length > 0 && (
              <div className={`bg-[rgba(252,252,252,0.25)] rounded-[30px] border-2 border-[#FCFCFC] shadow-sm p-5 ${imageSectionWidth} h-auto lg:h-80`}>
                <h6 className="font-bold pb-4 mt-2 mb-4">Select Your Desired Image</h6>
                <div className="flex gap-4 flex-wrap md:flex-nowrap">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer border-1 border-[#FCFCFC] rounded ${imageContainerClass}`}
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index}`}
                        className="object-cover w-full h-48 rounded"
                      />
                      <button
                        className="absolute top-1 left-1 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(index);
                        }}
                      >
                        <FaTrash />
                      </button>
                      {selectedImage === index && (
                        <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#09AA09]">
                          <BiCheck size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              className={`bg-white rounded-[30px] shadow-md p-5 ${images.length > 0 ? (images.length === 1 ? 'w-full md:w-5/6' : images.length === 2 ? 'w-full md:w-4/6' : 'w-full md:w-3/6') : 'w-full'} lg:h-82`}
            >
              <div
                className="border border-[#605880] border-dashed rounded-[20px] flex items-center justify-center py-12 px-6"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <span className="flex flex-col items-center justify-center">
                  <img src="/icon3.svg" alt="" className="w-10" />
                  <h6 className="text-2xl font-bold">Upload a product Image</h6>
                  <p>or drag and drop a product image here.</p>
                  <p className="font-medium mt-2 mb-4">
                    You can select a maximum of 3 photo(s)
                  </p>
                  <div>
                    <label className="custom-button px-6 flex gap-[10px] text-white rounded-[32px] font-semibold items-center justify-between h-12 cursor-pointer shadow-2xl">
                      Your Library <FaFolder />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={images.length >= 3}
                      />
                    </label>
                  </div>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 p-2">
            <div className="bg-[#FCFCFC40] shadow-md rounded-[20px] border border-[#FCFCFC] flex flex-col gap-[18px] w-full md:w-4/6 p-4">
              <span className="flex items-center gap-4 text-lg font-bold">
                <img src={link2} className="bg-[#00279926] rounded-[10px] w-12 h-12 px-3" />{" "}
                <h6>Product Page URL (Automatically get details)</h6>
              </span>
              <span className="flex flex-col md:flex-row items-center gap-5">
                <input
                  type="text"
                  placeholder="Your landing page or website (Example: spark.ai)"
                  id="productURL"
                  onChange={handleOnChangeProductDetails}
                  className="rounded-[20px] py-4 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                />
                <button className="w-fit custom-button rounded-[20px] text-white py-3 px-10 whitespace-pre font-medium">
                  Scan the URL
                </button>
              </span>
            </div>
            <div className="bg-[#FCFCFC40] shadow-md rounded-[20px] border border-[#FCFCFC] flex flex-col gap-[18px] w-full md:w-2/6 p-4">
              <span className="flex items-center gap-4 text-lg font-bold">
                <img src={brandIcon} className="bg-[#00279926] rounded-[10px] w-12 h-12 px-3" />
                <h6>Brand Name</h6>
              </span>
              <select
                id="brandName"
                onChange={handleOnChangeProductDetails}
                className="rounded-[20px] py-4 pl-6 pr-8 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                style={{
                  appearance: 'none',
                  background: 'white',
                  backgroundPosition: 'right 10px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 10l5 5l5-5"/></svg>')`
                }}
              >
                {brandNames.map((brand, index) => (
                  <option key={index} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center p-2">
            <img src="/orIcon.svg" alt="" />
          </div>
          <form onSubmit={handleSubmit} className="p-2">
            <p className="text-lg pb-2 text-[#082A66] ml-2">Enter Product Details Manually</p>
            <div className="flex flex-col md:flex-row gap-5 lg:h-56">
              <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px]">
                <span className="flex items-center gap-4 text-lg">
                  <GoTag className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
                  <h6>Product Name</h6>
                </span>
                <input
                  type="text"
                  placeholder="Enter your product name"
                  id="productName"
                  onChange={handleOnChangeProductDetails}
                  className="rounded-[20px] py-4 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  autoComplete="off"
                />
              </div>
              <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px]">
                <span className="flex items-center gap-4 text-lg">
                  <img src={facomment} className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
                  <h6>Product Description</h6>
                </span>
                <textarea
                  placeholder="Enter your Product Description"
                  id="productDescription"
                  onChange={handleOnChangeProductDetails}
                  className="rounded-[20px] py-4 pl-6 pr-4 shadow-md w-full h-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5 lg:h-56 mt-6">
              <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px] relative">
                <span className="flex items-center gap-4 text-lg">
                  <CreditCardIcon className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
                  <h6>Product Price</h6>
                </span>
                <div className="relative w-full flex items-center">
                  <div className="absolute left-2 flex items-center justify-center rounded-[16px] w-[90px] h-[44px] bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC]">
                    <select
                      id="currency"
                      onChange={handleOnChangeProductDetails}
                      className="appearance-none bg-transparent pl-4 w-full h-full flex items-center justify-center focus:outline-none z-10"
                      value={productDetails.currency}
                      style={{
                        background: '[#D9E9F2]',
                        backgroundPosition: 'right 10px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 10l5 5l5-5"/></svg>')`,
                      }}
                    >
                      {currencies.map((currency, index) => (
                        <option key={index} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Product Price"
                    id="productPrice"
                    onChange={handleOnChangeProductDetails}
                    className="rounded-[20px] py-4 pl-28 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    autoComplete="off"
                    value={productDetails.productPrice}
                  />
                </div>
              </div>
              <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px] relative">
                <span className="flex items-center gap-4 text-lg">
                  <RiDiscountPercentLine className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
                  <h6>Discount</h6>
                </span>
                <div className="relative w-full flex items-center">
                <div className="absolute left-2 flex items-center justify-center rounded-[16px] w-[140px] h-[44px] bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC]">
                  
                  <select
                    id="discount"
                    onChange={handleDiscountChange}
                    className="absolute left-0 rounded-[20px] px-4 py-2 pl-2  pr-10 m-2  focus:outline-none z-10"
                    value={productDetails.discount}
                    style={{
                      appearance: "none",
                      background: "none",
                      backgroundPosition: "right 10px center",
                      backgroundRepeat: "no-repeat",
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 10l5 5l5-5"/></svg>')`,
                    }}
                  >
                    {discountOptions.map((discount, index) => (
                      <option key={index} value={discount}>
                        {discount}
                      </option>
                    ))}
                  </select>
                  </div>
                  <input
                    type="text"
                    placeholder={`Enter Discount in terms of ${productDetails.discount}`}
                    id="customDiscount"
                    onChange={handleOnChangeProductDetails}
                    className="rounded-[20px] py-4 pl-44 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    autoComplete="off"
                    value={customDiscount}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-start p-2">
              <button
                className="w-fit rounded-[20px] text-white py-3 px-10 font-medium custom-button mb-4 ml-1 mt-4"
                disabled={isNextStepDisabled}
                onClick={handleAdProduct}
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
