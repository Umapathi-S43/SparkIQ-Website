import React, { useRef, useEffect, useState } from "react";
import drop from "../../assets/dashboard_img/drop.svg";
import pen from "../../assets/dashboard_img/pen.svg";
import { FaChevronDown } from "react-icons/fa";

const Picker = ({ color, onChangeComplete }) => {
  const [hue, setHue] = useState(0);
  const [currentColor, setCurrentColor] = useState({ r: 255, g: 0, b: 0, hex: "#ff0000" });
  const [colorPosition, setColorPosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const canvasRef = useRef(null);
  const hueCanvasRef = useRef(null);
  const hueDiskRef = useRef(null);

  const drawPalette = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    gradient.addColorStop(1, "white");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const gradientBlack = ctx.createLinearGradient(0, 0, 0, height);
    gradientBlack.addColorStop(0, "transparent");
    gradientBlack.addColorStop(1, "black");
    ctx.fillStyle = gradientBlack;
    ctx.fillRect(0, 0, width, height);
  };

  const drawHueBar = () => {
    const canvas = hueCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const hueGradient = ctx.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 360; i++) {
      hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, width, height);
  };

  useEffect(() => {
    drawPalette();
  }, [hue]);
  
  useEffect(() => {
    if (!color) return;
    // Convert the incoming color prop (a hex string) into r,g,b
    const newRgb = hexToRgb(color);
    const newHue = getHueFromRgb(newRgb);
  
    setCurrentColor({ ...newRgb, hex: color });
    setHue(newHue);
    // Move the hue slider disk 
    updateHueDiskPosition(newHue);
  
    // Redraw the palette with the new hue
    drawPalette();
  }, [color]);
  

  useEffect(() => {
    drawHueBar();
    updateHueDiskPosition(hue);
  }, []);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const rgb = { r: imageData[0], g: imageData[1], b: imageData[2] };
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setCurrentColor({ ...rgb, hex });
    setColorPosition({ x, y });
    onChangeComplete({ hex });
  };

  const handleHueChange = (e) => {
    const rect = hueCanvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left; // Get click position relative to canvas

    // Ensure x stays within bounds
    x = Math.min(Math.max(x, 0), rect.width);

    // Convert x position to hue value (0-360 degrees)
    const newHue = Math.round((x / rect.width) * 360);
    setHue(newHue);
    updateHueDiskPosition(x); // Move disk smoothly
    drawPalette();
  };

  // Ensure clicking anywhere on the hue bar updates the hue
  const handleHueClick = (e) => {
    handleHueChange(e);
  };

  // Dragging functionality remains the same
  const handleHueMouseDown = () => {
    document.addEventListener("mousemove", handleHueChange);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleHueChange);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Update hue disk position smoothly
  const updateHueDiskPosition = (x) => {
    if (hueDiskRef.current) {
      hueDiskRef.current.style.transform = `translateX(${x}px)`;
    }
  };


  const rgbToHex = (r, g, b) => {
    const toHex = (component) => component.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return { r, g, b };
  };

  const handleHexInputChange = (e) => {
    // 1) Trim whitespace
    let rawValue = e.target.value.trim();
  
    // 2) Remove all characters except `#`, digits [0-9], and letters [A-Fa-f]
    rawValue = rawValue.replace(/[^#0-9A-Fa-f]/g, "");
  
    // 3) If the user typed multiple "#", keep only the first
    //    This line ensures only one "#" at the beginning
    if (rawValue.indexOf("#") > 0) {
      rawValue = rawValue.replace(/#/g, "");        // remove all "#"
      rawValue = "#" + rawValue;                   // add a single "#" at start
    }
  
    // 4) Limit to 7 total chars => `#` + 6 hex digits 
    //    If you need alpha-channel, use 9 total (# + 8)
    rawValue = rawValue.slice(0, 7);
  
    // 5) If user just typed "#" or cleared input
    if (rawValue === "" || rawValue === "#") {
      setCurrentColor({ r: 0, g: 0, b: 0, hex: rawValue });
      return;
    }
  
    // Now ensure it starts with "#"
    if (!rawValue.startsWith("#")) {
      rawValue = "#" + rawValue;
    }
  
    // 6) If the final string matches a complete hex code, convert to RGB
    //    e.g. "#abc" or "#AABBCC"
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(rawValue)) {
      const rgb = hexToRgb(rawValue);
      setCurrentColor({ ...rgb, hex: rawValue });
      setHue(getHueFromRgb(rgb));
      drawPalette();
      updateHueDiskPosition(getHueFromRgb(rgb));
      onChangeComplete({ hex: rawValue });
    } else {
      // The user is still typing, so just update the `hex` field
      setCurrentColor((prev) => ({ ...prev, hex: rawValue }));
    }
  };
  

  const handleRgbInputChange = (e, channel) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    if (value > 255) value = 255;

    const newRgb = { ...currentColor, [channel]: value };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor({ ...newRgb, hex });
    const newHue = getHueFromRgb(newRgb);
    setHue(newHue);
    updateHueDiskPosition(newHue);
    drawPalette();
    onChangeComplete({ hex });
  };

  const getHueFromRgb = ({ r, g, b }) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue = 0;
    if (max === min) {
      hue = 0;
    } else if (max === r) {
      hue = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
      hue = (b - r) / (max - min) + 2;
    } else if (max === b) {
      hue = (r - g) / (max - min) + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
    return hue;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setTimeout(() => {
      drawPalette();
      drawHueBar();
    }, 0);
  };

  return (
    <div className="picker-container flex flex-col rounded-2xl shadow-lg max-w-md bg-[#FCFCFC40] p-1">
      <div className="picker-content flex flex-col items-center bg-white shadow-md rounded-xl p-4" style={{ borderColor: "#CFCBDC" }}>
        <div className="flex items-center mb-4 w-full">
          <img src={drop} alt="picker" className="w-8 mr-2" />
          <h2 className="text-lg font-normal text-[#082A66]">Select Color</h2>
        </div>
        <div className="border p-3 rounded-lg bg-white w-full" style={{ borderColor: "#CFCBDC" }}>
          <div className="relative w-full mb-4">
            <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
              <img src={pen} alt="dropper" className="w-5 mr-2" />
              <h3 className="text-md font-normal text-[#082A66]">Select Custom Color</h3>
              <FaChevronDown className="text-blue-800 ml-auto" />
            </div>
            {isDropdownOpen && (
              <div className="relative">
                <canvas ref={canvasRef} width={300} height={100} onClick={handleCanvasClick} className="border p-1 rounded-lg cursor-pointer mt-3 w-full" style={{ borderColor: "#CFCBDC" }}></canvas>
                <div className="relative mt-3">
                  <canvas
                    ref={hueCanvasRef}
                    width={300}
                    height={12}
                    onClick={handleHueClick} // Click anywhere to update hue
                    onMouseDown={handleHueMouseDown} // Dragging functionality
                    className="border rounded-lg cursor-pointer w-full"
                    style={{ borderColor: "#CFCBDC" }}
                  ></canvas>
                  <div
                    ref={hueDiskRef}
                    className="absolute h-4 w-4 bg-white rounded-full border border-gray-400"
                    style={{ top: 0, left: "0px", transition: "left 0.1s ease" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex items-center border rounded-lg p-2 w-4/6 mr-2" style={{ borderColor: "#CFCBDC" }}>
              <span className="text-sm font-medium text-gray-700 mr-2">HEX</span>
              <input
                type="text"
                value={currentColor.hex}
                onChange={handleHexInputChange}
                className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none w-full"
                style={{ maxWidth: "80px" }}
              />
            </div>
            <div className="flex items-center border rounded-lg p-2 w-full" style={{ borderColor: "#CFCBDC" }}>
              <span className="text-sm font-medium text-gray-700 mr-2">RGB</span>
              <div className="flex space-x-1">
                {["r", "g", "b"].map((channel) => (
                  <input
                    key={channel}
                    type="number"
                    value={currentColor[channel]}
                    onChange={(e) => handleRgbInputChange(e, channel)}
                    className="text-lg font-semibold text-gray-900 bg-transparent border rounded text-center p-1 w-14"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Picker;
