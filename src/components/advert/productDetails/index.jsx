/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { GoTag } from "react-icons/go";
import link2 from "../../../assets/dashboard_img/linksvg1.svg";
import facomment from "../../../assets/dashboard_img/facomment.svg";

export default function ProductDetails({
  setIsNextSectionOpen,
  isCompleted,
  setIsCompleted,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).slice(0, 3 - images.length);
      setImages([...images, ...newFiles]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files).slice(0, 3 - images.length);
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

  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
  });

  const handleOnChangeProductDetails = (e) => {
    setProductDetails({ ...productDetails, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productDetails);
  };

  const handleNextStep = () => {
    setIsOpen(false);
    setIsNextSectionOpen(true);
    setIsCompleted(true);

    // Save product details to localStorage
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    storedProducts.push({
      name: productDetails.productName,
      description: productDetails.productDescription,
      image: selectedImage !== null ? URL.createObjectURL(images[selectedImage]) : null,
    });
    localStorage.setItem("products", JSON.stringify(storedProducts));
  };

  const isNextStepDisabled =
    productDetails.productName === "" || productDetails.productDescription === "";

  const imageContainerClass =
    images.length === 2 ? "w-full lg:w-1/2" : images.length === 3 ? "w-full lg:w-1/3" : "w-full";
  const imageSectionWidth =
    images.length === 1
      ? "w-full lg:w-2/6"
      : images.length === 2
      ? "w-full lg:w-3/6"
      : "w-full lg:w-4/6";

  return (
    <div >
      <section className="border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] p-2 lg:p-4 flex flex-col gap-6 relative z-10">
        <div
          className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-[32px] lg:p-4 p-4 relative cursor-pointer"
          onClick={toggleAccordion}
        >
          {isCompleted && (
            <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
              Completed <BiCheck size={20} />
            </span>
          )}
          <span className="flex items-center gap-4">
            <img src="/icon2.svg" alt="" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">Add Product Details</h4>
              <p className="text-[#374151] text-xs lg:text-base">Upload photos and details of your product</p>
            </span>
          </span>
          <div className="flex items-center gap-6">
            {selectedImage !== null && (
              <div className="flex justify-between items-center gap-16">
                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                  <p className="text-[#1E1154] text-xs font-medium text-nowrap">Selected Image</p>
                </div>
                <img
                  src={URL.createObjectURL(images[selectedImage])}
                  alt="Selected"
                  className="w-[52px] h-[52px] rounded-[10px]"
                />
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
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-2">
              {images.length > 0 && (
                <div className={`bg-[rgba(252,252,252,0.25)] rounded-[30px] border-2 border-[#FCFCFC] shadow-sm p-5 ${imageSectionWidth} h-auto lg:h-80`}>
                  <h6 className="font-bold pb-4 mt-2 mb-4 text-sm md:text-base lg:text-lg">Select Your Desired Image</h6>
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
                className={`bg-white rounded-[30px] shadow-md p-5 ${
                  images.length > 0
                    ? images.length === 1
                      ? "w-full md:w-5/6"
                      : images.length === 2
                      ? "w-full md:w-4/6"
                      : "w-full md:w-3/6"
                    : "w-full"
                } lg:h-82`}
              >
                <div
                  className="border border-[#605880] border-dashed rounded-[20px] flex items-center justify-center py-12 px-6"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <span className="flex flex-col items-center justify-center">
                    <img src="/icon3.svg" alt="" className="w-10" />
                    <h6 className="text-xl font-bold lg:text-lg">Upload a product Image</h6>
                    <p>or drag and drop a product image here.</p>
                    <p className="font-medium mt-2 mb-4 text-xs md:text-sm lg:text-base">
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
            <div className="bg-[#FCFCFC40] p-6 shadow-md rounded-[20px]">
              <div className="flex flex-col gap-[18px]">
                <span className="flex items-center gap-4 text-xl font-bold">
                  <img
                    src={link2}
                    className="bg-[#00279926] rounded-[10px] w-12 h-12 px-3"
                  />{" "}
                  <h6 className="text-sm md:text-base lg:text-lg">Product Page URL (Automatically get details)</h6>
                </span>
                <span className="flex flex-col md:flex-row items-center gap-5">
                  <input
                    type="text"
                    placeholder="Your landing page or website (Example: spark.ai)"
                    className="rounded-[20px] py-4 pr-[100px] pl-[25px] shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    id="productURL"
                    onChange={handleOnChangeProductDetails}
                  />
                  <button className="custom-button p-3 pl-6 pr-6 text-white rounded-2xl shadow-xl flex justify-center w-fit text-nowrap">
                    Scan the URL
                  </button>
                </span>
              </div>
            </div>
            <div className="flex justify-center p-2">
              <img src="/orIcon.svg" alt="" />
            </div>
            <form onSubmit={handleSubmit}>
              <p className="text-lg pb-2 text-[#082A66] ml-2 md:text-base lg:text-lg">
                Enter Product Details Manually
              </p>
              <div className="flex flex-col md:flex-row gap-5 lg:h-56">
                <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px]">
                  <span className="flex items-center gap-4 text-lg">
                    <GoTag className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
                    <h6 className="text-sm md:text-base lg:text-lg">Product Name</h6>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your product name"
                    id="productName"
                    onChange={handleOnChangeProductDetails}
                    className="rounded-[20px] py-4 pr-[100px] pl-[25px] shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    autoComplete="off"
                  />
                </div>
                <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px]">
                  <span className="flex items-center gap-4 text-lg">
                    <img
                      src={facomment}
                      className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3"
                    />
                    <h6 className="text-sm md:text-base lg:text-lg">Product Description</h6>
                  </span>
                  <textarea
                    placeholder="Enter your Product Description"
                    id="productDescription"
                    onChange={handleOnChangeProductDetails}
                    className="rounded-[20px] py-4 pr-[100px] pl-[25px] shadow-md w-full h-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-center md:justify-start p-2">
                <button
                  className="w-fit rounded-[20px] text-white py-3 px-10 font-medium custom-button mb-4 ml-1 mt-4"
                  disabled={isNextStepDisabled}
                  onClick={handleNextStep}
                >
                  Next Step
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
