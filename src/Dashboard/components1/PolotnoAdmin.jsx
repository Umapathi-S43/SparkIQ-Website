import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { createStore } from "polotno/model/store";
import { VideosPanel } from "polotno/side-panel/videos-panel"; // Official VideosPanel
import { PhotosPanel } from "polotno/side-panel/photos-panel"; // Official PhotosPanel
import {
  PolotnoContainer,
  SidePanelWrap,
  WorkspaceWrap,
} from "polotno";
import { IoSearchSharp } from "react-icons/io5";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel, SectionTab } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { PagesTimeline } from "polotno/pages-timeline";
import { observer } from "mobx-react-lite";
import axios from "axios";
import toast from "react-hot-toast";
import UploadSectionWithApi from "./UploadSectionWithApi";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";
import { FaTrash } from "react-icons/fa";
import { SiAffinitydesigner } from "react-icons/si";
import {
  TextSection,
  ElementsSection,
  PagesSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
  TemplatesSection,
} from "polotno/side-panel";
import { unstable_setAnimationsEnabled } from "polotno/config";
import "./PolotnoEditor.css";
import { MdOutlinePermMedia } from "react-icons/md";

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

//------------------------------------------------------------
// Spinner
//------------------------------------------------------------
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
// DeleteConfirmationModal
//------------------------------------------------------------
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
        {template?.url && (
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img
              src={template.url}
              alt="Template Preview"
              style={{ width: "60%", objectFit: "cover" }}
            />
          </div>
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

//------------------------------------------------------------
// LabelModal (Dynamic Variables)
//------------------------------------------------------------
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
        let opts = response.data?.data || [];
        if (element && typeof element.get === "function") {
          const existingVar = element.get("dynamicVariable");
          if (
            existingVar &&
            !opts.some((opt) => opt.value === existingVar)
          ) {
            opts = [{ id: "custom", name: existingVar, value: existingVar }, ...opts];
          }
        }
        setOptions(opts);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Error fetching options!");
      }
    };

    fetchOptions();

    if (element && typeof element.get === "function") {
      const existingVar = element.get("dynamicVariable");
      setVariableName(existingVar || "");
      console.log("Label Element Data:", {
        type: element.type,
        text: element.text || "N/A",
        dynamicVariable: existingVar,
      });
    }
  }, [element]);

  const handleSave = () => {
    if (!element || typeof element.set !== "function") {
      console.error("Invalid element or missing set method:", element);
      toast.error("Element is not valid.");
      return;
    }
    const currentCustom = element.get ? element.get("custom") || {} : {};
    const updatedCustom = { ...currentCustom, edit: true, variable: variableName };
    element.set({ custom: updatedCustom, dynamicVariable: variableName });
    const json_modified = store.toJSON();
    const targetElement = findElementById(json_modified, element.id);
    console.log("Modified Element:", targetElement);
    toast.success("Variable set on element and edit mode enabled!");
    onClose();
  };

  const findElementById = (json, id) => {
    for (const page of json.pages || []) {
      for (const child of page.children || []) {
        if (child.id === id) return child;
      }
    }
    return null;
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

//------------------------------------------------------------
// TEXT/IMAGE ... WITH LABEL COMPONENTS
//------------------------------------------------------------
const MyTextFillWithLabel = observer(({ store, element }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
        }}
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

const MyImageWithLabel = observer(({ store, element }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
        }}
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

const MySvgWithLabel = observer(({ store, element }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
        }}
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

const MyFigureWithLabel = observer(({ store, element }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
        }}
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

const MyLineWithLabel = observer(({ store, element }) => {
  if (!element) return null;
  const [showLabelModal, setShowLabelModal] = useState(false);
  return (
    <div style={{ margin: "8px 0" }}>
      <button
        style={{
          backgroundColor: "transparent",
          color: "#000",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
        }}
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

//------------------------------------------------------------
// MEDIA SECTION
//------------------------------------------------------------
const audioItems = [
  {
    name: "Audio 1",
    url: "https://sparkiq-image-upload.s3.amazonaws.com/f9b772ba-f7c6-42d3-b316-948a556da643.mp3",
    type: "audio",
  },
  {
    name: "Audio 2",
    url: "https://sparkiq-image-upload.s3.amazonaws.com/c64f4f80-880b-43f6-b3f5-ab31efe651dd.mp3",
    type: "audio",
  },
];

const aiVideoItems = [
  {
    name: "AI Video 1",
    url: "https://sparkiq-image-upload.s3.amazonaws.com/bd5121c6-638c-463a-919a-2e6e6715cfe5.mp4",
    type: "video",
  },
];

const handleMediaClick = (item) => {
  if (item.type === "video") {
    // Directly add a video element with a custom property.
    const newVideo = store.activePage?.addElement({
      type: "video",
      src: item.url,
      width: 800,
      height: 450,
      custom: { edit: true, variable: getNextMediaName("video") },
    });
    if (newVideo) {
      newVideo.set({ custom: { edit: true, variable: getNextMediaName("video") } });
    }
    toast.success(`Video added: ${item.name}`);
  }
  // (For audio, you could implement similar logic if needed)
  console.log("Updated JSON:", JSON.stringify(store.toJSON(), null, 2));
};

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
    borderRadius: "0px",
  },
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

const gridStyles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  mediaItem: (isDark) => ({
    border: isDark ? "1px solid #5c7080" : "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    textAlign: "center",
    backgroundColor: isDark ? "#394b59" : "#f9f9f9",
    color: isDark ? "#fff" : "#000",
    transition: "background-color 0.2s",
  }),
  itemName: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "14px",
  },
  itemType: {
    margin: 0,
    fontSize: "12px",
  },
};

const EmptyVideosSection = {
  name: "videos",
  Tab: () => null,
  Panel: () => null,
};

//------------------------------------------------------------
// CustomSection (templates from backend)
//------------------------------------------------------------
const CustomSection = {
  name: "custom",
  Tab: (props) => (
    <SectionTab name="Design" {...props}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        const resp = await axios.get(`${baseUrl}/v2/template?page=${pageNum}&size=10`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const content = resp.data.data.content || [];
        const totalPages = resp.data.data.totalPages;
        setTemplates((prev) => (pageNum === 0 ? content : [...prev, ...content]));
        setHasMore(pageNum + 1 < totalPages);
      } catch (error) {
        console.error(error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!templates.length) {
        fetchTemplates(0);
      }
    }, []);

    useEffect(() => {
      if (page > 0) fetchTemplates(page);
    }, [page]);

    useEffect(() => {
      if (reloadTrigger > 0) {
        setTemplates([]);
        setPage(0);
        fetchTemplates(0);
      }
    }, [reloadTrigger]);

    const handleScroll = (e) => {
      const container = e.target;
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 1;
      if (nearBottom && hasMore && !loading) {
        setPage((p) => p + 1);
      }
    };

    const applyTemplate = async (tmpl) => {
      setIsApplying(true);
      try {
        if (!tmpl.templateJson) {
          toast.error("No template JSON available!");
          return;
        }
        const parsed = JSON.parse(tmpl.templateJson);
        store.loadJSON(parsed);
        if (setCurrentTemplateId) setCurrentTemplateId(tmpl.templateId);
        toast.success("Template applied!");
      } catch (err) {
        console.error(err);
        toast.error("Error applying template");
      } finally {
        setIsApplying(false);
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
        setTemplates((p) => p.filter((t) => t.templateId !== selectedTemplateId));
        setIsModalOpen(false);
        toast.success("Deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete template.");
      }
    };

    const selectedTemplate = templates.find((t) => t.templateId === selectedTemplateId);

    return (
      <>
        {isApplying && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner />
          </div>
        )}
        <div
          className="template-container"
          style={{ padding: "10px", maxHeight: "90vh", overflowY: "auto" }}
          onScroll={handleScroll}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
            {templates.map((tmpl) => (
              <div
                key={tmpl.templateId}
                style={{
                  position: "relative",
                  borderRadius: "5px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img
                  src={tmpl.url}
                  alt={tmpl.name}
                  style={{ width: "100%", height: "auto" }}
                  onClick={() => applyTemplate(tmpl)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(tmpl.templateId);
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
                  <FaTrash style={{ color: "#fff" }} />
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

//------------------------------------------------------------
// TemplateTypeModal (Save/Update JSON)
//------------------------------------------------------------
const TemplateTypeModal = ({ isOpen, onClose, onConfirm, existingTag }) => {
  const [selectedType, setSelectedType] = useState(existingTag || "");
  const [customType, setCustomType] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);

  useEffect(() => {
    setSelectedType(existingTag || "");
    setCustomType("");
    setActiveStatus(true);
  }, [existingTag, isOpen]);

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
        <h3 className="text-bold" style={{ fontWeight: "bold" }}>Select Template Type</h3>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "6px" }}>
          Choose the type for this template.
        </p>
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
          <span style={{ fontSize: "14px", color: "#555", flex: 1, display: "flex", alignItems: "start" }}>
            Active Template
          </span>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
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
              ></span>
            </span>
          </label>
        </div>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
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
              onConfirm({ templateType: selectedType === "Other" ? customType : selectedType, activeStatus })
            }
            style={{
              background: "#4CAF50",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={!selectedType || (selectedType === "Other" && !customType)}
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
// MP4PreviewModal
//------------------------------------------------------------
const MP4PreviewModal = ({ visible, mp4Url, onClose, onSaveMP4 }) => {
  if (!visible) return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 20000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "800px",
          height: "80%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <h2 style={{ margin: "8px" }}>MP4 Preview</h2>
        {mp4Url ? (
          <video
            src={mp4Url}
            controls
            style={{ flex: 1, background: "#000", border: "1px solid #ccc" }}
          />
        ) : (
          <p>No video to preview.</p>
        )}
        <div style={{ margin: "10px" }}>
          <button
            style={{ background: "#4caf50", color: "#fff", marginRight: "8px", padding: "4px 8px" }}
            onClick={onSaveMP4}
            disabled={!mp4Url}
          >
            Save as MP4
          </button>
          <button
            style={{ background: "#f44336", color: "#fff", padding: "4px 8px" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

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
// PolotnoAdmin (MAIN)
//------------------------------------------------------------
const PolotnoAdmin = () => {
  const { state } = useLocation();
  const templateData = state?.templateData;

  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // TemplateTypeModal
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [existingTag, setExistingTag] = useState(null);

  // MP4 preview
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [mp4Url, setMp4Url] = useState(null);

  // Local preview
  const [localPreviewOpen, setLocalPreviewOpen] = useState(false);
  const [localPreviewCurrent, setLocalPreviewCurrent] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDarkMode(savedTheme === "dark");

    if (templateData) {
      store.loadJSON(templateData);
      if (templateData.templateId) setCurrentTemplateId(templateData.templateId);
      if (templateData.tag) setExistingTag(templateData.tag);
    } else {
      if (!store.pages.length) {
        store.addPage();
      }
    }
  }, [templateData]);

  const toggleTheme = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem("theme", newVal ? "dark" : "light");
  };

  const handleOpenModal = (action) => {
    setActionType(action);
    setModalOpen(true);
  };

  const handleConfirmModal = (selectedType) => {
    setModalOpen(false);
    const isUpdate = actionType === "update";
    saveAsJSON(isUpdate, selectedType);
  };

  // Final JSON fix: ensure that every video (and optionally audio) has a custom field
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


  const saveAsJSON = async (isUpdate, selectedType) => {
    setIsSaving(true);
    try {
      const dataURL = await store.toDataURL({ pixelRatio: 1, mimeType: "image/png" });
      const compressed = await compressImage(dataURL);

      const formData = new FormData();
      formData.append("file", compressed, "thumbnail.png");
      const upResp = await axios.post(
        `${baseUrl}/sparkiq/image/upload?customerId=123`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const thumbUrl = upResp.data.data.url;

      // Gather store JSON and fix media custom fields
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

      const payload = {
        templateId: isUpdate && currentTemplateId ? currentTemplateId : undefined,
        url: thumbUrl,
        templateOrientation: json.width > json.height ? "landscape" : "portrait",
        priority: 0,
        templateSize: `${json.width}x${json.height}`,
        postType: json.postType || "standard",
        customTemplate: true,
        mediaType: videoDuration === "00:00" ? "image" : "video",
        videoDuration,
        voiceoverEnabled,
        templateJson: JSON.stringify(json),
        tag: selectedType.templateType,
        activeStatus: selectedType.activeStatus,
      };

      const resp = await axios({
        url: `${baseUrl}/v2/template`,
        method: isUpdate ? "post" : "post",
        data: payload,
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!isUpdate) {
        setCurrentTemplateId(resp.data?.data.templateId);
      }
      toast.success(isUpdate ? "Template updated!" : "Template saved!");
      if (isUpdate) setReloadTrigger((p) => p + 1);
    } catch (error) {
      console.error(error);
      toast.error("Error saving template.");
    } finally {
      setIsSaving(false);
    }
  };

  const compressImage = async (dataURL) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const maxWidth = 1000;
        const maxHeight = 1000;
        const quality = 0.2;
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

  const loadFromJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const text = await file.text();
        const json = JSON.parse(text);
        store.loadJSON(json, false);
        toast.success("Loaded template from JSON!");
      }
    };
    input.click();
  };

  const handleAddNew = () => {
    store.loadJSON({ pages: [] });
    store.addPage();
    setCurrentTemplateId(null);
    toast.success("New template created!");
  };

  const handleLocalPreviewCurrent = () => {
    setLocalPreviewCurrent(true);
    setLocalPreviewOpen(true);
  };
  const handleLocalPreviewAll = () => {
    setLocalPreviewCurrent(false);
    setLocalPreviewOpen(true);
  };

  const handleSaveMP4 = async () => {
    if (!mp4Url) return;
    try {
      const resp = await fetch(mp4Url);
      const mp4Blob = await resp.blob();
      const fData = new FormData();
      fData.append("file", mp4Blob, "rendered-video.mp4");
      fData.append("customerId", "123");
      const upResp = await axios.post(`${baseUrl}/sparkiq/image/upload`, fData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      toast.success("MP4 saved to your server!");
      console.log("Saved MP4 URL:", upResp.data.data.url);
    } catch (error) {
      toast.error("Error saving MP4 to server.");
    }
  };

  const handleSaveAsVideo = async () => {
    setIsSaving(true);
    try {
      const designJson = store.toDataURL();
      const renderRes = await fetch(`https://api.polotno.com/api/renders?KEY=${POLNOTO_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          design: store.toJSON(),
          format: "jpeg",
          pixelRatio: 1,
          ignoreBackground: false,
          skipFontError: true,
          skipImageError: true,
          textOverflow: "change-font-size",
        }),
      });
      const renderJob = await renderRes.json();
      if (renderJob.status !== "done" || !renderJob.output) {
        toast.error("Error generating MP4!");
        setIsSaving(false);
        return;
      }
      const mp4UrlFromCloud = renderJob.output;
      const dataURL = await store.toDataURL({ pixelRatio: 1, mimeType: "image/png" });
      const thumbBlob = await compressImage(dataURL);
      const thumbForm = new FormData();
      thumbForm.append("file", thumbBlob, "thumb.png");
      const thumbUp = await axios.post(`${baseUrl}/sparkiq/image/upload?customerId=123`, thumbForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const thumbnailURL = thumbUp.data.data.url;

      let voiceoverEnabled = false;
      let videoDuration = "00:00";
      if (store.audios.length > 0) {
        voiceoverEnabled = true;
        const durMs = store.audios[0].duration || 0;
        videoDuration = msToTimeString(durMs);
      }

      const finalJson = ensureMediaCustom(store.toJSON());
      const payload = {
        templateId: null,
        url: thumbnailURL,
        templateOrientation: finalJson.width > finalJson.height ? "landscape" : "portrait",
        priority: finalJson.priority || 0,
        templateSize: `${finalJson.width}x${finalJson.height}`,
        postType: finalJson.postType || "standard",
        customTemplate: true,
        mediaType: "video",
        videoDuration,
        voiceoverEnabled,
        templateJson: JSON.stringify(finalJson),
        tag: "Video Template",
        activeStatus: true,
      };

      await axios.post(`${baseUrl}/v2/template`, payload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      toast.success("Video template saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving video template.");
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      ...CustomSection,
      Panel: (panelProps) => (
        <CustomSection.Panel
          {...panelProps}
          setCurrentTemplateId={setCurrentTemplateId}
          reloadTrigger={reloadTrigger}
        />
      ),
    },
    TemplatesSection,
    TextSection,
    PagesSection,
    ElementsSection,
    UploadSectionWithApi,
    MediaSection,
    BackgroundSection,
    LayersSection,
    SizeSection,
    EmptyVideosSection,
  ];

  return (
    <div
      className={isDarkMode ? "bp5-dark" : ""}
      style={{ height: "100vh", background: isDarkMode ? "#000" : "#f4f4f4" }}
    >
      {isSaving && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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

      <MP4PreviewModal
        visible={previewModalVisible}
        mp4Url={mp4Url}
        onClose={() => setPreviewModalVisible(false)}
        onSaveMP4={handleSaveMP4}
      />

      <TemplateTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmModal}
        existingTag={existingTag}
      />

      <div style={{ padding: "6px", textAlign: "center", position: "relative" }}>
        <button
          onClick={toggleTheme}
          style={{
            marginRight: "6px",
            backgroundColor: "#BFBFBF35",
            color: isDarkMode ? "#fff" : "#000",
            padding: "4px 12px",
          }}
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => handleOpenModal("save")}
          style={{ backgroundColor: "#FFD700", color: "#000", marginRight: "6px", padding: "4px 12px" }}
        >
          Save as New
        </button>
        <button
          onClick={() => handleOpenModal("update")}
          style={{ backgroundColor: "#4CAF50", color: "#fff", marginRight: "6px", padding: "4px 12px" }}
        >
          Update Template
        </button>
        <button
          onClick={loadFromJSON}
          style={{ backgroundColor: "#007BFF", color: "#fff", marginRight: "6px", padding: "4px 12px" }}
        >
          Load JSON
        </button>
        <button
          onClick={handleAddNew}
          style={{ backgroundColor: "#007BFF", color: "#fff", marginRight: "6px", padding: "4px 12px" }}
        >
          New Blank
        </button>
        <button
          onClick={() => handleOpenModal("save")}
          style={{ backgroundColor: "#FFD700", color: "#000", marginRight: "6px", padding: "4px 12px" }}
        >
          Save as Video
        </button>
        <button
          style={{
            position: "absolute",
            right: "10px",
            top: "6px",
            background: "#f44336",
            color: "#fff",
            border: "none",
            padding: "4px 8px",
            cursor: "pointer",
          }}
          onClick={() => window.history.back()}
        >
          X
        </button>
      </div>

      <PolotnoContainer style={{ width: "100%", height: "calc(100vh - 52px)" }}>
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
              FigureFill: MySvgWithLabel,
              LineSettings: MyLineWithLabel,
              SvgFlip: MySvgWithLabel,
            }}
          />
          <ZoomButtons store={store} />
          <MyPagesTimeline
            store={store}
            onPreviewCurrentPage={handleLocalPreviewCurrent}
            onPreviewAllPages={handleLocalPreviewAll}
          />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default PolotnoAdmin;
