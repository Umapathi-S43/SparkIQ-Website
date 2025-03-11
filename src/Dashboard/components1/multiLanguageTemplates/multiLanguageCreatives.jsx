import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Polotno (local rendering)
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import {
  unstable_setAnimationsEnabled,
  unstable_setTextOverflow,
} from "polotno/config";

import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

import "../../../components/advert/Creatives.css";

// Polotno API key (if your plan requires it)
const POLNOTO_API_KEY = "H5HjfuZWdlg9X4gOUB27";

// Enable Polotno animations
unstable_setAnimationsEnabled(true);

/**
 * A small spinner for individual steps (16 "fade lines" in a circle).
 */
const SmallStepSpinner = () => (
  <div style={{ width: 24, height: 24, position: "relative" }}>
    <svg width="24" height="24" viewBox="0 0 50 50">
      {[...Array(16)].map((_, i) => (
        <line
          key={i}
          x1="25"
          y1="5"
          x2="25"
          y2="10"
          stroke="#082A66"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${i * 22.5}, 25, 25)`}
          className={`fade-line fade-line-${i}`}
        />
      ))}
    </svg>
    <style>
      {`
        .fade-line {
          animation: fade 1s infinite;
          opacity: 0.3;
        }
        .fade-line-0 { animation-delay: 0s; }
        .fade-line-1 { animation-delay: 0.0625s; }
        .fade-line-2 { animation-delay: 0.125s; }
        .fade-line-3 { animation-delay: 0.1875s; }
        .fade-line-4 { animation-delay: 0.25s; }
        .fade-line-5 { animation-delay: 0.3125s; }
        .fade-line-6 { animation-delay: 0.375s; }
        .fade-line-7 { animation-delay: 0.4375s; }
        .fade-line-8 { animation-delay: 0.5s; }
        .fade-line-9 { animation-delay: 0.5625s; }
        .fade-line-10 { animation-delay: 0.625s; }
        .fade-line-11 { animation-delay: 0.6875s; }
        .fade-line-12 { animation-delay: 0.75s; }
        .fade-line-13 { animation-delay: 0.8125s; }
        .fade-line-14 { animation-delay: 0.875s; }
        .fade-line-15 { animation-delay: 0.9375s; }
  
        @keyframes fade {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}
    </style>
  </div>
);

/**
 * A single row in our multi-step indicator.
 * If completed, shows a blue circle with a white check;
 * otherwise, shows the spinner.
 */
function StepRow({ label, completed }) {
  return (
    <div style={styles.stepRow}>
      {completed ? (
        <div style={styles.completedIcon}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <SmallStepSpinner />
      )}
      <span style={styles.stepLabel}>{label}</span>
    </div>
  );
}

export default function MultiLanguageCreatives() {
  const location = useLocation();
  const navigate = useNavigate();

  // The object passed from the calling code
  const templateData = location.state?.templateData || {};

  // Polotno store in a ref
  const storeRef = useRef(createStore({ key: POLNOTO_API_KEY }));

  // A list of required placeholders
  const REQUIRED_KEYS = [
    "title",
    "description",
    "cta",
    "feature1",
    "feature2",
    "feature3",
    "feature4",
    "mrp",
    "discount",
  ];

  // Steps for the entire generation process
  const defaultSteps = [
    { label: "Analyzing the english content...", completed: false },
    { label: "Fetching the selected languages...", completed: false },
    { label: "Translating content into selected languages...", completed: false },
    { label: "Creating creatives, uploading and rendering...", completed: false },
  ];
  const [steps, setSteps] = useState(defaultSteps);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [renderingComplete, setRenderingComplete] = useState(false);

  // Store the brand languages: array of objects => { code, name }
  const [brandLanguages, setBrandLanguages] = useState([]);

  // Final results: array of objects, each with { language, languageName, creatives }
  const [finalResults, setFinalResults] = useState([]);

  // On mount, start generation if templateJson is available
  useEffect(() => {
    if (templateData.templateJson) {
      startCreativeGeneration();
    } else {
      console.log("No templateJson found; skipping generation.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  // Helper: mark a step as completed (by index)
  function markStepCompleted(index) {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, completed: true } : step))
    );
  }

  // Extract placeholders from the templateJson ("English" source)
  function extractPlaceholdersFromTemplateJson(templateJson) {
    let placeholders = {};
    try {
      let parsed =
        typeof templateJson === "string"
          ? JSON.parse(templateJson)
          : JSON.parse(JSON.stringify(templateJson));

      if (!parsed.pages) return placeholders;

      parsed.pages.forEach((page) => {
        (page.children || []).forEach((elem) => {
          if (
            elem.type === "text" &&
            elem.custom?.edit === true &&
            elem.custom?.variable
          ) {
            const varName = elem.custom.variable.replace(/[{}]/g, "");
            placeholders[varName] = elem.text || "";
          }
        });
      });
    } catch (err) {
      console.error("extractPlaceholdersFromTemplateJson error:", err);
    }
    return placeholders;
  }

  // Main flow: run steps sequentially
  async function startCreativeGeneration() {
    try {
      setLoading(true);
      setRenderingComplete(false);

      // Step 1: Analyze placeholders
      const baseEnglishContent = extractPlaceholdersFromTemplateJson(
        templateData.templateJson
      );
      REQUIRED_KEYS.forEach((key) => {
        if (!baseEnglishContent.hasOwnProperty(key)) {
          baseEnglishContent[key] = "string";
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 3000)); // delay for effect
      markStepCompleted(0);

      // Step 2: Fetch brand languages
      const brandLangs = await fetchBrandLanguageCodes(templateData?.brandId);
      setBrandLanguages(brandLangs);
      if (!brandLangs.length) {
        toast.error("No brand languages found. Aborting generation.");
        setLoading(false);
        setRenderingComplete(true);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // delay for effect
      markStepCompleted(1);

      // Step 3: Translate placeholders
      const codesArray = brandLangs.map((lang) => lang.code);
      const translatePayload = {
        content: baseEnglishContent,
        languages: codesArray,
      };
      const translations = await translateLanguages(translatePayload);
      if (!translations) {
        toast.error("No translations returned. Aborting.");
        setLoading(false);
        setRenderingComplete(true);
        return;
      }
      markStepCompleted(2);

      // Step 4: Create creatives for each language
      const multiLangResults = [];
      const rawTemplateJson = templateData.templateJson;
      if (!rawTemplateJson) {
        toast.error("No templateJson in templateData. Nothing to render.");
        setLoading(false);
        setRenderingComplete(true);
        return;
      }

      for (const { code, name } of brandLangs) {
        const textMap = translations[code];
        if (!textMap) {
          continue;
        }
        const updatedJson = applyTemplate(rawTemplateJson, textMap);
        if (!updatedJson) continue;
        const renderedCreative = await localPolotnoRender(
          updatedJson,
          templateData
        );
        if (renderedCreative) {
          multiLangResults.push({
            language: code,
            languageName: name,
            creatives: [renderedCreative],
          });
        }
      }
      setFinalResults(multiLangResults);
      markStepCompleted(3);
    } catch (err) {
      console.error("Error in startCreativeGeneration:", err);
      toast.error("Something went wrong generating multi-language creatives.");
    } finally {
      setLoading(false);
      setRenderingComplete(true);
    }
  }

  // Fetch brand language codes from the API
  async function fetchBrandLanguageCodes(brandId) {
    if (!brandId) {
      return [];
    }
    try {
      const url = `${baseUrl}/api/brand/languages`;
      const resp = await axios.get(url, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const dataArr = resp.data?.data || [];
      return dataArr.map((item) => ({
        code: item.languages?.code,
        name: item.languages?.name,
      }));
    } catch (err) {
      console.error("fetchBrandLanguageCodes error:", err);
      return [];
    }
  }

  // Call translation API to translate placeholders
  async function translateLanguages(payload) {
    try {
      const url = `${baseUrl}/v2/languages/translate`;
      const resp = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return resp.data?.data;
    } catch (err) {
      console.error("translateLanguages error:", err);
      return null;
    }
  }

  // Apply the translated placeholders to the template JSON
  function applyTemplate(templateJson, placeholders) {
    try {
      let parsed =
        typeof templateJson === "string"
          ? JSON.parse(templateJson)
          : JSON.parse(JSON.stringify(templateJson));
      parsed.pages.forEach((page) => {
        page.children.forEach((elem) => {
          if (
            elem.type === "text" &&
            elem.custom?.edit === true &&
            elem.custom?.variable
          ) {
            const varName = elem.custom.variable.replace(/[{}]/g, "");
            const newVal = placeholders[varName];
            if (typeof newVal === "string") {
              elem.text = newVal;
            }
          } else if (
            elem.type === "image" &&
            elem.custom?.edit === true &&
            elem.custom?.variable
          ) {
            const varName = elem.custom.variable.replace(/[{}]/g, "");
            const newSrc = placeholders[varName];
            if (typeof newSrc === "string" && newSrc.startsWith("http")) {
              elem.src = newSrc;
            }
          }
        });
      });
      return parsed;
    } catch (err) {
      console.error("applyTemplate error:", err);
      toast.error("Failed to apply placeholders.");
      return null;
    }
  }

  // Render the creative locally, capture as image, upload and create on server
  async function localPolotnoRender(finalJson, originalTemplateData) {
    try {
      const store = storeRef.current;
      unstable_setTextOverflow("resize");
      unstable_setTextOverflow("change-font-size");
      store.loadJSON(finalJson);

      // await new Promise((r) => setTimeout(r, 300));
      // const dataURL = await store.toDataURL({
      //   pixelRatio: 1,
      //   mimeType: "image/png",
      // });
      
      const designJson = store.toJSON();
      // polotno cloud
      const renderRequest = await fetch(
        `https://api.polotno.com/api/renders?KEY=${POLNOTO_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Prefer: "wait",
          },
          body: JSON.stringify({
            design: designJson,
            format: "jpeg",
            pixelRatio: 1,
            ignoreBackground: false,
            skipFontError: true,
            skipImageError: true
          }),
        }
      );
      const renderJob = await renderRequest.json();
      if (renderJob.status !== "done" || !renderJob.output) {
        toast.error("Error generating image!");
        return null;
      }

      const imageResponse = await fetch(renderJob.output);
      if (!imageResponse.ok) {
        toast.error("Failed to retrieve the rendered image.");
        return null;
      }
      const imageBlob = await imageResponse.blob();

      const s3Url = await uploadImageToS3(imageBlob);
      if (!s3Url) {
        store.clear();
        return null;
      }
      const created = await createTemplateOnServer(
        s3Url,
        finalJson,
        originalTemplateData
      );
      store.clear();
      if (!created) return null;
      return {
        imageUrl: s3Url,
        ...created.data,
      };
    } catch (err) {
      console.error("Error in localPolotnoRender:", err);
      storeRef.current?.clear();
      return null;
    }
  }

  // Upload image to S3
  async function uploadImageToS3(imageBlob) {
    try {
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
      return response.data?.data?.url || null;
    } catch (err) {
      console.error("uploadImageToS3 error:", err);
      return null;
    }
  }

  // Create the template on the server
  async function createTemplateOnServer(s3Url, finalJson, originalTemplateData) {
    try {
      const payload = {
        templateId: "",
        url: s3Url,
        templateOrientation: originalTemplateData.templateOrientation || "1:1",
        priority: 1,
        templateSize: originalTemplateData?.templateSize || "1080x1080",
        brandId: originalTemplateData?.brandId || "",
        version: "1",
        tag: "MultiLang",
        postType: originalTemplateData.postType || "MultiLanguage",
        customTemplate: true,
        mediaType: originalTemplateData.mediaType || "image",
        cohortId: "",
        videoDuration: originalTemplateData.videoDuration || "00:00",
        voiceoverEnabled:
          originalTemplateData.voiceoverEnabled === undefined
            ? false
            : originalTemplateData.voiceoverEnabled,
        templateJson: JSON.stringify(finalJson),
        isFavourite: false,
        productId: "sip-3be59ad9-c",
      };
      const resp = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return resp.data;
    } catch (err) {
      console.error("createTemplateOnServer error:", err);
      toast.error("Failed to create template on server.");
      return null;
    }
  }

  // Handlers for Edit and Download actions
  function handleEdit(creative) {
    navigate("/editor", { state: { templateData: creative } });
  }

  async function handleDownload(creative) {
    if (!creative?.templateJson) {
      toast.error("No template JSON available for download.");
      return;
    }
    try {
      const store = storeRef.current;
      store.loadJSON(JSON.parse(creative.templateJson));
      await new Promise((r) => setTimeout(r, 300));
      const dataURL = await store.toDataURL({
        mimeType: "image/png",
        pixelRatio: 2,
      });
      const blob = await (await fetch(dataURL)).blob();
      const fileName = `creative_${Date.now()}.png`;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error generating + downloading image:", error);
      toast.error("Failed to download image.");
    }
  }


  // --------------------------------------------------
  // Bookmark Icons
  // --------------------------------------------------
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

  // ---------------------------------------
  // 16) Toggle Bookmark
  // ---------------------------------------
  const handleToggleBookmark = async (item) => {
    try {
      // Assume each group has one creative stored at item.creatives[0]
      const currentFavState = item.creatives[0].isFavourite || false;
      const newFavState = !currentFavState;

      // Optimistic UI update: update the bookmark state in finalResults
      setFinalResults((prev) =>
        prev.map((langGroup) => {
          if (langGroup.language === item.language) {
            return {
              ...langGroup,
              creatives: langGroup.creatives.map((creative) =>
                creative.imageUrl === item.creatives[0].imageUrl
                  ? { ...creative, isFavourite: newFavState }
                  : creative
              ),
            };
          }
          return langGroup;
        })
      );

      // Build the payload from the creative data
      const payload = { ...item.creatives[0], isFavourite: newFavState };

      // Send the updated bookmark state to the server
      const response = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (response.data?.data?.isFavourite === newFavState) {
        toast.success(newFavState ? "Bookmarked successfully!" : "Unbookmarked successfully!");
      } else {
        toast.error("Failed to update bookmark on server.");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Could not update bookmark.");
    }
  };

  // Group finalResults into rows of 3 items each
  const groupedResults = [];
  for (let i = 0; i < finalResults.length; i += 3) {
    groupedResults.push(finalResults.slice(i, i + 3));
  }

  return (
    <div className="flex-grow lg:mr-8 lg:ml-0 ml-2 mx-auto">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl mb-4">
        {/* HEADER */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#004367" />
              <stop offset="100%" stopColor="#00A7FF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-4 pb-0 relative">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="/icon1.svg" alt="" className="w-10 lg:w-12" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-2xl">
                Generate Ad Creatives
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Generate multi-language ad creatives using our advanced AI.
              </p>
            </span>
          </span>
          <img
            src="/image1.png"
            alt=""
            className="absolute bottom-0 right-24 w-28 lg:w-36 hidden md:block"
          />
        </div>

        {/* BODY */}
        <div className="overflow-auto hide-scrollbar" style={{ maxHeight: "59vh" }}>
          {/* Steps section (centered container, left-aligned rows) */}
          {loading && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.75rem",
                width: "100%",
                maxWidth: "400px",
                marginLeft: "auto",
                marginRight: "auto",
                height: "50vh"
              }}
            >
              {steps.map((step, idx) => (
                <StepRow key={idx} label={step.label} completed={step.completed} />
              ))}
            </div>
          )}

          {/* "No data yet." display */}
          {!loading && finalResults.length === 0 && (
            <div className="shadow-md p-2 rounded-lg border border-gray-200 text-gray-600 mt-4 mx-4">
              No data yet.
            </div>
          )}

          {/* Final results */}
          {!loading && finalResults.length > 0 && (
            <div className="p-4 ml-4">
              <h5 className="text-xl font-bold text-blue-900 mb-4">
                Multi-Language Creatives
              </h5>
              {groupedResults.map((group, groupIndex) => (
                <div key={groupIndex} className="grid grid-cols-1 lg:grid-cols-3 grid-cols-2 gap-6 pb-8">
                  {group.map((item, itemIndex) => (
                    <div><div className="mb-2 flex items-center justify-center text-lg font-semibold text-[#082A66]">
                      {item.languageName || item.language.toUpperCase()}
                    </div>
                      <div
                        key={itemIndex}
                        className="flex flex-col items-center justify-center bg-white rounded-[20px] shadow-md p-4"
                      >

                        <div className="w-full flex items-center justify-center mb-3">
                          <img
                            src={item.creatives[0].imageUrl}
                            alt="Rendered Creative"
                            className="w-full h-auto rounded-[12px]"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="flex justify-between w-full gap-2 px-2">
                          <button
                            className="text-sm text-[#A8A8A8] rounded-lg py-1 px-1 button-clear"
                            onClick={() => handleToggleBookmark(item)}
                          >
                            <div className="button-container flex items-center">
                              {item.creatives[0].isFavourite ? (
                                <>
                                  <BookmarkAfterIcon />
                                  <span>Bookmarked</span>
                                </>
                              ) : (
                                <>
                                  <BookmarkBeforeIcon />
                                  <span className="ml-1">Bookmark</span>
                                </>
                              )}
                            </div>
                          </button>

                          <button
                            className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear"
                            onClick={() => handleEdit(item.creatives[0])}
                          ><div className="button-container flex items-center">
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
                                <rect x="3" y="16" width="10" height="1.5" fill="#A8A8A8" />
                              </svg>
                              <span>Edit</span>
                            </div>
                          </button>
                          <button
                            className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear"
                            onClick={() => handleDownload(item.creatives[0])}
                          >
                            <div className="button-container flex items-center">
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
                              <span>Download</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden Polotno workspace */}
      <div
        style={{
          position: "absolute",
          top: -9999,
          left: -9999,
          width: "1080px",
          height: "1080px",
          overflow: "hidden",
        }}
      >
        <Workspace store={storeRef.current} width={1080} height={1080} />
      </div>
    </div>
  );
}

// Inline styles for step rows
const styles = {
  stepRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "4px"
  },
  completedIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#106ba3",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: "0.95rem",
    color: "#333",
  },
};
