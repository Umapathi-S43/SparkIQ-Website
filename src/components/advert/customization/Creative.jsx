import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Picker from "../../../Dashboard/components1/colorPicker";
import axios from "axios";
import { jwtToken } from "../../utils/jwtToken";
import { baseUrl } from "../../utils/Constant";

export default function Creative({
  handleBackClick,
  handleNextClick,
  setRandomPhrase,
  setCaptionDetails,
  setSelectedImage,
  randomPhrase,
  captionDetails,
  aimodel,
  tabColor,
  templateColor,
  setPage,
}) {
  const [colors, setColors] = useState(["#1138AC", "#008BC4"]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#fff");
  const [currentColorIndex, setCurrentColorIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [phrases, setPhrases] = useState([]);
  const [adImages, setAdImages] = useState([]);
  const dropdownRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Initialize navigate
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial phrases or handle it if it's already defined elsewhere
    const initialPhrases = [
      "Boost your brand with our service!",
      "Discover the future of advertising.",
      "Take your business to the next level.",
      // Add more phrases as needed
    ];
    setPhrases(initialPhrases);

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 540);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("ai model from use effect", aimodel, templateColor);
    fetchGeneratedImages();
  }, [aimodel,templateColor]); // Add aimodel as a dependency
  
  const fetchGeneratedImages = async () => {
    const storedProductID = JSON.parse(localStorage.getItem("productID")) || null;

    // Define model mapping based on aimodel
    const modelMapping = {
      "Brand Awareness": "PAS",
      "Sale": ["AIDA", "FAB"], // Include both AIDA and FAB for Sale
      "Retargeting Audience": "USP",
    };
    console.log("Ai model passed is :",aimodel);
    const selectedModels = modelMapping[aimodel];
    const imagesData = [];
    console.log("template color from creative:",templateColor);

    try {
      if (Array.isArray(selectedModels)) {
        // If the model is an array, fetch images for each model (AIDA, FAB) for Sale
        for (let model of selectedModels) {
          const res = await axios.get(
            `${baseUrl}/generated-images/model/${aimodel}/${storedProductID}/${templateColor}`,
                      {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          imagesData.push(...res.data);
          if (imagesData.length >= 6) break; // Stop if we have 6 images
        }
      } else {
        // If it's a single model, fetch images directly
        const res = await axios.get(
          `${baseUrl}/generated-images/model/${aimodel}/${storedProductID}/${templateColor}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        imagesData.push(...res.data);
      }

      setAdImages(imagesData.slice(0, 6)); // Only take up to 6 images
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setUploadedImage(URL.createObjectURL(file));
    }
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setSelectedImage(null);
  };

  const handleAddColor = () => {
    if (colors.length < 10) {
      setShowColorPicker(true);
      setCurrentColorIndex(null);
    }
  };

  const handleChangeComplete = (color) => {
    setCurrentColor(color.hex);
  };

  const handleSaveAdditionalColor = () => {
    if (currentColorIndex !== null) {
      const newColors = [...colors];
      newColors[currentColorIndex] = currentColor;
      setColors(newColors);
    } else {
      if (!colors.includes(currentColor) && colors.length < 10) {
        setColors([...colors, currentColor]);
      }
    }
    setShowColorPicker(false);
  };

  const closeColorPicker = () => {
    setShowColorPicker(false);
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  const handleOnchange = (e) => {
    const { id, value } = e.target;
    setCaptionDetails({ ...captionDetails, [id]: value });
  };

  const toggleDropdown = () => {
    setShowDropdown(true);
  };

  const handlePhraseClick = (phrase) => {
    setCaptionDetails({ ...captionDetails, content: phrase });
    setRandomPhrase(phrase);
    setShowDropdown(false);
  };

  const refreshPhrases = () => {
    const shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5);
    setPhrases(shuffledPhrases);
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  };

  const handleBack = () => {
    handleBackClick();
  };

  const handleNext = () => {
    handleNextClick();
  };

  return (
    <div className="flex flex-col gap-4 pt-4 px-4 sm:px-6 md:px-8 lg:px-10 overflow-auto" style={{ maxHeight: "68vh" }}>
      <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-[20px] p-2">
        {uploadedImage ? (
          <div className="border border-[#605880] border-dotted rounded-[20px] w-full flex gap-4 p-6 items-center justify-between">
            <div>
              <img
                src={uploadedImage}
                alt=""
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover"
              />
            </div>
            <button
              className="bg-[#EF44441A] text-[#EF4444] text-xs h-6 w-6 rounded-full"
              onClick={handleRemoveImage}
            >
              X
            </button>
          </div>
        ) : (
          <div
            className={`border border-[#605880] border-dashed rounded-[20px] w-full flex flex-col items-center justify-center py-3 ${
              isDragging ? "bg-blue-100" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <img src="/icon3.svg" alt="" width={24} />
            <div className="flex gap-1 m-2">
              <div>
                <label className="cursor-pointer text-xs sm:text-sm lg:text-md">
                  Drop your own ad creative here or select file
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center my-3">
        <div className="flex-1 h-[1px] bg-[#ccc] mx-3"></div>
        <span className="text-xs sm:text-sm">or edit these details</span>
        <div className="flex-1 h-[1px] bg-[#ccc] mx-3"></div>
      </div>
      <div className="border border-[#FCFCFC] rounded-xl py-4 px-5 flex flex-col sm:flex-row items-start justify-between shadow">
        <span className="flex flex-col gap-3 w-full">
          <p className="text-[#9CA3AF] text-xs sm:text-sm">Ad Content</p>
          <div className="relative flex flex-col gap-2 w-full">
            <textarea
              className="bg-white border border-white text-[#020817] text-xs sm:text-sm w-full p-2 sm:p-4 focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-2xl shadow-lg"
              rows={1}
              id="content"
              onChange={handleOnchange}
              value={captionDetails.content ? captionDetails.content : randomPhrase}
            />
            <span
              className={`flex items-center gap-2 bg-white h-full cursor-pointer shadow-sm px-2 py-1 rounded-2xl sm:absolute sm:right-0 z-10 ${
                isSmallScreen ? "mt-2" : ""
              }`}
              onClick={toggleDropdown}
            >
              <img src="/icon7.svg" alt="" onClick={refreshPhrases} />
              <p className="text-[#000000B2] text-xs sm:text-sm whitespace-pre">
                AI Assist
              </p>
            </span>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-64 sm:w-80 bg-white shadow-md rounded-lg z-20 max-h-64 overflow-y-auto"
              >
                {phrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handlePhraseClick(phrase)}
                  >
                    {phrase}
                  </div>
                ))}
              </div>
            )}
          </div>
        </span>
      </div>
      <div className="border border-[#FCFCFC] rounded-xl py-4 px-5 flex items-center justify-between shadow">
        <span className="flex flex-col gap-3 w-full">
          <p className="text-[#9CA3AF] text-xs sm:text-sm">CTA</p>
          <input
            type="text"
            defaultValue="Discover More"
            className="bg-transparent border border-white text-[#020817] text-xs sm:text-sm w-full p-2 sm:p-4 focus:ring-2 focus-within:ring-blue-400 focus:outline-none bg-white rounded-2xl shadow-lg"
            id="cta"
            onChange={handleOnchange}
            value={captionDetails.cta}
          />
        </span>
      </div>
      <div className="p-4 sm:p-6">
        <p className="text-xs sm:text-sm text-[#989BA0]">Choose your color</p>
        <div className="flex gap-2 py-2 relative">
          {colors.map((color, index) => (
            <div key={index} className="relative">
              <button
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setCurrentColor(color);
                  setCurrentColorIndex(index);
                  setShowColorPicker(true);
                }}
              ></button>
              <button
                className="flex justify-center items-center"
                onClick={() => removeColor(color)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "#fff",
                  border: "none",
                  cursor: "pointer",
                  width: "11px",
                  height: "10px",
                  fontSize: "10px",
                  borderRadius: "50%",
                  boxShadow: "0 0 3px rgba(0,0,0,0.1)",
                }}
              >
                x
              </button>
            </div>
          ))}
          {colors.length < 10 && (
            <button
              className="w-6 h-6 rounded-full bg-[#B5B5B5] text-white flex items-center justify-center"
              onClick={handleAddColor}
            >
              +
            </button>
          )}
          {showColorPicker && (
            <div className="absolute right-0 top-10">
              <Picker color={currentColor} onChangeComplete={handleChangeComplete} />
              <div className="flex justify-start mt-2">
                <button
                  className="custom-button p-2 pl-4 pr-4 mt-2 ml-4 mr-2 text-white rounded-2xl shadow-2xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveAdditionalColor();
                  }}
                >
                  Save
                </button>
                <button
                  className="custom-button p-2 pl-4 pr-4 mt-2 ml-64 text-white rounded-2xl shadow-2xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeColorPicker();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[#989BA0] pb-2">Ad templates</p>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
          {adImages.map((image, index) => (
            <img
              src={image.imageURL || image.generatedImageURL}
              alt=""
              key={index}
              className="w-full object-cover cursor-pointer rounded-md"
              onClick={() => setSelectedImage(image.imageURL || image.generatedImageURL)}
            />
          ))}
        </div>
        <div className="flex justify-end mt-6 mr-2 gap-4">
          <button
            className="w-fit custom-button rounded-[14px] text-white py-2 sm:py-2 px-10 sm:px-10 whitespace-pre font-medium text-xs sm:text-sm md:text-base lg:text-lg"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="w-fit custom-button rounded-[14px] text-white py-2 sm:py-2 px-10 sm:px-10 whitespace-pre font-medium text-xs sm:text-sm md:text-base lg:text-lg"
            onClick={handleNext}
          >
          Next
          </button>
        </div>
      </div>
    </div>
  );
}
