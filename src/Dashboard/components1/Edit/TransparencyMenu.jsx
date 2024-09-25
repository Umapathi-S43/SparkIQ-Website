import React from 'react';

const TransparencyMenu = ({ transparency, handleTransparencyChange }) => {
    return (
      <div className="p-3 bg-white rounded-md shadow-md">
        {/* Flexbox to place text and value on the same line */}
        <div className="flex justify-between items-center">
          <span>Transparency</span>
          <span>{transparency}%</span>
        </div>
        {/* Slider placed on the next line */}
        <input
          type="range"
          min="0"
          max="100"
          value={transparency}
          onChange={handleTransparencyChange}
          className="w-full"
        />
      </div>
    );
  };
  

export default TransparencyMenu;
