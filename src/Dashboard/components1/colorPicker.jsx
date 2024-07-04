import React, { useRef, useEffect, useState } from 'react';
import { FaEyeDropper, FaChevronDown, FaTint } from 'react-icons/fa';

const Picker = ({ color, onChangeComplete }) => {
  const [hue, setHue] = useState(0);
  const [currentColor, setCurrentColor] = useState({ r: 255, g: 0, b: 0, hex: '#ff0000' });
  const [colorPosition, setColorPosition] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const canvasRef = useRef(null);
  const hueCanvasRef = useRef(null);
  const hueDiskRef = useRef(null);

  const drawPalette = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const gradientBlack = ctx.createLinearGradient(0, 0, 0, height);
    gradientBlack.addColorStop(0, 'transparent');
    gradientBlack.addColorStop(1, 'black');
    ctx.fillStyle = gradientBlack;
    ctx.fillRect(0, 0, width, height);
  };

  const drawHueBar = () => {
    const canvas = hueCanvasRef.current;
    const ctx = canvas.getContext('2d');
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
    drawHueBar();
  }, []);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
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
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    setHue(Math.round((x / rect.width) * 360));
  };

  const handleHueMouseDown = (e) => {
    document.addEventListener('mousemove', handleHueChange);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleHueChange);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (component) => component.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setTimeout(() => {
      drawPalette();
      drawHueBar();
    }, 0);
  };

  return (
    <div className="rounded-2xl flex justify-center shadow-lg" style={{ backgroundColor: 'rgba(252, 252, 252, 0.50)', borderColor: '#FFFFFF', width: '430px' }}>
      <div className="flex flex-col items-center m-2 bg-white shadow-md rounded-xl p-4" style={{ borderColor: '#CFCBDC', width: '420px' }}>
        <div className="flex items-center mb-4 w-full">
          <div className="flex items-center justify-center bg-[#1E1154] rounded-full mr-2" style={{ width: '24px', height: '24px', backgroundColor: 'rgba(30, 17, 84, 0.15)' }}>
            <FaTint className="text-[#082A66]" />
          </div>
          <h2 className="text-xl font-normal text-[#082A66]">Select Color</h2>
        </div>
        <div className="border p-2 rounded-lg bg-white" style={{ borderColor: '#CFCBDC' }}>
          <div className="relative w-full mb-4">
            <div className="flex items-center mb-2 cursor-pointer" onClick={toggleDropdown}>
              <FaEyeDropper className="text-black mr-2" />
              <h3 className="text-lg font-normal text-[#082A66]">Select Custom Color</h3>
              <FaChevronDown className="text-blue-800 ml-auto" />
            </div>
            {isDropdownOpen && (
              <>
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={110}
                  onClick={handleCanvasClick}
                  className="border p-1 rounded-xl cursor-pointer mb-2"
                  style={{ borderColor: '#CFCBDC' }}
                ></canvas>
                <div
                  className="absolute"
                  style={{
                     // Adjusted to center circle on cursor
                    top:colorPosition.y,
                     left: colorPosition.x, // Adjusted to center circle on cursor
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    pointerEvents: 'none',
                  }}
                ></div>
                <div className="relative w-full mb-4">
                  <canvas
                    ref={hueCanvasRef}
                    width={380}
                    height={12}
                    onMouseDown={handleHueMouseDown}
                    className="border rounded-lg cursor-pointer mb-2"
                    style={{ borderColor: '#CFCBDC' }}
                  ></canvas>
                  <div
                    ref={hueDiskRef}
                    className="absolute"
                    style={{
                      top: -1, // Adjusted to better align with the hue bar
                      left: (hue / 360) * 380 - 7,
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: 'white',
                      border: '2px solid white',
                      pointerEvents: 'none',
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between items-center w-full space-x-2">
            <div className="flex items-center justify-between p-2 rounded-lg border w-full" style={{ borderColor: '#CFCBDC' }}>
              <span className="text-sm font-medium text-gray-700">HEX</span>
              <span className="text-lg font-semibold text-gray-900 pr-8">{currentColor.hex}</span>
            </div>
            <div className="flex items-center justify-between p-2 mr-2 rounded-lg border w-full" style={{ borderColor: '#CFCBDC' }}>
              <span className="text-sm font-medium text-gray-700">RGB</span>
              <span className="text-lg font-semibold text-gray-900 pr-8">{`${currentColor.r} ${currentColor.g} ${currentColor.b}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Picker;
