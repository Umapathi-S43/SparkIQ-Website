import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTextHeight, FaImage, FaShapes, FaRegImages, FaUpload } from "react-icons/fa";
import { Rnd } from "react-rnd";
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";
import html2canvas from 'html2canvas';


export default function EditTemplate1() {
  const [elements, setElements] = useState([]);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null); // Track selected element
  const [imageLayoutSize, setImageLayoutSize] = useState(1080); // Default size
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(0.45); // Zoom level
  const [tooltip, setTooltip] = useState({ visible: false, width: 0, height: 0, x: 0, y: 0 });
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
            position: { x: 0, y: 0 },
            size: { width: 540, height: 540 }
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


  const handleZoomChange = (e) => {
    setZoom(e.target.value / 100);
  };

  const getScaledSize = () => {
    const scaledWidth = imageLayoutSize * zoom;
    const scaledHeight = imageLayoutSize * zoom;

    return { width: scaledWidth, height: scaledHeight };
  };

  const handleElementResize = (e, direction, ref, delta, index) => {
    setTooltip({
      visible: true,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      x: ref.getBoundingClientRect().left + window.scrollX,
      y: ref.getBoundingClientRect().top + window.scrollY,
    });

    const newElements = [...elements];
    newElements[index].size = {
      width: ref.offsetWidth / zoom,
      height: ref.offsetHeight / zoom,
    };
    setElements(newElements);
  };

  const handleElementDragStop = (e, d, index) => {
    setTooltip({
      visible: true,
      x: d.x,
      y: d.y,
    });

    const newElements = [...elements];
    newElements[index].position = { x: d.x / zoom, y: d.y / zoom };
    setElements(newElements);

    // Deselect the element after it's placed
    setSelectedElementIndex(null);
  };

  const handleResizeStop = (e, direction, ref, delta, index) => {
    handleElementResize(e, direction, ref, delta, index);
    setSelectedElementIndex(null); // Deselect element after resize
    setTooltip({ ...tooltip, visible: false }); // Hide tooltip after resizing
  };

  const adjustTooltipPosition = () => {
    const tooltipX = tooltip.x;
    const tooltipY = tooltip.y;
    const tooltipWidth = tooltip.width;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (tooltipX + tooltipWidth > windowWidth) {
      return { left: windowWidth - tooltipWidth - 10, top: tooltipY };
    } else if (tooltipY + 30 > windowHeight) {
      return { left: tooltipX, top: windowHeight - 40 };
    }
    return { left: tooltipX, top: tooltipY };
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
            <Sidebar setActiveComponent={() => {}} setShowAdCreatives={() => {}} />
          </div>
          <div className="flex-row relative w-full m-4 ml-0">
            <div className="flex items-center justify-end p-4 w-full bg-[#FCFCFC40] shadow-lg rounded-md mt-1" style={{ height: "8vh" }}>
            <div className="flex">
                <button onClick={() => navigate("/campaigns")} className="flex bg-red-500 text-white py-1 px-4 rounded mr-2">Close</button>
                <button onClick={handleExport} className="custom-button text-white py-1 px-4 rounded mr-2">Export</button>
                <button onClick={handleSaveAndNext} className="custom-button text-white py-1 px-4 rounded">Save & Next</button>
              </div>
            </div>
            <div className="flex justify-center relative shadow-lg rounded-md overflow-auto hide-scrollbar" style={{ height: "calc(100vh - 12rem)" }}>
              <div className="shadow-sm justify-center bg-striped mx-auto my-auto mt-4 w-full h-full overflow-auto hide-scrollbar" style={getScaledSize()}>
              <div
  className="bg-stripped p-4"
  style={{
    height: `${imageLayoutSize * zoom}px`,
    width: `${imageLayoutSize * zoom}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: productDetails?.bgImageURL ? `url(${productDetails.bgImageURL})` : 'none',
    backgroundSize: "cover", // Make sure the background covers the whole area
    backgroundPosition: "center", // Center the background
    backgroundRepeat: "no-repeat", // Ensure the background does not repeat
    position: "relative", // Keep the position relative to contain the elements
  }}
  ref={templateRef}
>
  {loading ? (
    <p>Loading elements...</p>
  ) : (
    elements.map((element, index) => (
      <Rnd
        key={index}
        size={{ width: element.size?.width * zoom || "auto", height: element.size?.height * zoom || "auto" }}
        position={{ x: element.position.x * zoom, y: element.position.y * zoom }}
        onClick={() => setSelectedElementIndex(index)}
        onDragStop={(e, d) => handleElementDragStop(e, d, index)}
        onResizeStop={(e, direction, ref, delta) => handleResizeStop(e, direction, ref, delta, index)}
        bounds="parent"
        style={{
          border: selectedElementIndex === index ? "2px solid #4A90E2" : "none",
        }}
      >
        {element.type === "image" ? (
          <img src={element.src} alt="element" style={{ width: "100%", height: "100%" }} />
        ) : (
          <div
            style={{
              ...element.style,
              fontSize: `${parseFloat(element.style.fontSize) * zoom}px`,
            }}
          >
            {element.contentFormatted ? element.contentFormatted : element.content}
          </div>
        )}
      </Rnd>
    ))
  )}
</div>

                {tooltip.visible && (
                  <div
                    className="absolute bg-black text-white px-2 py-1 rounded"
                    style={adjustTooltipPosition()}
                  >
                    w: {tooltip.width} h: {tooltip.height}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4 flex justify-center mt-4 fixed bottom-0 p-2 shadow-md">
          <input
            type="range"
            min="10"
            max="500"
            value={zoom * 100}
            onChange={handleZoomChange}
            className="slider flex justify-end"
            style={{ width: '150px' }}
          />
          <span className="zoom-percentage" style={{ marginRight: '-4px' }}>{Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

const Sidebar = ({ setActiveComponent, setShowAdCreatives }) => {
  return (
    <div className="flex flex-col items-center p-3 rounded-[12px] bg-[#FCFCFC40] shadow-lg" style={{ height: 'calc(100vh - 8rem)' }}>
      <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => {
        setActiveComponent('Creatives');
        setShowAdCreatives(true);
      }}>
        <img src="/icon5.svg" alt="Icon" className="w-8 h-8" />
        <span className="text-sm">Creatives</span>
      </button>
      <div className="flex flex-col items-center justify-center space-y-2 mt-4">
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Text')}>
          <FaTextHeight />
          <span className="text-sm">Text</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Image')}>
          <FaImage />
          <span className="text-sm">Image</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Shape')}>
          <FaShapes />
          <span className="text-sm">Shape</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full" onClick={() => setActiveComponent('Frame')}>
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
