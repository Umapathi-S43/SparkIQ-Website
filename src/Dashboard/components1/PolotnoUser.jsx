// PolotnoAdmin.jsx (or PolotnoUser.jsx)

import React, { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
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

// Icons
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { SiAffinitydesigner } from "react-icons/si";

// Polotno built-in sections
import {
  TextSection,
  PhotosSection,
  ElementsSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
  TemplatesSection,
} from "polotno/side-panel";
import { QrSection } from "./QrSection"; // If you have a QR section
import "./PolotnoEditor.css";

// ----------------------------------------------
// SPINNER COMPONENT
// ----------------------------------------------
const Spinner = () => {
  const lines = [...Array(16).keys()];
  return (
    <div className="my-spinner">
      {lines.map((i) => (
        <div key={i} className={`my-fade-line my-fade-line-${i}`} />
      ))}
    </div>
  );
};

// ----------------------------------------------
// 1) CREATE POLOTNO STORE
// ----------------------------------------------
const store = createStore({
  key: "H5HjfuZWdlg9X4gOUB27",
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
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("customerId", "123");

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
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Spinner />
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            overflowY: "auto",
            maxHeight: "60vh",
            marginTop: 20,
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
                store.activePage?.addElement({ type: "image", src: file });
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={template.url}
              alt="Template Preview"
              style={{
                width: "40%",
                height: "40%",
              }}
            />
          </div>
        )}
        <p
          style={{
            marginBottom: "20px",
            fontSize: "16px",
          }}
        >
          Do you want to delete this template?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
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
// 5) FIELDS SECTION (Design Properties)
// ----------------------------------------------
const DesignPropertiesContext = createContext();

const DesignPropertiesProvider = ({ children }) => {
  const [designProperties, setDesignProperties] = useState([]);

  useEffect(() => {
    // Replace "/v2/design/labels" with your actual endpoint returning design fields
    const fetchDesignProperties = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v2/design/labels`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setDesignProperties(response.data.data || []);
      } catch (error) {
        console.error("Error fetching design properties:", error);
        toast.error("Failed to fetch design properties.");
      }
    };
    fetchDesignProperties();
  }, []);

  return (
    <DesignPropertiesContext.Provider
      value={{ designProperties, setDesignProperties }}
    >
      {children}
    </DesignPropertiesContext.Provider>
  );
};

const useDesignProperties = () => useContext(DesignPropertiesContext);

const FieldsSection = {
  name: "fields",
  Tab: (props) => (
    <SectionTab name="Fields" {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        {/* Example icon (any image or icon) */}
        <img
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YWRhdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTEzLjIsMzcuN0gxOC43Yy00LjgsMC04LjctMy45LTguNy04LjdjMC00LjgsMy45LTguNyw4LjctOC43aDk0LjVjNC44LDAsOC43LDMuOSw4LjcsOC43QzEyMS45LDMzLjgsMTE4LDM3LjcsMTEzLjIsMzcuN3oiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTEzLjIsNzQuOEgxOC43Yy00LjgsMC04LjctMy45LTguNy04LjdzMy45LTguNyw4LjctOC43aDk0LjVjNC44LDAsOC43LDMuOSw4LjcsOC43QzEyMS45LDcwLjksMTE4LDc0LjgsMTEzLjIsNzQuOHoiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTEzLjIsMTExLjlIMTguN2MtNC44LDAtOC43LTMuOS04LjctOC43YzAtNC44LDMuOS04LjcsOC43LTguN2g5NC41YzQuOCwwLDguNywzLjksOC43LDguN0MxMjEuOSwxMDgsMTE4LDExMS45LDExMy4yLDExMS45eiIvPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0yMzcuMywxNjEuOGgtOTQuNWMtNC44LDAtOC43LTMuOS04LjctOC43YzAtNC44LDMuOS04LjcsOC43LTguN2g5NC41YzQuOCwwLDguNywzLjksOC43LDguN0MyNDYsMTU3LjksMjQyLjEsMTYxLjgsMjM3LjMsMTYxLjh6Ii8+PHBhdGggZmlsbD0iIzAwMDAwMDAiIGQ9Ik0yMzcuMywxOTguOWgtOTQuNWMtNC44LDAtOC43LTMuOS04LjctOC43YzAtNC44LDMuOS04LjcsOC43LTguN2g5NC41YzQuOCwwLDguNywzLjksOC43LDguN0MyNDYsMTk1LDI0Mi4xLDE5OC45LDIzNy4zLDE5OC45eiIvPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0yMzcuMywyMzZoLTk0LjVjLTQuOCwwLTguNy0zLjktOC43LTguN3MzLjktOC43LDguNy04LjdoOTQuNWM0LjgsMCw4LjcsMy45LDguNyw4LjddMjQyLjEsMjM2LDIzNy4zLDIzNnoiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMjI3LDEyMS45Yy00LjgsMC04LjctMy45LTguNy04LjdWMTguN2MwLTQuOCwzLjktOC43LDguNy04LjdzOC43LDMuOSw4LjcsOC43djk0LjVDMjM1LjYsMTE4LDIzMS43LDIxMS45LDIyNywxMjEuOXoiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTg5LjksMTIxLjljLTQuOCwwLTguNy0zLjktOC43LTguN1YxOC43YzAtNC44LDMuOS04LjcsOC43LTguN2M0LjgsMCw4LjcsMy45LDguNyw4LjdzLTMuOSw4LjctOC43LDguN1YxMTguNUMxOTguNiwxMTgsMTk0LjcsMTIxLjksMTg5LjksMTIxLjl6Ii8+PHBhdGggZmlsbD0iIzAwMDAwMDAiIGQ9Ik0xNTIuOCwxMjEuOWMtNC44LDAtOC43LTMuOS04LjctOC43VjE4LjdjMC00LjgsMy45LTguNyw4LjctOC43YzQuOCwwLDguNywzLjksOC43LDguN3Y5NC41QzE2MS41LDExOCwxNTcuNiwxMjEuOSwxNTIuOCwxMjEuOXoiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTAyLjksMjQ2Yy00LjgsMC04LjctMy45LTguNy04LjZ2LTk0LjVjMC00LjgsMy45LTguNyw4LjctOC43czguNywzLjksOC43LDguN3Y5NC41QzExMS42LDI0Mi4xLDExNy43LDI0NiwxMDIuOSwyNDZ6Ii8+PHBhdGggZmlsbD0iIzAwMDAwMDAiIGQ9Ik03NS44LDI0NmMtNC44LDAtOC43LTMuOS04LjctOC43di05NC41YzAtNC44LDMuOS04LjcsOC43LTguN3M4LjcsMy45LDguNyw4LjdsMCw5NC41Qzg0LjUsMjQyLjEsODAuNiwyNDYsNzUuOCwyNDZ6Ii8+PHBhdGggZmlsbD0iIzAwMDAwMDAiIGQ9Ik0yOC43LDI0NmMtNC44LDAtOC43LTMuOS04LjctOC43di05NC41YzAtNC44LDMuOS04LjcsOC43LTguN3M4LjcsMy45LDguNyw4LjdsMCw5NC41QzM3LjQsMjQyLjEsMzMuNSwyNDYsMjguNywyNDZ6Ii8+PC9nPjwvZz4NCjwvc3ZnPg=="
          width="16"
          height="16"
        />
      </div>
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    const { designProperties } = useDesignProperties();

    const handleAddToCanvas = (prop) => {
      if (prop.type === "image") {
        store.activePage?.addElement({
          type: "image",
          src:
            prop.defaultValue ||
            "https://via.placeholder.com/400?text=No+Image",
          dynamicVariable: prop.value,
          height: 200,
          width: 200,
          custom: {
            variable: prop.value,
            edit: true,
            fieldId: prop.id,
          },
        });
      } else {
        store.activePage?.addElement({
          type: "text",
          fontSize: 32,
          text: prop.defaultValue || "Placeholder Text",
          dynamicVariable: prop.value,
          custom: {
            variable: prop.value,
            edit: true,
            fieldId: prop.id,
          },
        });
      }
      toast.success(`Added "${prop.name}" to the canvas!`);
    };

    return (
      <div style={{ padding: "10px", height: "100%", overflowY: "auto" }}>
        <h3 style={{ marginBottom: "10px" }}>Design Fields</h3>
        {!designProperties.length && (
          <p style={{ fontStyle: "italic", fontSize: "14px" }}>
            No design fields found.
          </p>
        )}
        <div className="grid gap-3">
          {designProperties.map((property) => {
            const isImage = property.type === "image";
            return (
              <div
                key={property.id}
                className="rounded-lg shadow-sm p-3 border cursor-pointer hover:shadow-md transition"
                style={{ backgroundColor: "#BFBFBF35" }}
                onClick={() => handleAddToCanvas(property)}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  {property.name}
                </label>
                {isImage ? (
                  <img
                    src={
                      property.defaultValue ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={property.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <p style={{ margin: 0 }}>
                    {property.defaultValue ||
                      property.value ||
                      "Placeholder Text"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }),
};

// ----------------------------------------------
// 6) (OPTIONAL) CUSTOM SECTION (Design Templates)
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
  Panel: observer(({ store, setCurrentTemplateId, reloadTrigger }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
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
        const resTemplates = response.data.data.content || [];
        const totalPages = response.data.data.totalPages;
        setTemplates((prev) =>
          pageNum === 0 ? resTemplates : [...prev, ...resTemplates]
        );
        setHasMore(pageNum + 1 < totalPages);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    const applyTemplate = async (template) => {
      setIsApplying(true);
      try {
        if (!template.templateJson) {
          toast.error("Template JSON is not available.");
          return;
        }
        const parsedJson = JSON.parse(template.templateJson);
        store.loadJSON(parsedJson);
        if (typeof setCurrentTemplateId === "function") {
          setCurrentTemplateId(template.templateId);
        }
        toast.success("Template applied successfully!");
      } catch (err) {
        console.error("Error applying template:", err);
        toast.error("Failed to apply template. Please try again.");
      } finally {
        setIsApplying(false);
      }
    };

    useEffect(() => {
      if (templates.length === 0) {
        fetchTemplates(0);
      }
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (page > 0) {
        fetchTemplates(page);
      }
      // eslint-disable-next-line
    }, [page]);

    useEffect(() => {
      if (reloadTrigger > 0) {
        setTemplates([]);
        setPage(0);
        fetchTemplates(0);
      }
      // eslint-disable-next-line
    }, [reloadTrigger]);

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
        container.scrollHeight - container.scrollTop - container.clientHeight <
        1;
      if (isBottom && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

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
        {isApplying && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </div>
        )}
        <div
          className="overflow-auto hide-scrollbar template-container"
          style={{ padding: "10px", maxHeight: "90vh", position: "relative" }}
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
          {loading && (
            <p style={{ textAlign: "center", marginTop: 10 }}>
              <Spinner />
            </p>
          )}
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
// TEMPLATE TYPE MODAL (for Save/Update)
// ----------------------------------------------
const TemplateTypeModal = ({ isOpen, onClose, onConfirm, existingTag,existingBrandId }) => {
  const [selectedType, setSelectedType] = useState(existingTag || "");
  const [customType, setCustomType] = useState("");
  const [activeStatus, setActiveStatus] = useState(true); // Default to true

  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");


  // Fetch brand options dynamically
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v2/api/brands`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setBrandOptions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast.error("Failed to load brands.");
      }
    };
    fetchBrands();
  }, []);

  const handleBrandChange = (e) => {
    setSelectedBrandId(e.target.value);
  };

  useEffect(() => {
    setSelectedType(existingTag || "");
    setCustomType("");
    setActiveStatus(true);
     // If we have an existingBrandId, set that in the dropdown
     setSelectedBrandId(existingBrandId || "");
    }, [existingTag, existingBrandId, isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
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
          textAlign: "center",
        }}
      >
        <h3 className="text-bold" style={{ fontWeight: "bold" }}>
          Select Template Type
        </h3>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "6px" }}>
          Choose the type for this template.
        </p>

        {/* Dropdown for Template Type */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            if (e.target.value !== "Other") {
              setCustomType("");
            }
          }}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select Type</option>
          <option value="Ecom">Ecom</option>
          <option value="B2C">Automotive</option>
          <option value="B2B">Marketing</option>
          <option value="B2B Consultant">B2B Consultant</option>
          <option value="Other">Other</option>
        </select>

        {/* Custom Type if user picks 'Other' */}
        {selectedType === "Other" && (
          <input
            type="text"
            placeholder="Enter custom type"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ccc",
            }}
          />
        )}

        {/* Brand selection in one row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
            justifyContent: "flex-start",
          }}
        >
          <label
            style={{ fontSize: "14px", color: "#555", marginBottom: "0", flexShrink: 0, marginRight: "20px", marginLeft: "4px" }}
          >
            Select Brand:
          </label>
          <select
            value={selectedBrandId}
            onChange={handleBrandChange}
            className="rounded-md border border-slate-200 p-2 px-4 text-sm max-w-[180px] overflow-auto"
            style={{ flexGrow: 1 }}
          >
            <option value="">No Brand Selected</option>
            {brandOptions.map((brand) => {
              const displayName =
                brand.brandName.length > 15
                  ? `${brand.brandName.slice(0, 15)}...`
                  : brand.brandName;
              return (
                <option key={brand.id} value={brand.id}>
                  {displayName}
                </option>
              );
            })}
          </select>
        </div>

        {/* Active Template Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "15px",
            padding: "8px 12px",
            borderRadius: "4px",
            background: "#f8f8f8",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "#555",
              flex: 1,
              display: "flex",
              alignItems: "start",
            }}
          >
            Active Template
          </span>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={activeStatus}
              onChange={() => setActiveStatus(!activeStatus)}
              style={{ display: "none" }}
            />
            <span
              style={{
                display: "inline-block",
                width: "40px",
                height: "20px",
                backgroundColor: activeStatus ? "#4CAF50" : "#ccc",
                borderRadius: "20px",
                position: "relative",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: activeStatus ? "20px" : "2px",
                  top: "2px",
                  width: "16px",
                  height: "16px",
                  background: "white",
                  borderRadius: "50%",
                  transition: "0.3s",
                }}
              />
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#ccc",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                templateType: selectedType === "Other" ? customType : selectedType,
                activeStatus,
                brandId: selectedBrandId,
              })
            }
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={
              !selectedType ||
              (selectedType === "Other" && !customType) // require user to pick a type
            }
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ----------------------------------------------
// 7) POLOTNOUSER MAIN COMPONENT
// ----------------------------------------------
const PolotnoUser = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If available, this might contain { templateId: ..., ... }
  const templateData = state?.templateData;

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // For loading existing template from the server:
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

  // Modal for Save/Update
  const [modalOpen, setModalOpen] = useState(false);
  // actionType: "save" or "update"
  const [actionType, setActionType] = useState(null);
  // existingTag (a string) from loaded template
  const [existingTag, setExistingTag] = useState(null);
  const [existingBrandId, setExistingBrandId] = useState(""); // <-- NEW
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Open modal for the action ("save" or "update")
  const handleOpenModal = (action) => {
    setActionType(action);
    setModalOpen(true);
  };

  // SAVE AS JSON using the selected type as tag (and brand ID)
  const saveAsJSON = async (isUpdate = false, selectedData) => {
    const { templateType, activeStatus, brandId } = selectedData;
    setIsSaving(true);
    try {
      // 1) Convert current canvas to dataURL
      const dataURL = await store.toDataURL({
        pixelRatio: 1,
        mimeType: "image/png",
      });

      // 2) Compress the image
      const compressedBlob = await (async () => {
        const img = new Image();
        img.src = dataURL;
        return new Promise((resolve, reject) => {
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;
            const maxWidth = 1000,
              maxHeight = 1000,
              quality = 0.2;
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
      })();

      // 3) Upload compressed PNG
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

      // 4) Build JSON and payload
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
        version: json.version || 1,
        tag: templateType, // e.g., "B2C"
        activeStatus, // true/false
        brandId: brandId || "", // new brand ID field
      };
      console.log("Payload:", payload);

      // 5) POST to API
      const apiResponse = await axios.post(`${baseUrl}/v2/brand/templates`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!isUpdate) {
        // newly created
        setCurrentTemplateId(apiResponse.data?.data.templateId);
      }
      toast.success(
        isUpdate ? "Template updated successfully!" : "Template saved successfully!"
      );
      if (isUpdate) {
        setReloadTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("An error occurred while saving the template.");
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm modal => pass brandId/type/status
  const handleConfirmModal = (selectedData) => {
    setModalOpen(false);
    const isUpdate = actionType === "update";
    saveAsJSON(isUpdate, selectedData);
  };

  // LOAD ANY EXISTING TEMPLATE FROM BACKEND
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }

    // If there's a templateId from state, fetch from the API
    const fetchTemplateById = async (id) => {
      setIsTemplateLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/v2/brand/templates/${id}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        const template = response.data.data;
        if (template?.templateJson) {
          store.loadJSON(JSON.parse(template.templateJson));
          setCurrentTemplateId(template.templateId);
          setExistingTag(template.tag || null);
          if (template.brandId) {
            setExistingBrandId(template.brandId);
          }
        } else {
          toast.error("No template JSON found for this ID.");
          if (store.pages.length === 0) {
            store.addPage();
          }
        }
      } catch (err) {
        console.error("Error loading template from API:", err);
        toast.error("Failed to load template from server.");
        // If we fail, ensure we have at least one page
        if (store.pages.length === 0) {
          store.addPage();
        }
      } finally {
        setIsTemplateLoading(false);
      }
    };

    if (templateData?.templateId) {
      // We have templateId => fetch from API
      fetchTemplateById(templateData.templateId);
    } else {
      // If no templateData or no templateId, ensure we have at least one page
      if (store.pages.length === 0) {
        store.addPage();
      }
    }
  }, [templateData]);

  const handleClose = () => {
    store.clear();
    navigate("/user/brand-templates");
  };

  const handleAddNew = () => {
    store.loadJSON({ pages: [] });
    store.addPage();
    setCurrentTemplateId(null);
    setExistingTag(null);
    toast.success("New template created!");
  };

  // Prepare the custom section with props if you want to keep it
  const customSectionWithProps = {
    ...CustomSection,
    Panel: (panelProps) => (
      <CustomSection.Panel
        {...panelProps}
        setCurrentTemplateId={setCurrentTemplateId}
        reloadTrigger={reloadTrigger}
      />
    ),
  };

  // Our panel sections (adjust to your preference)
  const sections = [
    FieldsSection,
    //customSectionWithProps,
    TemplatesSection,
    TextSection,
    PhotosSection,
    ElementsSection,
    UploadSectionWithAPI,
    BackgroundSection,
    QrSection, // If you have a QrSection
    LayersSection,
    SizeSection,
  ];

  return (
    <DesignPropertiesProvider>
      <div
        className={isDarkMode ? "bp5-dark" : ""}
        style={{
          height: "100vh",
          backgroundColor: isDarkMode ? "#000000" : "#f4f4f4",
          position: "relative",
        }}
      >
        {isSaving && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </div>
        )}

        {/* Show spinner if template is loading from the API */}
        {isTemplateLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </div>
        )}

        {/* Save/Update Modal */}
        <TemplateTypeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmModal}
          existingTag={existingTag}
          existingBrandId={existingBrandId}
        />

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
            onClick={() => handleOpenModal("save")}
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
            onClick={() => handleOpenModal("update")}
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
            onClick={handleClose}
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
              <Workspace store={store} />
              <ZoomButtons store={store} />
            </WorkspaceWrap>
          </PolotnoContainer>
        </UploadedFilesProvider>
      </div>
    </DesignPropertiesProvider>
  );
};

export default PolotnoUser;
