import React from 'react';

const TransparencyMenu = ({ transparency, handleTransparencyChange }) => {
  const handleInputChange = (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value))); // Ensure the value stays between 0 and 100
    handleTransparencyChange({ target: { value } });
  };

  return (
    <div className="p-3 bg-white rounded-md shadow-md px-4">
      {/* Flexbox to place slider and input field on the same line */}
      <span className="mr-4">Transparency</span>
      <div className="flex items-center">
        
        {/* Slider input */}
        <input
          type="range"
          min="0"
          max="100"
          value={transparency}
          onChange={handleTransparencyChange}
          className="flex-grow mr-2"
        />
        {/* Numeric input for percentage */}
        <input
          type="number"
          value={transparency}
          onChange={handleInputChange}
          min="0"
          max="100"
          className="w-fit text-center border border-gray-300 rounded-md py-1"
        />
      </div>
    </div>
  );
};

export default TransparencyMenu;
