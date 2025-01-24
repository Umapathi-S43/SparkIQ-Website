import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createStore } from "polotno/model/store";
import { useNavigate } from "react-router-dom";
import {
  PolotnoContainer,
  SidePanelWrap,
  WorkspaceWrap
} from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel, SectionTab } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { observer } from "mobx-react-lite";
import { SiAffinitydesigner } from "react-icons/si";
import axios from "axios";
import toast from "react-hot-toast";
import { MdOutlineLightMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import {
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
  TemplatesSection,
} from "polotno/side-panel";

import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";

import "./PolotnoEditor.css";

// 1) Create the Polotno store
const store = createStore({
  key: "nFA5H9elEytDyPyvKL7T", // Replace with your Polotno API key
  showCredit: true,
});


// 2) Define a custom "Design" section that includes color palettes + templates

const CustomSection = {
  name: "custom",
  Tab: (props) => (
    <SectionTab name="Design" {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SiAffinitydesigner style={{ fontSize: "14px" }} />
      </div>
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    const [templates, setTemplates] = useState([]);
    const [activeTab, setActiveTab] = useState("palettes");
    const [colorPalettes, setColorPalettes] = useState([]);
    const [loadingPalettes, setLoadingPalettes] = useState(false);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    let brandId = localStorage.getItem('brandId');
    let isDarkMode = localStorage.getItem('isDarkMode');

    // 2A) Fetch color palettes dynamically
    // For adding a new palette, we hold 3 color pickers
    const [newPaletteColors, setNewPaletteColors] = useState(["#000000", "#ffffff", "#cccccc"]);

    // 2A) Fetch color palettes dynamically
    const fetchColorPalettes = async () => {
      if (!brandId) {
        console.warn("No brandId provided, skipping palette fetch.");
        return;
      }
      try {
        setLoadingPalettes(true);
        // Example: GET /v2/api/brands/:brandId/colorpalettes
        const response = await axios.get(
          `${baseUrl}/v2/api/brands/${brandId}/colorpalettes`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const raw = response.data?.data || [];
        // Suppose each object is { id, palette: "#FF5733,#33FF57,#3357FF" }
        // Convert them to { id, colors: ["#FF5733", "#33FF57", "#3357FF"] }
        const parsed = raw.map((item) => {
          const colorsArray = item.palette.split(",").map((s) => s.trim());
          return {
            id: item.id,
            colors: colorsArray,
          };
        });
        setColorPalettes(parsed);
      } catch (error) {
        console.error("Error fetching color palettes:", error);
        toast.error("Failed to load color palettes.");
      } finally {
        setLoadingPalettes(false);
      }
    };


    // 2B) Add new palette
    const addNewPalette = async () => {
      if (!brandId) return;
      try {
        const paletteString = newPaletteColors.join(",");
        // POST /v2/api/brands/:brandId/colorpalettes
        await axios.post(
          `${baseUrl}/v2/api/brands/${brandId}/colorpalettes`,
          { palette: paletteString },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        toast.success("New palette added!");
        // refresh the list
        fetchColorPalettes();
      } catch (err) {
        console.error("Error adding palette:", err);
        toast.error("Could not add palette.");
      }
    };

    // 2B) Fetch user templates
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        // Example: GET /v2/user/templates
        const response = await axios.get(`${baseUrl}/v2/user/templates`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        // Suppose response.data?.data is an array of templates
        setTemplates(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load templates.");
      } finally {
        setLoadingTemplates(false);
      }
    };

    useEffect(() => {
      fetchColorPalettes();
      fetchTemplates();
      // eslint-disable-next-line
    }, []);

    // ========== Palette logic ==========
    // Apply palette colors to the elements permanently on click
    // Apply palette colors to the elements permanently on click
    const applyPalette = (palette) => {
      if (palette.colors.length < 3) {
        console.warn("Palette must have at least three colors.");
        return;
      }

      const [svgColor, backgroundColor, textColor] = palette.colors;

      const activePage = store.activePage; // Get the active page
      if (!activePage) {
        console.warn("No active page found.");
        return;
      }

      // Update the background of the active page
      activePage.set({
        background: backgroundColor,
        width: "auto", // Retain the existing structure
        height: "auto", // Retain the existing structure
        bleed: activePage.bleed || 0, // Preserve existing bleed
      });

      // Update child elements
      activePage.children.forEach((child) => {
        if (child.type === "svg" || child.type === "figure") {
          // Apply the first color to SVG or figure elements
          child.set({
            fill: svgColor,
          })
        } else if (child.type === "text") {
          // Apply the third color to text elements
          child.set({ fill: textColor });
        }
      });

      store.history.save(); // Save the changes
    };

    const applyColorsReplace = (svgElement, colorsReplace) => {
      if (!svgElement || !colorsReplace) return;

      Object.entries(colorsReplace).forEach(([originalColor, newColor]) => {
        if (svgElement.colorsReplace) {
          svgElement.colorsReplace[originalColor] = newColor;
        } else {
          svgElement.set({
            colorsReplace: {
              ...svgElement.colorsReplace,
              [originalColor]: newColor,
            },
          });
        }
      });

      // Trigger a redraw of the element to reflect changes
      svgElement.trigger("change");
    };



    // Apply palette colors to the elements on hover
    const handlePaletteHover = (palette) => {
      if (!palette || palette.colors.length < 3) {
        console.warn("Palette must have at least three colors.");
        return;
      }

      const [svgColor, backgroundColor, textColor] = palette.colors;

      store.pages.forEach((page) => {
        // Update the page's background color
        page.set({
          backgroundColor: backgroundColor,
        });
        const activePage = store.activePage; // Get the active page
        if (!activePage) {
          console.warn("No active page found.");
          return;
        }

        // Update the background of the active page
        activePage.set({
          background: backgroundColor,
          width: "auto", // Retain the existing structure
          height: "auto", // Retain the existing structure
          bleed: activePage.bleed || 0, // Preserve existing bleed
        });

        // Update child elements
        page.children.forEach((child) => {
          if (child.type === "svg" || child.type === "figure") {
            // Apply the first color to SVG or figure elements
            child.set({
              fill: svgColor,
            })
          } else if (child.type === "text") {
            child.set({ fill: textColor });
          }
        });
      });
    };



    // Clear hover effect when the mouse leaves
    const clearHoverEffect = () => {
      store.history.undo();
    };


    // ========== Template logic ==========
    // On template click, load its JSON & set current template ID
    const applyTemplate = (template) => {
      try {
        if (!template.templateJson) {
          toast.error("Template JSON is not available.");
          return;
        }
        const parsedTemplateJson = JSON.parse(template.templateJson);
        console.log("Selected Template Id:", template.templateId);
        console.log("Full Template object:", template);

        store.loadJSON(parsedTemplateJson);
        // Important: set the ID to allow updating
        localStorage.setItem("loadedtemplate", template);
        setCurrentTemplateId(template.templateId);
        console.log("Updated Template Id:", currentTemplateId);
        toast.success("Template applied successfully!");
      } catch (error) {
        console.error("Error applying template:", error);
      }
    };

    return (
      <div style={{ padding: "4px" }}>
        <div style={{ display: "flex", width: "100%", marginBottom: "0" }}>
          <button
            onClick={() => setActiveTab("palettes")}
            style={{
              flex: 1, // Makes the button take up equal width
              padding: "0px 0", // Adjust padding for a tab-like look
              cursor: "pointer",
              backgroundColor: isDarkMode
                ? "#555555" // Unified inactive background for dark mode
                : "#f4f4f4", // Unified inactive background for light mode
              color: isDarkMode
                ? "#fcfcfc" // Consistent text color in dark mode
                : "#333333", // Consistent text color in light mode
              border: "none",
              borderBottom: activeTab === "palettes" ? "2px solid #007BFF" : "none", // Underline for active tab
              textAlign: "center",
              transition: "background-color 0.3s, border-bottom 0.3s", // Smooth transitions
            }}
          >
            Palettes
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            style={{
              flex: 1, // Makes the button take up equal width
              padding: "8px 0",
              cursor: "pointer",
              backgroundColor: isDarkMode
                ? "#555555"
                : "#f4f4f4",
              color: isDarkMode
                ? "#fcfcfc"
                : "#333333",
              border: "none",
              borderBottom: activeTab === "templates" ? "2px solid #007BFF" : "none", // Underline for active tab
              textAlign: "center",
              transition: "background-color 0.3s, border-bottom 0.3s",
            }}
          >
            Templates
          </button>
        </div>



        {/* Palettes tab */}
        {activeTab === "palettes" && (
          <div style={{ width: "100%", marginTop: "14px" }}>
            {/*  A) Add new palette row  */}
            <h3 style={{ marginBottom: "8px" }}>Add a New Palette</h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginBottom: "10px",
                // Ensure all items remain in a row (disable wrapping):
                flexWrap: "nowrap",
              }}
            >
              {newPaletteColors.map((col, index) => (
                <input
                  key={index}
                  type="color"
                  value={col}
                  onChange={(e) => handleNewPaletteColorChange(index, e.target.value)}
                  style={{
                    cursor: "pointer",
                    width: "50px",
                    height: "40px",
                    border: "none",
                    outline: "none",
                    padding: 0,
                  }}
                />
              ))}

              <button
                onClick={addNewPalette}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === "templates" ? "#007BFF" : "#e0e0e0",
                  color: activeTab === "templates" ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Add Palette
              </button>
            </div>


            <hr style={{ margin: "10px 0" }} />

            {/*  B) List of fetched palettes  */}
            <h3>Choose a Palette</h3>
            {loadingPalettes && <p>Loading color palettes...</p>}
            {!loadingPalettes && colorPalettes.length === 0 && (
              <p>No color palettes found.</p>
            )}
            {colorPalettes.map((palette) => (
              <div
                key={palette.id}
                onMouseOver={() => handlePaletteHover(palette)} // Apply palette on hover
                onClick={() => applyPalette(palette)} // Apply palette permanently on click

                style={{
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                  marginBottom: "8px",
                  width: "100%",
                  border: isDarkMode ? "1px solid #444" : "1px solid #fcfcfc",

                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: "30px",
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Templates tab */}
        {activeTab === "templates" && (
          <div>
            <h3>Templates Section</h3>
            {loadingTemplates && <p>Loading templates...</p>}
            {!loadingTemplates && templates.length === 0 && (
              <p>No templates available.</p>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
              }}
            >
              {templates.map((tmpl) => (
                <div
                  key={tmpl.templateId}
                  style={{
                    borderRadius: "5px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => applyTemplate(tmpl)}
                >
                  <img
                    src={tmpl.url}
                    alt={tmpl.name || "template"}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }),
};


// 3) Combine default sections with the custom section
//    We'll create the custom section inside the component so we can pass local state
//    (like currentTemplateId) into it.
const PolotnoEditor = () => {
  // Retrieve route state
  const { state } = useLocation();

  const navigate = useNavigate();
  const template = state?.templateData || {};
  console.log("Incoming template data:", template);
  const brandId = template.brandId;
  localStorage.setItem("brandId", brandId);
  localStorage.setItem("loadedtemplate", template);
  console.log(brandId);

  // If a template is passed, parse the JSON
  const templateData = template?.templateJson
    ? JSON.parse(template.templateJson)
    : template.templateJson;
  const { templateId } = location.state || {};

  useEffect(() => {
    if (!templateId) return;

    setLoading(true);
    // GET /v2/user/templates/{templateId}
    axios
      .get(`${baseUrl}/v2/user/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
      .then((res) => {
        const serverData = res.data?.data;
        if (!serverData?.templateJson) {
          toast.error("No template JSON found for this ID.");
          return;
        }
        const json = JSON.parse(serverData.templateJson);
        store.loadJSON(json);
        setCurrentTemplateId(templateId);
      })
      .catch((err) => {
        console.error("Error fetching template:", err);
        toast.error("Failed to load template data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [templateId]);
  // We'll store the current template ID. If the route state has `templateId`,
  // use that as default. Otherwise null.

  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  // We also note if the user wants dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // 4) Save the template (only update, not "save as new")
  //    We'll do an HTTP PUT or POST to /v2/user/templates/{id}, whichever your backend expects
  // Compress image before upload
  const compressImage = async (
    dataURL,
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.2
  ) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Maintain aspect ratio while resizing
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (maxHeight / width) * height;
            width = maxWidth;
          } else {
            width = (maxWidth / height) * width;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress and convert to Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Image compression failed."));
            }
          },
          "image/png",
          quality // 0.1 ~ 1.0
        );
      };
      img.onerror = (err) => reject(err);
    });
  };

  const saveAsJSON = async (isUpdate = false) => {
    try {
      const dataURL = await store.toDataURL({
        pixelRatio: 1,
        mimeType: "image/png",
      });

      const compressedBlob = await compressImage(dataURL);

      const uploadData = new FormData();
      uploadData.append("file", compressedBlob, "compressed-thumbnail.png");

      // 1. First upload the image to get a URL
      const uploadResponse = await axios.post(
        `${baseUrl}/sparkiq/image/upload?customerId=123`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const thumbnailURL = uploadResponse.data.data.url;

      // 2. Prepare the JSON data
      const json = store.toJSON();
      const template_original = localStorage.getItem("loadedtemplate");
      // `templateId` is only sent if we are updating and we have a current ID
      const payload = {
        templateId:
          isUpdate && currentTemplateId && currentTemplateId !== ''
            ? currentTemplateId
            : "",
        url: thumbnailURL,
        templateOrientation: template_original.templateOrientation || json.width > json.height ? "landscape" : "portrait" || "1:1",
        priority: json.priority || 0,
        templateSize: `${json.width}x${json.height}`,
        brandId: template_original.brandId || brandId || "", // Include brandId
        postType: template_original.postType || json.postType || "standard", //
        customTemplate: template_original.customTemplate || false, //
        mediaType: "image",
        videoDuration: json.videoDuration || "00:00",
        voiceoverEnabled: json.voiceoverEnabled || false,
        templateJson: JSON.stringify(json),
        isFavourite: template_original.isFavourite || false,
      };

      // 3. POST the template
      const apiResponse = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      // if successful, set the ID if it doesn't exist

      if (!isUpdate) {
        if (apiResponse.data?.templateId) {
          setCurrentTemplateId(apiResponse.data?.templateId);
        }
      }

      toast.success(
        isUpdate
          ? "Template updated successfully!"
          : "Template saved successfully!"
      );
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("An error occurred while saving the template.");
    }
  };

  // 5) Optionally load from local JSON
  const loadFromJSON = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const content = await file.text();
          const json = JSON.parse(content);
          store.loadJSON(json, false);
          toast.success("Template loaded from file!");
        }
      };
      input.click();
    } catch (error) {
      console.error("Error loading from JSON:", error);
      toast.error("Error loading template.");
    }
  };

  // 6) On mount, load the template data into Polotno if it exists
  useEffect(() => {
    // Sync localStorage theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }

    // If there's existing JSON, load it
    if (Object.keys(templateData).length > 0) {
      store.loadJSON(templateData);
      // also confirm or set the current template ID
      if (template.templateId) {
        setCurrentTemplateId(template.templateId);
      }
    } else {
      // If no pages, add a default page
      if (store.pages.length === 0) {
        store.addPage();
      }
    }
  }, [template.templateId, templateData]);

  const UploadSectionWithAPI = {
    name: "upload-api",
    Tab: (props) => (
      <SectionTab name="Upload" {...props}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          <FaCloudUploadAlt />
        </div>
      </SectionTab>
    ),
    Panel: observer(({ store }) => {
      // 2) brandId from local storage
      const brandId = localStorage.getItem("brandId");

      // 3) State for brand elements and upload status
      const [brandElements, setBrandElements] = useState([]);
      const [isUploading, setIsUploading] = useState(false);

      // 4) Fetch brand elements from /v2/api/brands/{brandId}/brandelements
      const fetchBrandElements = async () => {
        if (!brandId) {
          console.warn("No brandId found in localStorage. Skipping fetchBrandElements.");
          return;
        }
        try {
          const response = await axios.get(
            `${baseUrl}/v2/api/brands/${brandId}/brandelements`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          setBrandElements(response.data?.data || []);
        } catch (error) {
          console.error("Error fetching brand elements:", error);
          toast.error("Failed to fetch brand elements.");
        }
      };

      // 5) Handle file upload => get URL => post brand element => refetch
      const handleFileUpload = async (file) => {
        if (!file) return;
        if (!brandId) {
          toast.error("No brandId found in localStorage. Cannot upload.");
          return;
        }

        setIsUploading(true);
        try {
          // A) Upload to /sparkiq/image/upload
          const uploadForm = new FormData();
          uploadForm.append("file", file);
          uploadForm.append("customerId", "123"); // or brandId if needed

          const uploadResponse = await axios.post(
            `${baseUrl}/sparkiq/image/upload`,
            uploadForm,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          const imageUrl = uploadResponse.data.data.url;

          // B) Post brand element to /v2/api/brands/{brandId}/brandelements
          await axios.post(
            `${baseUrl}/v2/api/brands/${brandId}/brandelements`,
            { name: "Uploaded Element", url: imageUrl },
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          toast.success("File uploaded & brand element saved!");

          // C) Re-fetch brand elements to update UI
          fetchBrandElements();
        } catch (error) {
          console.error("Upload or brand element creation failed:", error);
          toast.error("File upload failed. Please try again.");
        } finally {
          setIsUploading(false);
        }
      };

      // 6) On mount, fetch existing brand elements
      useEffect(() => {
        fetchBrandElements();
        // eslint-disable-next-line
      }, []);

      return (
        <div style={{ padding: "10px", height: "100%" }}>
          <h3 style={{ marginBottom: "10px" }}>Uploaded Brand Elements</h3>

          {/* Upload Button */}
          <label
            htmlFor="fileUpload"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            <FaCloudUploadAlt style={{ marginRight: "8px" }} />
            Upload Image
          </label>
          <input
            id="fileUpload"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />

          {isUploading && (
            <p style={{ marginTop: "10px", textAlign: "center" }}>Uploading...</p>
          )}

          {/* Brand Elements Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              overflowY: "auto",
              maxHeight: "60vh",
            }}
          >
            {brandElements.map((element, index) => (
              <div
                key={element.id || index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // Add image element into Polotno store
                  store.activePage?.addElement({
                    type: "image",
                    src: element.url,
                  });
                }}
              >
                <img
                  src={element.url}
                  alt={element.name || `Element ${index}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }),
  };

  const sections = [
    CustomSection,
    //TemplatesSection, // or remove if you don't need Polotno's default templates
    TextSection,
    PhotosSection,
    ElementsSection,
    UploadSectionWithAPI,  // your custom Upload with API
    BackgroundSection,
    LayersSection,
    SizeSection,
  ];
  localStorage.setItem('isDarkMode', isDarkMode);

  return (

    <div
      className={isDarkMode ? "bp5-dark" : ""}
      style={{
        height: "100vh",
        backgroundColor: isDarkMode ? "#000000" : "#f4f4f4",
        position: "relative",
      }}
    >
      {/* Top Controls */}
      <div
        style={{
          padding: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Controls: Theme and Save */}
        {/* Controls Container */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            overflow: "hidden", // Prevents any overflow
            boxSizing: "border-box", // Ensures padding is included in width/height
            width: "100%", // Ensures it spans the full width of the parent
          }}
        >
          {/* Save Button at Start */}
          <div style={{ position: "relative" }}>
            <button
              onClick={saveAsJSON}
              style={{
                backgroundColor: "transparent",
                color: isDarkMode ? "white" : "black",
                border: "none",
                padding: "4px 16px",
                cursor: "pointer",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              data-tooltip="Save Template"
            >
              <FaSave size={20} />
            </button>
          </div>

          {/* Theme and Close Buttons at End */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              overflow: "hidden", // Prevents horizontal overflow
            }}
          >
            {/* Theme Toggle Button */}
            <div style={{ position: "relative" }}>
              <button
                onClick={toggleTheme}
                style={{
                  backgroundColor: isDarkMode ? "#555" : "#e0e0e0",
                  color: isDarkMode ? "#fff" : "#000",
                  border: "none",
                  padding: "4px",
                  marginLeft:"4px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                data-tooltip={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <MdOutlineLightMode size={20} /> : <CiDark size={20} />}
              </button>
            </div>

            {/* Close Button */}
            <div style={{ position: "relative" }}>
              <button
                className="close"
                onClick={() => navigate("/savedProductsPage")}
                style={{
                  backgroundColor: "transparent",
                  color: isDarkMode ? "white" : "black",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  lineHeight: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "10%",
                  transition: "background-color 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                onMouseDown={(e) => (e.target.style.transform = "scale(0.9)")}
                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                data-tooltip="Close"
              >
                X
              </button>
            </div>
          </div>
        </div>


      </div>

      {/* Polotno Container */}
      <PolotnoContainer style={{ width: "100vw", height: "90vh" }}>
        <SidePanelWrap>
          <SidePanel store={store} sections={sections} />
        </SidePanelWrap>

        <WorkspaceWrap>
          {/* Show polotno toolbar.  Remove downloadButtonEnabled to hide the Polotno default download button. */}
          <Toolbar store={store} />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default PolotnoEditor;
