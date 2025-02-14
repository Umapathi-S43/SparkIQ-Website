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
  key: "H5HjfuZWdlg9X4gOUB27", // Replace with your Polotno API key
  showCredit: true,
});


// 2) Define a custom "Design" section that includes color palettes + templates

const CustomSection = {
  name: "custom",

  // Tab in the SidePanel
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

  // Panel content
  Panel: observer(({ store }) => {
    // States
    const [colorPalettes, setColorPalettes] = useState([]);
    const [loadingPalettes, setLoadingPalettes] = useState(false);

    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);

    const [activeTab, setActiveTab] = useState("palettes");

    // For adding a new palette, track multiple color pickers
    const [newPaletteColors, setNewPaletteColors] = useState(["#082A66", "#ffffff", "#000000"]);

    // Grab brandId from localStorage (set in PolotnoEditor)
    const brandId = localStorage.getItem("brandId");
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";

    // ----------------------------
    // 1) Fetch color palettes
    // ----------------------------
    const fetchColorPalettes = async () => {
      if (!brandId) {
        console.warn("No brandId in localStorage. Skipping palette fetch.");
        return;
      }
      try {
        setLoadingPalettes(true);
        // GET /v2/api/brands/{brandId}/colorpalettes
        const response = await axios.get(`${baseUrl}/v2/api/brands/${brandId}/colorpalettes`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const raw = response.data?.data || [];
        // Each item looks like { id: '...', palette: '#082A66,#ffffff,#000000', brandId: ... }
        // Transform 'palette' into an array of colors
        const parsed = raw.map((item) => {
          const colorsArray = item.palette.split(",").map((c) => c.trim());
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

    // ----------------------------
    // 2) Add new palette
    // ----------------------------
    const addNewPalette = async () => {
      if (!brandId) {
        toast.error("No brandId found. Cannot add palette.");
        return;
      }
      try {
        // Convert color array to comma-separated
        const paletteString = newPaletteColors.join(",");
        // POST /v2/api/brands/{brandId}/colorpalettes with { palette }
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

    // Helper to update local color-picker state
    const handleNewPaletteColorChange = (index, newColor) => {
      setNewPaletteColors((prev) => {
        const updated = [...prev];
        updated[index] = newColor;
        return updated;
      });
    };

    // ----------------------------
    // 3) Fetch user templates
    // ----------------------------
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        // Example: GET /v2/user/templates
        const response = await axios.get(`${baseUrl}/v2/user/templates`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        // Suppose response.data?.data is an array
        setTemplates(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load templates.");
      } finally {
        setLoadingTemplates(false);
      }
    };

    // ----------------------------
    // 4) Apply or preview a palette
    // ----------------------------
    // Apply palette permanently on click
    const applyPalette = (palette) => {
      if (palette.colors.length < 3) {
        console.warn("Palette must have at least 3 colors.");
        return;
      }
      const [svgColor, bgColor, textColor] = palette.colors;
      const activePage = store.activePage;
      if (!activePage) {
        console.warn("No active page found to apply palette.");
        return;
      }

      // Set page background
      activePage.set({
        background: bgColor,
      });

      // Loop through elements on the page
      activePage.children.forEach((child) => {
        if (child.type === "svg" || child.type === "figure") {
          child.set({
            fill: svgColor,
          });
        } else if (child.type === "text") {
          child.set({
            fill: textColor,
          });
        }
      });

      store.history.save(); // commit changes
      toast.success("Palette applied!");
    };

    // Optionally, if you want a "hover" preview effect:
    const handlePaletteHover = (palette) => {
      if (!palette?.colors?.length) return;
      // Save current state, apply palette, revert on mouse leave
      store.history.save();
      applyPalette(palette);
    };
    const clearHoverEffect = () => {
      store.history.undo();
    };

    // ----------------------------
    // 5) Apply a template
    // ----------------------------
    const applyTemplate = (template) => {
      if (!template.templateJson) {
        toast.error("Template JSON is not available.");
        return;
      }
      try {
        const parsed = JSON.parse(template.templateJson);
        // Overwrite the entire store with new JSON
        // 1) Clear all pages
        store.deletePages(store.pages.map((p) => p.id));
        store.loadJSON(json, { override: true });

        // Optionally store the loaded templateId
        localStorage.setItem("loadedtemplate", template);
        toast.success("Template applied successfully!");
      } catch (err) {
        console.error("Error applying template:", err);
      }
    };

    // Fetch palettes & templates on mount
    useEffect(() => {
      fetchColorPalettes();
      fetchTemplates();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Render Panel
    return (
      <div style={{ padding: "4px" }}>
        {/* Tabs: Palettes vs Templates */}
        <div style={{ display: "flex", width: "100%", marginBottom: "0" }}>
          <button
            onClick={() => setActiveTab("palettes")}
            style={{
              flex: 1,
              padding: "8px 0",
              cursor: "pointer",
              backgroundColor: isDarkMode ? "#555555" : "#f4f4f4",
              color: isDarkMode ? "#fcfcfc" : "#333333",
              border: "none",
              borderBottom: activeTab === "palettes" ? "2px solid #007BFF" : "none",
              textAlign: "center",
              transition: "background-color 0.3s, border-bottom 0.3s",
            }}
          >
            Palettes
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            style={{
              flex: 1,
              padding: "8px 0",
              cursor: "pointer",
              backgroundColor: isDarkMode ? "#555555" : "#f4f4f4",
              color: isDarkMode ? "#fcfcfc" : "#333333",
              border: "none",
              borderBottom: activeTab === "templates" ? "2px solid #007BFF" : "none",
              textAlign: "center",
              transition: "background-color 0.3s, border-bottom 0.3s",
            }}
          >
            Templates
          </button>
        </div>

        {/* -- Palettes Tab -- */}
        {activeTab === "palettes" && (
          <div style={{ width: "100%", marginTop: "14px" }}>
            <h3 style={{ marginBottom: "8px" }}>Add a New Palette</h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginBottom: "10px",
                flexWrap: "nowrap",
              }}
            >
              {/* 3 color-pickers for a new palette */}
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
                  }}
                />
              ))}

              <button
                onClick={addNewPalette}
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Add Palette
              </button>
            </div>

            <hr style={{ margin: "10px 0" }} />

            <h3>Choose a Palette</h3>
            {loadingPalettes && <p>Loading color palettes...</p>}
            {!loadingPalettes && colorPalettes.length === 0 && (
              <p>No color palettes found.</p>
            )}

            {colorPalettes.map((palette) => (
              <div
                key={palette.id}
                onMouseOver={() => handlePaletteHover(palette)}
                onMouseLeave={() => clearHoverEffect()}
                onClick={() => applyPalette(palette)}
                style={{
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                  marginBottom: "8px",
                  border: isDarkMode ? "1px solid #444" : "1px solid #fcfcfc",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                {palette.colors.map((color, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: "30px",
                      borderRight: idx < 2 ? "1px solid #ccc" : "none",
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* -- Templates Tab -- */}
        {activeTab === "templates" && (
          <div style={{ marginTop: "10px" }}>
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



  // const preloadImage = (url) => {

  //   return new Promise((resolve, reject) => {
  
  //     const img = new Image();
  
  //     img.src = url;
  
  //     img.onload = () => resolve(url);
  
  //     img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
  
  //   });
  
  // };
   
  // // Function to extract all image URLs from JSON
  
  // const extractImageUrls = (json) => {
  
  //   const imageUrls = new Set();
   
  //   const traverse = (obj) => {
  
  //     if (typeof obj === 'object' && obj !== null) {
  
  //       if (obj.type === 'image' && obj.src) {
  
  //         imageUrls.add(obj.src);
  
  //       }
  
  //       Object.values(obj).forEach((value) => traverse(value));
  
  //     }
  
  //   };
   
  //   traverse(json);
  
  //   return Array.from(imageUrls);
  
  // };
   
  // // GET /v2/user/templates/{templateId}
  
  // useEffect(() => {
  
  //   const fetchTemplate = async () => {
  
  //     try {
  
  //       const response = await axios.get(`${baseUrl}/v2/user/templates/${templateId}`, {
  
  //         headers: { Authorization: `Bearer ${jwtToken}` },
  
  //       });
   
  //       const serverData = response.data?.data;
  
  //       if (!serverData?.templateJson) {
  
  //         toast.error('No template JSON found for this ID.');
  
  //         return;
  
  //       }
   
  //       const json = JSON.parse(serverData.templateJson);
   
  //       // Extract image URLs from JSON
  
  //       const imageUrls = extractImageUrls(json);
   
  //       // Preload all images
  
  //       await Promise.all(imageUrls.map((url) => preloadImage(url)));
   
  //       // Clear all pages in the store
  
  //       store.deletePages(store.pages.map((p) => p.id));
   
  //       // Load JSON into the store
  
  //       store.loadJSON(json, { override: true });
   
  //       setCurrentTemplateId(templateId);
  
  //     } catch (err) {
  
  //       console.error('Error fetching template:', err);
  
  //       //toast.error('Failed to load template data.');
  
  //     } finally {
  
  //       setLoading(false);
  
  //     }
  
  //   };
   
  //   fetchTemplate();
  
  // }, [templateId]);
   

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
        // Overwrite the entire store with new JSON
        // 1) Clear all pages
        store.deletePages(store.pages.map((p) => p.id));

        store.loadJSON(json, { override: true });

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
          // 1) Clear all pages
          store.deletePages(store.pages.map((p) => p.id));
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
      // 1) Clear all pages
      store.deletePages(store.pages.map((p) => p.id));
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
    //CustomSection,
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
            
          </div>

          {/* Theme and Close Buttons at End */}
          <div
            style={{
              display: "flex",
              gap: "4px",
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
                  marginLeft: "4px",
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
            {/* Close Button */}
            <div style={{ position: "relative" }}>
              <button
                className="close"
                onClick={() => {
                  // Clear the store so there are no leftover pages/shapes

                  store.loadJSON({ pages: [] }); // Clear
                  // Then navigate
                  navigate("/savedProductsPage");
                }}
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
