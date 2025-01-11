import React, { useState, useEffect, createContext, useContext } from "react";
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
import { SiAffinitydesigner } from "react-icons/si";
import axios from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import { FaCloudUploadAlt } from "react-icons/fa";
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

// Create Polotno store
const store = createStore({
  key: "nFA5H9elEytDyPyvKL7T", // Replace with your Polotno API key
  showCredit: true,
});

// Create a context for uploaded files
const UploadedFilesContext = createContext();

const UploadedFilesProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // If needed, you can re-enable the fetch code:
  // const fetchUploadedFiles = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/sparkiq/image/list`, {
  //       headers: {
  //         Authorization: `Bearer ${jwtToken}`,
  //       },
  //     });
  //     setUploadedFiles(response.data.urls || []);
  //   } catch (error) {
  //     console.error("Error fetching uploaded files:", error);
  //     toast.error("Failed to fetch uploaded files.");
  //   }
  // };

  // useEffect(() => {
  //   fetchUploadedFiles();
  // }, []);

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

/**
 * Upload Section with your custom API upload logic
 */
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

const PolotnoAdmin = () => {
  const { state } = useLocation();
  const templateData = state?.templateData;

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // This state holds the templateId of the selected template
  const [currentTemplateId, setCurrentTemplateId] = useState(null);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

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

  /**
   * Save to backend. If `isUpdate` is `true` and we do have a `currentTemplateId`,
   * we send that ID so the backend will update rather than create a new record.
   */
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

      // `templateId` is only sent if we are updating and we have a current ID
      const payload = {
        templateId: isUpdate && currentTemplateId ? currentTemplateId : undefined,
        url: thumbnailURL,
        templateOrientation:
          json.width > json.height ? "landscape" : "portrait",
        priority: json.priority || 0,
        templateSize: `${json.width}x${json.height}`,
        postType: json.postType || "default",
        customTemplate: true,
        mediaType: "image",
        videoDuration: json.videoDuration || "00:00",
        voiceoverEnabled: json.voiceoverEnabled || false,
        templateJson: JSON.stringify(json),
      };

      // 3. POST the template
      const apiResponse = await axios.post(`${baseUrl}/v2/template`, payload, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      // if successful, set the ID if it doesn't exist
      if (!isUpdate) {
        setCurrentTemplateId(apiResponse.data?.templateId);
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

  /**
   * Load from JSON (manually, from local file). 
   * Not required for your system, but left here if you want local loading.
   */
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

  // If there is incoming template data from route state, load it into store.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }

    if (templateData) {
      store.loadJSON(templateData);
    } else {
      // If there's no data, ensure there's at least one page
      if (store.pages.length === 0) {
        store.addPage();
      }
    }
  }, [templateData]);

  // -------------------------
  // IMPORTANT: define the custom "Design" section **inside** your component
  // so it can access setCurrentTemplateId
  // -------------------------
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

      // Fetch templates from the server
      const fetchTemplates = async (pageNum) => {
        if (loading) return; // skip if already loading
        setLoading(true);

        try {
          const response = await axios.get(
            `${baseUrl}/v2/template?page=${pageNum}&size=10`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          const newTemplates = response.data.data.content || [];
          const totalAvailablePages = response.data.data.totalPages;

          setTemplates((prev) =>
            pageNum === 0 ? newTemplates : [...prev, ...newTemplates]
          );

          // whether we can load more or not
          const canLoadMore = pageNum + 1 < totalAvailablePages;
          setHasMore(canLoadMore);
        } catch (error) {
          console.error("Failed to fetch templates:", error);
          toast.error("Error loading templates. Please try again.");
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      };

      // This is triggered when user selects a template in the side panel
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
          setCurrentTemplateId(template.templateId);
          console.log("Updated Template Id:", currentTemplateId);
          toast.success("Template applied successfully!");
        } catch (error) {
          console.error("Error applying template:", error);
          toast.error("Failed to apply template. Please try again.");
        }
      };

      // infinite scroll
      const handleScroll = (e) => {
        const container = e.target;
        const isBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight <
          1;

        if (isBottom && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      };

      // fetch first page on mount
      useEffect(() => {
        if (templates.length === 0) {
          fetchTemplates(0);
        }
        // eslint-disable-next-line
      }, []);

      // whenever page changes, fetch next page
      useEffect(() => {
        if (page > 0) {
          fetchTemplates(page);
        }
        // eslint-disable-next-line
      }, [page]);

      // attach/detach scroll listener
      useEffect(() => {
        const container = document.querySelector(".template-container");
        if (container) {
          container.addEventListener("scroll", handleScroll);
          return () => container.removeEventListener("scroll", handleScroll);
        }
      }, [hasMore, loading]);

      return (
        <div
          className="overflow-auto hide-scrollbar template-container"
          style={{ padding: "10px", maxHeight: "90vh" }}
        >
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
              }}
            >
              {templates.map((template) => (
                <div
                  key={template.templateId} // or template.id, whichever is unique
                  style={{
                    borderRadius: "5px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => applyTemplate(template)}
                >
                  <img
                    src={template.url}
                    alt={template.name}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ))}
            </div>
            {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
            {/* {!hasMore && templates.length > 0 && (
              <p style={{ textAlign: "center" }}>No more templates to load</p>
            )}
            {!hasMore && templates.length === 0 && (
              <p style={{ textAlign: "center" }}>No templates available</p>
            )} */}
          </div>
        </div>
      );
    }),
  };

  // Combine your sections
  const sections = [
    CustomSection,          // your custom "Design" section
    TemplatesSection,
    TextSection,
    PhotosSection,
    ElementsSection,
    UploadSectionWithAPI,  // your custom Upload with API
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
      }}
    >
      <div
        style={{
          padding: "6px",
          textAlign: "center",
          color: isDarkMode ? "white" : "black",
          position: "relative",
        }}
      >
        {/* THEME TOGGLE BUTTON */}
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

        {/* SAVE AS NEW TEMPLATE BUTTON */}
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

        {/* UPDATE TEMPLATE BUTTON */}
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

        {/* LOAD FROM JSON BUTTON (optional) */}
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

        {/* CLOSE BUTTON */}
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
  );
};

export default PolotnoAdmin;
