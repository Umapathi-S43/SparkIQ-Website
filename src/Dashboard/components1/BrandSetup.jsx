import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import {
  FaChevronRight,
  FaChevronDown,
  FaRegLightbulb,
  FaCheck,
  FaPlus,
} from "react-icons/fa";
import Picker from "./colorPicker";
import brandImage from "../../assets/dashboard_img/brand_img.png";
import gallery from "../../assets/dashboard_img/gallerylogo.png";
import sound from "../../assets/dashboard_img/sound.png";
import brandIcon from "../../assets/dashboard_img/brand.svg"; // Adjust the path as needed
import "./brandsetup.css"; // Import the CSS file
import axios from "axios";

const BrandSetup = () => {
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandLogo, setBrandLogo] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [logoURL, setLogoURL] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [domColors, setDomColors] = useState(null);

  const [customColor, setCustomColor] = useState("#000000");
  const [additionalColors, setAdditionalColors] = useState([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState(null);
  const [completedSections, setCompletedSections] = useState({});
  const [expandedSection, setExpandedSection] = useState(1); // Open first section by default
  const navigate = useNavigate();

  useEffect(() => {
    setExpandedSection(1); // Open first section by default
  }, []);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBrandLogo(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleColorSelect = (color) => {
    setCustomColor(color.hex);
    if (colorPickerTarget !== null) {
      setAdditionalColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[colorPickerTarget] = color.hex;
        return newColors;
      });
    }
  };

  const handleSaveAdditionalColor = () => {
    if (additionalColors.length < 10 && colorPickerTarget === null) {
      setAdditionalColors([...additionalColors, customColor]);
    }
    setColorPickerOpen(false);
    setColorPickerTarget(null);
  };

  const handleSaveAndContinue = (section) => {
    const newCompletedSections = { ...completedSections };
    newCompletedSections[section] = true;
    setCompletedSections(newCompletedSections);
    setExpandedSection(section + 1); // Automatically open the next section
  };
  const baseUrl = "http://48.217.251.157:8083";

  const uploadImage = async () => {
    const uploadData = new FormData();
    uploadData.append("file", imageFile);
    uploadData.append("customerId", "123");

    try {
      const res = await axios.post(
        `${baseUrl}/sparkiq/image/upload`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLogoURL(res.data.data.url);
      alert("success upload");
      dominantColor(res.data.data.url);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const dominantColor = async (url) => {
    try {
      await axios
        .post(`${baseUrl}/sparkiq/ai/product/dominant-colors`, { url: url })
        .then((res) => {
          setDomColors(res.data.data.background_colors);
          alert("success dominant color");
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSection = (section) => {
    for (let i = 1; i < section; i++) {
      if (!completedSections[i]) {
        return;
      }
    }
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const handleCreateBrand = async () => {
    const newBrand = {
      id: "123",
      name: brandName,
      description: brandDescription,
      logoURL: logoURL,
      // productsCreated: 0,
    };
    try {
      await axios.post(`${baseUrl}/brand`, newBrand).then((res) => {
        alert("success brand");
        const storedBrands = JSON.parse(localStorage.getItem("brands")) || [];
        storedBrands.push(newBrand);
        localStorage.setItem("brands", JSON.stringify(storedBrands));
        localStorage.setItem("task1Completed", "true");

        navigate("/homepage");
        console.log(res);
      });
    } catch (error) {
      console.log(error);
    }

    // Update task progress in localStorage
  };

  const getDisplayText = (name, description) => {
    const upperCaseName = name.toUpperCase();
    if (upperCaseName.length >= 30) {
      return upperCaseName;
    }
    const maxLength = 30;
    const availableLength = maxLength - upperCaseName.length - 1;
    const truncatedDescription = description
      .split(" ")
      .reduce((acc, word) => {
        if (
          (acc + word.charAt(0).toUpperCase() + word.slice(1)).length <=
          availableLength
        ) {
          return acc + " " + word.charAt(0).toUpperCase() + word.slice(1);
        }
        return acc;
      }, "")
      .trim();
    return `${upperCaseName} ${truncatedDescription}`;
  };

  const handlePickerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="flex-grow">
      <div className="max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl lg:p-1 p-4">
          <div className="flex items-center ml-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl">
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#082a66] ml-4 md:mr-auto text-nowrap">
              Brand Setup
            </h1>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-24 h-12 sm:w-32 sm:h-16 md:w-[180px] md:h-[90px] lg:mr-20 sm:ml-4 md:m-auto hidden lg:block"
            />
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row p-8 w-full mb-2 overflow-y-auto hide-scrollbar"
          style={{ maxHeight: "64vh" }}
        >
          <div className="flex justify-center lg:justify-start mb-8 lg:mb-0 lg:mr-8">
            <div className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white rounded-3xl flex items-center justify-center">
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-[21rem] md:h-[20rem] bg-[#859398] rounded-3xl flex items-center justify-center">
                <div className="absolute w-36 h-28 sm:w-48 sm:h-40 bg-[rgba(255,255,255,0.24)] rounded-2xl flex items-center justify-center">
                  <img
                    src={brandLogo || gallery}
                    alt="Brand"
                    className="w-32 h-24 sm:w-36 sm:h-28 object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="absolute top-0 w-full flex flex-col items-center justify-center p-4 text-white">
                <h2 className="text-md sm:text-xl md:text-2xl font-bold capitalize md:pt-8 sm:pt-1">
                  {brandName}
                </h2>
                <p className="text-xs sm:text-base md:text-lg text-center">
                  {truncateText(brandDescription, 35)}
                </p>
              </div>
              <img
                src={sound}
                alt="Microphone"
                className="absolute top-0 right-2 w-6 h-6 sm:w-8 sm:h-8"
              />
            </div>
          </div>
          <div className="flex-grow pr-1">
            <div
              onClick={() => toggleSection(1)}
              className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${
                expandedSection === 1 ? "bg-[rgba(252,252,252,0.25)]" : ""
              }`}
            >
              {completedSections[1] && (
                <div className="absolute -top-3 -right-6 flex items-center bg-[#A7F3D0] text-[#059669] px-2 py-1 rounded-xl">
                  <div className="text-xs">Completed</div>
                  <FaCheck className="ml-1" />
                </div>
              )}
              <div
                className={`flex items-center justify-between ${
                  expandedSection === 1 ? "bg-[#F6F8FE]" : ""
                } p-4 rounded-t-2xl`}
              >
                <div className="flex items-center">
                  <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                    <FaRegLightbulb className="text-[#374151] text-xl" />
                  </div>
                  <p className="ml-3 lg:text-nowrap">
                    Write Brand Name & Description
                  </p>
                </div>
                {completedSections[1] && (
                  <div className="flex items-end bg-white rounded-2xl p-1 pl-2 pr-2 ml-2">
                    <p className="m-0 text-sm sm:text-base md:text-lg">
                      {getDisplayText(brandName, brandDescription)}
                    </p>
                  </div>
                )}
                <div>
                  {expandedSection === 1 ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </div>
              </div>
              {expandedSection === 1 && (
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Brand Name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] mb-2 bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <textarea
                    placeholder="Brand Description"
                    rows="3"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] mb-2 bg-[#FCFCFC] focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    className="custom-button p-2 pl-4 pr-4 text-white rounded-2xl shadow-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveAndContinue(1);
                    }}
                  >
                    Save and Continue
                  </button>
                </div>
              )}
            </div>
            <div
              onClick={() => toggleSection(2)}
              className={`relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 cursor-pointer ${
                expandedSection === 2 ? "bg-[rgba(252,252,252,0.25)]" : ""
              }`}
            >
              {completedSections[2] && (
                <div className="absolute -top-3 -right-6 flex items-center bg-[#A7F3D0] text-[#059669] px-2 py-1 rounded-xl">
                  <div className="text-xs">Completed</div>
                  <FaCheck className="ml-1" />
                </div>
              )}
              <div
                className={`flex items-center justify-between ${
                  expandedSection === 2 ? "bg-[#F6F8FE]" : ""
                } p-4 rounded-t-2xl`}
              >
                <div className="flex items-center">
                  <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                    <FaRegLightbulb className="text-[#374151] text-xl" />
                  </div>
                  <p className="ml-3 flex items-center justify-center">
                    Select Brand Logo
                  </p>
                </div>
                {completedSections[2] && brandLogo && (
                  <div className="flex items-center ml-auto bg-white rounded-lg p-1">
                    <img
                      src={brandLogo}
                      alt="Brand Logo"
                      className="w-12 h-7 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="ml-4">
                  {expandedSection === 2 ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </div>
              </div>
              {expandedSection === 2 && (
                <div className="p-4">
                  <p className="text-sm">
                    Upload your logo here. A dark-colored logo with a
                    transparent background is recommended.
                  </p>
                  <div className="border-2 border-[#fcfcfc] rounded-2xl m-2 p-1 ">
                    <div className="bg-white rounded-xl m-1 p-2 shadow-lg">
                      <div className="border-dashed border-2 border-gray-400 bg-white rounded-lg p-1 m-1 text-center cursor-pointer hover:border-gray-600 relative">
                        <input
                          type="file"
                          onChange={handleLogoUpload}
                          className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center h-full cursor-pointer"
                        >
                          <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                          <span className="text-gray-500 text-nowrap">
                            Upload a logo here
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    className="custom-button p-2 pl-4 pr-4 mt-4 text-white rounded-2xl shadow-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveAndContinue(2);
                      brandLogo && uploadImage();
                    }}
                  >
                    Save and Continue
                  </button>
                </div>
              )}
            </div>
            <div
              onClick={() => toggleSection(3)}
              className={`relative items-center border border-[#fcfcfc] p-0 rounded-2xl cursor-pointer ${
                expandedSection === 3 ? "bg-[rgba(252,252,252,0.25)]" : ""
              }`}
            >
              {completedSections[3] && (
                <div className="absolute -top-3 -right-6 flex items-center bg-[#A7F3D0] text-[#059669] px-2 py-1 rounded-xl">
                  <div className="text-xs">Completed</div>
                  <FaCheck className="ml-1" />
                </div>
              )}
              <div
                className={`flex items-center justify-between ${
                  expandedSection === 3 ? "bg-[#F6F8FE]" : ""
                } p-4 rounded-t-2xl`}
              >
                <div className="flex items-center">
                  <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                    <FaRegLightbulb className="text-[#374151] text-xl" />
                  </div>
                  <p className="ml-3">Extracted Brand Colors</p>
                </div>
                <div>
                  {expandedSection === 3 ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </div>
              </div>
              {expandedSection === 3 && (
                <div className="p-2" onClick={handlePickerClick}>
                  <div className="flex flex-wrap items-center gap-4 p-2 rounded-xl">
                    {domColors?.map((colors, index) => {
                      const rgbColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
                      return (
                        <div
                          key={index}
                          className="flex items-center bg-white p-2 rounded-xl"
                        >
                          <label className="text-sm pl-4 font-semibold lg:pr-14 pr-10 text-nowrap">
                            Brand Color {index}
                          </label>
                          <button
                            className="h-8 p-3 rounded-lg flex items-center justify-center text-white font-normal text-sm cursor-pointer"
                            style={{ background: rgbColor }}
                            onClick={() => {
                              setCustomColor(rgbColor);
                              setColorPickerTarget(null);
                              setColorPickerOpen(true);
                            }}
                          >
                            {rgbColor}
                          </button>
                        </div>
                      );
                    })}
                    {additionalColors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white p-2 rounded-xl"
                      >
                        <label className="text-sm pl-3 font-semibold lg:pr-9 pr-4 text-nowrap">
                          Additional Color {index + 1}
                        </label>
                        <button
                          className="h-8 p-3 rounded-lg flex items-center justify-center text-white font-normal text-sm cursor-pointer"
                          style={{ background: color }}
                          onClick={() => {
                            setCustomColor(color);
                            setColorPickerTarget(index);
                            setColorPickerOpen(true);
                          }}
                        >
                          {color}
                        </button>
                      </div>
                    ))}
                    {additionalColors.length < 10 && (
                      <button
                        className=" custom-button text-white w-10 h-10 rounded-lg border-4 border-[#FCFCFC] flex items-center justify-center hover:bg-[#1E1154]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setColorPickerTarget(null);
                          setColorPickerOpen(true);
                        }}
                      >
                        <FaPlus className="text-white" />
                      </button>
                    )}
                    {colorPickerOpen && (
                      <div className="absolute z-10 lg:w-full md:w-full sm:w-1/2">
                        <div className="flex justify-start">
                          <Picker
                            color={customColor}
                            onChangeComplete={handleColorSelect}
                          />
                        </div>
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
                            setColorPickerOpen(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="custom-button p-2 pl-4 pr-4 mt-4 text-white rounded-2xl shadow-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveAndContinue(3);
                      setIsDisable(false);
                    }}
                  >
                    Save and Continue
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-start mt-4">
              <button
                disabled={isDisable}
                className="custom-button p-2 pl-6 ml-2 pr-6 text-white rounded-lg disabled:opacity-50"
                onClick={handleCreateBrand}
              >
                Create Brand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;
