import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTextHeight, FaImage, FaShapes, FaRegImages, FaUpload } from "react-icons/fa";
import { RxTransparencyGrid } from 'react-icons/rx'; // Icon for transparency
import { FaPalette, FaLayerGroup } from 'react-icons/fa'; // Icons for color and position
import { Rnd } from "react-rnd";
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";
import html2canvas from 'html2canvas';
import TextFormatToolbar from "./Textformat"; // Import TextFormatToolbar
import TextAdder from "./TextAdder"; // Import TextFormatToolbar
import ImageUploadLayout from "./ImageUpload";
import AdCreatives from "./AdCreatives";
import ImageSearchLayout from "./ImageSearch";
import ShapeStyleLayout from "./Shapes";
import FramesComponent from "./Frames";
import { MdColorLens } from "react-icons/md";
import DesignMenu from './DesignMenu';
import ColorMenu from './ColorMenu';
import TransparencyMenu from './TransparencyMenu';
import PositionMenu from './PositionMenu';


export default function EditTemplate() {
  const [elements, setElements] = useState([]);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null); // Track selected element
  // Get the currently selected element 
  const activeElement = selectedElementIndex !== null ? elements[selectedElementIndex] : null;
  const [imageLayoutSize, setImageLayoutSize] = useState(1080); // Default size
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is active

  const [productDetails, setProductDetails] = useState(null);
  const [activeComponent, setActiveComponent] = useState(""); // Track active component from Sidebar
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(0.40); // Zoom level
  const [transparency, setTransparency] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Default color
  const [tooltip, setTooltip] = useState({ visible: false, width: 0, height: 0, x: 0, y: 0 });
  const [editingTextIndex, setEditingTextIndex] = useState(null); // Track the text element being edited
  const [templates, setTemplates] = useState([[]]); // Start with one empty template
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0); // Keep track of the active template
  const templateContainerRef = useRef(null); // Ref to the container holding all templates
  const [selectedFrame, setSelectedFrame] = useState(null); // New frame selection
  const [droppedImage, setDroppedImage] = useState(null); // Dropped image state

  const templateRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const productID = params.get("id");

  // Fetch product details using productID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }
        const response = await axios.get(`${baseUrl}/generated-images/${productID}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const data = response.data;

        setProductDetails(data);
        if (data.imagelayoutsize) {
          const layoutSize = parseInt(data.imagelayoutsize.split("x")[0]);
          setImageLayoutSize(layoutSize);
        }

        const dynamicElements = [
          {
            type: "image",
            src: data.logoURL,
            position: { x: parseInt(data.logoposition.split(",")[0]), y: parseInt(data.logoposition.split(",")[1]) },
            size: { width: data.logoWidth, height: data.logoHeight }
          },
          {
            type: "text",
            content: data.title,
            position: { x: parseInt(data.titlePosition.split(",")[0]), y: parseInt(data.titlePosition.split(",")[1]) },
            style: {
              fontSize: `${data.fontSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              wordWrap: "break-word"
            }
          },
          {
            type: "text",
            content: data.description,
            position: { x: parseInt(data.descriptionPosition.split(",")[0]), y: parseInt(data.descriptionPosition.split(",")[1]) },
            style: {
              fontSize: `${data.descriptionFontSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              wordWrap: "break-word"
            },
            contentFormatted: data.description && data.description.split('.').map((text, index) => (
              text.trim() ? <div key={index}>{text.trim()}.</div> : null
            ))
          },
          {
            type: "image",
            src: data.productURL,
            position: {
              x: data.productPosition ? parseInt(data.productPosition.split(",")[0]) : 0,
              y: data.productPosition ? parseInt(data.productPosition.split(",")[1]) : 0
            },
            size: {
              width: data.productWidth || 540,
              height: data.productHeight || 540
            }
          },
          {
            type: "text",
            content: data.phoneNumberText,
            position: { x: parseInt(data.phoneNumberPosition.split(",")[0]), y: parseInt(data.phoneNumberPosition.split(",")[1]) },
            style: {
              fontSize: `${data.phoneNumberSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              wordWrap: "break-word"
            }
          },
          {
            type: "text",
            content: data.ctaButtonText,
            position: { x: parseInt(data.ctaPosition.split(",")[0]), y: parseInt(data.ctaPosition.split(",")[1]) },
            style: {
              fontSize: `${data.ctaFontSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              backgroundColor: "#FFC107",
              padding: "5px",
              borderRadius: "5px"
            }
          }
        ];

        setElements(dynamicElements);
        setLoading(false);

      } catch (error) {
        console.error("Failed to fetch product details.", error);
      }
    };

    fetchProductDetails();
  }, [productID]);



  useEffect(() => {
    if (activeElement && activeElement.style) {
      // If opacity is defined, use it, otherwise default to 1 (100% transparency)
      const opacityValue = activeElement.style.opacity !== undefined ? activeElement.style.opacity : 1;
      setTransparency(opacityValue * 100);

      // Set color, default to white if not defined
      setSelectedColor(activeElement.style.color || '#FFFFFF');
    }
  }, [activeElement]);



  // Function to add a new template page when "+ Add Page" is clicked
  const handleAddPage = () => {
    const newTemplate = [...elements]; // Copy the current elements of the template
    setTemplates([...templates, newTemplate]); // Add a new template
    setActiveTemplateIndex(templates.length); // Set the new template as active

    // Scroll to the new template after adding it
    setTimeout(() => {
      if (templateContainerRef.current) {
        const newTemplate = templateContainerRef.current.children[templates.length]; // Get the new template
        newTemplate.scrollIntoView({ behavior: 'smooth' }); // Scroll to it
      }
    }, 100); // Delay to ensure the DOM has updated
  };


  // Function to handle adding a new text element from TextAdder
  const handleAddText = (newElement) => {
    setElements([...elements, newElement]); // Append new text element to the existing elements
    newElement.style = { ...newElement.style, zIndex: elements.length + 1 }; // Set initial zIndex

  };


  // Function to handle adding a shape
  const handleAddShape = (shape) => {
    const newShapeElement = {
      type: 'shape',
      component: shape.component, // The icon component selected
      position: { x: 50, y: 50 }, // Default position for the shape
      size: { width: 200, height: 200 }, // Set shape size to 200x200
      style: {
        color: '#fff', // Default color (navy blue)
        backgroundColor: 'transparent', // No background color by default
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '100px', // Set font size of the icon
      },
    };
    setElements([...elements, newShapeElement]); // Add shape to elements
  };

  const handleExport = async () => {
    if (templateRef.current) {
      const canvas = await html2canvas(templateRef.current, {
        useCORS: true, // Enable CORS handling
        allowTaint: true, // Allow tainted images to be used
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'template.png';
      link.click();
    }
  };


  const handleSaveAndNext = async () => {
    try {
      // Ensure all images including background and elements are loaded
      const images = Array.from(templateRef.current.querySelectorAll('img'));

      // Wait for all images to load
      const loadImages = images.map(img => {
        return new Promise((resolve, reject) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      });

      await Promise.all(loadImages); // Wait for all images to load

      // Capture the template with html2canvas
      const canvas = await html2canvas(templateRef.current, {
        useCORS: true, // Enable CORS
        allowTaint: true, // Allow cross-origin tainted images
        backgroundColor: null, // Ensure no default background color is applied
      });

      // Convert the canvas to an image
      const image = canvas.toDataURL('image/png');

      // Navigate to CustomSample and pass the image
      navigate('/CustomSample', {
        state: { image }, // Pass the generated image to CustomSample page
      });
    } catch (error) {
      console.error("Failed to generate image from canvas", error);
    }
  };

  const handleDoubleClickText = (index) => {
    setEditingTextIndex(index);
    setSelectedElementIndex(index); // Mark the selected element
  };



  // Function to handle real-time text changes as user types (optional debouncing)
  const handleTextChange = (e, index) => {
    const newElements = [...elements];
    newElements[index].content = e.target.textContent;
  };


  // To handle formatting from the TextFormatToolbar
  const handleTextFormatting = (styleProperty, value) => {
    if (selectedElementIndex !== null) {
      const newElements = [...elements];

      // Check if the selected element is a shape or text and apply the color accordingly
      if (newElements[selectedElementIndex].type === 'text' || newElements[selectedElementIndex].type === 'shape') {
        newElements[selectedElementIndex].style[styleProperty] = value; // Apply formatting for both text and shape
      }

      setElements(newElements);
    }
  };


  const handleZoomChange = (e) => {
    setZoom(e.target.value / 100);
  };

  const getScaledSize = () => {
    const scaledWidth = imageLayoutSize * zoom;
    const scaledHeight = imageLayoutSize * zoom;

    return { width: scaledWidth, height: scaledHeight };
  };


  const handlePositionChange = (positionAction) => {
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        // Ensure the style object exists before setting the zIndex
        if (!updatedElement.style) {
          updatedElement.style = {}; // Initialize the style object if it doesn't exist
        }

        // Update position based on action (Forward, Backward, ToFront, ToBack)
        switch (positionAction) {
          case 'forward':
            updatedElement.style.zIndex = (updatedElement.style.zIndex || 1) + 1;
            break;
          case 'backward':
            updatedElement.style.zIndex = Math.max((updatedElement.style.zIndex || 1) - 1, 1);
            break;
          case 'toFront':
            updatedElement.style.zIndex = Math.max(...updatedElements.map(el => el.style?.zIndex || 1)) + 1;
            break;
          case 'toBack':
            updatedElement.style.zIndex = 0; // Move to the back
            break;
          default:
            break;
        }
        return updatedElements;
      });
    }
  };

  const handleTransparencyChange = (e) => {
    const newTransparency = e.target.value;
    setTransparency(newTransparency);

    // Apply the transparency to the selected element
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        // Ensure the style object exists before setting the opacity
        if (!updatedElement.style) {
          updatedElement.style = {}; // Initialize the style object if it's missing
        }

        updatedElement.style.opacity = newTransparency / 100; // Apply transparency to the element
        return updatedElements;
      });
    }
  };


  const handleElementResize = (e, direction, ref, delta, index) => {
    const newElements = [...elements];

    if (newElements[index]) {
      const newWidth = ref.offsetWidth / zoom;
      const newHeight = ref.offsetHeight / zoom;

      // Update the size of the element based on the resize
      newElements[index].size = {
        width: newWidth,
        height: newHeight,
      };

      // Adjust the fontSize if the element is a shape
      if (newElements[index].type === 'shape') {
        const baseFontSize = 100; // Base font size for icons
        const scaleFactor = newWidth / 200; // Assume 200 is the original width
        newElements[index].style.fontSize = `${baseFontSize * scaleFactor}px`; // Scale font size based on container size
      }

      setElements(newElements);

      const rect = ref.getBoundingClientRect();
      setTooltip({
        visible: true,
        width: newWidth,
        height: newHeight,
        x: rect.right + 10,
        y: rect.bottom + 10,
      });
    } else {
      console.error(`Size property is undefined for element at index ${index}`);
    }
  };


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedElementIndex !== null) {
          handleDeleteElement(); // Call the delete function when Delete or Backspace key is pressed
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementIndex]); // Rerun this effect if the selected element changes
  

  const handleDeleteElement = () => {
    if (selectedElementIndex !== null) {
      const newElements = [...elements];
      newElements.splice(selectedElementIndex, 1); // Remove the selected element
      setElements(newElements);
      setSelectedElementIndex(null); // Reset the selection
    }
  };


  const handleElementDragStop = (e, d, index) => {
    const newElements = [...elements];

    // Ensure the element exists before updating its position
    if (newElements[index] && newElements[index].position) {
      // Update the position based on the drag stop event
      newElements[index].position = { x: d.x / zoom, y: d.y / zoom };
      setElements(newElements);

      const element = newElements[index];
      const elementWidth = element.size?.width;  // No default size here, respect the API response
      const elementHeight = element.size?.height;

      if (elementWidth && elementHeight) {
        // Display tooltip after dragging
        setTooltip({
          visible: true,
          width: elementWidth,
          height: elementHeight,
          x: d.x + (elementWidth * zoom) + 10, // Position tooltip at the bottom-right
          y: d.y + (elementHeight * zoom) + 10,
        });
      } else {
        console.error(`Size property is undefined for element at index ${index}`);
      }
    } else {
      console.error(`Position property is undefined for element at index ${index}`);
    }

    setSelectedElementIndex(null); // Deselect the element after dragging
  };
  // Function to handle adding a new image element from ImageSearchLayout
  const handleAddImage = (imageUrl) => {
    const newImageElement = {
      type: 'image',
      src: imageUrl,
      position: { x: 50, y: 50 }, // Default position for the image
      size: { width: 200, height: 200 }, // Default size for the image
      style: {
        zIndex: elements.length + 1, // Initial zIndex based on the current number of elements
      }
    };
    setElements([...elements, newImageElement]); // Add the selected image as a new element
  };


  // Handler for color change
  const handleColorChange = (color) => {
    setSelectedColor(color);

    // Apply the color to the selected element
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];
        updatedElement.style.color = color;
        return updatedElements;
      });
    }
  };


  const handleResizeStop = (e, direction, ref, delta, index) => {
    // Finalize the size and keep the tooltip visible
    handleElementResize(e, direction, ref, delta, index);
    setTooltip((tooltip) => ({
      ...tooltip,
      visible: true, // Ensure tooltip remains visible after resizing
    }));
  };
  // Function to handle key down events (specifically for Backspace handling)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const element = elements[index];
      const content = element.content;

      // If there's no content left, prevent further backspace actions
      if (content.length === 0) {
        e.preventDefault(); // Prevent default backspace behavior
      }
    }
  };


  const adjustTooltipPosition = () => {

    const tooltipX = tooltip.x;
    const tooltipY = tooltip.y;
    const tooltipWidth = 80; // Tooltip width
    const tooltipHeight = 30; // Tooltip height
    const padding = 10; // Padding from the edge

    let left = tooltipX;
    let top = tooltipY;

    // Ensure tooltip doesn't go beyond the right edge
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - padding;
    }

    // Ensure tooltip doesn't go beyond the bottom edge
    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - padding;
    }

    return { left, top };
  };


  const handleAlignElement = (alignType) => {
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const element = updatedElements[selectedElementIndex];

        const templateArea = templateRef.current.getBoundingClientRect(); // Get the template area dimensions
        const elementSize = element.size || { width: 100, height: 100 }; // Default size if not specified

        switch (alignType) {
          case 'top':
            element.position.y = 0;
            break;
          case 'left':
            element.position.x = 0;
            break;
          case 'center':
            element.position.x = (templateArea.width - elementSize.width * zoom) / 2 / zoom;
            break;
          case 'middle':
            element.position.y = (templateArea.height - elementSize.height * zoom) / 2 / zoom;
            break;
          case 'right':
            element.position.x = (templateArea.width - elementSize.width * zoom) / zoom;
            break;
          case 'bottom':
            element.position.y = (templateArea.height - elementSize.height * zoom) / zoom;
            break;
          default:
            break;
        }

        return updatedElements;
      });
    }
  };


  // Function to handle activating a Sidebar component
  const handleSidebarComponent = (componentName) => {
    // Set the active component and reset any active design menu
    setActiveComponent(componentName);
    setActiveMenu(null); // Ensure no design menu is active
  };

  // Function to handle activating a DesignMenu
  const handleDesignMenu = (menuName) => {
    // Set the active design menu and reset any active sidebar component
    setActiveMenu(menuName);
    setActiveComponent(""); // Ensure no sidebar component is active
  };

  // Function to handle adding a frame
  const handleFrameSelect = (frame) => {
    const newFrameElement = {
      type: "frame",
      frameType: frame.name,
      position: { x: 50, y: 50 },
      size: { width: 300, height: 300 },
      style: {
        border: "2px solid #4A90E2",
        clipPath: frame.clipPath,
      },
      content: null, // Placeholder for dropped image
    };
    setElements([...elements, newFrameElement]);
    setSelectedFrame(frame);
  };

  // Function to handle image drop inside a frame
  const handleImageDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const newElements = [...elements];
      newElements[index].content = event.target.result; // Set the image as base64 data URL
      setElements(newElements);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };



  return (
    <div className="min-h-screen p-2 bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col items-center justify-center">
      <div className="border-2 border-white rounded-[20px] w-full overflow-auto" style={{ height: "calc(100vh - 1rem)" }}>
        <div className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-t-[20px] p-3 w-full">
          <span className="flex items-center gap-2">
            <img src="/icon5.svg" alt="Icon" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl">Template Customization</h4>
              <p className="text-[#374151] text-sm">Customize your ad based on your preferences.</p>
            </span>
          </span>
        </div>
        <div className="flex">
          <div className="p-4 w-1/12">
            <Sidebar setActiveComponent={handleSidebarComponent} setShowAdCreatives={() => { }} />
          </div>
          <div className="flex-row relative w-full m-4 ml-0">
            <div className="flex items-center justify-end p-4 w-full bg-[#FCFCFC40] shadow-lg rounded-md mt-1" style={{ height: "8vh" }}>
              {editingTextIndex !== null && (
                <TextFormatToolbar
                  onClose={() => setEditingTextIndex(null)} // Close toolbar
                  applyFormatting={handleTextFormatting} />
              )}
              <div className="flex">
                <DesignMenu
                  activeMenu={activeMenu}
                  setActiveMenu={handleDesignMenu}
                  transparency={transparency}
                  handleTransparencyChange={handleTransparencyChange}
                />


                <button onClick={() => navigate("/campaigns")} className="flex bg-red-500 text-white py-1 px-4 rounded mr-2">Close</button>
                <button onClick={handleExport} className="custom-button text-white py-1 px-4 rounded mr-2">Export</button>
                <button onClick={handleSaveAndNext} className="custom-button text-white py-1 px-4 rounded">Save & Next</button>
              </div>
            </div>

            <div className="flex justify-center relative shadow-lg rounded-md overflow-auto hide-scrollbar" style={{ height: "calc(100vh - 12rem)" }}>
              {/* Show TextAdder when Text component is active */}
              {activeComponent === "Creatives" && (
                <div className="w-2/5 m-4 shadow-sm rounded-md">
                  <AdCreatives />
                </div>
              )}

              {activeComponent === "Text" && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md bg-[#082A66]">
                  <TextAdder onAddText={handleAddText} />
                </div>
              )}
              {/* Show ImageUploadLayout when Uploads component is active */}
              {activeComponent === "Uploads" && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#082A66]">
                  <ImageUploadLayout onSelectImage={handleAddImage} /> {/* Pass the handleAddImage callback */}
                </div>
              )}

              {activeComponent === "Images" && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar  bg-[#082A66]">
                  <ImageSearchLayout onSelectImage={handleAddImage} /> {/* Pass the handleAddImage callback */}

                </div>
              )}

              {activeComponent === "Shapes" && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#082A66]">
                  <ShapeStyleLayout handleAddShape={handleAddShape} />
                </div>
              )}

              {activeComponent === "Frames" && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#082A66]">
                  <FramesComponent onSelectFrame={handleFrameSelect} />
                </div>
              )}

              {activeMenu === 'color' && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#082A66]">
                  <ColorMenu handleColorChange={handleColorChange} />
                </div>
              )}


              {activeMenu === 'position' && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#082A66]">
                  <PositionMenu
                    handlePositionChange={handlePositionChange}
                    handleAlignElement={handleAlignElement} // Pass this function
                  /></div>
              )}

              <div className="shadow-sm justify-center bg-striped mx-auto my-auto mt-8 w-full h-full overflow-auto hide-scrollbar" style={getScaledSize()} ref={templateContainerRef}>
                <div className="template-area p-4"
                  onDrop={(e) => handleImageDrop(e, selectedElementIndex)}
                  onDragOver={handleDragOver}

                  style={{
                    height: `${imageLayoutSize * zoom}px`,
                    width: `${imageLayoutSize * zoom}px`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundImage: productDetails?.bgImageURL ? `url(${productDetails.bgImageURL})` : 'none',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative"

                  }} ref={templateRef}>
                  {/* Render each element (text or image) */}
                  {loading ? (
                    <p>Loading elements...</p>
                  ) : (
                    elements.map((element, index) => (
                      <Rnd
                        key={index}
                        size={{
                          width: element.size?.width * zoom || "auto",
                          height: element.size?.height * zoom || "auto"
                        }}
                        position={{
                          x: element.position.x * zoom,
                          y: element.position.y * zoom
                        }}
                        onClick={() => setSelectedElementIndex(index)}
                        onDoubleClick={() => handleDoubleClickText(index)} // Double-click to edit text
                        onDragStop={(e, d) => handleElementDragStop(e, d, index)}

                        onResize={(e, direction, ref, delta) =>
                          handleElementResize(e, direction, ref, delta, index)
                        } // Resize dynamically
                        onResizeStop={(e, direction, ref, delta) =>
                          handleResizeStop(e, direction, ref, delta, index)
                        } // Finalize resizing
                        bounds="parent" // Constrain element within parent (template area)
                        style={{
                          border: selectedElementIndex === index ? "2px solid #4A90E2" : "none",
                          zIndex: element.style?.zIndex || 1, // Apply zIndex to the element
                        }}
                      >
                        {element.type === "image" ? (
                          // Render Image Element
                          <img
                            src={element.src}
                            alt="element"
                            style={{
                              width: "100%",
                              height: "100%",
                              opacity: element.style?.opacity ?? 1, // Ensure opacity is safely accessed
                              zIndex: element.style?.zIndex || 1 // Apply zIndex to the element
                            }}
                          />
                        ) : element.type === "shape" ? (
                          // Render Shape Element
                          <div
                            style={{
                              ...element.style,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              height: "100%",
                              backgroundColor: element.style.backgroundColor || "transparent", // Default to transparent if not specified
                              color: element.style.color || "#082A66", // Default shape color
                              fontSize: element.style.fontSize || "100px", // Font size for shape
                              zIndex: element.style?.zIndex || 1 // Apply zIndex to the element
                            }}
                          >
                            {element.component} {/* Render the shape component */}
                          </div>
                        ) : element.type === "frame" ? (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              clipPath: element.style.clipPath, // Apply shape
                              backgroundImage: element.content ? `url(${element.content})` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              border: element.style.border,
                              backgroundColor: element.content ? 'transparent' : '#e0e0e0', // Show image or placeholder
                              zIndex: element.style?.zIndex || 0 // Apply zIndex to the element
                            }}
                          ></div>
                        ) : (
                          // Render Text Element
                          <div
                            contentEditable={editingTextIndex === index} // Make the text editable on double-click
                            onBlur={(e) => handleTextBlur(index, e)} // Finalize text change on blur
                            onInput={(e) => handleTextChange(e, index)} // Handle live text changes
                            onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace and other key events
                            suppressContentEditableWarning={true} // Suppress React warning for contentEditable
                            style={{
                              ...element.style,
                              fontSize: `${parseFloat(element.style.fontSize) * zoom}px` // Adjust font size based on zoom
                            }}
                          >
                            {element.contentFormatted
                              ? element.contentFormatted
                              : element.content}
                          </div>
                        )}
                      </Rnd>
                    ))
                  )}
                </div>

                {tooltip.visible && (
                  <div
                    className="absolute bg-black text-white px-2 py-1 rounded"
                    style={{
                      left: adjustTooltipPosition().left,
                      top: adjustTooltipPosition().top,
                      zIndex: 1000, // Ensure tooltip stays above other elements
                    }}
                  >
                    w: {Math.round(tooltip.width)}px h: {Math.round(tooltip.height)}px
                  </div>
                )}
              </div>
            </div>
            {/*<div className="absolute w-full">
              <div className="absolute inset-x-0 bottom-0 flex justify-center">
                <div className="border border-[#FCFCFC] p-2 w-1/4 mb-4 justify-center">
                  adding new template here
                </div>
              </div>
            </div>*/}
          </div>
        </div>
        <div className="fixed right-8 bottom-2 flex items-center rounded-lg" style={{ zIndex: 1000 }}>
          <input type="range" min="10" max="500" value={zoom * 100} onChange={handleZoomChange} style={{ width: '120px' }} />
          <span className="ml-2 text-[#082A66] font-bold gap-4">{Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
const Sidebar = ({ setActiveComponent, setShowAdCreatives }) => {
  return (
    <div className="flex flex-col items-center p-3 rounded-[12px] bg-[#FCFCFC40] shadow-lg" style={{ height: 'calc(100vh - 8rem)' }}>
      <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full "
      /* 
   onClick={() => {
     setActiveComponent('Creatives');
     setShowAdCreatives(true);
   }}
 */
      >
        <img src="/icon5.svg" alt="Icon" className="w-8 h-8" />
        <span className="text-sm">Creatives</span>
      </button>
      <div className="flex flex-col items-center justify-center space-y-2 mt-4">
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Text')}>
          <FaTextHeight />
          <span className="text-sm">Text</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Images')}>
          <FaImage />
          <span className="text-sm">Image</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Shapes')}>
          <FaShapes />
          <span className="text-sm">Shape</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Frames')}>
          <FaRegImages />
          <span className="text-sm">Frame</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Uploads')}>
          <FaUpload />
          <span className="text-sm">Uploads</span>
        </button>
      </div>
    </div>
  );
};

{/*const DesignMenu = ({ activeElement, setElements, selectedElementIndex, handlePositionChange }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [transparency, setTransparency] = useState(100); // Manage the transparency
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Default color

  useEffect(() => {
    if (activeElement && activeElement.style) {
      // If opacity is defined, use it, otherwise default to 1 (100% transparency)
      const opacityValue = activeElement.style.opacity !== undefined ? activeElement.style.opacity : 1;
      setTransparency(opacityValue * 100);

      // Set color, default to white if not defined
      setSelectedColor(activeElement.style.color || '#FFFFFF');
    }
  }, [activeElement]);



  // Handler for transparency slider
  const handleTransparencyChange = (e) => {
    const newTransparency = e.target.value;
    setTransparency(newTransparency);

    // Apply the transparency to the selected element
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        // Ensure the style object exists before setting the opacity
        if (!updatedElement.style) {
          updatedElement.style = {}; // Initialize the style object if it's missing
        }

        updatedElement.style.opacity = newTransparency / 100; // Apply transparency to the element
        return updatedElements;
      });
    }
  };


  // Handler for color change
  const handleColorChange = (color) => {
    setSelectedColor(color);

    // Apply the color to the selected element
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];
        updatedElement.style.color = color;
        return updatedElements;
      });
    }
  };


  // Toggle menu
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu); // Toggle between transparency, color, etc.
  };

  return (
    <div className="flex flex-row items-center gap-4 mr-4">
      <button
        className="flex flex-row items-center gap-2 text-lg rounded w-full"
        onClick={() => toggleMenu('transparency')}
      >
        <RxTransparencyGrid size={24} />
      </button>

      {activeMenu === 'transparency' && (
        <div className="p-3 w-full bg-white rounded-md mt-4 shadow-md">
          <span>Transparency</span>
          <input
            type="range"
            min="0"
            max="100"
            value={transparency}
            onChange={handleTransparencyChange}
            className="w-full"
          />
        </div>
      )}

      <button
        className="flex flex-row items-center gap-2 text-lg rounded w-full"
        onClick={() => toggleMenu('color')}
      >
        <MdColorLens size={28} />
      </button>

      {activeMenu === 'color' && (
        <div className="p-4 w-full bg-white rounded-md mt-4 shadow-md">
          <span>Colors</span>
          <div className="color-palette">
            {['#000000', '#FF5733', '#33FF57', '#3357FF', '#FFFF33'].map((color) => (
              <button
                key={color}
                className="color-option"
                style={{
                  backgroundColor: color,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  margin: '5px'
                }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>
      )}

      <button
        className="flex flex-col items-center gap-2 text-lg rounded w-full"
        onClick={() => toggleMenu('position')}
      >
        <FaLayerGroup size={24} />
      </button>

      {activeMenu === 'position' && (
        <div className="p-4 w-full bg-white rounded-md mt-4 shadow-md">
          <span>Layer Position</span>
          <div className="position-controls">
            <button onClick={() => handlePositionChange('forward')}>Forward</button>
            <button onClick={() => handlePositionChange('backward')}>Backward</button>
            <button onClick={() => handlePositionChange('toFront')}>To Front</button>
            <button onClick={() => handlePositionChange('toBack')}>To Back</button>
          </div>
        </div>
      )}
    </div>
  );
};
*/}