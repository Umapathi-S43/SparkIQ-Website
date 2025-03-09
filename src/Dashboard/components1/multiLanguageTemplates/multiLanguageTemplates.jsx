import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { HiLanguage } from "react-icons/hi2";
import axios from "axios";
import brandImage from "../../../assets/dashboard_img/brand_img.png"; // Adjust path if needed
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

const MultiLanguageTemplates = () => {
    // -----------------------------------
    //        State / Hooks
    // -----------------------------------
    // Brand templates (instead of products)
    const [brandTemplates, setBrandTemplates] = useState([]);

    const [brands, setBrands] = useState([]);

    // For filtering by brand, searching by brand template name, etc.
    const [selectedBrand, setSelectedBrand] = useState("AllBrands");
    const [searchQuery, setSearchQuery] = useState("");

    // For error messages, if any
    const [error, setError] = useState("");

    // The list of *all possible* languages from GET /v2/languages
    const [languageOptions, setLanguageOptions] = useState([]);

    // We'll store brand-languages in a map: languageId -> brandLangRowId
    const [brandLangMap, setBrandLangMap] = useState({});
    const [selectedLanguageIds, setSelectedLanguageIds] = useState([]);

    // For the Languages Modal
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    // Temporary list of selected language IDs while the modal is open
    const [tempSelectedLanguageIds, setTempSelectedLanguageIds] = useState([]);

    // ADD: For searching languages in the modal
    const [languageSearchQuery, setLanguageSearchQuery] = useState("");

    const navigate = useNavigate();

    // -----------------------------------
    //        API Calls
    // -----------------------------------

    // 1) Fetch brand templates (instead of products)
    const fetchBrandTemplates = async () => {
        try {
            if (!jwtToken) {
                throw new Error("No JWT token found. Please log in.");
            }
            // Example GET to fetch brand templates
            // Adjust if you have a different route or method
            const response = await axios.get(`${baseUrl}/v2/brand/templates`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            // Suppose response.data.data is an array of templates
            setBrandTemplates(response.data.data.content || []);
            console.log(response.data.data.content || []);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch brand templates.");
        }
    };

    // 2) Fetch all brands (if you need brand-based filtering)
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
            setBrands(response.data.data);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch brands.");
        }
    };

    // 3) Fetch the entire list of *available* languages
    const fetchAllLanguages = async () => {
        try {
            if (!jwtToken) {
                throw new Error("No JWT token found. Please log in.");
            }
            const response = await axios.get(`${baseUrl}/v2/languages`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setLanguageOptions(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch available languages", error);
        }
    };

    // 4) Fetch brand-languages
    //   GET /api/brand/languages => returns array of objects like:
    //   {
    //     "id": "sibt-ac4a4622-a",
    //     "languages": { "id": "30", "name": "Greek", "code": "el" },
    //     ...
    //   }
    // We build brandLangMap: { "30": "sibt-ac4a4622-a" } => languageId : brandLangRowId
    const fetchBrandLanguages = async () => {
        try {
            if (!jwtToken) {
                throw new Error("No JWT token found. Please log in.");
            }
            const response = await axios.get(`${baseUrl}/api/brand/languages`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            const brandLangData = response.data?.data || [];
            const newMap = {};
            for (const item of brandLangData) {
                const langId = item.languages?.id;
                if (langId) {
                    newMap[langId] = item.id; // brand-languages row ID
                }
            }
            setBrandLangMap(newMap);
            setSelectedLanguageIds(Object.keys(newMap)); // the IDs as strings
        } catch (error) {
            console.error("Failed to fetch brand-languages", error);
        }
    };

    // POST /api/brand/languages to add a new language
    const postBrandLanguage = async (langObj) => {
        try {
            await axios.post(
                `${baseUrl}/api/brand/languages`,
                { languages: langObj },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
        } catch (error) {
            console.error("Failed to POST brand language", error);
        }
    };

    // DELETE /api/brand/languages/<brandLangId>
    const deleteBrandLanguage = async (brandLangId) => {
        try {
            await axios.delete(`${baseUrl}/api/brand/languages/${brandLangId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
        } catch (error) {
            console.error("Failed to DELETE brand language", error);
        }
    };

    // -----------------------------------
    //        useEffect
    // -----------------------------------
    useEffect(() => {
        fetchBrandTemplates();
        fetchBrands();
        fetchAllLanguages();
        fetchBrandLanguages();
    }, []);

    // -----------------------------------
    //        Handlers
    // -----------------------------------
    // Called when user wants to create a new template
    const handleCreateTemplate = () => {
        navigate("/user/template-creation");
    };

    // Called when user wants to edit an existing template
    // we pass the template as state to the template-creation route
    const handleEdit = (template) => {
        navigate("/user/template-creation", { state: { templateData: template } });
    };

    const handleGenerate = (template) => {
        navigate("/user/polyglot-creatives", { state: { templateData: template } });
    };
    
    // Called to download the brand template image
    const handleDownloadClick = (imageUrl) => {
        if (!imageUrl) return;
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "downloaded_image.jpg"; // or dynamic name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // For searching brand templates (by name, etc.)
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // For filtering brand templates by brand
    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value);
    };

    // Filter brandTemplates by brand and search
    const filteredTemplates = brandTemplates?.filter((template) => {
        const lowerSearch = searchQuery.toLowerCase();

        // If you want to search by templateId or tag or both:
        const matchesSearchQuery =
            (template.templateId &&
                template.templateId.toLowerCase().includes(lowerSearch)) ||
            (template.tag && template.tag.toLowerCase().includes(lowerSearch));

        // Compare selectedBrand to template.brandId
        const matchesBrand =
            selectedBrand === "AllBrands" || template.brandId === selectedBrand;

        return matchesSearchQuery && matchesBrand;
    });

    // -----------------------------------
    //   Language Modal: Open / Close
    // -----------------------------------
    const handleLanguageSettings = async () => {
        // Re-fetch brand-languages in case it was updated externally
        await fetchBrandLanguages();
        // Copy the existing language IDs (keys of brandLangMap) to temp
        setTempSelectedLanguageIds(Object.keys(brandLangMap));
        setIsLanguageModalOpen(true);
    };

    const handleCancelLanguageModal = () => {
        setTempSelectedLanguageIds(Object.keys(brandLangMap));
        setIsLanguageModalOpen(false);
    };

    /**
     * On "Apply":
     * Compare brandLangMap vs. tempSelectedLanguageIds
     * - If a language is in brandLangMap but not in temp => DELETE
     * - If a language is in temp but not brandLangMap => POST
     */
    const handleApplyLanguageModal = async () => {
        const oldIds = Object.keys(brandLangMap);
        const newIds = tempSelectedLanguageIds;

        // 1) Deletions
        for (const oldId of oldIds) {
            if (!newIds.includes(oldId)) {
                const brandLangId = brandLangMap[oldId];
                if (brandLangId) {
                    await deleteBrandLanguage(brandLangId);
                }
            }
        }

        // 2) Additions
        for (const newId of newIds) {
            if (!oldIds.includes(newId)) {
                // This language is newly checked => POST
                const foundLang = languageOptions.find((l) => l.id === newId);
                if (foundLang) {
                    await postBrandLanguage(foundLang);
                }
            }
        }

        // Re-fetch brand-languages to refresh brandLangMap
        await fetchBrandLanguages();

        setIsLanguageModalOpen(false);
    };

    // Toggle a language ID in tempSelectedLanguageIds
    const toggleLanguageSelection = (langId) => {
        setTempSelectedLanguageIds((prev) =>
            prev.includes(langId)
                ? prev.filter((id) => id !== langId)
                : [...prev, langId]
        );
    };

    // A handler for searching languages in the modal
    const handleLanguageSearchChange = (e) => {
        setLanguageSearchQuery(e.target.value);
    };

    // Filter languageOptions by `languageSearchQuery`
    const filteredLanguageOptions = languageOptions.filter((lang) => {
        const lowerSearch = languageSearchQuery.toLowerCase();
        return (
            lang.name.toLowerCase().includes(lowerSearch) ||
            (lang.code || "").toLowerCase().includes(lowerSearch)
        );
    });

    // -----------------------------------
    //        Icons
    // -----------------------------------
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

    // (Kept if needed)
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

    // -----------------------------------
    //        JSX
    // -----------------------------------
    return (
        <div
            className="flex-grow overflow-y-auto hide-scrollbar"
            style={{ maxHeight: "90vh" }}
        >
            <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 border border-[#FCFCFC] rounded-3xl pb-4">
                <svg width="0" height="0" style={{ position: "absolute" }}>
                    <defs>
                        <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#004367" />
                            <stop offset="100%" stopColor="#00A7FF" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Header */}
                <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-7 relative">
                    <span className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center ml-1">
                            <div className="absolute w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl"></div>
                            <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                                <HiLanguage className="text-white w-8 h-6" />
                            </div>
                        </div>
                        <span className="flex flex-col ml-2">
                            <h4 className="text-[#082A66] font-bold text-xl">
                                Polyglot Templates
                            </h4>
                            <p className="text-[#374151]">
                                Explore existing multi-language templates or add new ones
                                effortlessly.
                            </p>
                        </span>
                    </span>
                    <img
                        src={brandImage}
                        alt="Brand Banner"
                        className="absolute bottom-0 right-24 w-44 hidden lg:block"
                    />
                </div>

                {/* Search & Filter (for brand templates) */}
                <div className="flex justify-end w-full px-5 gap-4">
                    {/* Search input */}
                    {/* <div className="flex items-end justify-end bg-white rounded-xl mr-2">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search Templates"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                            />
                            <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div> */}

                    {/* Brand filter (optional) */}
                    <div className="flex items-center justify-start rounded-xl">
                        <select
                            value={selectedBrand}
                            onChange={handleBrandChange}
                            className="w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="AllBrands">All Brands</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Cards Section (brand templates) */}
                <div
                    className="flex flex-wrap justify-start pb-2 w-full gap-8 overflow-auto lg:px-10"
                    style={{ maxHeight: "45vh" }}
                >
                    {/* Create Template Card */}
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
                                <FaPlus className="text-white w-6 h-6" />
                            </div>
                            <p className="mt-4 text-lg text-[#00a7ff]">Create a Template</p>
                            <p className="text-sm text-center mt-2">
                                Click here to add an English-language template for multi-language
                                generation.
                            </p>
                        </div>
                    </div>

                    {/* Language Settings Card */}
                    <div className="border border-[#FCFCFC] bg-[rgba(252,252,252,0.70)] rounded-2xl m-1 flex items-center justify-center p-2 lg:w-80 lg:h-80 w-72 h-72 hover:bg-[rgba(252,252,252,0.10)]">
                        <div
                            onClick={handleLanguageSettings}
                            className="relative cursor-pointer bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] rounded-xl shadow-cyan-100 shadow-2xl p-4 w-full h-full flex flex-col items-center justify-center"
                            style={{
                                background:
                                    "linear-gradient(to left bottom, rgba(92, 198, 255, 0.15), rgba(0, 160, 245, 0.3))",
                            }}
                        >
                            <div className="bg-[#00A0F5] w-8 h-8 rounded-xl flex items-center justify-center">
                                <HiLanguage className="text-white w-6 h-6" />
                            </div>
                            <p className="mt-4 text-lg text-[#00a7ff]">Language Settings</p>
                            <p className="text-sm text-center mt-2">
                                Configure languages for creatives.
                            </p>
                        </div>
                    </div>

                    {/* Template Cards */}
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id} // ensure a unique key per product
                            className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.25)] p-3 lg:w-80 lg:h-80 md:w-80 md:h-80 w-72 h-72 flex flex-col items-center justify-between hover:transition-colors duration-200 glass-gradient-hover cursor-pointer"
                        >
                            {/* If your template includes images, adjust accordingly */}
                            {template.url ? (
                                <div className="flex space-x-2 overflow-x-auto w-full h-64">

                                    <img
                                        src={template.url}
                                        alt={template.templateId || "Template"}
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full h-48 bg-gray-100 rounded-lg">
                                    <p className="text-gray-400">No Images Available</p>
                                </div>

                            )}


                            <div className="text-justify w-full px-2 line-clamp-3">
                                <div className="button-wrapper flex justify-between w-full -pl-1">
                                    {/* Generate */}
                                    <button className="text-md text-[#A8A8A8] rounded-lg py-1 px-1 button-clear"
                                    onClick={() => handleGenerate(template)}>
                                        <div className="button-container flex items-center">
                                            <BookmarkBeforeIcon />
                                            <span className="mr-1">Generate</span>
                                        </div>
                                    </button>

                                    {/* Edit */}
                                    <button
                                        onClick={() => handleEdit(template)}
                                        className="text-md text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                                    >
                                        <div className="button-container flex items-center">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M11.6564 3.65685C11.8469 3.46632 12.1531 3.46632 12.3436 3.65685L14.3436 5.65685C14.5342 5.84737 14.5342 6.15353 14.3436 6.34406L6.37492 14.3127C6.28097 14.4067 6.15792 14.4645 6.02724 14.4746L3.02724 14.7246C2.88342 14.7365 2.74001 14.6882 2.63433 14.584C2.52865 14.4797 2.47272 14.3361 2.48451 14.1923L2.73451 11.1923C2.74455 11.0616 2.80233 10.9385 2.89635 10.8446L10.865 2.87592L11.6564 3.65685Z"
                                                    stroke="#A8A8A8"
                                                    strokeWidth="1.5"
                                                    fill="none"
                                                />
                                                <rect
                                                    x="3"
                                                    y="16"
                                                    width="10"
                                                    height="1.5"
                                                    fill="#A8A8A8"
                                                />
                                            </svg>
                                            <span>Edit</span>
                                        </div>
                                    </button>

                                    {/* Download */}
                                    <button
                                        onClick={() =>
                                            handleDownloadClick(
                                                template.url || template.generatedImage
                                            )
                                        }
                                        className="text-md text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                                    >
                                        <div className="button-container flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="#A8A8A8"
                                                width="20"
                                                height="20"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5"
                                                />
                                                <rect
                                                    x="11.25"
                                                    y="3"
                                                    width="1.5"
                                                    height="11.5"
                                                    fill="#A8A8A8"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 12 12 16.5 7.5 12"
                                                    fill="none"
                                                    stroke="#A8A8A8"
                                                />
                                            </svg>
                                            <span>Download</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ------------------ Language Settings Modal ------------------ */}
            {isLanguageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative overflow-auto hide-scrollbar"
                        style={{ maxHeight: "80vh" }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#082A66]">
                                Language Settings
                            </h2>
                            <button
                                onClick={handleCancelLanguageModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Select the languages you need for creatives:
                        </p>

                        {/* SEARCH BAR for languages */}
                        <div className="relative w-full mb-4">
                            <input
                                type="text"
                                placeholder="Search Language"
                                value={languageSearchQuery}
                                onChange={handleLanguageSearchChange}
                                className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>

                        {/* List all languages (filtered) in a 3-column grid with scroll */}
                        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-gray-200 p-2 rounded">
                            {filteredLanguageOptions.map((lang) => (
                                <label
                                    key={lang.id}
                                    className="flex items-center space-x-2 cursor-pointer py-1"
                                >
                                    <input
                                        type="checkbox"
                                        checked={tempSelectedLanguageIds.includes(lang.id)}
                                        onChange={() => toggleLanguageSelection(lang.id)}
                                    />
                                    <span className="text-sm">
                                        {lang.name}
                                        {lang.code ? ` (${lang.code})` : ""}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Optionally, show the selected languages as chips below */}
                        {tempSelectedLanguageIds.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {tempSelectedLanguageIds.map((langId) => {
                                    const foundLang = languageOptions.find(
                                        (l) => l.id === langId
                                    );
                                    if (!foundLang) return null;
                                    return (
                                        <span
                                            key={langId}
                                            className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                                        >
                                            {foundLang.name}
                                            {foundLang.code ? ` (${foundLang.code})` : ""}
                                            <button
                                                onClick={() => toggleLanguageSelection(langId)}
                                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex justify-end mt-6 gap-2">
                            <button
                                onClick={handleCancelLanguageModal}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyLanguageModal}
                                className="px-5 py-2 rounded-md custom-button text-white hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ---------------- End Language Settings Modal ---------------- */}
        </div>
    );
};

export default MultiLanguageTemplates;
