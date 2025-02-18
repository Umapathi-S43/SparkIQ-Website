import { useEffect, useRef, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import "./Creatives.css";
import { baseUrl } from "../utils/Constant";
import { jwtToken } from "../utils/jwtToken";
import { useNavigate } from "react-router-dom";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import Loader from "./CreativesLoader";

// Polotno / Cloud Render constants
const POLNOTO_API_KEY = "H5HjfuZWdlg9X4gOUB27";
let FIXED_BRAND_ID = null;
let brandFetched = null;

export default function Creatives({
  isNextSectionOpen,
  toggleNextSectionAccordion,
  isCompleted,
  creativePayload,
}) {
  const sectionRef = useRef(null);
  const workspaceRef = useRef(null);
  const [currentStore, setCurrentStore] = useState(null);
  const [renderingComplete, setRenderingComplete] = useState(false);

  // Loader states
  const [loading, setLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState({
    brandDetails: false,
    generateContent: false,
    applyTemplate: false,
    cloudRender: false,
  });

  // Final aggregated results grouped by cohort
  // => Each element is { cohortName, creatives: [ { ...serverData, imageUrl }, ... ] }
  const [finalResults, setFinalResults] = useState([]);

  const navigate = useNavigate();

  // Scroll into view if open
  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  // Start generation if we have new payload
  useEffect(() => {
    if (creativePayload) {
      startCreativeGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creativePayload]);

  // --------------------------------------------
  // 1) Main Flow
  // --------------------------------------------
  const startCreativeGeneration = async () => {
    try {
      setLoading(true);
      setRenderingComplete(false); // Reset rendering state

      // STEP 1: Fetch brand details
      setLoadingSteps((prev) => ({ ...prev, brandDetails: true }));
      const brandData = await fetchBrandDetails();
      brandFetched = brandData; // store globally if needed
      setLoadingSteps((prev) => ({ ...prev, brandDetails: false }));

      // Store brand ID globally if needed
      FIXED_BRAND_ID = creativePayload.brandId;

      // If postType is not AdCreative => single pass
      if (creativePayload.postType !== "AdCreative") {
        setLoadingSteps((prev) => ({ ...prev, generateContent: true }));
        const singleResult = await handleGenerateSingle(creativePayload);
        setLoadingSteps((prev) => ({ ...prev, generateContent: false }));

        setFinalResults([singleResult]); // one group => "General"
        setLoading(false);
        setRenderingComplete(true);
        return;
      }

      // If postType is AdCreative => handle multiple cohorts
      if (
        !Array.isArray(creativePayload.cohortIds) ||
        creativePayload.cohortIds.length === 0
      ) {
        toast.error("No cohortIds for AdCreative. Stopping.");
        setLoading(false);
        setRenderingComplete(true);
        return;
      }

      const allCohortResults = [];

      for (const cohortId of creativePayload.cohortIds) {
        // Modify payload
        const modifiedPayload = { ...creativePayload, cohortId };
        delete modifiedPayload.cohortIds;

        setLoadingSteps((prev) => ({ ...prev, generateContent: true }));
        const cohortResult = await handleGenerateSingle(modifiedPayload);
        setLoadingSteps((prev) => ({ ...prev, generateContent: false }));

        if (cohortResult) {
          allCohortResults.push(cohortResult);
        }
      }

      setFinalResults(allCohortResults);
    } catch (err) {
      console.error("Error in creative generation:", err);
      toast.error("Something went wrong while generating creatives.");
    } finally {
      setLoading(false);
      setRenderingComplete(true);
    }
  };

  // --------------------------------------------
  // 2) handleGenerateSingle => calls /v2/generate once
  // --------------------------------------------
  const handleGenerateSingle = async (payload) => {
    try {
      // 1) Generate content
      const generatedData = await generateContent(payload);
      if (!generatedData?.generateContentResponses?.templateResponses) {
        toast.error("No templates found in generated content.");
        return null;
      }

      // Grab brand details
      const brandLogoURL = generatedData?.brandLogoURL || "";
      const productImageURL = generatedData?.productImageURL || "";
      const websiteUrl = brandFetched?.data?.data?.websiteUrl || "";

      // Grab placeholders + templates
      const placeholderList =
        generatedData.generateContentResponses.generateImageContentResponses || [];
      const templateList =
        generatedData.generateContentResponses.templateResponses || [];

      // Grab colorPalettes from brand data
      const colorPalettes = brandFetched?.data?.data?.colorPalettes || [];

      // This group's label and cohortId (from generate content response)
      const cohortName = generatedData.generateContentResponses?.cohortName || "General";
      const cohortIdFromResponse = generatedData.generateContentResponses?.cohortId || null;

      // Get productId from payload (creativePayload)
      const productId = payload.productId || null;

      // We'll accumulate an array of final rendered images for this single pass
      const creativeImages = [];

      const maxCount = Math.min(placeholderList.length, templateList.length);
      for (let i = 0; i < maxCount; i++) {
        const placeholders = {
          ...placeholderList[i],
          productImageURL,
          brandLogoURL,
          website: websiteUrl,
        };

        let paletteData = null;
        if (colorPalettes[i]?.palette) {
          const colors = colorPalettes[i].palette.split(",").map((c) => c.trim());
          if (colors.length >= 3) {
            paletteData = { colors };
          }
        }

        // fetch polotno template
        const templateId = templateList[i].id;
        const polotnoData = await fetchPolotnoTemplate(templateId);
        if (!polotnoData) continue;

        // apply placeholders + palette
        const updatedTemplateJson = applyTemplate(polotnoData, placeholders, paletteData);
        if (!updatedTemplateJson) continue;

        // load into Polotno, generate & upload, passing cohortId and productId
        const renderedCreative = await polotnoCloudRender(
          updatedTemplateJson,
          cohortIdFromResponse,
          productId
        );
        if (!renderedCreative) continue;

        // e.g.  { imageUrl: s3Url, templateId: ..., isFavourite, brandId... }
        creativeImages.push(renderedCreative);
      }

      return {
        cohortName,
        creatives: creativeImages, // array of { imageUrl, templateId, ...server data }
      };
    } catch (error) {
      console.error("Error in handleGenerateSingle:", error);
      return null;
    }
  };

  // Step => /v2/generate
  const generateContent = async (payload) => {
    delete payload.cohortIds; // remove leftover
    const response = await axios.post(`${baseUrl}/v2/generate`, payload, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    return response.data?.data;
  };

  // Polotno fetch
  const fetchPolotnoTemplate = async (templateId) => {
    try {
      const response = await axios.get(`${baseUrl}/v2/template/${templateId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      localStorage.setItem("tag", JSON.stringify(response.data?.data?.tag));
      return response.data?.data?.templateJson || null;
    } catch (err) {
      console.error("Failed to fetch Polotno template:", templateId, err);
      return null;
    }
  };

  // --------------------------------------------
  // 3) Polotno -> Cloud Render -> S3 -> Create Template
  // --------------------------------------------
  const polotnoCloudRender = async (templateJson, cohortId, productId) => {
    // create Polotno store
    const { createStore } = await import("polotno/model/store");
    const store = createStore({ key: POLNOTO_API_KEY });
    await new Promise((r) => setTimeout(r, 100)); // short wait
    store.loadJSON(templateJson);

    // do the cloud flow, passing cohortId and productId
    const flowResult = await generateUploadAndCreateTemplate(store, templateJson, cohortId, productId);

    // clear store
    store.clear();
    return flowResult;
  };

  // => generate + upload + create
  async function generateUploadAndCreateTemplate(store, storeJson, cohortId, productId) {
    try {
      const designJson = store.toJSON();
      // Polotno Cloud
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
            skipImageError: true,
            textOverflow: "change-font-size",
          }),
        }
      );
      const renderJob = await renderRequest.json();
      if (renderJob.status !== "done" || !renderJob.output) {
        toast.error("Error generating image!");
        return null;
      }

      // fetch final image from cloud
      const imageResponse = await fetch(renderJob.output);
      if (!imageResponse.ok) {
        toast.error("Failed to retrieve the rendered image.");
        return null;
      }

      // convert to blob
      const imageBlob = await imageResponse.blob();

      // upload to S3
      const s3Url = await uploadImageToS3(imageBlob);
      if (!s3Url) {
        return null;
      }

      // create template on server, passing cohortId and productId
      const creationResponse = await createTemplateOnServer(s3Url, storeJson, cohortId, productId);
      if (!creationResponse) return null;

      // final object includes entire server response plus the image
      return {
        imageUrl: s3Url,
        ...creationResponse.data, // e.g. templateId, brandId, isFavourite, etc.
      };
    } catch (error) {
      toast.error("Oops! Something went wrong. Try again later.");
      return null;
    }
  }

  // S3 upload
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
    return response.data?.data?.url;
  }

  // create template on server
  async function createTemplateOnServer(s3Url, storeJson, cohortId, productId) {
    const brandIdFromJson = FIXED_BRAND_ID || "";
    const payload = {
      url: s3Url,
      templateOrientation: "1:1",
      priority: 0,
      templateSize: "1080x1080",
      brandId: brandIdFromJson,
      version: "",
      tag: JSON.parse(localStorage.getItem("tag")) || "Other",
      postType: "standard",
      customTemplate: false,
      mediaType: "image",
      videoDuration: "00:00",
      voiceoverEnabled: true,
      templateJson: JSON.stringify(storeJson),
      isFavourite: false,
      productId: productId, // Added productId
      cohortId: cohortId||"",   // Added cohortId
    };

    try {
      const response = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating template on server:", error);
      toast.error("Failed to create template on the server.");
      return null;
    }
  }

  // --------------------------------------------
  // 4) Placeholder & Color Palettes
  // --------------------------------------------
  function applyTemplate(templateJson, placeholders, paletteData) {
    try {
      const parsedJson = JSON.parse(templateJson);

      // Apply placeholders
      parsedJson.pages.forEach((page) => {
        page.children.forEach((element) => {
          if (element.custom?.variable) {
            const variableName = element.custom.variable.replace(/[{}]/g, "");
            const newValue = placeholders[variableName];
            if (newValue) {
              const elType = (element.type || "").toLowerCase();
              if (elType === "text") {
                element.text = newValue;
              } else if (elType === "image") {
                element.src = decodeURIComponent(newValue);
              }
            }
          }
        });
      });

      // Apply color palette if available
      if (paletteData && Array.isArray(paletteData.colors) && paletteData.colors.length >= 3) {
        applyColorPalette(parsedJson, paletteData);
      }
      return parsedJson;
    } catch (err) {
      console.error("applyTemplate error:", err);
      toast.error("Failed to apply placeholders/color palette.");
      return null;
    }
  }

  function applyColorPalette(parsedJson, paletteData) {
    const [bgColor, textColor, svgColor] = paletteData.colors;
    parsedJson.pages.forEach((page) => {
      page.background = bgColor;
      page.children.forEach((element) => {
        const elType = (element.type || "").toLowerCase();
        if (elType === "svg" || elType === "figure") {
          element.fill = svgColor;
        } else if (elType === "text") {
          element.fill = textColor;
        }
      });
    });
  }

  // step => fetch brand details
  const fetchBrandDetails = async () => {
    setLoadingSteps((prev) => ({ ...prev, brandDetails: true }));
    if (!creativePayload?.brandId) throw new Error("Brand ID is missing");
    const response = await axios.get(`${baseUrl}/v2/api/brands/${creativePayload.brandId}`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    setLoadingSteps((prev) => ({ ...prev, brandDetails: false }));
    return response.data;
  };

  // --------------------------------------------
  // 5) Button actions: Bookmark, Edit, Download
  // --------------------------------------------
  const handleBookmark = async (cohortIndex, creativeIndex) => {
    try {
      const updated = [...finalResults];
      const selected = updated[cohortIndex].creatives[creativeIndex];
      if (!selected.templateId) {
        toast.error("No templateId found. Cannot bookmark.");
        return;
      }

      // Local update
      selected.isFavourite = true;

      // Server update
      const response = await axios.post(
        `${baseUrl}/v2/user/templates`,
        { ...selected, isFavourite: true },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );

      if (response.data?.data?.isFavourite === true) {
        toast.success("Template bookmarked successfully!");
      }

      setFinalResults(updated);
    } catch (err) {
      console.error("Error bookmarking template:", err);
      toast.error("Could not bookmark template.");
    }
  };

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

  const handleEdit = (creative) => {
    navigate("/editor", { state: { templateData: creative } });
  };

  async function handleDownload(creative) {
    if (!creative?.templateJson) {
      toast.error("No template JSON available for download.");
      return;
    }

    try {
      // 1️⃣ Create a temporary Polotno store for image generation
      const tempStore = createStore({ key: "H5HjfuZWdlg9X4gOUB27" });

      // 2️⃣ Load the template JSON into the store
      tempStore.loadJSON(JSON.parse(creative.templateJson));

      // 3️⃣ Set the store and wait for Workspace to mount
      setCurrentStore(tempStore);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 4️⃣ Ensure the workspace is mounted before exporting
      if (!workspaceRef.current) {
        throw new Error("Workspace is not mounted for export.");
      }

      // 5️⃣ Generate image from the store
      const dataURL = await tempStore.toDataURL({
        mimeType: "image/png",
        pixelRatio: 2,
      });

      // 6️⃣ Convert dataURL to Blob
      const blob = await (await fetch(dataURL)).blob();

      // 7️⃣ Create a link and trigger download
      const fileName = `creative_${Date.now()}.png`;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      // 8️⃣ Clear the temporary store after use
      tempStore.clear();

      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error generating and downloading image:", error);
      toast.error("Failed to generate image.");
    }
  }

  // --------------------------------------------
  // Rendering
  // --------------------------------------------
  return (
    <div className="flex flex-col gap-4 mb-4 overflow-auto hide-scrollbar" style={{ maxHeight: "80vh" }}>
      <section
        ref={sectionRef}
        className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] max-w-6xl lg:ml-8 ml-0 ${
          !isNextSectionOpen ? "p-2 lg:p-3" : "p-0"
        } flex flex-col gap-6 relative z-10 mb-4`}
      >
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
          <span className="flex items-center gap-4">
            <img src="/icon5.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">Generated Creatives</h4>
              <p className="text-[#374151] text-xs lg:text-sm">AI Generated Creatives</p>
            </span>
          </span>
          {/* {isNextSectionOpen ? <MdArrowDropUp size={24} /> : <MdArrowDropDown size={24} />} */}
        </div>

        {/* Loader */}
        {isNextSectionOpen && !renderingComplete && <Loader />}

        {/* Display final results if not loading */}
        {isNextSectionOpen && !loading && (
          <div className="p-4">
            <h4 className="text-[#082A66] font-bold text-lg lg:text-xl mb-3">Generated Creative Results</h4>
            {finalResults.length === 0 && (
              <div className="shadow-md p-2 rounded-lg border border-gray-200 text-gray-600">
                No data yet.
              </div>
            )}

            {finalResults.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <h5 className="text-md font-semibold text-blue-900 mb-2">Cohort: {group.cohortName}</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {group.creatives.map((creative, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col items-center justify-center p-6 bg-white rounded-[20px] shadow-md"
                    >
                      <img
                        src={creative.imageUrl}
                        alt="Rendered Creative"
                        className="w-full h-auto rounded-[12px] mb-2"
                        crossOrigin="anonymous"
                      />

                      {/* Buttons row */}
                      <div className="button-wrapper flex justify-between w-full gap-2 px-2 -ml-8">
                        {/* Bookmark Button */}
                        <button
                          className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                          onClick={
                            !creative.isFavourite
                              ? () => handleBookmark(groupIndex, itemIndex)
                              : undefined
                          }
                          style={{
                            cursor: creative.isFavourite ? "not-allowed" : "pointer",
                          }}
                        >
                          <div className="button-container">
                            {creative.isFavourite ? (
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

                        {/* Edit Button */}
                        <button
                          className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                          onClick={() => handleEdit(creative)}
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
                              <rect x="3" y="16" width="10" height="1.5" fill="#A8A8A8" />
                            </svg>
                            <span className="-ml-1 text-xs">Edit</span>
                          </div>
                        </button>

                        {/* Preview Button */}
                        <button className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear">
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

                        {/* Download Button */}
                        <div>
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

                          <button
                            className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                            onClick={() => handleDownload(creative)}
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
                                <rect x="11.25" y="3" width="1.5" height="11.5" fill="#A8A8A8" />
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
