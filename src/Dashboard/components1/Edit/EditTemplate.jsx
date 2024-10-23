import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Rnd } from "react-rnd";
import { MdRotateLeft } from "react-icons/md";

// Import your components
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";
import TextFormatToolbar from "./Textformat";
import TextAdder from "./TextAdder";
import ImageUploadLayout from "./ImageUpload";
import AdCreatives from "./AdCreatives";
import ImageSearchLayout from "./ImageSearch";
import ShapeStyleLayout from "./Shapes";
import FramesComponent from "./Frames";
import Sidebar_Edit from "./Sidebar_Edit";
import DesignMenu from './DesignMenu';
import ColorMenu from './ColorMenu';
import GradientColorMenu from "./GradientColor";
import PositionMenu from './PositionMenu';
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
import domtoimage from 'dom-to-image';

export default function EditTemplate() {
  const [elements, setElements] = useState([]);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null); // Track selected element
  const [nextElementId, setNextElementId] = useState(100);
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

  const templateRef = useRef();
  const elementRefs = useRef([]); // Refs for elements
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
        const layoutSize = data.imagelayoutsize
          ? parseInt(data.imagelayoutsize.split("x")[0])
          : 1080;
        setImageLayoutSize(layoutSize);

        // Construct the background as an element
        const bgElement = {
          type: 'background',
          id: 'bgElement',
          fromAPI: true,
          bgImageURL: data.bgImageURL || null,
          position: { x: 0, y: 0 },
          size: { width: layoutSize, height: layoutSize },
          rotation: 0, // Initialize rotation
          style: {
            backgroundColor: data.backgroundColor || '#FFFFFF',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            zIndex: 0,
          },
        };

        // Construct other dynamic elements from API response
        const responseElements = [
          {
            type: "image",
            id: 'logoElement',
            fromAPI: true,
            src: data.logoURL,
            position: { x: parseInt(data.logoposition.split(",")[0]), y: parseInt(data.logoposition.split(",")[1]) },
            size: { width: data.logoWidth, height: data.logoHeight },
            rotation: 0, // Initialize rotation
            style: {
              zIndex: 1,
            },
          },
          {
            type: "text",
            id: 'titleElement',
            fromAPI: true,
            content: data.title,
            position: { x: parseInt(data.titlePosition.split(",")[0]), y: parseInt(data.titlePosition.split(",")[1]) },
            rotation: 0, // Initialize rotation
            style: {
              fontSize: `${data.fontSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              wordWrap: "break-word",
              zIndex: 2,
            }
          },
          {
            type: "text",
            id: 'descriptionElement',
            fromAPI: true,
            content: data.description,
            position: { x: parseInt(data.descriptionPosition.split(",")[0]), y: parseInt(data.descriptionPosition.split(",")[1]) },
            rotation: 0, // Initialize rotation
            style: {
              fontSize: `${data.descriptionFontSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              wordWrap: "break-word",
              zIndex: 3,
            },
          },
          {
            type: "image",
            id: 'productURLElement',
            fromAPI: true,
            src: data.productURL,
            position: {
              x: data.productPosition ? parseInt(data.productPosition.split(",")[0]) : 0,
              y: data.productPosition ? parseInt(data.productPosition.split(",")[1]) : 0
            },
            size: {
              width: data.productWidth || 540,
              height: data.productHeight || 540
            },
            rotation: 0, // Initialize rotation
            style: {
              zIndex: 4,
            },
          },
          {
            type: "text",
            id: 'phoneElement',
            fromAPI: true,
            content: data.phoneNumberText,
            position: { x: parseInt(data.phoneNumberPosition.split(",")[0]), y: parseInt(data.phoneNumberPosition.split(",")[1]) },
            rotation: 0, // Initialize rotation
            style: {
              fontSize: `${data.phoneNumberSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              wordWrap: "break-word",
              zIndex: 5,
            }
          },
          {
            type: "text",
            id: 'CTAElement',
            fromAPI: true,
            content: data.ctaButtonText,
            position: { x: parseInt(data.ctaPosition.split(",")[0]), y: parseInt(data.ctaPosition.split(",")[1]) },
            rotation: 0, // Initialize rotation
            style: {
              fontSize: `${data.ctaFontSize}px`,
              fontFamily: "Arial",
              whiteSpace: "normal",
              backgroundColor: "#FFC107",
              padding: "5px",
              borderRadius: "5px",
              zIndex: 6,
            }
          }
        ];

        // Add background element to the elements list
        setElements([bgElement, ...responseElements]);
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

  // Function to handle adding a new text element from TextAdder
  const handleAddText = (newElement) => {
    newElement.id = `element${nextElementId}`;
    setNextElementId(nextElementId + 1);
    newElement.rotation = 0; // Initialize rotation
    newElement.style = { ...newElement.style, zIndex: elements.length + 1 }; // Set initial zIndex
    setElements([...elements, newElement]); // Append new text element to the existing elements
  };

  // Function to handle adding a shape
  const handleAddShape = (shape) => {
    const uniqueId = `${shape.name}-${Date.now()}`; // Ensure each shape has a unique name

    const newShapeElement = {
      type: 'shape',
      name: uniqueId, // Store the unique name
      component: shape.component,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 200 },
      rotation: 0, // Initialize rotation
      style: {
        color: '#fff',
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '100px',
        zIndex: elements.length + 1,
      },
    };

    setElements([...elements, newShapeElement]);
  };

  const handleAddSVG = (svg) => {
    const uniqueId = `${svg.name}-${Date.now()}`; // Create a unique ID using name and timestamp

    const newSVGElement = {
      type: 'svg',
      name: uniqueId, // Store the unique name
      component: svg.component,
      position: { x: 50, y: 50 }, // Default position
      size: { width: 200, height: 200 }, // Default size
      rotation: 0, // Initialize rotation
      fillColor: '#082A66', // Default fill color
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        zIndex: elements.length + 1, // Set zIndex
      },
    };

    setElements([...elements, newSVGElement]);
  };

  // Function to handle adding a frame
  const handleFrameSelect = (frame) => {
    const newFrameElement = {
      type: "frame",
      frameType: frame.name,
      position: { x: 50, y: 50 },
      size: { width: 300, height: 300 },
      rotation: 0, // Initialize rotation
      style: {
        border: "2px solid #4A90E2",
        clipPath: frame.clipPath,
        zIndex: elements.length + 1,
      },
      content: null, // Placeholder for dropped image
    };
    setElements([...elements, newFrameElement]);
    setSelectedFrame(frame);
  };

  // Function to handle adding a new image element from ImageSearchLayout
  const handleAddImage = (imageUrl) => {
    const newImageElement = {
      type: 'image',
      src: imageUrl,
      position: { x: 50, y: 50 }, // Default position for the image
      size: { width: 200, height: 200 }, // Default size for the image
      rotation: 0, // Initialize rotation
      style: {
        zIndex: elements.length + 1, // Initial zIndex based on the current number of elements
      }
    };
    setElements([...elements, newImageElement]); // Add the selected image as a new element
  };

  // Function to handle double-click on text element to edit
  const handleDoubleClickText = (index) => {
    setEditingTextIndex(index);
    setSelectedElementIndex(index); // Mark the selected element
  };

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


  // Handler for color change
  const handleColorChange = (color) => {
    setSelectedColor(color); // Update selected color

    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        // If the selected element is a background, apply color and clear bgImageURL
        if (updatedElement.type === 'background') {
          updatedElement.style = {
            ...updatedElement.style,
            backgroundColor: color,
          };
          updatedElement.bgImageURL = null; // Clear the background image
        } else if (updatedElement.type === 'svg') {
          updatedElement.fillColor = color; // Update fill color property
        } else if (updatedElement.type === 'shape') {
          updatedElement.style.color = color; // Change color for shapes
        } else if (updatedElement.type === 'text') {
          updatedElement.style.color = color; // Change text color
        }

        return updatedElements;
      });
    }
  };

  // Handler for gradient color change
  const handleGradientColorChange = (gradientColor) => {
    setSelectedColor(gradientColor); // Store the selected gradient color

    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        // Apply the gradient to the background or text
        if (updatedElement.type === 'background') {
          updatedElement.style.backgroundColor = gradientColor;
          updatedElement.bgImageURL = null; // Clear the background image
        } else if (updatedElement.type === 'text') {
          updatedElement.style.background = gradientColor; // Apply the gradient to text background
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

  const handleZoomChange = (e) => {
    setZoom(e.target.value / 100);
  };

  const getScaledSize = () => {
    const scaledWidth = imageLayoutSize * zoom;
    const scaledHeight = imageLayoutSize * zoom;

    return { width: scaledWidth, height: scaledHeight };
  };

  // Function to update element's rotation
  const updateElementRotation = (index, rotation) => {
    setElements((prevElements) => {
      const newElements = [...prevElements];
      newElements[index] = { ...newElements[index], rotation };
      return newElements;
    });
  };

  // Function to handle rotation start
  const handleRotationDragStart = (e, index) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from propagating

    const element = elements[index];

    const elementNode = elementRefs.current[index]?.resizableElement?.current;
    if (!elementNode) return;

    const rect = elementNode.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const initialRotation = ((element.rotation || 0) * Math.PI) / 180;

    const handleMouseMove = (moveEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
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

  // Function to handle Sidebar component activation
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

  // Function to handle element drag stop
  const handleElementDragStop = (e, d, index) => {
    const newElements = [...elements];

    if (newElements[index]) {
      newElements[index].position = { x: d.x / zoom, y: d.y / zoom };
      setElements(newElements);

      // Display tooltip after dragging
      const element = newElements[index];
      const elementWidth = element.size?.width * zoom;
      const elementHeight = element.size?.height * zoom;

      if (elementWidth && elementHeight) {
        setTooltip({
          visible: true,
          width: elementWidth,
          height: elementHeight,
          x: d.x + elementWidth,
          y: d.y + elementHeight,
        });
      }
    }

    setSelectedElementIndex(index);
  };

  // Function to handle element resize
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

      setElements(newElements);

      const rect = ref.getBoundingClientRect();
      setTooltip({
        visible: true,
        width: newWidth * zoom,
        height: newHeight * zoom,
        x: rect.right,
        y: rect.bottom,
      });
    }
  };

  // Function to handle resize stop
  const handleResizeStop = (e, direction, ref, delta, index) => {
    // Finalize the size and keep the tooltip visible
    handleElementResize(e, direction, ref, delta, index);
    setTooltip((tooltip) => ({
      ...tooltip,
      visible: true, // Ensure tooltip remains visible after resizing
    }));
  };

  // Function to handle image drop inside a frame
  const handleImageDrop = (e, frameIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedIndex = e.dataTransfer.getData("application/element-index");

    if (draggedIndex !== '') {
      const draggedElement = elements[parseInt(draggedIndex)];

      if (draggedElement?.type === 'image') {
        setElements((prevElements) => {
          const newElements = [...prevElements];
          if (newElements[frameIndex].type === 'frame') {
            newElements[frameIndex].content = draggedElement.src;
            newElements.splice(parseInt(draggedIndex), 0);
          }
          return newElements;
        });
      }
    } else if (e.dataTransfer.files.length > 0) {
      // Handle external file drop
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        setElements((prevElements) => {
          const newElements = [...prevElements];
          if (newElements[frameIndex]?.type === 'frame') {
            newElements[frameIndex].content = event.target.result;
          }
          return newElements;
        });
      };

      reader.readAsDataURL(file);
    } else {
      console.error("Invalid drop operation.");
    }
  };

  // Function to handle Save and Export
  const handleExport = async () => {
    generateNewElementsJSON(); // Generate JSON when exporting
    try {
      setSelectedElementIndex(null); // Deselect any selected elements
      const node = templateRef.current;

      const originalZoom = zoom; // Store the original zoom value
      setZoom(1); // Set zoom to 1 for capturing the original size

      setTimeout(async () => {
        const dataUrl = await domtoimage.toPng(node, {
          width: imageLayoutSize,
          height: imageLayoutSize,
          style: {
            transformOrigin: '0 0',
          },
          cacheBust: true,
        });

        navigate('/preview', { state: { image: dataUrl } }); // Navigate to preview

        setZoom(originalZoom); // Restore the original zoom
      }, 100); // Adjust the timeout as needed
    } catch (error) {
      console.error('Failed to generate image from template:', error);
    }
  };

  // Function to handle Save and Next
  const handleSaveAndNext = async () => {
    try {
      setSelectedElementIndex(null);
      const node = templateRef.current;

      // Generate the image using dom-to-image similar to handleExport
      const dataUrl = await domtoimage.toPng(node, {
        width: node.offsetWidth, // Capture the full width of the node
        height: node.offsetHeight, // Capture the full height of the node
        style: {
          transformOrigin: '0 0', // Ensure the full content is captured, not just top left
        },
        cacheBust: true, // Ensure the image is not cached
      });

      // Navigate to CustomSample and pass the generated image as a base64 string
      navigate('/CustomSample', {
        state: { image: dataUrl }, // Pass the generated image to the CustomSample page
      });
    } catch (error) {
      console.error("Failed to generate image from template:", error);
    }
  };

  const generateNewElementsJSON = () => {
    const newElementsJSON = elements.map((element) => {
      const elementJSON = {
        id: element.id,
        type: element.type,
        name: element.name, // Include the unique name
        position: element.position,
        size: element.size,
        style: element.style,
        zIndex: element.style?.zIndex || 1,
      };

      if (element.type === "svg") {
        elementJSON.fillColor = element.fillColor;
        elementJSON.opacity = element.style.opacity;
      } else if (element.type === "frame") {
        elementJSON.frameType = element.frameType;
        elementJSON.content = element.content;
      } else if (element.type === "text") {
        elementJSON.content = element.content;
      } else if (element.type === "image") {
        elementJSON.src = element.src;
      }

      return elementJSON;
    });

    console.log(JSON.stringify(newElementsJSON, null, 2));
  };


  // Function to handle Delete Element
  const handleDeleteElement = () => {
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const newElements = [...prevElements];
        const selectedElement = newElements[selectedElementIndex];

        if (selectedElement.type === 'background') {
          // Clear background image if the element is a background
          selectedElement.bgImageURL = null;
          selectedElement.style.backgroundColor = '#FFFFFF'; // Reset to white background
        } else {
          // Remove the selected element from the list
          newElements.splice(selectedElementIndex, 1);
        }

        return newElements;
      });

      setSelectedElementIndex(null);
    }
  };

  // Keydown event listener for deleting elements
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isDeleteKey =
        event.key === "Delete" ||
        (event.key === "Backspace");

      if (isDeleteKey && selectedElementIndex !== null) {
        const element = elements[selectedElementIndex];

        const isTextElement = element.type === "text";
        const isEditable = editingTextIndex !== null && editingTextIndex === selectedElementIndex;

        if (!isTextElement || !isEditable) {
          handleDeleteElement(); // Call the delete function
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementIndex, editingTextIndex, elements]);

  // Function to adjust tooltip position
  const adjustTooltipPosition = () => {
    const tooltipWidth = 80;
    const tooltipHeight = 30;
    const padding = 10;

    let left = tooltip.x;
    let top = tooltip.y;

    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - padding;
    }

    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - padding;
    }

    return { left, top };
  };

  // Adjust tooltip to appear at the right bottom of the selected element
  useEffect(() => {
    if (selectedElementIndex !== null && elementRefs.current[selectedElementIndex]) {
      const elementNode = elementRefs.current[selectedElementIndex].resizableElement.current;
      const rect = elementNode.getBoundingClientRect();

      setTooltip({
        visible: true,
        width: rect.width,
        height: rect.height,
        x: rect.right,
        y: rect.bottom,
      });
    } else {
      setTooltip((tooltip) => ({ ...tooltip, visible: false }));
    }
  }, [selectedElementIndex, zoom]);

  // Function to handle position change (zIndex)
  const handlePositionChange = (positionAction) => {
    if (selectedElementIndex !== null) {
      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        if (!updatedElement.style) {
          updatedElement.style = {};
        }

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
            updatedElement.style.zIndex = 1; // Move to the back
            break;
          default:
            break;
        }
        return updatedElements;
      });
    }
  };

  // Function to handle align element
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

  // Function to handle key down events (specifically for Backspace handling)
  const handleTextKeyDown = (e, index) => {
    // Allow all keys during text editing
  };

  return (
    <div className="min-h-screen p-2 bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col items-center justify-center">
      <div className="border-2 border-white rounded-[20px] w-full overflow-hidden" style={{ height: "calc(100vh - 1rem)" }}>
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
            <Sidebar_Edit setActiveComponent={handleSidebarComponent} setShowAdCreatives={() => { }} />
          </div>
          <div className="flex-row relative w-full m-4 ml-0">
            <div className="flex items-center justify-end p-4 w-full bg-[#FCFCFC40] shadow-lg rounded-md mt-1" style={{ height: "8vh" }}>
              {editingTextIndex !== null && (activeElement?.type === 'text' || activeElement?.type === 'cta') && (
                <TextFormatToolbar
                  fontFamily={activeElement?.style?.fontFamily || 'Sans Serif'}
                  fontSize={activeElement?.style?.fontSize || '16px'}
                  fontColor={activeElement?.style?.color || '#000000'}
                  onClose={() => setEditingTextIndex(null)}
                  onTextFormatting={handleTextFormatting} // Pass the function
                />

              )}
              <div className="flex">
                <DesignMenu
                  activeMenu={activeMenu}
                  setActiveMenu={handleDesignMenu}
                  transparency={transparency}
                  handleTransparencyChange={handleTransparencyChange}
                />

                <button onClick={() => navigate("/campaigns")} className="flex bg-red-500 text-white py-1 px-4 rounded mr-2">Close</button>
                <button onClick={handleExport} className="custom-button text-white py-1 px-4 rounded">
                  Export
                </button>
                <button onClick={handleSaveAndNext} className="custom-button text-white py-1 px-4 rounded">Save & Next</button>
              </div>
            </div>

            <div className="flex justify-center relative shadow-lg rounded-md overflow-auto hide-scrollbar" style={{ height: "calc(100vh - 12rem)" }}>
              {/* Conditionally render sidebar components based on activeComponent */}
              {activeComponent === "Creatives" && (
                <div className="w-2/5 m-4 shadow-sm rounded-md">
                  <AdCreatives />
                </div>
              )}

              {activeComponent === "Text" && (
                <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40]">
                  <TextAdder onAddText={handleAddText} />
                </div>
              )}
              {/* Show ImageUploadLayout when Uploads component is active */}
              {activeComponent === "Uploads" && (
                <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <ImageUploadLayout onSelectImage={handleAddImage} /> {/* Pass the handleAddImage callback */}
                </div>
              )}

              {activeComponent === "Images" && (
                <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar  bg-[#FCFCFC40]">
                  <ImageSearchLayout onSelectImage={handleAddImage} /> {/* Pass the handleAddImage callback */}

                </div>
              )}

              {activeComponent === "Shapes" && (
                <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <ShapeStyleLayout handleAddShape={handleAddShape} />
                  <DesignElements handleAddSVG={handleAddSVG} />
                  <ShapeWithSVG handleAddSVG={handleAddSVG} />
                  <OutlineElements handleAddSVG={handleAddSVG} />
                  <GeometricalElements handleAddSVG={handleAddSVG} />
                  <ArrowElements handleAddSVG={handleAddSVG} />
                  <StarElements handleAddSVG={handleAddSVG} />
                  <BrushedElements handleAddSVG={handleAddSVG} />
                  <RibbonElements handleAddSVG={handleAddSVG} />
                  <LabelElements handleAddSVG={handleAddSVG} />
                  <BadgesShieldElements handleAddSVG={handleAddSVG} />
                  <SpeechBubblesElements handleAddSVG={handleAddSVG} />
                  <BlobElements handleAddSVG={handleAddSVG} />
                  <SunburstElements handleAddSVG={handleAddSVG} />
                </div>
              )}

              {activeComponent === "Frames" && (
                <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <FramesComponent onSelectFrame={handleFrameSelect} />
                </div>
              )}

              {activeMenu === 'color' && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <ColorMenu handleColorChange={handleColorChange} />
                </div>
              )}

              {activeMenu === 'gradientColor' &&
                (activeElement?.type === 'text' || activeElement?.type === 'background') && (
                  <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                    <GradientColorMenu handleGradientColorChange={handleGradientColorChange} />
                  </div>
                )}

              {activeMenu === 'position' && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <PositionMenu
                    handlePositionChange={handlePositionChange}
                    handleAlignElement={handleAlignElement} // Pass this function
                  />
                </div>
              )}

              <div className="shadow-sm justify-center mx-auto my-auto mt-8 w-full h-full overflow-auto" style={getScaledSize()} ref={templateContainerRef}>
                <div className="template-area p-4 overflow-hidden"
                  onClick={(e) => {
                    if (e.target === templateRef.current || e.target === templateContainerRef.current) {
                      setSelectedElementIndex(0); // Select the background
                    }
                  }}
                  style={{
                    height: `${imageLayoutSize * zoom}px`,
                    width: `${imageLayoutSize * zoom}px`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: elements[0]?.bgImageURL
                      ? `url(${elements[0].bgImageURL})`
                      : elements[0]?.style?.backgroundColor || 'transparent',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                  }}
                  ref={templateRef}>
                  {/* Render each element */}
                  {loading ? (
                    <p>Loading elements...</p>
                  ) : (
                    elements.map((element, index) => {
                      // Skip rendering the background as an individual element
                      if (element.type === "background") return null;

                      return (
                        <Rnd
                          key={index}
                          ref={(ref) => (elementRefs.current[index] = ref)}
                          size={{
                            width: element.size?.width * zoom || "auto",
                            height: element.size?.height * zoom || "auto"
                          }}
                          position={{
                            x: element.position.x * zoom,
                            y: element.position.y * zoom
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElementIndex(index);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleDoubleClickText(index);
                          }} // Double-click to edit text

                          onDragStart={(e) => e.stopPropagation()}
                          onDragStop={(e, d) => {
                            if (element.type !== "background") {
                              handleElementDragStop(e, d, index);
                            }
                          }}
                          onResize={(e, direction, ref, delta) =>
                            handleElementResize(e, direction, ref, delta, index)
                          } // Resize dynamically
                          onResizeStop={(e, direction, ref, delta) =>
                            handleResizeStop(e, direction, ref, delta, index)
                          } // Finalize resizing
                          enableResizing={element.type !== "background" ? undefined : false}
                          disableDragging={element.type === "background"}
                          style={{
                            border: selectedElementIndex === index ? "2px solid #4A90E2" : "none",
                            zIndex: element.style?.zIndex || 1, // Apply zIndex to the element
                          }}
                          // Only allow drop on frames
                          onDragOver={(e) => {
                            if (element.type === 'frame') {
                              e.preventDefault();  // Allow drop
                              e.stopPropagation(); // Prevent propagation
                            }
                          }}
                          onDrop={(e) => {
                            if (element.type === 'frame') {
                              e.preventDefault();  // Prevent default behavior
                              e.stopPropagation(); // Prevent propagation
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
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: '#082A66',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
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
                              {/* Render the content of the element */}
                              {element.type === "image" ? (
                                // Render Image Element
                                <img
                                  src={element.src}
                                  alt="element"
                                  draggable={true}
                                  onDragStart={(e) => {
                                    e.stopPropagation(); // Prevent event propagation
                                    e.dataTransfer.setData("application/element-index", index.toString());
                                  }}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    opacity: element.style?.opacity ?? 1,
                                    zIndex: element.style?.zIndex || 1,
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
                                    backgroundColor: element.style.backgroundColor || "transparent",
                                    color: element.style.color || "#082A66",
                                    fontSize: element.style.fontSize || "100px",
                                    zIndex: element.style?.zIndex || 1
                                  }}
                                >
                                  {element.component} {/* Render the shape component */}
                                </div>
                              ) : element.type === "svg" ? (
                                element.component(element.fillColor, element.style.opacity ?? 1) // Pass fill color and opacity
                              ) : element.type === "frame" ? (
                                <div
                                  className="frame"
                                  key={index}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    clipPath: element.style.clipPath,
                                    position: "relative",
                                    border: element.style.border || "2px solid #4A90E2",
                                    backgroundColor: element.content ? "transparent" : "#e0e0e0",
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
                            </div>
                          </div>
                        </Rnd>
                      );
                    })
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

              {/* Zoom Slider */}
              <div className="fixed right-8 bottom-2 flex items-center rounded-lg" style={{ zIndex: 1000 }}>
                <input type="range" min="10" max="500" value={zoom * 100} onChange={handleZoomChange} style={{ width: '120px' }} />
                <span className="ml-2 text-[#082A66] font-bold gap-4">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
