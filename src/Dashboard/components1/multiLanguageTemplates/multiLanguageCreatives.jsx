import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Polotno (local rendering)
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { unstable_setAnimationsEnabled } from "polotno/config";

import { unstable_setTextOverflow } from 'polotno/config';
import Loader from "../../../components/advert/CreativesLoader";
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

import "../../../components/advert/Creatives.css";

// Polotno API key (if your plan requires it):
const POLNOTO_API_KEY = "H5HjfuZWdlg9X4gOUB27";

// Enable animations
unstable_setAnimationsEnabled(true);

/**
 * Usage example:
 * navigate("/user/polyglot-creatives", { state: { templateData: {...} } });
 * Where 'templateData' includes 'templateJson', 'brandId', etc.
 */
export default function MultiLanguageCreatives() {
    const location = useLocation();
    const navigate = useNavigate();

    // The object passed from the calling code (e.g. handleGenerate)
    const templateData = location.state?.templateData || {};
    console.log("[MultiLanguageCreatives] Received templateData:", templateData);

    // One Polotno store in a ref, so we don't re-init on each render
    const storeRef = useRef(createStore({ key: POLNOTO_API_KEY }));

    // UI states
    const [loading, setLoading] = useState(false);
    const [finalResults, setFinalResults] = useState([]); // array => { language, creatives: [ { imageUrl, ... }, ... ] }
    const [renderingComplete, setRenderingComplete] = useState(false);

    // Example base placeholders in English
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

    // On mount or if templateData changes
    useEffect(() => {
        if (templateData.templateJson) {
            startCreativeGeneration();
        } else {
            console.log("No templateJson found in templateData; skipping generation.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateData]);

    /**
     * Main flow: calls brand-languages => translations => for each language => polotno => local toDataURL => upload => server
     */
    async function startCreativeGeneration() {
        try {
            setLoading(true);
            setRenderingComplete(false);
            console.log("[MultiLanguageCreatives] Starting generation...");

            // 1) fetch brand-languages => an array of language codes (["te","hi","kn", ...])
            const codes = await fetchBrandLanguageCodes(templateData?.brandId);
            if (!codes.length) {
                toast.error("No brand languages found. Aborting generation.");
                setLoading(false);
                setRenderingComplete(true);
                return;
            }
            console.log("Fetched brand language codes:", codes);

            // 2) call /v2/languages/translate with placeholders
            const translatePayload = {
                content: sampleBaseContent,
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
                console.log(`Generating creative for language='${langCode}'...`);

                // apply placeholders
                const updatedJson = applyTemplate(rawTemplateJson, textMap);
                if (!updatedJson) continue; // skip if error

                // localPolotnoRender => single creative
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

    /**
     * 1) brand-languages => array of codes
     */
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
            const dataArray = resp.data?.data || [];
            // each => { id: "...", languages: { code: "te", ... } }
            return dataArray.map((item) => item.languages?.code).filter(Boolean);
        } catch (err) {
            console.error("fetchBrandLanguageCodes error:", err);
            return [];
        }
    }

    /**
     * 2) /v2/languages/translate => gets multi-language placeholders
     */
    async function translateLanguages(payload) {
        try {
            const url = `${baseUrl}/v2/languages/translate`;
            const resp = await axios.post(url, payload, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            return resp.data?.data; // => e.g. { te: {...}, hi: {...}, kn: {...}, ... }
        } catch (err) {
            console.error("translateLanguages error:", err);
            return null;
        }
    }

    /**
     * 3) apply placeholders (text or image) in Polotno JSON
     */
    function applyTemplate(templateJson, placeholders) {
        try {
            let parsed = typeof templateJson === "string"
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
                        const newValue = placeholders[varName];
                        if (typeof newValue === "string") {
                            elem.text = newValue;
                        }
                    } else if (
                        elem.type === "image" &&
                        elem.custom?.edit === true &&
                        elem.custom?.variable
                    ) {
                        const varName = elem.custom.variable.replace(/[{}]/g, "");
                        const newSrc = placeholders[varName];
                        // only apply if it's an http link
                        if (typeof newSrc === "string" && newSrc.startsWith("http")) {
                            elem.src = newSrc;
                        }
                    }
                });
            });

            return parsed;
        } catch (err) {
            console.error("Error in applyTemplate:", err);
            toast.error("Failed to apply placeholders.");
            return null;
        }
    }

    /**
     * 4) localPolotnoRender => storeRef => toDataURL => S3 => create
     *    Then we CLEAR the store so each language is independent
     */
    async function localPolotnoRender(finalJson, originalTemplateData) {
        try {
            // Load the Polotno JSON
            const store = storeRef.current;
            unstable_setTextOverflow('resize');
            unstable_setTextOverflow('change-font-size');

            store.loadJSON(finalJson);

            // wait 300ms so Polotno can fully render
            await new Promise((r) => setTimeout(r, 300));

            // 1) toDataURL
            console.log("[localPolotnoRender] calling toDataURL...");
            const dataURL = await store.toDataURL({
                pixelRatio: 1,
                mimeType: "image/png",
            });
            console.log("Got dataURL length =>", dataURL?.length);

            // dataURL -> blob
            const imageBlob = await (await fetch(dataURL)).blob();

            // 2) S3 upload
            const s3Url = await uploadImageToS3(imageBlob);
            if (!s3Url) {
                console.log("uploadImageToS3 => null. Skipping this creative.");
                store.clear(); // Clear store to be safe
                return null;
            }
            console.log("Uploaded to S3 =>", s3Url);

            // 3) create on server
            const created = await createTemplateOnServer(s3Url, finalJson, originalTemplateData);
            if (!created) {
                console.log("createTemplateOnServer => null. Possibly error");
                store.clear();
                return null;
            }
            console.log("Template created =>", created);

            // 4) important: CLEAR the store now
            store.clear();

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
                templateOrientation: originalTemplateData.templateOrientation,
                priority: 1,
                templateSize: originalTemplateData?.templateSize,
                brandId: originalTemplateData?.brandId || "",
                version: "1",
                tag: "MultiLang",
                postType: originalTemplateData.postType,
                customTemplate: true,
                mediaType: originalTemplateData.mediaType,
                cohortId: "",
                videoDuration: originalTemplateData.videoDuration,
                voiceoverEnabled: originalTemplateData.voiceoverEnabled,
                templateJson: JSON.stringify(finalJson),
                isFavourite: false,
                productId: "sip-3be59ad9-c", // example
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

    // Handler for "Download" => re-render locally with storeRef
    async function handleDownload(creative) {
        if (!creative?.templateJson) {
            toast.error("No template JSON for local download.");
            return;
        }

        try {
            console.log("[handleDownload] re-rendering local store...");
            const store = storeRef.current;
            store.loadJSON(JSON.parse(creative.templateJson));

            // short wait
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

            toast.success("Downloaded successfully!");
        } catch (error) {
            console.error("Error generating + downloading image:", error);
            toast.error("Failed to download image.");
        }
    }

    // Bookmark icon example
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
            {/* Steps 1–3 */}
            <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl mb-4">
                {/* HEADER */}
                <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-4 pb-0 relative">
                    <span className="flex items-center gap-2 lg:gap-4">
                        <img src="/icon1.svg" alt="" className="w-10 lg:w-12" />
                        <span className="flex flex-col">
                            <h4 className="text-[#082A66] font-bold text-lg lg:text-2xl">
                                Generate an Ad Creatives
                            </h4>
                            <p className="text-[#374151] text-xs lg:text-sm">
                                Generate multi-language conversion-focused ad creatives using our unique AI.
                            </p>
                        </span>
                    </span>
                    <img
                        src="/image1.png"
                        alt=""
                        className="absolute bottom-0 right-24 w-28 lg:w-36 hidden md:block"
                    />
                </div>


                {/* If generating, show loader */}
                <div className="overflow-auto hide-scrollbar" style={{ maxHeight: "59vh" }}>
                    {loading && !renderingComplete && <Loader />}</div>

                {/* If done but no results */}
                {!loading && finalResults.length === 0 && (
                    <div className="shadow-md p-2 rounded-lg border border-gray-200 text-gray-600">
                        No data yet.
                    </div>
                )}

                {/* If we have results => each language => single creative => 3-col layout */}
                {!loading && finalResults.length > 0 && (
                    <div className="overflow-auto  p-4 ml-4" style={{ maxHeight: "59vh" }}>
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
                                            {/* Show image */}
                                            <img
                                                src={creative.imageUrl}
                                                alt="Rendered Creative"
                                                className="w-full h-auto rounded-[12px] mb-2"
                                                crossOrigin="anonymous"
                                            />

                                            <div className="flex justify-between w-full gap-2 px-2">
                                                {/* Bookmark example (not fully implemented) */}
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

                                                {/* Download => local store re-render */}
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

            {/*
        Hidden workspace to ensure Polotno has a real stage
        for the local toDataURL calls. This prevents "Can not find stage" errors.
      */}
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
