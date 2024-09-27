import React, { useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { PiFileArrowUpDuotone } from "react-icons/pi";
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';
import './GenerateDAP.css';

export default function GenerateDAPCreatives() {
    const [isOpenProductDetails, setIsOpenProductDetails] = useState(true); // Handle first section state
    const [isOpenNextSection, setIsOpenNextSection] = useState(false); // Handle second section state
    const [isCompletedProductDetails, setIsCompletedProductDetails] = useState(false); // Track if first section is completed

    // JSON Upload State
    const [jsonFile, setJsonFile] = useState(null); // Track JSON file upload
    const [jsonFileName, setJsonFileName] = useState(''); // Store uploaded file name
    const [isUploading, setIsUploading] = useState(false); // Track upload status for first section
    const [uploadProgress, setUploadProgress] = useState(0); // Track upload percentage for JSON

    // CSV Upload State
    const [csvFile, setCsvFile] = useState(null); // Track CSV file upload
    const [csvFileName, setCsvFileName] = useState(''); // Store uploaded CSV file name
    const [isUploadingCSV, setIsUploadingCSV] = useState(false); // Track upload status for CSV
    const [uploadProgressCSV, setUploadProgressCSV] = useState(0); // Track upload percentage for CSV

    // Toggle accordion sections
    const toggleProductDetailsAccordion = () => setIsOpenProductDetails(!isOpenProductDetails);
    const toggleNextSectionAccordion = () => setIsOpenNextSection(!isOpenNextSection);

    // Handle JSON file upload
    const handleJsonFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            setJsonFile(file);
            setJsonFileName(file.name);
            simulateUpload(); // Simulate the upload process for JSON
        } else {
            alert("Please upload a valid JSON file.");
        }
    };

    // Simulate the file upload process with progress for JSON
    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setIsCompletedProductDetails(true);
                    setIsOpenProductDetails(false);
                    setIsOpenNextSection(true); // Automatically open the next section
                    return 100;
                }
                return prevProgress + 20;
            });
        }, 500); // Simulate upload progress
    };

    // Handle CSV file upload
    const handleCsvFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            setCsvFile(file);
            setCsvFileName(file.name);
            simulateCSVUpload(); // Simulate the upload process for CSV
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    // Simulate the file upload process with progress for CSV
    const simulateCSVUpload = () => {
        setIsUploadingCSV(true);
        setUploadProgressCSV(0);

        const interval = setInterval(() => {
            setUploadProgressCSV((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    setIsUploadingCSV(false);
                    return 100;
                }
                return prevProgress + 20;
            });
        }, 500); // Simulate upload progress
    };

    // Handle delete JSON file
    const handleDeleteJsonFile = () => {
        setJsonFile(null);
        setJsonFileName('');
        setUploadProgress(0);
        setIsCompletedProductDetails(false);
    };

    // Handle delete CSV file
    const handleDeleteCsvFile = () => {
        setCsvFile(null);
        setCsvFileName('');
        setUploadProgressCSV(0);
    };

    return (
        <div className="flex-grow lg:mr-8 lg:ml-0 ml-2 mx-auto overflow-auto">
            <div className="max-w-7xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl">
                <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-4 pb-0  relative">
                    <span className="flex items-center gap-2 lg:gap-4 ">
                        <img src="/icon1.svg" alt="" className="w-10 lg:w-12" />
                        <span className="flex flex-col">
                            <h4 className="text-[#082A66] font-bold text-lg lg:text-2xl">
                                Generate an Ad Creatives
                            </h4>
                            <p className="text-[#374151] text-xs lg:text-sm">
                                Generate conversion-focused ad creatives using our unique AI.
                            </p>
                        </span>
                    </span>
                    <img
                        src="/image1.png"
                        alt=""
                        className="absolute bottom-0 right-24 w-28 lg:w-36 hidden md:block"
                    />
                </div>

                <div className="max-w-7xl w-full mx-auto flex flex-col gap-6 rounded-3xl px-4 mb-4">

                    {/* First Section - Product Design Details */}
                    <div className={`border border-[#FCFCFC] bg-[rgba(252,252,252,0.25)] rounded-[24px] ${isOpenProductDetails ? 'p-0' : 'p-3'} flex flex-col gap-6 relative z-10`}>
                        <div
                            className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] ${isOpenProductDetails ? 'rounded-t-[20px] p-4' : 'rounded-[20px] lg:p-2 p-2'}  relative cursor-pointer`}
                            onClick={toggleProductDetailsAccordion}
                        >
                            {isCompletedProductDetails && (
                                <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
                                    Completed <BiCheck size={20} />
                                </span>
                            )}
                            <div className="flex items-center gap-4">
                                <img src="/icon2.svg" alt="" />
                                <span className="flex flex-col">
                                    <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">Product Design Details</h4>
                                    <p className="text-[#374151] text-xs lg:text-sm">Upload the design details as a JSON file.</p>
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                {isOpenProductDetails ? (
                                    <MdArrowDropUp size={32} className="cursor-pointer" />
                                ) : (
                                    <MdArrowDropDown size={32} className="cursor-pointer" />
                                )}
                            </div>
                        </div>

                        {/* JSON File Upload Section */}
                        {isOpenProductDetails && (
                            <div className="p-4">
                                <div className="border-2 border-[#fcfcfc] rounded-2xl m-2 p-1 flex-grow">
                                    <div className="bg-white rounded-xl m-1 p-2 shadow-lg">
                                    <div className="border-dashed border-2 border-gray-400 bg-white rounded-lg p-1 m-1 text-center cursor-pointer hover:border-gray-600 relative file-upload-container" style={{ maxWidth: '100%' }}>
                                        <input
                                            type="file"
                                            onChange={handleJsonFileUpload}
                                            className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                            id="file-upload-json"
                                        />
                                        <label htmlFor="file-upload-json" className="flex flex-col items-center justify-center h-full cursor-pointer">
                                            <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                                            <span className="text-gray-500 text-nowrap">Upload JSON File</span>
                                        </label>
                                    </div>

                                    </div>
                                </div>

                                {/* Progress Bar, File Name, and Delete Container */}
                                {jsonFile && (
                                    <div className="progress-bar-container border border-[#FCFCFC] bg-white rounded-2xl p-2 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">{jsonFileName}</span>
                                            <FaTrashAlt className="text-red-500 cursor-pointer" onClick={handleDeleteJsonFile} />
                                        </div>
                                        <div className="progress-bar bg-blue-500 mt-2" style={{ width: `${uploadProgress}%` }}>
                                            {uploadProgress}%
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="custom-button p-2 pl-4 pr-4 mt-4 text-white rounded-2xl shadow-2xl"
                                    onClick={simulateUpload}
                                >
                                    Save and Continue
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Second Section - Products Details */}
                    <div className={`border border-[#FCFCFC] bg-[rgba(252,252,252,0.25)] rounded-[24px] ${isOpenNextSection ? 'p-0' : 'p-3'} flex flex-col gap-6 relative z-10`}>
                        <div
                            className={`flex justify-between items-center bg-[rgba(252,252,252,0.40)] ${isOpenNextSection ? 'rounded-t-[20px] p-4' : 'rounded-[20px] lg:p-2 p-2'}  relative cursor-pointer`}
                            onClick={toggleNextSectionAccordion}
                        >
                            <div className="flex items-center gap-4">
                                <img src="/icon2.svg" alt="" />
                                <span className="flex flex-col">
                                    <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">Products Details</h4>
                                    <p className="text-[#374151] text-xs lg:text-sm">This section is opened after uploading the JSON.</p>
                                </span>
                            </div>
                            <div className="flex items-center gap-6">
                                {isOpenNextSection ? (
                                    <MdArrowDropUp size={32} className="cursor-pointer" />
                                ) : (
                                    <MdArrowDropDown size={32} className="cursor-pointer" />
                                )}
                            </div>
                        </div>

                        {/* CSV File Upload Section */}
                        {isOpenNextSection && (
                            <div className="p-4">
                                <div className="border-2 border-[#fcfcfc] rounded-2xl m-2 p-1 flex-grow">
                                    <div className="bg-white rounded-xl m-1 p-2 shadow-lg">
                                        <div className="border-dashed border-2 border-gray-400 bg-white rounded-lg p-1 m-1 text-center cursor-pointer hover:border-gray-600 relative file-upload-container" style={{ maxWidth: '100%' }}>
                                        <input
                                            type="file"
                                            onChange={handleCsvFileUpload}
                                            className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                            id="file-upload-json"
                                        />
                                        <label htmlFor="file-upload-json" className="flex flex-col items-center justify-center h-full cursor-pointer">
                                            <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                                            <span className="text-gray-500 text-nowrap">Upload JSON File</span>
                                        </label>
                                    </div>
                                    </div>
                                </div>

                                {/* Progress Bar, File Name, and Delete Container */}
                                {csvFile && (
                                    <div className="progress-bar-container border border-[#FCFCFC] bg-white rounded-2xl p-2 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">{csvFileName}</span>
                                            <FaTrashAlt className="text-red-500 cursor-pointer" onClick={handleDeleteCsvFile} />
                                        </div>
                                        <div className="progress-bar bg-blue-500 mt-2" style={{ width: `${uploadProgressCSV}%` }}>
                                            {uploadProgressCSV}%
                                        </div>
                                    </div>
                                )}

                                <button
                                    className="custom-button p-2 pl-4 pr-4 mt-4 text-white rounded-2xl shadow-2xl"
                                    onClick={simulateCSVUpload}
                                >
                                    Save and Continue
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
