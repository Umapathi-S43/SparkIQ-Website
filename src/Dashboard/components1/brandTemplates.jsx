import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import brandImage from "../../assets/dashboard_img/brand_img.png";
import templateIcon from "../../assets/dashboard_img/template.svg";
import defaultAdImage from "../../assets/dashboard_img/saved_products.svg";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import "./SavedProducts.css"; // <-- We'll include loader CSS here
import { FaPlus, FaTrash } from "react-icons/fa";

// --------------------------------------------------
// Delete Confirmation Modal
// --------------------------------------------------
const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Delete Template
                </h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this template? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// --------------------------------------------------
// Bookmark Icons
// --------------------------------------------------
const BookmarkBeforeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 -960 960 960"
        width="20"
        fill="#A8A8A8"
    >
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
    </svg>
);

const BookmarkAfterIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 -960 960 960"
        width="20"
        fill="#A8A8A8"
    >
        <path d="m389-400 91-55 91 55-24-104 80-69-105-9-42-98-42 98-105 9 80 69-24 104ZM200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
    </svg>
);

// --------------------------------------------------
// Example Image Sizes
// --------------------------------------------------
const imageSizeOptions = [
    { label: "All Sizes", value: "" },
    { label: "1080x1080", value: "1080x1080" },
    { label: "1200x628", value: "1200x628" },
    { label: "1080x1920", value: "1080x1920" },
    { label: "1080x1350", value: "1080x1350" },
    { label: "1000x1500", value: "1000x1500" },
];

const BrandTemplates = () => {
    const navigate = useNavigate();

    // ---------------------------------------
    // 1) Templates & Pagination
    // ---------------------------------------
    const [templates, setTemplates] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // ---------------------------------------
    // 2) Filter States
    // ---------------------------------------
    const [selectedBrandId, setSelectedBrandId] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [selectedImageSize, setSelectedImageSize] = useState("");

    // We'll store all brands and all products once
    const [brandOptions, setBrandOptions] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // entire product list

    // ---------------------------------------
    // 3) Local Search
    // ---------------------------------------
    const [searchQuery, setSearchQuery] = useState("");

    // ---------------------------------------
    // 4) Delete Modal
    // ---------------------------------------
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    // ---------------------------------------
    // 5) Scroll Container Ref
    // ---------------------------------------
    const listContainerRef = useRef(null);

    // ---------------------------------------
    // 6) Fetch Templates
    // ---------------------------------------
    const fetchTemplates = async (page, brandId, productId, imageSize) => {
        setLoading(true);
        try {
            let url = `${baseUrl}/v2/brand/templates?page=${page}&size=${pageSize}&sortDirection=desc`;
            if (brandId) url += `&brandId=${brandId}`;
            if (productId) url += `&productId=${productId}`;
            if (imageSize) url += `&imageSize=${imageSize}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            const pageData = response.data?.data;
            const newData = pageData?.content || [];

            if (page === 0) {
                // First page => replace
                setTemplates(newData);
            } else {
                // Next pages => append + deduplicate
                setTemplates((prev) => {
                    const combined = [...prev, ...newData];
                    const map = new Map();
                    for (const item of combined) {
                        map.set(item.templateId, item);
                    }
                    return Array.from(map.values());
                });
            }

            setPageNumber(pageData?.number ?? page);
            setHasMore(!pageData?.last);
        } catch (error) {
            console.error("Error fetching templates:", error);
            toast.error("Failed to load templates.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------
    // 7) Initial Load => all templates
    // ---------------------------------------
    useEffect(() => {
        fetchTemplates(0, "", "", "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------------------------------------
    // 8) Fetch Brands => brandOptions
    // ---------------------------------------
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get(`${baseUrl}/v2/api/brands`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setBrandOptions(response.data.data || []);
            } catch (error) {
                console.error("Error fetching brands:", error);
                toast.error("Failed to load brands.");
            }
        };
        fetchBrands();
    }, []);

    // ---------------------------------------
    // 9) Fetch All Products => store in allProducts
    // ---------------------------------------
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get(`${baseUrl}/product`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setAllProducts(response.data.data || []);
            } catch (error) {
                console.error("Error fetching product options:", error);
                toast.error("Failed to load product options.");
            }
        };
        fetchAllProducts();
    }, []);

    // ---------------------------------------
    // 10) Derive filtered product list by brand
    // ---------------------------------------
    const filteredProductOptions = selectedBrandId
        ? allProducts.filter(
            (p) => String(p.brandID) === String(selectedBrandId)
        )
        : allProducts;

    // ---------------------------------------
    // 11) handleBrandChange
    // ---------------------------------------
    const handleBrandChange = (e) => {
        const newBrandId = e.target.value;
        setSelectedBrandId(newBrandId);
        setSelectedProductId(""); // reset product
        setPageNumber(0);
        fetchTemplates(0, newBrandId, "", selectedImageSize);
    };

    // ---------------------------------------
    // 12) handleProductChange
    // ---------------------------------------
    const handleProductChange = (e) => {
        const newProductId = e.target.value;
        setSelectedProductId(newProductId);
        setPageNumber(0);
        fetchTemplates(0, selectedBrandId, newProductId, selectedImageSize);
    };

    // ---------------------------------------
    // 13) handleImageSizeChange
    // ---------------------------------------
    const handleImageSizeChange = (e) => {
        const newSize = e.target.value;
        setSelectedImageSize(newSize);
        setPageNumber(0);
        fetchTemplates(0, selectedBrandId, selectedProductId, newSize);
    };

    // ---------------------------------------
    // 14) Infinite Scroll
    // ---------------------------------------
    const handleScroll = (e) => {
        if (loading || !hasMore) return;
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            fetchTemplates(
                pageNumber + 1,
                selectedBrandId,
                selectedProductId,
                selectedImageSize
            );
        }
    };

    // ---------------------------------------
    // 15) Local Search
    // ---------------------------------------
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter the displayed templates by local search
    const finalFilteredTemplates = templates.filter((item) => {
        const text = item.templateJson?.toLowerCase() || "";
        return text.includes(searchQuery.toLowerCase());
    });

    // ---------------------------------------
    // 16) Toggle Bookmark
    // ---------------------------------------
    const handleToggleBookmark = async (item) => {
        try {
            const newFavState = !item.isFavourite;
            const payload = { ...item, isFavourite: newFavState };

            // Optimistic UI
            setTemplates((prev) =>
                prev.map((p) =>
                    p.templateId === item.templateId ? { ...p, isFavourite: newFavState } : p
                )
            );

            const response = await axios.post(`${baseUrl}/v2/brand/templates`, payload, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            if (response.data?.data?.isFavourite === newFavState) {
                toast.success(
                    newFavState ? "Bookmarked successfully!" : "Unbookmarked successfully!"
                );
            } else {
                toast.error("Failed to update bookmark on server.");
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Could not update bookmark.");
        }
    };

    // ---------------------------------------
    // 17) Edit
    // ---------------------------------------
    const handleEdit = (template) => {
        navigate("/user/template-creation", { state: { templateData: template } });
    };
    // ---------------------------------------
    // 19) Delete
    // ---------------------------------------
    const openDeleteModal = (id) => {
        setSelectedTemplateId(id);
        setIsModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setSelectedTemplateId(null);
    };
    const confirmDelete = async () => {
        try {
            await axios.delete(`${baseUrl}/v2/brand/templates/${selectedTemplateId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setTemplates((prev) =>
                prev.filter((p) => p.templateId !== selectedTemplateId)
            );
            setIsModalOpen(false);
            toast.success("template deleted successfully.");
        } catch (error) {
            console.error("Error deleting template:", error);
            toast.error("Failed to delete the template. Please try again.");
        }
    };

    const handleCreateTemplate = () => {
        navigate("/user/template-creation");
    };
    // ---------------------------------------
    // 20) Render
    // ---------------------------------------
    return (
        <div className="flex-grow overflow-y-auto hide-scrollbar">
            {/* Container */}
            <div className="max-w-6xl w-full mx-auto flex flex-col gap-3 border border-[#FCFCFC] rounded-3xl pb-4">
                {/* Header */}
                <svg width="0" height="0" style={{ position: "absolute" }}>
                    <defs>
                        <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#004367" />
                            <stop offset="100%" stopColor="#00A7FF" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-6 relative">
                    <span className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center ml-1">
                            <div className="absolute w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl"></div>
                            <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                                <img src={templateIcon} className="w-4 h-4" alt="Brand Icon" />
                            </div>
                        </div>
                        <span className="flex flex-col ml-2">
                            <h4 className="text-[#082A66] font-bold text-xl">Brand Templates</h4>
                            <p className="text-[#374151]">Easily access and manage your brand templates.</p>
                        </span>
                    </span>
                    <img
                        src={brandImage}
                        alt="Brand Banner"
                        className="absolute bottom-0 right-24 w-44 hidden lg:block"
                    />
                </div>

                {/* Filters + Search */}
                <div className="flex flex-col sm:flex-row gap-4 m-4 justify-end">
                    {/* Brand Filter */}
                    <select
                        value={selectedBrandId}
                        onChange={handleBrandChange}
                        className="rounded-md border border-slate-200 p-2 px-4 text-sm
                         max-w-[180px] overflow-auto"
                    >
                        <option value="">All Brands</option>
                        {brandOptions.map((brand) => {
                            const displayName =
                                brand.brandName.length > 15
                                    ? `${brand.brandName.slice(0, 15)}...`
                                    : brand.brandName;
                            return (
                                <option key={brand.id} value={brand.id}>
                                    {displayName}
                                </option>
                            );
                        })}
                    </select>

                    {/* Image Size Filter */}
                    <select
                        value={selectedImageSize}
                        onChange={handleImageSizeChange}
                        className="rounded-md border border-slate-200 p-2 px-4 text-sm
                         max-w-[150px] overflow-auto"
                    >
                        {imageSizeOptions.map((sizeObj) => (
                            <option key={sizeObj.value} value={sizeObj.value}>
                                {sizeObj.label}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="flex justify-center items-center mt-4">
                        <span className="load-loader"></span>
                    </div>
                )}
                <div
                    className="flex flex-wrap justify-start pb-2 gap-8 overflow-auto lg:px-10"
                    style={{ maxHeight: "50vh" }}
                >
                    {/* Loader when fetching */}


                    {/* Body (Scroll Container) */}
                    <div
                        ref={listContainerRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5 pb-1 overflow-auto hide-scrollbar"
                        style={{ maxHeight: "54vh" }}
                        onScroll={handleScroll}
                    >
                        {/* Create a Product Card */}
                        <div className="border border-[#FCFCFC] bg-[rgba(252,252,252,0.70)] rounded-2xl m-1 flex items-center justify-center p-2 lg:w-80 lg:h-80 w-72 h-72 hover:bg-[rgba(252,252,252,0.10)]">
                            <div
                                onClick={handleCreateTemplate}
                                className="relative cursor-pointer bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] rounded-xl shadow-cyan-100 shadow-2xl p-4 w-full h-full flex flex-col items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(to left bottom, rgba(92, 198, 255, 0.15), rgba(0, 160, 245, 0.3))",
                                }}
                            >
                                <div className="bg-[#00A0F5] w-8 h-8 rounded-xl flex items-center justify-center">
                                    <FaPlus className="text-white w-6 h-6 flex justify-center text-xs" />
                                </div>
                                <p className="mt-4 text-lg text-[#00a7ff]">Create a Template</p>
                                <p className="text-sm text-center mt-2">
                                    Click here to add a new template that you can use to generate assets.
                                </p>
                            </div>
                        </div>

                        {/* Cards for finalFilteredTemplates */}
                        {finalFilteredTemplates.map((item) => (
                            <div
                                key={item.templateId}
                                className="
                                    group
                                    border border-[#FCFCFC]
                                    rounded-2xl
                                    m-1
                                    bg-[rgba(252,252,252,0.25)]
                                    p-3
                                    lg:w-80 lg:h-80 
                                    md:w-80 md:h-80 
                                    w-72 h-72 
                                    flex
                                    flex-col
                                    items-center
                                    justify-between
                                    hover:transition-colors 
                                    duration-200 
                                    glass-gradient-hover 
                                    cursor-pointer
                                "
                            >
                                <div className="relative w-full h-full overflow-hidden rounded-lg">
                                    {/* Thumbnail Image */}
                                    <img
                                        src={item.url || defaultAdImage}
                                        alt="Creative Thumbnail"
                                        className="w-full h-full object-contain rounded-lg cursor-pointer"
                                        onClick={() => handleEdit(item)} // Clicking the image triggers edit action
                                    />

                                    {/* Edit & Delete Buttons (Top-Right Corner) */}
                                    <div className="absolute top-2 right-2 flex gap-2">

                                        {/* Delete Button */}
                                        <button
                                            className="bg-red-500/80 hover:bg-red-500 transition p-1 rounded-md shadow flex items-center justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteModal(item.templateId);
                                            }}
                                            title="Delete"
                                            style={{ width: "30px", height: "30px" }}
                                        >
                                            <FaTrash style={{ color: "white" }} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                    {/* Show "Loading more..." only if we have more pages to load */}
                    {/* {loading && hasMore && (
                        <div className="col-span-full flex justify-center items-center py-3">
                            <p className="text-gray-500 text-sm">Loading more...</p>
                        </div>
                    )} */}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onDelete={confirmDelete}
            />
        </div>
    );
};

export default BrandTemplates;