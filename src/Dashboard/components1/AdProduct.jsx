import React, { useState, useEffect } from "react";
import { FaTrash, FaChevronRight, FaChevronDown, FaCheck } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../components/utils/Constant";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtToken } from '../../components/utils/jwtToken';
import { FaCartShopping } from "react-icons/fa6";
import { FcServices } from "react-icons/fc";
const currencies = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY", "CHF", "SEK", "NZD", "SGD", "HKD", "NOK", "KRW"];
const discountOptions = ["Price", "Percentage"];

const AdProduct = () => {
    const industryOptions = [
        "E-com",
        "Automotive",
        "Marketing",
        "B2B Consultant",
        "Other",
    ];
    const [productDetails, setProductDetails] = useState({
        productName: "",
        productDescription: "",
        type: "",
        industryName: "",
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
    const [isProduct, setIsProduct] = useState(true); // Track whether it's Product or Service
    const [imageSrc, setImageSrc] = useState(null);
    const [brands, setBrands] = useState([]);
    const [images, setImages] = useState([]);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [selectedImageType, setSelectedImageType] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(true);
    const [expandedSubsection0, setExpandedSubsection0] = useState(true);
    const [expandedSubsection1, setExpandedSubsection1] = useState(false);
    const [expandedSubsection2, setExpandedSubsection2] = useState(false);
    const [completedSections, setCompletedSections] = useState({
        0: false,
        1: false,
        2: false,
    });

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const storedProductID = params.get("id");

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                if (!jwtToken) {
                    throw new Error("No JWT token found. Please log in.");
                }
                const response = await axios.get(`${baseUrl}/v2/api/brands`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
            const fetchedBrands = response.data?.data || []; // Ensure it's an array
            setBrands(fetchedBrands);
        

                if (fetchedBrands.length === 1) {
                    setProductDetails(prevDetails => ({
                        ...prevDetails,
                        brandID: fetchedBrands[0].id,
                        brandName: fetchedBrands[0].brandName,
                    }));
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
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
                        type: foundProduct.type || "",
                        industryName:foundProduct.industryName || "",
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

        if (name === "brandName") {
            const selectedBrand = brands.find((brand) => brand.brandName === value);
            setProductDetails(prev => ({
                ...prev,
                brandName: value,
                brandID: selectedBrand ? selectedBrand.id : "",
            }));
        } else {
            setProductDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleProductSubmission = async (e) => {
        e.preventDefault();
        // Set default values if they are not provided
        const defaultProductPrice = productDetails.productPrice === "" ? "0" : productDetails.productPrice;
        const defaultCurrency = productDetails.currency === "" ? "USD" : productDetails.currency;
        const defaultCustomDiscount = productDetails.customDiscount === "" ? "0" : productDetails.customDiscount;
        const defaultDiscountType = productDetails.discount === "" ? "Percentage" : productDetails.discount;


        try {
            const isEditMode = productDetails.isEdit && storedProductID;
            const productPayload = {
                id: isEditMode ? storedProductID : undefined,
                brandID: productDetails.brandID,
                type: productDetails.type,
                industryName: productDetails.industryName,
                name: productDetails.productName,
                description: productDetails.productDescription,
                price: defaultProductPrice,
                priceType: defaultCurrency,
                discount: defaultCustomDiscount,
                discountType: defaultDiscountType,
                productImagesList: [
                    {
                        imageURL: productDetails.logoURL,
                    },
                ],
            };
            console.log("Product Payload:", productPayload);
            const response = await axios.post(`${baseUrl}/product`, productPayload, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (isEditMode) {
                toast.success("Product updated successfully");
            } else {
                toast.success("Product created successfully");
            }

            navigate("/productspage"); // Redirect to productspage upon successful creation or edit

        } catch (error) {
            console.error("Error during product submission:", error);
            toast.error("Failed to submit product");
        }
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

    const handleImageClick = (imageUrl, isGenerated = false) => {
        if (isGenerated) {
            // Clear any previous uploads if selecting from generated images
            setImages([]);
            setSelectedImageUrl(imageUrl);
            setSelectedImageType('generated');
            setProductDetails((prevDetails) => ({
                ...prevDetails,
                imageFile: null,
                logoURL: imageUrl,
            }));
            setImageSrc(imageUrl);
            toast.success("Image selected successfully");
        } else {
            const selectedImage = images.find(img => img.url === imageUrl);
            setSelectedImageUrl(imageUrl);
            setSelectedImageType('uploaded');
            setProductDetails((prevDetails) => ({
                ...prevDetails,
                imageFile: selectedImage.file,
                logoURL: "",
            }));
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
            console.error("Failed to generate images next page", error);
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
            console.error(error);
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
    const handleToggleType = (type) => {
        if (type === "Product") {
            productDetails.type="product";
            setIsProduct(true);
        } else if (type === "Service") {
            productDetails.type="service";
            setIsProduct(false);
        }
    };

    const isNextStepDisabled =
        productDetails.productName === "" ||
        productDetails.productDescription === "" ||
        productDetails.brandName === ""||
        productDetails.industryName === "" 
    // productDetails.productPrice === "" ||
    // productDetails.customDiscount === "" ||
    // (productDetails.discount === "Price" &&
    //     (isNaN(parseFloat(productDetails.customDiscount)) ||
    //         parseFloat(productDetails.customDiscount) > parseFloat(productDetails.productPrice))) ||
    // (productDetails.discount === "Percentage" &&
    //     (isNaN(parseFloat(productDetails.customDiscount)) ||
    //         parseFloat(productDetails.customDiscount) <= 0 ||
    //         parseFloat(productDetails.customDiscount) > 100));
    const handleSaveAndContinue = (currentSection) => {
        // Validation logic based on the current section
        if (currentSection === 0 && !productDetails.productURL) {
            toast.error("Please enter a Url before proceeding.");
            return false;
        }
        if (currentSection === 1 && isNextStepDisabled) {
            toast.error("Please fill in all the required fields correctly.");
            return false;
        }
        if (currentSection === 2 && !productDetails.logoURL) {
            toast.error("Please upload or select an image before proceeding.");
            return false;
        }

        // Mark the current section as completed
        const newCompletedSections = { ...completedSections };
        newCompletedSections[currentSection] = true;
        setCompletedSections(newCompletedSections);

        // Expand the next subsection based on the current section
        if (currentSection === 0) {
            setExpandedSubsection0(false);
            setExpandedSubsection1(true);
        }
        if (currentSection === 1) {
            setExpandedSubsection1(false);
            setExpandedSubsection2(true);
        }
        if (currentSection === 2) {
            setExpandedSubsection2(false);
            // Optionally, handle completion or further steps here
            toast.success("All sections completed!");
        }

        return true; // Indicate successful validation and progression
    };
    // const handleIndustrySelect = (industryName) => {
    //     setProductDetails((prevDetails) => ({
    //         ...prevDetails,
    //         industryName,
    //     }));
    // };
    const handleIndustrySelect = (event) => {
        const selectedIndustry = event.target.value; // Get the selected value
        setProductDetails((prevDetails) => ({
            ...prevDetails,
            industryName: selectedIndustry, // Update the industryName
        }));
    };
    

    // General toggle function to handle both forward and backward navigation
    const toggleAccordion = (section, event) => {
        const tagName = event.target.tagName;

        // Define which elements should not trigger the toggle
        const excludedTags = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "IMG"];

        if (excludedTags.includes(tagName)) {
            return; // Do not toggle if the clicked element is excluded
        }

        if (completedSections[section]) {
            // If the section is already completed, simply toggle its expansion state
            if (section === 0) {
                setExpandedSubsection0(!expandedSubsection0);
            }
            if (section === 1) {
                setExpandedSubsection1(!expandedSubsection1);
            }
            if (section === 2) {
                setExpandedSubsection2(!expandedSubsection2);
            }
        } else {
            // If the section is not completed, attempt to save and continue
            const canProceed = handleSaveAndContinue(section);
            if (!canProceed) {
                // If validation fails, do not toggle the section
                return;
            }
        }
    };

    // Individual toggle functions now use the general toggleAccordion
    const toggleAccordionSection0 = (event) => {
        toggleAccordion(0, event);

    };

    const toggleAccordionSection1 = (event) => {
        // Ensure that the first section is completed before allowing to toggle section 1
        if (!completedSections[0]) {
            toast.error("Please complete the first section before proceeding.");
            return;
        }
        toggleAccordion(1, event);
    };

    const toggleAccordionSection2 = (event) => {
        // Ensure that the second section is completed before allowing to toggle section 2
        if (!completedSections[1]) {
            toast.error("Please complete the second section before proceeding.");
            return;
        }
        toggleAccordion(2, event);
    };



    return (
        <div className="flex-grow mr-8">
            <div className={`border border-white max-w-7xl bg-[rgba(252,252,252,0.25)] rounded-[24px] flex flex-col gap-1 relative z-10 overflow-auto ${isOpen ? 'p-0' : 'p-3'}`}>
                <div className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] ${isOpen ? 'rounded-t-[20px] p-4' : 'rounded-[20px] lg:p-2 p-2'} relative cursor-pointer`} onClick={() => setIsOpen(!isOpen)}>

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
                    <div className="flex items-center gap-6 overflow-auto">
                        {productDetails.isEdit && (
                            <div className="flex items-center gap-2">
                                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                                    <p className="text-[#1E1154] font-medium">Edit Product</p>
                                </div>
                                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                                    <p className="text-[#1E1154] font-medium">{productDetails.productName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="flex flex-col lg:flex-row p-8 w-full overflow-auto hide-scrollbar" style={{ maxHeight: '69vh' }}>
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
                                onClick={toggleAccordionSection0}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${expandedSubsection0 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                            >
                                <div className={`flex items-center justify-between ${expandedSubsection0 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold mt-0 pt-0">Basic Information</p>
                                    </div>
                                    <div>
                                        {expandedSubsection0 ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                </div>
                                {expandedSubsection0 && (
                                    <div className="p-4">
                                        <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
                                            <p className="text-base">What do you want to add?</p>
                                        </div>
                                        <div className="flex gap-4 mb-4">
                                            <button
                                                className={`w-1/4 p-3 py-5 rounded-lg shadow-xl border-2 ${isProduct ? "bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-blue-500" : "bg-gray-200 border-gray-400"
                                                    } font-medium flex items-center justify-center gap-2`}
                                                onClick={() => handleToggleType("Product")}
                                            >
                                                <FaCartShopping className="text-xl" /> Product
                                            </button>
                                            <button
                                                className={`w-1/4 p-3 py-5 rounded-lg shadow-xl border-2 ${!isProduct ? "bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-blue-500" : "bg-gray-200 border-gray-400"
                                                    } font-medium flex items-center justify-center gap-2`}
                                                onClick={() => handleToggleType("Service")}
                                            >
                                                <FcServices className="text-xl" /> Service
                                            </button>
                                        </div>


                                        <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
                                            <input
                                                type="text"
                                                placeholder={`Your landing page for ${isProduct ? "Product" : "Service"} or website (e.g., spark.ai)`}
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
                                        <div className="flex justify-start mt-4">
                                            <button
                                                className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                                                onClick={() => handleSaveAndContinue(0)}
                                            >
                                                Save and Continue
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div
                                onClick={toggleAccordionSection1}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${!completedSections[0] ? "opacity-50 cursor-not-allowed" : ""}  ${expandedSubsection1 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                            >
                                <div className={`flex items-center justify-between ${expandedSubsection1 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold mt-0 pt-0">  {isProduct ? "Product Details" : "Service Details"}</p>
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
                                        {/* <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
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
                                        </div> */}

                                        <div className="flex flex-col md:flex-row gap-5 mb-4">
                                            <input
                                                type="text"
                                                name="productName"
                                                placeholder={isProduct ? "Product Name" : "Service Name"}
                                                value={productDetails.productName}
                                                onChange={handleOnChange}
                                                className=" w-full p-2 py-3 rounded-lg shadow-xl border border-[#fcfcfc] bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                            />
                                            <select
                                                className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
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
                                                    <option key={brand.id} value={brand.brandName}>
                                                        {brand.brandName}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>

                                        <div className="mb-4">
                                            <textarea
                                                name="productDescription"
                                                placeholder={isProduct ? "Product Description" : "Service Description"}
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
                                        {/* <div className="mb-4">
                                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-3">
                                                Select Industry
                                            </label>
                                            <div className="flex gap-4 flex-wrap">
                                                <button
                                                    className={`w-1/4 p-3 rounded-lg shadow-xl border-2 flex items-center justify-center ${productDetails.industryName === "E-com"
                                                            ? "bg-orange-100 border-orange-500 text-orange-700"
                                                            : "bg-orange-50 border-orange-300 text-orange-500"
                                                        } font-medium`}
                                                    onClick={() => handleIndustrySelect("E-com")}
                                                >
                                                    <span>E-com</span>
                                                    {productDetails.industryName === "E-com" && <FaCheck className="text-orange-700 ml-2" />}
                                                </button>
                                                <button
                                                    className={`w-1/4 p-3 rounded-lg shadow-xl border-2 flex items-center justify-center ${productDetails.industryName === "Automotive"
                                                            ? "bg-green-100 border-green-500 text-green-700"
                                                            : "bg-green-50 border-green-300 text-green-500"
                                                        } font-medium`}
                                                    onClick={() => handleIndustrySelect("Automotive")}
                                                >
                                                    <span>Automotive</span>
                                                    {productDetails.industryName === "Automotive" && <FaCheck className="text-green-700 ml-2" />}
                                                </button>
                                                <button
                                                    className={`w-1/4 p-3 rounded-lg shadow-xl border-2 flex items-center justify-center ${productDetails.industryName === "Marketing"
                                                            ? "bg-blue-100 border-blue-500 text-blue-700"
                                                            : "bg-blue-50 border-blue-300 text-blue-500"
                                                        } font-medium`}
                                                    onClick={() => handleIndustrySelect("Marketing")}
                                                >
                                                    <span>Marketing</span>
                                                    {productDetails.industryName === "Marketing" && <FaCheck className="text-blue-700 ml-2" />}
                                                </button>
                                                <button
                                                    className={`w-1/4 p-3 rounded-lg shadow-xl border-2 flex items-center justify-center ${productDetails.industryName === "B2B Consultant"
                                                            ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                                                            : "bg-yellow-50 border-yellow-300 text-yellow-500"
                                                        } font-medium`}
                                                    onClick={() => handleIndustrySelect("B2B Consultant")}
                                                >
                                                    <span>B2B Consultant</span>
                                                    {productDetails.industryName === "B2B Consultant" && <FaCheck className="text-yellow-700 ml-2" />}
                                                </button>
                                                <button
                                                    className={`w-1/4 p-3 rounded-lg shadow-xl border-2 flex items-center justify-center ${productDetails.industryName === "Other"
                                                            ? "bg-gray-100 border-gray-500 text-gray-700"
                                                            : "bg-gray-50 border-gray-300 text-gray-500"
                                                        } font-medium`}
                                                    onClick={() => handleIndustrySelect("Other")}
                                                >
                                                    <span>Other</span>
                                                    {productDetails.industryName === "Other" && <FaCheck className="text-gray-700 ml-2" />}
                                                </button>
                                            </div>
                                        </div> */}
                                        <div className="mb-4">
                                            <label
                                                htmlFor="industry"
                                                className="block text-sm font-medium text-gray-700 mb-3"
                                            >
                                                Select Industry
                                            </label>
                                            <select
                                                id="industry"
                                                name="industry"
                                                value={productDetails.industryName}
                                                onChange={handleIndustrySelect}
                                                className="rounded-lg py-3 pl-6 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                            >
                                                <option value="">-- Select an Industry --</option>
                                                {industryOptions.map((industry, idx) => (
                                                    <option key={idx} value={industry}>
                                                        {industry}
                                                    </option>
                                                ))}
                                            </select>
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
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer overflow-auto hide-scrollbar ${!completedSections[1] ? "opacity-50 cursor-not-allowed" : ""} ${expandedSubsection2 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                                style={{
                                    pointerEvents: !completedSections[1] ? "none" : "auto",
                                    maxHeight: '51vh'
                                }}
                            >
                                <div className={`flex items-center justify-between ${expandedSubsection2 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold">{isProduct ? "Upload or Select Product Image" : "Upload or Select Service Image"}
                                        </p>
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
                                                            {isProduct
                                                                ? "Upload a product image here or drag and drop a product image here."
                                                                : "Upload a service image here or drag and drop a service image here."}
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
                                                                        onClick={() => handleImageClick(image.imgUrl, true)}
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
                                            className="w-fit rounded-xl text-white py-3 px-6 font-medium custom-button"
                                            disabled={isNextStepDisabled}
                                            onClick={handleProductSubmission}
                                        >
                                            {!productDetails.isEdit ? "Create Product" : "Edit Product"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdProduct;
