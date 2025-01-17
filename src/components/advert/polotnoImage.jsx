import React, { useEffect, useRef, useState } from "react";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import toast from "react-hot-toast";

const POLNOTO_API_KEY = "nFA5H9elEytDyPyvKL7T"; // Replace with your Polotno API key

const PolotnoRenderInBackground = () => {
  const [store, setStore] = useState(null); // Polotno store
  const [imageURL, setImageURL] = useState(null); // For storing the generated image local URL
  const [loading, setLoading] = useState(false);
  const workspaceRef = useRef(null); // Reference to Workspace component

  const jsonTemplate = {
    width: 1080,
    height: 1080,
    pages: [
      {
        id: "page1",
        children: [
          {
            id: "image1",
            type: "image",
            src: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
            x: 0,
            y: 0,
            width: 1080,
            height: 1080,
          },
          {
            id: "text1",
            type: "text",
            text: "Renocare Plus",
            fontSize: 100,
            fontFamily: "Roboto",
            fill: "white",
            x: 100,
            y: 200,
            width: 880,
            height: 100,
            align: "center",
          },
          {
            id: "text2",
            type: "text",
            text: "20% Off",
            fontSize: 50,
            fontFamily: "Roboto",
            fill: "black",
            x: 300,
            y: 900,
            width: 400,
            height: 50,
            align: "center",
          },
        ],
        background: "white",
      },
    ],
    unit: "px",
    dpi: 72,
  };

  useEffect(() => {
    const initStore = () => {
      const newStore = createStore({ key: POLNOTO_API_KEY });
      newStore.loadJSON(jsonTemplate); // Load JSON into the store
      setStore(newStore);
    };

    initStore();
  }, []);

  const generateImage = async () => {
    if (!store) {
      toast.error("Store is not initialized.");
      return;
    }

    setLoading(true);
    try {
      // Ensure Workspace is rendered for export
      const base64Image = await store.toDataURL({
        pageId: store.pages[0].id,
        mimeType: "image/png",
        quality: 1,
      });

      if (base64Image) {
        const blob = await fetch(base64Image).then((res) => res.blob());
        const localURL = URL.createObjectURL(blob);
        setImageURL(localURL);
        toast.success("Image generated successfully!");
      } else {
        toast.error("Failed to generate image.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Error generating image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Polotno Background Render</h1>
      {loading ? (
        <p>Rendering image in the background...</p>
      ) : imageURL ? (
        <div>
          <img
            src={imageURL}
            alt="Generated Template"
            style={{ border: "1px solid #ccc", marginTop: "20px",
                height: "300px",
                width: "300px", }}
          />
          <a
            href={imageURL}
            download="rendered-template.png"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Download Image
          </a>
        </div>
      ) : (
        <p>No image rendered yet.</p>
      )}

      {/* Mount hidden Workspace */}
      {store && (
        <div
          ref={workspaceRef}
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            width: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
          <Workspace store={store} pageId={store.pages[0]?.id} />
        </div>
      )}

      <button
        onClick={generateImage}
        style={{
          display: "block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Generate Image
      </button>
    </div>
  );
};

export default PolotnoRenderInBackground;
