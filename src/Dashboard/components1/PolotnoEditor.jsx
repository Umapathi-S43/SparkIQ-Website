import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createStore } from "polotno/model/store";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { Workspace } from "polotno/canvas/workspace";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { DownloadButton } from "polotno/toolbar/download-button";
import { Button,Tooltip, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";
import { FaCloudUploadAlt, FaSave } from "react-icons/fa";
import { MdOutlineLightMode } from "react-icons/md";
import { CiDark } from "react-icons/ci";
import { SidePanel, SectionTab } from "polotno/side-panel";
import axios from "axios";
import toast from "react-hot-toast";
// Constants

import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import {
  TextSection,
  PhotosSection,
  ElementsSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
} from "polotno/side-panel";

// ✅ Create Polotno store
const store = createStore({
  key: "H5HjfuZWdlg9X4gOUB27",
  showCredit: false, // Hide Polotno Studio credit
});

// ✅ Sanitize JSON function
const sanitizeJSON = (json) => {
  if (!json || !json.pages) return { pages: [] };
  return {
    ...json,
    pages: json.pages
      .filter((page) => page.children && page.children.length > 0)
      .map((page) => ({
        ...page,
        children: page.children.filter((child) => child.id),
      })),
  };
};

// ✅ Custom 'Upload' Section
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
    const [brandId] = useState(() => localStorage.getItem("brandId") || "");
    const [brandElements, setBrandElements] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const fetchBrandElements = async () => {
      if (!brandId) {
        console.warn("No brandId found. Skipping fetchBrandElements.");
        return;
      }
      try {
        const response = await axios.get(`${baseUrl}/v2/api/brands/${brandId}/brandelements`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setBrandElements(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching brand elements:", error);
        toast.error("Failed to fetch brand elements.");
      }
    };

    const handleFileUpload = async (file) => {
      if (!file) return;
      if (!brandId) {
        toast.error("No brandId found. Cannot upload.");
        return;
      }
      setIsUploading(true);
      try {
        // 1) Upload to /sparkiq/image/upload
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("customerId", "123");
        const uploadResponse = await axios.post(`${baseUrl}/sparkiq/image/upload`, uploadForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const imageUrl = uploadResponse.data.data.url;

        // 2) Create brand element
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
        // 3) Update brandElements list
        fetchBrandElements();
      } catch (error) {
        console.error("Upload or brand element creation failed:", error);
        toast.error("File upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };

    useEffect(() => {
      fetchBrandElements();
    }, [brandId]);

    return (
      <div style={{ padding: "10px", height: "100%" }}>
        <h3 style={{ marginBottom: "10px" }}>Uploaded Brand Elements</h3>
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
        {isUploading && <p style={{ marginTop: "10px", textAlign: "center" }}>Uploading...</p>}
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

// -----------------------------------------------------
// THEME + SAVE LOGIC ADDED BELOW
// -----------------------------------------------------
const CustomToolbarActions = ({
  store,
  navigate,
  isDarkMode,
  toggleTheme,
  saveAsJSON,
}) => {
  // 1) Export JSON
  const exportJSON = () => {
    const json = store.toJSON();
    const sanitizedJson = sanitizeJSON(json);
    const jsonString = JSON.stringify(sanitizedJson, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "design.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 2) Close Editor
  const handleClose = () => {
    store.clear();
    navigate("/savedProductsPage");
  };

  return (
    <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
      {/* <DownloadButton store={store} />
      <Button minimal intent="primary" onClick={exportJSON}>
        Export JSON
      </Button> */}

      {/* Dark/Light Mode Toggle */}
      <Tooltip
        content={isDarkMode ? "Light Mode" : "Dark Mode"}
        position={Position.BOTTOM}
      >
        <Button minimal onClick={toggleTheme}>
          {isDarkMode ? (
            <MdOutlineLightMode size={18} />
          ) : (
            <CiDark size={18} />
          )}
        </Button>
      </Tooltip>

      {/* Save Template */}
      <Tooltip content="Save" position={Position.BOTTOM}>
        <Button
          minimal
          onClick={() => saveAsJSON(false)}
          style={{ display: "flex", alignItems: "center" }}
        >
          <FaSave size={18} />
        </Button>
      </Tooltip>

      {/* Close Editor */}
      <Tooltip content="Close" position={Position.BOTTOM}>
        <Button
          minimal
          onClick={handleClose}
          style={{ display: "flex", alignItems: "center" }}
        >
          ✕
        </Button>
      </Tooltip>
    </div>
  );
};

const sections = [
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSectionWithAPI,
  BackgroundSection,
  SizeSection,
  LayersSection,
];

const PolotnoEditor = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [reloadKey, setReloadKey] = useState(0);
  const [editorLoaded, setEditorLoaded] = useState(false);

  // THEME
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // For saving logic
  const [currentTemplateId, setCurrentTemplateId] = useState(null);

  // brandId is set from route state or localStorage
  const template = state?.templateData;
  const templateJson = template?.templateJson;
  localStorage.setItem("brandId", template?.brandId);

  // Clears Polotno-related data
  const clearPolotnoCache = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("polotno-")) localStorage.removeItem(key);
    });

    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("polotno-")) sessionStorage.removeItem(key);
    });

    store.clear();
    setReloadKey((prev) => prev + 1);
    setTimeout(() => setEditorLoaded(true), 100);
  };

  // Hard Refresh detection
  useEffect(() => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");

    const handleKeyDown = (event) => {
      const isHardRefresh = isMac
        ? event.metaKey && event.shiftKey && event.key.toLowerCase() === "r"
        : event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "r";
      if (isHardRefresh) {
        event.preventDefault();
        clearPolotnoCache();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Reload on mount
  useEffect(() => {
    setEditorLoaded(false);
    clearPolotnoCache();
  }, []);

  // On editorLoaded, load template
  useEffect(() => {
    if (editorLoaded) {
      if (templateJson) {
        try {
          let json = JSON.parse(templateJson);
          json = sanitizeJSON(json);

          // Force image reload
          json.pages.forEach((page) => {
            page.children.forEach((child) => {
              if (child.type === "image" && child.src) {
                const originalSrc = child.src;
                child.src = originalSrc + "?v=" + new Date().getTime();
              }
            });
          });

          store.clear();
          store.loadJSON(json);
        } catch (error) {
          console.error("Error parsing template JSON:", error);
        }
      } else {
        store.addPage();
      }
    }
  }, [templateJson, reloadKey, editorLoaded]);

  // compressImage function
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
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Image compression failed."));
          },
          "image/png",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    });
  };

  // Final save logic
  const saveAsJSON = async (isUpdate = false) => { 
    try {
      // 1) Take an editor screenshot
      const dataURL = await store.toDataURL({
        pixelRatio: 1,
        mimeType: "image/png",
      });
      const compressedBlob = await compressImage(dataURL);

      // 2) Upload thumbnail
      const uploadData = new FormData();
      uploadData.append("file", compressedBlob, "compressed-thumbnail.png");
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

      // 3) Prepare JSON payload
      let json = store.toJSON();
      json = sanitizeJSON(json); // always sanitize before saving
      const template_original = template || {};
      const brandId = localStorage.getItem("brandId") || "";
      let templateId = template_original.templateId || currentTemplateId || "";  
      
      const payload = {
        templateId, 
        url: thumbnailURL,
        tag: template_original.tag || "",
        templateOrientation:
          template_original.templateOrientation ||
          (json.width > json.height ? "landscape" : "portrait") ||
          "1:1",
        priority: json.priority || 0,
        templateSize: `${json.width}x${json.height}`,
        brandId: template_original.brandId || brandId || "",
        postType: template_original.postType || json.postType || "standard",
        customTemplate: template_original.customTemplate || false,
        mediaType: "image",
        videoDuration: json.videoDuration || "00:00",
        voiceoverEnabled: json.voiceoverEnabled || false,
        templateJson: JSON.stringify(json),
        isFavourite: template_original.isFavourite || false,
      };

      // 4) POST template
      const apiResponse = await axios.post(`${baseUrl}/v2/user/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      // If a new template was created
      if (apiResponse.data?.templateId) {
        setCurrentTemplateId(apiResponse.data.templateId);
        console.log("Updated Current Template ID:", apiResponse.data.templateId);
    }

      toast.success(isUpdate ? "Template updated successfully!" : "Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("An error occurred while saving the template.");
    }
  };

  return (
    <div
      style={{ display: "flex", width: "100vw", height: "100vh" }}
      className={isDarkMode ? "bp5-dark" : ""}
    >
      {editorLoaded ? (
        <PolotnoContainer style={{ width: "100%", height: "100%" }}>
          <SidePanelWrap>
            <SidePanel store={store} sections={sections} />
          </SidePanelWrap>
          <WorkspaceWrap>
            <Toolbar
              store={store}
              components={{
                ActionControls: () => (
                  <CustomToolbarActions
                    store={store}
                    navigate={navigate}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    saveAsJSON={saveAsJSON}
                  />
                ),
              }}
            />
            <Workspace store={store} />
            <ZoomButtons store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>
      ) : null}
    </div>
  );
};

export default PolotnoEditor;
