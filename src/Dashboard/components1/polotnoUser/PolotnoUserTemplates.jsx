// PolotnoAdmin.jsx (or PolotnoUser.jsx)

import React, { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { createStore } from "polotno/model/store";
import { unstable_setAnimationsEnabled } from "polotno/config";
import { IoSearchSharp } from "react-icons/io5";
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
import { CgIfDesign } from "react-icons/cg";
import axios from "axios";
import toast from "react-hot-toast";

import { PagesTimeline } from "polotno/pages-timeline";
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";
import { photoroomKey } from "../../../components/utils/Constant";

// Icons
import { FaCloudUploadAlt, FaPhotoVideo, FaTrash } from "react-icons/fa";
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
import { QrSection } from "../QrSection"; // If you have a QR section
import "./../PolotnoEditor.css";
import UploadPanel from "./UploadPanel";
import { VideosPanel } from "polotno/side-panel/videos-panel"; // Official VideosPanel
import { PhotosPanel } from "polotno/side-panel/photos-panel"; // Official PhotosPanel

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

// Polotno Cloud key
const POLNOTO_API_KEY = "H5HjfuZWdlg9X4gOUB27";

// Helper to get the next unique media name
function getNextMediaName(type) {
  let count = 0;
  if (type === "video") {
    store.pages.forEach((page) => {
      page.children.forEach((child) => {
        if (
          child.type === "video" &&
          child.custom &&
          typeof child.custom.variable === "string" &&
          child.custom.variable.startsWith("video")
        ) {
          const num = parseInt(child.custom.variable.replace("video", ""), 10);
          if (!isNaN(num) && num > count) {
            count = num;
          }
        }
      });
    });
    return "video" + (count + 1);
  } else if (type === "audio") {
    store.audios.forEach((audio) => {
      if (
        audio.custom &&
        typeof audio.custom.variable === "string" &&
        audio.custom.variable.startsWith("audio")
      ) {
        const num = parseInt(audio.custom.variable.replace("audio", ""), 10);
        if (!isNaN(num) && num > count) {
          count = num;
        }
      }
    });
    return "audio" + (count + 1);
  }
  return type;
}


// Main store for editing
const store = createStore({ key: POLNOTO_API_KEY });

// Add a change listener to update video elements when they are added
store.on("change", (e) => {
  // For video elements added via addElement
  if (e.action === "addElement") {
    const el = store.findOne({ id: e.data.id });
    if (el?.type === "video" && (!el.custom || !el.custom.variable)) {
      const name = getNextMediaName("video");
      el.set({ custom: { edit: true, variable: name } });
    }
  }
  // For audio tracks added via store.addAudio
  if (e.action === "addAudio") {
    // e.data.id should refer to the audio id
    const audio = store.audios.find((a) => a.id === e.data.id);
    if (audio && (!audio.custom || !audio.custom.variable)) {
      const name = getNextMediaName("audio");
      audio.set({ custom: { edit: true, variable: name } });
    }
  }
});

unstable_setAnimationsEnabled(true);

// A second store for local previews
const previewStore = createStore({ key: POLNOTO_API_KEY });
unstable_setAnimationsEnabled(true);

//------------------------------------------------------------
// Simple ms -> mm:ss
//------------------------------------------------------------
function msToTimeString(ms = 0) {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

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
// const UploadSectionWithAPI = {
//   name: "upload-api",
//   Tab: (props) => (
//     <SectionTab name="Upload" {...props}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: "20px",
//         }}
//       >
//         <FaCloudUploadAlt />
//       </div>
//     </SectionTab>
//   ),
//   Panel: observer(({ store }) => {
//     const { uploadedFiles, addUploadedFile } = useUploadedFiles();
//     const [isUploading, setIsUploading] = useState(false);

//     const handleFileUpload = async (file) => {
//       if (!file) return;
//       setIsUploading(true);
//       const uploadData = new FormData();
//       uploadData.append("file", file);
//       uploadData.append("customerId", "123");

//       try {
//         const response = await axios.post(
//           `${baseUrl}/sparkiq/image/upload`,
//           uploadData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${jwtToken}`,
//             },
//           }
//         );
//         const imageUrl = response.data.data.url;
//         addUploadedFile(imageUrl);
//         toast.success("File upload successful");
//       } catch (error) {
//         console.error(error);
//         toast.error("File upload failed. Please try again.");
//       } finally {
//         setIsUploading(false);
//       }
//     };

//     return (
//       <div style={{ padding: "10px", height: "100%" }}>
//         <h3 style={{ marginBottom: "10px" }}>Uploaded Files</h3>
//         <label
//           htmlFor="fileUpload"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "8px",
//             backgroundColor: "#333",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           <FaCloudUploadAlt style={{ marginRight: "8px" }} />
//           Upload Image
//         </label>
//         <input
//           id="fileUpload"
//           type="file"
//           onChange={(e) => handleFileUpload(e.target.files[0])}
//           style={{ display: "none" }}
//         />
//         {isUploading && (
//           <div style={{ textAlign: "center", marginTop: 10 }}>
//             <Spinner />
//           </div>
//         )}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)",
//             gap: "10px",
//             overflowY: "auto",
//             maxHeight: "60vh",
//             marginTop: 20,
//           }}
//         >
//           {uploadedFiles.map((file, index) => (
//             <div
//               key={index}
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//                 overflow: "hidden",
//                 cursor: "pointer",
//               }}
//               onClick={() => {
//                 store.activePage?.addElement({ type: "image", src: file });
//               }}
//             >
//               <img
//                 src={file}
//                 alt={`Uploaded ${index}`}
//                 style={{ width: "100%", height: "auto" }}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }),
// };




//------------------------------------------------------------
// MyPagesTimeline
//------------------------------------------------------------
export const MyPagesTimeline = observer(({ store, onPreviewCurrentPage, onPreviewAllPages }) => {
  const audioTrack = store.audios[0];
  const totalScenes = store.pages.length;
  const currentScene =
    store.activePage && totalScenes > 0
      ? store.pages.findIndex((p) => p.id === store.activePage.id) + 1
      : 0;

  const ItemComponent = (props) => (
    <div style={{ position: "relative", marginBottom: "6px" }}>
      <props.Component {...props} />
      {audioTrack && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.7)",
            fontSize: "10px",
            color: "red",
            textAlign: "center",
          }}
        >
          Audio: {audioTrack.name || "untitled"}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: "8px" }}>
      <style>
        {`
          .my-preview-button {
            background-color: #f5f8fa;
            border: 1px solid #bfccd6;
            border-radius: 3px;
            color: #394b59;
            padding: 4px 8px;
            cursor: pointer;
            margin-right: 10px;
            transition: background-color 0.2s;
          }
          .my-preview-button:hover {
            background-color: #e1e8ed;
          }
        `}
      </style>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ marginLeft: "30px", display: "flex", alignItems: "center" }}>
          <button className="ml-20 my-preview-button" onClick={onPreviewCurrentPage}>
            Preview Current Scene
          </button>
          <button className="my-preview-button" onClick={onPreviewAllPages}>
            Preview All Scenes
          </button>
          <span style={{ marginLeft: "8px", fontSize: "12px", color: "#999" }}>
            Scene {currentScene} / {totalScenes}
          </span>
        </div>
      </div>
      <PagesTimeline store={store} itemComponent={ItemComponent} />
    </div>
  );
});


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
          fontSize: "24px",
        }}
      >
        {/* Example icon (any image or icon) */}
        <CgIfDesign />
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


//------------------------------------------------------------
// MEDIA SECTION COMPONENT
//------------------------------------------------------------
const theme = localStorage.getItem("theme");
const isDarkMode = theme === "dark";
const MediaSection = {
  name: "media",
  Tab: (props) => (
    <SectionTab name="Media" {...props}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}
      ><FaPhotoVideo />
      </div>
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    const [activeTab, setActiveTab] = useState("photos");
    const [aiVideoItems, setAiVideoItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetchVideos(1, "technology");
    }, []);

    const fetchVideos = async (pageNum, query) => {
      if (loading) return;
      setLoading(true);
      try {
        const API_KEY = "49135722-3c7eead3cf8935610431f2bc2";
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
          `https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodedQuery}&video_type=film&order=popular&per_page=20&page=${pageNum}`
        );
        const data = await response.json();
        if (data?.hits?.length > 0) {
          const videos = data.hits
            .filter((video) => video.videos?.large?.url)
            .map((video) => ({
              name: `Video ${video.id}`,
              url: video.videos.large.url,
              thumbnail: video.videos.large.thumbnail,
              type: "video",
            }));
          setAiVideoItems((prevVideos) =>
            pageNum === 1 ? videos : [...prevVideos, ...videos]
          );
        } else {
          setAiVideoItems([]);
        }
      } catch (error) {
        console.error("Error fetching AI videos:", error);
        toast.error("Failed to fetch AI videos.");
      }
      setLoading(false);
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleSearchKeyDown = (e) => {
      if (e.key === "Enter") {
        setPage(1);
        setAiVideoItems([]);
        fetchVideos(1, searchQuery || "technology");
      }
    };

    const handleScroll = (e) => {
      if (loading) return;
      const nearBottom =
        e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
      if (nearBottom) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchVideos(nextPage, searchQuery || "technology");
          return nextPage;
        });
      }
    };

    const handleMediaClick = (item) => {
      store.activePage?.addElement({
        type: "video",
        src: item.url,
        width: 800,
        height: 450,
        custom: { edit: true, variable: getNextMediaName("video") },
      });
      toast.success(`Video added: ${item.name}`);
      console.log("Updated JSON:", JSON.stringify(store.toJSON(), null, 2));
    };

    const renderTabContent = () => {
      if (activeTab === "video") {
        return <VideosPanel store={store} />;
      } else if (activeTab === "audio") {
        return <p>No dynamic audio integration yet.</p>;
      } else if (activeTab === "ai") {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "20px", padding: "6px", marginLeft: "-10px", backgroundColor: "#fff", marginBottom: "10px" }}>
              <IoSearchSharp size={20} color="#333" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                style={{
                  flex: 1,
                  padding: "2px",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
            <div style={aiVideoGridStyles.container} onScroll={handleScroll}>
              {aiVideoItems.length === 0 ? (
                <p>{loading ? "Loading AI videos..." : "No results found."}</p>
              ) : (
                aiVideoItems.map((item) => (
                  <div
                    key={item.name}
                    style={aiVideoGridStyles.mediaItem}
                    onClick={() => handleMediaClick(item)}
                  >
                    <video src={item.url} autoPlay loop muted style={aiVideoGridStyles.video} />
                  </div>
                ))
              )}
              {loading && <p style={{ textAlign: "center" }}>Loading more videos...</p>}
            </div>
          </>
        );
      } else if (activeTab === "photos") {
        return <PhotosPanel store={store} />;
      }
      return null;
    };

    return (
      <div style={{ padding: "10px", color: isDarkMode ? "#fff" : "#000", height: "100%" }}>
        <style>{subTabStyles}</style>
        <div className="polotno-sub-tabs">
          <div
            className={`polotno-sub-tab ${activeTab === "photos" ? "is-active" : ""}`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </div>
          <div
            className={`polotno-sub-tab ${activeTab === "audio" ? "is-active" : ""}`}
            onClick={() => setActiveTab("audio")}
          >
            Audio
          </div>
          <div
            className={`polotno-sub-tab ${activeTab === "ai" ? "is-active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            AI Picked
          </div>
          <div
            className={`polotno-sub-tab ${activeTab === "video" ? "is-active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            Video
          </div>
        </div>
        {renderTabContent()}
      </div>
    );
  }),
};
const subTabStyles = `
.polotno-sub-tabs {
  display: flex;
  margin-bottom: 8px;
}
.polotno-sub-tab {
  font-size: 14px;
  margin-right: 16px;
  padding-bottom: 4px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.polotno-sub-tab:hover {
  color: #106ba3;
}
.polotno-sub-tab.is-active {
  border-color: #106ba3;
}
`;

const aiVideoGridStyles = {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    justifyItems: "center",
    alignItems: "center",
    maxHeight: "600px",
    overflowY: "auto",
  },
  mediaItem: {
    width: "100%",
    height: "250px",
    cursor: "pointer",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "6px",
  },
};
const EmptyVideosSection = {
  name: "videos",
  Tab: () => null,
  Panel: () => null,
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
const TemplateTypeModal = ({ isOpen, onClose, onConfirm, existingTag, existingBrandId }) => {
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

//------------------------------------------------------------
// LocalPreviewModal
//------------------------------------------------------------
const LocalPreviewModal = observer(({ open, onClose, onlyCurrentPage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;

    // Clear old content
    previewStore.loadJSON({ pages: [] });

    const mainJson = JSON.parse(JSON.stringify(store.toJSON()));
    let pagesToLoad = mainJson.pages || [];
    if (onlyCurrentPage && store.activePage) {
      pagesToLoad = pagesToLoad.filter((p) => p.id === store.activePage.id);
    }

    // Partial JSON
    const partialJson = { ...mainJson, pages: pagesToLoad };
    previewStore.loadJSON(partialJson);

    // Auto-play
    previewStore.play({ repeat: true });

    // Also load the full JSON
    previewStore.loadJSON(mainJson);
    previewStore.play({ repeat: true });
    setIsPlaying(true);

    return () => {
      previewStore.stop();
      setIsPlaying(false);
      setProgress(0);
    };
  }, [open, onlyCurrentPage]);

  useEffect(() => {
    let interval;
    const DURATION = 5000; // 5 seconds
    let startTime = 0;

    if (isPlaying) {
      startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const fraction = elapsed / DURATION;
        if (fraction >= 1) {
          previewStore.stop();
          setIsPlaying(false);
          setProgress(0);
          clearInterval(interval);
        } else {
          setProgress(fraction * 100);
        }
      }, 100);
    } else {
      setProgress(0);
    }

    return () => interval && clearInterval(interval);
  }, [isPlaying]);

  if (!open) return null;

  const handleBackgroundClick = () => {
    previewStore.clear();
    previewStore.stop();
    setIsPlaying(false);
    onClose();
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      previewStore.stop();
    } else {
      previewStore.play({ repeat: true });
    }
    setIsPlaying(!isPlaying);
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={handleBackgroundClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "800px",
          height: "500px",
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 999999,
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
          onClick={() => {
            previewStore.clear();
            setIsPlaying(false);
            previewStore.stop();
            setIsPlaying(false);
            onClose();
          }}
        >
          Close
        </button>
        <div style={{ flex: 1, position: "relative" }}>
          <PolotnoContainer style={{ width: "100%", height: "100%" }}>
            <SidePanelWrap style={{ display: "none" }} />
            <WorkspaceWrap>
              <Workspace
                store={previewStore}
                components={{ PageControls: () => null }}
              />
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
        <div
          style={{
            height: "40px",
            background: "#f1f1f1",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={handleTogglePlay}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <div
            style={{
              flex: 1,
              height: "5px",
              background: "#ddd",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#4CAF50",
                transition: "width 0.1s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

//------------Remove Background for Images----------
// Inline removeBackground function
async function removeBackground(imageFile) {
  const url = "https://sdk.photoroom.com/v1/segment";
  // Replace with your own API key
  const apiKey = photoroomKey;
  const formData = new FormData();
  formData.append("image_file", imageFile);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey
    },
    body: formData
  });

  if (!response.ok) {
    console.error(await response.json());
    throw new Error("Network response was not ok");
  }

  const imageBlob = await response.blob();
  return imageBlob;
}
const MyImageWithLabel = observer(({ store, element }) => {
  if (!element) return null;
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const handleRemoveBg = async () => {
    setIsRemovingBg(true);
    try {
      // Assume the image URL is stored in element.src
      const imageUrl = element.src;
      // Fetch the image blob from the URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      // Create a File from the blob (the API expects a File)
      const imageFile = new File([blob], "image.png", { type: blob.type });
      
      // Call the inline removeBackground function
      const newBgBlob = await removeBackground(imageFile);
      
      // Create a new FormData instance for the S3 upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", newBgBlob, "image.png");
  
      // Upload the processed image to your S3 endpoint
      const upResp = await axios.post(
        `${baseUrl}/sparkiq/image/upload?customerId=123`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
  
      // Replace the image URL with the one from the upload response
      // (Assuming the response contains the URL in upResp.data.url)
      const newImageUrl = upResp.data.data.url;
      console.log(newImageUrl);
      element.set({ src: newImageUrl });
    } catch (error) {
      console.error("Error removing background: ", error);
    } finally {
      setIsRemovingBg(false);
    }
  };
  
  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
          marginLeft: "8px"
        }}
        onClick={handleRemoveBg}
        disabled={isRemovingBg}
      >
        {isRemovingBg ? "Removing..." : "Remove Background"}
      </button>
    </div>
  );
});




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


  // Local preview
  const [localPreviewOpen, setLocalPreviewOpen] = useState(false);
  const [localPreviewCurrent, setLocalPreviewCurrent] = useState(false);

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
  function ensureMediaCustom(json) {
    // Create a deep clone of the JSON (using JSON.parse/stringify)
    const newJson = JSON.parse(JSON.stringify(json));

    // Update video elements with custom object if not set
    newJson.pages.forEach((page) => {
      page.children.forEach((child) => {
        if (child.type === "video" && (!child.custom || !child.custom.variable)) {
          child.custom = { edit: true, variable: getNextMediaName("video") };
        }
      });
    });

    // Update audio tracks with custom object if not set
    newJson.audios.forEach((audio) => {
      if (!audio.custom || !audio.custom.variable) {
        audio.custom = { edit: true, variable: getNextMediaName("audio") };
      }
    });
    return newJson;
  }



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
      let json = store.toJSON();
      json = ensureMediaCustom(json);

      let voiceoverEnabled = false;
      let videoDuration = "00:00";
      if (store.audios.length > 0) {
        voiceoverEnabled = true;
        const durMs = store.audios[0].duration || 0;
        if (durMs) {
          videoDuration = msToTimeString(durMs);
        }
      }

      let finalMediaType = "image";
      const hasVideoPlaceholder = json.pages?.some((page) =>
        page.children?.some((child) => child?.custom?.video1)
      );
      if (hasVideoPlaceholder) {
        finalMediaType = "video";
      }

      // 4) Build JSON and payload
      const payload = {
        templateId: isUpdate && currentTemplateId ? currentTemplateId : undefined,
        url: thumbnailURL,
        templateOrientation: json.width > json.height ? "landscape" : "portrait",
        priority: json.priority || 0,
        templateSize: `${json.width}x${json.height}`,
        postType: json.postType || "standard",
        customTemplate: true,
        mediaType: videoDuration === "00:00" ? "image" : "video",
        videoDuration,
        voiceoverEnabled,
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
    window.history.back(); // Correct way to go back
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
    ElementsSection,
    EmptyVideosSection,
    MediaSection,
    UploadPanel,
    BackgroundSection,
    QrSection, // If you have a QrSection
    LayersSection,
    SizeSection,
  ];
  const handleLocalPreviewCurrent = () => {
    setLocalPreviewCurrent(true);
    setLocalPreviewOpen(true);
  };
  const handleLocalPreviewAll = () => {
    setLocalPreviewCurrent(false);
    setLocalPreviewOpen(true);
  };


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

        <LocalPreviewModal
          open={localPreviewOpen}
          onClose={() => setLocalPreviewOpen(false)}
          onlyCurrentPage={localPreviewCurrent}
        />

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
          <PolotnoContainer style={{ width: "100%", height: "calc(100vh - 52px)" }}>
            <SidePanelWrap>
              <SidePanel store={store} sections={sections} />
            </SidePanelWrap>
            <WorkspaceWrap>
              <Toolbar store={store} />
              <Workspace store={store}
               components={{
                 ImageFilters: MyImageWithLabel}} />
              <ZoomButtons store={store} />
              <MyPagesTimeline
                store={store}
                onPreviewCurrentPage={handleLocalPreviewCurrent}
                onPreviewAllPages={handleLocalPreviewAll}
              />
            </WorkspaceWrap>
          </PolotnoContainer>
        </UploadedFilesProvider>
      </div>
    </DesignPropertiesProvider>
  );
};
export default PolotnoUser;
