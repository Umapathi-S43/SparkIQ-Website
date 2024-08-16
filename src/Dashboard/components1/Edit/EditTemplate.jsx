import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTextHeight,
  FaImage,
  FaShapes,
  FaRegImages,
  FaUpload,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import brandImage from "../../../assets/dashboard_img/brand_img.png"; // Adjust the path as needed
import AdCreatives from "./AdCreatives"; // Import the AdCreatives component
import sample_img from "../../../assets/dashboard_img/ad_creatives_img.jpg"; // Adjust the path as needed
import TextFormatToolbar from "./Textformat";
import { Rnd } from "react-rnd";
import "./EditTemplate.css";
import { baseUrl } from "../../../components/utils/Constant";
import axios from "axios";
import Draggable from "react-draggable";
import { jwtToken } from "../../../components/utils/jwtToken";

const initialElements = [
  {
    id: 1,
    type: "image",
    src: sample_img,
    defaultPosition: { x: 80, y: 18 },
    defaultSize: { width: 250, height: 200 },
  },
  {
    id: 2,
    type: "text",
    content: "Surveying prisms - Geomatics",
    defaultPosition: { x: 24, y: 245 },
    defaultSize: { width: 300, height: 50 },
    style: {
      fontSize: "18px",
      fontFamily: "Arial",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
  },
  {
    id: 3,
    type: "text",
    content:
      "Surveyors and engineers to measure the change in position of a target that is assumed to be moving.",
    defaultPosition: { x: 20, y: 275 },
    defaultSize: { width: 360, height: 50 },
    style: {
      fontSize: "14px",
      fontFamily: "Arial",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
  },
  {
    id: 4,
    type: "button",
    content: "Learn More",
    defaultPosition: { x: 20, y: 335 },
    defaultSize: { width: 100, height: 40 },
    style: {
      fontSize: "14px",
      fontFamily: "Arial",
      backgroundColor: "blue",
      color: "white",
      textAlign: "center",
      lineHeight: "40px",
      borderRadius: "4px",
    },
  },
  {
    id: 5,
    type: "text",
    content: "https://geomatics.com",
    defaultPosition: { x: 120, y: 215 },
    defaultSize: { width: 300, height: 50 },
    style: {
      fontSize: "14px",
      fontFamily: "Arial",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
  },
  {
    id: 6,
    type: "text",
    content: "5675764267",
    defaultPosition: { x: 150, y: 345 }, // Position adjusted to be besides CTA
    defaultSize: { width: 100, height: 40 },
    style: {
      fontSize: "14px",
      fontFamily: "Arial",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
  },
];

export default function EditTemplate() {
  const [elements, setElements] = useState(initialElements);
  const [activeElementId, setActiveElementId] = useState(null);
  const [activeComponent, setActiveComponent] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [showAdCreatives, setShowAdCreatives] = useState(false);
  const [history, setHistory] = useState([initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const navigate = useNavigate();
  const templateRef = useRef();

  const [productDetails, setProductDetails] = useState(null);
  const [productForm, setProductForm] = useState({
    title: productDetails?.title || "",
    description: productDetails?.description || "",
    ctaButtonText: productDetails?.ctaButtonText || "",
    websiteAddressText: productDetails?.websiteAddressText || "",
    phoneNumberText: productDetails?.phoneNumberText || "",
  });
  console.log(productDetails, "productDetails");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productID = params.get("id");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }
        const response = await axios.get(
          `${baseUrl}/generated-images/${productID}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setProductDetails(response.data);
      } catch (error) {
        console.log("Failed to fetch product details.", error);
      }
    };
    fetchProductDetails();
  }, [productID]);

  useEffect(() => {
    if (productDetails) {
      setProductForm({
        title: productDetails.title || "",
        description: productDetails.description || "",
        ctaButtonText: productDetails.ctaButtonText || "",
        websiteAddressText: productDetails.websiteAddressText || "",
        phoneNumberText: productDetails.phoneNumberText || "",
      });
    }
  }, [productDetails]);

  const handleOnChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const saveHistory = (updatedElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleResize = (e, direction, ref, delta, id) => {
    const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, defaultSize: newSize } : el
    );
    setElements(updatedElements);
    saveHistory(updatedElements);
  };

  const handleDragStop = (e, d, id) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, defaultPosition: { x: d.x, y: d.y } } : el
    );
    setElements(updatedElements);
    saveHistory(updatedElements);
  };

  const handleClick = (id) => {
    setActiveElementId(id);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setElements(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setElements(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const setElementsAndSaveHistory = (updatedElements) => {
    setElements(updatedElements);
    saveHistory(updatedElements);
  };

  const onItemSelected = (item, tab) => {
    if (tab === "Templates") {
      setElementsAndSaveHistory(initialElements);
    } else if (tab === "Gradient Ads" || tab === "AI Backgrounds") {
      setBgColor(item.bgClass);
    } else if (tab === "Video Ads") {
      setElementsAndSaveHistory(
        initialElements.map((el, idx) => ({
          ...el,
          defaultPosition: { ...el.defaultPosition, x: idx * 10, y: idx * 10 },
        }))
      );
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("item"));
    setElementsAndSaveHistory([
      ...elements,
      { ...item, id: elements.length + 1 },
    ]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e, id) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, content: e.target.value } : el
    );
    setElements(updatedElements);
    saveHistory(updatedElements);
  };

  const handleExport = async () => {
    if (templateRef.current) {
      const canvas = await html2canvas(templateRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "template.png";
      link.click();
    }
  };

  const handleSaveAndNext = async () => {
    setActiveElementId(null); // Deselect any selected elements
    setTimeout(async () => {
      if (templateRef.current) {
        const canvas = await html2canvas(templateRef.current);
        const image = canvas.toDataURL("image/png");
        navigate("/CustomSample", {
          state: {
            image,
          },
        });
      }
    }, 100); // Wait for the deselection to render
  };

  const titleSuggestions = [
    "Surveying prisms - Geomatics",
    "Geomatics-prims",
    "Surveying prism",
    "Optical survey prism",
    "Mini prism",
  ];
  const descriptionSuggestions = [
    "Surveyors and engineers to measure the change in position of a target that is assumed to be moving.",
    "Geometric precision for your surveys.",
    "Accurate and reliable surveying.",
    "Precision instruments for surveying.",
    "High-quality surveying prisms.",
  ];
  const ctaSuggestions = ["Learn More", "Discover More", "Explore More"];

  const [showSuggestions, setShowSuggestions] = useState({
    title: false,
    description: false,
    cta: false,
  });

  const [suggestions, setSuggestions] = useState({
    title: titleSuggestions,
    description: descriptionSuggestions,
    cta: ctaSuggestions,
  });

  const toggleSuggestions = (field) => {
    setShowSuggestions((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSuggestionClick = (field, suggestion) => {
    const updatedElements = elements.map((el) => {
      if (field === "title" && el.id === 2)
        return { ...el, content: suggestion };
      if (field === "description" && el.id === 3)
        return { ...el, content: suggestion };
      if (field === "cta" && el.id === 4) return { ...el, content: suggestion };
      return el;
    });
    setElementsAndSaveHistory(updatedElements);
    setShowSuggestions((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const [element, setElement] = useState({
    logo: { x: 0, y: 0, width: 216, height: 113 },
    title: {
      x: 43,
      y: 810,
      fontSize: 70,
      text: "Managing\nHypertension Effectively",
    },
    description: {
      x: 54,
      y: 367,
      fontSize: 40,
      text: "- Uncontrolled blood pressure risks\n- Increased stroke and heart failure\n- Arjuna for hypertension control",
    },
    ctaButton: { x: 669, y: 194, width: 221, height: 97, text: "Act Now" },
    phoneNumber: { x: 95, y: 194, text: "8688423165" },
  });

  const handleDrag = (e, data, key) => {
    setElement((prev) => ({
      ...prev,
      [key]: { ...prev[key], x: data.x, y: data.y },
    }));
  };

  return (
    <div className="min-h-screen p-2 bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col items-center justify-center">
      <div
        className="border-2 border-white rounded-[32px] w-full"
        style={{ height: "calc(100vh - 1rem)" }}
      >
        <div className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-t-[32px] p-6 w-full">
          <span className="flex items-center gap-2">
            <img src="/icon5.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl">
                Template Customization
              </h4>
              <p className="text-[#374151] text-sm">
                Customize your ad based on your preferences.
              </p>
            </span>
          </span>
          <img
            src={brandImage}
            alt="Brand Banner"
            className="-mb-5 right-24 w-36 hidden lg:block"
          />
        </div>
        <div className="flex">
          <div className="p-4 w-1/12">
            <Sidebar
              setActiveComponent={setActiveComponent}
              setShowAdCreatives={setShowAdCreatives}
            />
          </div>
          <div className="flex-row relative w-full m-4 ml-0">
            <div
              className="flex items-center justify-between p-4 w-full bg-[#FCFCFC40] shadow-lg rounded-md mt-1"
              style={{ height: "8vh" }}
            >
              <div className="flex">
                <button
                  onClick={handleUndo}
                  className="rounded mr-2 relative group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3"
                    />
                  </svg>
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-[#082A66] text-white text-xs rounded px-1 py-0.5 hidden group-hover:block">
                    Undo
                  </span>
                </button>
                <button
                  onClick={handleRedo}
                  className="rounded mr-2 relative group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 15l6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                    />
                  </svg>
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-[#082A66] text-white text-xs rounded px-1 py-0.5 hidden group-hover:block">
                    Redo
                  </span>
                </button>
                {activeComponent === "Text" && (
                  <TextFormatToolbar onClose={() => setActiveComponent("")} />
                )}
              </div>
              <div className="flex">
                <button
                  onClick={() => navigate("/campaigns")}
                  className="flex bg-red-500 text-white py-1 px-4 rounded mr-2"
                >
                  Close
                </button>
                <button
                  onClick={handleExport}
                  className="custom-button text-white py-1 px-4 rounded mr-2"
                >
                  Export
                </button>
                <button
                  onClick={handleSaveAndNext}
                  className="custom-button text-white py-1 px-4 rounded"
                >
                  Save & Next
                </button>
              </div>
            </div>
            <div
              className="flex flex-cols-2 justify-end relative w-full shadow-lg rounded-md m-4 ml-0 "
              style={{ height: "calc(100vh - 15rem)" }}
            >
              <div className="w-1/2 h-[450px] flex flex-col items-start p-4 mr-12 mt-0 pt-0">
                {showAdCreatives ? (
                  <AdCreatives
                    onItemSelected={onItemSelected}
                    onClose={() => setShowAdCreatives(false)}
                  />
                ) : (
                  <div className="flex flex-col h-[450px] space-y-4 rounded-xl mt-8 bg-[#FCFCFC20] shadow-md border border-[#FCFCFC] py-4 px-10">
                    <div className="flex items-center mt-4">
                      <label className="w-1/4">Title:</label>
                      <div className="relative flex-1">
                        <div className="flex flex-row">
                          <input
                            type="text"
                            name="title"
                            value={productForm.title}
                            onChange={handleOnChange}
                            className="input lg:w-[387px] w-3/4 py-2 px-4 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                          />
                          <button
                            className="flex items-center shadow-lg bg-[#FCFCFC60] border-2 px-3 rounded-md py-1 ml-2"
                            onClick={() => toggleSuggestions("description")}
                          >
                            <img
                              src="icon7.svg"
                              className="w-7 h-7 cursor-pointer -mt-1"
                            />
                            <p className="text-xs ml-1 text-nowrap">
                              AI Assist
                            </p>
                          </button>
                        </div>
                        {showSuggestions.title && (
                          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md">
                            {suggestions.title.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() =>
                                  handleSuggestionClick("title", suggestion)
                                }
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-1/4">Description:</label>
                      <div className="relative flex-1">
                        <div className="flex flex-row">
                          <textarea
                            value={productForm.description}
                            name="description"
                            onChange={handleOnChange}
                            className="textarea lg:w-[387px] w-3/4 py-2 px-4 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none hide-scrollbar"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onClick={() => setActiveComponent("Text")}
                          />
                          <div className="py-3">
                            <button
                              className="flex items-center shadow-lg bg-[#FCFCFC60] border-2 px-3 rounded-md py-1 ml-2"
                              onClick={() => toggleSuggestions("description")}
                            >
                              <img
                                src="icon7.svg"
                                className="w-7 h-7 cursor-pointer -mt-1"
                              />
                              <p className="text-xs ml-1 text-nowrap">
                                AI Assist
                              </p>
                            </button>
                          </div>
                        </div>
                        {showSuggestions.description && (
                          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md">
                            {suggestions.description.map(
                              (suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                  onClick={() =>
                                    handleSuggestionClick(
                                      "description",
                                      suggestion
                                    )
                                  }
                                >
                                  {suggestion}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-1/4">CTA:</label>
                      <div className="relative flex-1">
                        <div className="flex flex-row">
                          <input
                            type="text"
                            value={productForm.ctaButtonText}
                            name="ctaButtonText"
                            onChange={handleOnChange}
                            className="input lg:w-[387px] w-3/4 py-2 px-4 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                          />
                          <button
                            className="flex items-center shadow-lg bg-[#FCFCFC60] border-2 px-3 rounded-md py-1 ml-2"
                            onClick={() => toggleSuggestions("description")}
                          >
                            <img
                              src="icon7.svg"
                              className="w-7 h-7 cursor-pointer -mt-1"
                            />
                            <p className="text-xs ml-1 text-nowrap">
                              AI Assist
                            </p>
                          </button>
                        </div>
                        {showSuggestions.cta && (
                          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md">
                            {suggestions.cta.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                onClick={() =>
                                  handleSuggestionClick("cta", suggestion)
                                }
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-1/4">Website:</label>
                      <input
                        type="text"
                        value={productForm.websiteAddressText}
                        name="websiteAddressText"
                        onChange={handleOnChange}
                        className="input lg:w-[550px] w-3/4 py-2 px-4 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-1/4">Phone Number:</label>
                      <input
                        type="text"
                        value={productForm.phoneNumberText}
                        name="phoneNumberText"
                        onChange={handleOnChange}
                        className="input lg:w-[550px] w-3/4 py-2 px-4 rounded-lg focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="border shadow-sm justify-center bg-striped mx-auto p-0 pl-14 pt-2 m-1 ">
                <div
                  className="w-[400px] h-[400px] bg-[#FCFCFC] rounded-lg flex flex-col items-center p-4 mr-12 mt-8 hover:ring-2 hover:ring-blue-400"
                  style={{ backgroundImage: `url(${productDetails?.logoUrl})` }}
                >
                  <Draggable
                    position={{ x: element.logo.x, y: element.logo.y }}
                    onStop={(e, data) => handleDrag(e, data, "logo")}
                  >
                    <div
                      className="draggable-element"
                      style={{
                        width: element.logo.width,
                        height: element.logo.height,
                      }}
                    >
                      <img
                        src={productDetails?.imageURL}
                        alt="Logo"
                        width={250}
                        height={200}
                      />
                    </div>
                  </Draggable>

                  <Draggable onStop={(e, data) => handleDrag(e, data, "title")}>
                    <div>{productForm.title}</div>
                  </Draggable>

                  <Draggable
                    onStop={(e, data) => handleDrag(e, data, "description")}
                  >
                    <div>{productForm.description}</div>
                  </Draggable>

                  <Draggable
                    onStop={(e, data) => handleDrag(e, data, "ctaButton")}
                  >
                    <button
                      className="bg-blue-600 leading-10 px-8 rounded text-center text-white text-sm"
                      style={{
                        width: productDetails?.ctaButtonWidth,
                        height: productDetails?.ctaButtonHeight,
                      }}
                    >
                      {productForm.ctaButtonText}
                    </button>
                  </Draggable>

                  <Draggable
                    onStop={(e, data) => handleDrag(e, data, "phoneNumber")}
                  >
                    <div className="draggable-element">
                      {productForm.phoneNumberText}
                    </div>
                  </Draggable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Sidebar = ({ setActiveComponent, setShowAdCreatives }) => {
  return (
    <div
      className="flex flex-col items-center p-3 rounded-[12px] bg-[#FCFCFC40] shadow-lg"
      style={{ height: "calc(100vh - 10rem)" }}
    >
      <button
        className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
        onClick={() => {
          setActiveComponent("Creatives");
          setShowAdCreatives(true);
        }}
      >
        <img src="/icon5.svg" alt="Icon" className="w-8 h-8" />
        <span className="text-sm">Creatives</span>
      </button>
      <div className="flex flex-col items-center justify-center space-y-2 mt-4">
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent("Text")}
        >
          <FaTextHeight />
          <span className="text-sm">Text</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent("Image")}
        >
          <FaImage />
          <span className="text-sm">Image</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent("Shape")}
        >
          <FaShapes />
          <span className="text-sm">Shape</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent("Frame")}
        >
          <FaRegImages />
          <span className="text-sm">Frame</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent("Uploads")}
        >
          <FaUpload />
          <span className="text-sm">Uploads</span>
        </button>
      </div>
    </div>
  );
};
