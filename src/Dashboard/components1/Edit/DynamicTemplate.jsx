import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import domtoimage from "dom-to-image";
import { MdZoomIn, MdZoomOut, MdFullscreen, MdAddCircle, MdGridView } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar_Edit"; // Your existing sidebar
import ImageUploadLayout from "./ImageUpload";
import AdCreatives from "./AdCreatives";
import ImageSearchLayout from "./ImageSearch";
import ShapeStyleLayout from "./Shapes";
import FramesComponent from "./Frames";
import ShapeWithSVG from "./ShapeWithSVG";
import DesignElements from "./DesignElements";
import OutlineElements from "./OutlineElements";
import GeometricalElements from "./GeometricalElements";
import ArrowElements from "./ArrowElements";
import StarElements from "./StarElements";
import BrushedElements from "./BrushedElements";
import RibbonElements from "./RibbonElements";
import LabelElements from "./LabelElements";
import BadgesShieldElements from "./BadgesShields";
import SpeechBubblesElements from "./SpeechBubbles";
import BlobElements from "./BlobElements";
import SunburstElements from "./SunburstHalftone";

import TextAdder from "./TextAdder"; // Import TextFormatToolbar
export default function DynamicCanvaTemplate() {
  const [elements, setElements] = useState([]);  
  const [nextElementId, setNextElementId] = useState(100);
  const [templates, setTemplates] = useState([[]]);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [zoom, setZoom] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [activeComponent, setActiveComponent] = useState(""); // Track active component from Sidebar
  const templateContainerRef = useRef(null);
  const activeTemplateRef = useRef(null); // Ref for the active template
  const navigate = useNavigate();

  const handleAddTemplate = () => {
    const newTemplate = [];
    setTemplates((prev) => [...prev, newTemplate]);
    setActiveTemplateIndex(templates.length);
    setElements(newTemplate);
  };

  const handleTemplateSelect = (index) => {
    setActiveTemplateIndex(index);
    setElements(templates[index] || []);

    // Switch to template view if in grid view
    if (isGridView) {
      setIsGridView(false);
    }

    // Scroll the selected template into the center
    setTimeout(() => {
      const templateElement = templateContainerRef.current?.children[index];
      if (templateElement) {
        templateElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  };


  const handleZoom = (direction) => {
    setZoom((prevZoom) =>
      direction === "in" ? prevZoom + 0.1 : Math.max(prevZoom - 0.1, 0.1)
    );
  };

  const handleFullscreenToggle = () => {
    if (activeTemplateRef.current) {
      if (!document.fullscreenElement) {
        activeTemplateRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
   // Function to handle activating a Sidebar component
   const handleSidebarComponent = (componentName) => {
    // Set the active component and reset any active design menu
    setActiveComponent(componentName);
  };

// Function to handle adding a new text element from TextAdder
const handleAddText = (newElement) => {
  newElement.id = `element${nextElementId}`;
  newElement.style = {
    ...newElement.style,
    color: "#082A66", // Set the text color to #082A66
    zIndex: templates[activeTemplateIndex].length + 1,
  };

  const updatedTemplates = [...templates];
  updatedTemplates[activeTemplateIndex] = [
    ...templates[activeTemplateIndex],
    newElement,
  ];

  setTemplates(updatedTemplates);
  setNextElementId((prevId) => prevId + 1); // Increment element ID
};


const handleAddImage = (imageUrl) => {
  const newImageElement = {
    type: 'image',
    src: imageUrl,
    position: { x: 50, y: 50 },
    size: { width: 200, height: 200 },
    style: { zIndex: templates[activeTemplateIndex].length + 1 },
  };

  const updatedTemplates = [...templates];
  updatedTemplates[activeTemplateIndex] = [...templates[activeTemplateIndex], newImageElement];
  setTemplates(updatedTemplates);
};

const handleAddShape = (shape) => {
  const uniqueId = `${shape.name}-${Date.now()}`;

  const newShapeElement = {
    type: 'shape',
    name: uniqueId,
    component: shape.component,
    position: { x: 50, y: 50 },
    size: { width: 200, height: 200 },
    style: {
      color: '#fff',
      backgroundColor: 'transparent',
      fontSize: '100px',
      zIndex: templates[activeTemplateIndex].length + 1,
    },
  };

  const updatedTemplates = [...templates];
  updatedTemplates[activeTemplateIndex] = [...templates[activeTemplateIndex], newShapeElement];
  setTemplates(updatedTemplates);
};

const handleAddSVG = (svg) => {
  const uniqueId = `${svg.name}-${Date.now()}`;

  const newSVGElement = {
    type: 'svg',
    name: uniqueId,
    component: svg.component,
    position: { x: 50, y: 50 },
    size: { width: 200, height: 200 },
    fillColor: '#082A66',
    style: {
      opacity: 1,
      zIndex: templates[activeTemplateIndex].length + 1,
    },
  };

  const updatedTemplates = [...templates];
  updatedTemplates[activeTemplateIndex] = [...templates[activeTemplateIndex], newSVGElement];
  setTemplates(updatedTemplates);
};

const handleFrameSelect = (frame) => {
  const uniqueId = `${frame.name}-${Date.now()}`; // Unique key generation

  const newFrameElement = {
    type: "frame",
    id: uniqueId,  // Add unique ID
    frameType: frame.name,
    position: { x: 50, y: 50 },
    size: { width: 300, height: 300 },
    style: { border: "2px solid #082A66", clipPath: frame.clipPath, zIndex: templates[activeTemplateIndex].length + 1 },
  };

  const updatedTemplates = [...templates];
  updatedTemplates[activeTemplateIndex] = [...updatedTemplates[activeTemplateIndex], newFrameElement];
  setTemplates(updatedTemplates);
};


  const handleDragStop = (e, d, index) => {
    const updatedElements = [...elements];
    updatedElements[index].position = { x: d.x / zoom, y: d.y / zoom };
    setElements(updatedElements);
  };

  const handleResize = (e, direction, ref, delta, index) => {
    const updatedElements = [...elements];
    updatedElements[index].size = {
      width: ref.offsetWidth / zoom,
      height: ref.offsetHeight / zoom,
    };
    setElements(updatedElements);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2]">
      <div
        className="m-2 border-2 border-white rounded-[20px] max-w-full relative overflow-hidden"
        style={{ height: "calc(100vh - 1rem)" }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-[rgba(252,252,252,0.40)] p-3 flex items-center gap-2 rounded-t-[20px]">
          <img src="/icon5.svg" alt="Icon" />
          <div className="flex flex-col">
            <h4 className="text-[#082A66] font-bold text-xl">Template Customization</h4>
            <p className="text-[#374151] text-sm">Customize your ad based on your preferences.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="absolute top-[80px] bottom-[68px] left-2 rounded-l-[20px]">
          <Sidebar setActiveComponent={handleSidebarComponent} setShowAdCreatives={() => { }}  />
         </div>
         <div className="absolute top-[80px] bottom-[68px] left-24 rounded-l-[20px] overflow-auto hide-scrollbar">
        
            {activeComponent === "Text" && (
                <div className="w-2/4 m-4 p-4 mt-1 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40]">
                  <TextAdder onAddText={handleAddText} />
                </div>
            )}
            {activeComponent === "Images" && (
                <div className="w-4/6 m-4 p-4 mt-1 mb-0 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar  bg-[#FCFCFC40]">
                  <ImageSearchLayout onSelectImage={handleAddImage} /> {/* Pass the handleAddImage callback */}
                </div>
              )}
              {activeComponent === "Shapes" && (
                <div className=" m-4 p-4 mt-1 mb-0 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <ShapeStyleLayout handleAddShape={handleAddShape} />
                  <DesignElements handleAddSVG={handleAddSVG} /> {/* Add ShapeWithSVG component */}
                  <ShapeWithSVG handleAddSVG={handleAddSVG} /> {/* Add ShapeWithSVG component */}
                  <OutlineElements handleAddSVG={handleAddSVG}/>
                  <GeometricalElements handleAddSVG={handleAddSVG}/>
                  <ArrowElements handleAddSVG={handleAddSVG}/>
                  <StarElements handleAddSVG={handleAddSVG}/>
                  <BrushedElements handleAddSVG={handleAddSVG}/>
                  <RibbonElements handleAddSVG={handleAddSVG}/>
                  <LabelElements handleAddSVG={handleAddSVG}/>
                  <BadgesShieldElements handleAddSVG={handleAddSVG}/>
                  <SpeechBubblesElements handleAddSVG={handleAddSVG}/>
                  <BlobElements handleAddSVG={handleAddSVG}/>
                  <SunburstElements handleAddSVG={handleAddSVG}/>
                </div>
              )}
              {activeComponent === "Frames" && (
                <div className="m-4 p-4 mt-1 mb-0 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <FramesComponent onSelectFrame={handleFrameSelect} />
                </div>
              )}
              {activeComponent === "Uploads" && (
                <div className="w-3/5 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <ImageUploadLayout onSelectImage={handleAddImage} /> {/* Pass the handleAddImage callback */}
                </div>
              )}
            </div>

        <div className="overflow-auto">
          <div className="flex-1 flex flex-col items-center justify-center ml-[7%] mt-[80px] mb-[80px]">
            {isGridView ? (
              <div className="grid grid-cols-3 gap-4 p-4 overflow-y-auto" style={{ height: "100%" }}>
                {templates.map((_, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-md p-4 cursor-pointer ${index === activeTemplateIndex ? "border-purple-500" : "border-gray-300"
                      }`}
                    onClick={() => handleTemplateSelect(index)}
                  >
                    <p className="text-center">{`Template ${index + 1}`}</p>
                  </div>
                ))}
                <div
                  className="border-2 border-dashed rounded-md p-4 flex items-center justify-center cursor-pointer"
                  onClick={handleAddTemplate}
                >
                  <MdAddCircle size={32} />
                </div>
              </div>
            ) : (
              <div
                ref={templateContainerRef}
                className="overflow-y-auto hide-scrollbar"
                style={{ maxHeight: "78vh" }}
              >
                {templates.map((template, index) => (
                  <div
                    key={index}
                    ref={index === activeTemplateIndex ? activeTemplateRef : null}
                    className={`border-2 rounded-md mb-4 ${index === activeTemplateIndex ? "border-purple-500" : "border-gray-300"
                      }`}
                    style={{
                      width: `${1080 * zoom}px`,
                      height: `${1080 * zoom}px`,
                      backgroundColor: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleTemplateSelect(index)}
                  >
                    {template.map((element, idx) => (
                      <Rnd
                        key={idx}
                        size={{
                          width: element.size.width,
                          height: element.size.height,
                        }}
                        position={{
                          x: element.position.x,
                          y: element.position.y,
                        }}
                        onDragStop={(e, d) => {
                          const updatedTemplate = [...template];
                          updatedTemplate[idx].position = {
                            x: d.x / zoom,
                            y: d.y / zoom,
                          };
                          const newTemplates = [...templates];
                          newTemplates[index] = updatedTemplate;
                          setTemplates(newTemplates);
                        }}
                        onResize={(e, direction, ref, delta) => {
                          const updatedTemplate = [...template];
                          updatedTemplate[idx].size = {
                            width: ref.offsetWidth / zoom,
                            height: ref.offsetHeight / zoom,
                          };
                          const newTemplates = [...templates];
                          newTemplates[index] = updatedTemplate;
                          setTemplates(newTemplates);
                        }}
                      >
                        {element.type === "text" ? (
                          <div
                            contentEditable
                            style={{ fontSize: element.style.fontSize, color: element.style.color }}
                          >
                            {element.content}
                          </div>
                        ) : element.type === "image" ? (
                          <img src={element.src} alt="Uploaded" style={{ width: "100%", height: "100%" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", ...element.style }} />
                        )}
                      </Rnd>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>



        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-[rgba(252,252,252,0.40)] p-2 flex justify-end items-center rounded-b-[20px]">
          <button
            onClick={handleAddTemplate}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <MdAddCircle size={20} /> Add Template
          </button>
          <button
            onClick={handleFullscreenToggle}
            className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2 mx-2"
          >
            <MdFullscreen size={20} /> {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button
            onClick={() => setIsGridView((prev) => !prev)}
            className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2"
          >
            <MdGridView size={20} /> {isGridView ? "Exit Grid" : "Grid View"}
          </button>
          <div className="flex items-center gap-2">
            <MdZoomOut size={24} onClick={() => handleZoom("out")} className="cursor-pointer" />
            <span>{Math.round(zoom * 100)}%</span>
            <MdZoomIn size={24} onClick={() => handleZoom("in")} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
