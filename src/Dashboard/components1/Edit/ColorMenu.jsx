import React from 'react';

const ColorMenu = ({ handleColorChange }) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <span>Select Color</span>
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
              margin: '5px',
            }}
            onClick={() => handleColorChange(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorMenu;
