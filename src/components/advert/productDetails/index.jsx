/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { GoTag } from "react-icons/go";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { RiArrowGoBackLine, RiDiscountPercentLine } from "react-icons/ri";
import link2 from "../../../assets/dashboard_img/linksvg1.svg";
import facomment from "../../../assets/dashboard_img/facomment.svg";
import brandIcon from "../../../assets/dashboard_img/brand_b1.svg"; // Adjust the path as needed
import { baseUrl } from "../../utils/Constant";
import axios from "axios";
import toast from "react-hot-toast";

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "AUD",
  "CAD",
  "JPY",
  "CNY",
  "CHF",
  "SEK",
  "NZD",
  "SGD",
  "HKD",
  "NOK",
  "KRW",
];
const discountOptions = ["Price", "Percentage"];
const brandNames = ["Brand1"]; // Replace this with a dynamic fetch if required

export default function ProductDetails({
  setIsNextSectionOpen,
  isCompleted,
  setIsCompleted,
  setShowProductDetails,
  isNewUser,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [customDiscount, setCustomDiscount] = useState(0);
  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
    productURL: "",
    brandName: brandNames[0],
    productPrice: 0,
    currency: currencies[0],
    discount: discountOptions[0],
    imageFile: null,
    logoURL: "",
  });
  const [brands, setBrands] = useState([]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).slice(
        0,
        3 - images.length
      );
      setImages([...images, ...newFiles]);
      if (newFiles.length > 0) {
        setSelectedImage(0);
      }
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
      if (newFiles.length > 0) {
        setSelectedImage(0);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageClick = (index) => {
    const selectedFile = images[index];
    if (selectedFile instanceof File || selectedFile instanceof Blob) {
      setSelectedImage(index);
      setProductDetails({ ...productDetails, imageFile: images[index] });
    } else {
      console.error("Selected file is not a valid File or Blob object");
    }
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
    setProductDetails({
      ...productDetails,
      discount: e.target.value,
      customDiscount: "",
    });
  };

  useEffect(() => {
    if (productDetails.imageFile) {
      uploadImage();
    }
  }, [productDetails.imageFile]);

  const uploadImage = async () => {
    const uploadData = new FormData();
    uploadData.append("file", productDetails.imageFile);
    uploadData.append("customerId", "123");

    try {
      await axios
        .post(`${baseUrl}/sparkiq/image/upload`, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          setProductDetails({ ...productDetails, logoURL: res.data.data.url });
          toast.success("Image upload successful");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${baseUrl}/brand/company/123`);
        setBrands(response.data.data);
      } catch (error) {
        console.log(error);
        console.error("Failed to fetch brands.");
      }
    };

    fetchBrands();
  }, []);

  const handleScanURL = async (e) => {
    console.log(`${baseUrl}/scrap/product?url=${productDetails.productURL}`);
    try {
      await axios
        .get(`${baseUrl}/scrap/product?url=${productDetails.productURL}`)
        .then((res) => {
          toast.success("Scan successful");
          console.log(res.data, "data");
          setProductDetails({
            ...productDetails,
            productName: res.data.productTitle,
            productDescription: res.data.productDesc,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdProduct = async (e) => {
    e.preventDefault();

    const newProduct = {
      brandID: productDetails.brandID,
      name: productDetails.productName,
      description: productDetails.productDescription,
      price: productDetails.productPrice,
      priceType: productDetails.currency,
      discount: customDiscount,
      discountType: productDetails.discount,
      productUrl: productDetails.productURL,
      productImagesList: [
        {
          imageURL: productDetails.logoURL,
        },
      ],
    };

    try {
      await axios.post(`${baseUrl}/product`, newProduct).then((res) => {
        toast.success("Product created successfully");
        console.log(res.data);
        localStorage.setItem("productId", JSON.stringify(res.data.data.id));
        handleNextStep()
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } 
  };

  const handleNextStep = () => {
    setIsOpen(false);
    setIsNextSectionOpen(true);
    setIsCompleted(true);
  };

  const isNextStepDisabled =
    productDetails.productName === "" ||
    productDetails.productDescription === "" ||
    productDetails.brandName === "" ||
    productDetails.productPrice === "" ||
    customDiscount === "" ||
    selectedImage === null ||
    (productDetails.discount === "Price" &&
      parseFloat(productDetails.productPrice) <= parseFloat(customDiscount)) ||
    (productDetails.discount === "Percentage" &&
      parseFloat(customDiscount) > 100);

  const imageContainerClass =
    images.length === 2
      ? "w-full lg:w-1/2"
      : images.length === 3
      ? "w-full lg:w-1/3"
      : "w-full";
  const imageSectionWidth =
    images.length === 1
      ? "w-full lg:w-2/6"
      : images.length === 2
      ? "w-full lg:w-3/6"
      : "w-full lg:w-4/6";

  return (
    <div>
      <span
        className="flex gap-1 cursor-pointer items-center pb-4"
        onClick={() => setShowProductDetails(false)}
      >
        <RiArrowGoBackLine /> back
      </span>
      <section className="border border-white bg-[rgba(252,252,252,0.25)] rounded-[32px] p-2 lg:p-4 flex flex-col gap-6 relative z-10">
        <div className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-[32px] lg:p-4 p-4 relative cursor-pointer">
          {isCompleted && (
            <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
              Completed <BiCheck size={20} />
            </span>
          )}
          <span className="flex items-center gap-4">
            <img src="/icon2.svg" alt="" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Add Product Details
              </h4>
              <p className="text-[#374151] text-xs lg:text-base">
                Upload photos and details of your product
              </p>
            </span>
          </span>
          <div className="flex items-center gap-6">
            {selectedImage !== null && (
              <div className="flex justify-between items-center gap-16">
                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                  <p className="text-[#1E1154] text-xs font-medium text-nowrap">
                    Selected Image
                  </p>
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
                <div
                  className={`bg-[rgba(252,252,252,0.25)] rounded-[30px] border-2 border-[#FCFCFC] shadow-sm p-5 ${imageSectionWidth} h-auto lg:h-80`}
                >
                  <h6 className="font-bold pb-4 mt-2 mb-4 text-sm md:text-base lg:text-lg">
                    Select Your Desired Image
                  </h6>
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
                    <h6 className="text-xl font-bold lg:text-lg">
                      Upload a product Image
                    </h6>
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
            <div className="flex flex-col md:flex-row gap-5 p-2">
              <div className="bg-[#FCFCFC40] shadow-md rounded-[20px] border border-[#FCFCFC] flex flex-col gap-[18px] w-full md:w-4/6 p-4">
                <span className="flex items-center gap-4 text-lg font-bold">
                  <img
                    src={link2}
                    className="bg-[#00279926] rounded-[10px] w-12 h-12 px-3"
                  />{" "}
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
                  <button
                    type="button"
                    onClick={handleScanURL}
                    className="w-fit custom-button rounded-[20px] text-white py-3 px-10 whitespace-pre font-medium"
                  >
                    Scan the URL
                  </button>
                </span>
              </div>
              <div className="bg-[#FCFCFC40] shadow-md rounded-[20px] border border-[#FCFCFC] flex flex-col gap-[18px] w-full md:w-2/6 p-4">
                <span className="flex items-center gap-4 text-lg font-bold">
                  <img
                    src={brandIcon}
                    className="bg-[#00279926] rounded-[10px] w-12 h-12 px-3"
                  />
                  <h6>Brand Name</h6>
                </span>
                {brands.length > 1 ? (
                  <select
                    className="rounded-[20px] py-4 pl-6 pr-8 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    style={{
                      appearance: "none",
                      background: "white",
                      backgroundPosition: "right 10px center",
                      backgroundRepeat: "no-repeat",
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 10l5 5l5-5"/></svg>')`,
                    }}
                    id="brandName"
                    onChange={(e) => {
                      const selectedBrand = brands.find(
                        (item) => item.id === e.target.value
                      );
                      setProductDetails({
                        ...productDetails,
                        brandID: selectedBrand.id,
                        brandName: selectedBrand.name,
                      });
                    }}
                  >
                    <option>Select brand name</option>
                    {brands.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="brandName"
                    value={productDetails.brandName}
                    readOnly
                    className="rounded-[20px] py-4 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none opacity-50"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center p-2">
              <img src="/orIcon.svg" alt="" />
            </div>
            <form onSubmit={handleAdProduct}>
              <p className="text-lg pb-2 text-[#082A66] ml-2 md:text-base lg:text-lg">
                Enter Product Details Manually
              </p>
              <div className="flex flex-col md:flex-row gap-5 lg:h-56">
                <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px]">
                  <span className="flex items-center gap-4 text-lg">
                    <GoTag className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
                    <h6 className="text-sm md:text-base lg:text-lg">
                      Product Name
                    </h6>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your product name"
                    id="productName"
                    value={productDetails.productName} // Use either value or defaultValue, not both
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
                    <h6 className="text-sm md:text-base lg:text-lg">
                      Product Description
                    </h6>
                  </span>
                  <textarea
                    placeholder="Enter your Product Description"
                    id="productDescription"
                    value={productDetails.productDescription} // Use either value or defaultValue, not both
                    onChange={handleOnChangeProductDetails}
                    className="rounded-[20px] py-4 pr-[100px] pl-[25px] shadow-md w-full h-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
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
                        value={productDetails.currency} // Use either value or defaultValue, not both
                        className="appearance-none bg-transparent pl-4 w-full h-full flex items-center justify-center focus:outline-none z-10"
                        style={{
                          background: "[#D9E9F2]",
                          backgroundPosition: "right 10px center",
                          backgroundRepeat: "no-repeat",
                          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M7 10l5 5l5-5"/></svg>')`,
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
                      value={productDetails.productPrice} // Use either value or defaultValue, not both
                      onChange={handleOnChangeProductDetails}
                      className="rounded-[20px] py-4 pl-28 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      autoComplete="off"
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
                        value={productDetails.discount} // Use either value or defaultValue, not both
                        className="appearance-none bg-transparent pl-2 w-full h-full flex items-center justify-center focus:outline-none z-10"
                        style={{
                          background: "[#D9E9F2]",
                          backgroundPosition: "right 10px center",
                          backgroundRepeat: "no-repeat",
                          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M7 10l5 5l5-5"/></svg>')`,
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
                      value={customDiscount} // Use either value or defaultValue, not both
                      onChange={handleOnChangeProductDetails}
                      className="rounded-[20px] py-4 pl-44 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-start p-2">
                <button
                  className="w-fit rounded-[20px] text-white py-3 px-10 font-medium custom-button mb-4 ml-1 mt-4"
                  disabled={isNextStepDisabled}
                  // onClick={handleNextStep}
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
