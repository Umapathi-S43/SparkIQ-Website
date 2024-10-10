import React, { useState } from 'react';

const ColorMenu = ({ handleColorChange }) => {
  const [customColor, setCustomColor] = useState('#FFFFFF'); // State for real-time color picker

  const solidColors = [
    '#000000', '#FFFFFF', '#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF', '#00FFFF', '#FFCC00', '#FF6666',
    '#C70039', '#900C3F', '#581845', '#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#2ECC71',
    '#1ABC9C', '#3498DB', '#9B59B6', '#34495E', '#F1C40F', '#E67E22', '#E74C3C', '#ECF0F1', '#95A5A6', '#7F8C8D',
  ];

  const gradientColors = [
     // Pink Gradients
     'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)',
     'linear-gradient(45deg, #fcb69f 0%, #ff7eb3 100%)',
     'linear-gradient(45deg, #fdc830 0%, #f37335 100%)',
 
     // Red Gradients
     'linear-gradient(45deg, #ff9966 0%, #ff5e62 100%)',
     'linear-gradient(45deg, #ff6a00 0%, #ee0979 100%)',
     'linear-gradient(45deg, #ff512f 0%, #dd2476 100%)',
 
     // Orange Gradients
     'linear-gradient(45deg, #ff9a9e 0%, #ff7e5f 100%)',
     'linear-gradient(45deg, #f7b733 0%, #fc4a1a 100%)',
     'linear-gradient(45deg, #f09819 0%, #edde5d 100%)',
 
     // Green Gradients
     'linear-gradient(45deg, #38ef7d 0%, #11998e 100%)',
     'linear-gradient(45deg, #56ab2f 0%, #a8e063 100%)',
     'linear-gradient(45deg, #3bb78f 0%, #0bab64 100%)',
 
     // Canva-like Gradients
     'linear-gradient(45deg, #a1c4fd 0%, #c2e9fb 100%)',
     'linear-gradient(45deg, #fddb92 0%, #d1fdff 100%)',
     'linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%)',
 
     // Yellow Gradients
     'linear-gradient(45deg, #fddb92 0%, #ffebd4 100%)',
     'linear-gradient(45deg, #ffe259 0%, #ffa751 100%)',
     'linear-gradient(45deg, #fcff9e 0%, #c67700 100%)',
 
     // Blue Gradients
     'linear-gradient(45deg, #89f7fe 0%, #66a6ff 100%)',
     'linear-gradient(45deg, #56ccf2 0%, #2f80ed 100%)',
     'linear-gradient(45deg, #00c6ff 0%, #0072ff 100%)',
 
     // Light Blue Gradients
     'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
     'linear-gradient(45deg, #83a4d4 0%, #b6fbff 100%)',
     'linear-gradient(45deg, #72c2ff 0%, #bed1ff 100%)',
 
    'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(45deg, #fad0c4 0%, #ffd1ff 100%)',
    'linear-gradient(45deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(45deg, #fddb92 0%, #d1fdff 100%)',
    'linear-gradient(45deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(45deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(45deg, #fddb92 0%, #d1fdff 100%)',
    'linear-gradient(45deg, #fc00ff, #00dbde)',
    'linear-gradient(45deg, #11998e, #38ef7d)',
    'linear-gradient(45deg, #ff9966, #ff5e62)',
    'linear-gradient(45deg, #56ccf2, #2f80ed)',
    'linear-gradient(45deg, #a18cd1, #fbc2eb)',
  ];

  // Function to handle custom color change
  const handleCustomColorChange = (event) => {
    const color = event.target.value;
    setCustomColor(color);
    handleColorChange(color); // Apply the custom color
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <span className="block mb-2 font-semibold">Select Color</span>
      
      {/* Solid Colors Section */}
      <div className="mt-2">
        <span className="block mb-2 font-semibold">Solid Colors</span>
        <div className="color-palette grid grid-cols-6 gap-2">
          {solidColors.map((color, index) => (
            <button
              key={index}
              className="color-option"
              style={{
                background: color,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '5px',
                border: '1px solid #ccc',
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Gradient Colors Section */}
      <div className="mt-4">
        <span className="block mb-2 font-semibold">Gradient Colors</span>
        <div className="color-palette grid grid-cols-6 gap-2">
          {gradientColors.map((color, index) => (
            <button
              key={index}
              className="color-option"
              style={{
                background: color,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '5px',
                border: '1px solid #ccc',
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="mt-4">
        <span className="block mb-2 font-semibold">Custom Color Picker</span>
        <input
          type="color"
          value={customColor}
          onChange={handleCustomColorChange}
          className="w-full h-10 cursor-pointer"
          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
};

export default ColorMenu;
