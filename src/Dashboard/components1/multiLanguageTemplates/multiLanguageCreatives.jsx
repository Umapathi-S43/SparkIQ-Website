import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Polotno (local rendering)
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { unstable_setAnimationsEnabled, unstable_setTextOverflow } from "polotno/config";

import Loader from "../../../components/advert/CreativesLoader";
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

import "../../../components/advert/Creatives.css";

// Polotno API key (if required by your plan):
const POLNOTO_API_KEY = "H5HjfuZWdlg9X4gOUB27";

// Enable Polotno animations
unstable_setAnimationsEnabled(true);

/**
 * Usage:
 *   navigate("/user/polyglot-creatives", { state: { templateData: {...} } });
 * Where 'templateData' includes:
 *   {
 *     templateJson: "...",
 *     brandId: "...",
 *     // etc.
 *   }
 */
export default function MultiLanguageCreatives() {
  const location = useLocation();
  const navigate = useNavigate();

  // The object passed from the calling code
  const templateData = location.state?.templateData || {};
  console.log("[MultiLanguageCreatives] Received templateData:", templateData);

  // A single Polotno store in a ref
  const storeRef = useRef(createStore({ key: POLNOTO_API_KEY }));

  // States
  const [loading, setLoading] = useState(false);
  const [finalResults, setFinalResults] = useState([]); // e.g. [ { language, creatives: [ { imageUrl,...}, ... ] }, ... ]
  const [renderingComplete, setRenderingComplete] = useState(false);

  // Example placeholders if we want to do translations (English base):
  const sampleBaseContent = {
    title: "Super Sale",
    description: "Get the best deals on electronics.",
    cta: "Shop Now",
    feature1: "Fast Delivery",
    feature2: "100% Genuine Products",
    feature3: "Secure Payments",
    feature4: "Easy Returns",
    mrp: "100 rupees",
    discount: "20% discount",
  };

  // On mount or changes to templateData => try generating
  useEffect(() => {
    if (templateData.templateJson) {
      startCreativeGeneration();
    } else {
      console.log("No templateJson found in templateData; skipping generation.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  // ------------------------------------------------------------
  // 0) Extract placeholders from templateJson
  // ------------------------------------------------------------
  /**
   * Go through each page -> child in Polotno’s JSON,
   * find text nodes with custom.edit===true and custom.variable,
   * e.g. { "custom": { "variable": "{title}" }, "text": "some text" }
   * Return an object: { title: "some text", cta: "Shop now!", ... }
   */
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
            // e.g. elem.custom.variable = "{title}"
            const varName = elem.custom.variable.replace(/[{}]/g, "");
            placeholders[varName] = elem.text || ""; // store original text
          }
        });
      });
    } catch (err) {
      console.error("extractPlaceholdersFromTemplateJson error:", err);
    }
    return placeholders;
  }

  // ------------------------------------------------------------
  // 1) Main Flow
  // ------------------------------------------------------------
  async function startCreativeGeneration() {
    try {
      setLoading(true);
      setRenderingComplete(false);
      console.log("[MultiLanguageCreatives] Starting generation...");

      // Optionally: we can see which placeholders the template has initially
      // just to show how to parse them from the JSON:
      const foundPlaceholders = extractPlaceholdersFromTemplateJson(templateData.templateJson);
      console.log("Template's original placeholders =>", foundPlaceholders);

      // 1) fetch brand-languages => array of codes
      const codes = await fetchBrandLanguageCodes(templateData?.brandId);
      if (!codes.length) {
        toast.error("No brand languages found. Aborting generation.");
        setLoading(false);
        setRenderingComplete(true);
        return;
      }
      console.log("Fetched brand language codes:", codes);

      // 2) call /v2/languages/translate
      const translatePayload = {
        content: sampleBaseContent, // your base placeholders
        languages: codes,
      };
      const translations = await translateLanguages(translatePayload);
      if (!translations) {
        toast.error("No translations returned. Aborting.");
        setLoading(false);
        setRenderingComplete(true);
        return;
      }
      console.log("Received translations:", translations);

      // 3) For each language => produce exactly 1 creative
      const multiLangResults = [];
      const rawTemplateJson = templateData.templateJson;
      if (!rawTemplateJson) {
        toast.error("No templateJson in templateData. Nothing to render.");
        setLoading(false);
        setRenderingComplete(true);
        return;
      }

      for (const [langCode, textMap] of Object.entries(translations)) {
        console.log(`Generating creative for language='${langCode}' with placeholders =>`, textMap);

        // apply placeholders to polotno JSON
        const updatedJson = applyTemplate(rawTemplateJson, textMap);
        if (!updatedJson) continue;

        // local render => S3 => create
        const renderedCreative = await localPolotnoRender(updatedJson, templateData);
        if (renderedCreative) {
          multiLangResults.push({
            language: langCode,
            creatives: [renderedCreative],
          });
        }
      }

      console.log("[MultiLanguageCreatives] final results =>", multiLangResults);
      setFinalResults(multiLangResults);
    } catch (err) {
      console.error("Error in startCreativeGeneration:", err);
      toast.error("Something went wrong generating multi-language creatives.");
    } finally {
      setLoading(false);
      setRenderingComplete(true);
    }
  }

  // ------------------------------------------------------------
  // 2) fetch brand-languages => array of codes
  // ------------------------------------------------------------
  async function fetchBrandLanguageCodes(brandId) {
    if (!brandId) {
      console.log("No brandId provided, returning empty array.");
      return [];
    }
    try {
      const url = `${baseUrl}/api/brand/languages`;
      const resp = await axios.get(url, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const dataArr = resp.data?.data || [];
      // each => { id: "...", languages: { code: "te" } }
      return dataArr.map((item) => item.languages?.code).filter(Boolean);
    } catch (err) {
      console.error("fetchBrandLanguageCodes error:", err);
      return [];
    }
  }

  // ------------------------------------------------------------
  // 3) /v2/languages/translate => placeholders
  // ------------------------------------------------------------
  async function translateLanguages(payload) {
    try {
      const url = `${baseUrl}/v2/languages/translate`;
      const resp = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return resp.data?.data; // => e.g. { te: {...}, hi: {...} }
    } catch (err) {
      console.error("translateLanguages error:", err);
      return null;
    }
  }

  // ------------------------------------------------------------
  // 4) apply placeholders to Polotno JSON
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // localPolotnoRender => storeRef => toDataURL => S3 => create
  // ------------------------------------------------------------
  async function localPolotnoRender(finalJson, originalTemplateData) {
    try {
      const store = storeRef.current;

      // set text overflow strategies BEFORE load
      unstable_setTextOverflow("resize");
      unstable_setTextOverflow("change-font-size");

      store.loadJSON(finalJson);

      // short wait for Polotno to finish
      await new Promise((r) => setTimeout(r, 300));

      // local screenshot => toDataURL
      console.log("Calling store.toDataURL for local screenshot...");
      const dataURL = await store.toDataURL({
        pixelRatio: 1,
        mimeType: "image/png",
      });
      console.log("Got dataURL length =>", dataURL.length);

      const imageBlob = await (await fetch(dataURL)).blob();
      const s3Url = await uploadImageToS3(imageBlob);
      if (!s3Url) {
        store.clear();
        return null;
      }

      const created = await createTemplateOnServer(s3Url, finalJson, originalTemplateData);
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

  // S3 upload
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

  // create template on server
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
      console.log("[createTemplateOnServer] payload =>", payload);

      const resp = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      return resp.data; // => { data: {...} }
    } catch (err) {
      console.error("createTemplateOnServer error:", err);
      toast.error("Failed to create template on server.");
      return null;
    }
  }

  // Handler for "Edit"
  function handleEdit(creative) {
    navigate("/editor", { state: { templateData: creative } });
  }

  // Handler for "Download"
  async function handleDownload(creative) {
    if (!creative?.templateJson) {
      toast.error("No template JSON available for download.");
      return;
    }
    try {
      console.log("[handleDownload] generating local download from Polotno store...");
      const store = storeRef.current;
      store.loadJSON(JSON.parse(creative.templateJson));

      await new Promise((r) => setTimeout(r, 300)); // wait for polotno

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
      console.error("Error generating and downloading image:", error);
      toast.error("Failed to download image.");
    }
  }

  // Dummy bookmark icon
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

  return (
    <div className="flex-grow lg:mr-8 lg:ml-0 ml-2 mx-auto">
      {/* Steps */}
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl mb-4">
        {/* HEADER */}
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

        {/* Body */}
        <div className="overflow-auto hide-scrollbar" style={{ maxHeight: "59vh" }}>
          {loading && !renderingComplete && <Loader />}
          {!loading && finalResults.length === 0 && (
            <div className="shadow-md p-2 rounded-lg border border-gray-200 text-gray-600">
              No data yet.
            </div>
          )}

          {/* Show results */}
          {!loading && finalResults.length > 0 && (
            <div className="p-4 ml-4">
              {finalResults.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  <h5 className="text-md font-semibold text-blue-900 mb-2">
                    Language: {group.language.toUpperCase()}
                  </h5>
                  {/* 3-col grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {group.creatives.map((creative, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-[20px] shadow-md"
                      >
                        <img
                          src={creative.imageUrl}
                          alt="Rendered Creative"
                          className="w-full h-auto rounded-[12px] mb-2"
                          crossOrigin="anonymous"
                        />
                        <div className="flex justify-between w-full gap-2 px-2">
                          {/* Bookmark (example) */}
                          <button className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear">
                            <BookmarkBeforeIcon />
                            <span className="ml-1 text-xs">Bookmark</span>
                          </button>

                          {/* Edit => /editor */}
                          <button
                            className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear"
                            onClick={() => handleEdit(creative)}
                          >
                            Edit
                          </button>

                          {/* Download => re-render */}
                          <button
                            className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear"
                            onClick={() => handleDownload(creative)}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden Polotno workspace to avoid "Can not find stage" error */}
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

/*
Summary:
1) We added `extractPlaceholdersFromTemplateJson(templateJson)` to parse original text placeholders.
2) "applyTemplate(...)" still replaces them in the Polotno JSON for each language's translation.
*/
