import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoImageOutline } from "react-icons/io5";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";
import link2 from "../../../assets/dashboard_img/linksvg1.svg";
import brandIcon from "../../../assets/dashboard_img/brand_b1.svg";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { RiDiscountPercentLine } from "react-icons/ri";

const ProductDetails = ({ setShowProductDetails }) => {
    const [expandedSection, setExpandedSection] = useState(1);
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
    const currencies = ["USD", "EUR", "GBP", "INR"];
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
                </div>

                <div className="flex flex-col lg:flex-row p-8 w-full">
                    {/* Left Side: Image Display */}
                    <div className="flex justify-center lg:justify-start mb-8 lg:mb-0 lg:mr-8">
                        <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white rounded-3xl flex items-center justify-center">
                            <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-[21rem] md:h-[20rem] bg-[#859398] rounded-3xl flex items-center justify-center">
                                <div className="absolute w-36 h-28 sm:w-48 sm:h-40 bg-[rgba(255,255,255,0.24)] rounded-2xl flex items-center justify-center border border-red-500">
                                    {imageSrc ? (
                                        <img src={imageSrc} alt="Product" className="w-32 h-24 sm:w-36 sm:h-28 object-cover rounded-xl" />
                                    ) : (
                                        <IoImageOutline className="text-gray-400 text-6xl" />
                                    )}
                                </div>
                            </div>
                            {imageSrc && (
                                <button
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
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
                            onClick={() => setExpandedSection(1)}
                            className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${expandedSection === 1 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                        >
                            <div className={`flex items-center justify-between ${expandedSection === 1 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                <div className="flex items-center">
                                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                        <IoImageOutline className="text-[#374151] text-xl" />
                                    </div>
                                    <p className="ml-3 text-xl font-bold mt-0 pt-0">Product Details</p>
                                </div>
                                <div>
                                    {expandedSection === 1 ? (
                                        <MdArrowDropUp />
                                    ) : (
                                        <MdArrowDropDown />
                                    )}
                                </div>
                            </div>
                            {expandedSection === 1 && (
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
                                            className=" w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                        />
                                        <select
                                            className=" w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                            name="brandName"
                                            value={productDetails.brandName}
                                            onChange={handleOnChange}
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
                                                placeholder="Enter Product Price"
                                                name="productPrice"
                                                value={productDetails.productPrice}
                                                onChange={handleOnChange}
                                                className="rounded-lg py-3 pl-20 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                autoComplete="off"
                                            />
                                            <div className="absolute top-4 left-4 flex items-center">
                                                <select
                                                    name="currency"
                                                    value={productDetails.currency}
                                                    onChange={handleOnChange}
                                                    className="appearance-none bg-transparent pl-4 pr-4 border-none focus:outline-none"
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
                                                placeholder={`Enter Discount in ${productDetails.discount}`}
                                                name="customDiscount"
                                                value={productDetails.customDiscount}
                                                onChange={handleOnChange}
                                                className="rounded-lg py-3 pl-32 pr-4 shadow-md w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                                                autoComplete="off"
                                            />
                                            <div className="absolute top-4 left-4 flex items-center">
                                                <select
                                                    name="discount"
                                                    value={productDetails.discount}
                                                    onChange={handleDiscountChange}
                                                    className="appearance-none bg-transparent pl-4 pr-4 border-none focus:outline-none"
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
                            onClick={() => setExpandedSection(2)}
                            className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${expandedSection === 2 ? "bg-[rgba(252,252,252,0.25)]" : ""}`}
                        >
                            <div className={`flex items-center justify-between ${expandedSection === 2 ? "bg-[#F6F8FE]" : ""} p-4 rounded-t-2xl`}>
                                <div className="flex items-center">
                                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                                        <IoImageOutline className="text-[#374151] text-xl" />
                                    </div>
                                    <p className="ml-3">Upload Product Image</p>
                                </div>
                                <div>
                                    {expandedSection === 2 ? (
                                        <MdArrowDropUp />
                                    ) : (
                                        <MdArrowDropDown />
                                    )}
                                </div>
                            </div>
                            {expandedSection === 2 && (
                                <div className="p-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full p-2 mb-2"
                                    />
                                    <div className="flex justify-end mt-4">
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
            </section>
        </div>
    );
};

export default ProductDetails;
