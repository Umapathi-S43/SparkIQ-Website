// brandSetting.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import {
  FaTrash,
  FaRegLightbulb,
  FaCheck,
  FaPlus,
  FaBold,
  FaItalic,
  FaUnderline,
  FaPen,
} from "react-icons/fa";
import { PiFileArrowUpDuotone } from "react-icons/pi";
import { MdDone, MdClose } from "react-icons/md";

import Picker from "../colorPicker"; // Adjust path if needed
import brandIcon from "../../../assets/dashboard_img/brand.svg";  // Adjust path
import brandImage from "../../../assets/dashboard_img/brand_img.png"; // Adjust path
import "./brandSetting.css";

import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

// 1) The real uploadImage function
async function uploadImage(file, setIsUploading) {
  if (!file) return null;

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("customerId", "123");

  setIsUploading(true);
  try {
    if (!jwtToken) {
      throw new Error("No JWT token found. Please log in.");
    }
    const res = await axios.post(`${baseUrl}/sparkiq/image/upload`, uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const imageUrl = res.data.data.url;
    toast.success("File upload successful");
    return imageUrl;
  } catch (error) {
    console.log(error);
    toast.error("File upload failed. Please try again.");
    return null;
  } finally {
    setIsUploading(false);
  }
}

/**
 * The main BrandSetting container: manages steps 1→2→3.
 * We'll keep all brand data in a single `brandData` so going back/forth won't lose changes.
 */
export default function BrandSetting() {
  const navigate = useNavigate();
  const location = useLocation();

  // We might get brandName from location.search or from location.state
  // e.g. location.state = { brandName: 'AcmeInc' }
  // Or you can parse from query string. 
  // For example:
  const params = new URLSearchParams(location.search);
  const brandNameFromUrl = params.get("id") || location.state?.id || null;

  // Step
  const initialStep = location.state?.step || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Single brandData state
  const [brandData, setBrandData] = useState({
    id: null,
    websiteUrl: "",
    brandName:  "",
    brandVoice: "",
    mission: "",
    vision: "",
    brandStory: "",
    niche: "",
    targetAudience: "",
    audienceObjective: "",

    // Arrays
    logos: [],
    colors: {
      primary: ["#082A66"], // default
      secondary: ["#ffffff"], // default
    },
    colorPalettes: [
      "#082A66,#ffffff,#000000",
      "#cccccc,#dddddd,#eeeeee",
    ],
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
        id: "subheading",
        role: "Subheading",
        fontFamily: "Roboto",
        size: 24,
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
        id: "cta",
        role: "CTA",
        fontFamily: "Montserrat",
        size: 20,
        bold: true,
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

  // 2) We'll fetch all brands from /v2/api/brands when mounting, find by name if brandName is given
  useEffect(() => {
    async function fetchBrandById() {
      try {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }
  
        // Check if brandNameFromUrl (brand ID) exists
        if (brandNameFromUrl) {
          // console.log("Brand ID from URL:", brandNameFromUrl); // Log the brand ID
  
          // Fetch the brand directly by its ID
          const response = await axios.get(`${baseUrl}/v2/api/brands/${brandNameFromUrl}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
  
          // Extract brand data from the response
          const foundBrand = response.data?.data;
  
          if (foundBrand) {
            // console.log("Brand Found:", foundBrand);
  
            // Populate the brand data into state
            setBrandData((prev) => ({
              ...prev,
              id: foundBrand.id || null,
              websiteUrl: foundBrand.websiteUrl || "",
              brandName: foundBrand.brandName || "",
              brandVoice: foundBrand.brandVoice || "",
              mission: foundBrand.mission || "",
              vision: foundBrand.vision || "",
              brandStory: foundBrand.brandStory || "",
              niche: foundBrand.niche || "",
              targetAudience: foundBrand.targetAudience || "",
              audienceObjective: foundBrand.audienceObjective || "",
              logos: (foundBrand.logos || []).map((lg) => lg.logoUrl),
              colors: parseColorsToState(foundBrand.colors || []),
              colorPalettes: (foundBrand.colorPalettes || []).map((cp) => cp.palette),
              brandElements: (foundBrand.brandElements || []).map((elem) => ({
                id: elem.id || "",
                name: elem.name || "Icon",
                url: elem.url || "",
                brandId: foundBrand.id || "",
              })),
              fonts: parseFontsToState(foundBrand.fonts || [], foundBrand.id),
            }));
          } else {
            console.log("No brand found for the given ID.");
          }
        } else {
          console.log("No brand ID found in the URL.");
        }
      } catch (error) {
        console.error("Error fetching brand by ID:", error);
      }
    }
  
    fetchBrandById(); // Trigger the fetch logic
  }, [brandNameFromUrl]);
  

  // Helpers for converting arrays => brandData
  function parseColorsToState(apiColors) {
    // e.g. [ {id:'', type:'PRIMARY', colorCode:'#...', brandId:''}, ...]
    const primaryArr = [];
    const secondaryArr = [];
    apiColors.forEach((c) => {
      if (c.type === "PRIMARY") primaryArr.push(c.colorCode);
      else if (c.type === "SECONDARY") secondaryArr.push(c.colorCode);
    });
    if (primaryArr.length < 1) primaryArr.push("#082A66");
    if (secondaryArr.length < 1) secondaryArr.push("#ffffff");
    return { primary: primaryArr, secondary: secondaryArr };
  }

  function parseFontsToState(apiFonts, brandId) {
    // e.g. [ {id:'', name:'Heading', type:'CUSTOM'|'SYSTEM', fontStyle:'italic'|'normal', ...}, ...]
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

  // Step navigation
  const goNextStep = () => setCurrentStep((s) => s + 1);
  const goPrevStep = () => setCurrentStep((s) => s - 1);

  // Final "Finish": if brandData.id => update brand, else create brand
  const handleFinish = async () => {
    const finalJson = buildFinalBrandPayload(brandData);
    console.log("Final brand JSON:", finalJson);

    try {
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in.");
      }

      if (brandData.id) {
        // We have an ID => let's assume we want to update
        await axios.post(`${baseUrl}/v2/api/brands?update=true`, finalJson, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        toast.success("Brand updated successfully");
      } else {
        // Otherwise => create brand
        await axios.post(`${baseUrl}/v2/api/brands`, finalJson, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        toast.success("Brand created successfully");
      }

      navigate("/homepage");
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Failed to save brand. Please try again.");
    }
  };

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

/** Builds the final JSON in your requested format. */
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

  // Transform logos => array
  const logoObjects = logos.map((url) => ({
    id: "",
    logoName: "Custom Logo",
    logoUrl: url,
    brandId: id || "",
  }));

  // Flatten primary & secondary
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

  // colorPalettes => array
  const paletteObjs = colorPalettes.map((p) => ({
    id: "",
    palette: p,
    brandId: id || "",
  }));

  // brandElements => array
  const elementObjs = brandElements.map((elem) => ({
    id: elem.id || "",
    name: elem.name || "Untitled",
    url: elem.url || "",
    brandId: id || "",
  }));

  // fonts => array
  const fontObjs = fonts.map((f) => ({
    id: f.id || "", 
    name: f.role || "Title",
    type: f.isCustom ? "CUSTOM" : "SYSTEM",
    fontStyle: f.italic ? "italic" : "normal",
    fontStyleURL: f.customFile
      ? "https://myserver.com/uploaded-fonts/" + f.customFile.name
      : "",
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

/** A progress bar item for steps 1,2,3. */
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

/** STEP 1: BrandDetails */
function BrandDetails({ brandData, setBrandData, onNext }) {
  // Step 1 validation
  const handleNextClick = () => {
    if (!brandData.brandName.trim()) {
      toast.error("Brand Name is required.");
      return;
    }
    if (!brandData.logos || brandData.logos.length < 1) {
      toast.error("Please upload at least one Brand Logo.");
      return;
    }
    if (!brandData.colors.primary || brandData.colors.primary.length < 1) {
      toast.error("At least one Primary Color is required.");
      return;
    }
    if (!brandData.colors.secondary || brandData.colors.secondary.length < 1) {
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

/** 
 * Renders brand name, logos, brand colors, brand fonts 
 */
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
              setBrandData((prev) => ({
                ...prev,
                brandName: e.target.value,
              }))
            }
            className="w-full p-2 rounded-lg shadow-xl border border-[#fcfcfc] 
                       mb-2 bg-[#FCFCFC] focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* MULTI-LOGO */}
      <MultiLogoUpload brandData={brandData} setBrandData={setBrandData} />

      {/* BRAND COLORS */}
      <BrandColors brandData={brandData} setBrandData={setBrandData} />

      {/* BRAND FONTS */}
      <BrandFonts brandData={brandData} setBrandData={setBrandData} />
    </>
  );
}

/** Step 2: BrandOverview */
function BrandOverview({ brandData, setBrandData, onPrev, onNext }) {
  const handlePrevClick = () => {
    onPrev && onPrev();
  };

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
    if (!brandData.targetAudience.trim()) {
      toast.error("Target Audience is required.");
      return;
    }
    if (!brandData.audienceObjective.trim()) {
      toast.error("Audience Objective is required.");
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
          Brand Voice *
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
          Mission *
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
          Vision *
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

        {/* Brand Story (Optional) */}
        <label className="block font-semibold mb-1" htmlFor="brandStory">
          Brand Story (Optional)
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

        {/* Niche (Optional) */}
        <label className="block font-semibold mb-1" htmlFor="niche">
          Niche (Optional)
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

      <div className="mb-6 border border-[#FCFCFC] p-4 rounded-xl bg-[#FCFCFC40]">
        <h3 className="text-lg font-semibold mb-3">Audience Overview</h3>

        {/* Target Audience */}
        <label className="block font-semibold mb-1" htmlFor="targetAudience">
          Target Audience *
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
          Audience Objective *
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

/** Step 3: BrandAssets */
function BrandAssets({ brandData, setBrandData, onPrev, onFinish }) {
  const handlePrevClick = () => {
    onPrev && onPrev();
  };
  const handleFinishClick = () => {
    onFinish && onFinish();
  };

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

/** BrandElements subcomponent for Step 3 (icons, etc.). */
function BrandElements({ brandData, setBrandData }) {
  const [showIconUpload, setShowIconUpload] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  // brandData.brandElements => array of {id:'', name:'', url:'', brandId:'' }

  const handleIconUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // For icons, must be .svg:
    if (!file.name.toLowerCase().endsWith(".svg")) {
      toast.error("Please upload an SVG file.");
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
        toast.success("Icon uploaded!");
        setShowIconUpload(false);
      }
    } catch (error) {
      console.error("Failed to upload icon:", error);
      toast.error("Failed to upload icon");
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
            <img
              src={elem.url}
              alt={elem.name}
              className="w-full h-full object-contain p-2"
            />
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
            No icons uploaded yet. Click "Add new" to upload an SVG.
          </p>
        )}
      </div>

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
                <span className="text-gray-500 text-sm">
                  Upload an SVG file
                </span>
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * MultiLogoUpload for brand logos (Step 1).
 */
function MultiLogoUpload({ brandData, setBrandData }) {
  const [showUploadContainer, setShowUploadContainer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [imageToRemove, setImageToRemove] = useState(null);

  // Handle the actual file selection + upload
  const handleMultipleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFileName(file.name);
    setUploadProgress(0);

    const url = await uploadImage(file, setIsUploading);
    if (url) {
      setBrandData((prev) => ({
        ...prev,
        logos: [...prev.logos, url],
      }));
      setShowUploadContainer(false);
    }
  };

  // Remove
  const handleRemoveLogo = () => {
    if (!imageToRemove) return;
    const updated = [...brandData.logos];
    updated.splice(imageToRemove.index, 1);
    setBrandData((prev) => ({ ...prev, logos: updated }));
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
            {brandData.logos.map((logoUrl, idx) => (
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
          <p className="text-gray-500 italic mb-4">
            No logos uploaded yet.
          </p>
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
                        style={{ width: `0%` }}
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
                      <span className="text-gray-500">
                        Upload a logo here
                      </span>
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
 * Manages brandData.colors.primary, brandData.colors.secondary, plus brandData.colorPalettes
 */
function BrandColors({ brandData, setBrandData }) {
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

  const handleColorSelect = (colorResult) => {
    setCustomColor(colorResult.hex);
  };

  const handleSaveAdditionalColor = () => {
    if (!colorPickerTarget) {
      setColorPickerOpen(false);
      return;
    }
    // If it's a palette color
    if (colorPickerTarget.type === "palette") {
      const { paletteIndex, colorIndex } = colorPickerTarget;
      setBrandData((prev) => {
        const newArr = [...prev.colorPalettes];
        let parts = newArr[paletteIndex].split(",");
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
          // Replace
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
      <div className="p-4">
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

function getTextColor(hex) {
  return hex.toLowerCase() === "#ffffff" ? "#000000" : "#ffffff";
}

/**
 * ColorArray subcomponent 
 * Now with logic preventing the user from removing the *last* color in primary/secondary.
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
  const getTextColor = (hex) => (hex.toLowerCase() === "#ffffff" ? "#000000" : "#ffffff");

  const handleRemoveColor = (idx) => {
    // If there's only 1 color left, do not remove
    if (colorArray.length <= 1) {
      toast.error("At least 1 color is required.");
      return;
    }
    // Otherwise remove
    setBrandData((prev) => {
      const copy = { ...prev };
      const colorsCopy = { ...copy.colors };
      if (arrayName === "primaryColors") {
        const newPrim = [...colorsCopy.primary];
        newPrim.splice(idx, 1);
        colorsCopy.primary = newPrim;
      } else if (arrayName === "secondaryColors") {
        const newSec = [...colorsCopy.secondary];
        newSec.splice(idx, 1);
        colorsCopy.secondary = newSec;
      }
      copy.colors = colorsCopy;
      return copy;
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-2">
      {colorArray.map((color, idx) => (
        <div key={idx} className="relative flex items-center bg-white p-1 rounded-xl">
  <button
    className="h-8 px-6 rounded-lg flex items-center justify-start font-normal text-sm cursor-pointer"
    style={{ background: color, color: getTextColor(color) }}
    onClick={() => {
      setCustomColor(color);
      setColorPickerTarget({ array: arrayName, index: idx });
      setColorPickerOpen(true);
    }}
  >
    {color}
  </button>
  {/* Remove button (top right with red background) */}
  <button
    className="absolute top-1 right-1 text-xs text-white bg-red-600 px-2 rounded hover:bg-red-700"
    onClick={() => handleRemoveColor(idx)}
  >
   -
  </button>
</div>

      ))}
      {/* Add color button */}
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

      {/* The color picker popup */}
      {colorPickerOpen && colorPickerTarget && (
        <>
          {(colorPickerTarget.array === arrayName ||
            colorPickerTarget.type === "palette") && (
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
        </>
      )}
    </div>
  );
}

/**
 * PaletteSubColor for the 3-color palette modal.
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

/** BRAND FONTS => same logic as your FontRowPen, referencing brandData.fonts. */
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

  // Edit, confirm, remove
  const handleOpenEditor = (fontId) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, isEditing: true } : f
      ),
    }));
  };
  const handleConfirm = (fontId) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, isEditing: false } : f
      ),
    }));
  };
  const handleCancel = (fontId) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, isEditing: false } : f
      ),
    }));
  };
  const handleRemoveFont = (fontId) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.filter((f) => f.id !== fontId),
    }));
  };

  // Additional updates
  const onFontFamilyChange = (fontId, newValue) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) => {
        if (f.id !== fontId) return f;
        if (newValue === "CUSTOM_FONT") {
          return { ...f, isCustom: true, fontFamily: "Custom Font" };
        }
        return { ...f, isCustom: false, fontFamily: newValue };
      }),
    }));
  };

  const onFontFileUpload = async (fontId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.success(`Selected custom font file: ${file.name}`);

    // If you want to upload the font file to the server, do so here:
    // const fontUrl = await uploadImage(file, setIsUploading);
    // Then store it in f.customFile or something

    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, customFile: file } : f
      ),
    }));
  };

  const onSizeChange = (fontId, newSize) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, size: newSize } : f
      ),
    }));
  };
  const onToggleBold = (fontId) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, bold: !f.bold } : f
      ),
    }));
  };
  const onToggleItalic = (fontId) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, italic: !f.italic } : f
      ),
    }));
  };
  const onToggleUnderline = (fontId) => {
    setBrandData((prev) => ({
      ...prev,
      fonts: prev.fonts.map((f) =>
        f.id === fontId ? { ...f, underline: !f.underline } : f
      ),
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
          <FontRowPen
            key={fontObj.id}
            fontObj={fontObj}
            onOpenEditor={() => handleOpenEditor(fontObj.id)}
            onConfirm={() => handleConfirm(fontObj.id)}
            onCancel={() => handleCancel(fontObj.id)}
            onRemove={() => handleRemoveFont(fontObj.id)}
            onFontFamilyChange={(val) => onFontFamilyChange(fontObj.id, val)}
            onFontFileUpload={(e) => onFontFileUpload(fontObj.id, e)}
            onSizeChange={(val) => onSizeChange(fontObj.id, val)}
            onToggleBold={() => onToggleBold(fontObj.id)}
            onToggleItalic={() => onToggleItalic(fontObj.id)}
            onToggleUnderline={() => onToggleUnderline(fontObj.id)}
          />
        ))}
      </div>
    </div>
  );
}

/** 
 * FontRowPen (unchanged except we do store results in brandData).
 */
function FontRowPen({
  fontObj,
  onOpenEditor,
  onConfirm,
  onCancel,
  onRemove,

  onFontFamilyChange,
  onFontFileUpload,
  onSizeChange,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
}) {
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

  const ROLE_OPTIONS = [
    "Heading",
    "Subheading",
    "Body",
    "Caption",
    "CTA",
    "Quote",
    "Title",
  ];
  const FONT_OPTIONS = [
    "Arial",
    "Helvetica",
    "Roboto",
    "Open Sans",
    "Times New Roman",
    "Montserrat",
    "Lato",
    // "CUSTOM_FONT"
  ];

  const previewStyle = {
    fontFamily,
    fontSize: `${size}px`,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between bg-white p-2 mb-2 rounded shadow">
        <span className="font-semibold">{role || "Title"}</span>
        <div className="flex gap-3">
          <button
            className="text-gray-700 hover:text-black"
            onClick={onOpenEditor}
          >
            <FaPen />
          </button>
          <button
            className="text-gray-700 hover:text-red-600"
            onClick={onRemove}
          >
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
        {/* Font */}
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
          value={role || "Title"}
          onChange={(e) => {
            // If you want to store changes immediately, do so:
            fontObj.role = e.target.value;
          }}
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
          className={`border p-1 rounded ${
            underline ? "bg-gray-300" : "bg-white"
          }`}
        >
          <FaUnderline />
        </button>

        {/* Confirm / Cancel */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onConfirm}
            className="bg-gray-200 hover:bg-gray-300 text-green-700 p-1 rounded"
            title="Confirm"
          >
            <MdDone size={18} />
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-red-700 p-1 rounded"
            title="Cancel"
          >
            <MdClose size={18} />
          </button>
        </div>
      </div>

      {/* If “Custom Font,” show file input + preview */}
      {isCustom && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Upload Font:</label>
          <input
            type="file"
            accept=".otf,.ttf,.woff"
            className="border p-1 rounded"
            onChange={(e) => onFontFileUpload(e)}
          />
          {customFile && (
            <span className="text-sm text-green-700">
              Loaded: {customFile.name}
            </span>
          )}
        </div>
      )}

      {/* Preview area */}
      <div
        className="border rounded p-2 bg-white"
        style={{ ...previewStyle, minHeight: "40px" }}
      >
        This is an example {role || "Title"} preview
      </div>
    </div>
  );
}
