import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoImageOutline } from "react-icons/io5";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Added Chevron Icons
import { PiFileArrowUpDuotone } from "react-icons/pi";
import axios from "axios";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const ProductDetails = ({ setShowProductDetails }) => {
    const [expandedSection, setExpandedSection] = useState(1);
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
    });
    const [imageSrc, setImageSrc] = useState(null);
    const [brands, setBrands] = useState([]);
    const [images, setImages] = useState([]);
    const currencies = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY", "CHF", "SEK", "NZD", "SGD", "HKD", "NOK", "KRW"];
    const discountOptions = ["Price", "Percentage"];
    const [completedSections, setCompletedSections] = useState({
        1: false,
        2: false,
    });

    const fetchBrands = async () => {
        const fetchedBrands = [
            { id: 1, name: "Brand A" },
            { id: 2, name: "Brand B" },
        ];
        setBrands(fetchedBrands);
        if (fetchedBrands.length === 1) {
            setProductDetails(prev => ({
                ...prev,
                brandName: fetchedBrands[0].name
            }));
        }
    };
    useState(() => fetchBrands(), []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleOnChangeProductDetails = (e) => {
        const { name, value } = e.target;
        setProductDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductDetails(prev => ({
                ...prev,
                imageFile: file,
                logoURL: URL.createObjectURL(file)
            }));
            setImageSrc(URL.createObjectURL(file));
        }
    };

    const handleDeleteImage = () => {
        setProductDetails(prev => ({ ...prev, imageFile: null, logoURL: "" }));
        setImageSrc(null);
    };

    const handleScanUrl = () => {
        console.log("Scanning URL:", productDetails.productURL);
    };

    const handleDiscountChange = (e) => {
        const discountType = e.target.value;
        setProductDetails(prevDetails => ({
            ...prevDetails,
            discount: discountType,
            customDiscount: "",
        }));
    };

    const handleSaveAndContinue = (section) => {
        const newCompletedSections = { ...completedSections };
        newCompletedSections[section] = true;
        setCompletedSections(newCompletedSections);
        setExpandedSection(section + 1); // Automatically open the next section
    };

    const handleSearchForImages = async () => {
        try {
            const response = await axios.get(`${baseUrl}/search/get-images`, {
                params: {
                    prompt: productDetails.productDescription, // Use the correct key for prompt if it differs
                    page: 1,
                    size: 10,
                },
            });
            setImages(response.data.result.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to generate images.");
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { files } = event.dataTransfer;

        if (files && files.length > 0) {
            const file = files[0];
            const newImage = {
                file,
                url: URL.createObjectURL(file),
            };

            setImages([newImage]);
            setImageSrc(newImage.url);
            setProductDetails({
                ...productDetails,
                imageFile: newImage.file,
                logoURL: "",
            });
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleImageClick = (imageUrl) => {
        setImages([]);
        setImageSrc(imageUrl);
        setProductDetails({ ...productDetails, imageFile: null, logoURL: imageUrl });
    };

    return (
        <div>
            {/* Header */}
            <span
                className="flex cursor-pointer items-center pb-2 pt-0 mt-0"
                onClick={() => setShowProductDetails(false)}
            >
                <RiArrowGoBackLine /> back
            </span>

            <section className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] flex flex-col gap-1 relative z-10`}>
                <div className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-t-[20px] p-4 relative cursor-pointer`}>
                    {completedSections[1] && (
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
                            <p className="text-[#374151] text-xs lg:text-sm">
                                Upload photos and details of your product
                            </p>
                        </span>
                    </span>
                    <div onClick={() => setExpandedSection(expandedSection === 1 ? 0 : 1)}>
                        {expandedSection === 1 ? <MdArrowDropUp /> : <MdArrowDropDown />}
                    </div>
                </div>

                {expandedSection === 1 && (
                    <div className="flex flex-col lg:flex-row p-8 w-full">
                        {/* Left Side: Image Display */}
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
                                        onClick={handleDeleteImage}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Sections */}
                        <div className="flex-grow pr-1">
                            {/* Section 1: Product Details */}
                            <div
                                onClick={() => setExpandedSubsection1(!expandedSubsection1)}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${expandedSubsection1 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                            >
                                <div className={`flex items-center justify-between ${expandedSubsection1 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold mt-0 pt-0">Product Details</p>
                                    </div>
                                    <div>
                                        {expandedSubsection1 ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                </div>
                                {expandedSubsection1 && (
                                    <div className="p-4">
                                        {/* 1st Row: Scan URL */}
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

                                        {/* 2nd Row: Product Name & Brand Name */}
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

                                        {/* 3rd Row: Product Description */}
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

                                        {/* 4th Row: Price and Discount */}
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
                                                    placeholder={`Enter Discount `}
                                                    name="customDiscount"
                                                    value={productDetails.customDiscount}
                                                    onChange={handleOnChange}
                                                    className="rounded-md py-4 pl-40 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                    autoComplete="off"
                                                />
                                                <div className="absolute top-0 left-0 flex items-center h-full ">
                                                    <select
                                                        name="discount"
                                                        value={productDetails.discount}
                                                        onChange={handleDiscountChange}
                                                        className="bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] border border-[#FCFCFC] rounded-[12px] px-5 m-2 h-[44px] focus:outline-none"
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

                                        {/* Save and Continue */}
                                        <div className="flex justify-end mt-4">
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

                            {/* Section 2: Upload Product Image and Search for Images */}
                            <div
                                onClick={() => setExpandedSubsection2(!expandedSubsection2)}
                                className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${expandedSubsection2 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}>
                                <div className={`flex items-center justify-between ${expandedSubsection2 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                    <div className="flex items-center">
                                        <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                            <IoImageOutline className="text-[#374151] text-xl" />
                                        </div>
                                        <p className="ml-3 text-lg font-semibold">Upload or Select Product Image</p>
                                    </div>
                                    <div>
                                        {expandedSubsection2 ? <FaChevronDown /> : <FaChevronRight />}
                                    </div>
                                </div>
                                {expandedSubsection2 && (
                                    <div className="p-4">
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
                                                        onChange={handleImageUpload}
                                                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        id="file-upload"
                                                    />
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="flex flex-col items-center justify-center h-full cursor-pointer"
                                                    >
                                                        <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                                                        <span className="text-gray-500 text-nowrap">
                                                            Upload a product image here
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Search for Images */}
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

                                        <div className="flex justify-end mt-4 mr-4">
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

                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProductDetails;
