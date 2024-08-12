import { useState, useEffect } from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { GoTag } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import link2 from "../../../assets/dashboard_img/linksvg1.svg";
import facomment from "../../../assets/dashboard_img/facomment.svg";
import brandImage from "../../../assets/dashboard_img/brand_img.png"; // Adjust the path as needed
import brandIcon from "../../../assets/dashboard_img/brand_b1.svg"; // Adjust the path as needed
import { IoImageOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../utils/Constant";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";

const currencies = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY", "CHF", "SEK", "NZD", "SGD", "HKD", "NOK", "KRW"];
const discountOptions = ["Price", "Percentage"];

export default function ProductDetails({
  setIsNextSectionOpen,
  isCompleted,
  setIsCompleted,
  setShowProductDetails,
  isNewUser,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [images, setImages] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null); // Track by URL
  const [selectedImageType, setSelectedImageType] = useState(null); // 'uploaded' or 'generated'
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productID = params.get("id");

  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
    productURL: "",
    brandName: "",
    productPrice: "",
    currency: currencies[0],
    discount: discountOptions[0],
    customDiscount: "",
    imageFile: null,
    logoURL: "",
    brandID: "",
    prompt: "",
    isEdit: false,
  });
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async (id) => {
      try {
        const response = await axios.get(`${baseUrl}/product`);
        if (isMounted) {
          const foundProduct = response.data.data.find(
            (brand) => brand.id === id
          );
          if (foundProduct) {
            setProductDetails({
              productName: foundProduct.name,
              productDescription: foundProduct.description,
              productURL: foundProduct.productURL,
              brandID: foundProduct.brandID,
              isEdit: true,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (productID) {
      fetchProducts(productID);
    }

    return () => {
      isMounted = false;
    };
  }, [productID]);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).slice(0, 3 - images.length);
      setImages([...images, ...newFiles]);
      if (newFiles.length === 1) {
        setSelectedImageUrl(URL.createObjectURL(newFiles[0]));
        setSelectedImageType('uploaded');
        setProductDetails({ ...productDetails, imageFile: newFiles[0], logoURL: "" });
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files).slice(0, 3 - images.length);
      setImages([...images, ...newFiles]);
      if (newFiles.length === 1) {
        setSelectedImageUrl(URL.createObjectURL(newFiles[0]));
        setSelectedImageType('uploaded');
        setProductDetails({ ...productDetails, imageFile: newFiles[0], logoURL: "" });
        toast.success("Image uploaded successfully");
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageClick = (url, isGenerated = false) => {
    if (isGenerated) {
      setImages([]);  // Clear any previously uploaded images
    }
    setSelectedImageUrl(url);
    setSelectedImageType(isGenerated ? 'generated' : 'uploaded');
    if (isGenerated) {
      setProductDetails({ ...productDetails, imageFile: null, logoURL: url });
      toast.success("Generated image selected successfully");
    } else {
      setProductDetails({ ...productDetails, imageFile: images.find(img => URL.createObjectURL(img) === url), logoURL: "" });
      toast.success("Uploaded image selected successfully");
    }
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    if (selectedImageUrl === URL.createObjectURL(images[index]) && selectedImageType === 'uploaded') {
      setSelectedImageUrl(null);
      setSelectedImageType(null);
      setProductDetails({ ...productDetails, imageFile: null, logoURL: "" });
    }
  };

  // Handle change in product details
  const handleOnChangeProductDetails = (e) => {
    const { id, value } = e.target;
    
    if (id === "customDiscount") {
      const discountValue = parseFloat(value);
      const productPrice = parseFloat(productDetails.productPrice);
  
      if (productDetails.discount === "Percentage") {
        if (!isNaN(productPrice) && discountValue > 0 && discountValue <= 100) {
          const discountAmount = (productPrice * discountValue) / 100;
          if (discountAmount > productPrice) {
            toast.error("The discount amount exceeds the product price.");
          } else {
            setProductDetails({ ...productDetails, customDiscount: value });
          }
        } else {
          toast.error("Please enter a valid percentage between 1 and 100.");
        }
      } else if (productDetails.discount === "Price") {
        if (!isNaN(discountValue) && discountValue <= productPrice) {
          setProductDetails({ ...productDetails, customDiscount: value });
        } else {
          toast.error("The discount price must be less than or equal to the product price.");
        }
      }
    } else {
      setProductDetails({ ...productDetails, [id]: value });
    }
  };
  

  // Handle discount type change
  const handleDiscountChange = (e) => {
    const discountType = e.target.value;
    setProductDetails({
      ...productDetails,
      discount: discountType,
      customDiscount: "",
    });
  };
  
  // Fetch brand details when component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${baseUrl}/brand/company/123`);
        const fetchedBrands = response.data.data.map((brand) => {
          const storedCount = localStorage.getItem(`brand_${brand.id}_count`);
          return {
            ...brand,
            productsCreated: storedCount ? parseInt(storedCount) : 0,
          };
        });
        setBrands(fetchedBrands);
  
        // Automatically select the brand if there's only one
        if (fetchedBrands.length === 1) {
          setProductDetails(prevDetails => ({
            ...prevDetails,
            brandID: fetchedBrands[0].id,
            brandName: fetchedBrands[0].name,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchBrands();
  }, []);

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
      discount: productDetails.customDiscount,
      discountType: productDetails.discount,
      productImagesList: [
        {
          imageURL: productDetails.logoURL,
        },
      ],
    };
    try {
      await axios.post(`${baseUrl}/product`, newProduct);
      updateBrandProductCount(productDetails.brandID);
      toast.success("Product created successfully");
      handleNextStep();
    } catch (error) {
      console.log(error);
    }
  };

  const updateBrandProductCount = (brandID) => {
    setBrands((prevBrands) => {
      return prevBrands.map((brand) => {
        if (brand.id === brandID) {
          const updatedCount = brand.productsCreated + 1;
          localStorage.setItem(`brand_${brand.id}_count`, updatedCount);
          return {
            ...brand,
            productsCreated: updatedCount,
          };
        }
        return brand;
      });
    });
  };

  const handleEditProduct = async () => {
    const editProduct = {
      brandID: productDetails.brandID,
      name: productDetails.productName,
      description: productDetails.productDescription,
      productImagesList: [
        {
          imageURL: productDetails.logoURL,
        },
      ],
    };

    try {
      await axios.post(`${baseUrl}/product`, editProduct);
      toast.success("Product edited successfully");
      handleNextStep();
    } catch (error) {
      console.log(error);
    }
  };

  const handleScanUrl = async (e) => {
    try {
      await axios
        .get(`${baseUrl}/scrap/product?url=${productDetails.productURL}`)
        .then((res) => {
          toast.success("Scan successful");
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

  const handleSearchForImages = async () => {
    try {
      const response = await axios.get(`${baseUrl}/search/get-images`, {
        params: {
          prompt: productDetails.prompt,
          page: currentPage,
          size: 10,
        },
      });
      setGeneratedImages(response.data.result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate images.");
    }
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    try {
      const response = await axios.get(`${baseUrl}/search/get-images`, {
        params: {
          prompt: productDetails.prompt,
          page: page,
          size: 10,
        },
      });
      setGeneratedImages(response.data.result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate images.");
    }
  };

  const handleNextStep = () => {
    setIsOpen(false);
    setIsNextSectionOpen(true);
    setIsCompleted(true);
  };

    // Determine if the "Next Step" button should be disabled
    const isNextStepDisabled =
    productDetails.productName === "" ||
    productDetails.productDescription === "" ||
    (!productDetails.logoURL && !productDetails.imageFile) ||
    productDetails.brandName === "" ||
    productDetails.productPrice === "" ||
    productDetails.customDiscount === "" ||
    (productDetails.discount === "Price" && 
      (isNaN(parseFloat(productDetails.customDiscount)) || 
       parseFloat(productDetails.customDiscount) > parseFloat(productDetails.productPrice))) ||
    (productDetails.discount === "Percentage" && 
      (isNaN(parseFloat(productDetails.customDiscount)) || 
       parseFloat(productDetails.customDiscount) <= 0 ||
       parseFloat(productDetails.customDiscount) > 100));
  
  
      console.log('productName:', productDetails.productName);
      console.log('productDescription:', productDetails.productDescription);
      console.log('logoURL:', productDetails.logoURL);
      console.log('imageFile:', productDetails.imageFile);
      console.log('brandName:', productDetails.brandName);
      console.log('productPrice:', productDetails.productPrice);
      console.log('customDiscount:', productDetails.customDiscount);
      console.log('discount:', productDetails.discount);
      console.log('price condition:', parseFloat(productDetails.productPrice) <= parseFloat(productDetails.customDiscount));
      console.log('percentage condition:', parseFloat(productDetails.customDiscount) > 100);
      
        console.log('isNextStepDisabled:', isNextStepDisabled);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const generatedImageSectionWidth = "w-full lg:w-2/6"; // Fixed width for generated images
  const generatedImageContainerClass = "w-full"; // Fixed width for generated image container

  const imageContainerClass =
    images.length === 2 || (selectedImageType === 'generated' && images.length > 1)
      ? "w-full lg:w-1/2"
      : images.length === 3 || (selectedImageType === 'generated' && images.length > 2)
      ? "w-full lg:w-1/3"
      : "w-full";

  const imageSectionWidth =
    images.length === 1 || (selectedImageType === 'generated' && images.length > 0)
      ? generatedImageSectionWidth
      : images.length === 2 || (selectedImageType === 'generated' && images.length === 1)
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
            {selectedImageUrl !== null && (
              <div className="flex justify-between items-center gap-16">
                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                  <p className="text-[#1E1154] text-xs font-medium text-nowrap">
                    Selected Image
                  </p>
                </div>
                <img
                  src={selectedImageUrl}
                  alt="Selected"
                  className="w-[52px] h-[52px] rounded-[10px]"
                />
              </div>
            )}
            {isOpen ? (
              <MdArrowDropUp size={32} className="cursor-pointer" onClick={toggleAccordion} />
            ) : (
              <MdArrowDropDown size={32} className="cursor-pointer" onClick={toggleAccordion} />
            )}
          </div>
        </div>
        {isOpen && (
          <>
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-2">
              {selectedImageType !== 'generated' && images.length > 0 && (
                <div
                  className={`bg-[rgba(252,252,252,0.25)] rounded-[30px] border-2 border-[#FCFCFC] shadow-sm p-5 ${imageSectionWidth} h-auto lg:h-80`}
                >
                  <h6 className="font-bold pb-4 mt-2 mb-4 text-sm md:text-base lg:text-lg">
                    Select Your Desired Image
                  </h6>
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    {images.map((image, index) => {
                      const imageUrl = URL.createObjectURL(image);
                      return (
                        <div
                          key={index}
                          className={`relative cursor-pointer border-1 border-[#FCFCFC] rounded ${imageContainerClass}`}
                          onClick={() => handleImageClick(imageUrl)}
                        >
                          <img
                            src={imageUrl}
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
                          {selectedImageUrl === imageUrl && selectedImageType === 'uploaded' && (
                            <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#09AA09]">
                              <BiCheck size={16} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedImageType === 'generated' && (
                <div
                  className={`bg-[rgba(252,252,252,0.25)] rounded-[30px] border-2 border-[#FCFCFC] shadow-sm p-5 ${generatedImageSectionWidth} h-auto lg:h-80`}
                >
                  <h6 className="font-bold pb-4 mt-2 mb-4 text-sm md:text-base lg:text-lg">
                    Selected Image
                  </h6>
                  <div className="flex gap-4 flex-wrap md:flex-nowrap">
                    <div
                      className={`relative cursor-pointer border-1 border-[#FCFCFC] rounded ${generatedImageContainerClass}`}
                      onClick={() => handleImageClick(productDetails.logoURL, true)}
                    >
                      <img
                        src={productDetails.logoURL}
                        alt="Selected Generated Image"
                        className="object-cover w-full h-48 rounded"
                      />
                      {selectedImageUrl === productDetails.logoURL && (
                        <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#09AA09]">
                          <BiCheck size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`bg-white rounded-[30px] shadow-md p-5 ${
                  selectedImageType === 'generated'
                    ? "w-full md:w-5/6"
                    : images.length > 0
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

            <div className="flex justify-center">
              <img src="/orIcon.svg" alt="" />
            </div>

            <div className="flex flex-col md:flex-row p-2">
              <div className={`bg-[#FCFCFC40] shadow-md rounded-[20px] border border-[#FCFCFC] flex flex-col gap-[18px] w-full p-4`}>
                <span className="flex items-center gap-4 text-lg font-bold">
                  <div 
                    className="bg-[#00279926] rounded-[10px] w-12 h-12 px-3 flex justify-center items-center"
                  ><IoImageOutline /></div>{" "}
                  <h6>Enter the prompt to get images for your service/product</h6>
                </span>
                <span className="flex flex-col md:flex-row items-center gap-5">
                  <input
                    type="text"
                    placeholder="Your prompt (Example: Tuition classes for kids)"
                    id="prompt"
                    onChange={handleOnChangeProductDetails}
                    className="rounded-[20px] py-4 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                  />
                  <button
                    className="w-fit custom-button rounded-[20px] text-white py-3 px-6 whitespace-pre font-medium"
                    onClick={handleSearchForImages}
                  >
                    Search for Images
                  </button>
                </span>
              </div>
            </div>

            {generatedImages.length > 0 && (
              <div className="p-2 border border-[#FCFCFC] m-3 rounded-2xl">
                <h6 className="font-bold pb-4 mt-2 mb-4 text-center">Select a Generated Image</h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mx-2">
                  {generatedImages.map((image, index) => {
                    const imageUrl = image.imgUrl;
                    return (
                      <div
                        key={index}
                        className={`relative cursor-pointer border-1 border-[#FCFCFC] rounded`}
                        onClick={() => handleImageClick(imageUrl, true)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Generated ${index}`}
                          className="object-cover w-full h-48 rounded"
                        />
                        {selectedImageUrl === imageUrl && selectedImageType === 'generated' && (
                          <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white bg-[#09AA09]">
                            <BiCheck size={16} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end items-end gap-4 m-4">
                  <button
                    className="w-fit custom-button rounded-[10px] text-white py-2 px-5 font-medium"
                    onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                  >
                    Prev 
                  </button>
                  <button
                    className="w-fit custom-button rounded-[10px] text-white py-2 px-4 font-medium"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
                  value={productDetails.productURL}
                  onChange={handleOnChangeProductDetails}
                  className="rounded-[20px] py-4 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                />
                <button
                  className="w-fit custom-button rounded-[20px] text-white py-4 px-10 whitespace-pre font-medium"
                  onClick={handleScanUrl}
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

            {brands.length === 1 ? (
              <input
                type="text"
                className="rounded-[20px] py-4 pl-6 pr-8 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none disabled cursor-not-allowed opacity-90"
                value={brands[0].name}
                readOnly
              />
            ) : (
              <select
                className="rounded-[20px] py-4 pl-6 pr-8 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                style={{
                  appearance: "none",
                  background: "white",
                  backgroundPosition: "right 10px center",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 10l5 5l5-5"/></svg>')`,
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
            )}
          </div>

          </div>

            <form
              onSubmit={
                productDetails.isEdit ? handleEditProduct : handleAdProduct
              }
              className="p-2"
            >
              <p className="text-lg pb-2 text-[#082A66] ml-2">
                Enter Product Details Manually
              </p>
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
                    value={productDetails.productName}
                    onChange={handleOnChangeProductDetails}
                    className="rounded-[20px] py-4 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    autoComplete="off"
                  />
                </div>
                <div className="bg-[#FCFCFC66] shadow-md p-4 rounded-[20px] border border-[#FCFCFC] w-full lg:w-1/2 flex flex-col gap-[18px]">
                  <span className="flex items-center gap-4 text-lg">
                    <img
                      src={facomment}
                      className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3"
                    />
                    <h6>Product Description</h6>
                  </span>
                  <textarea
                    placeholder="Enter your Product Description"
                    id="productDescription"
                    value={productDetails.productDescription}
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
                        value={productDetails.currency}
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
                      value={productDetails.productPrice}
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
                        value={productDetails.discount}
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
                      value={productDetails.customDiscount}
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
                >
                  {productDetails.isEdit ? "Edit Product" : "Next Step"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
