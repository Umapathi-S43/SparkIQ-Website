import { useState, useEffect } from "react";
import {
    FaTrash,
    FaChevronRight,
    FaChevronDown,
    FaCheck,
} from "react-icons/fa";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoImageOutline } from "react-icons/io5";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import axios from "axios";
import toast from "react-hot-toast";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { baseUrl } from "../../utils/Constant";
import { useLocation } from "react-router-dom";
import { jwtToken } from "../../utils/jwtToken";
import { FaCartShopping } from "react-icons/fa6";
import { FcServices } from "react-icons/fc";

const currencies = [
    "USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY",
    "CHF", "SEK", "NZD", "SGD", "HKD", "NOK", "KRW"
];

const discountOptions = ["Price", "Percentage"];
const industryOptions = ["E-com", "Automotive", "Marketing", "B2B Consultant", "Other"];

export default function ProductDetails({
    handleBack,
    setIsNextSectionOpen,
    isCompleted,
    setIsCompleted,
    setShowProductDetails,
}) {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedSubsection0, setExpandedSubsection0] = useState(true);
    const [expandedSubsection1, setExpandedSubsection1] = useState(false);
    const [expandedSubsection2, setExpandedSubsection2] = useState(false);

    const [completedSections, setCompletedSections] = useState({
        0: false,
        1: false,
        2: false,
    });

    const [isProduct, setIsProduct] = useState(true);

    // Include postType in your state if you want to store it from localStorage or props.
    // Example: "Adcreative" or "SocialMediaPost"
    const [postType, setPostType] = useState("");

    const [productDetails, setProductDetails] = useState({
        productName: "",
        productDescription: "",
        type: "",
        industryName: "",
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

    // Single "preview" image in the large placeholder
    const [imageSrc, setImageSrc] = useState(null);

    // Multiple images: each { file, url, uploaded }
    const [images, setImages] = useState([]);

    // AI-generated images
    const [generatedImages, setGeneratedImages] = useState([]);

    // Brand list
    const [brands, setBrands] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    // For edit detection
    const location = useLocation();

    // If you saved both productID and postType in localStorage:
    const storedProductID = JSON.parse(localStorage.getItem("productID")) || null;
    const storedPostType = localStorage.getItem("postType") || "";

    // 1) Fetch brand list
    useEffect(() => {
        async function fetchBrands() {
            try {
                if (!jwtToken) {
                    throw new Error("No JWT token found. Please log in.");
                }
                const resp = await axios.get(`${baseUrl}/v2/api/brands`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                const fetched = resp.data?.data || [];
                setBrands(fetched);

                if (fetched.length === 1) {
                    setProductDetails((prev) => ({
                        ...prev,
                        brandID: fetched[0].id,
                        brandName: fetched[0].brandName,
                    }));
                }
            } catch (err) {
                console.error("Error fetching brands:", err);
                toast.error("Failed to fetch brands.");
            }
        }
        fetchBrands();
    }, []);

    // 2) If we have storedPostType, set it in state
    useEffect(() => {
        if (storedPostType) {
            setPostType(storedPostType);
        }
    }, [storedPostType]);

    // 3) If editing an existing product
    useEffect(() => {
        const fetchProduct = async (id) => {
            try {
                if (!jwtToken) {
                    throw new Error("No JWT token found. Please log in.");
                }
                const response = await axios.get(`${baseUrl}/product/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                const foundProduct = response.data.data;
                if (foundProduct) {
                    setProductDetails({
                        productName: foundProduct.name || "",
                        productDescription: foundProduct.description || "",
                        productURL: foundProduct.productURL || "",
                        type: foundProduct.type || "",
                        industryName: foundProduct.industryName || "",
                        brandID: foundProduct.brandID || "",
                        logoURL: foundProduct.productImagesList?.[0]?.imageURL || "",
                        discount: foundProduct.discountType || "Percentage",
                        customDiscount: foundProduct.discount || "",
                        productPrice: foundProduct.price || "",
                        currency: foundProduct.priceType || "INR",
                        isEdit: true,
                    });

                    // If product type is "service"
                    if (foundProduct.type?.toLowerCase() === "service") {
                        setIsProduct(false);
                    } else {
                        setIsProduct(true);
                    }

                    const existing = (foundProduct.productImagesList || []).map((img) => ({
                        file: null,
                        url: img.imageURL,
                        uploaded: true,
                    }));
                    setImages(existing);
                    if (existing[0]) {
                        setImageSrc(existing[0].url);
                    }
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error("Failed to fetch product details");
            }
        };

        if (storedProductID) {
            fetchProduct(storedProductID);
        }
    }, [storedProductID]);

    // Switch between product & service
    const handleToggleType = (val) => {
        if (val === "Product") {
            setIsProduct(true);
            setProductDetails((prev) => ({ ...prev, type: "product" }));
        } else {
            setIsProduct(false);
            setProductDetails((prev) => ({ ...prev, type: "service" }));
        }
    };

    // Basic input changes
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        if (name === "brandName") {
            const found = brands.find((b) => b.brandName === value);
            setProductDetails((prev) => ({
                ...prev,
                brandName: value,
                brandID: found ? found.id : "",
            }));
        } else {
            setProductDetails((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Price / discount logic
    const handleOnChangeProductDetails = (e) => {
        const { id, value } = e.target;
        if (id === "customDiscount") {
            const discountVal = parseFloat(value);
            const productPriceVal = parseFloat(productDetails.productPrice);

            if (productDetails.discount === "Percentage") {
                if (value === "" || (discountVal >= 0 && discountVal <= 100)) {
                    setProductDetails({ ...productDetails, customDiscount: value });
                }
            } else if (productDetails.discount === "Price") {
                if (
                    value === "" ||
                    (!isNaN(discountVal) && discountVal <= productPriceVal)
                ) {
                    setProductDetails({ ...productDetails, customDiscount: value });
                }
            }
        } else {
            setProductDetails({ ...productDetails, [id]: value });
        }
    };

    //  MULTI-IMAGE LOGIC
    const handleFileChange = async (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        const newFileObj = { file, url: localUrl, uploaded: false };
        setImages((prev) => [...prev, newFileObj]);
        setImageSrc(localUrl);

        try {
            const s3Url = await uploadImage(file);
            setImages((prev) =>
                prev.map((img) => {
                    if (img.url === localUrl) {
                        return { ...img, url: s3Url, file: null, uploaded: true };
                    }
                    return img;
                })
            );
            if (imageSrc === localUrl) {
                setImageSrc(s3Url);
            }
            toast.success("Image uploaded successfully");
        } catch (err) {
            console.error("Error uploading image:", err);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const file = e.dataTransfer.files[0];
            if (!file) return;

            const localUrl = URL.createObjectURL(file);
            const newFileObj = { file, url: localUrl, uploaded: false };
            setImages((prev) => [...prev, newFileObj]);
            setImageSrc(localUrl);

            toast.success("Image uploaded successfully");
            try {
                const s3Url = await uploadImage(file);
                setImages((prev) =>
                    prev.map((img) => {
                        if (img.url === localUrl) {
                            return { ...img, url: s3Url, file: null, uploaded: true };
                        }
                        return img;
                    })
                );
                if (imageSrc === localUrl) {
                    setImageSrc(s3Url);
                }
            } catch (err) {
                console.error("Error uploading image:", err);
            }
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    // Deleting one image from array
    const handleDeleteImage = (index) => {
        if (index < 0 || index >= images.length) return;
        const removed = images[index];
        const newArr = images.filter((_, i) => i !== index);

        if (imageSrc === removed.url) {
            if (newArr.length > 0) {
                let nextIndex = index;
                if (nextIndex >= newArr.length) {
                    nextIndex = newArr.length - 1;
                }
                setImageSrc(newArr[nextIndex].url);
            } else {
                setImageSrc(null);
            }
        }
        setImages(newArr);
    };

    // Searching AI images
    const handleSearchForImages = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/search/get-images`, {
                params: {
                    prompt: productDetails.prompt,
                    page: currentPage,
                    size: 10,
                },
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setGeneratedImages(resp.data.result.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate images.");
        }
    };

    const handlePageChange = async (page) => {
        setCurrentPage(page);
        try {
            const resp = await axios.get(`${baseUrl}/search/get-images`, {
                params: {
                    prompt: productDetails.prompt,
                    page,
                    size: 10,
                },
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setGeneratedImages(resp.data.result.data);
        } catch (err) {
            console.error("Failed to generate images next page", err);
            toast.error("Failed to generate images.");
        }
    };

    // user clicks on a generated image
    const handleImageClick = (imageUrl) => {
        setImages((prev) => {
            const exists = prev.some((img) => img.url === imageUrl);
            if (!exists) {
                return [...prev, { file: null, url: imageUrl, uploaded: true }];
            }
            return prev;
        });
        setImageSrc(imageUrl);
    };

    // Actual S3 upload
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const resp = await axios.post(
            `${baseUrl}/sparkiq/image/upload?customerId=123`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwtToken}`,
                },
            }
        );
        if (resp.status !== 201) {
            toast.error("Failed to upload image");
            throw new Error("Upload failed");
        }
        return resp.data.data.url;
    };

    // scanning product url
    const handleScanUrl = async () => {
        try {
            if (!jwtToken) {
                throw new Error("No JWT token found. Please log in.");
            }
            const resp = await axios.get(
                `${baseUrl}/scrap/product?url=${encodeURIComponent(productDetails.productURL)}`,
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );
            if (resp.status === 200) {
                toast.success("Scan successful");
                setProductDetails((prev) => ({
                    ...prev,
                    productName: resp.data.productTitle || prev.productName,
                    productDescription: resp.data.productDesc || prev.productDescription,
                }));
            } else {
                toast.error("Scan failed. Please try again.");
            }
        } catch (err) {
            console.log("Error scanning URL:", err);
            toast.error("Failed to scan the URL.");
        }
    };

    // final submit
    const handleProductSubmission = async (e) => {
        e.preventDefault();
     
        const floatPrice = parseFloat(productDetails.productPrice) || 0;
        const floatDiscount = parseFloat(productDetails.customDiscount) || 0;
     
        try {
      // Reuse your stored ID so `isEditMode` will work:
       const productID = storedProductID;  // or pass it as a prop, etc.
          const isEditMode = productDetails.isEdit && productID;
     
          const productImagesList = images.map((img) => ({
            imageURL: img.url,
          }));
     
          const productPayload = {
            id: isEditMode ? productID : undefined,
            brandID: productDetails.brandID,
            name: productDetails.productName,
            type: productDetails.type,
            industryName: productDetails.industryName,
            description: productDetails.productDescription,
            productURL: productDetails.productURL,
            price: floatPrice,
            priceType: productDetails.currency,
            discount: floatDiscount,
            discountType: productDetails.discount,
            productImagesList,
            // Optionally: postType: postType,
          };
     
          console.log("Submitting productPayload:", productPayload);
     
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
          setIsOpen(false);
        } catch (err) {
          console.error("Error during product submission:", err);
          toast.error("Failed to submit product");
        }
      };
     

    // partial validation
    const handleSaveAndContinue = (section) => {
        if (section === 0) {
            if (!productDetails.productURL) {
                toast.error("Please enter a URL before proceeding.");
                return;
            }
        } else if (section === 1) {
            if (
                !productDetails.productName ||
                !productDetails.productDescription ||
                !productDetails.brandName ||
                !productDetails.industryName
            ) {
                toast.error("Please fill in all the required fields correctly.");
                return;
            }
        } else if (section === 2) {
            if (images.length === 0) {
                toast.error("Please upload or select at least one image.");
                return;
            }
        }
        const newCompleted = { ...completedSections };
        newCompleted[section] = true;
        setCompletedSections(newCompleted);

        if (section === 0) {
            setExpandedSubsection0(false);
            setExpandedSubsection1(true);
        } else if (section === 1) {
            setExpandedSubsection1(false);
            setExpandedSubsection2(true);
        } else if (section === 2) {
            setExpandedSubsection2(false);
        }
    };

    const handleIndustrySelect = (e) => {
        setProductDetails((prev) => ({ ...prev, industryName: e.target.value }));
    };

    // Toggling entire accordion
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const toggleAccordionSection0 = (e) => {
        if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "IMG"].includes(e.target.tagName)) {
            return;
        }
        setExpandedSubsection0(!expandedSubsection0);
    };

    const toggleAccordionSection1 = (e) => {
        if (!completedSections[0]) {
            toast.error("Please complete Basic Information before proceeding.");
            return;
        }
        if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "IMG"].includes(e.target.tagName)) {
            return;
        }
        setExpandedSubsection1(!expandedSubsection1);
    };

    const toggleAccordionSection2 = (e) => {
        if (!completedSections[1]) {
            toast.error("Please complete the Product Details before proceeding.");
            return;
        }
        if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "IMG"].includes(e.target.tagName)) {
            return;
        }
        setExpandedSubsection2(!expandedSubsection2);
    };

    const isNextStepDisabled =
        !productDetails.productName ||
        !productDetails.productDescription ||
        !productDetails.brandName ||
        !productDetails.industryName ||
        images.length === 0; // must have at least 1 image

    return (
        <div>
            {/* Back button */}
            <span
                className="flex cursor-pointer items-center pb-2 pt-0 mt-0"
                onClick={() => setShowProductDetails(false)}
            >
                <span onClick={handleBack}>
                    <RiArrowGoBackLine /> back
                </span>
            </span>

            <section
                className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] flex flex-col gap-1 relative z-10 ${isOpen ? "p-0" : "p-3"
                    }`}
            >
                <div
                    className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] ${isOpen ? "rounded-t-[20px] p-4" : "rounded-[20px] p-2"
                        } relative cursor-pointer`}
                    onClick={toggleAccordion}
                >
                    {completedSections[2] && (
                        <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
                            Completed <FaCheck size={20} />
                        </span>
                    )}

                    <span className="flex items-center gap-4">
                        <img src="/icon2.svg" alt="icon" />
                        <span className="flex flex-col">
                            <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                                {productDetails.isEdit ? "Edit Product Details" : "Add Product Details"}
                            </h4>
                            <p className="text-[#374151] text-xs lg:text-sm">
                                Upload photos and details of your {postType || "product"}
                            </p>
                        </span>
                    </span>

                    <div className="flex items-center gap-6 overflow-auto">
                        {productDetails.isEdit && (
                            <div className="flex items-center gap-2">
                                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                                    <p className="text-[#1E1154] font-medium">Edit {postType || "Product"}</p>
                                </div>
                                <div className="bg-transparent rounded-[20px] px-4 py-[10px] shadow">
                                    <p className="text-[#1E1154] font-medium">
                                        {productDetails.productName}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="flex flex-col lg:flex-row p-8 w-full overflow-auto hide-scrollbar">
                        {/* LEFT: large image preview */}
                        <div className="flex justify-center lg:justify-start mb-8 lg:mb-0 lg:mr-8">
                            <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-r from-[#F0F4F8] via-[#D9E9F2] to-[#F0F4F8] rounded-3xl flex items-center justify-center shadow-2xl transition-transform transform hover:scale-105 hover:rotate-2 duration-300">
                                <div className="absolute w-[85%] h-[85%] bg-white rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt="Product"
                                            className="object-cover rounded-2xl w-full h-full transition-opacity duration-300"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <IoImageOutline className="text-gray-300 text-6xl mb-4" />
                                            <p className="text-gray-500 font-semibold">
                                                Drag & Drop or Select an Image
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* If there's a selected image, show a delete button */}
                                {imageSrc && (
                                    <button
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition duration-200 transform hover:scale-110"
                                        onClick={() => {
                                            const idx = images.findIndex((im) => im.url === imageSrc);
                                            handleDeleteImage(idx);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Subsections */}
                        <div className="flex-grow pr-1">
                            {/* SECTION 0: Basic Information */}
                            <div
                                onClick={toggleAccordionSection0}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${expandedSubsection0 ? "bg-[rgba(252,252,252,0.25)]" : ""
                                    }`}
                            >
                                <div
                                    className={`flex items-center justify-between ${expandedSubsection0 ? "bg-[#F6F8FE]" : ""
                                        } p-4 rounded-t-2xl`}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold mt-0 pt-0">
                                            Basic Information
                                        </p>
                                    </div>
                                    {completedSections[0] && (
                                        <div className="flex items-end rounded-xl shadow-xl bg-white border-2 p-1 px-6">
                                            <p className="m-0 text-sm sm:text-base md:text-lg">
                                                {isProduct ? "Product" : "Service"}
                                            </p>
                                        </div>
                                    )}
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
                                                className={`w-1/4 p-3 py-5 rounded-lg shadow-xl border-2 ${isProduct
                                                        ? "bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-blue-500"
                                                        : "bg-gray-200 border-gray-400"
                                                    } font-medium flex items-center justify-center gap-2`}
                                                onClick={() => handleToggleType("Product")}
                                            >
                                                <FaCartShopping className="text-xl" /> Product
                                            </button>
                                            <button
                                                className={`w-1/4 p-3 py-5 rounded-lg shadow-xl border-2 ${!isProduct
                                                        ? "bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border-blue-500"
                                                        : "bg-gray-200 border-gray-400"
                                                    } font-medium flex items-center justify-center gap-2`}
                                                onClick={() => handleToggleType("Service")}
                                            >
                                                <FcServices className="text-xl" /> Service
                                            </button>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
                                            <input
                                                type="text"
                                                placeholder={`Your landing page for ${isProduct ? "Product" : "Service"
                                                    } (e.g., spark.ai)`}
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

                            {/* SECTION 1: Product Details */}
                            <div
                                onClick={toggleAccordionSection1}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${!completedSections[0] ? "opacity-50 cursor-not-allowed" : ""
                                    } ${expandedSubsection1 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                                style={{
                                    pointerEvents: !completedSections[0] ? "none" : "auto",
                                }}
                            >
                                <div
                                    className={`flex items-center justify-between ${expandedSubsection1 ? "bg-[#F6F8FE]" : ""
                                        } p-4 rounded-t-2xl`}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold mt-0 pt-0">
                                            {isProduct ? "Product Details" : "Service Details"}
                                        </p>
                                    </div>

                                    {completedSections[1] && (
                                        <div className="flex items-end rounded-xl shadow-xl bg-white border-2 p-1 px-6">
                                            <p className="m-0 text-sm sm:text-base md:text-lg">
                                                {productDetails.productName}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        {expandedSubsection1 ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                </div>

                                {expandedSubsection1 && (
                                    <div className="p-4">
                                        {/* Name + Brand */}
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
                                                    backgroundColor: "#D9E9F2",
                                                    backgroundSize: "auto",
                                                }}
                                            >
                                                <option value="">Select Brand Name</option>
                                                {brands.map((b) => (
                                                    <option key={b.id} value={b.brandName}>
                                                        {b.brandName}
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
                                                            backgroundColor: "#D9E9F2",
                                                            backgroundSize: "auto",
                                                        }}
                                                    >
                                                        {currencies.map((cur, idx) => (
                                                            <option key={idx} value={cur}>
                                                                {cur}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="relative w-full md:w-1/2">
                                                <input
                                                    type="number"
                                                    placeholder={`Enter Discount in ${productDetails.discount || "Percentage"}`}
                                                    id="customDiscount"
                                                    min="0"
                                                    max={productDetails.discount === "Percentage" ? "100" : undefined}
                                                    value={productDetails.customDiscount || ""}
                                                    onChange={handleOnChangeProductDetails}
                                                    className="rounded-lg py-4 pl-44 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                    autoComplete="off"
                                                />
                                                <div className="absolute top-0 left-0 flex items-center h-full">
                                                    <select
                                                        id="discount"
                                                        onChange={(e) =>
                                                            setProductDetails({
                                                                ...productDetails,
                                                                discount: e.target.value,
                                                                customDiscount: "",
                                                            })
                                                        }
                                                        value={productDetails.discount}
                                                        className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC] rounded-[12px] px-6 m-2 h-[44px] focus:outline-none"
                                                        style={{
                                                            backgroundRepeat: "no-repeat",
                                                            backgroundColor: "#D9E9F2",
                                                            backgroundSize: "auto",
                                                        }}
                                                    >
                                                        {discountOptions.map((opt, idx) => (
                                                            <option key={idx} value={opt}>
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

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
                                                {industryOptions.map((ind, idx) => (
                                                    <option key={idx} value={ind}>
                                                        {ind}
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

                            {/* SECTION 2: MULTI-IMAGE */}
                            <div
                                onClick={toggleAccordionSection2}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer overflow-auto hide-scrollbar ${!completedSections[1] ? "opacity-50 cursor-not-allowed" : ""
                                    } ${expandedSubsection2 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                                style={{
                                    pointerEvents: !completedSections[1] ? "none" : "auto",
                                    maxHeight: "51vh",
                                }}
                            >
                                <div
                                    className={`flex items-center justify-between ${expandedSubsection2 ? "bg-[#F6F8FE]" : ""
                                        } p-4 rounded-t-2xl`}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold">
                                            {isProduct
                                                ? "Upload or Select Product Image"
                                                : "Upload or Select Service Image"}
                                        </p>
                                    </div>
                                    {completedSections[2] && images[0] && (
                                        <div className="flex items-center ml-auto bg-white rounded-lg p-1">
                                            <img
                                                src={images[0].url}
                                                alt="Product"
                                                className="w-12 h-7 object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                    <div className="ml-4">
                                        {expandedSubsection2 ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                </div>

                                {expandedSubsection2 && (
                                    <div className="p-4 hide-scrollbar">
                                        {/* FILE UPLOAD */}
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
                                                                ? "Upload a product image or drag & drop here."
                                                                : "Upload a service image or drag & drop here."}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <img src="/orIcon.svg" alt="" />
                                        </div>

                                        {/* PROMPT / SEARCH IMAGES */}
                                        <div className="flex flex-col md:flex-row p-2">
                                            <div className="bg-[#FCFCFC40] shadow-md rounded-md border border-[#FCFCFC] flex flex-col gap-[18px] w-full p-2">
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

                                        {/* SEARCH RESULTS */}
                                        <div className="flex-row">
                                            {generatedImages.length > 0 && (
                                                <div>
                                                    <div className="relative w-full overflow-x-scroll border border-[#FCFCFC] p-1 rounded-md">
                                                        <div className="flex space-x-4">
                                                            {generatedImages.map((imageObj, idx) => {
                                                                const isSelected = images.some(
                                                                    (u) => u.url === imageObj.imgUrl
                                                                );
                                                                return (
                                                                    <div
                                                                        key={idx}
                                                                        className="relative flex-shrink-0 border rounded-lg"
                                                                    >
                                                                        <img
                                                                            src={imageObj.imgUrl}
                                                                            alt={imageObj.description}
                                                                            className="w-40 h-40 object-cover rounded-lg shadow-lg cursor-pointer"
                                                                            onClick={() => handleImageClick(imageObj.imgUrl)}
                                                                        />
                                                                        {isSelected && (
                                                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                                                                                <FaCheck className="text-white text-sm" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
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

                                        {/* SELECTED IMAGES LIST */}
                                        {images.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="mb-2">Selected Images:</h3>
                                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                                    {images.map((img, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="relative border rounded-lg overflow-hidden"
                                                        >
                                                            <img
                                                                src={img.url}
                                                                alt="Selected"
                                                                className="h-24 w-full object-cover"
                                                            />
                                                            <button
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition duration-200"
                                                                onClick={() => handleDeleteImage(idx)}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-start mt-4">
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

                            {/* Final "Create/Edit Product" button */}
                            <div className="flex justify-start items-center">
                                {completedSections[1] && completedSections[2] && (
                                    <div className="flex justify-start p-4 pl-2">
                                        <button
                                            className="w-fit rounded-xl text-white py-3 px-10 font-medium custom-button"
                                            disabled={isNextStepDisabled}
                                            onClick={handleProductSubmission}
                                        >
                                            {!productDetails.isEdit
                                                ? "Next Step"
                                                : `Edit ${postType || "Product"}`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
