import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

// Polotno
import { SectionTab } from "polotno/side-panel";

// Your baseUrl, JWT token, etc.
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";

// ----------------------------------------------
//  SPINNER COMPONENT
// ----------------------------------------------
const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

// A helper to extract a file name from a URL
const getFileName = (url) => {
  try {
    const name = decodeURIComponent(url.split("/").pop()).split("?")[0];
    return name || "audio-file";
  } catch {
    return "audio-file";
  }
};

// ----------------------------------------------
//  UPLOAD SECTION COMPONENT
// ----------------------------------------------
const UploadSection = observer(({ store }) => {
  const [uploadedMedia, setUploadedMedia] = useState({
    photos: [],
    audios: [],
    videos: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("photos");

  // Track audio in store (only one audio is allowed).
  const [storeAudios, setStoreAudios] = useState([]);

  // Refresh local array from store.audios
  const refreshStoreAudios = () => {
    setStoreAudios([...store.audios]);
  };

  useEffect(() => {
    refreshStoreAudios();
  }, [store]);

  // ----------------------------------------------
  //  HANDLE FILE UPLOAD
  // ----------------------------------------------
  const handleFileUpload = async (file, type) => {
    if (!file) return;
    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("customerId", "123"); // example

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

      const fileUrl = response.data.data.url;
      setUploadedMedia((prev) => ({
        ...prev,
        [type]: [...prev[type], fileUrl],
      }));

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // ----------------------------------------------
  //  HANDLE MEDIA CLICK & ADD TO WORKSPACE
  // ----------------------------------------------
  // UploadSection handleMediaClick snippet
const handleMediaClick = (fileUrl, type) => {
  if (!store.activePage) return;

  // For AUDIO (tab = "audios")
  if (type === "audios") {
    // remove any existing audios
    store.audios.forEach((audioItem) => store.removeAudio(audioItem.id));
    // add new audio with CUSTOM
    store.addAudio({
      src: fileUrl,
      volume: 1,
      delay: 0,
      startTime: 0,
      endTime: 9999,
      custom: { edit: true, variable: "{audio1}" },
    });
    toast.success("Audio added to store.");
    refreshStoreAudios();
    return;
  }

  // For VIDEO (tab = "videos")
  if (type === "videos") {
    store.activePage.addElement({
      type: "video",
      src: fileUrl,
      width: 800,
      height: 450,
      custom: { edit: true, variable: "{video1}" },
    });
    toast.success("Video added to workspace.");
    return;
  }

  // For PHOTOS (tab = "photos")
  store.activePage.addElement({
    type: "image",
    src: fileUrl,
    width: 400,
    height: 300
  });
  toast.success("Image added to workspace.");
};


  // ----------------------------------------------
  //  REMOVE AUDIO FROM STORE (by audio.id)
  // ----------------------------------------------
  const removeAudio = (audioId) => {
    store.removeAudio(audioId);
    refreshStoreAudios();
    toast.success("Audio removed from design.");
  };

  return (
    <div style={{ padding: "10px", height: "100%" }}>
      <h3 style={{ marginBottom: "10px" }}>
        Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </h3>

      {/* Tabs for switching among photos, audios, videos */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {["photos", "audios", "videos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: activeTab === tab ? "#333" : "#ddd",
              color: activeTab === tab ? "#fff" : "#000",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

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
        }}
      >
        <FaCloudUploadAlt style={{ marginRight: "8px" }} />
        Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </label>
      <input
        id="fileUpload"
        type="file"
        accept={
          activeTab === "photos"
            ? "image/*"
            : activeTab === "audios"
              ? "audio/*"
              : "video/*"
        }
        onChange={(e) => handleFileUpload(e.target.files[0], activeTab)}
        style={{ display: "none" }}
      />

      {isUploading && <Spinner />}

      {/* ------------------------------------------------------
          Display the uploaded media for Photos/Videos
          ------------------------------------------------------ */}
      {activeTab !== "audios" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            overflowY: "auto",
            maxHeight: "55vh",
            marginTop: 20,
          }}
        >
          {uploadedMedia[activeTab].map((file, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => handleMediaClick(file, activeTab)}
            >
              {/* If photo, show <img>; if video, show <video> */}
              {activeTab === "photos" ? (
                <img
                  src={file}
                  alt={`Uploaded ${index}`}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <video
                  src={file}
                  style={{ width: "100%" }}
                  controls
                  onClick={(e) => {
                    e.stopPropagation(); // let user play without adding
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* -----------------------------------------------------
          For Audios tab:
            1) Show uploaded audio list with "music beats" label
            2) Highlight the one currently in store (blue bg)
            3) Only 1 audio is allowed in store at a time
          ----------------------------------------------------- */}
      {activeTab === "audios" && (
        <div style={{ marginTop: 20 }}>
          <h4>Uploaded Audios</h4>
          <p style={{ fontSize: "12px" }}>
            (Click an item to apply it to the design)
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "10px",
              overflowY: "auto",
              maxHeight: "55vh",
            }}
          >
            {
              uploadedMedia.audios.map((audioUrl, idx) => {
                const isActive =
                  storeAudios.length > 0 && storeAudios[0].src === audioUrl;

                return (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      overflow: "hidden",
                      padding: "8px",
                      backgroundColor: isActive ? "#add8e6" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    {/* Audio preview/controls */}
                    <audio src={audioUrl} controls style={{ width: "100%" }} />

                    {/* Button: "+" if audio is not active, "-" if it is active */}
                    <button
                      onClick={() => {
                        if (isActive) {
                          // If this is the currently active audio, remove it from store
                          removeAudio(storeAudios[0].id);
                        } else {
                          // Otherwise, apply (and remove any existing) audio
                          handleMediaClick(audioUrl, "audios");
                        }
                      }}
                      style={{
                        cursor: "pointer",
                        padding: "6px 10px",
                        backgroundColor: "#333",
                        color: "#fff",
                        borderRadius: "4px",
                        border: "none",
                      }}
                    >
                      {isActive ? "-" : "+"}
                    </button>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
});

// ----------------------------------------------
//  EXPORT FOR SIDE PANEL
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
  Panel: UploadSection,
};

export default UploadSectionWithAPI;
