import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import brandImage from "../../assets/dashboard_img/brand_img.png";
import brandIcon from "../../assets/dashboard_img/brand.svg";
import defaultAdImage from "../../assets/dashboard_img/saved_products.svg";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import "./SavedProducts.css"; // <-- We'll include loader CSS here

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

const SavedProducts = () => {
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
      let url = `${baseUrl}/v2/user/templates?page=${page}&size=${pageSize}&sortDirection=desc`;
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

      const response = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
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
    navigate("/editor", { state: { templateData: template } });
  };

  // ---------------------------------------
  // 18) Download
  // ---------------------------------------
  const handleDownload = async (url) => {
    if (!url) {
      toast.error("No URL available for download.");
      return;
    }
    const fileName = url.split("/").pop();
    try {
      const response = await axios.get(`${baseUrl}/sparkiq/image/download/${fileName}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success("Downloaded successfully!");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
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
      await axios.delete(`${baseUrl}/v2/user/templates/${selectedTemplateId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setTemplates((prev) =>
        prev.filter((p) => p.templateId !== selectedTemplateId)
      );
      setIsModalOpen(false);
      toast.success("Saved product deleted successfully.");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete the template. Please try again.");
    }
  };

  // ---------------------------------------
  // 20) Render
  // ---------------------------------------
  return (
    <div className="flex-grow overflow-y-auto hide-scrollbar">
      {/* Container */}
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-3 border border-[#FCFCFC] rounded-3xl pb-4">
        {/* Header */}
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-6 relative">
          <span className="flex items-center gap-4">
            <div className="relative flex items-center justify-center ml-1">
              <div className="absolute w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl"></div>
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" alt="Brand Icon" />
              </div>
            </div>
            <span className="flex flex-col ml-2">
              <h4 className="text-[#082A66] font-bold text-xl">Saved Creatives</h4>
              <p className="text-[#374151]">View your Favorite Ads Here.</p>
            </span>
          </span>
          <img
            src={brandImage}
            alt="Brand Banner"
            className="absolute bottom-0 right-24 w-44 hidden lg:block"
          />
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 gap-6 mt-4">
          <div className="flex gap-4">
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

            {/* Product Filter */}
            <select
              value={selectedProductId}
              onChange={handleProductChange}
              className="rounded-md border border-slate-200 p-2 px-4 text-sm
                         max-w-[180px] overflow-auto"
            >
              <option value="">All Products</option>
              {filteredProductOptions.map((prod) => {
                const displayName =
                  prod.name.length > 15 ? `${prod.name.slice(0, 15)}...` : prod.name;
                return (
                  <option key={prod.id} value={prod.id}>
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

          {/* Search bar (local) */}
          <div className="flex items-center bg-white rounded-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search (local)"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400
                           rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm
                           focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
              />
              {/* Magnifying Glass Icon */}
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-4.35-4.35"></path>
                <circle cx="10" cy="10" r="6"></circle>
              </svg>
            </div>
          </div>
        </div>

        {/* Loader when fetching */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <span className="load-loader"></span>
          </div>
        )}

        {/* Body (Scroll Container) */}
        {/* Body (Scroll Container) */}
        <div
          ref={listContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 pb-1 overflow-auto hide-scrollbar"
          style={{ maxHeight: "54vh" }}
          onScroll={handleScroll}
        >
          {/* If final list is empty and not loading, show a professional message */}
          {!loading && finalFilteredTemplates.length === 0 && (
            <div className="col-span-full flex justify-center items-center py-3">
              <p className="text-gray-500 text-sm">
                No creatives found for the selected brand/product/size. Please try different filters.
              </p>
            </div>
          )}

          {finalFilteredTemplates.map((item) => (
            <div
              key={item.templateId}
              className="group border border-[#FCFCFC] rounded-xl m-1
                         bg-[rgba(252,252,252,0.35)] p-3 flex flex-col
                         items-center justify-between cursor-pointer"
            >
              <div className="relative w-full overflow-hidden rounded-lg mb-2">
                <img
                  src={item.url || defaultAdImage}
                  alt="Creative Thumbnail"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              <div className="button-wrapper flex justify-between w-full -ml-2 -pl-1">
                {/* Toggle Bookmark */}
                <button
                  className="text-sm text-[#A8A8A8] rounded-lg py-1 px-1 button-clear"
                  onClick={() => handleToggleBookmark(item)}
                >
                  <div className="button-container flex items-center">
                    {item.isFavourite ? (
                      <>
                        <BookmarkAfterIcon />
                        <span>Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <BookmarkBeforeIcon />
                        <span className="ml-1">Bookmark</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Edit Button */}
                <button
                  className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                  onClick={() => handleEdit(item)}
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
                      <rect x="3" y="16" width="10" height="1.5" fill="#A8A8A8" />
                    </svg>
                    <span>Edit</span>
                  </div>
                </button>

                {/* Download Button */}
                <button
                  className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                  onClick={() => handleDownload(item.url)}
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

                {/* Delete Button */}
                <button
                  className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                  onClick={() => openDeleteModal(item.templateId)}
                >
                  <div className="button-container flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      stroke="#A8A8A8"
                    >
                      <path
                        d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
                        fill="#A8A8A8"
                        stroke="#A8A8A8"
                      />
                    </svg>
                    <span>Delete</span>
                  </div>
                </button>
              </div>
            </div>
          ))}
          {/* Show "Loading more..." only if we have more pages to load */}
          {loading && hasMore && (
            <div className="col-span-full flex justify-center items-center py-3">
              <p className="text-gray-500 text-sm">Loading more...</p>
            </div>
          )}
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

export default SavedProducts;