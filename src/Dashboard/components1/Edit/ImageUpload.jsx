import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

const ImageUploadLayout = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  // Handle file upload through input or drag-and-drop
  const handleFileUpload = (event) => {
    event.preventDefault();
    let files;
    
    if (event.dataTransfer) {
      files = event.dataTransfer.files;
    } else {
      files = event.target.files;
    }

    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  // Handle drag over and drop events
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    handleFileUpload(event);
  };

  return (
    <div className="border shadow-md p-4 text-[#082A66]">
      <h3 className="font-semibold text-xl pb-6">Image Upload Layout</h3>

      {/* Drag-and-Drop or Click-to-Upload Area */}
      <div
        className={`border-dashed border-2 p-4 mb-4 cursor-pointer flex justify-center items-center ${
          dragOver ? "border-blue-500" : "border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <FaUpload className="text-4xl mb-2 text-[#082A66]" />
        <p className="text-center text-gray-500">
          Drag and drop your image here or click to browse
        </p>
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Display uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="border p-4">
              <img
                src={image}
                alt={`Uploaded Preview ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadLayout;
