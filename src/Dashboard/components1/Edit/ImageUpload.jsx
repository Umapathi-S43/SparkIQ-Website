import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

const ImageUploadLayout = ({ onSelectImage }) => { // Add onSelectImage prop
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
    setUploadedImages([...uploadedImages, ...newImages]); // Add to uploaded images state but don't reflect them all
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

  // Handle clicking on a single image
  const handleImageClick = (imageUrl) => {
    onSelectImage(imageUrl); // Only select this image and pass it to the template area
  };

  return (
    <div className="border shadow-md p-4 text-[#082A66] rounded-lg">
      <div className="bg-[#FCFCFC] shadow-md p-3 text-[#082A66] rounded-lg">
        <h3 className="font-semibold text-xl pb-6">Upload Images</h3>

        {/* Drag-and-Drop or Click-to-Upload Area */}
        <div
          className={`border-dashed border-2 p-4 mb-4 cursor-pointer flex justify-center items-center rounded-md ${
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
      </div>

      {/* Display uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2  mt-4 gap-2 rounded-md">
          {uploadedImages.map((image, index) => (
            <div 
              key={index} 
              className="border p-1 rounded-md cursor-pointer" 
              onClick={() => handleImageClick(image)} // When the image is clicked, select it
            >
              <img
                src={image}
                alt={`Uploaded Preview ${index + 1}`}
                className="w-full h-auto rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadLayout;
