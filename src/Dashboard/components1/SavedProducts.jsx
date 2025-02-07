import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";

import brandImage from "../../assets/dashboard_img/brand_img.png";
import brandIcon from "../../assets/dashboard_img/brand.svg";
import defaultAdImage from "../../assets/dashboard_img/saved_products.svg";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import "./SavedProducts.css";

// Delete Confirmation Modal
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

// Icons for bookmark
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

const SavedProducts = () => {
  const navigate = useNavigate();

  // ---------------------------
  // Pagination & Data States
  // ---------------------------
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10); // fixed or make it dynamic
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Search States
  // ---------------------------
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------------------
  // Delete Modal
  // ---------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  // ---------------------------
  // Refs
  // ---------------------------
  const listContainerRef = useRef(null);

  // ------------------------------------------------------------------
  // 1. Fetch Templates (Paginated)
  // ------------------------------------------------------------------
  // Fetch Templates (paginated)
  const fetchTemplates = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/v2/user/templates?page=${page}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      const pageData = response.data?.data;
      const newData = pageData?.content || [];
  
      setProducts((prev) => {
        // 1) Combine old + new
        const combined = [...prev, ...newData];
        // 2) Deduplicate by templateId
        const map = new Map();
        for (const item of combined) {
          map.set(item.templateId, item);
        }
        return Array.from(map.values());
      });
  
      setPageNumber(pageData?.number ?? 0);
      setHasMore(!pageData?.last);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Initial load
    fetchTemplates(0);
  }, []);

  // ------------------------------------------------------------------
  // 3. Infinite Scroll Handler
  // ------------------------------------------------------------------

  const handleScroll = (e) => {
    if (loading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // If scrolled near bottom, load next
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchTemplates(pageNumber + 1);
    }
  };
  
  // ------------------------------------------------------------------
  // 4. Local Search
  // ------------------------------------------------------------------

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.templateJson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ------------------------------------------------------------------
  // 2. useEffect: initial load
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchTemplates(0);
    // eslint-disable-next-line
  }, []);

  // ------------------------------------------------------------------
  // 5. Toggle Bookmark
  // ------------------------------------------------------------------
  const handleToggleBookmark = async (item) => {
    try {
      const newFavState = !item.isFavourite; // Toggle
      // Build the payload
      const payload = {
        ...item,
        isFavourite: newFavState,
      };

      // Optimistic UI update
      setProducts((prev) =>
        prev.map((p) =>
          p.templateId === item.templateId ? { ...p, isFavourite: newFavState } : p
        )
      );

      // POST update
      const response = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (response.data?.data?.isFavourite === newFavState) {
        toast.success(
          newFavState ? "Bookmarked successfully!" : "Unbookmarked successfully!"
        );
      } else {
        toast.error("Failed to update bookmark on server.");
        // Optionally revert state
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Could not update bookmark.");
    }
  };

  // ------------------------------------------------------------------
  // 6. Edit
  // ------------------------------------------------------------------
  const handleEdit = (template) => {
    navigate("/editor", { state: { templateData: template } });
  };

  // ------------------------------------------------------------------
  // 7. Download
  // ------------------------------------------------------------------
  const handleDownload = async (url) => {
    if (!url) {
      toast.error("No URL available for download.");
      return;
    }

    const fileName = url.split("/").pop(); // e.g. "...com/filename.png"
    try {
      const response = await axios.get(`${baseUrl}/sparkiq/image/download/${fileName}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName; // rename if needed
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

  // ------------------------------------------------------------------
  // 8. Delete
  // ------------------------------------------------------------------
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
      setProducts((prev) =>
        prev.filter((p) => p.templateId !== selectedTemplateId)
      );
      setIsModalOpen(false);
      toast.success("Saved product deleted successfully.");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete the template. Please try again.");
    }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
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

        {/* Search bar */}
        <div className="flex justify-end w-full px-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-xl mr-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-3 pr-10 ring-1 ring-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                />
                <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 focus:text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Body (Scroll Container) */}
        <div
          ref={listContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 pb-1 overflow-auto hide-scrollbar"
          style={{ maxHeight: "54vh" }}
          onScroll={handleScroll}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.templateId}
              className="group border border-[#FCFCFC] rounded-xl m-1 bg-[rgba(252,252,252,0.35)] p-3 flex flex-col items-center justify-between cursor-pointer"
            >
              <div className="relative w-full overflow-hidden rounded-lg mb-2">
                <img
                  src={product.url || defaultAdImage}
                  alt="Creative Thumbnail"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              <div className="button-wrapper flex justify-between w-full -ml-2 -pl-1">
                {/* Toggle Bookmark */}
                <button
                  className="text-sm text-[#A8A8A8] rounded-lg py-1 px-1 button-clear"
                  onClick={() => handleToggleBookmark(product)}
                >
                  <div className="button-container flex items-center">
                    {product.isFavourite ? (
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
                  onClick={() => handleEdit(product)}
                >
                  <div className="button-container flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#004367" />
                          <stop offset="100%" stopColor="#00A7FF" />
                        </linearGradient>
                      </defs>
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
                  onClick={() => handleDownload(product.url)}
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
                        className="arrow-rect"
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
                  onClick={() => openDeleteModal(product.templateId)}
                >
                  <div className="button-container flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 -960 960 960"
                      width="20"
                      stroke="#A8A8A8"
                    >
                      <defs>
                        <linearGradient
                          id="deleteHoverGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#004367" />
                          <stop offset="100%" stopColor="#00A7FF" />
                        </linearGradient>
                      </defs>
                      <path
                        d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"
                        className="delete-path"
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
          {/* Show a "loading more" spinner if we're fetching next page */}
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
