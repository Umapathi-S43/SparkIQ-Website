import React from 'react';
import { RxTransparencyGrid } from 'react-icons/rx';
import { MdColorLens } from 'react-icons/md';
import { FaLayerGroup } from 'react-icons/fa';
import TransparencyMenu from './TransparencyMenu';
import { BiSolidColorFill } from 'react-icons/bi';

const DesignMenu = ({ activeMenu, setActiveMenu, transparency, handleTransparencyChange }) => {
  // Toggle the active menu (similar to the sidebar)
  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu); // Toggle or deactivate if clicked again
  };

  return (
    <div className="flex flex-row items-center gap-4 mr-4">
      {/* Transparency button with custom tooltip and border */}
      <div className="relative group">
        <button
          className={`flex flex-row items-center gap-2 text-lg rounded-full ${activeMenu === 'transparency' ? 'bg-gray-300 p-1' : ''}`}
          onClick={() => toggleMenu('transparency')}
          style={{
            border: '4px solid #082A66', // Border for transparency button
            padding: '1px', // Adding padding inside the button
            borderRadius: '10%', // Rounded button for better style
          }}
        >
          <RxTransparencyGrid size={20} />
        </button>

        {/* Custom Tooltip positioned at the bottom */}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Transparency
        </span>

        {/* Render the TransparencyMenu just below the button */}
        {activeMenu === 'transparency' && (
          <div className="absolute top-full left-0 mt-2 pt-4 w-auto shadow-sm rounded-md h-auto z-50">
            <TransparencyMenu
              transparency={transparency}
              handleTransparencyChange={handleTransparencyChange}
            />
          </div>
        )}
      </div>

      {/* Fill (Gradient Color) button with custom tooltip */}
      <div className="relative group">
        <button
          className={`flex flex-row items-center gap-2 text-lg rounded-full ${activeMenu === 'gradientColor' ? 'bg-gray-300 p-1' : ''}`}
          onClick={() => toggleMenu('gradientColor')}
        >
          <BiSolidColorFill size={24} />
        </button>

        {/* Custom Tooltip positioned at the bottom */}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Fill
        </span>
      </div>

      {/* Color button with custom tooltip positioned at the bottom */}
      <div className="relative group">
        <button
          className={`flex flex-row items-center gap-2 text-lg rounded-full ${activeMenu === 'color' ? 'bg-gray-300 p-1' : ''}`}
          onClick={() => toggleMenu('color')}
        >
          <div
            className="relative flex items-center justify-center rounded-full w-6 h-6"
            style={{
              backgroundColor: '#FFFFFF', // Use the current selected color
              border: '6px solid #082A66',
            }}
          />
        </button>

        {/* Custom Tooltip positioned at the bottom */}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Color
        </span>
      </div>

      {/* Position button with custom tooltip positioned at the bottom */}
      <div className="relative group">
        <button
          className={`flex flex-row items-center gap-2 text-lg rounded-full ${activeMenu === 'position' ? 'bg-gray-300 p-1' : ''}`}
          onClick={() => toggleMenu('position')}
        >
          <FaLayerGroup size={24} />
        </button>

        {/* Custom Tooltip positioned at the bottom */}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Position
        </span>
      </div>
    </div>
  );
};

export default DesignMenu;
