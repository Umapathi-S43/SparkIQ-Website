import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

// Polotno
import { SectionTab } from "polotno/side-panel";
import { ImagesGrid } from "polotno/side-panel/images-grid";
import { selectImage } from "polotno/side-panel/select-image";
import { selectVideo } from "polotno/side-panel/select-video";

// Your baseUrl, JWT token, etc.
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";

// Example brandId, if needed for brand elements:
const brandId = "sib-6ff0412c-1";

// Endpoints
const VIDEOS_URL = "http://dev.api.sparkiq.ai/v2/user/upload/videos";
const AUDIOS_URL = "http://dev.api.sparkiq.ai/v2/user/upload/audios";
const BRAND_ELEMENTS_URL = `http://dev.api.sparkiq.ai/v2/api/brands/${brandId}/brandelements`;

//
// ----------------------------------------------
//  SUB TAB CSS
// ----------------------------------------------
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

//
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

//
// ----------------------------------------------
//  UPLOAD SECTION
// ----------------------------------------------
const UploadSection = observer(({ store, isDarkMode = false }) => {
    // Our local state for media
    const [uploadedMedia, setUploadedMedia] = useState({
        photos: [],  // array of image URLs
        audios: [],  // array of audio URLs
        videos: [],  // array of video objects
    });
    const [isUploading, setIsUploading] = useState(false);

    // The sub-tabs: "photos", "audios", "videos", etc.
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

    //
    // ----------------------------------------------
    //  HELPER: DETERMINE FILE "TYPE" VIA EXTENSION
    // ----------------------------------------------
    const getFileTypeByExtension = (url) => {
        const ext = url.split(".").pop().toLowerCase();
        // Very basic checks. Adjust as needed.
        if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
        if (["mp4", "mov", "avi", "wmv", "mkv"].includes(ext)) return "video";
        if (["mp3", "wav", "ogg", "aac", "m4a"].includes(ext)) return "audio";
        return "unknown";
    };

    //
    // ----------------------------------------------
    //  FETCH EXISTING DATA ON MOUNT
    // ----------------------------------------------
    useEffect(() => {
        const fetchAllMedia = async () => {
            try {
                // 1) Fetch videos
                // 2) Fetch audios
                // 3) Fetch brand elements
                const [videosRes, audiosRes, brandElementsRes] = await Promise.all([
                    axios.get(VIDEOS_URL, {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }),
                    axios.get(AUDIOS_URL, {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }),
                    axios.get(BRAND_ELEMENTS_URL, {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }),
                ]);

                // The actual media arrays are inside `response.data.data` from your examples:
                const videosData = videosRes?.data?.data || [];
                const audiosData = audiosRes?.data?.data || [];
                const brandElementsData = brandElementsRes?.data?.data || [];

                // --------------------------
                // Videos
                // from "video" endpoint:
                //  [ { "id": 7, "url": "...", "name": "...", "type": "VIDEO", "userId": "..."} ]
                // We'll transform them to polotno-friendly objects:
                const fetchedVideos = videosData
                    .filter((item) => item.type === "VIDEO")
                    .map((item, index) => ({
                        id: `video-${item.id || index}`,
                        url: item.url,
                        video_files: [{ quality: "hd", link: item.url }],
                        width: 800,
                        height: 450,
                    }));

                // --------------------------
                // Audios
                // from "audio" endpoint:
                //  [ { "id": 4, "url": "...", "name": "...", "type": "AUDIO", "userId": "..."} ]
                // We'll store as array of URLs
                const fetchedAudios = audiosData
                    .filter((item) => item.type === "AUDIO")
                    .map((item) => item.url);

                // --------------------------
                // Brand elements
                //  [ { "id": "sibbe-...", "name": "...", "url": "...", "brandId": null }, ... ]
                // Some might be images, some might be mp3, some might be videos, etc.
                const brandPhotos = [];
                const brandAudios = [];
                const brandVideos = [];

                brandElementsData.forEach((elem) => {
                    const fileType = getFileTypeByExtension(elem.url);
                    if (fileType === "image") {
                        brandPhotos.push(elem.url);
                    } else if (fileType === "audio") {
                        brandAudios.push(elem.url);
                    } else if (fileType === "video") {
                        brandVideos.push({
                            id: `brand-video-${elem.id}`,
                            url: elem.url,
                            video_files: [{ quality: "hd", link: elem.url }],
                            width: 800,
                            height: 450,
                        });
                    }
                });

                // Combine brand stuff with the existing arrays
                const allPhotos = [...brandPhotos];
                const allAudios = [...brandAudios];
                const allVideos = [...brandVideos];

                // Merge them with data from the dedicated audio/video endpoints
                // (If you want them truly separate, skip this merging)
                const finalPhotos = allPhotos; // brand elements only
                const finalAudios = [...fetchedAudios, ...allAudios];
                const finalVideos = [...fetchedVideos, ...allVideos];

                // Set local state
                setUploadedMedia({
                    photos: finalPhotos,
                    audios: finalAudios,
                    videos: finalVideos,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAllMedia();
    }, []);

    //
    // ----------------------------------------------
    //  HANDLE FILE UPLOAD
    // ----------------------------------------------
    const handleFileUpload = async (file, type) => {
        if (!file) return;
        setIsUploading(true);

        try {
            // 1) Upload file to get a URL
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

            // Validate
            if (!response?.data?.data?.url) {
                throw new Error("Invalid response from upload server.");
            }
            const fileUrl = response.data.data.url;

            // 2) If it's a photo, also post to brandElements
            if (type === "photos") {
                const brandPostBody = {
                    name: file.name, // or any label
                    url: fileUrl,
                    brandId: brandId, // or null if not needed
                };

                await axios.post(BRAND_ELEMENTS_URL, brandPostBody, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                // Then update local state
                setUploadedMedia((prev) => ({
                    ...prev,
                    photos: [...prev.photos, fileUrl],
                }));
            }
            // 3) If it's a video, store custom object
            else if (type === "videos") {
                // In your backend, you might also want to `POST` to the /videos endpoint
                // if you need it to appear for other users. If so, do that here:
                //    await axios.post(VIDEOS_URL, { url: fileUrl, type: "VIDEO", ...});
                // Or do it only if your API demands it.

                setUploadedMedia((prev) => ({
                    ...prev,
                    videos: [
                        ...prev.videos,
                        {
                            id: `video-${prev.videos.length + 1}`,
                            url: fileUrl,
                            video_files: [{ quality: "hd", link: fileUrl }],
                            width: 800,
                            height: 450,
                        },
                    ],
                }));
            }
            // 4) If it's audio, update local array
            else if (type === "audios") {
                // Similarly, you might do:
                //   await axios.post(AUDIOS_URL, { url: fileUrl, type: "AUDIO", ... });
                // if your API requires that.

                setUploadedMedia((prev) => ({
                    ...prev,
                    audios: [...prev.audios, fileUrl],
                }));
            }

            toast.success(
                `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully.`
            );
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    // For debugging
    useEffect(() => {
        console.log("Updated uploadedMedia:", uploadedMedia);
    }, [uploadedMedia]);

    //
    // ----------------------------------------------
    //  REMOVE AUDIO FROM STORE
    // ----------------------------------------------
    const removeAudio = (audioId) => {
        store.removeAudio(audioId);
        refreshStoreAudios();
    };

    //
    // ----------------------------------------------
    //  RENDER TAB CONTENT
    // ----------------------------------------------
    const renderTabContent = () => {
        //
        //  PHOTOS TAB
        //
        if (activeTab === "photos") {
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

        //
        //  AUDIOS TAB
        //
        if (activeTab === "audios") {
            return (
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

        //
        //  VIDEOS TAB
        //
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
                            key={video.id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                overflow: "hidden",
                                cursor: "pointer",
                                position: "relative",
                            }}
                            onClick={() => {
                                selectVideo({
                                    src: video.url,
                                    store,
                                    droppedPos: { x: 600, y: 400 },
                                    targetElement: null,
                                    attrs: {
                                        width: 800,
                                        height: 450,
                                    },
                                });
                                toast.success("Video added to workspace.");
                            }}
                        >
                            <video
                                src={video.url}
                                style={{ width: "100%", height: "auto" }}
                                controls={false}
                                onError={(e) => {
                                    const fallbackUrl = `http://dev.api.sparkiq.ai/sparkiq/image/download/${video.url.split('/').pop()}`;
                                    if (e.target.src !== fallbackUrl) {
                                        e.target.src = fallbackUrl;
                                        e.target.load();
                                    } 
                                }}
                            />
                        </div>
                    ))}
                </div>
            );
        }


        // Placeholder if you have an "AI" tab
        if (activeTab === "ai") {
            return (
                <div style={{ marginTop: 20 }}>
                    <p>No AI content available.</p>
                </div>
            );
        }
    };

    //
    // ----------------------------------------------
    //  UI RENDER
    // ----------------------------------------------
    const containerStyle = {
        padding: "10px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
    };

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
                    className={`polotno-sub-tab ${activeTab === "photos" ? "is-active" : ""
                        }`}
                    onClick={() => setActiveTab("photos")}
                >
                    Photos
                </div>
                <div
                    className={`polotno-sub-tab ${activeTab === "audios" ? "is-active" : ""
                        }`}
                    onClick={() => setActiveTab("audios")}
                >
                    Audio
                </div>
                <div
                    className={`polotno-sub-tab ${activeTab === "videos" ? "is-active" : ""
                        }`}
                    onClick={() => setActiveTab("videos")}
                >
                    Video
                </div>
                {/* 
          If you have an AI tab, you'd add it here:
          <div ...>AI</div>
        */}
            </div>

            {/* Upload button (hide for AI tab if you want) */}
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

//
// ----------------------------------------------
//  WRAPPER FOR POLOTNO SIDE PANEL
// ----------------------------------------------
const UploadPanelEditor = {
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

export default UploadPanelEditor;
