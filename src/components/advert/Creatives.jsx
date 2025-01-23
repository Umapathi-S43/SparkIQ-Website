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

// Polotno API key
const POLNOTO_API_KEY = "nFA5H9elEytDyPyvKL7T";

// Hard-coded brandId
const FIXED_BRAND_ID = "sib-81b85382-b";

// Example placeholder data
const medicineData = {
  title: "Renocare Plus",
  description: "Eliminates toxins and supports kidney function",
  feature_tag_1: "Supports Kidney Function",
  cohort: "Adults",
  price: "$29.99",
  rating: "4.5",
  discount: "20%",
  product_image:
    "https://images.unsplash.com/photo-1562376552-0d160a2f238d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfHNlYXJjaHw0MHx8d2FmZmxlfGVufDB8fHx8MTczNjg1OTk1MHww&ixlib=rb-4.0.3&q=80&w=1080",
  logo:
    "https://images.unsplash.com/photo-1736841131662-ab6fc065124a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fHx8MTczNjkyMjY1OXw&ixlib=rb-4.0.3&q=80&w=1080",
};

export default function Creatives({
  isNextSectionOpen,
  toggleNextSectionAccordion,
  handleNextSection,
  setIsCompleted,
  isCompleted,
  // Optional props
  handlePreviewClick,
  handleDownload,
  product,
  modelName,
}) {
  const sectionRef = useRef(null);
  const workspaceRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStore, setCurrentStore] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  const navigate = useNavigate();

  // 1. Replace placeholders
  const applyTemplate = (templateJson) => {
    try {
      const parsedJson = JSON.parse(templateJson);
      parsedJson.pages.forEach((page) => {
        page.children.forEach((element) => {
          if (element.custom && element.custom.variable) {
            const variableName = element.custom.variable.replace(/[{}]/g, "");
            const newValue = medicineData[variableName];
            if (newValue) {
              if (element.type === "text") {
                element.text = newValue;
              } else if (element.type === "image") {
                element.src = newValue;
              }
            }
          }
        });
      });
      return parsedJson;
    } catch (err) {
      console.error("Error applying template placeholders:", err);
      toast.error("Failed to apply template placeholders.");
      return null;
    }
  };

  // 2. Convert base64 -> Blob
  const dataURLToBlob = async (dataURL) => {
    const blob = await fetch(dataURL).then((res) => res.blob());
    return blob;
  };

  // 3. Upload to S3
  const uploadImageToS3 = async (imageBlob) => {
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
  };

  // 4. Create template on server
  const createTemplateOnServer = async (s3Url, storeJson) => {
    const payload = {
      url: s3Url,
      templateOrientation: "1:1",
      priority: 0,
      templateSize: "1080x1080",
      brandId: FIXED_BRAND_ID,
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
      console.log("Template creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating template on server:", error);
      toast.error("Failed to create template on the server.");
      return null;
    }
  };

  // 5. Generate from Polotno + upload + create
  const generateUploadAndCreateTemplate = async (store, storeJson) => {
    try {
      const base64Image = await store.toDataURL({
        pageId: store.pages[0].id,
        mimeType: "image/png",
        quality: 1,
      });
      if (!base64Image) {
        toast.error("Failed to generate image.");
        return null;
      }
      const imageBlob = await dataURLToBlob(base64Image);
      const s3Url = await uploadImageToS3(imageBlob);
      console.log("S3 URL:", s3Url);

      if (!s3Url) return null;

      const creationResponse = await createTemplateOnServer(s3Url, storeJson);
      return { s3Url, creationResponse };
    } catch (err) {
      console.error("Error generating/uploading/creating template:", err);
      toast.error("Error in full creation flow.");
      return null;
    }
  };

  // handleEdit
  const handleEdit = (templateObj) => {
    console.log("Editing template:", templateObj);
    navigate("/editor", { state: { templateData: templateObj } });
  };

  // handleBookmark
  const handleBookmark = async (index) => {
    try {
      const existing = templates[index];
      if (!existing.templateObj) {
        toast.error("No template object found to bookmark.");
        return;
      }

      const templateId = existing.templateObj.templateId;
      if (!templateId) {
        toast.error("No templateId found. Cannot update as favourite.");
        return;
      }

      // Build payload
      const payload = {
        templateId,
        url: existing.templateObj.url,
        templateOrientation: existing.templateObj.templateOrientation,
        priority: existing.templateObj.priority,
        templateSize: existing.templateObj.templateSize,
        brandId: existing.templateObj.brandId,
        version: existing.templateObj.version,
        tag: existing.templateObj.tag,
        postType: existing.templateObj.postType,
        customTemplate: existing.templateObj.customTemplate,
        mediaType: existing.templateObj.mediaType,
        videoDuration: existing.templateObj.videoDuration,
        voiceoverEnabled: existing.templateObj.voiceoverEnabled,
        templateJson: existing.templateObj.templateJson,
        isFavourite: true,
      };

      // Local update (optimistic)
      const newTemplates = [...templates];
      newTemplates[index].templateObj.isFavourite = true;
      setTemplates(newTemplates);

      // POST to server
      const response = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.data?.data?.isFavourite === true) {
        toast.success("Template bookmarked successfully!");
      } else {
        toast.error("Failed to bookmark template on server.");
      }
    } catch (error) {
      console.error("Error bookmarking template:", error);
      toast.error("Could not bookmark template.");
    }
  };

  // 8. Fetch templates
  const fetchTemplates = async () => {
    setLoading(true);

    const templateIds = [
      "sit-4aba8a63-a",
      "sit-8689fc63-2",
      "sit-1c42dbbc-8",
      "sit-e67a0d24-0",
    ];

    const newTemplates = [];

    try {
      for (const id of templateIds) {
        const response = await axios.get(`${baseUrl}/v2/template/${id}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        const { data } = response.data;
        const updatedTemplateData = applyTemplate(data.templateJson);
        if (!updatedTemplateData) continue;

        const store = createStore({ key: POLNOTO_API_KEY });
        setCurrentStore(store);
        setCurrentTemplate(updatedTemplateData);

        const result = await new Promise((resolve) => {
          const checkStoreInterval = setInterval(async () => {
            if (workspaceRef.current) {
              clearInterval(checkStoreInterval);
              store.loadJSON(updatedTemplateData);

              const flowResult = await generateUploadAndCreateTemplate(
                store,
                updatedTemplateData
              );
              resolve(flowResult);
            }
          }, 100);
        });

        if (!result || !result.s3Url || !result.creationResponse) {
          store.clear();
          setCurrentStore(null);
          continue;
        }

        const createdData = result.creationResponse.data;
        const createdTemplateId = createdData.templateId || "";
        const createdIsFav = createdData.isFavourite || false;

        newTemplates.push({
          renderedImage: result.s3Url,
          templateObj: {
            templateId: createdTemplateId,
            url: createdData.url || result.s3Url,
            templateOrientation: createdData.templateOrientation || "1:1",
            priority: createdData.priority || 0,
            templateSize: createdData.templateSize || "1080x1080",
            brandId: createdData.brandId || FIXED_BRAND_ID,
            version: createdData.version || "",
            tag: createdData.tag || "",
            postType: createdData.postType || "standard",
            customTemplate: createdData.customTemplate || false,
            mediaType: createdData.mediaType || "image",
            videoDuration: createdData.videoDuration || "00:00",
            voiceoverEnabled:
              createdData.voiceoverEnabled === undefined
                ? true
                : createdData.voiceoverEnabled,
            templateJson:
              createdData.templateJson || JSON.stringify(updatedTemplateData),
            isFavourite: createdIsFav,
          },
        });

        store.clear();
        setCurrentStore(null);
      }

      setTemplates(newTemplates);
      toast.success("Templates generated, uploaded, and created successfully!");
    } catch (error) {
      console.error("Error fetching or creating templates:", error);
      toast.error("Failed to fetch and create templates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 9. Trigger fetch if open
  useEffect(() => {
    if (isNextSectionOpen) {
      fetchTemplates();
    }
  }, [isNextSectionOpen]);

  // 10. Scroll into view if open
  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  // "Before" icon
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

  // "After" icon
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

  return (
    <section
      ref={sectionRef}
      className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] ${
        !isNextSectionOpen ? "p-2 lg:p-3" : "p-0"
      } flex flex-col gap-6 relative z-10 mb-4`}
    >
      {/* Global hidden SVG with gradient definition (for your .button-clear:hover rules) */}
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
            Completed <MdArrowDropUp size={20} />
          </span>
        )}
        <span className="flex items-center gap-4">
          <img src="/icon4.svg" alt="Icon" />
          <span className="flex flex-col">
            <h4 className="text-[#082A66] font-bold text-lg lg:text-xl">
              Generated Creatives
            </h4>
            <p className="text-[#374151] text-xs lg:text-sm">
              AI Generated Creatives
            </p>
          </span>
        </span>
        <div className="flex items-center gap-2">
          {isNextSectionOpen ? (
            <MdArrowDropUp size={32} className="cursor-pointer" />
          ) : (
            <MdArrowDropDown size={32} className="cursor-pointer" />
          )}
        </div>
      </div>

      {/* Accordion Body */}
      {isNextSectionOpen && (
        <div className="p-4">
          {loading ? (
            // Loading placeholders
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="button-wrapper flex justify-between w-full gap-2 px-2">
                      {/* Bookmark Button */}
                      <button
                        className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                        // only attach onClick if not bookmarked
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
                              <span className="ml-1">Bookmarked</span>
                            </>
                          ) : (
                            <>
                              <BookmarkBeforeIcon />
                              <span className="ml-1">Bookmark</span>
                            </>
                          )}
                        </div>
                      </button>

                      {/* Edit Button */}
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
                          <span className="-ml-1">Edit</span>
                        </div>
                      </button>

                      {/* Preview Button */}
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
                          <span>Preview</span>
                        </div>
                      </button>

                      {/* Download Button */}
                      <button
                        className="text-sm text-[#A8A8A8] rounded-md py-1 px-2 button-clear flex items-center gap-1"
                        onClick={() =>
                          handleDownload?.(product?.url || product?.generatedImage)
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
                          <span>
                            <a href={renderedImage} download={`creative_${idx}.png`}>
                              Download
                            </a>
                          </span>
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

      {/* Hidden Polotno workspace for offscreen rendering */}
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
  );
}
