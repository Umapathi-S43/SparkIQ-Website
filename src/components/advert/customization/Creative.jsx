import React, { useState, useRef } from "react";
import { images, initialPhrases } from "./Data";
import Picker from "../../../Dashboard/components1/colorPicker";

export default function Creative({
  setRandomPhrase,
  setCaptionDetails,
  setSelectedImage,
  randomPhrase,
  captionDetails,
  setPage,
}) {
  const [colors, setColors] = useState(["#1138AC", "#008BC4"]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#fff");
  const [currentColorIndex, setCurrentColorIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [phrases, setPhrases] = useState(initialPhrases);
  const dropdownRef = useRef(null);

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
      setCurrentColorIndex(null); // Setting null for new color
    }
  };

  const handleChangeComplete = (color) => {
    setCurrentColor(color.hex);
  };

  const handleSaveAdditionalColor = () => {
    if (currentColorIndex !== null) {
      // Replace existing color
      const newColors = [...colors];
      newColors[currentColorIndex] = currentColor;
      setColors(newColors);
    } else {
      // Add new color
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
    if (id === "cta") {
      const truncatedValue = truncateText(value, 20);
      setCaptionDetails({ ...captionDetails, [id]: truncatedValue });
    } else {
      setCaptionDetails({ ...captionDetails, [id]: value });
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) : text;
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
    const shuffledPhrases = [...initialPhrases].sort(() => Math.random() - 0.5);
    setPhrases(shuffledPhrases);
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0; // Scroll to the top of the dropdown
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4 px-6">
      <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-[20px] p-2">
        {uploadedImage ? (
          <div className="border border-[#605880] border-dotted rounded-[20px] w-full flex gap-4 p-6 items-center justify-between">
            <div>
              <img
                src={uploadedImage}
                alt=""
                className="w-32 h-32 rounded-lg object-cover"
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
            className={`border border-[#605880] border-dotted rounded-[20px] w-full flex flex-col items-center justify-center py-6 ${
              isDragging ? "bg-blue-100" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <img src="/icon3.svg" alt="" width={24} />
            <div className="flex gap-2">
              <div>
                <label className="cursor-pointer">
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
      <div className="flex items-center justify-center my-5">
        <div className="flex-1 h-[1px] bg-[#ccc] mx-3"></div>
        <span className="text-sm">or edit these details</span>
        <div className="flex-1 h-[1px] bg-[#ccc] mx-3"></div>
      </div>
      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-xl py-4 px-5 flex items-center justify-between shadow">
        <span className="flex flex-col gap-3 w-full">
          <p className="text-[#9CA3AF] text-sm">Ad Content</p>
          <div className="relative flex items-center gap-4 bg-white shadow-lg rounded-2xl">
            <textarea
              className="bg-transparent border border-white  text-[#020817] text-sm w-full p-4 outline-none rounded-2xl"
              rows={1}
              id="content"
              onChange={handleOnchange}
              value={
                captionDetails.content ? captionDetails.content : randomPhrase
              }
            />
            <span
              className="flex items-center gap-2 absolute right-0 z-10 h-full cursor-pointer shadow-sm px-2 rounded-lg"
              onClick={toggleDropdown}
            >
              <img src="/icon7.svg" alt="" onClick={refreshPhrases} />
              <p className="text-[#000000B2] text-sm whitespace-pre">
                AI Assist
              </p>
            </span>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 w-80 bg-white shadow-md rounded-lg z-20 max-h-64 overflow-y-auto"
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
      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-xl py-4 px-5 flex items-center justify-between shadow">
        <span className="flex flex-col gap-3 w-full ">
          <p className="text-[#9CA3AF] text-sm">CTA</p>
          <input
            type="text"
            defaultValue="Discover More"
            className="bg-transparent border border-white text-[#020817] text-sm w-full p-4 outline-none bg-white rounded-2xl shadow-lg"
            id="cta"
            onChange={handleOnchange}
            value={captionDetails.cta}
          />
        </span>
      </div>
      <div className="p-6">
        <p className="text-sm text-[#989BA0]">Choose your color</p>
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
        <p className="text-sm text-[#989BA0] pb-2">Ad templates</p>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
          {images.map((image) => (
            <img
              src={image.img}
              alt=""
              key={image.id}
              className="w-full object-cover cursor-pointer"
              onClick={() => setSelectedImage(image.img)}
            />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="w-fit custom-button rounded-[20px] text-white py-3 px-10 whitespace-pre font-medium"
            onClick={() => setPage("adPreview")}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
