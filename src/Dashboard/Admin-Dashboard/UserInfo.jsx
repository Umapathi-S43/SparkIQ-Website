import React, { useState, useEffect } from 'react';
import Header from './admin-header'; // Adjust import path if needed
import axios from 'axios';
import { jwtToken } from '../../components/utils/jwtToken';
import { baseUrl } from '../../components/utils/Constant';


/** Utility to format the startDate array (e.g. [2025, 2, 3, 9, 55, 59, 978339000]) into a readable string */
function formatStartDate(startDateArray) {
  if (!Array.isArray(startDateArray) || startDateArray.length < 3) return '';
  const [year, month, day, hour, minute, second] = startDateArray;
  // Java month is 1-based; JS Date is 0-based for month
  const dateObj = new Date(year, month - 1, day, hour, minute, second);
  // You can customize this format as needed:
  return dateObj.toLocaleString();
}

const UserInfo = () => {
  // Sidebar responsiveness
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // Subscription array from backend
  const [subscriptions, setSubscriptions] = useState([]);

  // For the header’s profile icon initials
  const [userName, setUserName] = useState('');

  // For pagination (defaults to page=0, size=10)
  const [page] = useState(0);
  const [size] = useState(10);

  // For searching by email
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states: Edit & Delete
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubscriptionForDeletion, setSelectedSubscriptionForDeletion] =
    useState(null);

  // Toggle the sidebar on small screens
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch subscriptions from the backend
  const fetchSubscriptions = async (emailSearch = '') => {
    try {
      const url = `${baseUrl}/v2/subscriptions?page=${page}&size=${size}${
        emailSearch ? `&email=${encodeURIComponent(emailSearch)}` : ''
      }`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      // The endpoint returns { data: { content: [...], totalPages, ... }, message: ... }
      const result = response.data.data;
      // result.content is the array of subscriptions
      setSubscriptions(result.content || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  };

  // Initial load + retrieve localStorage userName
  useEffect(() => {
    fetchSubscriptions(); // Load with no email filter initially
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Perform search (re-fetch with ?email=)
  const handleSearch = () => {
    fetchSubscriptions(searchTerm);
  };

  // If user presses Enter in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Open Edit modal
  const handleEdit = (subscription) => {
    setEditFormData(subscription);
    setIsEditModalOpen(true);
  };

  // Open Delete modal
  const handleDelete = (subscription) => {
    setSelectedSubscriptionForDeletion(subscription);
    setIsDeleteModalOpen(true);
  };

  // Confirm Update (Edit Modal)
  const handleUpdate = async () => {
    if (!editFormData) return;

    try {
      // Example: PUT /v2/subscriptions/{id}
      const url = `${baseUrl}/v2/subscriptions/${editFormData.id}`;
      await axios.put(url, editFormData, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      // Re-fetch data (preserving current search term)
      fetchSubscriptions(searchTerm);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed');
    }
  };

  // Confirm Delete (Delete Modal)
  const confirmDelete = async () => {
    if (!selectedSubscriptionForDeletion) return;

    try {
      // Example: DELETE /v2/subscriptions/{id}
      const url = `${baseUrl}/v2/subscriptions/${selectedSubscriptionForDeletion.id}`;
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      fetchSubscriptions(searchTerm);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex items-center justify-center p-2 md:p-4 overflow-hidden text-sm md:text-base">
      <div
        className="border-2 border-[#FCFCFC] rounded-3xl w-full"
        style={{ height: 'calc(100vh - 1rem)' }}
      >
        <div className="flex flex-col min-h-screen">
          {/* Header bar (logo, profile icon, etc.) */}
          <Header toggleSidebar={toggleSidebar} userName={userName} />

          <div className="flex flex-grow overflow-x-auto hide-scrollbar">
            {/* If you have a sidebar, place it here */}
            <div
              className={`flex-grow transition-transform duration-300 ${
                isSidebarOpen ? '-ml-6' : 'ml-0'
              }`}
            >
              <div className="mx-4 md:mx-10 my-4 ">
                {/* Top Row: Title & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                  <h2 className="text-xl font-bold">Subscriptions</h2>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search by email..."
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      onKeyPress={handleKeyPress}
                      className="border border-gray-300 rounded p-1 md:p-2"
                    />
                    <button
                      onClick={handleSearch}
                      className="custom-button text-white px-3 py-1 md:px-4 md:py-2 rounded"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Table of Subscriptions */}
                <div className="overflow-x-auto hide-scrollbar">
                  <table className="table-auto border-collapse w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          SNo
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Email
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Phone
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Username
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Start Date
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Brands Completed
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Max Brands
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Generated Images
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Max Generated Images
                        </th>
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Products
                        </th>
                        {/* <th className="border px-4 py-2 text-[#082A66] font-bold italic">Downloads</th> */}
                        <th className="border px-2 md:px-4 py-2 text-[#082A66] font-bold italic">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub, index) => {
                        // Pull fields from the subscription and its user
                        const {
                          user,
                          id,
                          createdBrand,
                          maxBrands,
                          generatedImages,
                          maxGeneratedImages,
                          createdProducts,
                          // downloadsCompleted,
                          startDate,
                        } = sub;

                        // user fields
                        const email = user?.email || '';
                        const phone = user?.phoneNumber || '';
                        const username = user?.name || '';

                        // Format the subscription's start date array
                        const parsedStartDate = formatStartDate(startDate);

                        return (
                          <tr key={id} className="hover:bg-gray-200">
                            <td className="border px-2 md:px-4 py-2">
                              {index + 1}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              {email}
                            </td>
                            <td className="border px-2 md:px-4 py-2">{phone}</td>
                            <td className="border px-2 md:px-4 py-2">
                              {username}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              {parsedStartDate}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              {createdBrand}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              {maxBrands}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              {generatedImages}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              {maxGeneratedImages}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              {createdProducts}
                            </td>
                            <td className="border px-2 md:px-4 py-2">
                              <button
                                onClick={() => handleEdit(sub)}
                                className="custom-button text-white px-4 py-1 rounded mr-2"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {subscriptions.length === 0 && (
                        <tr>
                          <td colSpan="11" className="text-center py-4">
                            No subscriptions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Modal */}
              {isEditModalOpen && editFormData && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 p-2">
                  <div className="bg-white p-4 md:p-6 rounded shadow w-full max-w-2xl overflow-auto max-h-screen">
                    <h2 className="text-xl font-bold mb-4">Edit Subscription</h2>

                    {/**
                     * We'll use a 2-column grid to reduce the modal height.
                     * Read-only fields: email, username, phone, start date
                     * Use `cursor-not-allowed` and `bg-gray-100` to indicate they're uneditable.
                     */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left column read-only fields, etc. */}
                      <div>
                        <label className="block font-semibold mb-1">Email:</label>
                        <input
                          type="text"
                          className="border rounded p-1 w-full bg-gray-100 cursor-not-allowed"
                          value={editFormData.user?.email || ''}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Username:</label>
                        <input
                          type="text"
                          className="border rounded p-1 w-full bg-gray-100 cursor-not-allowed"
                          value={editFormData.user?.name || ''}
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Phone:</label>
                        <input
                          type="text"
                          className="border rounded p-1 w-full bg-gray-100 cursor-not-allowed"
                          value={editFormData.user?.phoneNumber || ''}
                          readOnly
                        />
                      </div>

                      {/* Format the subscription's startDate again for read-only display */}
                      <div>
                        <label className="block font-semibold mb-1">Start Date:</label>
                        <input
                          type="text"
                          className="border rounded p-1 w-full bg-gray-100 cursor-not-allowed"
                          value={formatStartDate(editFormData.startDate)}
                          readOnly
                        />
                      </div>

                      {/* Editable fields */}
                      <div>
                        <label className="block font-semibold mb-1">BrandLimits Completed:</label>
                        <input
                          type="number"
                          className="border rounded p-1 w-full"
                          value={editFormData.createdBrand || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              createdBrand: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Max Brands:</label>
                        <input
                          type="number"
                          className="border rounded p-1 w-full"
                          value={editFormData.maxBrands || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              maxBrands: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Generated Images:</label>
                        <input
                          type="number"
                          className="border rounded p-1 w-full"
                          value={editFormData.generatedImages || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              generatedImages: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Max Generated Images:</label>
                        <input
                          type="number"
                          className="border rounded p-1 w-full"
                          value={editFormData.maxGeneratedImages || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              maxGeneratedImages: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Products:</label>
                        <input
                          type="number"
                          className="border rounded p-1 w-full"
                          value={editFormData.createdProducts || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              createdProducts: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Downloads:</label>
                        <input
                          type="number"
                          className="border rounded p-1 w-full"
                          value={editFormData.downloadsCompleted || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              downloadsCompleted: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setIsEditModalOpen(false)}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {isDeleteModalOpen && selectedSubscriptionForDeletion && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 p-2">
                  <div className="bg-white p-4 rounded shadow w-full max-w-sm">
                    <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                    <p>
                      Are you sure you want to delete the subscription of user{' '}
                      <span className="font-semibold">
                        {selectedSubscriptionForDeletion.user?.email}
                      </span>{' '}
                      (<span className="font-semibold">
                        {selectedSubscriptionForDeletion.user?.name}
                      </span>)?
                    </p>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={confirmDelete}
                        className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* End Delete Confirmation Modal */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
