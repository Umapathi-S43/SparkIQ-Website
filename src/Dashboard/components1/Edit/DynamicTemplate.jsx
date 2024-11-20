import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import {
  MdZoomIn,
  MdZoomOut,
  MdFullscreen,
  MdAddCircle,
  MdGridView,
  MdRotateLeft,
  MdUndo,
  MdRedo,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar_Edit"; // Your existing sidebar
import TextAdder from "./TextAdder";
import ImageUploadLayout from "./ImageUpload";
import ImageSearchLayout from "./ImageSearch";
import ShapeStyleLayout from "./Shapes";
import FramesComponent from "./Frames";
import DesignElements from "./DesignElements";
import OutlineElements from "./OutlineElements";
import StarElements from "./StarElements";
import BlobElements from "./BlobElements";
import SunburstElements from "./SunburstHalftone";

export default function DynamicCanvaTemplate() {
  const [elements, setElements] = useState([]);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [templates, setTemplates] = useState([[]]);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [zoom, setZoom] = useState(0.5);
  const [previousZoom, setPreviousZoom] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [activeComponent, setActiveComponent] = useState("");
  const [editingTextIndex, setEditingTextIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const templateContainerRef = useRef(null);
  const templateRef = useRef(null);
  const elementRefs = useRef([]);
  const navigate = useNavigate();

  const CANVAS_SIZE = 1080; // Default canvas size

  // Undo and Redo Functions
  const handleUndo = () => {
    if (history.length > 0) {
      const previousElements = history[history.length - 1];
      setHistory(history.slice(0, history.length - 1));
      setFuture([elements, ...future]);
      setElements(previousElements);
      setSelectedElementIndex(null);
    }
  };

  const handleRedo = () => {
    if (future.length > 0) {
      const nextElements = future[0];
      setFuture(future.slice(1));
      setHistory([...history, elements]);
      setElements(nextElements);
      setSelectedElementIndex(null);
    }
  };

  // Update Elements with History
  const updateElements = (newElements) => {
    setHistory([...history, elements]);
    setElements(newElements);
    setFuture([]);
  };

  // Handle Deletion of Elements
  const handleDeleteElement = () => {
    if (selectedElementIndex !== null) {
      updateElements(elements.filter((_, index) => index !== selectedElementIndex));
      setSelectedElementIndex(null);
    }
  };

  // Keydown Event Listener for Deleting Elements and Undo/Redo
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isDeleteKey =
        event.key === "Delete" ||
        (event.key === "Backspace" && event.target === document.body);

      if (isDeleteKey && selectedElementIndex !== null) {
        handleDeleteElement();
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

      // Undo (Ctrl+Z or Command+Z)
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();
        handleUndo();
        return;
      }

      // Redo (Ctrl+Y or Command+Shift+Z)
      if (
        ((event.ctrlKey && event.key.toLowerCase() === "y") && !isMac) ||
        ((event.metaKey && event.shiftKey && event.key.toLowerCase() === "z") &&
          isMac)
      ) {
        event.preventDefault();
        handleRedo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementIndex, elements, history, future]);

  const handleAddText = (newElement) => {
    newElement.id = `text-${Date.now()}`;
    newElement.style = {
      ...newElement.style,
      color: "#082A66",
      zIndex: elements.length + 1,
    };
    updateElements([...elements, newElement]);
  };

  const handleAddImage = (imageUrl) => {
    const newImage = {
      type: "image",
      id: `image-${Date.now()}`,
      src: imageUrl,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 200 },
      style: { zIndex: elements.length + 1 },
    };
    updateElements([...elements, newImage]);
  };

  const handleAddSVG = (svgContent, name) => {
    const newSVGElement = {
      type: "svg",
      id: `svg-${Date.now()}`,
      name: name,
      component: svgContent,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 200 },
      fillColor: "#082A66",
      style: {
        opacity: 1,
        zIndex: elements.length + 1,
      },
    };
    updateElements([...elements, newSVGElement]);
  };

  const handleAddShape = (shape) => {
    const uniqueId = `${shape.name}-${Date.now()}`;
    const newShapeElement = {
      type: "shape",
      id: uniqueId,
      component: shape.component,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 200 },
      style: {
        color: "#fff",
        backgroundColor: "transparent",
        fontSize: "100px",
        zIndex: elements.length + 1,
      },
    };
    updateElements([...elements, newShapeElement]);
  };

  const handleFrameSelect = (frame) => {
    const uniqueId = `${frame.name}-${Date.now()}`;
    const newFrameElement = {
      type: "frame",
      id: uniqueId,
      frameType: frame.name,
      position: { x: 50, y: 50 },
      size: { width: 300, height: 300 },
      style: {
        border: "2px solid #082A66",
        clipPath: frame.clipPath,
        zIndex: elements.length + 1,
      },
      content: null,
    };
    updateElements([...elements, newFrameElement]);
  };

  const handleElementDragStop = (e, d, index) => {
    const updatedElements = [...elements];
    updatedElements[index].position = { x: d.x / zoom, y: d.y / zoom };
    updateElements(updatedElements);
  };

  const handleElementResize = (e, direction, ref, delta, index) => {
    const updatedElements = [...elements];
    updatedElements[index].size = {
      width: ref.offsetWidth / zoom,
      height: ref.offsetHeight / zoom,
    };
    updateElements(updatedElements);
  };

  const handleZoomChange = (e) => {
    setZoom(e.target.value / 100);
  };

  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  const enterFullscreen = () => {
    if (templateRef.current) {
      templateRef.current.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // Listen to fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
        adjustZoomForFullscreen();
      } else {
        setIsFullscreen(false);
        // Restore the previous zoom level
        setZoom(previousZoom);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [previousZoom]);

  // Adjust zoom for fullscreen
  const adjustZoomForFullscreen = () => {
    // Store the previous zoom level
    setPreviousZoom(zoom);

    // Calculate new zoom level to fit the canvas to the screen
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const widthRatio = screenWidth / CANVAS_SIZE;
    const heightRatio = screenHeight / CANVAS_SIZE;

    const newZoom = Math.min(widthRatio, heightRatio);

    setZoom(newZoom);
  };

  // Handle window resize in fullscreen
  useEffect(() => {
    const handleResize = () => {
      if (isFullscreen) {
        adjustZoomForFullscreen();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isFullscreen]);

  const handleSidebarComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleDoubleClickText = (index) => {
    setEditingTextIndex(index);
    setSelectedElementIndex(index);
  };

  const handleTextChange = (e, index) => {
    const newElements = [...elements];
    newElements[index].content = e.target.textContent;
    updateElements(newElements);
  };

  const handleTextBlur = (index, e) => {
    setEditingTextIndex(null);
    const newElements = [...elements];
    newElements[index].content = e.target.textContent;
    updateElements(newElements);
  };

  const handleImageDrop = (e, frameIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedIndex = e.dataTransfer.getData("application/element-index");

    if (draggedIndex !== "") {
      const draggedElement = elements[parseInt(draggedIndex)];

      if (draggedElement?.type === "image") {
        const newElements = [...elements];
        if (newElements[frameIndex].type === "frame") {
          newElements[frameIndex].content = draggedElement.src;
          newElements.splice(parseInt(draggedIndex), 1); // Remove the dragged image
          updateElements(newElements);
        }
      }
    } else if (e.dataTransfer.files.length > 0) {
      // Handle external file drop
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const newElements = [...elements];
        if (newElements[frameIndex]?.type === "frame") {
          newElements[frameIndex].content = event.target.result;
          updateElements(newElements);
        }
      };

      reader.readAsDataURL(file);
    } else {
      console.error("Invalid drop operation.");
    }
  };

  const handleRotationDragStart = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const element = elements[index];
    const elementNode = elementRefs.current[index]?.resizableElement?.current;
    if (!elementNode) return;

    const rect = elementNode.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const initialRotation = ((element.rotation || 0) * Math.PI) / 180;

    const handleMouseMove = (moveEvent) => {
      const currentAngle = Math.atan2(
        moveEvent.clientY - centerY,
        moveEvent.clientX - centerX
      );
      const rotationInRadians = initialRotation + (currentAngle - startAngle);
      const rotationInDegrees = (rotationInRadians * 180) / Math.PI;

      updateElementRotation(index, rotationInDegrees);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const updateElementRotation = (index, rotation) => {
    const newElements = [...elements];
    newElements[index] = { ...newElements[index], rotation };
    updateElements(newElements);
  };

  // Grid View Functionality
  const handleGridViewToggle = () => {
    setIsGridView(!isGridView);
  };

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

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2]">
      <div
        className={`m-2 border-2 border-white rounded-[20px] max-w-full relative overflow-hidden ${
          isFullscreen ? "fixed inset-0 m-0 border-none rounded-none" : ""
        }`}
        style={{ height: isFullscreen ? "100vh" : "calc(100vh - 1rem)" }}
      >
        {/* Header */}
        {!isFullscreen && (
          <div className="absolute top-0 left-0 right-0 bg-[rgba(252,252,252,0.40)] p-3 flex items-center gap-2 rounded-t-[20px]">
            <img src="/icon5.svg" alt="Icon" />
            <div className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl">
                Template Customization
              </h4>
              <p className="text-[#374151] text-sm">
                Customize your ad based on your preferences.
              </p>
            </div>
          </div>
        )}

        {/* Sidebar */}
        {!isFullscreen && (
          <div className="absolute top-[80px] bottom-[68px] left-2 rounded-l-[20px]">
            <Sidebar
              setActiveComponent={handleSidebarComponent}
              setShowAdCreatives={() => {}}
            />
          </div>
        )}

        {/* Active Component Panel */}
        {!isFullscreen && (
          <div className="absolute top-[80px] bottom-[68px] left-24 rounded-l-[20px] overflow-auto hide-scrollbar">
            {activeComponent === "Text" && (
              <div className="w-2/4 m-4 p-4 mt-1 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40]">
                <TextAdder onAddText={handleAddText} />
              </div>
            )}
            {activeComponent === "Images" && (
              <div className="w-4/6 m-4 p-4 mt-1 mb-0 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar  bg-[#FCFCFC40]">
                <ImageSearchLayout onSelectImage={handleAddImage} />
              </div>
            )}
            {activeComponent === "Shapes" && (
              <div className=" m-4 p-4 mt-1 mb-0 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                <ShapeStyleLayout handleAddShape={handleAddShape} />
                <DesignElements handleAddSVG={handleAddSVG} />
                <OutlineElements handleAddSVG={handleAddSVG} />
                <StarElements handleAddSVG={handleAddSVG} />
                <BlobElements handleAddSVG={handleAddSVG} />
                <SunburstElements handleAddSVG={handleAddSVG} />
              </div>
            )}
            {activeComponent === "Frames" && (
              <div className="m-4 p-4 mt-1 mb-0 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                <FramesComponent onSelectFrame={handleFrameSelect} />
              </div>
            )}
            {activeComponent === "Uploads" && (
              <div className="w-3/5 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                <ImageUploadLayout onSelectImage={handleAddImage} />
              </div>
            )}
          </div>
        )}

        <div
          className={`overflow-auto ${
            isFullscreen ? "flex items-center justify-center" : ""
          }`}
        >
          <div
            className={`flex-1 flex flex-col items-center justify-center ${
              isFullscreen ? "" : "ml-[7%] mt-[80px] mb-[80px]"
            }`}
          >
            {isGridView ? (
              <div
                className="grid grid-cols-3 gap-4 p-4 overflow-y-auto"
                style={{ height: "100%" }}
              >
                {templates.map((_, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-md p-4 cursor-pointer ${
                      index === activeTemplateIndex
                        ? "border-purple-500"
                        : "border-gray-300"
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
                ref={templateRef}
                className="template-area p-4"
                style={{
                  width: CANVAS_SIZE * zoom,
                  height: CANVAS_SIZE * zoom,
                  backgroundColor: "#fff",
                  position: "relative",
                }}
              >
                {/* Render Elements */}
                {elements.map((element, index) => (
                  <Rnd
                    key={element.id}
                    ref={(ref) => (elementRefs.current[index] = ref)}
                    size={{
                      width: element.size.width * zoom,
                      height: element.size.height * zoom,
                    }}
                    position={{
                      x: element.position.x * zoom,
                      y: element.position.y * zoom,
                    }}
                    onDragStop={(e, d) => handleElementDragStop(e, d, index)}
                    onResizeStop={(e, direction, ref, delta) =>
                      handleElementResize(e, direction, ref, delta, index)
                    }
                    enableResizing
                    style={{
                      zIndex: element.style.zIndex,
                      border:
                        selectedElementIndex === index
                          ? "2px solid #4A90E2"
                          : "none",
                    }}
                    onClick={() => setSelectedElementIndex(index)}
                    onDoubleClick={(e) => handleDoubleClickText(index)}
                    onDragOver={(e) => {
                      if (element.type === "frame") {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    onDrop={(e) => {
                      if (element.type === "frame") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleImageDrop(e, index);
                      }
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {selectedElementIndex === index && (
                        <div
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 cursor-grab"
                          onMouseDown={(e) => handleRotationDragStart(e, index)}
                          style={{
                            width: "24px",
                            height: "24px",
                            backgroundColor: "#082A66",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                          }}
                        >
                          <MdRotateLeft size={16} color="white" />
                        </div>
                      )}
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          transform: `rotate(${element.rotation || 0}deg)`,
                          transformOrigin: "center",
                        }}
                      >
                        {element.type === "image" ? (
                          <img
                            src={element.src}
                            alt="Element"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            draggable={true}
                            onDragStart={(e) => {
                              e.stopPropagation();
                              e.dataTransfer.setData(
                                "application/element-index",
                                index.toString()
                              );
                            }}
                          />
                        ) : element.type === "text" ? (
                          <div
                            contentEditable={editingTextIndex === index}
                            onBlur={(e) => handleTextBlur(index, e)}
                            onInput={(e) => handleTextChange(e, index)}
                            suppressContentEditableWarning={true}
                            style={{
                              fontSize: element.style.fontSize,
                              color: element.style.color,
                            }}
                          >
                            {element.content}
                          </div>
                        ) : element.type === "shape" ? (
                          <div
                            style={{
                              ...element.style,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              height: "100%",
                              backgroundColor:
                                element.style.backgroundColor || "transparent",
                              color: element.style.color || "#082A66",
                              fontSize: element.style.fontSize || "100px",
                            }}
                          >
                            {element.component}
                          </div>
                        ) : element.type === "svg" ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: element.component.replace(
                                /fill=".*?"/g,
                                `fill="${element.fillColor}"`
                              ),
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              opacity: element.style.opacity,
                            }}
                          />
                        ) : element.type === "frame" ? (
                          <div
                            className="frame"
                            style={{
                              width: "100%",
                              height: "100%",
                              clipPath: element.style.clipPath,
                              position: "relative",
                              backgroundColor: element.content
                                ? "transparent"
                                : "#e0e0e0",
                            }}
                          >
                            {element.content && (
                              <img
                                src={element.content}
                                alt="frame content"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  objectPosition: "center",
                                  clipPath: element.style.clipPath,
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                }}
                              />
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Rnd>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!isFullscreen && (
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
              <MdFullscreen size={20} />{" "}
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
            <button
              onClick={handleGridViewToggle}
              className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2"
            >
              <MdGridView size={20} /> {isGridView ? "Exit Grid" : "Grid View"}
            </button>
            <button
              onClick={handleUndo}
              className="bg-gray-500 text-white px-3 py-2 rounded flex items-center gap-2 mx-2"
              disabled={history.length === 0}
            >
              <MdUndo size={20} /> Undo
            </button>
            <button
              onClick={handleRedo}
              className="bg-gray-500 text-white px-3 py-2 rounded flex items-center gap-2 mx-2"
              disabled={future.length === 0}
            >
              <MdRedo size={20} /> Redo
            </button>
            <div className="flex items-center gap-2">
              <MdZoomOut
                size={24}
                onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))}
                className="cursor-pointer"
              />
              <input
                type="range"
                min="10"
                max="200"
                value={zoom * 100}
                onChange={handleZoomChange}
                style={{ width: "120px" }}
              />
              <MdZoomIn
                size={24}
                onClick={() => setZoom(zoom + 0.1)}
                className="cursor-pointer"
              />
              <span className="ml-2 text-[#082A66] font-bold gap-4">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Fullscreen Header */}
        {isFullscreen && (
          <div className="absolute top-0 left-0 right-0 bg-gray-800 bg-opacity-50 p-2 flex justify-end items-center">
            <button
              onClick={handleFullscreenToggle}
              className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2 mx-2"
            >
              <MdFullscreen size={20} /> Exit Fullscreen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
