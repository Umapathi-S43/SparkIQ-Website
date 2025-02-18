import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// For cropping
import Cropper from "react-easy-crop";

import {
  FaTrash,
  FaRegLightbulb,
  FaCheck,
  FaPlus,
  FaBold,
  FaItalic,
  FaUnderline,
  FaPen,
  FaSyncAlt, // rotation icon
} from "react-icons/fa";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import { MdDone, MdClose } from "react-icons/md";

import Picker from "../colorPicker"; // or wherever your colorPicker is
import brandIcon from "../../../assets/dashboard_img/brand.svg";
import brandImage from "../../../assets/dashboard_img/brand_img.png";
import "./brandSetting.css"; // Make sure this includes the spinner/overlay CSS

import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

/* ----------------------------------------------------
   1) Utility to upload images (returns a final URL)
---------------------------------------------------- */
async function uploadImage(file, setIsUploading) {
  if (!file) return null;
  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("customerId", "123");

  setIsUploading(true);
  try {
    if (!jwtToken) throw new Error("No JWT token found. Please log in.");

    const res = await axios.post(`${baseUrl}/sparkiq/image/upload`, uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const imageUrl = res.data?.data?.url;
    toast.success("File upload successful");
    return imageUrl;
  } catch (error) {
    toast.error("File upload failed. Please try again.");
    return null;
  } finally {
    setIsUploading(false);
  }
}

/* ----------------------------------------------------
   2) Utility to create a cropped image blob
      (React Easy Crop approach)
---------------------------------------------------- */
async function getCroppedImg(imageSrc, croppedAreaPixels, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Calculate bounding box of the rotated image
  const { width, height } = getRadianBoundBox(
    image.width,
    image.height,
    rotation
  );

  canvas.width = width;
  canvas.height = height;

  // Move the origin to the center of the canvas
  ctx.translate(width / 2, height / 2);
  // Rotate around that point
  ctx.rotate((rotation * Math.PI) / 180);
  // Move the image so it’s centered on that point
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Now we crop from the rotated image
  const data = ctx.getImageData(0, 0, width, height);
  // Offscreen canvas for the actual final crop
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = croppedAreaPixels.width;
  finalCanvas.height = croppedAreaPixels.height;
  const finalCtx = finalCanvas.getContext("2d");

  // Put the rotated image onto the final canvas
  finalCtx.putImageData(
    data,
    -croppedAreaPixels.x,
    -croppedAreaPixels.y
  );

  return new Promise((resolve, reject) => {
    finalCanvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

// Create an HTMLImageElement
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

// Utility for bounding box of rotated rectangle
function getRadianBoundBox(width, height, rotation) {
  const rad = (Math.abs(rotation) * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height:
      Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

/* ----------------------------------------------------
   3) Extract brand colors from a single selected logo
---------------------------------------------------- */
async function fetchBrandColors(logoURL) {
  if (!logoURL) return null;
  try {
    const endpoint = `${baseUrl}/v2/api/brands/extract/colors?logoURL=${encodeURIComponent(
      logoURL
    )}`;
    const res = await axios.post(
      endpoint,
      {},
      {
        headers: { Authorization: `Bearer ${jwtToken}` },
      }
    );
    return res.data?.data || [];
  } catch (err) {
    toast.error("Could not extract brand colors from logo");
    return null;
  }
}

/* ----------------------------------------------------
   4) Extract color palettes from combined colors
---------------------------------------------------- */
async function fetchColorPalette(allColors) {
  if (!allColors?.length) return [];
  const joined = encodeURIComponent(allColors.join(","));
  try {
    const endpoint = `${baseUrl}/v2/api/brands/extract/colorspalette?colors=${joined}`;
    const res = await axios.post(endpoint, null, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = res.data?.data || [];
    return data.map((p) => p.palette);
  } catch (err) {
    toast.error("Could not generate color palettes");
    return [];
  }
}

/* ----------------------------------------------------
   MAIN COMPONENT: BrandSetting
---------------------------------------------------- */
export default function BrandSetting() {
  const navigate = useNavigate();
  const location = useLocation();

  // Attempt to load brandId from route or state
  const params = new URLSearchParams(location.search);
  const brandNameFromUrl = params.get("id") || location.state?.id || null;
  const brandInfo = location.state?.response || null;

  const initialStep = location.state?.step || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Single brandData state
  const [brandData, setBrandData] = useState({
    id: null,
    websiteUrl: "",
    brandName: "",
    brandVoice: "",
    mission: "",
    vision: "",
    brandStory: "",
    niche: "",
    targetAudience: "",
    audienceObjective: "",
    // We'll store an array of "logo objects"
    // each has { id, logoName, logoOriginalUrl, logoUrl, brandId, cropX, cropY, cropWidth, cropHeight, rotation }
    logos: [],
    selectedLogos: [],
    colors: {
      primary: ["#082A66"], // default
      secondary: ["#ffffff"], // default
    },
    colorPalettes: ["#082A66,#ffffff,#000000"],
    fonts: [
      {
        id: "heading",
        role: "Heading",
        fontFamily: "Open Sans",
        size: 32,
        bold: false,
        italic: false,
        underline: false,
        isCustom: false,
        customFile: null,
        isEditing: false,
      },
      {
        id: "body",
        role: "Body",
        fontFamily: "Arial",
        size: 16,
        bold: false,
        italic: false,
        underline: false,
        isCustom: false,
        customFile: null,
        isEditing: false,
      },
      {
        id: "caption",
        role: "Caption",
        fontFamily: "Lato",
        size: 14,
        bold: false,
        italic: false,
        underline: false,
        isCustom: false,
        customFile: null,
        isEditing: false,
      },
    ],
    brandElements: [],
  });

  // 1) If brandInfo is passed, map it
  useEffect(() => {
    if (brandInfo) {
      mapFoundBrandToState(brandInfo, setBrandData);
    }
  }, [brandInfo]);

  // 2) Or fetch brand by ID from the URL
  useEffect(() => {
    async function fetchBrandById() {
      if (!jwtToken || !brandNameFromUrl) return;
      try {
        const response = await axios.get(`${baseUrl}/v2/api/brands/${brandNameFromUrl}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const foundBrand = response?.data?.data;
        if (foundBrand) {
          mapFoundBrandToState(foundBrand, setBrandData);
        }
      } catch (error) {
        toast.error("Error fetching brand by ID.");
      }
    }
    if (!brandInfo) fetchBrandById();
  }, [brandNameFromUrl]);

  // Step navigation
  const goNextStep = () => setCurrentStep((s) => s + 1);
  const goPrevStep = () => setCurrentStep((s) => s - 1);

  // Final "Finish": if brandData.id => update brand, else create brand
  const handleFinish = async () => {
    const finalJson = buildFinalBrandPayload(brandData);
    try {
      if (!jwtToken) throw new Error("No JWT token found. Please log in.");

      if (brandData.id) {
        
        console.log("Creating brand...", finalJson);
        await axios.post(`${baseUrl}/v2/api/brands?update=true`, finalJson, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        toast.success("Brand updated successfully");
      } else {
        console.log("Creating brand...", finalJson);
        await axios.post(`${baseUrl}/v2/api/brands`, finalJson, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        toast.success("Brand created successfully");
      }
      navigate("/homepage");
    } catch (error) {
      toast.error("Failed to save brand.");
    }
  };

  return (
    <div className="flex-grow">
      <div
        className="max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col overflow-auto hide-scrollbar"
        style={{ maxHeight: "78vh" }}
      >
        {/* Header */}
        <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl p-4">
          <div className="flex items-center ml-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[rgba(0,39,153,0.15)] rounded-2xl">
              <div className="relative w-8 h-8 bg-[#082A66] rounded-xl flex items-center justify-center">
                <img src={brandIcon} className="w-4 h-4" alt="Brand Icon" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#082a66] ml-4 md:mr-auto">
              {brandData.id ? "Edit Brand" : "Brand Setup"}
            </h1>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-24 h-12 sm:w-32 sm:h-16 md:w-[180px] md:h-[90px] 
                     lg:mr-20 sm:ml-4 md:m-auto hidden lg:block"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="brand-setting-container p-6">
          <div className="header mb-6">
            <div className="progress-bar-brand flex items-center justify-center gap-4">
              <StepIndicator step={1} activeStep={currentStep} />
              <StepIndicator step={2} activeStep={currentStep} />
              <StepIndicator step={3} activeStep={currentStep} />
            </div>
          </div>

          {/* Steps */}
          <div className="step-content">
            {currentStep === 1 && (
              <BrandDetails
                brandData={brandData}
                setBrandData={setBrandData}
                onNext={goNextStep}
              />
            )}
            {currentStep === 2 && (
              <BrandOverview
                brandData={brandData}
                setBrandData={setBrandData}
                onPrev={goPrevStep}
                onNext={goNextStep}
              />
            )}
            {currentStep === 3 && (
              <BrandAssets
                brandData={brandData}
                setBrandData={setBrandData}
                onPrev={goPrevStep}
                onFinish={handleFinish}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   Helper: Map brand response => local brandData
---------------------------------------------------- */
function mapFoundBrandToState(foundBrand, setBrandData) {
  if (!foundBrand) return;
  setBrandData((prev) => ({
    ...prev,
    id: foundBrand.id || null,
    websiteUrl: foundBrand.websiteUrl || "",
    brandName: foundBrand.brandName || "",
    brandVoice: foundBrand.brandVoice || "",
    mission: foundBrand.mission || foundBrand.brandMission || "",
    vision: foundBrand.vision || foundBrand.brandVision || "",
    brandStory: foundBrand.brandStory || "",
    niche: foundBrand.niche || "",
    targetAudience: foundBrand.targetAudience || "",
    audienceObjective: foundBrand.audienceObjective || "",
    logos: (foundBrand.logos || []).map((lg) => ({
      id: lg.id || "",
      logoName: lg.logoName || "Custom Logo",
      logoUrl: lg.logoUrl ||lg.logos.logoUrl|| "",
      logoOriginalUrl: lg.logoOriginalUrl || "",
      brandId: foundBrand.id || "",
      cropX: lg.cropX || 0,
      cropY: lg.cropY || 0,
      cropWidth: lg.cropWidth || 0,
      cropHeight: lg.cropHeight || 0,
     // rotation: lg.rotation || 0,
    })),
    selectedLogos: [],
    colors: parseColorsToState(foundBrand.colors || []),
    colorPalettes: (foundBrand.colorPalettes || []).map((cp) => cp.palette),
    brandElements: (foundBrand.brandElements || []).map((elem) => ({
      id: elem.id || "",
      name: elem.name || "Icon",
      url: elem.url || "",
      brandId: foundBrand.id || "",
    })),
    fonts: parseFontsToState(foundBrand.fonts || []),
  }));
}

function parseColorsToState(apiColors) {
  const primaryArr = [];
  const secondaryArr = [];
  apiColors.forEach((c) => {
    if (c.type.toLowerCase() === "primary") {
      primaryArr.push(...c.colorCode.split(",").map((col) => col.trim()));
    } else if (c.type.toLowerCase() === "secondary") {
      secondaryArr.push(...c.colorCode.split(",").map((col) => col.trim()));
    }
  });
  if (primaryArr.length < 1) primaryArr.push("#082A66");
  if (secondaryArr.length < 1) secondaryArr.push("#ffffff");
  return { primary: primaryArr, secondary: secondaryArr };
}

function parseFontsToState(apiFonts) {
  return apiFonts.map((f) => {
    const isCustom = f.type === "CUSTOM";
    return {
      id: f.id || "",
      role: f.name || "Title",
      fontFamily: isCustom ? "Custom Font" : f.name,
      size: parseInt(f.fontSize, 10) || 16,
      bold: f.fontWeight === "bold",
      italic: f.fontStyle === "italic",
      underline: false,
      isCustom,
      customFile: null,
      isEditing: false,
    };
  });
}

/* ----------------------------------------------------
   Build final JSON payload
---------------------------------------------------- */
function buildFinalBrandPayload(brandData) {
  const {
    id,
    websiteUrl,
    brandName,
    logos,
    colors,
    colorPalettes,
    brandElements,
    fonts,
    brandVoice,
    mission,
    vision,
    brandStory,
    niche,
    targetAudience,
    audienceObjective,
  } = brandData;

  const logoObjects = logos.map((lg) => ({
    id: lg.id || "",
    logoName: lg.logoName || "Custom Logo",
    logoUrl: lg.logoUrl || "",
    logoOriginalUrl: lg.logoOriginalUrl || "",
    brandId: id || "",
    cropX: lg.cropX || 0,
    cropY: lg.cropY || 0,
    cropWidth: lg.cropWidth || 0,
    cropHeight: lg.cropHeight || 0,
    // rotation: lg.rotation || 0,
  }));
  

  const colorObjs = [];
  if (colors?.primary?.length) {
    colors.primary.forEach((c) => {
      colorObjs.push({
        id: "",
        type: "PRIMARY",
        colorCode: c,
        brandId: id || "",
      });
    });
  }
  if (colors?.secondary?.length) {
    colors.secondary.forEach((c) => {
      colorObjs.push({
        id: "",
        type: "SECONDARY",
        colorCode: c,
        brandId: id || "",
      });
    });
  }

  const paletteObjs = colorPalettes.map((p) => ({
    id: "",
    palette: p,
    brandId: id || "",
  }));

  const elementObjs = brandElements.map((elem) => ({
    id: elem.id || "",
    name: elem.name || "Untitled",
    url: elem.url || "",
    brandId: id || "",
  }));

  const fontObjs = fonts.map((f) => ({
    id: f.id || "",
    name: f.fontFamily || "Arial",
    type:f.role || "Title",
    fontStyle: f.italic ? "italic" : "normal",
    fontStyleURL: f.customFile ? "https://myserver.com/" + f.customFile.name : "",
    fontWeight: f.bold ? "bold" : "normal",
    fontSize: String(f.size),
    brandId: id || "",
  }));

  return {
    id: id || "",
    websiteUrl: websiteUrl || "",
    brandName: brandName || "",
    logos: logoObjects,
    colors: colorObjs,
    colorPalettes: paletteObjs,
    brandElements: elementObjs,
    fonts: fontObjs,
    brandVoice: brandVoice || "",
    mission: mission || "",
    vision: vision || "",
    brandStory: brandStory || "",
    niche: niche || "",
    targetAudience: targetAudience || "",
    audienceObjective: audienceObjective || "",
  };
}

/* ----------------------------------------------------
   A progress bar item for steps 1,2,3
---------------------------------------------------- */
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
        </div>
      </div>
      {step < 3 && <div className="progress-line bg-gray-300 h-1 w-16" />}
    </>
  );
}

/* ----------------------------------------------------
   STEP 1: BrandDetails
---------------------------------------------------- */
function BrandDetails({ brandData, setBrandData, onNext }) {
  const handleNextClick = () => {
    if (!brandData.brandName.trim()) {
      toast.error("Brand Name is required.");
      return;
    }
    if (!brandData.logos || brandData.logos.length < 1) {
      toast.error("Please upload at least one Brand Logo.");
      return;
    }
    if (!brandData.colors.primary?.length) {
      toast.error("At least one Primary Color is required.");
      return;
    }
    if (!brandData.colors.secondary?.length) {
      toast.error("At least one Secondary Color is required.");
      return;
    }
    onNext && onNext();
  };

  return (
    <div className="flex-grow pr-1">
      <BrandDetailsInner brandData={brandData} setBrandData={setBrandData} />
      <div className="flex justify-end mt-4">
        <button
          className="custom-button p-2 px-6 text-white rounded-lg bg-blue-600 hover:bg-blue-700"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   The brand details panel:
   brand name, multi-logo, brand colors, brand fonts
---------------------------------------------------- */
function BrandDetailsInner({ brandData, setBrandData }) {
  return (
    <>
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
            value={brandData.brandName}
            onChange={(e) =>
              setBrandData((prev) => ({ ...prev, brandName: e.target.value }))
            }
            className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] 
                       mb-2 bg-[#FCFCFC] focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* MULTI-LOGO + SELECTION */}
      <MultiLogoUpload brandData={brandData} setBrandData={setBrandData} />

      {/* BRAND COLORS */}
      <BrandColors brandData={brandData} setBrandData={setBrandData} />

      {/* BRAND FONTS */}
      <BrandFonts brandData={brandData} setBrandData={setBrandData} />
    </>
  );
}

/* ----------------------------------------------------
   STEP 2: BrandOverview
---------------------------------------------------- */
function BrandOverview({ brandData, setBrandData, onPrev, onNext }) {
  const handlePrevClick = () => onPrev && onPrev();
  const handleNextClick = () => {
    if (!brandData.brandVoice.trim()) {
      toast.error("Brand Voice is required.");
      return;
    }
    if (!brandData.mission.trim()) {
      toast.error("Mission is required.");
      return;
    }
    if (!brandData.vision.trim()) {
      toast.error("Vision is required.");
      return;
    }
    if (!brandData.niche.trim()) {
      toast.error("Brand Niche is required.");
      return;
    }
    if (!brandData.brandStory.trim()) {
      toast.error("Brand Story is required.");
      return;
    }
    if (!brandData.targetAudience.trim()) {
      toast.error("Target Audience is required.");
      return;
    }
    onNext && onNext();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-2 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Brand Overview</h2>

      <div className="mb-6 border border-[#FCFCFC] p-4 rounded-xl bg-[rgba(252,252,252,0.25)]">
        <h3 className="text-lg font-semibold mb-3">Brand Identity</h3>

        {/* Brand Voice */}
        <label className="block font-semibold mb-1" htmlFor="brandVoice">
          Brand Voice
        </label>
        <textarea
          id="brandVoice"
          name="brandVoice"
          value={brandData.brandVoice}
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
          value={brandData.mission}
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
          value={brandData.vision}
          onChange={handleChange}
          placeholder="Describe your brand's vision..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* Brand Story */}
        <label className="block font-semibold mb-1" htmlFor="brandStory">
          Brand Story
        </label>
        <textarea
          id="brandStory"
          name="brandStory"
          value={brandData.brandStory}
          onChange={handleChange}
          placeholder="Briefly share your brand's story or background..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* Niche */}
        <label className="block font-semibold mb-1" htmlFor="niche">
          Niche
        </label>
        <textarea
          id="niche"
          name="niche"
          value={brandData.niche}
          onChange={handleChange}
          placeholder="Describe your brand's specialized area or market focus..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={2}
        />
      </div>

      {/* Audience */}
      <div className="mb-6 border border-[#FCFCFC] p-4 rounded-xl bg-[#FCFCFC40]">
        <h3 className="text-lg font-semibold mb-3">Audience Overview</h3>

        {/* Target Audience */}
        <label className="block font-semibold mb-1" htmlFor="targetAudience">
          Target Audience
        </label>
        <textarea
          id="targetAudience"
          name="targetAudience"
          value={brandData.targetAudience}
          onChange={handleChange}
          placeholder="Describe who your brand is primarily trying to reach..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />

        {/* Audience Objective */}
        <label className="block font-semibold mb-1" htmlFor="audienceObjective">
          Audience Objective (Optional)
        </label>
        <textarea
          id="audienceObjective"
          name="audienceObjective"
          value={brandData.audienceObjective}
          onChange={handleChange}
          placeholder="Describe what you want your audience to do, feel, or achieve..."
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={handlePrevClick}
        >
          Previous
        </button>
        <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   STEP 3: BrandAssets
---------------------------------------------------- */
function BrandAssets({ brandData, setBrandData, onPrev, onFinish }) {
  const handlePrevClick = () => onPrev && onPrev();
  const handleFinishClick = () => onFinish && onFinish();

  return (
    <div className="p-2 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Brand Assets</h2>

      <BrandElements brandData={brandData} setBrandData={setBrandData} />

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={handlePrevClick}
        >
          Previous
        </button>
        <button
          className="custom-button text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleFinishClick}
        >
          {brandData?.id ? "Update Brand" : "Create Brand"}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   BrandElements (icons, images, etc.)
---------------------------------------------------- */
function BrandElements({ brandData, setBrandData }) {
  const [showIconUpload, setShowIconUpload] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const handleIconUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Please upload a PNG or JPEG/JPG file.");
      return;
    }

    setUploadingIcon(true);
    try {
      const url = await uploadImage(file, setUploadingIcon);
      if (url) {
        setBrandData((prev) => ({
          ...prev,
          brandElements: [
            ...prev.brandElements,
            {
              id: "",
              name: "Icon",
              url,
              brandId: prev.id || "",
            },
          ],
        }));
        setShowIconUpload(false);
      }
    } catch (error) {
      toast.error("Failed to upload icon. Try again.");
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleRemoveElement = (idx) => {
    setBrandData((prev) => {
      const arr = [...prev.brandElements];
      arr.splice(idx, 1);
      return { ...prev, brandElements: arr };
    });
  };

  return (
    <div className="mb-8 bg-[rgba(252,252,252,0.25)] border border-[#FCFCFC] rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold mb-1">Brand Elements (Icons)</h3>
        <button
          className="flex items-center gap-1 text-[#082A66] hover:text-blue-800"
          onClick={() => setShowIconUpload((prev) => !prev)}
        >
          <FaPlus />
          <span>Add new</span>
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Use these icons or graphics to visually convey a message...
      </p>

      <div className="flex flex-wrap gap-4">
        {brandData.brandElements?.map((elem, idx) => (
          <div key={idx} className="relative w-20 h-20 border rounded-md bg-gray-100">
            <img src={elem.url} alt={elem.name} className="w-full h-full object-contain p-2" />
            <button
              className="absolute top-1 right-1 bg-red-700 bg-opacity-50 text-white text-xs px-1 py-0.5 hover:bg-opacity-70"
              onClick={() => handleRemoveElement(idx)}
            >
              X
            </button>
          </div>
        ))}
        {brandData.brandElements.length === 0 && (
          <p className="text-gray-400 italic">
            No icons uploaded yet. Click "Add new" to upload a file (png/jpg).
          </p>
        )}
      </div>

      {showIconUpload && (
        <div className="border-2 border-[#fcfcfc] rounded-2xl p-2 mb-2 mt-2">
          <div
            className="border-dashed border-2 border-gray-400 bg-white 
                        rounded-lg p-2 text-center relative hover:border-gray-600 cursor-pointer"
          >
            {uploadingIcon ? (
              <p className="text-sm text-gray-600 italic">Uploading...</p>
            ) : (
              <>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleIconUpload}
                />
                <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                  <PiFileArrowUpDuotone className="rounded-xl w-6 h-6" />
                  <span className="text-gray-500 text-sm">Upload a file</span>
                </label>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------
   MultiLogoUpload (Step 1)
   - New: Re-crop on double-click
   - Rotation from 0..360
   - Zoom from 0.1..3
---------------------------------------------------- */
function MultiLogoUpload({ brandData, setBrandData }) {
  const [showUploadContainer, setShowUploadContainer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [imageToRemove, setImageToRemove] = useState(null);

  // For cropping (new or re-crop)
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropIndex, setCropIndex] = useState(null); // which logo index we are editing
  const [tempOriginalUrl, setTempOriginalUrl] = useState("");
  const [tempFile, setTempFile] = useState(null);
  const [isRecrop, setIsRecrop] = useState(false); // re-crop or new?

  // ---------------------------
  // 1) Upload => get originalUrl => open Crop Modal
  // ---------------------------
  const handleMultipleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadFileName(file.name);

    // Immediately upload the original file to get logoOriginalUrl
    const originalUrl = await uploadImage(file, setIsUploading);
    if (!originalUrl) {
      return; // Upload failed
    }

    // Open Crop Modal for a "new" logo
    setTempFile(file);
    setTempOriginalUrl(originalUrl);
    setIsRecrop(false);
    setCropIndex(null);
    setShowCropModal(true);
    setShowUploadContainer(false);
  };

  // ---------------------------
  // 2) Toggle select
  // ---------------------------
  const handleToggleSelectLogo = (logoObj) => {
    setBrandData((prev) => {
      let newSelected = [];
      const found = prev.selectedLogos.find((l) => l.logoUrl === logoObj.logoUrl);
      if (found) {
        // unselect
        newSelected = prev.selectedLogos.filter((l) => l.logoUrl !== logoObj.logoUrl);
      } else {
        // add
        newSelected = [...prev.selectedLogos, logoObj];
      }
      return { ...prev, selectedLogos: newSelected };
    });
  };

  // ---------------------------
  // 3) Double-click => Re-crop
  //    (use original URL)
  // ---------------------------
  const handleDoubleClickLogo = (logoObj, idx) => {
    if (!logoObj.logoOriginalUrl) {
      toast.error("No original URL available for re-cropping.");
      return;
    }
    setTempFile(null); // We'll re-crop from the existing original
    setTempOriginalUrl(logoObj.logoOriginalUrl);
    setIsRecrop(true);
    setCropIndex(idx);
    setShowCropModal(true);
  };

  // ---------------------------
  // 4) Remove
  // ---------------------------
  const handleRemoveLogo = () => {
    if (!imageToRemove) return;
    setBrandData((prev) => {
      const updated = [...prev.logos];
      updated.splice(imageToRemove.index, 1);

      // Also remove from selectedLogos if present
      const newSelected = prev.selectedLogos.filter(
        (obj) => obj.logoUrl !== imageToRemove.logoObj.logoUrl
      );

      return { ...prev, logos: updated, selectedLogos: newSelected };
    });
    setShowRemoveModal(false);
    setImageToRemove(null);
  };

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

        {brandData.logos.length > 0 ? (
          <div className="flex flex-wrap gap-4 items-center mb-4">
            {brandData.logos.map((logoObj, idx) => {
              const isSelected = brandData.selectedLogos.some(
                (l) => l.logoUrl === logoObj.logoUrl
              );
              return (
                <div
                  key={idx}
                  className={`relative w-28 h-28 rounded-md bg-gray-50 border hover:shadow-md p-2 flex flex-col items-center justify-center cursor-pointer ${
                    isSelected ? "border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => handleToggleSelectLogo(logoObj)}
                  onDoubleClick={() => handleDoubleClickLogo(logoObj, idx)}
                >
                  <img
                    src={logoObj.logoUrl || logoObj.logoOriginalUrl}
                    alt={`Brand Logo ${idx + 1}`}
                    className="w-20 h-20 object-contain"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow">
                      <FaCheck className="text-white text-xs" />
                    </div>
                  )}
                  <button
                    className="absolute top-1 left-1 bg-red-700 bg-opacity-40 text-white text-xs px-1 py-0.5 hover:bg-opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageToRemove({ logoObj, index: idx });
                      setShowRemoveModal(true);
                    }}
                  >
                    X
                  </button>
                </div>
              );
            })}
            {brandData.logos.length < 10 && (
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

        {/* Remove confirmation */}
        {showRemoveModal && imageToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl p-4 shadow-2xl max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2">Remove Logo</h3>
              <p className="mb-2 text-sm">Do you want to remove this logo?</p>
              <div className="flex items-center justify-center mb-4">
                <img
                  src={
                    imageToRemove.logoObj.logoUrl ||
                    imageToRemove.logoObj.logoOriginalUrl
                  }
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

        {/* Upload container */}
        {(showUploadContainer || brandData.logos.length === 0) &&
          brandData.logos.length < 10 && (
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
                        style={{ width: "0%" }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">0%</span>
                  </div>
                ) : (
                  <div
                    className="border-dashed border-2 border-gray-400 bg-white 
                                rounded-lg p-2 text-center relative hover:border-gray-600 cursor-pointer"
                  >
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

        {/* Crop Modal (opens after original upload or re-crop) */}
        {showCropModal && (
          <LogoCropperModal
            file={tempFile}
            originalUrl={tempOriginalUrl}
            isRecrop={isRecrop}
            onClose={() => {
              setShowCropModal(false);
              setTempFile(null);
              setTempOriginalUrl("");
              setCropIndex(null);
            }}
            onSave={(croppedUrl, cropData) => {
              if (isRecrop && cropIndex !== null) {
                // Update existing item
                setBrandData((prev) => {
                  const newLogos = [...prev.logos];
                  newLogos[cropIndex] = {
                    ...newLogos[cropIndex],
                    logoUrl: croppedUrl,
                    cropX: cropData.x,
                    cropY: cropData.y,
                    cropWidth: cropData.width,
                    cropHeight: cropData.height,
                    rotation: cropData.rotation,
                  };
                  return { ...prev, logos: newLogos };
                });
              } else {
                // Insert new item
                setBrandData((prev) => ({
                  ...prev,
                  logos: [
                    ...prev.logos,
                    {
                      id: "",
                      logoName: "Custom Logo",
                      logoUrl: croppedUrl, // final cropped
                      logoOriginalUrl: tempOriginalUrl,
                      brandId: prev.id || "",
                      cropX: cropData.x,
                      cropY: cropData.y,
                      cropWidth: cropData.width,
                      cropHeight: cropData.height,
                      rotation: cropData.rotation,
                    },
                  ],
                  // Auto-select if it's the first logo
                  selectedLogos:
                    prev.logos.length === 0
                      ? [
                          {
                            logoUrl: croppedUrl,
                          },
                        ]
                      : prev.selectedLogos,
                }));
              }
              setShowCropModal(false);
              setTempFile(null);
              setTempOriginalUrl("");
              setCropIndex(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   LOGO CROPPER MODAL
   - Uses react-easy-crop for 1:1 ratio
   - Rotation: 0..360
   - Zoom: 0.1..3
   - Padding & margin inside the cropper
---------------------------------------------------- */
function LogoCropperModal({ file, originalUrl, isRecrop, onClose, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const aspect = 1; // 1:1

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels || !originalUrl) {
      toast.error("No cropping data available!");
      return;
    }
    try {
      // 1) Get a blob from the cropped area
      const croppedBlob = await getCroppedImg(originalUrl, croppedAreaPixels, rotation);
      if (!croppedBlob) {
        toast.error("Failed to crop image. Try again.");
        return;
      }
      // 2) Upload cropped blob => final "logoUrl"
      const croppedFile = new File(
        [croppedBlob],
        `cropped_${file?.name || "logo"}.png`,
        {
          type: "image/png",
        }
      );
      const finalUrl = await uploadImage(croppedFile, () => {}); // no spinner here
      if (!finalUrl) {
        toast.error("Failed to upload cropped image.");
        return;
      }
      // 3) Pass finalUrl + coordinates
      onSave(finalUrl, {
        x: Math.round(croppedAreaPixels.x),
        y: Math.round(croppedAreaPixels.y),
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
        rotation,
      });
    } catch (error) {
      console.error(error);
      toast.error("Cropping or upload failed.");
    }
  };

  // Rotate 90 deg increments
  const handleRotate90 = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md p-4 max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2">
          {isRecrop ? "Re-Crop Logo" : "Crop Logo"} (1:1)
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Adjust the image, rotate if needed, and zoom in/out.
        </p>

        {/* Crop container with some margin/padding */}
        <div
          className="relative bg-black"
          style={{
            width: "100%",
            height: "350px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <Cropper
            image={originalUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            minZoom={0.1}
            maxZoom={3}
            restrictPosition={false}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                position: "relative",
              },
              mediaStyle: {
                // Optional custom styling for the image
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {/* Zoom Slider */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Zoom:</label>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "70%" }}
            />
            <span className="text-sm w-12 text-right">{zoom.toFixed(1)}x</span>
          </div>

          {/* Rotation Slider */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Straighten:</label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              style={{ width: "70%" }}
            />
            <span className="text-sm w-12 text-right">{rotation}°</span>
          </div>

          {/* Rotate 90 button */}
          <button
            className="flex items-center gap-2 self-end px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={handleRotate90}
          >
            <FaSyncAlt />
            Rotate 90°
          </button>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end items-center gap-4 mt-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
            onClick={handleSaveCrop}
          >
            Save Logo
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandColors({ brandData, setBrandData }) {
  const [loadingColors, setLoadingColors] = useState(false);

  // For color editing
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState(null);
  const [customColor, setCustomColor] = useState("#000000");

  // For 3-Color palette
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(null);
  const [tempColor, setTempColor] = useState("#000000");
  const [newBgColor, setNewBgColor] = useState("#082A66");
  const [newTextColor, setNewTextColor] = useState("#ffffff");
  const [newEffectColor, setNewEffectColor] = useState("#cccccc");

  // Auto-extract whenever exactly 1 logo is selected
  useEffect(() => {
    if (brandData.selectedLogos.length === 1) {
      extractColorsAndPalette(brandData.selectedLogos[0]);
    }
  }, [brandData.selectedLogos]);

  const extractColorsAndPalette = async (logoURL) => {
    setLoadingColors(true);
    try {
      const extracted = await fetchBrandColors(logoURL);
      if (!extracted) return;

      const newPrimary = [];
      const newSecondary = [];
      extracted.forEach((c) => {
        if (c.type?.toLowerCase() === "primary") {
          const splitted = c.colorCode.split(",").map((col) => col.trim());
          newPrimary.push(...splitted);
        } else if (c.type?.toLowerCase() === "secondary") {
          const splitted = c.colorCode.split(",").map((col) => col.trim());
          newSecondary.push(...splitted);
        }
      });

      const allColors = [...newPrimary, ...newSecondary];
      const palettes = await fetchColorPalette(allColors);

      setBrandData((prev) => ({
        ...prev,
        colors: {
          primary: newPrimary.length ? newPrimary : prev.colors.primary,
          secondary: newSecondary.length ? newSecondary : prev.colors.secondary,
        },
        colorPalettes: palettes.length ? palettes : prev.colorPalettes,
      }));
    } catch (err) {
      console.error("Failed extracting brand colors:", err);
    } finally {
      setLoadingColors(false);
    }
  };

  // ... The rest is your existing color editing logic ...
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
      setBrandData((prev) => {
        const newArr = [...prev.colorPalettes];
        const parts = newArr[paletteIndex].split(",");
        parts[colorIndex] = customColor;
        newArr[paletteIndex] = parts.join(",");
        return { ...prev, colorPalettes: newArr };
      });
    } else if (colorPickerTarget.array) {
      const arrName = colorPickerTarget.array;
      const idx = colorPickerTarget.index;

      setBrandData((prev) => {
        const copy = { ...prev };
        const colorsCopy = { ...copy.colors };

        if (idx === null) {
          // Add new color
          if (arrName === "primaryColors") {
            colorsCopy.primary.push(customColor);
          } else if (arrName === "secondaryColors") {
            colorsCopy.secondary.push(customColor);
          }
        } else {
          // Replace existing
          if (arrName === "primaryColors") {
            colorsCopy.primary[idx] = customColor;
          } else if (arrName === "secondaryColors") {
            colorsCopy.secondary[idx] = customColor;
          }
        }
        copy.colors = colorsCopy;
        return copy;
      });
    }

    setColorPickerOpen(false);
    setColorPickerTarget(null);
  };

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
    const paletteStr = `${newBgColor},${newTextColor},${newEffectColor}`;
    setBrandData((prev) => ({
      ...prev,
      colorPalettes: [...prev.colorPalettes, paletteStr],
    }));
    setShowPaletteModal(false);
  };

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
      
      {/* PARTIAL LOADER OVERLAY (only inside the brand-colors container) */}
      {loadingColors && (
        <div className="absolute inset-0 z-10 bg-[rgba(255,255,255,0.4)] flex items-center justify-center rounded-2xl">
          {/* If you want the snippet style, you can do it here: */}
          <div className="flex justify-center items-center mt-4">
            <span className="load-loader"></span>
          </div>
        </div>
      )}

      <div className="p-4 relative">
        {/* Primary */}
        <h3 className="font-semibold mb-2">Primary Colors</h3>
        <ColorArray
          arrayName="primaryColors"
          colorArray={brandData.colors.primary}
          brandData={brandData}
          setBrandData={setBrandData}
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
          colorArray={brandData.colors.secondary}
          brandData={brandData}
          setBrandData={setBrandData}
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
          {brandData.colorPalettes.map((paletteStr, idx) => {
            const subColors = paletteStr.split(",");
            return (
              <div
                key={idx}
                className="relative flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit"
              >
                <button
                  className="absolute top-1 right-1 text-xs text-white bg-red-600 px-2 rounded hover:bg-red-700"
                  onClick={() => {
                    setBrandData((prev) => {
                      const arr = [...prev.colorPalettes];
                      arr.splice(idx, 1);
                      return { ...prev, colorPalettes: arr };
                    });
                  }}
                >
                  -
                </button>
                {subColors.map((c, sIdx) => (
                  <button
                    key={sIdx}
                    className="h-8 px-3 rounded-lg flex items-center justify-center font-normal text-sm cursor-pointer"
                    style={{ backgroundColor: c, color: getTextColor(c) }}
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

        {/* Color picker for palette or primary/secondary */}
        {colorPickerOpen && colorPickerTarget?.type === "palette" && (
          <div className="absolute z-10 p-2 shadow-xl rounded-md bg-white mt-2">
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
    </div>
  );
}

function getTextColor(hex) {
  const c = hex.toLowerCase().replace(/\s/g, "");
  if (c.startsWith("#f") || c === "#fff" || c === "#ffffff" || c === "#f5f5f5" || c === "#e0f7fa" || c === "#e4f7e7") {
    return "#000";
  }
  return "#fff";
}

/**
 * ColorArray for adding/removing single colors in brandData.colors.primary/secondary, with a mini color picker
 */
function ColorArray({
  arrayName,
  colorArray,
  brandData,
  setBrandData,
  customColor,
  setCustomColor,
  colorPickerOpen,
  setColorPickerOpen,
  colorPickerTarget,
  setColorPickerTarget,
  handleColorSelect,
  handleSaveAdditionalColor,
}) {
  const handleRemoveColor = (idx) => {
    if (colorArray.length <= 1) {
      toast.error("At least 1 color is required.");
      return;
    }
    setBrandData((prev) => {
      const copy = { ...prev };
      const colorsCopy = { ...copy.colors };
      if (arrayName === "primaryColors") {
        colorsCopy.primary = [...colorsCopy.primary];
        colorsCopy.primary.splice(idx, 1);
      } else {
        colorsCopy.secondary = [...colorsCopy.secondary];
        colorsCopy.secondary.splice(idx, 1);
      }
      copy.colors = colorsCopy;
      return copy;
    });
  };

  const openPicker = (color, idx) => {
    setCustomColor(color);
    setColorPickerTarget({ array: arrayName, index: idx });
    setColorPickerOpen(true);
  };

  const addNewColor = () => {
    setCustomColor("#cccccc");
    setColorPickerTarget({ array: arrayName, index: null });
    setColorPickerOpen(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-2">
      {colorArray.map((color, idx) => (
        <div key={idx} className="relative flex items-center bg-white p-1 rounded-xl">
          <button
            className="h-8 px-6 rounded-lg flex items-center justify-start font-normal text-sm cursor-pointer"
            style={{ backgroundColor: color, color: getTextColor(color) }}
            onClick={() => openPicker(color, idx)}
          >
            {color}
          </button>
          <button
            className="absolute top-1 right-1 text-xs text-white bg-red-600 px-2 rounded hover:bg-red-700"
            onClick={() => handleRemoveColor(idx)}
          >
            -
          </button>
        </div>
      ))}
      {colorArray.length < 10 && (
        <button
          className="custom-button text-white w-10 h-10 rounded-lg border-4 border-[#FCFCFC] 
                     flex items-center justify-center hover:bg-[#1E1154]"
          onClick={addNewColor}
        >
          <FaPlus className="text-white" />
        </button>
      )}

      {/* If user is editing primary/secondary color, show colorPicker locally */}
      {colorPickerOpen && colorPickerTarget?.array === arrayName && (
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
 * One part of the 3-color palette modal 
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
        className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center cursor-pointer px-20"
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

/* ----------------------------------------------------
   BRAND FONTS => referencing brandData.fonts
---------------------------------------------------- */
function BrandFonts({ brandData, setBrandData }) {
  const handleAddNewFont = () => {
    const newFont = {
      id: Date.now().toString(),
      role: "Title",
      fontFamily: "Arial",
      size: 16,
      bold: false,
      italic: false,
      underline: false,
      isCustom: false,
      customFile: null,
      isEditing: true,
    };
    setBrandData((prev) => ({
      ...prev,
      fonts: [...prev.fonts, newFont],
    }));
  };

  return (
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
        <button
          onClick={handleAddNewFont}
          className="mb-3 rounded px-4 py-2 custom-button text-white"
        >
          Add New
        </button>

        {brandData.fonts.map((fontObj) => (
          <FontRowPen key={fontObj.id} fontObj={fontObj} setBrandData={setBrandData} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------
   Single row for a specific font style
---------------------------------------------------- */
function FontRowPen({ fontObj, setBrandData }) {
  const {
    id,
    role,
    fontFamily,
    size,
    bold,
    italic,
    underline,
    isCustom,
    customFile,
    isEditing,
  } = fontObj;

  const ROLE_OPTIONS = ["Heading", "Subheading", "Body", "Caption", "CTA", "Quote", "Title"];
  const FONT_OPTIONS = ["Arial", "Helvetica", "Roboto", "Open Sans", "Times New Roman", "Montserrat", "Lato"];

  const previewStyle = {
    fontFamily,
    fontSize: `${size}px`,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
  };

  const handleOpenEditor = () => {
    updateFontState({ isEditing: true });
  };
  const handleConfirm = () => {
    updateFontState({ isEditing: false });
  };
  const handleCancel = () => {
    updateFontState({ isEditing: false });
  };
  const handleRemove = () => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.filter((f) => f.id !== id),
    }));
  };
  const onFontFamilyChange = (val) => {
    if (val === "CUSTOM_FONT") {
      updateFontState({ isCustom: true, fontFamily: "Custom Font" });
    } else {
      updateFontState({ isCustom: false, fontFamily: val });
    }
  };
  const onFontFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.success(`Selected custom font file: ${file.name}`);
    updateFontState({ customFile: file });
  };
  const onSizeChange = (newVal) => {
    updateFontState({ size: newVal });
  };
  const onToggleBold = () => {
    updateFontState({ bold: !bold });
  };
  const onToggleItalic = () => {
    updateFontState({ italic: !italic });
  };
  const onToggleUnderline = () => {
    updateFontState({ underline: !underline });
  };

  function updateFontState(fields) {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) => (f.id === id ? { ...f, ...fields } : f)),
    }));
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between bg-white p-2 mb-2 rounded shadow">
        <span className="font-semibold">{role || "Title"}</span>
        <div className="flex gap-3">
          <button className="text-gray-700 hover:text-black" onClick={handleOpenEditor}>
            <FaPen />
          </button>
          <button className="text-gray-700 hover:text-red-600" onClick={handleRemove}>
            <FaTrash />
          </button>
        </div>
      </div>
    );
  }

  // If editing => expanded
  return (
    <div className="bg-white p-3 mb-2 rounded shadow flex flex-col gap-2 border-2 border-[#1138AC]">
      <div className="flex items-center gap-2">
        {/* Font Family */}
        <select
          className="border p-1 rounded"
          style={{ minWidth: "120px" }}
          value={isCustom ? "CUSTOM_FONT" : fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
          <option value="CUSTOM_FONT">Custom Font…</option>
        </select>

        {/* Role */}
        <select
          className="border p-1 rounded"
          style={{ minWidth: "100px" }}
          value={role}
          onChange={(e) => updateFontState({ role: e.target.value })}
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Size */}
        <input
          type="number"
          min={8}
          max={96}
          className="border p-1 rounded w-16"
          value={size}
          onChange={(e) => onSizeChange(parseInt(e.target.value, 10))}
        />

        {/* B / I / U */}
        <button
          onClick={onToggleBold}
          className={`border p-1 rounded ${bold ? "bg-gray-300" : "bg-white"}`}
        >
          <FaBold />
        </button>
        <button
          onClick={onToggleItalic}
          className={`border p-1 rounded ${italic ? "bg-gray-300" : "bg-white"}`}
        >
          <FaItalic />
        </button>
        <button
          onClick={onToggleUnderline}
          className={`border p-1 rounded ${underline ? "bg-gray-300" : "bg-white"}`}
        >
          <FaUnderline />
        </button>

        {/* Confirm / Cancel */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleConfirm}
            className="bg-gray-200 hover:bg-gray-300 text-green-700 p-1 rounded"
            title="Confirm"
          >
            <MdDone size={18} />
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-red-700 p-1 rounded"
            title="Cancel"
          >
            <MdClose size={18} />
          </button>
        </div>
      </div>

      {/* If “Custom Font,” show file input + preview */}
      {isCustom && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <label className="text-sm font-medium">Upload Font:</label>
          <input
            type="file"
            accept=".otf,.ttf,.woff"
            className="border p-1 rounded"
            onChange={onFontFileUpload}
          />
          {customFile && (
            <span className="text-sm text-green-700">Loaded: {customFile.name}</span>
          )}
        </div>
      )}

      {/* Preview area */}
      <div className="border rounded p-2 bg-white" style={{ ...previewStyle, minHeight: "40px" }}>
        This is an example {role} preview
      </div>
    </div>
  );
}
