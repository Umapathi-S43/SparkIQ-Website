import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

// Polotno
import { SectionTab } from "polotno/side-panel";

// Suppose you have these helpers in your codebase:
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { VideosGrid } from "polotno/side-panel/videos-grid";
import { selectImage } from "polotno/side-panel/select-image";
import { selectVideo } from "polotno/side-panel/select-video";

// Your baseUrl, JWT token, etc.
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

const getSubTabStyles = (isDarkMode) => `
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
  color: #106ba3; /* same hover color for both themes */
}
.polotno-sub-tab.is-active {
  border-color: #106ba3;
}
`;

// ----------------------------------------------
//  SPINNER COMPONENT
// ----------------------------------------------
const Spinner = () => (
    <div className="spinner-container">
        <div className="spinner" />
        <style>{`
      .spinner-container {
        display: flex;
        justify-content: center;
        margin-top: 10px;
      }
      .spinner {
        width: 30px;
        height: 30px;
        border: 4px solid #ccc;
        border-top: 4px solid #106ba3;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    </div>
);

/**
 * UploadSection
 * -------------
 * @param {Object} props
 * @param {StoreType} props.store  - Polotno store
 * @param {boolean} [props.isDarkMode=false] - If true, show dark theme
 */
const UploadSection = observer(({ store, isDarkMode = false }) => {
    // Our media object
    const [uploadedMedia, setUploadedMedia] = useState({
        photos: [],
        audios: [],
        videos: [],
    });
    const [isUploading, setIsUploading] = useState(false);

    // The sub-tabs: "photos" | "audio" | "ai" | "video"
    const [activeTab, setActiveTab] = useState("photos");

    // For audio: only one track in store at a time
    const [storeAudios, setStoreAudios] = useState([]);

    // Watch store for changes in audio
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
            uploadData.append("customerId", "123"); // example customer ID

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

            // Ensure response contains the expected data
            if (!response.data || !response.data.data || !response.data.data.url) {
                throw new Error("Invalid response from server.");
            }

            const fileUrl = response.data.data.url;


            // If it's a video, use the custom object structure
            if (type === "videos") {
                setUploadedMedia((prev) => ({
                    ...prev,
                    videos: [
                        ...prev.videos,
                        {
                            id: `video-${prev.videos.length}`,
                            url: fileUrl,
                            video_files: [{ quality: "hd", link: fileUrl }],
                            width: 800,
                            height: 450,
                        },
                    ],
                }));
            }
            // Otherwise, just push the file URL to the existing array
            else {
                setUploadedMedia((prev) => ({
                    ...prev,
                    [type]: [...(prev[type] || []), fileUrl],
                }));
            }


            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully.`);
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(`Failed to upload ${type}. Please try again.`);
        } finally {
            setIsUploading(false);
        }
    };
    useEffect(() => {
        console.log("Updated uploadedMedia:", uploadedMedia);
    }, [uploadedMedia]);

    useEffect(() => {
        console.log("Formatted video data for VideosGrid:", uploadedMedia.videos.map((url, index) => ({
            id: `video-${index}`,
            url: url,
            video_files: [{ quality: "hd", link: url }],
            width: 800,
            height: 850,
        })));
    }, [uploadedMedia.videos]);


    // ----------------------------------------------
    //  REMOVE AUDIO FROM STORE
    // ----------------------------------------------
    const removeAudio = (audioId) => {
        store.removeAudio(audioId);
        refreshStoreAudios();
        toast.success("Audio removed from design.");
    };

    // ----------------------------------------------
    //  RENDER TAB CONTENT
    // ----------------------------------------------
    const renderTabContent = () => {
        if (activeTab === "photos") {
            // Photos
            return (
                <div style={{ marginTop: 20, flex: 1, overflow: "auto" }}>
                    <ImagesGrid
                        images={uploadedMedia.photos.map((url) => ({ url }))}
                        getPreview={(item) => item.url}
                        onSelect={async (item, pos, element) => {
                            selectImage({
                                src: item.url,
                                store,
                                droppedPos: pos,
                                targetElement: element,
                            });
                        }}
                        isLoading={false}
                        loadMore={false}
                        error={null}
                    />
                </div>
            );
        }

        if (activeTab === "videos") {
            return (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                        overflowY: "auto",
                        maxHeight: "100vh",
                        marginTop: 20,
                    }}
                >
                    {uploadedMedia.videos.map((video, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                overflow: "hidden",
                                cursor: "pointer",
                                position: "relative",
                            }}
                            onSelect={async (item, pos, element) => {
                                selectImage({
                                    src: item.url,
                                    store,
                                    droppedPos: pos,
                                    targetElement: element,
                                });
                            }}
                            onClick={() => {
                                selectVideo({
                                    src: video.url,
                                    store,
                                    droppedPos: { x: 600, y: 400 }, // Default position
                                    targetElement: null,
                                    attrs: {
                                        width: 800,
                                        height: 850,
                                    },
                                });
                                toast.success("Video added to workspace.");
                            }}
                        >
                            <video
                                src={video.url}
                                style={{ width: "100%", height: "auto" }}

                            />
                        </div>
                    ))}
                </div>
            );
        }


        if (activeTab === "audios") {
            // Audios
            return (
                <div style={{ marginTop: 20 }}>
                    <h4>Uploaded Audios</h4>
                    <p style={{ fontSize: "12px" }}>(Click an item to apply it to the design)</p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: "10px",
                            overflowY: "auto",
                            maxHeight: "55vh",
                        }}
                    >
                        {uploadedMedia.audios.map((audioUrl, idx) => {
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
                                    <audio src={audioUrl} controls style={{ width: "100%" }} />
                                    <button
                                        onClick={() => {
                                            if (isActive) {
                                                removeAudio(storeAudios[0].id);
                                            } else {
                                                // remove any existing audios
                                                store.audios.forEach((audioItem) =>
                                                    store.removeAudio(audioItem.id)
                                                );
                                                // add new
                                                store.addAudio({
                                                    src: audioUrl,
                                                    volume: 1,
                                                    delay: 0,
                                                    startTime: 0,
                                                    endTime: 9999,
                                                    custom: { edit: true, variable: "{audio1}" },
                                                });
                                                toast.success("Audio added to store.");
                                                refreshStoreAudios();
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
                        })}
                    </div>
                </div>
            );
        }

        if (activeTab === "ai") {
            // AI
            return (
                <div style={{ marginTop: 20 }}>
                    <p>No AI content available.</p>
                </div>
            );
        }
    };

    // Dynamically compute styles based on theme
    const containerStyle = {
        padding: "10px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent", // optional BG
    };

    // Upload button style
    const uploadButtonStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        backgroundColor: isDarkMode ? "#333" : "#ddd",
        color: isDarkMode ? "#fff" : "#000",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: 10,
    };

    // Decide file accept attribute
    let acceptAttr = "";
    if (activeTab === "photos") acceptAttr = "image/*";
    else if (activeTab === "audios") acceptAttr = "audio/*";
    else if (activeTab === "videos") acceptAttr = "video/*";

    return (
        <div style={containerStyle}>
            <h3 style={{ marginBottom: "10px" }}>
                Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>

            {/* Inject dynamic sub-tab CSS based on isDarkMode */}
            <style>{getSubTabStyles(isDarkMode)}</style>

            {/* Sub-tabs */}
            <div className="polotno-sub-tabs">
                <div
                    className={`polotno-sub-tab ${activeTab === "photos" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("photos")}
                >
                    Photos
                </div>
                <div
                    className={`polotno-sub-tab ${activeTab === "audios" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("audios")}
                >
                    Audio
                </div>
                <div
                    className={`polotno-sub-tab ${activeTab === "videos" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("videos")}
                >
                    Video
                </div>
            </div>

            {/* Upload button (hide for AI tab) */}
            {activeTab !== "ai" && (
                <>
                    <label htmlFor="fileUpload" style={uploadButtonStyle}>
                        <FaCloudUploadAlt style={{ marginRight: "8px" }} />
                        Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        accept={acceptAttr}
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                handleFileUpload(e.target.files[0], activeTab);
                            }
                        }}
                        style={{ display: "none" }}
                    />
                </>
            )}

            {isUploading && <Spinner />}

            {/* Render the content for whichever tab is active */}
            {renderTabContent()}
        </div>
    );
});

const UploadPanel = {
    name: "upload-api",
    Tab: (props) => (
        <SectionTab name="Upload" {...props}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                <FaCloudUploadAlt />
            </div>
        </SectionTab>
    ),
    Panel: UploadSection,
};

export default UploadPanel;
