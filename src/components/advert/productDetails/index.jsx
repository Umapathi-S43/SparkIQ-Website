import { useState, useEffect } from "react";
import { FaTrash, FaChevronRight, FaChevronDown, FaCheck } from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoImageOutline } from "react-icons/io5";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from "../../utils/Constant";
import { useLocation } from "react-router-dom";
import { jwtToken } from '../../utils/jwtToken';

const currencies = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY", "CHF", "SEK", "NZD", "SGD", "HKD", "NOK", "KRW"];
const discountOptions = ["Price", "Percentage"];

const ProductDetails = ({ setIsNextSectionOpen, isCompleted, setIsCompleted, setShowProductDetails }) => {
    const [expandedSection, setExpandedSection] = useState(1);
    const [isOpen, setIsOpen] = useState(true);
    const [expandedSubsection1, setExpandedSubsection1] = useState(true);
    const [expandedSubsection2, setExpandedSubsection2] = useState(false);
    const [productDetails, setProductDetails] = useState({
        productName: "",
        productDescription: "",
        imageFile: null,
        logoURL: "",
        productURL: "",
        productPrice: "",
        currency: "USD",
        discount: "Percentage",
        customDiscount: "",
        brandName: "",
        brandID: "",
        prompt: "",
        isEdit: false,
    });
    const [imageSrc, setImageSrc] = useState(null);
    const [brands, setBrands] = useState([]);
    const [images, setImages] = useState([]);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [selectedImageType, setSelectedImageType] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [completedSections, setCompletedSections] = useState({
        1: false,
        2: false,
    });

    const location = useLocation();
    const storedProductID = JSON.parse(localStorage.getItem("productID")) || null;

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                if (!jwtToken) {
                    throw new Error("No JWT token found. Please log in.");
                }
                const response = await axios.get(`${baseUrl}/brand/company/123`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                const fetchedBrands = response.data.data.map((brand) => ({
                    ...brand,
                    productsCreated: 0,
                }));
                setBrands(fetchedBrands);

                if (fetchedBrands.length === 1) {
                    setProductDetails(prevDetails => ({
                        ...prevDetails,
                        brandID: fetchedBrands[0].id,
                        brandName: fetchedBrands[0].name,
                    }));
                }
            } catch (error) {
                console.log("Error fetching brands:", error);
                toast.error("Failed to fetch brands");
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        const fetchProducts = async (id) => {
            try {
                if (!jwtToken) {
                    throw new Error("No JWT token found. Please log in.");
                }
                const response = await axios.get(`${baseUrl}/product/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                const foundProduct = response.data.data;

                if (foundProduct) {
                    setProductDetails({
                        productName: foundProduct.name || "",
                        productDescription: foundProduct.description || "",
                        productURL: foundProduct.productURL || "",
                        brandID: foundProduct.brandID || "",
                        logoURL: foundProduct.productImagesList[0]?.imageURL || "",
                        discount: foundProduct.discountType || "Percentage",
                        customDiscount: foundProduct.discount || "",
                        productPrice: foundProduct.price || "",
                        currency: foundProduct.priceType || "INR",
                        isEdit: true,
                    });

                    const existingImages = foundProduct.productImagesList.map((img) => ({
                        file: null,
                        id: img.id,
                        url: img.imageURL,
                        uploaded: true,
                    }));
                    setImages(existingImages);
                    setSelectedImageUrl(existingImages[0]?.url || null);
                    setSelectedImageType(existingImages.length > 0 ? 'uploaded' : null);
                    setImageSrc(existingImages[0]?.url || null);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Failed to fetch product details");
            }
        };

        if (storedProductID) {
            fetchProducts(storedProductID);
        }
    }, [storedProductID]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleOnChangeProductDetails = (e) => {
        const { id, value } = e.target;

        if (id === "customDiscount") {
            const discountValue = parseFloat(value);
            const productPrice = parseFloat(productDetails.productPrice);

            if (productDetails.discount === "Percentage") {
                if (value === "" || (discountValue >= 0 && discountValue <= 100)) {
                    setProductDetails({ ...productDetails, customDiscount: value });
                }
            } else if (productDetails.discount === "Price") {
                if (value === "" || (!isNaN(discountValue) && discountValue <= productPrice)) {
                    setProductDetails({ ...productDetails, customDiscount: value });
                }
            }
        } else {
            setProductDetails({ ...productDetails, [id]: value });
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const newFile = {
                file,
                id: `${file.name}-${file.size}-0`,
                url: URL.createObjectURL(file)
            };

            setImages([newFile]);
            setSelectedImageUrl(newFile.url);
            setSelectedImageType('uploaded');
            setProductDetails({ ...productDetails, imageFile: newFile.file, logoURL: "" });
            uploadImage(newFile.file);
            setImageSrc(newFile.url);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.files) {
            const file = event.dataTransfer.files[0];
            const newFile = {
                file,
                id: `${file.name}-${file.size}-0`,
                url: URL.createObjectURL(file)
            };

            setImages([newFile]);
            setSelectedImageUrl(newFile.url);
            setSelectedImageType('uploaded');
            setProductDetails({ ...productDetails, imageFile: newFile.file, logoURL: "" });
            uploadImage(newFile.file);
            toast.success("Image uploaded successfully");
            setImageSrc(newFile.url);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleImageClick = (imageUrl, isGenerated = false, event) => {
        event.stopPropagation(); // Stop the event from propagating up to the parent
    
        console.log("Image clicked, URL:", imageUrl);
    
        if (isGenerated) {
            setImages([]); // Clear any previous uploads if selecting from generated images
            setSelectedImageUrl(imageUrl);
            setSelectedImageType('generated');
            setProductDetails({ ...productDetails, imageFile: null, logoURL: imageUrl });
            setImageSrc(imageUrl);
            toast.success("Image selected successfully");
        } else {
            const selectedImage = images.find(img => img.url === imageUrl);
            setSelectedImageUrl(imageUrl);
            setSelectedImageType('uploaded');
            setProductDetails({ ...productDetails, imageFile: selectedImage.file, logoURL: "" });
            if (!selectedImage.uploaded) {
                uploadImage(selectedImage.file);
            }
            setImageSrc(imageUrl);
        }
    };
    

    const handleDeleteImage = (index) => {
        if (images[index]) {
            const removedImage = images[index];
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);

            if (selectedImageUrl === removedImage.url && selectedImageType === 'uploaded') {
                setSelectedImageUrl(null);
                setSelectedImageType(null);
                setProductDetails({ ...productDetails, imageFile: null, logoURL: "" });
                setImageSrc(null);
            }
        } else {
            console.error("Image does not exist at index:", index);
        }
    };

    const handleScanUrl = async () => {
        try {
            if (!jwtToken) {
                throw new Error("No JWT token found. Please log in.");
            }

            const response = await axios.get(`${baseUrl}/scrap/product?url=${encodeURIComponent(productDetails.productURL)}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 200) {
                toast.success("Scan successful");

                setProductDetails({
                    ...productDetails,
                    productName: response.data.productTitle || productDetails.productName,
                    productDescription: response.data.productDesc || productDetails.productDescription,
                });
            } else {
                toast.error("Scan failed. Please try again.");
            }

        } catch (error) {
            console.log("Error scanning URL:", error);
            toast.error("Failed to scan the URL.");
        }
    };

    const handleDiscountChange = (e) => {
        const discountType = e.target.value;
        setProductDetails({
            ...productDetails,
            discount: discountType,
            customDiscount: "",
        });
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
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setGeneratedImages(response.data.result.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to generate images.");
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
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setGeneratedImages(response.data.result.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to generate images.");
        }
    };

    const uploadImage = async (imageFile) => {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        try {
            const response = await axios.post(`${baseUrl}/sparkiq/image/upload?customerId=123`, uploadData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.status === 201) {
                toast.success("Image uploaded successfully");
                setProductDetails((prevDetails) => ({
                    ...prevDetails,
                    logoURL: response.data.data.url,
                }));
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            toast.error("Error uploading image");
            console.error(error);
        }
    };

    const handleProductSubmission = async (e) => {
        e.preventDefault();
      
        const isEditMode = productDetails.isEdit && storedProductID;
        const productPayload = {
          id: isEditMode ? storedProductID : undefined,
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
          const response = await axios.post(`${baseUrl}/product`, productPayload, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
      
          if (isEditMode) {
            toast.success("Product updated successfully");
          } else {
            toast.success("Product created successfully");
            localStorage.setItem("productID", JSON.stringify(response.data.data.id));
          }
      
          setIsCompleted(true);
          setIsNextSectionOpen(true);
          setIsOpen(false); // Close current section
        } catch (error) {
          console.error("Error in product submission:", error);
          toast.error("Failed to submit product");
        }
      };
    
      const toggleAccordion = () => {
        setIsOpen(!isOpen);
      };

    const toggleAccordionSection1 = (event) => {
        if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "SELECT" && event.target.tagName !== "BUTTON") {
            setExpandedSubsection1(!expandedSubsection1);
        }
    };

    const handleSaveAndContinue = (section) => {
        const isNextStepDisabled =
            productDetails.productName === "" ||
            productDetails.productDescription === "" ||
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
        
        if (isNextStepDisabled) {
            toast.error("Please fill in all the required fields correctly.");
            return;
        }
    
        if (section === 2 && !productDetails.logoURL) {
            toast.error("Please upload or select an image before proceeding.");
            return;
        }
    
        const newCompletedSections = { ...completedSections };
        newCompletedSections[section] = true;
        setCompletedSections(newCompletedSections);
    
        if (section === 1) {
            setExpandedSubsection1(false);
            setExpandedSubsection2(true);
        }
        if (section === 2) {
            setExpandedSubsection2(false);
        }
    };

    const toggleAccordionSection2 = (event) => {
        if (!completedSections[1]) {
            toast.error("Please complete the first section before proceeding.");
            return;
        }
    
        if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA" && event.target.tagName !== "SELECT" && event.target.tagName !== "BUTTON") {
            setExpandedSubsection2(!expandedSubsection2);
        }
    };
    
    const isNextStepDisabled =
        productDetails.productName === "" ||
        productDetails.productDescription === "" ||
        productDetails.brandName === "" ||
        productDetails.productPrice === "" ||
        productDetails.customDiscount === "" ||
        productDetails.logoURL === "";

    return (
        <div>
            <span
                className="flex cursor-pointer items-center pb-2 pt-0 mt-0"
                onClick={() => setShowProductDetails(false)}
            >
                <RiArrowGoBackLine /> back
            </span>

            <section className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] flex flex-col gap-1 relative z-10 ${isOpen ? 'p-0' : 'p-3'}`}>
                <div className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] ${isOpen ? 'rounded-t-[20px] p-4' : 'rounded-[20px] lg:p-2 p-2'} relative cursor-pointer`} onClick={toggleAccordion}>
                    {completedSections[2] && (
                        <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
                            Completed <FaCheck size={20} />
                        </span>
                    )}
                    <span className="flex items-center gap-4">
                        <img src="/icon2.svg" alt="" />
                        <span className="flex flex-col">
                            <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                                Add Product Details
                            </h4>
                            <p className="text-[#374151] text-xs lg:text-sm">
                                Upload photos and details of your product
                            </p>
                        </span>
                    </span>
                    <div className="flex items-center gap-6">
                        {isCompleted && (
                            <div className="flex items-center gap-2">
                            <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                                <p className="text-[#1E1154] font-medium">Created Product</p>
                            </div>
                            <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                                <p className="text-[#1E1154] font-medium">{productName}</p>
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

                {isOpen && expandedSection === 1 && (
                    <div className="flex flex-col lg:flex-row p-8 w-full">
                        <div className="flex justify-center lg:justify-start mb-8 lg:mb-0 lg:mr-8">
                            <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-r from-[#F0F4F8] via-[#D9E9F2] to-[#F0F4F8] rounded-3xl flex items-center justify-center shadow-2xl transition-transform transform hover:scale-105 hover:rotate-2 duration-300">
                                <div className="absolute w-[85%] h-[85%] sm:w-[90%] sm:h-[90%] md:w-[95%] md:h-[95%] bg-white rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt="Product"
                                            className="object-cover rounded-2xl w-full h-full transition-opacity duration-300"
                                            style={{
                                                backgroundColor: "white",
                                                borderRadius: "20px",
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <IoImageOutline className="text-gray-300 text-6xl mb-4" />
                                            <p className="text-gray-500 font-semibold">Drag & Drop or Select an Image</p>
                                        </div>
                                    )}
                                </div>
                                {imageSrc && (
                                    <button
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-110"
                                        onClick={() => handleDeleteImage(images.findIndex(img => img.url === imageSrc))}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-grow pr-1">
                            <div
                                onClick={toggleAccordionSection1}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${expandedSubsection1 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                            >
                                <div className={`flex items-center justify-between ${expandedSubsection1 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold mt-0 pt-0">Product Details</p>
                                    </div>
                                    {completedSections[1] && (
                                        <div className="flex items-end rounded-xl shadow-xl bg-white border-2 p-1 px-6">
                                            <p className="m-0 text-sm sm:text-base md:text-lg">
                                                {productDetails.productName.split(' ')}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        {expandedSubsection1 ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                </div>
                                {expandedSubsection1 && (
                                    <div className="p-4">
                                        <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
                                            <input
                                                type="text"
                                                placeholder="Your landing page or website (Example: spark.ai)"
                                                name="productURL"
                                                value={productDetails.productURL}
                                                onChange={handleOnChange}
                                                className="rounded-lg py-3 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                            />
                                            <button
                                                className="w-fit custom-button rounded-2xl text-white py-3 px-8 whitespace-pre font-medium"
                                                onClick={handleScanUrl}
                                            >
                                                Scan the URL
                                            </button>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-5 mb-4">
                                            <input
                                                type="text"
                                                name="productName"
                                                placeholder="Product Name"
                                                value={productDetails.productName}
                                                onChange={handleOnChange}
                                                className=" w-full p-2 py-3 rounded-lg shadow-xl border border-[#fcfcfc] bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                            />
                                            <select
                                                className=" w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                name="brandName"
                                                value={productDetails.brandName}
                                                onChange={handleOnChange}
                                                style={{
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundColor: '#D9E9F2',
                                                    backgroundSize: 'auto',
                                                }}
                                            >
                                                <option value="">Select Brand Name</option>
                                                {brands.map((brand) => (
                                                    <option key={brand.id} value={brand.name}>
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <textarea
                                                name="productDescription"
                                                placeholder="Product Description"
                                                rows="3"
                                                value={productDetails.productDescription}
                                                onChange={handleOnChange}
                                                className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-5 mb-4">
                                            <div className="relative w-full md:w-1/2">
                                                <input
                                                    type="number"
                                                    placeholder="Enter Price"
                                                    name="productPrice"
                                                    value={productDetails.productPrice}
                                                    onChange={handleOnChange}
                                                    className="rounded-lg py-4 pl-32 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                    autoComplete="off"
                                                />
                                                <div className="absolute top-0 left-0 flex items-center h-full">
                                                    <select
                                                        name="currency"
                                                        value={productDetails.currency}
                                                        onChange={handleOnChange}
                                                        className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC] rounded-[12px] px-6 m-2 h-[44px] focus:outline-none"
                                                        style={{
                                                            backgroundRepeat: "no-repeat",
                                                            backgroundColor: '#D9E9F2',
                                                            backgroundSize: 'auto',
                                                        }}
                                                    >
                                                        {currencies.map((currency, index) => (
                                                            <option key={index} value={currency}>
                                                                {currency}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="relative w-full md:w-1/2">
                                                <input
                                                    type="number"
                                                    placeholder={`Enter Discount in ${productDetails.discount || 'Percentage'}`}
                                                    id="customDiscount"
                                                    min="0"
                                                    max={productDetails.discount === "Percentage" ? "100" : undefined}
                                                    value={productDetails.customDiscount || ''}
                                                    onChange={handleOnChangeProductDetails}
                                                    className="rounded-lg py-4 pl-44 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                    autoComplete="off"
                                                />
                                                <div className="absolute top-0 left-0 flex items-center h-full">
                                                    <select
                                                        id="discount"
                                                        onChange={handleDiscountChange}
                                                        value={productDetails.discount}
                                                        className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC] rounded-[12px] px-6 m-2 h-[44px] focus:outline-none"
                                                        style={{
                                                            backgroundRepeat: "no-repeat",
                                                            backgroundColor: '#D9E9F2',
                                                            backgroundSize: 'auto',
                                                        }}
                                                    >
                                                        {discountOptions.map((discount, index) => (
                                                            <option key={index} value={discount}>
                                                                {discount}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-start mt-4">
                                            <button
                                                className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                                                onClick={() => handleSaveAndContinue(1)}
                                            >
                                                Save and Continue
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div
                                onClick={toggleAccordionSection2}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${!completedSections[1] ? "opacity-50 cursor-not-allowed" : ""} ${expandedSubsection2 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                                style={{
                                    pointerEvents: !completedSections[1] ? "none" : "auto"
                                }}
                            >
                                <div className={`flex items-center justify-between ${expandedSubsection2 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold">Upload or Select Product Image</p>
                                    </div>
                                    {completedSections[2] && (
                                        <div className="flex items-center ml-auto bg-white rounded-lg p-1">
                                            <img
                                                src={productDetails.logoURL}
                                                alt="Product Image"
                                                className="w-12 h-7 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                    <div className="ml-4">
                                        {expandedSubsection2 ? (
                                            <FaChevronDown />
                                        ) : (
                                            <FaChevronRight />
                                        )}
                                    </div>
                                </div>

                                {expandedSubsection2 && (
                                    <div className="p-4 hide-scrollbar">
                                        <div className="border-2 border-[#fcfcfc] rounded-2xl m-2 p-1">
                                            <div className="bg-white rounded-xl m-1 p-2 shadow-lg">
                                                <div
                                                    className="border-dashed border-2 border-gray-400 bg-white rounded-lg p-1 text-center cursor-pointer hover:border-gray-600 relative"
                                                    onDrop={handleDrop}
                                                    onDragOver={handleDragOver}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        id="file-upload"
                                                    />
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="flex flex-col items-center justify-center h-full cursor-pointer"
                                                    >
                                                        <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                                                        <span className="text-gray-500 text-nowrap sm:text-xs">
                                                            Upload a product image here or or drag and drop a product image here.
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                        <img src="/orIcon.svg" alt="" />
                                        </div>
                                        <div className="flex flex-col md:flex-row p-2">
                                            <div className={`bg-[#FCFCFC40] shadow-md rounded-md border border-[#FCFCFC] flex flex-col gap-[18px] w-full p-2`}>
                                                
                                                <span className="flex flex-col md:flex-row items-center gap-5">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Your prompt for images (e.g: Tuition classes)"
                                                        id="prompt"
                                                        name="prompt"
                                                        value={productDetails.prompt}
                                                        onChange={handleOnChangeProductDetails}
                                                        className="rounded-lg py-3 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                    />
                                                    <button
                                                        className="w-fit custom-button rounded-lg text-white py-2 px-6 whitespace-pre font-medium"
                                                        onClick={handleSearchForImages}
                                                    >
                                                        Search for Images
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-row">
                                            {generatedImages.length > 0 && (
                                                <div>
                                                    <div className="relative w-full overflow-x-scroll border border-[#FCFCFC] p-1 rounded-md">
                                                        <div className="flex space-x-4">
                                                        {generatedImages.map((image, index) => (
                                                            <div key={index} className="relative flex-shrink-0 border rounded-lg">
                                                                <img
                                                                    src={image.imgUrl}
                                                                    alt={image.description}
                                                                    className="w-40 h-40 object-cover rounded-lg shadow-lg cursor-pointer"
                                                                    onClick={(event) => handleImageClick(image.imgUrl, true, event)} // Pass the event here
                                                                />
                                                            </div>
                                                        ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-4 mt-2">
                                                        <button
                                                            className="custom-button px-5 text-white rounded-md shadow-2xl"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Prev
                                                        </button>
                                                        <button
                                                            className="custom-button py-1 pl-4 pr-4 text-white rounded-md shadow-2xl"
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-start mt-0">
                                            <button
                                                className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                                                onClick={() => handleSaveAndContinue(2)}
                                            >
                                                Save and Continue
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-start items-center">
                        {completedSections[1] && completedSections[2] && (
                        <div className="flex justify-start p-4 pl-2">
                            <button
                                className="w-fit rounded-xl text-white py-3 px-10 font-medium custom-button"
                                disabled={isNextStepDisabled}
                                onClick={handleProductSubmission}
                            >
                                {!productDetails.isEdit ? "Next Step" : "Edit Product"}
                            </button>
                        </div>
                    )}
                    </div>
                        </div>
                    </div>
                )}
            </section>
            <ToastContainer /> 
        </div>
    );
};

export default ProductDetails;
