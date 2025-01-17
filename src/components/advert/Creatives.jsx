import { useEffect, useRef, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import "./Creatives.css";
const POLNOTO_API_KEY = "nFA5H9elEytDyPyvKL7T";

export default function Creatives({
  isNextSectionOpen,
  toggleNextSectionAccordion,
  handleNextSection,
  setIsCompleted,
  isCompleted,
}) {
  const sectionRef = useRef(null);
  const workspaceRef = useRef(null); // Reference for Workspace component
  const [templates, setTemplates] = useState([]); // Templates list
  const [loading, setLoading] = useState(true); // Loading state
  const [currentStore, setCurrentStore] = useState(null); // Polotno store for current template
  const [currentTemplate, setCurrentTemplate] = useState(null); // Current template being processed

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
      console.error("Error applying template:", err);
      toast.error("Failed to apply template. Please try again.");
      return null;
    }
  };

  const generateImage = async (store) => {
    try {
      const base64Image = await store.toDataURL({
        pageId: store.pages[0].id,
        mimeType: "image/png",
        quality: 1,
      });

      if (base64Image) {
        const blob = await fetch(base64Image).then((res) => res.blob());
        const localURL = URL.createObjectURL(blob);
        return localURL;
      } else {
        toast.error("Failed to generate image.");
        return null;
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Error generating image.");
      return null;
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    const templateIds = [
      "sit-4aba8a63-a",
      "sit-8689fc63-2",
      "sit-1c42dbbc-8",
      "sit-e67a0d24-0",
    ];

    const templatesData = [];
    try {
      for (const id of templateIds) {
        const response = await axios.get(`${baseUrl}/v2/template/${id}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        const { data } = response.data;
        const updatedTemplateData = applyTemplate(data.templateJson);

        if (updatedTemplateData) {
          const store = createStore({ key: POLNOTO_API_KEY });
          setCurrentStore(store);
          setCurrentTemplate(updatedTemplateData);

          // Wait for the image to be generated
          const renderedImage = await new Promise((resolve) => {
            const checkStoreReady = setInterval(async () => {
              if (workspaceRef.current) {
                clearInterval(checkStoreReady);
                store.loadJSON(updatedTemplateData);
                const image = await generateImage(store);
                resolve(image);
              }
            }, 100);
          });

          templatesData.push({
            id: data.templateId,
            renderedImage,
          });

          store.clear(); // Clean up store
          setCurrentStore(null);
        }
      }

      setTemplates(templatesData);
      toast.success("Templates generated successfully!");
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to fetch templates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNextSectionOpen) {
      fetchTemplates();
    }
  }, [isNextSectionOpen]);

  useEffect(() => {
    if (isNextSectionOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  return (
    <section
      ref={sectionRef}
      className={`border border-white bg-[rgba(252,252,252,0.25)] rounded-[24px] ${
        !isNextSectionOpen ? "p-2 lg:p-3" : "p-0"
      } flex flex-col gap-6 relative z-10 mb-4`}
    >
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
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-[20px] shadow-md"
                >
                  <img
                    src={template.renderedImage}
                    alt={`Template ${template.id}`}
                    className="w-full h-auto rounded-[12px] mb-2"
                  />
                  <div className="button-wrapper gap-2">
                <button className="text-sm text-[#A8A8A8]">
                  <div className="button-container">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        stroke="#A8A8A8"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    <span>Save</span>
                  </div>
                </button>
                <button
                  className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                  onClick={() => handleEditClick(product.imageURL || product.generatedImage, modelName, product.index)} // Call handleEditClick here
                >
                  <div className="button-container">
                    <svg
                      className="edit-svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="edit-icon-path"
                        d="M11.6564 3.65685C11.8469 3.46632 12.1531 3.46632 12.3436 3.65685L14.3436 5.65685C14.5342 5.84737 14.5342 6.15353 14.3436 6.34406L6.37492 14.3127C6.28097 14.4067 6.15792 14.4645 6.02724 14.4746L3.02724 14.7246C2.88342 14.7365 2.74001 14.6882 2.63433 14.584C2.52865 14.4797 2.47272 14.3361 2.48451 14.1923L2.73451 11.1923C2.74455 11.0616 2.80233 10.9385 2.89635 10.8446L10.865 2.87592L11.6564 3.65685Z"
                        stroke="#A8A8A8"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <rect
                        className="edit-icon-rect"
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
                <button
                  className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
                  onClick={() => handlePreviewClick(product.imageURL || product.generatedImage, modelName, product.index)}

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
                  <button
                  className="text-sm text-[#A8A8A8] rounded-lg py-1 px-2 button-clear"
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
                        className="arrow-rect"
                        x="11.25"
                        y="3"
                        width="1.5"
                        height="11.5"
                        fill="#A8A8A8"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12L12 16.5L7.5 12"
                        fill="none"
                        stroke="#A8A8A8"
                      />
                    </svg>

                    <span> <a
                    href={template.renderedImage}
                    download={`template-${template.id}.png`}
                    className="text-blue-500 hover:text-blue-700"
                  > Download
                  </a></span>
                  </div>
                </button>
</div>
                 
                   
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hidden Workspace */}
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
