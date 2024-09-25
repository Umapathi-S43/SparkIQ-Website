import React from 'react';
import { RxTransparencyGrid } from 'react-icons/rx';
import { MdColorLens } from 'react-icons/md';
import { FaLayerGroup } from 'react-icons/fa';
import TransparencyMenu from './TransparencyMenu';

const DesignMenu = ({ activeMenu, setActiveMenu, transparency, handleTransparencyChange }) => {    
    // Toggle the active menu (similar to the sidebar)
    const toggleMenu = (menu) => {
      setActiveMenu(activeMenu === menu ? null : menu); // Toggle or deactivate if clicked again
    };
  
    return (
      <div className="flex flex-row items-center gap-4 mr-4">
        {/* Transparency button */}
        <div className="relative">
          {/* Transparency button */}
          <button
            className={`flex flex-row items-center gap-2 text-lg rounded w-full ${activeMenu === 'transparency' ? 'bg-gray-300 p-1' : ''}`}
            onClick={() => toggleMenu('transparency')}
          >
            <RxTransparencyGrid size={24} />
          </button>
  
          {/* Render the TransparencyMenu just below the button */}
          {activeMenu === 'transparency' && (
            <div className="absolute top-full left-0 mt-2 p-4 w-auto shadow-sm rounded-md h-auto bg-[#082A66] z-50">
              <TransparencyMenu 
                transparency={transparency} 
                handleTransparencyChange={handleTransparencyChange} 
              />
            </div>
          )}
        </div>
  

      {/* Color button */}
      <button
        className={`flex flex-row items-center gap-2 text-lg rounded w-full ${activeMenu === 'color' ? 'bg-gray-300 p-1' : ''}`}
        onClick={() => toggleMenu('color')}
      >
        <MdColorLens size={28} />
      </button>

      {/* Position button */}
      <button
        className={`flex flex-row items-center gap-2 text-lg rounded w-full ${activeMenu === 'position' ? 'bg-gray-300 p-1' : ''}`}
        onClick={() => toggleMenu('position')}
      >
        <FaLayerGroup size={24} />
      </button>
    </div>
  );
};

export default DesignMenu;
