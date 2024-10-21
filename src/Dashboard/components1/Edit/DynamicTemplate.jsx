import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import domtoimage from 'dom-to-image';
import { FaTextHeight, FaShapes, FaUpload, FaImage, FaLayerGroup } from "react-icons/fa";
import { MdColorLens, MdAddCircle, MdZoomIn, MdZoomOut } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TextAdder from "./TextAdder";  // Text Adder Component
import Sidebar from "./Sidebar_Edit";      // Sidebar Component
import DesignMenu from "./DesignMenu"; // Design Menu Component

export default function DynamicCanvaTemplate() {
  const [elements, setElements] = useState([]); // All elements within a template
  const [selectedElementIndex, setSelectedElementIndex] = useState(null); // Selected element tracker
  const [nextElementId, setNextElementId] = useState(1);
  const [templates, setTemplates] = useState([[]]); // Multiple templates like Canva
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0); // Current active template
  const [zoom, setZoom] = useState(1); // Zoom level for the template area
  const [transparency, setTransparency] = useState(100); // Transparency control

  const templateRef = useRef();
  const navigate = useNavigate();

  // Function to add new text element
  const handleAddTextElement = () => {
    const newText = {
      id: `text-${nextElementId}`,
      type: "text",
      content: "New Text",
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      style: { fontSize: "20px", color: "#000", zIndex: elements.length + 1 },
    };
    setElements([...elements, newText]);
    setNextElementId(nextElementId + 1);
  };

  // Function to add shapes or SVGs dynamically
  const handleAddShape = (shape) => {
    const newShape = {
      id: `shape-${nextElementId}`,
      type: "shape",
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      style: { backgroundColor: shape.color || "#FF5733", zIndex: elements.length + 1 },
    };
    setElements([...elements, newShape]);
    setNextElementId(nextElementId + 1);
  };

  // Add a new empty template page
  const handleAddTemplate = () => {
    setTemplates([...templates, []]);
    setActiveTemplateIndex(templates.length); // Set the new template as active
  };

  // Handle zoom in and zoom out
  const handleZoom = (direction) => {
    setZoom((prevZoom) => (direction === "in" ? prevZoom + 0.1 : prevZoom - 0.1));
  };

  // Handle exporting template as PNG
  const handleExport = async () => {
    try {
      const node = templateRef.current;
      const dataUrl = await domtoimage.toPng(node);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'template.png';
      link.click();
    } catch (error) {
      console.error('Failed to export template:', error);
    }
  };

  // Handle dragging and resizing elements
  const handleDragStop = (e, d, index) => {
    const updatedElements = [...elements];
    updatedElements[index].position = { x: d.x / zoom, y: d.y / zoom };
    setElements(updatedElements);
  };

  const handleResize = (e, direction, ref, delta, index) => {
    const updatedElements = [...elements];
    updatedElements[index].size = { width: ref.offsetWidth / zoom, height: ref.offsetHeight / zoom };
    setElements(updatedElements);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex">
        <Sidebar
          handleAddTextElement={handleAddTextElement}
          handleAddShape={handleAddShape}
          handleAddTemplate={handleAddTemplate}
        />

        <div className="flex-1 relative">
          {/* Top Controls */}
          <div className="flex justify-end p-4 gap-4">
            <button onClick={() => navigate("/")} className="bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
            <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded">
              Export
            </button>
            <div className="flex items-center gap-2">
              <MdZoomOut size={24} onClick={() => handleZoom("out")} className="cursor-pointer" />
              <span>{Math.round(zoom * 100)}%</span>
              <MdZoomIn size={24} onClick={() => handleZoom("in")} className="cursor-pointer" />
            </div>
          </div>

          {/* Template Area */}
          <div
            ref={templateRef}
            className="border-2 border-gray-300 rounded-md overflow-hidden mx-4"
            style={{
              width: `${800 * zoom}px`,
              height: `${600 * zoom}px`,
              position: "relative",
              backgroundColor: "#fff",
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            {elements.map((element, index) => (
              <Rnd
                key={element.id}
                size={{ width: element.size.width, height: element.size.height }}
                position={{ x: element.position.x, y: element.position.y }}
                onDragStop={(e, d) => handleDragStop(e, d, index)}
                onResize={(e, direction, ref, delta) => handleResize(e, direction, ref, delta, index)}
                style={{ zIndex: element.style.zIndex, border: selectedElementIndex === index ? "1px solid blue" : "none" }}
              >
                {element.type === "text" ? (
                  <div
                    contentEditable
                    style={{ fontSize: element.style.fontSize, color: element.style.color }}
                    onClick={() => setSelectedElementIndex(index)}
                  >
                    {element.content}
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: element.style.backgroundColor,
                    }}
                  />
                )}
              </Rnd>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
