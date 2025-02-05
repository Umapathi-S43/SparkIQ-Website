// PolotnoAdmin.jsx

import React, { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { createStore } from "polotno/model/store";
import {
  PolotnoContainer,
  SidePanelWrap,
  WorkspaceWrap,
} from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel, SectionTab } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { observer } from "mobx-react-lite";

import axios from "axios";
import toast from "react-hot-toast";

import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { SiAffinitydesigner } from "react-icons/si";

import {
  TextSection,
  PhotosSection,
  ElementsSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
  TemplatesSection,
} from "polotno/side-panel";

import "./PolotnoEditor.css";

// ----------------------------------------------
// 1) CREATE POLOTNO STORE
// ----------------------------------------------
const store = createStore({
  key: "nFA5H9elEytDyPyvKL7T", // Replace with your Polotno API key
  showCredit: true,
});

// ----------------------------------------------
// 2) CONTEXT FOR UPLOADED FILES
// ----------------------------------------------
const UploadedFilesContext = createContext();

const UploadedFilesProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const addUploadedFile = (fileUrl) => {
    setUploadedFiles((prev) => [...prev, fileUrl]);
  };

  return (
    <UploadedFilesContext.Provider value={{ uploadedFiles, addUploadedFile }}>
      {children}
    </UploadedFilesContext.Provider>
  );
};

const useUploadedFiles = () => useContext(UploadedFilesContext);

// ----------------------------------------------
// 3) UPLOAD SECTION
// ----------------------------------------------
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
    const { uploadedFiles, addUploadedFile } = useUploadedFiles();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (file) => {
      if (!file) return;
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("customerId", "123");

      setIsUploading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/sparkiq/image/upload`,
          uploadData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const imageUrl = response.data.data.url;
        addUploadedFile(imageUrl);
        toast.success("File upload successful");
      } catch (error) {
        console.error(error);
        toast.error("File upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div style={{ padding: "10px", height: "100%" }}>
        <h3 style={{ marginBottom: "10px" }}>Uploaded Files</h3>
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
          }}
        >
          <FaCloudUploadAlt style={{ marginRight: "8px" }} />
          Upload Image
        </label>
        <input
          id="fileUpload"
          type="file"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          style={{ display: "none" }}
        />
        {isUploading && (
          <p style={{ marginTop: "10px", textAlign: "center" }}>Uploading...</p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            overflowY: "auto",
            maxHeight: "60vh",
          }}
        >
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => {
                store.activePage?.addElement({
                  type: "image",
                  src: file,
                });
              }}
            >
              <img
                src={file}
                alt={`Uploaded ${index}`}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }),
};

// ----------------------------------------------
// 4) DELETE CONFIRMATION MODAL
// ----------------------------------------------
const DeleteConfirmationModal = ({ isOpen, onClose, onDelete, template }) => {
  if (!isOpen) return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        {template && template.url && (
          <img
            src={template.url}
            alt="Template Preview"
            style={{ width: "100%", height: "auto", marginBottom: "10px" }}
          />
        )}
        <p style={{ marginBottom: "20px", fontSize: "16px" }}>
          Do you want to delete this template?
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              background: "#ccc",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: "8px 16px",
              background: "#f44336",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              color: "white",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ----------------------------------------------
// 5) LABEL MODAL
// ----------------------------------------------
const LabelModal = ({ element, onClose }) => {
  const [variableName, setVariableName] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v2/design/labels`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (response.data && response.data.data) {
          setOptions(response.data.data);
        } else {
          toast.error("Failed to load options!");
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Error fetching options!");
      }
    };

    fetchOptions();

    if (element && typeof element.get === "function") {
      const existingVar = element.get("dynamicVariable");
      setVariableName(existingVar || "");
      console.log("Existing dynamic variable:", existingVar);
    }
  }, [element]);

  const handleSave = () => {
    if (!element || typeof element.set !== "function") {
      console.error("Invalid element or missing set method:", element);
      toast.error("Element is not valid.");
      return;
    }

    const currentCustom = element.get ? element.get("custom") || {} : {};

    const updatedCustom = {
      ...currentCustom,
      edit: true,
      variable: variableName,
    };

    element.set({
      custom: updatedCustom,
      dynamicVariable: variableName,
    });

    toast.success("Variable set on element and edit mode enabled!");
    onClose();
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#2b2b2b",
          padding: 20,
          borderRadius: 8,
          maxWidth: 500,
          width: "90%",
          color: "#fff",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Dynamic Layer Settings</h3>
        <p style={{ marginBottom: "20px", fontSize: "14px", color: "#ccc" }}>
          Select a column from your source feed. The selected column will determine which product data fills this layer.
        </p>
        <p>Choose a column:</p>
        <select
          style={{ width: "100%", padding: 8, marginBottom: 20, color: "#000" }}
          value={variableName}
          onChange={(e) => setVariableName(e.target.value)}
        >
          <option value="">(No column selected)</option>
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        <div style={{ textAlign: "right", display: "flex", gap: "8px" }}>
          <button
            className="custom-button"
            style={{
              background: "#1976d2",
              border: "none",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            style={{
              background: "#b0b0b0",
              border: "none",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ----------------------------------------------
// 5) MY TEXTFILL + LABEL COMPONENTS
// ----------------------------------------------
const MyTextFillWithLabel = observer(({ store, element, elements }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelBtnBg, setLabelBtnBg] = useState("#fcfcfc");

  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          borderRadius: 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setLabelBtnBg("#d3d3d3")}
        onMouseLeave={() => setLabelBtnBg("#fcfcfc")}
        onClick={() => setShowLabelModal(true)}
      >
        Label
      </button>
      {showLabelModal && (
        <LabelModal element={element} onClose={() => setShowLabelModal(false)} />
      )}
    </div>
  );
});

// For brevity, the following components are similar to MyTextFillWithLabel
const MyImageWithLabel = observer(({ store, element, elements }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelBtnBg, setLabelBtnBg] = useState("#fcfcfc");

  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          borderRadius: 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setLabelBtnBg("#d3d3d3")}
        onMouseLeave={() => setLabelBtnBg("#fcfcfc")}
        onClick={() => setShowLabelModal(true)}
      >
        Label
      </button>
      {showLabelModal && (
        <LabelModal element={element} onClose={() => setShowLabelModal(false)} />
      )}
    </div>
  );
});

const MySvgWithLabel = observer(({ store, element, elements }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelBtnBg, setLabelBtnBg] = useState("#fcfcfc");

  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          borderRadius: 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setLabelBtnBg("#d3d3d3")}
        onMouseLeave={() => setLabelBtnBg("#fcfcfc")}
        onClick={() => setShowLabelModal(true)}
      >
        Label
      </button>
      {showLabelModal && (
        <LabelModal element={element} onClose={() => setShowLabelModal(false)} />
      )}
    </div>
  );
});

const MyFigureWithLabel = observer(({ store, element, elements }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelBtnBg, setLabelBtnBg] = useState("#fcfcfc");

  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          borderRadius: 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setLabelBtnBg("#d3d3d3")}
        onMouseLeave={() => setLabelBtnBg("#fcfcfc")}
        onClick={() => setShowLabelModal(true)}
      >
        Label
      </button>
      {showLabelModal && (
        <LabelModal element={element} onClose={() => setShowLabelModal(false)} />
      )}
    </div>
  );
});

const MyLineWithLabel = observer(({ store, element, elements }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [labelBtnBg, setLabelBtnBg] = useState("#fcfcfc");

  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          borderRadius: 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setLabelBtnBg("#d3d3d3")}
        onMouseLeave={() => setLabelBtnBg("#fcfcfc")}
        onClick={() => setShowLabelModal(true)}
      >
        Label
      </button>
      {showLabelModal && (
        <LabelModal element={element} onClose={() => setShowLabelModal(false)} />
      )}
    </div>
  );
});

// ----------------------------------------------
// 6) CUSTOM SIDE-PANEL SECTION: CustomSection (Design)
// ----------------------------------------------
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
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    // For deletion modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    const fetchTemplates = async (pageNum) => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/v2/template?page=${pageNum}&size=10`,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );
        let resTemplates = response.data.data.content || [];
        resTemplates.reverse(); // Reverse only once before assigning
    
        setTemplates((prev) =>
          pageNum === 0 ? resTemplates : [...resTemplates, ...prev] // Add new items at the top
        );
    
        setHasMore(pageNum + 1 < totalPages);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        //toast.error("Error loading templates. Please try again.");
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (templates.length === 0) {
        fetchTemplates(0);
      }
    }, []);

    useEffect(() => {
      if (page > 0) {
        fetchTemplates(page);
      }
    }, [page]);

    useEffect(() => {
      const container = document.querySelector(".template-container");
      if (container) {
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
      }
    }, [hasMore, loading]);

    const handleScroll = (e) => {
      const container = e.target;
      const isBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 1;
      if (isBottom && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    const applyTemplate = (template) => {
      try {
        if (!template.templateJson) {
          toast.error("Template JSON is not available.");
          return;
        }
        const parsedJson = JSON.parse(template.templateJson);
        store.loadJSON(parsedJson);
        toast.success("Template applied successfully!");
      } catch (err) {
        console.error("Error applying template:", err);
        toast.error("Failed to apply template. Please try again.");
      }
    };

    // Delete modal handlers
    const openDeleteModal = (id) => {
      setSelectedTemplateId(id);
      setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
      setIsModalOpen(false);
      setSelectedTemplateId(null);
    };

    const confirmDelete = async () => {
      try {
        await axios.delete(`${baseUrl}/v2/template/${selectedTemplateId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setTemplates((prev) =>
          prev.filter((p) => p.templateId !== selectedTemplateId)
        );
        setIsModalOpen(false);
        toast.success("Deleted successfully.");
      } catch (error) {
        console.error("Error deleting template:", error);
        toast.error("Failed to delete the template. Please try again.");
      }
    };

    const selectedTemplate = templates.find(
      (t) => t.templateId === selectedTemplateId
    );

    return (
      <>
        <div
          className="overflow-auto hide-scrollbar template-container"
          style={{ padding: "10px", maxHeight: "90vh" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            {templates.map((template) => (
              <div
                key={template.templateId}
                style={{
                  position: "relative",
                  borderRadius: "5px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img
                  src={template.url}
                  alt={template.name}
                  style={{ width: "100%", height: "auto" }}
                  onClick={() => applyTemplate(template)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(template.templateId);
                  }}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "rgba(244,67,54,0.8)",
                    border: "none",
                    borderRadius: "50%",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  <FaTrash style={{ color: "white" }} />
                </button>
              </div>
            ))}
          </div>
          {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
        </div>
        {isModalOpen && (
          <DeleteConfirmationModal
            isOpen={isModalOpen}
            onClose={closeDeleteModal}
            onDelete={confirmDelete}
            template={selectedTemplate}
          />
        )}
      </>
    );
  }),
};

// ----------------------------------------------
// 6) DEFINE SIDE-PANEL SECTIONS
// ----------------------------------------------
const sections = [
  CustomSection,
  TemplatesSection,
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSectionWithAPI,
  BackgroundSection,
  LayersSection,
  SizeSection,
];

// ----------------------------------------------
// 7) POLOTNOADMIN MAIN COMPONENT
// ----------------------------------------------
const PolotnoAdmin = () => {
  const { state } = useLocation();
  const templateData = state?.templateData;

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [currentTemplateId, setCurrentTemplateId] = useState(null);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Helper for compressing image
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

  // SAVE AS JSON
  const saveAsJSON = async (isUpdate = false) => {
    try {
      const dataURL = await store.toDataURL({
        pixelRatio: 1,
        mimeType: "image/png",
      });
      const compressedBlob = await compressImage(dataURL);
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
      const json = store.toJSON();
      const payload = {
        templateId: isUpdate && currentTemplateId ? currentTemplateId : undefined,
        url: thumbnailURL,
        templateOrientation: json.width > json.height ? "landscape" : "portrait",
        priority: json.priority || 0,
        templateSize: `${json.width}x${json.height}`,
        postType: json.postType || "standard",
        customTemplate: true,
        mediaType: "image",
        videoDuration: json.videoDuration || "00:00",
        voiceoverEnabled: json.voiceoverEnabled || false,
        templateJson: JSON.stringify(json),
      };

      const apiResponse = await axios.post(`${baseUrl}/v2/template`, payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!isUpdate) {
        setCurrentTemplateId(apiResponse.data?.templateId);
      }
      toast.success(
        isUpdate ? "Template updated successfully!" : "Template saved successfully!"
      );
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("An error occurred while saving the template.");
    }
  };

  // LOAD FROM JSON
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
          alert("Template loaded successfully!");
        }
      };
      input.click();
    } catch (error) {
      console.error("Error loading template:", error);
      alert("An error occurred while loading the template.");
    }
  };

  // ON INIT: load theme + template
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    if (templateData) {
      store.loadJSON(templateData);
    } else {
      if (store.pages.length === 0) {
        store.addPage();
      }
    }
  }, [templateData]);

  const handleAddNew = () => {
    store.loadJSON({ pages: [] }); // Clear the workspace
    store.addPage(); // Add a new empty page
    toast.success("New template created!");
  };
  

  return (
    <div
      className={isDarkMode ? "bp5-dark" : ""}
      style={{
        height: "100vh",
        backgroundColor: isDarkMode ? "#000000" : "#f4f4f4",
      }}
    >
      {/* Header area with theme toggle + saving */}
      <div
        style={{
          padding: "6px",
          textAlign: "center",
          color: isDarkMode ? "white" : "black",
          position: "relative",
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: isDarkMode ? "#555" : "#e0e0e0",
            color: isDarkMode ? "white" : "black",
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
          onClick={() => saveAsJSON(false)}
          style={{
            backgroundColor: "#FFD700",
            color: "white",
            border: "none",
            padding: "4px 16px",
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Save as New
        </button>
        <button
          onClick={() => saveAsJSON(true)}
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
        <button
          onClick={handleAddNew}
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
          Add New
        </button>
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

      <UploadedFilesProvider>
        <PolotnoContainer style={{ width: "100vw", height: "93vh" }}>
          <SidePanelWrap>
            <SidePanel store={store} sections={sections} />
          </SidePanelWrap>
          <WorkspaceWrap>
            <Toolbar store={store} />
            <Workspace
              store={store}
              components={{
                TextFill: MyTextFillWithLabel,
                ImageFilters: MyImageWithLabel,
                FigureFill: MyFigureWithLabel,
                LineSettings: MyLineWithLabel,
                SvgFlip: MySvgWithLabel,
              }}
            />
            <ZoomButtons store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>
      </UploadedFilesProvider>
    </div>
  );
};

export default PolotnoAdmin;
