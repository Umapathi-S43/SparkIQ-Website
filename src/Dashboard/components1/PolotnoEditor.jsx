import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createStore } from "polotno/model/store";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel, SectionTab } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { observer } from "mobx-react-lite"; // Required for custom section
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/ri";
import { SiAffinitydesigner } from "react-icons/si";

import {
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
  TemplatesSection,
} from "polotno/side-panel"; // Import all necessary sections
import FaShapes from "@meronex/icons/fa/FaShapes"; // Icon for custom section
import "./PolotnoEditor.css";

// Create Polotno store
const store = createStore({
  key: "nFA5H9elEytDyPyvKL7T", // Replace with your Polotno API key
  showCredit: true,
});

// Define color palettes
const colorPalettes = [
  { id: 1, colors: ["#FF5733", "#33FF57", "#3357FF", "#FFF033"] },
  { id: 2, colors: ["#FF33A8", "#33FFF5", "#FF9133", "#F5FF33"] },
  { id: 3, colors: ["#A833FF", "#33A8FF", "#FF3333", "#33FF91"] },
  { id: 4, colors: ["#FF7F50", "#4682B4", "#6A5ACD", "#00CED1"] },
];

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
    const [activeTab, setActiveTab] = useState("palettes");

    // Apply palette colors to the elements permanently on click
   const applyPalette = (palette) => {
  if (palette.colors.length < 3) {
    console.warn("Palette must have at least three colors.");
    return;
  }

  const [svgColor, backgroundColor, textColor] = palette.colors;

  const activePage = store.activePage; // Get the active page
  if (!activePage) {
    console.warn("No active page found.");
    return;
  }

  // Update the background of the active page
  activePage.set({
    background: backgroundColor,
    width: "auto", // Retain the existing structure
    height: "auto", // Retain the existing structure
    bleed: activePage.bleed || 0, // Preserve existing bleed
  });

  // Update child elements
  activePage.children.forEach((child) => {
    if (child.type === "svg") {
      applyColorsReplace(child, child.colorsReplace);
    }else if (child.type === "text") {
      // Apply the third color to text elements
      child.set({ fill: textColor });
    }
  });

  store.history.save(); // Save the changes
};

const applyColorsReplace = (svgElement, colorsReplace) => {
  if (!svgElement || !colorsReplace) return;

  Object.entries(colorsReplace).forEach(([originalColor, newColor]) => {
    if (svgElement.colorsReplace) {
      svgElement.colorsReplace[originalColor] = newColor;
    } else {
      svgElement.set({
        colorsReplace: {
          ...svgElement.colorsReplace,
          [originalColor]: newColor,
        },
      });
    }
  });

  // Trigger a redraw of the element to reflect changes
  svgElement.trigger("change");
};



    // Apply palette colors to the elements on hover
    const handlePaletteHover = (palette) => {
      if (!palette || palette.colors.length < 3) {
        console.warn("Palette must have at least three colors.");
        return;
      }
    
      const [svgColor, backgroundColor, textColor] = palette.colors;
    
      store.pages.forEach((page) => {
        // Update the page's background color
        page.set({
          backgroundColor: backgroundColor,
        });
        const activePage = store.activePage; // Get the active page
        if (!activePage) {
          console.warn("No active page found.");
          return;
        }
      
        // Update the background of the active page
        activePage.set({
          background: backgroundColor,
          width: "auto", // Retain the existing structure
          height: "auto", // Retain the existing structure
          bleed: activePage.bleed || 0, // Preserve existing bleed
        });
    
        // Update child elements
        page.children.forEach((child) => {
          if (child.type === "svg") {
            child.set({ fill: svgColor });
          } else if (child.type === "text") {
            child.set({ fill: textColor });
          }
        });
      });
    };
    
    

    // Clear hover effect when the mouse leaves
    const clearHoverEffect = () => {
      store.history.undo();
    };

    return (
      <div style={{ padding: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() => setActiveTab("palettes")}
            style={{
              padding: "8px 16px",
              marginRight: "8px",
              cursor: "pointer",
              backgroundColor: activeTab === "palettes" ? "#007BFF" : "#e0e0e0",
              color: activeTab === "palettes" ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Palettes
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: activeTab === "templates" ? "#007BFF" : "#e0e0e0",
              color: activeTab === "templates" ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Templates
          </button>
        </div>

        {activeTab === "palettes" && (
          <div>
            <h3>Choose a Palette</h3>
  {colorPalettes.map((palette) => (
    <div
      key={palette.id}
      onMouseOver={() => handlePaletteHover(palette)} // Apply palette on hover
      onMouseOut={clearHoverEffect} // Clear hover effect on mouse out
      onClick={() => applyPalette(palette)} // Apply palette permanently on click
      style={{
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        border: "1px solid #ccc",
        marginBottom: "8px",
      }}
    >
      {palette.colors.map((color, index) => (
        <div
          key={index}
          style={{
            width: "90px",
            height: "30px",
            backgroundColor: color,
          }}
        
                  ></div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "templates" && (
          <div>
            <h3>Templates Section</h3>
            <p>Here you can add templates functionality or display templates.</p>
          </div>
        )}
      </div>
    );
  }),
};



// Combine default sections with the custom section
const sections = [
  CustomSection,
  TemplatesSection,
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  LayersSection,
  SizeSection,
  
];


const PolotnoEditor = () => {
  const { state } = useLocation();
  const templateData = state?.templateData;

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const saveAsJSON = () => {
    const json = store.toJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template.json";
    link.click();
  };

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
  const applyPalette = (palette) => {
    if (palette.colors.length < 3) {
      console.warn("Palette must have at least three colors.");
      return;
    }
  
    const [svgColor, backgroundColor, textColor] = palette.colors;
  
    const activePage = store.activePage; // Get the active page
    if (!activePage) {
      console.warn("No active page found.");
      return;
    }
  
    // Update the background of the active page
    activePage.set({
      background: backgroundColor,
      width: "auto", // Retain the existing structure
      height: "auto", // Retain the existing structure
      bleed: activePage.bleed || 0, // Preserve existing bleed
    });
  
    // Update child elements
    activePage.children.forEach((child) => {
      if (child.type === "svg") {
        // Apply the first color to SVG elements
        child.set({
          fill: svgColor,
        });
      } else if (child.type === "text") {
        // Apply the third color to text elements
        child.set({
          fill: textColor,
        });
      }
    });
  
    store.history.save(); // Save the changes
  };
  
  
  

  const generateThumbnail = async () => {
    try {
      const dataURL = await store.toDataURL({
        pixelRatio: 1,
        mimeType: "image/png",
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "thumbnail.png";
      link.click();
      alert("Thumbnail generated successfully!");
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      alert("An error occurred while generating the thumbnail.");
    }
  };

  const handlePaletteHover = (palette) => {
    applyPalette(palette); // Temporarily apply the palette on hover
  };

  const handlePaletteClick = (palette) => {
    applyPalette(palette);
    setSelectedPalette(palette); // Persist the selected palette
    setDropdownVisible(false);
    store.history.save(); // Save the changes
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }

    if (templateData) {
      store.loadJSON(templateData);
    } else {
      console.warn("No template data provided. Adding a default page.");
      store.addPage();
    }
  }, [templateData]);

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
          onClick={saveAsJSON}
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
          Save Template as JSON
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
          onClick={generateThumbnail}
          style={{
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            padding: "4px 16px",
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        >
          Generate Thumbnail
        </button>
        <div style={{ display: "inline-block", position: "relative" }}>
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)}
            style={{
              padding: "4px 16px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            Select Palette{" "}
            {dropdownVisible ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
          </button>
          {dropdownVisible && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                border: "1px solid #ccc",
                borderRadius: "5px",
                zIndex: 10,
                width: "110px",
                maxHeight: "300px",
                marginTop: "8px",
                backgroundColor: "#fff",
                overflowY: "auto",
              }}
            >
              {colorPalettes.map((palette) => (
                <div
                  key={palette.id}
                  onMouseOver={() => handlePaletteHover(palette)}
                  onClick={() => handlePaletteClick(palette)}
                  style={{
                    display: "flex",
                    gap: "4px",
                    padding: "8px",
                    cursor: "pointer",
                    alignItems: "center",
                    border:
                      selectedPalette?.id === palette.id
                        ? "2px solid #007BFF"
                        : "1px solid #ccc",
                    borderRadius: "5px",
                    marginBottom: "4px",
                  }}
                >
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: color,
                        borderRadius: "3px",
                      }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
    className="close"
    onClick={() => window.history.back()} // Or any close action
    style={{
      position: "absolute", // Position relative to the parent container
      top: "-2px", // Distance from the top
      right: "1px", // Distance from the right
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

      <PolotnoContainer style={{ width: "100vw", height: "90vh" }}>
        <SidePanelWrap>
          {/* Include default and additional sections */}
          <SidePanel store={store} sections={sections} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} downloadButtonEnabled />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default PolotnoEditor;
