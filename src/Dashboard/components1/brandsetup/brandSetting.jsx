// brandSetting.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
// Example color picker component (adjust path to your actual file)
import Picker from "../colorPicker";

// Example local images (adjust to your actual paths):
import brandIcon from "../../../assets/dashboard_img/brand.svg";
import brandImage from "../../../assets/dashboard_img/brand_img.png";
import "./brandSetting.css";

// Adjust your real constants here:
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

// Icons
import { PiFileArrowUpDuotone } from "react-icons/pi";
import {
  FaChevronRight,
  FaChevronDown,
  FaRegLightbulb,
  FaCheck,
  FaPlus,
  FaBold,
  FaItalic,
  FaUnderline,
  FaPen,
} from "react-icons/fa";

/**
 * Main BrandSetting: manages the overall step-based flow (1 → 2 → 3).
 * Renders top-level layout: header, progress bar, and step content.
 */
export default function BrandSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const [response, setResponse] = useState(location.state || null);

  // Track step in local state or from `response`
  const initialStep = response?.step || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);

  // If no response, set up a default
  useEffect(() => {
    if (!response) {
      setResponse({
        step: 1,
        brandName: "Default Brand",
        logo: "https://via.placeholder.com/100",
        description: "This is a default description for manual setup.",
      });
    }
  }, [response]);

  return (
    <div className="flex-grow">
      <div
        className="max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col overflow-auto hide-scrollbar"
        style={{ maxHeight: "78vh" }}
      >
        {/* Header */}
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl lg:p-1 p-4">
          <div className="flex items-center ml-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl">
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" alt="Brand Icon" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#082a66] ml-4 md:mr-auto">
              Brand Setup
            </h1>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-24 h-12 sm:w-32 sm:h-16 md:w-[180px] md:h-[90px] 
                     lg:mr-20 sm:ml-4 md:m-auto hidden lg:block"
            />
          </div>
        </div>

        {/* Content + Progress Bar */}
        <div className="brand-setting-container p-6">
          <div className="header mb-6">
            <div className="progress-bar-brand flex items-center justify-center gap-4">
              <StepIndicator step={1} activeStep={currentStep} />
              <StepIndicator step={2} activeStep={currentStep} />
              <StepIndicator step={3} activeStep={currentStep} />
            </div>
          </div>

          {/* Render step content */}
          <div className="step-content">
            {currentStep === 1 && (
              <BrandDetails
                onNext={() => setCurrentStep(2)} // from Step 1 → Step 2
              />
            )}
            {currentStep === 2 && (
            <BrandOverview
              onPrev={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />)}
            {currentStep === 3 && <BrandAssets
              onPrev={() => setCurrentStep(2)}
            />}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Progress bar indicator for steps 1,2,3. */
function StepIndicator({ step, activeStep }) {
  const isDone = activeStep > step;
  return (
    <>
      <div className="progress-step">
        <div className="w-7 h-7 rounded-lg bg-[#082A66] flex items-center justify-center">
          <div
            className={`w-4 h-4 text-white font-semibold rounded-full ${
              isDone ? "bg-white" : "bg-[#082A66]"
            } flex items-center justify-center`}
          >
            {isDone ? (
              <svg
                className="w-3 h-3 text-[#082A66]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              step
            )}
          </div>
        </div>
      </div>
      {step < 3 && <div className="progress-line bg-gray-300 h-1 w-16"></div>}
    </>
  );
}

/** STEP 1: BrandDetails */
function BrandDetails({ onNext }) {
  // Multi-logo
  const [showUploadContainer, setShowUploadContainer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [imageToRemove, setImageToRemove] = useState(null);

  // Color picking
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState(null);
  const [customColor, setCustomColor] = useState("#000000");

  // 3-color palette
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(null);
  const [tempColor, setTempColor] = useState("#000000");
  const [newBgColor, setNewBgColor] = useState("#082A66");
  const [newTextColor, setNewTextColor] = useState("#ffffff");
  const [newEffectColor, setNewEffectColor] = useState("#cccccc");

  // Basic brand data
  const [formInputs, setFormInputs] = useState({
    brandName: "",
    brandDescription: "",
    brandLogos: [],
    primaryColors: ["#082A66", "#0A1B2C"],
    secondaryColors: ["#ffffff", "#cccccc"],
    domColors: ["#082A66", "#ffffff", "#000000"],
    colorPalettes: ["#082A66,#ffffff,#000000", "#cccccc,#dddddd,#eeeeee"],
    isEdit: false,
  });

  // Mock uploadImage
  const uploadImage = async (file) => {
    if (!file) return null;
    setIsUploading(true);
    setUploadFileName(file.name);
    setUploadProgress(0);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // mock delay
    setIsUploading(false);
    setUploadFileName("");
    setUploadProgress(0);
    // Return a local object URL so we can preview
    return URL.createObjectURL(file);
  };

  const handleMultipleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      setFormInputs((prev) => ({
        ...prev,
        brandLogos: [...prev.brandLogos, url],
      }));
      setShowUploadContainer(false);
    }
  };

  const handleRemoveLogo = () => {
    if (!imageToRemove) return;
    const updated = [...formInputs.brandLogos];
    updated.splice(imageToRemove.index, 1);
    setFormInputs((prev) => ({ ...prev, brandLogos: updated }));
    setShowRemoveModal(false);
    setImageToRemove(null);
  };

  // Color picking logic
  const handleColorSelect = (colorResult) => {
    setCustomColor(colorResult.hex);
  };
  const handleSaveAdditionalColor = () => {
    if (!colorPickerTarget) {
      setColorPickerOpen(false);
      return;
    }
    if (colorPickerTarget.type === "palette") {
      const { paletteIndex, colorIndex } = colorPickerTarget;
      setFormInputs((prev) => {
        const newPalettes = [...prev.colorPalettes];
        let sub = newPalettes[paletteIndex].split(",");
        sub[colorIndex] = customColor;
        newPalettes[paletteIndex] = sub.join(",");
        return { ...prev, colorPalettes: newPalettes };
      });
    } else if (colorPickerTarget.array) {
      const { array, index } = colorPickerTarget;
      setFormInputs((prev) => {
        const arr = [...prev[array]];
        if (index === null) {
          if (arr.length < 10) arr.push(customColor);
        } else {
          arr[index] = customColor;
        }
        return { ...prev, [array]: arr };
      });
    }
    setColorPickerOpen(false);
    setColorPickerTarget(null);
  };

  // 3-color palette
  const handleAddNewPalette = () => {
    setNewBgColor("#082A66");
    setNewTextColor("#ffffff");
    setNewEffectColor("#cccccc");
    setShowPaletteModal(true);
  };
  const handleSubColorChange = (c) => setTempColor(c.hex);
  const handleSubColorSave = () => {
    if (pickerOpen === "bg") setNewBgColor(tempColor);
    if (pickerOpen === "text") setNewTextColor(tempColor);
    if (pickerOpen === "effect") setNewEffectColor(tempColor);
    setPickerOpen(null);
  };
  const handlePaletteSave = () => {
    const p = `${newBgColor},${newTextColor},${newEffectColor}`;
    setFormInputs((prev) => ({
      ...prev,
      colorPalettes: [...prev.colorPalettes, p],
    }));
    setShowPaletteModal(false);
  };

  const handleNext = () => {
    // do validations, etc.
    onNext && onNext();
  };
  // ====== FONTS with pen icon & custom font logic ======
  // For simplicity, define a row for each style
  const [headingStyle, setHeadingStyle] = useState({
    fontFamily: "Open Sans",
    size: 32,
    bold: false,
    italic: false,
    underline: false,
    showMenu: false,
    isCustom: false,
    customFile: null,
  });
  const [subheadingStyle, setSubheadingStyle] = useState({
    fontFamily: "Roboto",
    size: 24,
    bold: false,
    italic: false,
    underline: false,
    showMenu: false,
    isCustom: false,
    customFile: null,
  });
  const [bodyStyle, setBodyStyle] = useState({
    fontFamily: "Arial",
    size: 16,
    bold: false,
    italic: false,
    underline: false,
    showMenu: false,
    isCustom: false,
    customFile: null,
  });
  const [ctaStyle, setCtaStyle] = useState({
    fontFamily: "Montserrat",
    size: 20,
    bold: true,
    italic: false,
    underline: false,
    showMenu: false,
    isCustom: false,
    customFile: null,
  });
  const [captionStyle, setCaptionStyle] = useState({
    fontFamily: "Lato",
    size: 14,
    bold: false,
    italic: false,
    underline: false,
    showMenu: false,
    isCustom: false,
    customFile: null,
  });

  // Common handlers
  const handleFontFamilyChange = (styleObj, setStyleObj, newValue) => {
    if (newValue === "CUSTOM_FONT") {
      setStyleObj({ ...styleObj, isCustom: true, fontFamily: "Custom Font" });
    } else {
      setStyleObj({ ...styleObj, fontFamily: newValue, isCustom: false });
    }
  };
  const handleFontFileUpload = async (e, styleObj, setStyleObj) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.success(`Selected custom font file: ${file.name}`);
    setStyleObj({ ...styleObj, customFile: file });
  };
  const handleSizeChange = (styleObj, setStyleObj, newSize) => {
    setStyleObj({ ...styleObj, size: newSize });
  };
  const toggleBold = (styleObj, setStyleObj) => {
    setStyleObj({ ...styleObj, bold: !styleObj.bold });
  };
  const toggleItalic = (styleObj, setStyleObj) => {
    setStyleObj({ ...styleObj, italic: !styleObj.italic });
  };
  const toggleUnderline = (styleObj, setStyleObj) => {
    setStyleObj({ ...styleObj, underline: !styleObj.underline });
  };

  // Render
  return (
    <div className="flex-grow pr-1">
      {/* BRAND NAME / DETAILS */}
      <div className="relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 bg-[rgba(252,252,252,0.25)]">
        <div className="flex items-center justify-between bg-[#F6F8FE] p-4 rounded-t-2xl">
          <div className="flex items-center">
            <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
              <FaRegLightbulb className="text-[#374151] text-xl" />
            </div>
            <p className="ml-3 lg:text-nowrap font-bold">Brand Details</p>
          </div>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Brand Name"
            name="brandName"
            value={formInputs.brandName}
            onChange={(e) => {
              const { name, value } = e.target;
              setFormInputs({ ...formInputs, [name]: value });
            }}
            className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] 
                       mb-2 bg-[#FCFCFC] focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* MULTI-LOGO */}
      <MultiLogoUpload
        formInputs={formInputs}
        setFormInputs={setFormInputs}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        uploadFileName={uploadFileName}
        showUploadContainer={showUploadContainer}
        setShowUploadContainer={setShowUploadContainer}
        showRemoveModal={showRemoveModal}
        setShowRemoveModal={setShowRemoveModal}
        imageToRemove={imageToRemove}
        setImageToRemove={setImageToRemove}
        handleMultipleLogoUpload={handleMultipleLogoUpload}
        handleRemoveLogo={handleRemoveLogo}
      />

      {/* BRAND COLORS */}
      <BrandColors
        formInputs={formInputs}
        setFormInputs={setFormInputs}
        colorPickerOpen={colorPickerOpen}
        setColorPickerOpen={setColorPickerOpen}
        colorPickerTarget={colorPickerTarget}
        setColorPickerTarget={setColorPickerTarget}
        customColor={customColor}
        setCustomColor={setCustomColor}
        handleColorSelect={handleColorSelect}
        handleSaveAdditionalColor={handleSaveAdditionalColor}
        handleAddNewPalette={handleAddNewPalette}
        showPaletteModal={showPaletteModal}
        setShowPaletteModal={setShowPaletteModal}
        pickerOpen={pickerOpen}
        setPickerOpen={setPickerOpen}
        tempColor={tempColor}
        setTempColor={setTempColor}
        newBgColor={newBgColor}
        newTextColor={newTextColor}
        newEffectColor={newEffectColor}
        handleSubColorChange={handleSubColorChange}
        handleSubColorSave={handleSubColorSave}
        handlePaletteSave={handlePaletteSave}
      />

      {/* BRAND FONTS (with pen icon) */}
      <div className="relative border border-[#fcfcfc] rounded-2xl mb-4 bg-[rgba(252,252,252,0.25)]">
        <div className="flex items-center justify-between bg-[#F6F8FE] p-4 rounded-t-2xl">
          <div className="flex items-center">
            <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
              <FaRegLightbulb className="text-[#374151] text-xl" />
            </div>
            <p className="ml-3">Brand Fonts</p>
          </div>
        </div>
        <div className="p-4">
          {/* Heading */}
          <FontRowPen
            label="Heading"
            styleObj={headingStyle}
            setStyleObj={setHeadingStyle}
            handleFontFamilyChange={handleFontFamilyChange}
            handleFontFileUpload={handleFontFileUpload}
            handleSizeChange={handleSizeChange}
            toggleBold={toggleBold}
            toggleItalic={toggleItalic}
            toggleUnderline={toggleUnderline}
          />
          {/* Subheading */}
          <FontRowPen
            label="Subheading"
            styleObj={subheadingStyle}
            setStyleObj={setSubheadingStyle}
            handleFontFamilyChange={handleFontFamilyChange}
            handleFontFileUpload={handleFontFileUpload}
            handleSizeChange={handleSizeChange}
            toggleBold={toggleBold}
            toggleItalic={toggleItalic}
            toggleUnderline={toggleUnderline}
          />
          {/* Body */}
          <FontRowPen
            label="Body"
            styleObj={bodyStyle}
            setStyleObj={setBodyStyle}
            handleFontFamilyChange={handleFontFamilyChange}
            handleFontFileUpload={handleFontFileUpload}
            handleSizeChange={handleSizeChange}
            toggleBold={toggleBold}
            toggleItalic={toggleItalic}
            toggleUnderline={toggleUnderline}
          />
          {/* CTA */}
          <FontRowPen
            label="CTA"
            styleObj={ctaStyle}
            setStyleObj={setCtaStyle}
            handleFontFamilyChange={handleFontFamilyChange}
            handleFontFileUpload={handleFontFileUpload}
            handleSizeChange={handleSizeChange}
            toggleBold={toggleBold}
            toggleItalic={toggleItalic}
            toggleUnderline={toggleUnderline}
          />
          {/* Caption */}
          <FontRowPen
            label="Caption"
            styleObj={captionStyle}
            setStyleObj={setCaptionStyle}
            handleFontFamilyChange={handleFontFamilyChange}
            handleFontFileUpload={handleFontFileUpload}
            handleSizeChange={handleSizeChange}
            toggleBold={toggleBold}
            toggleItalic={toggleItalic}
            toggleUnderline={toggleUnderline}
          />
        </div>
      </div>

      {/* Next Button -> Step 2 */}
      <div className="flex justify-end mt-4">
      <button
          className="custom-button p-2 px-6 text-white rounded-lg bg-blue-600 hover:bg-blue-700"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/** Step 2: BrandOverview (placeholder) */
function BrandOverview({ onPrev, onNext }) {
  const handlePrev = () => {
    onPrev && onPrev();
  };
  const handleNext = () => {
    onNext && onNext();
  };

  const [formData, setFormData] = useState({
    brandVoice: "",
    mission: "",
    vision: "",
    brandStory: "", // optional
    niche: "",      // optional
    targetAudience: "",
    audienceObjective: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  return (
    <div className="p-2 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Brand Overview</h2>

      {/* SECTION: Brand Voice, Mission, Vision */}
      <div className="mb-6 border border-[#FCFCFC] p-4 rounded-xl bg-[rgba(252,252,252,0.25)]">
        <h3 className="text-lg font-semibold mb-3">Brand Identity</h3>

        {/* Brand Voice */}
        <label className="block font-semibold mb-1" htmlFor="brandVoice">
          Brand Voice
        </label>
        <textarea
          id="brandVoice"
          name="brandVoice"
          value={formData.brandVoice}
          onChange={handleChange}
          placeholder="Describe your brand's tone, language, and overall voice..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* Mission */}
        <label className="block font-semibold mb-1" htmlFor="mission">
          Mission
        </label>
        <textarea
          id="mission"
          name="mission"
          value={formData.mission}
          onChange={handleChange}
          placeholder="Describe the mission of your brand..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* Vision */}
        <label className="block font-semibold mb-1" htmlFor="vision">
          Vision
        </label>
        <textarea
          id="vision"
          name="vision"
          value={formData.vision}
          onChange={handleChange}
          placeholder="Describe your brand's vision..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* (Optional) Brand Story */}
        <label className="block font-semibold mb-1" htmlFor="brandStory">
          Brand Story (Optional)
        </label>
        <textarea
          id="brandStory"
          name="brandStory"
          value={formData.brandStory}
          onChange={handleChange}
          placeholder="Briefly share your brand's story or background..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* (Optional) Niche */}
        <label className="block font-semibold mb-1" htmlFor="niche">
          Niche (Optional)
        </label>
        <textarea
          id="niche"
          name="niche"
          value={formData.niche}
          onChange={handleChange}
          placeholder="Describe your brand's specialized area or market focus..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={2}
        />
      </div>

      {/* SECTION: Audience Overview -> Target Audience, Audience Objective */}
      <div className="mb-6 border border-[#FCFCFC] p-4 rounded-xl bg-[#FCFCFC40]">
        <h3 className="text-lg font-semibold mb-3">Audience Overview</h3>

        {/* Target Audience */}
        <label className="block font-semibold mb-1" htmlFor="targetAudience">
          Target Audience
        </label>
        <textarea
          id="targetAudience"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          placeholder="Describe who your brand is primarily trying to reach..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* Audience Objective */}
        <label className="block font-semibold mb-1" htmlFor="audienceObjective">
          Audience Objective
        </label>
        <textarea
          id="audienceObjective"
          name="audienceObjective"
          value={formData.audienceObjective}
          onChange={handleChange}
          placeholder="Describe what you want your audience to do, feel, or achieve..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>

      {/* ACTION BUTTONS: Prev / Next */}
      <div className="flex justify-end gap-4 mt-4">
      <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={handlePrev}
        >
          Previous
        </button>
        <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}


/** Step 3: BrandAssets (placeholder) */
function BrandAssets({ onPrev, onFinish }) {
  // For icons (SVG) uploads
  const [icons, setIcons] = useState([
    // Example icon URLs or base64 data
    // "https://example.com/icon1.svg",
    // "https://example.com/icon2.svg",
  ]);

  const handlePrev = () => {
    onPrev && onPrev();
  };
  const handleFinish = () => {
    onFinish && onFinish();
  };

  const [showIconUpload, setShowIconUpload] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  // For media – example static set (Google, FB, Instagram)
  const [mediaItems, setMediaItems] = useState([
    {
      name: "Google",
      iconUrl: "src/assets/media/google.png",
      selected: false,
    },
    {
      name: "Facebook",
      iconUrl: "src/assets/media/meta.png",
      selected: false,
    },
    {
      name: "Instagram",
      iconUrl: "src/assets/media/insta.png",
      selected: false,
    },
  ]);

  // Handle file upload for a new icon
  const handleIconUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Optionally do validation, e.g., must be an .svg
    if (!file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Please upload an SVG file.");
      return;
    }

    // Example “uploading”
    setUploadingIcon(true);
    // Simulate an async upload or do real upload logic here:
    try {
      // ... e.g. post to server:
      // const url = await someUploadFunction(file);
      const url = URL.createObjectURL(file); // local preview fallback
      setIcons((prev) => [...prev, url]);
      toast.success("Icon uploaded!");
      setShowIconUpload(false);
    } catch (error) {
      console.error("Failed to upload icon:", error);
      toast.error("Failed to upload icon");
    } finally {
      setUploadingIcon(false);
    }
  };

  // Toggle media item selection
  const toggleMediaSelection = (index) => {
    setMediaItems((prev) => {
      const newArr = [...prev];
      newArr[index] = {
        ...newArr[index],
        selected: !newArr[index].selected,
      };
      return newArr;
    });
  };

 
  return (
    <div className="p-2 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Brand Assets</h2>

      {/** ICONS SECTION **/}
      <div className="mb-8 bg-[rgba(252,252,252,0.25)]  border border-[#FCFCFC] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-1">Icons</h3>
          <button
            className="flex items-center gap-1 text-[#082A66] hover:text-blue-800"
            onClick={() => setShowIconUpload((prev) => !prev)}
          >
            <FaPlus />
            <span>Add new</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Use these icons to visually convey a message or an action...
        </p>

        {/* Existing icons */}
        <div className="flex flex-wrap gap-4">
          {icons.map((iconUrl, i) => (
            <div key={i} className="relative w-20 h-20 border rounded-md bg-gray-100">
              <img
                src={iconUrl}
                alt={`Icon ${i + 1}`}
                className="w-full h-full object-contain p-2"
              />
            </div>
          ))}

          {/* Optional placeholders if no icons */}
          {icons.length === 0 && (
            <p className="text-gray-400 italic">
              No icons uploaded yet. Click &quot;Add new&quot; to upload an SVG.
            </p>
          )}
        </div>

        {/* Upload container for icons */}
        {showIconUpload && (
          <div className="border-2 border-dashed border-gray-400 bg-white rounded-lg p-3 mt-4 w-[200px] text-center relative">
            {uploadingIcon ? (
              <p className="text-sm text-gray-600 italic">Uploading...</p>
            ) : (
              <>
                <input
                  type="file"
                  accept=".svg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleIconUpload}
                />
                <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                  <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                  <span className="text-gray-500 text-sm">Upload an SVG file</span>
                </label>
              </>
            )}
          </div>
        )}
      </div>

      {/** MEDIA SECTION **/}
      <div className="mb-8 bg-[rgba(252,252,252,0.25)] rounded-xl p-4  border border-[#FCFCFC]">
        <h3 className="text-lg font-semibold mb-1">Media</h3>
        <p className="text-sm text-gray-600 mb-3">
          Select relevant media icons. Click an icon to toggle selection:
        </p>

        <div className="flex flex-wrap gap-4">
          {mediaItems.map((item, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-md bg-gray-50 border hover:shadow-md cursor-pointer"
              onClick={() => toggleMediaSelection(idx)}
            >
              {/* Icon preview */}
              <img
                src={item.iconUrl}
                alt={item.name}
                className="w-full h-full object-contain p-2"
              />

              {/* If selected => show top-right circle with check */}
              {item.selected && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <FaCheck className="text-white text-xs" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/** ACTION BUTTONS: Prev / Finish **/}
      <div className="flex justify-end gap-4 mt-6">
      <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={handlePrev}
        >
          Previous
        </button>
        <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleFinish}
        >
          Finish
        </button>
      </div>
    </div>
  );
}

/** 
 * MultiLogoUpload subcomponent
 */
function MultiLogoUpload({
  formInputs,
  setFormInputs,
  isUploading,
  uploadProgress,
  uploadFileName,
  showUploadContainer,
  setShowUploadContainer,
  showRemoveModal,
  setShowRemoveModal,
  imageToRemove,
  setImageToRemove,
  handleMultipleLogoUpload,
  handleRemoveLogo,
}) {
  return (
    <div className="relative border border-[#fcfcfc] p-0 rounded-2xl mb-4 bg-[rgba(252,252,252,0.25)]">
      <div className="flex items-center justify-between bg-[#F6F8FE] p-4 rounded-t-2xl">
        <div className="flex items-center">
          <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
            <FaRegLightbulb className="text-[#374151] text-xl" />
          </div>
          <p className="ml-3">Select Brand Logo(s)</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm mb-2">
          Upload up to 10 logos. A dark-colored logo with a transparent background is recommended.
        </p>

        {formInputs.brandLogos.length > 0 ? (
          <div className="flex flex-wrap gap-4 items-center mb-4">
            {formInputs.brandLogos.map((logoUrl, idx) => (
              <div key={idx} className="relative">
                <img
                  src={logoUrl}
                  alt={`Logo ${idx + 1}`}
                  className="w-28 h-28 object-cover rounded-md border border-gray-200"
                />
                <button
                  className="absolute top-1 right-1 bg-red-700 bg-opacity-50 text-white text-xs px-1 py-0.5 hover:bg-opacity-70"
                  onClick={() => {
                    setImageToRemove({ url: logoUrl, index: idx });
                    setShowRemoveModal(true);
                  }}
                >
                  X
                </button>
              </div>
            ))}
            {formInputs.brandLogos.length < 10 && (
              <button
                className="custom-button text-white w-10 h-10 rounded-lg border-4 border-[#FCFCFC] 
                           flex items-center justify-center hover:bg-[#1E1154]"
                onClick={() => setShowUploadContainer(true)}
                disabled={isUploading}
              >
                <FaPlus />
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic mb-4">No logos uploaded yet.</p>
        )}

        {showRemoveModal && imageToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl p-4 shadow-2xl max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2">Remove Logo</h3>
              <p className="mb-2 text-sm">Do you want to remove this logo?</p>
              <div className="flex items-center justify-center mb-4">
                <img
                  src={imageToRemove.url}
                  alt="Logo to delete"
                  className="w-24 h-16 object-cover rounded-md border border-gray-200"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleRemoveLogo}
                >
                  Yes, Remove
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowRemoveModal(false);
                    setImageToRemove(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {(showUploadContainer || formInputs.brandLogos.length === 0) &&
          formInputs.brandLogos.length < 10 && (
            <div className="border-2 border-[#fcfcfc] rounded-2xl p-2 mb-2 mt-2">
              <div className="bg-white rounded-xl m-1 p-2 shadow-lg">
                {isUploading && uploadFileName ? (
                  <div className="p-2 flex flex-col gap-2 items-start">
                    <p className="text-sm font-semibold text-gray-600">
                      Uploading: {uploadFileName}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `0%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">0%</span>
                  </div>
                ) : (
                  <div className="border-dashed border-2 border-gray-400 bg-white 
                                  rounded-lg p-2 text-center relative hover:border-gray-600 cursor-pointer">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleMultipleLogoUpload}
                    />
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                      <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                      <span className="text-gray-500">Upload a logo here</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

/**
 * BrandColors subcomponent:
 * Manages primaryColors, secondaryColors, plus 3-color palettes.
 */
function BrandColors({
  formInputs,
  setFormInputs,
  colorPickerOpen,
  setColorPickerOpen,
  colorPickerTarget,
  setColorPickerTarget,
  customColor,
  setCustomColor,
  handleColorSelect,
  handleSaveAdditionalColor,
  handleAddNewPalette,
  showPaletteModal,
  setShowPaletteModal,
  pickerOpen,
  setPickerOpen,
  tempColor,
  setTempColor,
  newBgColor,
  newTextColor,
  newEffectColor,
  handleSubColorChange,
  handleSubColorSave,
  handlePaletteSave,
}) {
  const getTextColor = (hex) => (hex.toLowerCase() === "#ffffff" ? "#000000" : "#ffffff");

  return (
    <div className="relative border border-[#fcfcfc] rounded-2xl mb-4 bg-[rgba(252,252,252,0.25)]">
      <div className="flex items-center justify-between bg-[#F6F8FE] p-4 rounded-t-2xl">
        <div className="flex items-center">
          <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
            <FaRegLightbulb className="text-[#374151] text-xl" />
          </div>
          <p className="ml-3">Brand Colors</p>
        </div>
      </div>
      <div className="p-4">
        {/* Primary */}
        <h3 className="font-semibold mb-2">Primary Colors</h3>
        <ColorArray
          arrayName="primaryColors"
          colorArray={formInputs.primaryColors}
          setFormInputs={setFormInputs}
          customColor={customColor}
          setCustomColor={setCustomColor}
          colorPickerOpen={colorPickerOpen}
          setColorPickerOpen={setColorPickerOpen}
          colorPickerTarget={colorPickerTarget}
          setColorPickerTarget={setColorPickerTarget}
          handleColorSelect={handleColorSelect}
          handleSaveAdditionalColor={handleSaveAdditionalColor}
        />

        {/* Secondary */}
        <h3 className="font-semibold mb-2 mt-4">Secondary Colors</h3>
        <ColorArray
          arrayName="secondaryColors"
          colorArray={formInputs.secondaryColors}
          setFormInputs={setFormInputs}
          customColor={customColor}
          setCustomColor={setCustomColor}
          colorPickerOpen={colorPickerOpen}
          setColorPickerOpen={setColorPickerOpen}
          colorPickerTarget={colorPickerTarget}
          setColorPickerTarget={setColorPickerTarget}
          handleColorSelect={handleColorSelect}
          handleSaveAdditionalColor={handleSaveAdditionalColor}
        />

        {/* 3-color Palettes */}
        <h3 className="font-semibold mb-2 mt-4">Color Palettes</h3>
        <div className="flex flex-wrap gap-4 mb-2">
          {formInputs.colorPalettes.map((paletteStr, idx) => {
            const subColors = paletteStr.split(",");
            return (
              <div
                key={idx}
                className="relative flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit"
              >
                <button
                  className="absolute top-1 right-1 text-xs text-white bg-red-600 px-2 rounded hover:bg-red-700"
                  onClick={() => {
                    const newArray = [...formInputs.colorPalettes];
                    newArray.splice(idx, 1);
                    setFormInputs({ ...formInputs, colorPalettes: newArray });
                  }}
                >
                  -
                </button>
                {subColors.map((c, sIdx) => (
                  <button
                    key={sIdx}
                    className="h-8 px-3 rounded-lg flex items-center justify-center font-normal text-sm cursor-pointer"
                    style={{
                      backgroundColor: c,
                      color: getTextColor(c),
                    }}
                    onClick={() => {
                      setColorPickerOpen(true);
                      setCustomColor(c);
                      setColorPickerTarget({
                        type: "palette",
                        paletteIndex: idx,
                        colorIndex: sIdx,
                      });
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <button
          className="custom-button text-white w-10 h-10 rounded-lg border-4 border-[#FCFCFC] 
                     flex items-center justify-center hover:bg-[#1E1154]"
          onClick={handleAddNewPalette}
        >
          <FaPlus className="text-white" />
        </button>
      </div>

      {/* 3-Color Palette Modal */}
      {showPaletteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-white rounded-xl p-4 shadow-2xl w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
              onClick={() => setShowPaletteModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">Add a New 3-Color Palette</h3>

            <div className="flex flex-col gap-3">
              <PaletteSubColor
                label="Background"
                color={newBgColor}
                setColor={setNewBgColor}
                pickerOpen={pickerOpen}
                setPickerOpen={setPickerOpen}
                tempColor={tempColor}
                setTempColor={setTempColor}
                targetName="bg"
              />
              <PaletteSubColor
                label="Text"
                color={newTextColor}
                setColor={setNewTextColor}
                pickerOpen={pickerOpen}
                setPickerOpen={setPickerOpen}
                tempColor={tempColor}
                setTempColor={setTempColor}
                targetName="text"
              />
              <PaletteSubColor
                label="Effects"
                color={newEffectColor}
                setColor={setNewEffectColor}
                pickerOpen={pickerOpen}
                setPickerOpen={setPickerOpen}
                tempColor={tempColor}
                setTempColor={setTempColor}
                targetName="effect"
              />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                className="custom-button p-2 px-4 text-white rounded-2xl shadow-2xl"
                onClick={handlePaletteSave}
              >
                Save
              </button>
              <button
                className="custom-button p-2 px-4 text-white bg-gray-400 rounded-2xl shadow-2xl"
                onClick={() => setShowPaletteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 
 * ColorArray subcomponent (primaryColors, secondaryColors, etc.)
 */
function ColorArray({
  arrayName,
  colorArray,
  setFormInputs,
  customColor,
  setCustomColor,
  colorPickerOpen,
  setColorPickerOpen,
  colorPickerTarget,
  setColorPickerTarget,
  handleColorSelect,
  handleSaveAdditionalColor,
}) {
  const getTextColor = (hex) => (hex.toLowerCase() === "#ffffff" ? "#000000" : "#ffffff");

  return (
    <div className="flex flex-wrap items-center gap-4 p-2">
      {colorArray.map((color, idx) => (
        <div key={idx} className="flex items-center bg-white p-1 rounded-xl">
          <button
            className="h-8 px-3 rounded-lg flex items-center justify-center font-normal text-sm cursor-pointer"
            style={{ background: color, color: getTextColor(color) }}
            onClick={() => {
              setCustomColor(color);
              setColorPickerTarget({ array: arrayName, index: idx });
              setColorPickerOpen(true);
            }}
          >
            {color}
          </button>
        </div>
      ))}
      {colorArray.length < 10 && (
        <button
          className="custom-button text-white w-10 h-10 rounded-lg border-4 border-[#FCFCFC] 
                     flex items-center justify-center hover:bg-[#1E1154]"
          onClick={() => {
            setCustomColor("#cccccc");
            setColorPickerTarget({ array: arrayName, index: null });
            setColorPickerOpen(true);
          }}
        >
          <FaPlus className="text-white" />
        </button>
      )}

      {colorPickerOpen && colorPickerTarget && colorPickerTarget.array === arrayName && (
        <div className="absolute z-10 p-2 shadow-xl rounded-md bg-white">
          <Picker color={customColor} onChangeComplete={handleColorSelect} />
          <div className="mt-2 flex gap-2">
            <button
              className="custom-button p-2 px-4 text-white rounded-2xl shadow-2xl"
              onClick={handleSaveAdditionalColor}
            >
              Save
            </button>
            <button
              className="custom-button p-2 px-4 text-white rounded-2xl shadow-2xl"
              onClick={() => {
                setColorPickerOpen(false);
                setColorPickerTarget(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** 
 * PaletteSubColor for the new 3-color palette modal.
 */
function PaletteSubColor({
  label,
  color,
  setColor,
  pickerOpen,
  setPickerOpen,
  tempColor,
  setTempColor,
  targetName,
}) {
  const getTextColor = (hex) => (hex.toLowerCase() === "#ffffff" ? "#000000" : "#ffffff");

  const handleOpenPicker = () => {
    setPickerOpen(targetName);
    setTempColor(color);
  };
  const handleColorChange = (c) => setTempColor(c.hex);
  const handleSavePicker = () => {
    setColor(tempColor);
    setPickerOpen(null);
  };

  return (
    <div className="flex items-center gap-2 relative">
      <label className="w-24 font-semibold">{label}</label>
      <div
        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: color, color: getTextColor(color) }}
        onClick={handleOpenPicker}
      >
        {color}
      </div>
      {pickerOpen === targetName && (
        <div className="absolute z-50 bg-white border border-gray-300 rounded shadow-xl p-2 ml-32">
          <Picker color={tempColor} onChangeComplete={handleColorChange} />
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="custom-button p-2 px-4 text-white rounded-2xl shadow-2xl"
              onClick={handleSavePicker}
            >
              Save
            </button>
            <button
              className="custom-button p-2 px-4 text-white bg-gray-400 rounded-2xl shadow-2xl"
              onClick={() => setPickerOpen(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** 
 * FontRowPen:
 * - Displays label + pen icon (no style text next to it).
 * - On pen click => toggles a collapsible menu with font options, size, bold/italic/underline, custom font upload, etc.
 */
function FontRowPen({
  label,
  styleObj,
  setStyleObj,
  handleFontFamilyChange,
  handleFontFileUpload,
  handleSizeChange,
  toggleBold,
  toggleItalic,
  toggleUnderline,
}) {
  const { fontFamily, size, bold, italic, underline, showMenu, isCustom, customFile } = styleObj;

  // Show a small preview inside the menu only
  const previewStyle = {
    fontFamily,
    fontSize: `${size}px`,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
  };

  return (
    <div className="mb-4 border-b border-gray-200 pb-2">
      {/* Row with label + pen icon (no style displayed here) */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setStyleObj({ ...styleObj, showMenu: !showMenu })}
      >
        <div className="font-semibold text-lg">{label}</div>
        <button className="p-1 text-gray-600 hover:text-black" type="button">
          <FaPen />
        </button>
      </div>

      {showMenu && (
        <div className="mt-2 p-2 bg-[#F6F8FE] rounded-xl">
          {/* Font Family DropDown */}
          <div className="flex items-center gap-2 mb-2">
            <label className="w-20">Font:</label>
            <select
              style={{ minWidth: 140 }}
              value={isCustom ? "CUSTOM_FONT" : fontFamily}
              onChange={(e) => handleFontFamilyChange(styleObj, setStyleObj, e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Lato">Lato</option>
              <option value="CUSTOM_FONT">Custom Font...</option>
            </select>
          </div>

          {/* If custom => show file upload */}
          {isCustom && (
            <div className="flex flex-col mb-2 p-2 border border-dashed border-gray-400 rounded-lg">
              {customFile ? (
                <div className="text-sm text-green-600">
                  Selected: {customFile.name}
                </div>
              ) : (
                <div className="text-sm text-gray-500 mb-1">Upload a font file (OTF/TTF)</div>
              )}
              <input
                type="file"
                accept=".otf,.ttf,.woff"
                onChange={(e) => handleFontFileUpload(e, styleObj, setStyleObj)}
              />
            </div>
          )}

          {/* Font Size */}
          <div className="flex items-center gap-2 mb-2">
            <label className="w-20">Size:</label>
            <input
              type="number"
              min={8}
              max={96}
              style={{ width: "60px" }}
              value={size}
              onChange={(e) => handleSizeChange(styleObj, setStyleObj, parseInt(e.target.value))}
            />
          </div>

          {/* B / I / U  toggles */}
          <div className="flex items-center gap-3 mb-2 ml-20">
            <button
              onClick={() => toggleBold(styleObj, setStyleObj)}
              style={{
                background: bold ? "#ccc" : "#fff",
                border: "1px solid #ccc",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              <FaBold />
            </button>
            <button
              onClick={() => toggleItalic(styleObj, setStyleObj)}
              style={{
                background: italic ? "#ccc" : "#fff",
                border: "1px solid #ccc",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              <FaItalic />
            </button>
            <button
              onClick={() => toggleUnderline(styleObj, setStyleObj)}
              style={{
                background: underline ? "#ccc" : "#fff",
                border: "1px solid #ccc",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              <FaUnderline />
            </button>
          </div>

          {/* Preview inside the menu */}
          <div className="p-2 border border-gray-300 rounded-md" style={previewStyle}>
            This is an example {label} preview
          </div>
        </div>
      )}
    </div>
  );
}
