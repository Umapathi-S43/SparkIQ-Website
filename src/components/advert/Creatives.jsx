import { useEffect, useRef, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import { useNavigate } from "react-router-dom";
import "./Creatives.css";

// --------------------------------------------
// 1) Polotno API key & global variables
// --------------------------------------------
const POLNOTO_API_KEY = "H5HjfuZWdlg9X4gOUB27"; // Your Polotno subscribed key
const creativePayload11 = JSON.parse(localStorage.getItem("creativePayload")) || {};
let FIXED_BRAND_ID = JSON.parse(localStorage.getItem("brandID"));
if (!FIXED_BRAND_ID && creativePayload11?.brandId) {
  FIXED_BRAND_ID = creativePayload11.brandId;
}

// --------------------------------------------------
// 2) Hide Polotno warnings from the console
// --------------------------------------------------
function filterPolotnoWarnings() {
  const originalWarn = console.warn;
  const originalError = console.error;

  // Some Polotno warnings about zero-sized containers
  // contain these substrings. We filter them out.
  const IGNORED_SUBSTRINGS = [
    "Polotno warning: <Workspace /> component can not automatically detect its size",
    "Width or height of parent elements is equal 0",
  ];

  console.warn = (...args) => {
    if (typeof args[0] === "string") {
      for (const ignored of IGNORED_SUBSTRINGS) {
        if (args[0].includes(ignored)) {
          return; // skip this warning
        }
      }
    }
    originalWarn(...args);
  };

  console.error = (...args) => {
    if (typeof args[0] === "string") {
      for (const ignored of IGNORED_SUBSTRINGS) {
        if (args[0].includes(ignored)) {
          return; // skip this error
        }
      }
    }
    originalError(...args);
  };
}

// --------------------------------------------------
// 3) Background Hard Refresh on Error
//    Show toast, then wait, then reload
// --------------------------------------------------
function triggerBackgroundHardRefresh() {
  toast.error("We encountered an error. We’ll reload in the background to fix it!");
  setTimeout(() => {
    window.location.reload(true); // Hard refresh
  }, 3000);
}

// --------------------------------------------------
// 4) Brand-color extraction helpers
// --------------------------------------------------
async function fetchBrandColors(logoURL) {
  if (!logoURL) return null;
  try {
    const endpoint = `${baseUrl}/v2/api/brands/extract/colors?logoURL=${encodeURIComponent(logoURL)}`;
    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return res.data?.data || [];
  } catch (err) {
    toast.error("Could not extract brand colors from logo");
    return null;
  }
}

async function fetchColorPalette(allColors) {
  if (!allColors?.length) return [];
  const joined = allColors.join(",");
  const encodedColors = encodeURIComponent(joined);

  try {
    const endpoint = `${baseUrl}/v2/api/brands/extract/colorspalette?colors=${encodedColors}`;
    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const data = res.data?.data || [];
    return data.map((p) => p.palette);
  } catch (err) {
    toast.error("Could not generate color palettes");
    return [];
  }
}

// -------------------------------------------------------
// 5) Polotno → S3 upload → template creation
// -------------------------------------------------------
async function dataURLToBlob(dataURL) {
  const blob = await fetch(dataURL).then((res) => res.blob());
  return blob;
}

async function uploadImageToS3(imageBlob) {
  const formData = new FormData();
  formData.append("file", imageBlob, "uploaded-creative.png");

  const response = await axios.post(
    `${baseUrl}/sparkiq/image/upload?customerId=123`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );
  return response.data.data.url;
}

async function createTemplateOnServer(s3Url, storeJson) {
  const brandIdFromJson = FIXED_BRAND_ID || "";
  const payload = {
    url: s3Url,
    templateOrientation: "1:1",
    priority: 0,
    templateSize: "1080x1080",
    brandId: brandIdFromJson,
    version: "",
    tag: "",
    postType: "standard",
    customTemplate: false,
    mediaType: "image",
    videoDuration: "00:00",
    voiceoverEnabled: true,
    templateJson: JSON.stringify(storeJson),
    isFavourite: false,
  };

  try {
    const response = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data;
  } catch {
    triggerBackgroundHardRefresh();
    return null;
  }
}

// -------------------------------------------------------
// 6) Apply placeholders + color palette
// -------------------------------------------------------
function applyTemplate(templateJson, placeholders, paletteData) {
  try {
    const parsedJson = JSON.parse(templateJson);

    // 1) placeholders
    parsedJson.pages.forEach((page) => {
      page.children.forEach((element) => {
        if (element.custom && element.custom.variable) {
          const variableName = element.custom.variable.replace(/[{}]/g, "");
          const newValue = placeholders[variableName];
          if (newValue) {
            const elementType = (element.type || "").toLowerCase();
            if (elementType === "text") {
              element.text = newValue;
            } else if (elementType === "image") {
              element.src = newValue;
            }
          }
        }
      });
    });

    // 2) color palette
    if (
      paletteData &&
      Array.isArray(paletteData.colors) &&
      paletteData.colors.length >= 3
    ) {
      applyColorPalette(parsedJson, paletteData);
    }
    return parsedJson;
  } catch {
    triggerBackgroundHardRefresh();
    return null;
  }
}

function applyColorPalette(templateJson, paletteData) {
  const [bgColor, textColor, svgColor] = paletteData.colors;
  templateJson.pages.forEach((page) => {
    page.background = bgColor;
    page.children.forEach((element) => {
      const elementType = (element.type || "").toLowerCase();
      if (elementType === "svg" || elementType === "figure") {
        element.fill = svgColor;
      } else if (elementType === "text") {
        element.fill = textColor;
      }
    });
  });
}

// -------------------------------------------------------
// 7) Main Creatives component
// -------------------------------------------------------
export default function Creatives({
  isNextSectionOpen,
  toggleNextSectionAccordion,
  handleNextSection,
  setIsCompleted,
  isCompleted,
  handlePreviewClick,
  handleDownload,
  product,
  modelName,
}) {
  const sectionRef = useRef(null);
  const workspaceRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);

  // Timed toast
  const [timeSpent, setTimeSpent] = useState(0);
  const [toastStages, setToastStages] = useState([]);

  const navigate = useNavigate();
  let brandFetched = null;

  // -------------------------------------------------------
  // Override Polotno warnings (once, on mount)
  // -------------------------------------------------------
  useEffect(() => {
    filterPolotnoWarnings();
  }, []);

  // -------------------------------------------------------
  // Timed Toast Logic
  // -------------------------------------------------------
  useEffect(() => {
    let intervalId;
    if (loading) {
      intervalId = setInterval(() => {
        setTimeSpent((prev) => prev + 10);
      }, 10000);
    } else {
      setTimeSpent(0);
    }
    return () => clearInterval(intervalId);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;

    if (timeSpent >= 0 && timeSpent <= 10 && !toastStages.includes("0-10")) {
      toast("Analyzing your campaign objectives...", { icon: "🤔" });
      setToastStages((prev) => [...prev, "0-10"]);
    }

    if (timeSpent >= 30 && timeSpent < 45 && !toastStages.includes("30-45")) {
      toast("We’re generating your creatives!", { icon: "⚙️" });
      setToastStages((prev) => [...prev, "30-45"]);
    }

    if (timeSpent >= 45 && timeSpent < 60 && !toastStages.includes("45-60")) {
      toast("Still working on it! Great creatives take time. Hang tight!", {
        icon: "⌛",
      });
      setToastStages((prev) => [...prev, "45-60"]);
    }

    if (timeSpent >= 60 && timeSpent < 90 && !toastStages.includes("60-90")) {
      toast(
        "Tip: Once your creatives are ready, you can easily edit them to match your vision!",
        { icon: "💡" }
      );
      setToastStages((prev) => [...prev, "60-90"]);
    }

    if (timeSpent >= 90 && !toastStages.includes("90+")) {
      toast(
        "This is taking longer than usual. Hang tight while we refine your creatives!",
        { icon: "🏗️" }
      );
      setToastStages((prev) => [...prev, "90+"]);
    }
  }, [timeSpent, loading, toastStages]);

  // -------------------------------------------------------
  // Polotno -> S3 -> create flow for each template
  // -------------------------------------------------------
  async function generateUploadAndCreateTemplate(store, storeJson) {
    try {
      const base64Image = await store.toDataURL({
        pageId: store.pages[0].id,
        mimeType: "image/jpeg",
        quality: 0.7,
      });
      if (!base64Image) {
        toast.error("Error in generating the image! Try again later.");
        triggerBackgroundHardRefresh();
        return null;
      }

      const imageBlob = await dataURLToBlob(base64Image);
      const s3Url = await uploadImageToS3(imageBlob);
      if (!s3Url) {
        triggerBackgroundHardRefresh();
        return null;
      }

      const creationResponse = await createTemplateOnServer(s3Url, storeJson);
      return { s3Url, creationResponse };
    } catch {
      toast.error("Oops! Something went wrong. We'll reload soon.");
      triggerBackgroundHardRefresh();
      return null;
    }
  }

  async function handleGenerateResponse(apiData, allTemplates) {
    const {
      productImageURL,
      brandLogoURL,
      imageSize,
      brandID,
      generateContentResponses,
    } = apiData;

    const templateResponses =
      generateContentResponses?.templateResponses || [];
    const imageContents =
      generateContentResponses?.generateImageContentResponses || [];

    const colorPalettes = brandFetched?.data?.data?.colorPalettes || [];
    const maxCount = Math.min(templateResponses.length, imageContents.length);

    for (let i = 0; i < maxCount; i++) {
      const tResp = templateResponses[i];
      const placeholders = imageContents[i];

      const combinedPlaceholders = {
        ...placeholders,
        productImageURL,
        brandLogoURL,
        website: brandFetched?.data?.data?.websiteUrl,
      };

      const templateId = tResp.id;
      let templateRes;
      try {
        templateRes = await axios.get(`${baseUrl}/v2/template/${templateId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
      } catch {
        toast.error("Error fetching template. We'll reload soon.");
        triggerBackgroundHardRefresh();
        continue;
      }

      const polotnoData = templateRes.data?.data?.templateJson;
      if (!polotnoData) {
        toast.error("No template JSON found. Reloading soon.");
        triggerBackgroundHardRefresh();
        continue;
      }

      let paletteData = null;
      if (Array.isArray(colorPalettes) && colorPalettes.length > i) {
        const paletteItem = colorPalettes[i];
        if (paletteItem?.palette) {
          const colors = paletteItem.palette.split(",").map((c) => c.trim());
          if (colors.length >= 3) {
            paletteData = { colors };
          }
        }
      }

      const updatedTemplateData = applyTemplate(
        polotnoData,
        combinedPlaceholders,
        paletteData
      );
      if (!updatedTemplateData) {
        continue;
      }

      const store = createStore({
        key: POLNOTO_API_KEY,
        useSideApi: true,
      });
      setCurrentStore(store);

      store.clear();
      await new Promise((r) => setTimeout(r, 100));

      try {
        store.loadJSON(updatedTemplateData);
      } catch {
        toast.error("Error loading JSON. Reloading soon.");
        triggerBackgroundHardRefresh();
        continue;
      }

      const flowResult = await generateUploadAndCreateTemplate(
        store,
        updatedTemplateData
      );
      store.clear();
      setCurrentStore(null);

      if (!flowResult || !flowResult.s3Url || !flowResult.creationResponse) {
        continue;
      }
      const createdData = flowResult.creationResponse.data;
      allTemplates.push({
        renderedImage: flowResult.s3Url,
        productImageURL,
        brandLogoURL,
        brandId: brandID,
        imageSize,
        templateObj: {
          templateId: createdData?.templateId || "",
          url: createdData?.url || flowResult.s3Url,
          templateOrientation: createdData?.templateOrientation || "1:1",
          priority: createdData?.priority || 0,
          templateSize: createdData?.templateSize || imageSize || "1080x1080",
          brandId: createdData?.brandId || brandID || FIXED_BRAND_ID,
          version: createdData?.version || "",
          tag: createdData?.tag || "",
          postType: createdData?.postType || "standard",
          customTemplate: createdData?.customTemplate || false,
          mediaType: createdData?.mediaType || "image",
          videoDuration: createdData?.videoDuration || "00:00",
          voiceoverEnabled:
            createdData?.voiceoverEnabled === undefined
              ? true
              : createdData?.voiceoverEnabled,
          templateJson:
            createdData?.templateJson || JSON.stringify(updatedTemplateData),
          isFavourite: createdData?.isFavourite || false,
        },
      });
    }
  }

  // -------------------------------------------------------
  // 8) Main generation
  // -------------------------------------------------------
  const generateAndFetchTemplates = async () => {
    setLoading(true);
    try {
      const storedPayload = localStorage.getItem("creativePayload");
      if (!storedPayload) {
        toast.error("No creativePayload found in localStorage.");
        setLoading(false);
        return;
      }
      const parsedPayload = JSON.parse(storedPayload);

      FIXED_BRAND_ID = parsedPayload.brandId;
      if (FIXED_BRAND_ID) {
        try {
          brandFetched = await axios.get(`${baseUrl}/v2/api/brands/${FIXED_BRAND_ID}`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
        } catch {
          toast.error("Error fetching brand data. Reloading soon.");
          triggerBackgroundHardRefresh();
          return;
        }
      }

      const allTemplates = [];
      const { postType, cohortIds } = parsedPayload;

      if (postType === "SocialMediaPost") {
        const requestBody = { ...parsedPayload, cohortId: "" };
        delete requestBody.cohortIds;

        let generateResp;
        try {
          generateResp = await axios.post(`${baseUrl}/v2/generate`, requestBody, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
        } catch {
          toast.error("Error generating SocialMediaPost. Reloading soon.");
          triggerBackgroundHardRefresh();
          setLoading(false);
          return;
        }

        const apiData = generateResp.data?.data;
        if (apiData) {
          await handleGenerateResponse(apiData, allTemplates);
        }
      } else {
        if (!Array.isArray(cohortIds) || cohortIds.length === 0) {
          toast.error("No cohortIds for AdCreative. Reloading soon.");
          triggerBackgroundHardRefresh();
          setLoading(false);
          return;
        }

        for (const singleCohortId of cohortIds) {
          const requestBody = { ...parsedPayload, cohortId: singleCohortId };
          delete requestBody.cohortIds;

          let generateResp;
          try {
            generateResp = await axios.post(`${baseUrl}/v2/generate`, requestBody, {
              headers: { Authorization: `Bearer ${jwtToken}` },
            });
          } catch {
            toast.error("Error generating AdCreative. Reloading soon.");
            triggerBackgroundHardRefresh();
            continue;
          }

          const apiData = generateResp.data?.data;
          if (apiData) {
            await handleGenerateResponse(apiData, allTemplates);
          }
        }
      }
      setTemplates(allTemplates);
      toast.success("Templates generated successfully!");
    } catch {
      toast.error("Failed to generate or fetch templates. Reloading soon.");
      triggerBackgroundHardRefresh();
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // 9) Bookmarks + Edit
  // -------------------------------------------------------
  const handleBookmark = async (index) => {
    try {
      const existing = templates[index];
      if (!existing?.templateObj) {
        toast.error("No template object found to bookmark.");
        return;
      }

      const templateId = existing.templateObj.templateId;
      if (!templateId) {
        toast.error("No templateId found. Cannot bookmark.");
        return;
      }

      const payload = {
        ...existing.templateObj,
        isFavourite: true,
      };

      const updated = [...templates];
      updated[index].templateObj.isFavourite = true;
      setTemplates(updated);

      const response = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (response.data?.data?.isFavourite === true) {
        toast.success("Template bookmarked successfully!");
      }
    } catch {
      toast.error("Could not bookmark template. Reloading soon.");
      triggerBackgroundHardRefresh();
    }
  };

  const handleEdit = (templateObj) => {
    navigate("/editor", { state: { templateData: templateObj } });
  };

  // -------------------------------------------------------
  // 10) Lifecycle
  // -------------------------------------------------------
  useEffect(() => {
    if (isNextSectionOpen) {
      generateAndFetchTemplates();
    }
  }, [isNextSectionOpen]);

  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  // -------------------------------------------------------
  // 11) Helpers
  // -------------------------------------------------------
  const BookmarkBeforeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 -960 960 960"
      width="20"
      fill="#A8A8A8"
    >
      <path d="M200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Zm400 160v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
    </svg>
  );

  const BookmarkAfterIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 -960 960 960"
      width="20"
      fill="#A8A8A8"
    >
      <path d="m389-400 91-55 91 55-24-104 80-69-105-9-42-98-42 98-105 9 80 69-24 104ZM200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
    </svg>
  );

  async function handleDownload(url) {
    if (!url) {
      toast.error("No URL available for download.");
      return;
    }
    const fileName = url.split("/").pop();
    try {
      const response = await axios.get(
        `${baseUrl}/sparkiq/image/download/${fileName}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          responseType: "blob",
        }
      );
      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Downloaded successfully!");
    } catch {
      toast.error("Failed to download. Reloading soon.");
      triggerBackgroundHardRefresh();
    }
  }

  // -------------------------------------------------------
  // 12) Render
  // -------------------------------------------------------
  return (
    <div
      className="flex flex-col gap-4 mb-4 overflow-auto hide-scrollbar"
      style={{ maxHeight: "80vh" }}
    >
      <section
        ref={sectionRef}
        className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] max-w-6xl lg:ml-8 ml-0 ${
          !isNextSectionOpen ? "p-2 lg:p-3" : "p-0"
        } flex flex-col gap-6 relative z-10 mb-4`}
      >
        {/* Invisible gradient definition */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#004367" />
              <stop offset="100%" stopColor="#00A7FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Accordion Header */}
        <div
          className={`flex flex-wrap justify-between items-center bg-[rgba(252,252,252,0.40)] ${
            !isNextSectionOpen ? "rounded-[20px] p-2" : "rounded-t-[20px] p-4"
          } relative cursor-pointer`}
          onClick={toggleNextSectionAccordion}
        >
          {isCompleted && (
            <span className="bg-[#A7F3D0] text-[#059669] text-xs font-medium rounded-[10px] px-3 py-1 flex items-center gap-[10px] w-fit absolute right-0 -top-3">
              Completed
            </span>
          )}
          <span className="flex items-center gap-4">
            <img src="/icon5.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
                Generated Creatives
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                AI Generated Creatives
              </p>
            </span>
          </span>
        </div>

        {/* Accordion Body */}
        {isNextSectionOpen && (
          <div className="p-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-[20px] shadow-md"
                  >
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Loading Creative {num}...</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {templates.map((item, idx) => {
                  const { templateObj, renderedImage } = item;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center p-6 bg-white rounded-[20px] shadow-md"
                    >
                      <img
                        src={renderedImage}
                        alt={`Template_${idx}`}
                        className="w-full h-auto rounded-[12px] mb-2"
                      />
                      <div className="button-wrapper flex justify-between w-full gap-2 px-2 -ml-8">
                        {/* Bookmark */}
                        <button
                          className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                          onClick={
                            !templateObj.isFavourite
                              ? () => handleBookmark(idx)
                              : undefined
                          }
                          style={{
                            cursor: templateObj.isFavourite ? "not-allowed" : "pointer",
                          }}
                        >
                          <div className="button-container">
                            {templateObj.isFavourite ? (
                              <>
                                <BookmarkAfterIcon />
                                <span className="ml-1 text-xs">Bookmarked</span>
                              </>
                            ) : (
                              <>
                                <BookmarkBeforeIcon />
                                <span className="ml-1 text-xs">Bookmark</span>
                              </>
                            )}
                          </div>
                        </button>

                        {/* Edit */}
                        <button
                          className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                          onClick={() => handleEdit(templateObj)}
                        >
                          <div className="button-container">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.6564 3.65685C11.8469 3.46632 12.1531 3.46632 12.3436 3.65685L14.3436 5.65685C14.5342 5.84737 14.5342 6.15353 14.3436 6.34406L6.37492 14.3127C6.28097 14.4067 6.15792 14.4645 6.02724 14.4746L3.02724 14.7246C2.88342 14.7365 2.74001 14.6882 2.63433 14.584C2.52865 14.4797 2.47272 14.3361 2.48451 14.1923L2.73451 11.1923C2.74455 11.0616 2.80233 10.9385 2.89635 10.8446L10.865 2.87592L11.6564 3.65685Z"
                                stroke="#A8A8A8"
                                strokeWidth="1.5"
                                fill="none"
                              />
                              <rect
                                x="3"
                                y="16"
                                width="10"
                                height="1.5"
                                fill="#A8A8A8"
                              />
                            </svg>
                            <span className="-ml-1 text-xs">Edit</span>
                          </div>
                        </button>

                        {/* Preview */}
                        <button
                          className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                          onClick={() =>
                            handlePreviewClick?.(
                              product?.imageURL || product?.generatedImage,
                              modelName,
                              product?.index
                            )
                          }
                        >
                          <div className="button-container">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#A8A8A8"
                              width="20"
                              height="20"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                              />
                            </svg>
                            <span className="text-xs">Preview</span>
                          </div>
                        </button>

                        {/* Download */}
                        <button
                          className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                          onClick={() => handleDownload(renderedImage)}
                        >
                          <div className="button-container">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#A8A8A8"
                              width="20"
                              height="20"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5"
                              />
                              <rect
                                x="11.25"
                                y="3"
                                width="1.5"
                                height="11.5"
                                fill="#A8A8A8"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 12 12 16.5 7.5 12"
                                fill="none"
                                stroke="#A8A8A8"
                              />
                            </svg>
                            <span className="text-xs">Download</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentStore && (
          <div
            ref={workspaceRef}
            style={{
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
              width: 0,
              height: 0,
              overflow: "hidden",
            }}
          >
            <Workspace store={currentStore} pageId={currentStore.pages[0]?.id} />
          </div>
        )}
      </section>
    </div>
  );
}
