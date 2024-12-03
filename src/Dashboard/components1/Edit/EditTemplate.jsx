import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Rnd } from "react-rnd";
import {
  MdAddCircle,
  MdDownload,
  MdFullscreen,
  MdGridView,
  MdRedo,
  MdRotateLeft,
  MdUndo,
  MdZoomIn,
  MdZoomOut,
} from "react-icons/md";

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
import DesignMenu from "./DesignMenu";
import ColorMenu from "./ColorMenu";
import GradientColorMenu from "./GradientColor";
import PositionMenu from "./PositionMenu";
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
import domtoimage from "dom-to-image";

export default function EditTemplate() {
  const [elements, setElements] = useState([]);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null); // Track selected element
  const [nextElementId, setNextElementId] = useState(100);
  const activeElement =
    selectedElementIndex !== null ? elements[selectedElementIndex] : null;
  const [imageLayoutSize, setImageLayoutSize] = useState(1080); // Default size
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is active
  const [productDetails, setProductDetails] = useState(null);
  const [activeComponent, setActiveComponent] = useState(""); // Track active component from Sidebar
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(0.45); // Zoom level
  const [transparency, setTransparency] = useState(100);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF"); // Default color
  const [tooltip, setTooltip] = useState({
    visible: false,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [editingTextIndex, setEditingTextIndex] = useState(null); // Track the text element being edited
  const [templates, setTemplates] = useState([[]]); // Start with one empty template
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0); // Keep track of the active template
  const templateContainerRef = useRef(null); // Ref to the container holding all templates
  const [selectedFrame, setSelectedFrame] = useState(null); // New frame selection
  const [updatedJson, setUpdatedJson] = useState(null); // Store the updated JSON
  const templateRef = useRef();
  const elementRefs = useRef([]); // Refs for elements
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const productID = params.get("id");
  const [hasUsedRestoredJson, setHasUsedRestoredJson] = useState(false); // New state variable
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  // New state variables for Full-Screen, Grid View, and Download functionalities
  const [isFullscreen, setIsFullscreen] = useState(false); // For Full-Screen functionality
  const [isGridView, setIsGridView] = useState(false); // For Grid View functionality
  const [isDownloading, setIsDownloading] = useState(false); // For Download loader

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!jwtToken) {
          throw new Error("No JWT token found. Please log in.");
        }

        const response = await axios.get(
          `${baseUrl}/generated-images/${productID}`,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        const data = response.data;
        setUpdatedJson(data); // Ensure updatedJson is set correctly

        const imageContent = JSON.parse(data.imageContent);
        const { elements, imagelayoutsize } = imageContent;

        const layoutSize = imagelayoutsize
          ? parseInt(imagelayoutsize.split("*")[0])
          : 1080;
        setImageLayoutSize(layoutSize);

        const processedElements = processElements(elements);

        setElements(processedElements); // Ensure elements are set properly
        setLoading(false); // Loading complete

        // Update templates array with the initial elements
        setTemplates([processedElements]); // Initialize templates with the fetched template
      } catch (error) {
        console.error("Failed to fetch product details.", error);
      }
    };

    // Check if there is restored JSON in location.state
    if (location.state?.json) {
      const restoredJson = location.state.json;
      setUpdatedJson(restoredJson); // Set the restored JSON

      const restoredElements = restoredJson.imageContent
        ? JSON.parse(restoredJson.imageContent).elements
        : [];

      setElements(restoredElements); // Render the elements from the restored JSON
      setTemplates([restoredElements]); // Initialize templates with the restored template
      setLoading(false); // Loading complete
    } else {
      // If no restored JSON, fetch from server
      fetchProductDetails();
    }
  }, [productID, location.state]);

  // Helper function to process elements
  const processElements = (elements) => {
    return elements.map((element) => {
      const {
        type,
        position,
        size,
        style = {},
        zIndex,
        id,
        src,
        content,
        fillColor,
        rotation,
      } = element;

      let updatedElement = {
        id,
        type,
        position: { x: position?.x || 0, y: position?.y || 0 },
        size: {
          width: size?.width || (type === "text" ? "100%" : 100),
          height: size?.height || (type === "text" ? "auto" : 100),
        },
        rotation: rotation || 0, // Ensure rotation is preserved
        style: { zIndex: zIndex || 1 },
      };
      if (type === "svg") {
        updatedElement = {
          ...updatedElement,
          component: element.component || "", // Retrieve the SVG markup if available
          fillColor: fillColor || "#082A66", // Apply fill color
          style: {
            ...updatedElement.style,
            opacity: style.opacity ?? 1,
          },
        };
      } else if (type === "background") {
        // Determine the background image source
        let backgroundImage = "none";
        if (style.backgroundImage && style.backgroundImage !== "none") {
          backgroundImage = style.backgroundImage;
        } else if (style.background && style.background !== "none") {
          backgroundImage = style.background;
        }

        // Determine the background color
        let backgroundColor = "transparent";
        if (backgroundImage === "none" || !backgroundImage) {
          // No background image, use background color if available
          backgroundColor = style.backgroundColor || "transparent";
        } else {
          // Background image exists, set background color to 'transparent'
          backgroundColor = "transparent";
        }

        updatedElement.style = {
          ...updatedElement.style,
          backgroundImage,
          backgroundColor,
          backgroundSize: style.backgroundSize || "cover",
          backgroundPosition: style.backgroundPosition || "center",
          backgroundRepeat: style.backgroundRepeat || "no-repeat",
          opacity: style.opacity || 1,
        };
      } else if (type === "image") {
        updatedElement.src = src;
      } else if (type === "button") {
        // Specific button properties
        updatedElement.content = content;
        updatedElement.style = {
          ...updatedElement.style,
          fontSize: style.fontSize || "16px",
          padding: style.padding || "10px",
          borderRadius: style.borderRadius || "5px",
          color: style.color || "#FFFFFF",
          backgroundColor: style.backgroundColor || "#007BFF",
          boxShadow: style.boxShadow || "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add default shadow if not set
          whiteSpace: "nowrap", // Ensure text is on a single line
        };
      } else if (type === "text") {
        const color = Array.isArray(style.color)
          ? `rgb(${style.color.join(",")})`
          : style.color || "#000000";
        const backgroundColor = style.backgroundColor || "transparent";

        updatedElement.content = content;

        updatedElement.style = {
          ...updatedElement.style,
          fontSize: style.fontSize || "16px",
          fontFamily: style.fontFamily || "Arial",
          whiteSpace: style.whiteSpace || "normal",
          wordWrap: style.wordWrap || "break-word",
          textAlign: "center",
          color,
          backgroundColor: style.backgroundColor || "transparent", // Default to transparent if not provided
          ...style, // Spread all other styles from the `style` object
        };
      }

      if (id === "CTAElement") {
        const bgColor = Array.isArray(style.backgroundColor)
          ? `rgb(${style.backgroundColor.join(",")})`
          : style.backgroundColor || "#007BFF";
        updatedElement.style = {
          ...updatedElement.style,
          backgroundColor: bgColor,
          padding: style.padding || "10px",
          borderRadius: style.borderRadius || "5px",
        };
      }

      return updatedElement;
    });
  };

  // Update elements and templates
  const updateElements = (newElements) => {
    setHistory((prevHistory) => [...prevHistory, elements]);
    setElements(newElements);
    setFuture([]); // Clear future when a new action is made

    // Update templates array with the new elements for the active template
    setTemplates((prevTemplates) => {
      const newTemplates = [...prevTemplates];
      newTemplates[activeTemplateIndex] = newElements;
      return newTemplates;
    });
  };

  useEffect(() => {
    if (activeElement && activeElement.style) {
      // If opacity is defined, use it, otherwise default to 1 (100% transparency)
      const opacityValue =
        activeElement.style.opacity !== undefined ? activeElement.style.opacity : 1;
      setTransparency(opacityValue * 100);

      // Set color, default to white if not defined
      setSelectedColor(activeElement.style.color || "#FFFFFF");
    }
  }, [activeElement]);

  // Function to handle adding a new text element from TextAdder
  // const handleAddText = (newElement) => {
  //   newElement.id = `element${nextElementId}`;
  //   setNextElementId(nextElementId + 1);
  //   newElement.rotation = 0; // Initialize rotation
  //   newElement.style = { ...newElement.style, zIndex: elements.length + 1 }; // Set initial zIndex
  //   updateElements([...elements, newElement]); // Append new text element to the existing elements
  // };

  const handleAddText = (newElement) => {
    newElement.id = `element${nextElementId}`;
    setNextElementId(nextElementId + 1);
    newElement.rotation = 0; // Initialize rotation
    newElement.style = {
      ...newElement.style,
      zIndex: elements.length + 1, // Set initial zIndex
      color: "#082A66", // Set default color
    };
    updateElements([...elements, newElement]); // Append new text element to the existing elements
  };
  

  // Function to handle adding a shape
  const handleAddShape = (shape) => {
    const uniqueId = `${shape.name}-${Date.now()}`; // Ensure each shape has a unique name

    const newShapeElement = {
      type: "shape",
      name: uniqueId, // Store the unique name
      component: shape.component,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 200 },
      rotation: 0, // Initialize rotation
      style: {
        color: "#fff",
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "100px",
        zIndex: elements.length + 1,
      },
    };
    updateElements([...elements, newShapeElement]);
  };

  const handleAddSVG = (svgContent, name) => {
    const newSVGElement = {
      type: "svg",
      id: `svgElement-${name}`, // Unique identifier based on the SVG id and timestamp
      name: name, // Use the provided name in the format `id-timestamp`
      component: svgContent, // Set SVG content
      position: { x: 50, y: 50 }, // Default position
      size: { width: 200, height: 200 }, // Default size
      rotation: 0, // Initialize rotation
      fillColor: "#082A66", // Default fill color
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 1,
        zIndex: elements.length + 1, // Set zIndex
      },
    };

    updateElements([...elements, newSVGElement]); // Add the SVG element to the elements array
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
    updateElements([...elements, newFrameElement]);
    setSelectedFrame(frame);
  };

  // Function to handle adding a new image element from ImageSearchLayout
  const handleAddImage = (imageUrl) => {
    const newImageElement = {
      type: "image",
      src: imageUrl,
      position: { x: 50, y: 50 }, // Default position for the image
      size: { width: 200, height: 200 }, // Default size for the image
      rotation: 0, // Initialize rotation
      style: {
        zIndex: elements.length + 1, // Initial zIndex based on the current number of elements
      },
    };
    updateElements([...elements, newImageElement]); // Add the selected image as a new element
  };

  // Function to handle double-click on text element to edit
  const handleDoubleClickText = (index) => {
    setEditingTextIndex(index);
    setSelectedElementIndex(index); // Mark the selected element
  };

  const handleTextChange = (e, index) => {
    const newElements = [...elements];
    newElements[index].content = e.target.textContent;
    updateElements(newElements);
  };

  // To handle formatting from the TextFormatToolbar
  const handleTextFormatting = (styleProperty, value) => {
    if (selectedElementIndex !== null) {
      const newElements = [...elements];

      // Check if the selected element is a shape or text and apply the color accordingly
      if (
        newElements[selectedElementIndex].type === "text" ||
        newElements[selectedElementIndex].type === "shape"
      ) {
        newElements[selectedElementIndex].style[styleProperty] = value; // Apply formatting for both text and shape
      }

      updateElements(newElements);
    }
  };

  // Handler for color change
  const handleColorChange = (color) => {
    setSelectedColor(color); // Update selected color

    if (selectedElementIndex !== null) {
      updateElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        // If the selected element is a background, apply color and clear bgImageURL
        if (updatedElement.type === "background") {
          updatedElement.style = {
            ...updatedElement.style,
            backgroundColor: color,
          };
          updatedElement.bgImageURL = null; // Clear the background image
        } else if (updatedElement.type === "svg") {
          updatedElement.fillColor = color; // Update fill color property
        } else if (updatedElement.type === "shape") {
          updatedElement.style.color = color; // Change color for shapes
        } else if (updatedElement.type === "text" || updatedElement.type === "button") {
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
      updateElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        // Apply the gradient to the background or text
        if (updatedElement.type === "background") {
          updatedElement.style.backgroundColor = gradientColor;
          updatedElement.bgImageURL = null; // Clear the background image
        } else if (
          updatedElement.type === "text" ||
          updatedElement.type === "button"
        ) {
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
      updateElements((prevElements) => {
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
    updateElements((prevElements) => {
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
      updateElements(newElements);

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
      updateElements(newElements);

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

    if (draggedIndex !== "") {
      const draggedElement = elements[parseInt(draggedIndex)];

      if (draggedElement?.type === "image") {
        updateElements((prevElements) => {
          const newElements = [...prevElements];
          if (newElements[frameIndex].type === "frame") {
            newElements[frameIndex].content = draggedElement.src;
            newElements.splice(parseInt(draggedIndex), 1);
          }
          return newElements;
        });
      }
    } else if (e.dataTransfer.files.length > 0) {
      // Handle external file drop
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        updateElements((prevElements) => {
          const newElements = [...prevElements];
          if (newElements[frameIndex]?.type === "frame") {
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

  const handleExport = async () => {    
    setIsDownloading(true); // Show loader
    try {
      // Clear active states before exporting
      setSelectedElementIndex(null); // Clear selection
      setActiveComponent(null); // Clear active component
      setActiveMenu(null); // Clear active design menu
      setTooltip({ ...tooltip, visible: false }); // Hide tooltip

      setSelectedElementIndex(null); // Clear selection

      const node = templateRef.current;
      const originalZoom = zoom; // Store the original zoom value
      setZoom(1); // Set zoom to 1 for capturing the original size

      setTimeout(async () => {
        // Generate the latest JSON
        generateNewElementsJSON();
        console.log("New elements JSON generated:", elements);

        const dataUrl = await domtoimage.toPng(node, {
          width: imageLayoutSize, // Use specific image layout size
          height: imageLayoutSize,
          style: {
            transformOrigin: "0 0",
          },
          cacheBust: true,
        });

        if (!updatedJson) {
          throw new Error("Updated JSON is missing or null.");
        }

        // Convert the image data URL to a blob
        const blob = await (await fetch(dataUrl)).blob();
        const formData = new FormData();
        formData.append("file", blob, "template_image.png"); // Attach the image as 'file'
        console.log("FormData:", formData);

        // Upload the image to the server
        const uploadResponse = await axios.post(
          `${baseUrl}/sparkiq/image/upload?customerId=123`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.status === 201) {
          console.log("Image uploaded successfully");

          const uploadedImageUrl = uploadResponse.data.data.url; // Extract the uploaded image URL

          // Parse the imageContent from the updated JSON
          let existingContent = updatedJson.imageContent
            ? JSON.parse(updatedJson.imageContent)
            : {};

          // Update elements with additional properties for bgElement, if needed
          const updatedElements = elements.map((element) => {
            if (element.id === "bgElement") {
              const { backgroundImage, backgroundColor } = element.style || {};
              return {
                ...element,
                style: {
                  ...element.style,
                  backgroundImage: backgroundImage || "none",
                  backgroundColor: backgroundColor || "transparent",
                  backgroundSize: element.style.backgroundSize || "cover",
                  backgroundPosition: element.style.backgroundPosition || "center",
                  backgroundRepeat: element.style.backgroundRepeat || "no-repeat",
                  opacity: element.style.opacity ?? 1,
                },
              };
            }
            return element;
          });

          const newImageContent = {
            ...existingContent,
            elements: updatedElements, // Merge updated elements
            generatedImage: uploadedImageUrl, // Set the uploaded image URL
          };

          const updatedContent = {
            ...updatedJson,
            imageContent: JSON.stringify(newImageContent),
            generatedImage: uploadedImageUrl,
            updatedAt: new Date().toISOString(),
          };

          console.log("Prepared content for review:", updatedContent);

          // Post the updated JSON content to the server
          await axios.post(`${baseUrl}/generated-images`, updatedContent, {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });

          console.log("Template updated successfully!");

          // Pass the generated image and updated JSON to PreviewTemplate
          // navigate("/preview", {
          //   state: { image: dataUrl, json: updatedContent, productID },
          // });
          const link = document.createElement('a');
          
          link.href = dataUrl;
          link.download = 'template.png';
          link.click();
        }
        setIsDownloading(false); // Hide loader
        setZoom(originalZoom); // Restore the original zoom
      }, 100); // Adjust the timeout as needed
    } catch (error) {
      console.error("Failed to prepare export content:", error);
    }
  };
  const handleExportClick = () => {
    if (activeTemplateIndex === 0) {
      // Assuming "Template1" is at index 0
      handleExport();
    } else {
      handleDownload();
    }
  };

  useEffect(() => {
    if (location.state?.json) {
      const restoredJson = location.state.json;
      setUpdatedJson(restoredJson); // Set the restored JSON

      const restoredElements = restoredJson.imageContent
        ? JSON.parse(restoredJson.imageContent).elements
        : [];

      setElements(restoredElements); // Render the elements from the restored JSON
    }
  }, [location.state]);

  const handleSaveAndNext = async () => {
    try {
      generateNewElementsJSON(); // Generate the latest JSON
      console.log("New elements JSON generated:", elements);

      setSelectedElementIndex(null);

      const node = templateRef.current;
      const dataUrl = await domtoimage.toPng(node, {
        width: node.offsetWidth,
        height: node.offsetHeight,
        cacheBust: true,
      });

      if (!updatedJson) {
        throw new Error("Updated JSON is missing or null.");
      }

      // Convert the image data URL to a blob
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append("file", blob, "template_image.png"); // Attach the image as 'file'

      console.log("FormData:", formData);

      // Upload the image to the server
      const uploadResponse = await axios.post(
        `${baseUrl}/sparkiq/image/upload?customerId=123`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.status === 201) {
        console.log("Image uploaded successfully");

        const uploadedImageUrl = uploadResponse.data.data.url; // Extract the uploaded image URL

        // Parse the imageContent from the updated JSON
        let existingContent = updatedJson.imageContent
          ? JSON.parse(updatedJson.imageContent)
          : {};

        // Replace the generatedImage URL in the parsed content
        existingContent.generatedImage = uploadedImageUrl;

        // Update the JSON object with the modified imageContent
        const newImageContent = {
          ...existingContent,
          elements: elements, // Ensure elements are up-to-date
        };

        const updatedContent = {
          ...updatedJson,
          imageContent: JSON.stringify(newImageContent), // Stringify the updated content
          generatedImage: uploadedImageUrl, // Update the top-level generatedImage field
          updatedAt: new Date().toISOString(),
        };

        console.log("Updated content for POST:", updatedContent);

        // Post the updated JSON content to the server
        await axios.post(`${baseUrl}/generated-images`, updatedContent, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });

        console.log("Template updated successfully!");

        // Navigate to the next page with the generated image data
        navigate("/CustomSample", {
          state: { image: dataUrl },
        });
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Network Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      console.error("Failed to update the template:", error);
    }
  };

  const generateNewElementsJSON = () => {
    const newElementsJSON = elements.map((element) => {
      // Ensure the name and ID are correctly assigned based on the type
      let uniqueId = element.id;
      let uniqueName = element.name;
      const timestamp = Date.now();

      // Generate new IDs only for new shapes, SVGs, and frames
      if (element.type === "shape") {
        uniqueId = `shapeElement`;
        uniqueName = `shape-${timestamp}`;
      } else if (element.type === "frame") {
        uniqueId = `frameElement`;
        uniqueName = `frame-${timestamp}`;
      }

      // Exclude SVG content (component field) while keeping other properties
      let jsonElement = {
        id: uniqueId,
        name: uniqueName,
        type: element.type,
        position: element.position,
        size: element.size,
        style: element.style,
        src: element.src,
        content: element.content,
      };

      // For SVG elements, keep only essential fields (excluding the component/SVG markup)
      if (element.type === "svg") {
        jsonElement = {
          ...jsonElement,
          fillColor: element.fillColor, // Keep fill color
          svgId: element.name, // Use a unique identifier for the SVG
        };
      }
      // Check if the element is the background element
      if (element.id === "bgElement" || element.type === "background") {
        // Get the original background element from updatedJson
        const existingContent = updatedJson.imageContent
          ? JSON.parse(updatedJson.imageContent)
          : {};
        const originalElements = existingContent.elements || [];
        const originalBgElement = originalElements.find(
          (el) => el.id === element.id || el.type === "background"
        );

        // Get the original and current background colors
        const originalBgColor = originalBgElement?.style?.backgroundColor || "";
        const currentBgColor = element.style.backgroundColor || "";

        // If the backgroundColor has changed, and is not 'transparent', set backgroundImage to null
        if (
          originalBgColor !== currentBgColor &&
          currentBgColor !== "transparent"
        ) {
          element.style.backgroundImage = null;
        }
      }

      return {
        id: uniqueId,
        name: uniqueName,
        type: element.type,
        position: element.position,
        size: element.size,
        style: element.style,
        src: element.src,
        content: element.content,
      };
    });

    const updatedContent = {
      ...updatedJson, // Merge with existing JSON
      elements: newElementsJSON, // Update elements
    };

    setUpdatedJson(updatedContent); // Store updated JSON
    console.log("Updated JSON:", JSON.stringify(updatedContent, null, 2));
  };

  // Function to handle Delete Element
  const handleDeleteElement = () => {
    if (selectedElementIndex !== null) {
      updateElements((prevElements) => {
        const newElements = [...prevElements];
        const selectedElement = newElements[selectedElementIndex];

        if (selectedElement.type === "background") {
          // Clear background image if the element is a background
          selectedElement.bgImageURL = null;
          selectedElement.style.backgroundColor = "#FFFFFF"; // Reset to white background
        } else {
          // Remove the selected element from the list
          newElements.splice(selectedElementIndex, 1);
        }

        return newElements;
      });

      setSelectedElementIndex(null);
    }
  };

  // Undo function
  const handleUndo = () => {
    if (history.length > 0) {
      const previousElements = history[history.length - 1];
      setHistory(history.slice(0, history.length - 1));
      setFuture([elements, ...future]);
      setElements(previousElements);

      // Update templates array with the previous elements
      setTemplates((prevTemplates) => {
        const newTemplates = [...prevTemplates];
        newTemplates[activeTemplateIndex] = previousElements;
        return newTemplates;
      });
    }
  };

  // Redo function
  const handleRedo = () => {
    if (future.length > 0) {
      const nextElements = future[0];
      setFuture(future.slice(1));
      setHistory([...history, elements]);
      setElements(nextElements);

      // Update templates array with the next elements
      setTemplates((prevTemplates) => {
        const newTemplates = [...prevTemplates];
        newTemplates[activeTemplateIndex] = nextElements;
        return newTemplates;
      });
    }
  };

  // Keydown event listener for deleting elements and undo/redo
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

      // Undo (Ctrl+Z or Command+Z)
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key === "z"
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

      // Existing delete logic
      const isDeleteKey =
        event.key === "Delete" ||
        (event.key === "Backspace" && event.target === document.body);

      if (isDeleteKey && selectedElementIndex !== null) {
        const element = elements[selectedElementIndex];
        const isTextElement = element.type === "text";
        const isEditable =
          editingTextIndex !== null &&
          editingTextIndex === selectedElementIndex;

        if (!isTextElement || !isEditable) {
          handleDeleteElement();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedElementIndex,
    editingTextIndex,
    elements,
    handleUndo,
    handleRedo,
  ]);

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
    if (
      selectedElementIndex !== null &&
      elementRefs.current[selectedElementIndex]
    ) {
      const elementNode =
        elementRefs.current[selectedElementIndex].resizableElement.current;
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
      updateElements((prevElements) => {
        const updatedElements = [...prevElements];
        const updatedElement = updatedElements[selectedElementIndex];

        if (!updatedElement.style) {
          updatedElement.style = {};
        }

        switch (positionAction) {
          case "forward":
            updatedElement.style.zIndex = (updatedElement.style.zIndex || 1) + 1;
            break;
          case "backward":
            updatedElement.style.zIndex = Math.max(
              (updatedElement.style.zIndex || 1) - 1,
              1
            );
            break;
          case "toFront":
            updatedElement.style.zIndex =
              Math.max(...updatedElements.map((el) => el.style?.zIndex || 1)) +
              1;
            break;
          case "toBack":
            updatedElement.style.zIndex = 1; // Move to the back
            break;
          default:
            break;
        }
        return updatedElements;
      });
    }
  };

  const handleButtonTextKeyDown = (e, index) => {
    if ((e.key === "Delete" || e.key === "Backspace") && editingTextIndex === index) {
      // Check if the content is empty
      const isContentEmpty = elements[index].content.trim() === "";

      if (isContentEmpty) {
        // If content is empty, remove the button element
        updateElements((prevElements) => {
          const updatedElements = [...prevElements];
          updatedElements.splice(index, 1); // Remove the button element
          return updatedElements;
        });
        setEditingTextIndex(null); // Clear editing index
      } else {
        // Prevent deletion of the whole button while editing content
        e.stopPropagation();
      }
    }
  };

  // Function to handle align element
  const handleAlignElement = (alignType) => {
    if (selectedElementIndex !== null) {
      updateElements((prevElements) => {
        const updatedElements = [...prevElements];
        const element = updatedElements[selectedElementIndex];

        const templateArea = templateRef.current.getBoundingClientRect(); // Get the template area dimensions
        const elementSize = element.size || { width: 100, height: 100 }; // Default size if not specified

        switch (alignType) {
          case "top":
            element.position.y = 0;
            break;
          case "left":
            element.position.x = 0;
            break;
          case "center":
            element.position.x =
              (templateArea.width - elementSize.width * zoom) / 2 / zoom;
            break;
          case "middle":
            element.position.y =
              (templateArea.height - elementSize.height * zoom) / 2 / zoom;
            break;
          case "right":
            element.position.x =
              (templateArea.width - elementSize.width * zoom) / zoom;
            break;
          case "bottom":
            element.position.y =
              (templateArea.height - elementSize.height * zoom) / zoom;
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

  // Function to handle Download
  const handleDownload = async () => {
    setIsDownloading(true); // Show loader
    try {
      const node = templateRef.current;
      const dataUrl = await domtoimage.toPng(node, {
        width: imageLayoutSize, // Use specific image layout size
        height: imageLayoutSize,
        style: {
          transformOrigin: "0 0",
        },
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = dataUrl;
      link.click();
      setIsDownloading(false); // Hide loader
    } catch (error) {
      console.error("Failed to download image", error);
      setIsDownloading(false); // Hide loader
    }
  };

  // Function to handle Full-Screen toggle
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Function to handle Grid View toggle
  const handleGridViewToggle = () => {
    setIsGridView(!isGridView);
    if (!isGridView) {
      setActiveComponent(""); // Close active component panel when entering grid view
    }
  };

  // Function to handle adding a new template
  // const handleAddTemplate = () => {
  //   const newTemplate = [];
  //   setTemplates((prev) => [...prev, newTemplate]);
  //   setActiveTemplateIndex(templates.length);
  //   setElements(newTemplate);
  // };

  const handleAddTemplate = () => {
    const backgroundElement = {
      id: "bgElement",
      type: "background",
      position: { x: 0, y: 0 },
      size: {
        width: imageLayoutSize,
        height: imageLayoutSize,
      },
      style: {
        backgroundColor: "#FFFFFF", // White background
        // ...other styles
      },
    };
    const newTemplate = [backgroundElement];
    setTemplates((prev) => [...prev, newTemplate]);
    setActiveTemplateIndex(templates.length);
    setElements(newTemplate);
  };
  

  // Function to handle selecting a template from grid view
  const handleTemplateSelect = (index) => {
    setActiveTemplateIndex(index);
    setElements(templates[index] || []);
    setIsGridView(false);
  };

  // Template Preview Component
  const TemplatePreview = ({ elements }) => {
    const previewSize = 200; // Size of the preview
    const zoomLevel = previewSize / imageLayoutSize;

    return (
      <div
        className="template-preview"
        style={{
          width: previewSize,
          height: previewSize,
          position: "relative",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: imageLayoutSize,
            height: imageLayoutSize,
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
          }}
        >
          {elements.map((element, index) => {
            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  transformOrigin: "center",
                }}
              >
                {element.type === "image" ? (
                  <img
                    src={element.src}
                    alt="element"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : element.type === "text" ? (
                  <div
                    style={{
                      fontSize: element.style.fontSize,
                      color: element.style.color,
                    }}
                  >
                    {element.content}
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
                      fontSize: element.style.fontSize,
                    }}
                  >
                    {element.component}
                  </div>
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
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen p-2 bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex flex-col items-center justify-center ${
        isFullscreen ? "fixed inset-0 p-0 m-0" : ""
      }`}
    >
      {isDownloading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Loader */}
          <div className="loader">Downloading...</div>
          {/* You can use a spinner or any loading indicator here */}
        </div>
      )}
      <div
        className={`border-2 border-white rounded-[20px] w-full overflow-hidden relative ${
          isFullscreen ? "fixed inset-0 m-0 border-none rounded-none" : ""
        }`}
        style={{ height: isFullscreen ? "100vh" : "calc(100vh - 1rem)" }}
      >
        {/* Header */}
        {!isFullscreen && (
          <div className="flex justify-between items-center bg-[rgba(252,252,252,0.40)] rounded-t-[20px] p-3 w-full">
            <span className="flex items-center gap-2">
              <img src="/icon5.svg" alt="Icon" />
              <span className="flex flex-col">
                <h4 className="text-[#082A66] font-bold text-xl">
                  Template Customization
                </h4>
                <p className="text-[#374151] text-sm">
                  Customize your ad based on your preferences.
                </p>
              </span>
            </span>
            <div
              className="flex items-center justify-end p-4 rounded-md mt-1"
              style={{ height: "6vh" }}
            >
              {editingTextIndex !== null &&
                (activeElement?.type === "text" ||
                  activeElement?.type === "cta") && (
                  <TextFormatToolbar
                    fontFamily={activeElement?.style?.fontFamily || "Sans Serif"}
                    fontSize={activeElement?.style?.fontSize || "16px"}
                    fontColor={activeElement?.style?.color || "#000000"}
                    onClose={() => setEditingTextIndex(null)}
                    onTextFormatting={handleTextFormatting} // Pass the function
                  />
                )}

              <div className="flex">
                {/* Conditionally render DesignMenu only if TextFormatToolbar is not open */}
                {editingTextIndex === null && (
                  <DesignMenu
                    activeMenu={activeMenu}
                    setActiveMenu={handleDesignMenu}
                    transparency={transparency}
                    handleTransparencyChange={handleTransparencyChange}
                  />
                )}

                <button
                  onClick={() => navigate("/campaigns")}
                  className="flex bg-red-500 text-white py-1 px-4 rounded mr-2"
                >
                  Close
                </button>
                {/* <button
                  onClick={handleExport}
                  className="custom-button text-white py-1 px-4 rounded"
                >
                  Export
                </button> */}
                <button
                  onClick={handleSaveAndNext}
                  className="custom-button text-white py-1 px-4 rounded"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex">
          {/* Main Sidebar */}
          {!isFullscreen && (
            <div className="p-4 w-1/12">
              <Sidebar_Edit
                setActiveComponent={handleSidebarComponent}
                setShowAdCreatives={() => {}}
              />
            </div>
          )}
          <div className="flex-row relative w-full m-4 ml-0">
            <div
              className="flex justify-center relative shadow-lg rounded-md overflow-auto hide-scrollbar"
              style={{ height: isFullscreen ? "100%" : "calc(100vh - 11rem)" }}
            >
              {/* Conditionally render sidebar components based on activeComponent */}
              {!isFullscreen && !isGridView && activeComponent === "Creatives" && (
                <div className="w-2/5 m-4 shadow-sm rounded-md">
                  <AdCreatives />
                </div>
              )}

              {!isFullscreen && !isGridView && activeComponent === "Text" && (
                <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40]">
                  <TextAdder onAddText={handleAddText} />
                </div>
              )}
              {/* Show ImageUploadLayout when Uploads component is active */}
              {!isFullscreen &&
                !isGridView &&
                activeComponent === "Uploads" && (
                  <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                    <ImageUploadLayout onSelectImage={handleAddImage} />{" "}
                    {/* Pass the handleAddImage callback */}
                  </div>
                )}

              {!isFullscreen &&
                !isGridView &&
                activeComponent === "Images" && (
                  <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar  bg-[#FCFCFC40]">
                    <ImageSearchLayout onSelectImage={handleAddImage} />{" "}
                    {/* Pass the handleAddImage callback */}
                  </div>
                )}

              {!isFullscreen &&
                !isGridView &&
                activeComponent === "Shapes" && (
                  <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                    {/* <ShapeStyleLayout handleAddShape={handleAddShape} /> */}
                    <DesignElements handleAddSVG={handleAddSVG} />
                    <OutlineElements handleAddSVG={handleAddSVG} />
                    <StarElements handleAddSVG={handleAddSVG} />
                    <BlobElements handleAddSVG={handleAddSVG} />
                    <SunburstElements handleAddSVG={handleAddSVG} />

                    {/* <GeometricalElements handleAddSVG={handleAddSVG} /> */}
                    <ArrowElements handleAddSVG={handleAddSVG} />
                    {/* 
                      <BrushedElements handleAddSVG={handleAddSVG} />
                      <RibbonElements handleAddSVG={handleAddSVG} />
                      <ShapeWithSVG handleAddSVG={handleAddSVG} />
                      <LabelElements handleAddSVG={handleAddSVG} />
                      <BadgesShieldElements handleAddSVG={handleAddSVG} />
                      <SpeechBubblesElements handleAddSVG={handleAddSVG} />
                       */}
                  </div>
                )}

              {!isFullscreen &&
                !isGridView &&
                activeComponent === "Frames" && (
                  <div className="w-1/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                    <FramesComponent onSelectFrame={handleFrameSelect} />
                  </div>
                )}

              {!isFullscreen && !isGridView && activeMenu === "color" && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <ColorMenu handleColorChange={handleColorChange} />
                </div>
              )}

              {!isFullscreen &&
                !isGridView &&
                activeMenu === "gradientColor" &&
                (activeElement?.type === "text" ||
                  activeElement?.type === "background" ||
                  activeElement?.type === "button") && (
                  <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                    <GradientColorMenu
                      handleGradientColorChange={handleGradientColorChange}
                    />
                  </div>
                )}

              {!isFullscreen && !isGridView && activeMenu === "position" && (
                <div className="w-1/4 m-4 p-4 shadow-sm rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
                  <PositionMenu
                    handlePositionChange={handlePositionChange}
                    handleAlignElement={handleAlignElement} // Pass this function
                  />
                </div>
              )}

              {isGridView ? (
                <div
                  className="grid grid-cols-3 gap-4 p-4 overflow-y-auto"
                  style={{
                    height: "50%",
                    marginTop: !isFullscreen ? "8%" : "0",
                  }}
                >
                  {templates.map((templateElements, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-md p-4 cursor-pointer ${
                        index === activeTemplateIndex
                          ? "border-purple-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleTemplateSelect(index)}
                    >
                      <TemplatePreview elements={templateElements} />
                    </div>
                  ))}
                  <div
                    className="border-2 border-dashed rounded-md bg-white p-4 flex items-center justify-center cursor-pointer"
                    onClick={handleAddTemplate}
                  >
                    <MdAddCircle size={32} />
                  </div>
                </div>
              ) : (
                <div
                  className="shadow-sm justify-center mx-auto my-auto mt-4 w-full h-full overflow-auto"
                  style={getScaledSize()}
                  ref={templateContainerRef}
                >
                  <div
                    className="template-area p-4 overflow-hidden"
                    onClick={(e) => {
                      if (
                        e.target === templateRef.current ||
                        e.target === templateContainerRef.current
                      ) {
                        setSelectedElementIndex(0); // Select the background
                      }
                    }}
                    style={{
                      height: `${imageLayoutSize * zoom}px`,
                      width: `${imageLayoutSize * zoom}px`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",

                      // Apply gradient or image correctly
                      backgroundImage: elements[0]?.style?.backgroundColor?.includes(
                        "gradient"
                      )
                        ? elements[0].style.backgroundColor // Use gradient directly
                        : elements[0]?.style?.backgroundImage
                        ? `url(${elements[0].style.backgroundImage
                            .replace("url(", "")
                            .replace(")", "")})`
                        : "none", // No image or gradient, default to none

                      // Apply solid color when no gradient or image is present
                      backgroundColor: elements[0]?.style?.backgroundColor?.includes(
                        "gradient"
                      )
                        ? "transparent" // Avoid overlap if a gradient is applied
                        : elements[0]?.style?.backgroundColor || "transparent", // Use solid color if available

                      backgroundBlendMode:
                        elements[0]?.style?.backgroundImage ||
                        elements[0]?.style?.backgroundColor?.includes("gradient")
                          ? "overlay"
                          : "normal",

                      backgroundSize: elements[0]?.style?.backgroundImage
                        ? "cover"
                        : "auto",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                    }}
                    ref={templateRef}
                  >
                    {/* Render each element */}
                    {loading ? (
                      <p>Loading elements...</p>
                    ) : (
                      elements.map((element, index) => {
                        // Skip rendering the background as an individual element
                        if (element.type === "background") return null;

                        const isEditable = !isFullscreen;

                        return (
                          <Rnd
                            key={index}
                            ref={(ref) => (elementRefs.current[index] = ref)}
                            size={{
                              width:
                                element.size?.width * zoom ||
                                element.size?.width * zoom ||
                                "auto",
                              height:
                                element.size?.height * zoom ||
                                element.size?.height * zoom ||
                                "auto",
                            }}
                            position={{
                              x: element.position.x * zoom,
                              y: element.position.y * zoom,
                            }}
                            onClick={(e) => {
                              if (isEditable) {
                                e.stopPropagation();
                                setSelectedElementIndex(index);
                              }
                            }}
                            onDoubleClick={(e) => {
                              if (isEditable) {
                                e.stopPropagation();
                                handleDoubleClickText(index);
                              }
                            }} // Double-click to edit text
                            onDragStart={(e) => e.stopPropagation()}
                            onDragStop={(e, d) => {
                              if (
                                element.type !== "background" &&
                                isEditable
                              ) {
                                handleElementDragStop(e, d, index);
                              }
                            }}
                            onResize={(e, direction, ref, delta) =>
                              isEditable &&
                              handleElementResize(e, direction, ref, delta, index)
                            } // Resize dynamically
                            onResizeStop={(e, direction, ref, delta) =>
                              isEditable &&
                              handleResizeStop(e, direction, ref, delta, index)
                            } // Finalize resizing
                            enableResizing={
                              element.type !== "background" && isEditable
                                ? undefined
                                : false
                            }
                            disableDragging={
                              element.type === "background" || !isEditable
                            }
                            style={{
                              border:
                                selectedElementIndex === index
                                  ? "2px solid #4A90E2"
                                  : "none",
                              zIndex: element.style?.zIndex || 1, // Apply zIndex to the element
                            }}
                            // Only allow drop on frames
                            onDragOver={(e) => {
                              if (element.type === "frame") {
                                e.preventDefault(); // Allow drop
                                e.stopPropagation(); // Prevent propagation
                              }
                            }}
                            onDrop={(e) => {
                              if (element.type === "frame") {
                                e.preventDefault(); // Prevent default behavior
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
                              {selectedElementIndex === index && isEditable && (
                                <div
                                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 cursor-grab"
                                  onMouseDown={(e) =>
                                    handleRotationDragStart(e, index)
                                  }
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
                                {/* Render the content of the element */}
                                {element.type === "image" ? (
                                  // Render Image Element
                                  <img
                                    src={element.src}
                                    alt="element"
                                    draggable={true}
                                    onDragStart={(e) => {
                                      e.stopPropagation(); // Prevent event propagation
                                      e.dataTransfer.setData(
                                        "application/element-index",
                                        index.toString()
                                      );
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
                                      backgroundColor:
                                        element.style.backgroundColor ||
                                        "transparent",
                                      color: element.style.color || "#082A66",
                                      fontSize: element.style.fontSize || "100px",
                                      zIndex: element.style?.zIndex || 1,
                                    }}
                                  >
                                    {element.component}{" "}
                                    {/* Render the shape component */}
                                  </div>
                                ) : element.type === "button" ? (
                                  // Render the CTA as a button
                                  <button
                                    contentEditable={editingTextIndex === index} // Enable text editing on double-click
                                    onDoubleClick={() => setEditingTextIndex(index)} // Set editing index on double-click
                                    onBlur={(e) => handleTextBlur(index, e)} // Handle text blur event
                                    onInput={(e) => handleTextChange(e, index)} // Update content on input change
                                    onKeyDown={(e) =>
                                      handleButtonTextKeyDown(e, index)
                                    } // Use specific keydown handler for button text
                                    suppressContentEditableWarning={true} // Suppress contentEditable warning
                                    style={{
                                      ...element.style,
                                      fontSize: `${
                                        parseFloat(element.style.fontSize) * zoom
                                      }px`,
                                      padding: element.style.padding || "12px 24px",
                                      //borderRadius: "4px",
                                      color: element.style.color || "#FFFFFF",
                                      backgroundColor:
                                        element.style.backgroundColor || "#007BFF",
                                      cursor: "default",
                                      width: "100%",
                                      height: "100%",
                                      // whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textAlign: "center",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      boxSizing: "border-box",
                                      boxShadow: `
                                        0px 6px 10px rgba(0, 0, 0, 0.10),  
                                        inset 0px 2px 5px rgba(0, 0, 0, 0.10)
                                      `,
                                      zIndex: element.style?.zIndex || 1,
                                    }}
                                  >
                                    {element.content}
                                  </button>
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
                                    key={index}
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
                                      fontSize: `${
                                        parseFloat(element.style.fontSize) * zoom
                                      }px`, // Adjust font size based on zoom
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
                      w: {Math.round(tooltip.width)}px h:{" "}
                      {Math.round(tooltip.height)}px
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Footer */}
          {!isFullscreen && (
            <div className="absolute bottom-0 left-0 right-0 bg-[rgba(252,252,252,0.40)] p-2 flex justify-end items-center rounded-b-[20px] mb-0">
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
                <MdGridView size={20} />{" "}
                {isGridView ? "Exit Grid" : "Grid View"}
              </button>
              <button
                onClick={handleExportClick}
                className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-2 mx-2"
              >
                <MdDownload size={20} /> Download
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
                  onClick={() => {
                    const newZoom = Math.max(zoom - 0.1, 0.1);
                    setZoom(newZoom);
                  }}
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
                  onClick={() => {
                    const newZoom = zoom + 0.1;
                    setZoom(newZoom);
                  }}
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
            <div className="absolute top-0 left-0 right-0 p-2 flex justify-end items-center">
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
    </div>
  );
}
