import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createStore } from "polotno/model/store";
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
const createCustomSection = (currentTemplateId, setCurrentTemplateId) => {
  return {
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
      const [activeTab, setActiveTab] = useState("palettes");
      const [colorPalettes, setColorPalettes] = useState([]);
      const [templates, setTemplates] = useState([]);
      const [loadingPalettes, setLoadingPalettes] = useState(false);
      const [loadingTemplates, setLoadingTemplates] = useState(false);

      // 2A) Fetch color palettes dynamically
      const fetchColorPalettes = async () => {
        try {
          setLoadingPalettes(true);
          // Example: GET /v2/user/colorpalettes
          // Response shape assumed: { data: [ { id, palette }, { ... } ] }
          const response = await axios.get(`${baseUrl}/v2/user/${brandId}/colorpalettes`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          const raw = response.data?.data || [];
          // Suppose each object is { id: string, palette: "#FF5733,#33FF57,#3357FF" }
          // Convert them to { id, colors: [ '#FF5733', '#33FF57', '#3357FF' ] }
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
      const applyPalette = (palette) => {
        if (!palette || palette.colors.length < 3) {
          return;
        }

        const [svgColor, backgroundColor, textColor] = palette.colors;
        const activePage = store.activePage;
        if (!activePage) return;

        // Update page background
        activePage.set({
          background: backgroundColor,
        });

        // Update child elements
        activePage.children.forEach((child) => {
          if (child.type === "svg" || child.type === "figure") {
            child.set({ fill: svgColor });
          } else if (child.type === "text") {
            child.set({ fill: textColor });
          }
        });

        store.history.save(); // Save changes
      };

      const handlePaletteHover = (palette) => {
        applyPalette(palette); // temporarily apply
      };
      const clearHoverEffect = () => {
        store.history.undo(); // revert
      };

      // ========== Template logic ==========
      // On template click, load its JSON & set current template ID
      const applyTemplate = (tmpl) => {
        try {
          if (!tmpl.templateJson) {
            toast.error("Template JSON not available.");
            return;
          }
          const parsedJson = tmpl.templateJson;
          store.loadJSON(parsedJson);
          // store the ID so we can "update" it on Save
          setCurrentTemplateId(tmpl.templateId);
          toast.success("Template applied!");
        } catch (err) {
          console.error("Error applying template:", err);
          toast.error("Failed to apply template.");
        }
      };

      return (
        <div style={{ padding: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            <button
              onClick={() => setActiveTab("palettes")}
              style={{
                padding: "8px 16px",
                marginRight: "8px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "palettes" ? "#007BFF" : "#e0e0e0",
                color: activeTab === "palettes" ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Palettes
            </button>
            <button
              onClick={() => setActiveTab("templates")}
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
              Templates
            </button>
          </div>

          {/* Palettes tab */}
          {activeTab === "palettes" && (
            <div>
              <h3>Choose a Palette</h3>
              {loadingPalettes && <p>Loading color palettes...</p>}
              {!loadingPalettes && colorPalettes.length === 0 && (
                <p>No color palettes found.</p>
              )}
              {colorPalettes.map((palette) => (
                <div
                  key={palette.id}
                  onMouseOver={() => handlePaletteHover(palette)}
                  onMouseOut={clearHoverEffect}
                  onClick={() => applyPalette(palette)}
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    marginBottom: "8px",
                  }}
                >
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: "70px",
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
};

// 3) Combine default sections with the custom section
//    We'll create the custom section inside the component so we can pass local state
//    (like currentTemplateId) into it.
const PolotnoEditor = () => {
  // Retrieve route state
  const { state } = useLocation();
  const template = state?.templateData || {};
  console.log("Incoming template data:", template);
  const brandId = template.brandId;
  console.log(brandId);

  // If a template is passed, parse the JSON
  const templateData = template?.templateJson
    ? JSON.parse(template.templateJson)
    : template.templateJson;

  // We'll store the current template ID. If the route state has `templateId`,
  // use that as default. Otherwise null.
  const [currentTemplateId, setCurrentTemplateId] = useState(
    template.templateId || null
  );

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
  const saveAsJSON = async () => {
    if (!currentTemplateId) {
      toast.error("No template ID selected to update.");
      return;
    }
    try {
      // 4a) Generate a thumbnail
      const dataURL = await store.toDataURL({
        pixelRatio: 1,
        mimeType: "image/png",
      });
      const blob = await fetch(dataURL).then((r) => r.blob());

      // 4b) Upload the thumbnail to your image server
      const formData = new FormData();
      formData.append("file", blob, "thumbnail.png");

      const uploadRes = await axios.post(
        `${baseUrl}/sparkiq/image/upload?customerId=123`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const thumbnailURL = uploadRes.data?.data?.url;

      // 4c) Gather Polotno JSON
      const polotnoJson = store.toJSON();

      // 4d) Update template on backend (PUT or POST, whichever your backend expects)
      //     Example: PUT /v2/user/templates/:templateId
      const payload = {
        // your backend might require these fields
        templateId: currentTemplateId,
        url: thumbnailURL, // updated thumbnail
        templateJson: JSON.stringify(polotnoJson),
      };
      const updateRes = await axios.put(
        `${baseUrl}/v2/user/templates/${currentTemplateId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      toast.success("Template updated successfully!");
      console.log("Update response:", updateRes.data);
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template.");
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

  // 7) Build sections with our custom section
  const customSection = createCustomSection(
    currentTemplateId,
    setCurrentTemplateId
  );
  const sections = [
    customSection,
    TemplatesSection, // or remove if you don't need Polotno's default templates
    TextSection,
    PhotosSection,
    ElementsSection,
    UploadSection,
    BackgroundSection,
    LayersSection,
    SizeSection,
  ];

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
          padding: "6px",
          textAlign: "center",
          color: isDarkMode ? "white" : "black",
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: isDarkMode ? "#555" : "#e0e0e0",
            color: isDarkMode ? "#fff" : "#000",
            border: "none",
            padding: "4px 16px",
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Switch to {isDarkMode ? "Light" : "Dark"} Mode
        </button>
        <button
          onClick={saveAsJSON}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "4px 16px",
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Update Template
        </button>
        <button
          onClick={loadFromJSON}
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            padding: "4px 16px",
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Load Template from JSON
        </button>

        {/* Close Button */}
        <button
          className="close"
          onClick={() => window.history.back()}
          style={{
            position: "absolute",
            top: "-2px",
            right: "1px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "6px",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "40px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s, transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.9)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          X
        </button>
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
