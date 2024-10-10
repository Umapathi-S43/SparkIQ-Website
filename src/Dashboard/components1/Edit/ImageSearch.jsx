import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

const ImageSearchLayout = ({ onSelectImage }) => { // Accept a callback prop
  const storedProduct = JSON.parse(localStorage.getItem("selectedProduct")) || {};
  const [searchTerm, setSearchTerm] = useState(storedProduct.name || ""); // Default search term based on the product name
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [images, setImages] = useState([]);

  // Fetch images initially when the component mounts
  useEffect(() => {
    if (storedProduct.name) {
      handleSearchForImages(); // Automatically search based on the product title
    }
  }, [storedProduct.name]);

  const handleSearchForImages = async () => {
    try {
      const response = await axios.get(`${baseUrl}/search/get-images`, {
        params: {
          prompt: searchTerm || storedProduct.name,
          page: currentPage,
          size: 10,
        },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setImages(response.data.result.data); // Assuming `result.data` contains image results
    } catch (error) {
      console.error(error);
      toast.error("Failed to search images.");
    }
  };

  return (
    <div className="border shadow-md p-4 text-[#FCFCFC] rounded-lg">
      <h3 className="font-semibold text-xl pb-4">Search for Images</h3>

      <div className="border p-4 mb-4 rounded-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-2 border rounded-md text-[#082A66]"
          placeholder="Search for images"
        />
        <button
          className="w-full custom-button text-white py-2 px-4 rounded-lg"
          onClick={handleSearchForImages}
        >
          Search for Images
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={image.id}
              className="border p-1 rounded-md cursor-pointer" // Add pointer cursor to indicate image is clickable
              onClick={() => onSelectImage(image.imgUrl)} // Pass the image URL back to the parent component
            >
              <img
                src={image.imgUrl}
                alt={`Preview ${index}`}
                className="w-full h-auto rounded-md"
                style={{ width: "150px", height: "120px", objectFit: "cover" }} // Equal size images
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-2">No images found</p>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="custom-button text-white p-2 px-4 rounded"
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
            handleSearchForImages();
          }}
        >
          Previous
        </button>
        <button
          className="custom-button text-white p-2 px-4 rounded"
          onClick={() => {
            setCurrentPage((prevPage) => prevPage + 1);
            handleSearchForImages();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageSearchLayout;
