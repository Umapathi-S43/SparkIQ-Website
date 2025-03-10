import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createStore } from "polotno/model/store";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { unstable_setAnimationsEnabled } from "polotno/config";
import { createPortal } from "react-dom";
import { Workspace } from "polotno/canvas/workspace";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { DownloadButton } from "polotno/toolbar/download-button";
import { Button, Tooltip, Position } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";
import { FaCloudUploadAlt, FaSave } from "react-icons/fa";
import { MdOutlineLightMode, MdOutlinePermMedia } from "react-icons/md";
import { CiDark } from "react-icons/ci";
import { SidePanel, SectionTab } from "polotno/side-panel";
import axios from "axios";
import toast from "react-hot-toast";
import { unstable_setTextOverflow } from 'polotno/config';
import { IoSearchSharp } from "react-icons/io5";
import { FaPhotoVideo, FaTrash } from "react-icons/fa";
import { PagesTimeline } from "polotno/pages-timeline";
// Constants

import { VideosPanel } from "polotno/side-panel/videos-panel"; // Official VideosPanel
import { PhotosPanel } from "polotno/side-panel/photos-panel"; // Official PhotosPanel
import UploadPanelEditor from "./UploadPanelEditor";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import {
  TextSection,
  ElementsSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
} from "polotno/side-panel";

import { QrSection, getQR } from "./QrSection";

// ✅ Create Polotno store
const store = createStore({
  key: "H5HjfuZWdlg9X4gOUB27",
  showCredit: false, // Hide Polotno Studio credit
});


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
  const [isSaving, setIsSaving] = useState(false);
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
      ><MdOutlinePermMedia />
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

const sections = [
  TextSection,
  ElementsSection,
  EmptyVideosSection,
  MediaSection,
  UploadPanelEditor,
  QrSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
];

const PolotnoEditor = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [reloadKey, setReloadKey] = useState(0);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local preview
  const [localPreviewOpen, setLocalPreviewOpen] = useState(false);
  const [localPreviewCurrent, setLocalPreviewCurrent] = useState(false);
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
          // reduce font size to fit text in the defined width/height
          // note, it will not increase font size back when there is more space
          // default, change height of the text object when it overflow defined with/height
          unstable_setTextOverflow('resize');
          unstable_setTextOverflow('change-font-size');
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
    setIsSaving(true);
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
        productId: template_original.productId || "",
        cohortId: template_original.cohortId || "",
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
    } finally {
      setIsSaving(false);
    }
  };
  const handleLocalPreviewCurrent = () => {
    setLocalPreviewCurrent(true);
    setLocalPreviewOpen(true);
  };
  const handleLocalPreviewAll = () => {
    setLocalPreviewCurrent(false);
    setLocalPreviewOpen(true);
  };


  return (
    <div
      className={isDarkMode ? "bp5-dark" : ""}
    >

      <LocalPreviewModal
        open={localPreviewOpen}
        onClose={() => setLocalPreviewOpen(false)}
        onlyCurrentPage={localPreviewCurrent}
      />

      {editorLoaded ? (
        <div
          className={isDarkMode ? "bp5-dark" : ""}
          style={{
            height: "100vh",
            backgroundColor: isDarkMode ? "#000000" : "#f4f4f4",
            position: "relative",
          }}
        >
          <PolotnoContainer style={{ width: "100%", height: "calc(100vh - 2px)" }}>
            <SidePanelWrap>
              <SidePanel store={store} sections={sections} />
            </SidePanelWrap>
            <WorkspaceWrap style={{ position: "relative" }}>
              {isSaving && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white overlay
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10, // Ensures loader is above workspace
                  }}
                >
                  <span className="save-loader"></span> {/* 🔹 Loader appears over workspace */}
                </div>
              )}
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
                      isSaving={isSaving} // Pass this to disable Save button
                    />
                  ),
                }}
              />
              <Workspace store={store} />
              <ZoomButtons store={store} />
              <MyPagesTimeline
                store={store}
                onPreviewCurrentPage={handleLocalPreviewCurrent}
                onPreviewAllPages={handleLocalPreviewAll}
              />
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
      ) : null}
    </div>
  );
};

export default PolotnoEditor;