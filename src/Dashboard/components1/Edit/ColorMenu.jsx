import React, { useState } from 'react';

const ColorMenu = ({ handleColorChange  }) => {
  const [customColor, setCustomColor] = useState('#C70039'); // State for real-time color picker

  const solidColors = [
    '#000000', '#FFFFFF', '#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF', '#00FFFF', '#FFCC00', '#FF6666',
    '#C70039', '#900C3F', '#581845', '#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845', '#2ECC71',
    '#1ABC9C', '#3498DB', '#9B59B6', '#34495E', '#F1C40F', '#E67E22', '#E74C3C', '#ECF0F1', '#95A5A6', '#7F8C8D',
    '#7FFF00', '#3BB78F', '#FFD700', '#8B008B', '#FF1493', '#9400D3', '#00008B', '#800000',
    '#99CCFF', '#B0E0E6', '#E0FFFF', '#6495ED', '#00FFFF', '#40E0D0', '#0ABAB5', '#002D62', '#26619C',
    '#5D8AA8', '#002147', '#4B0082', '#007BA7', '#007FFF', '#5C7D8E', '#0047AB', '#191970', '#0F52BA',
    '#D2F8FF', '#87CEEB', '#4169E1', '#228B22', '#01796F', '#9DC183', '#708238', '#50C878', '#E6E200',
    '#BFFF00', '#00A86B', '#98FF98', '#7FFF00', '#4F7942', '#4CBB17', '#8A9A5B', '#6B8E23', '#013220',
    '#008080', '#93E9BE', '#9FE2BF', '#AFEEEE', '#40E0D0', '#00FFFF', '#00CFFF', '#39FF14', '#009E60',
    '#008080', '#00755E', '#00CED1', '#DC143C', '#FF0000', '#E32636', '#960018', '#E52B50', '#FF6347',
    '#CF1020', '#CD5C5C', '#FF2400', '#FF7F50', '#FF6FFF', '#660000', '#722F37', '#990000', '#DC143C',
    '#E0115F', '#B22222', '#E30B5D', '#E0115F', '#8E4585', '#FF69B4', '#FF14B4', '#FFB6C1', '#FF69B4',
    '#DE3163', '#D70270', '#FFC0CB', '#FFA6C9', '#C71585', '#DB7093', '#F88379', '#FFB7C5', '#D10056',
    '#7851A9', '#9966CC', '#DA70D6', '#E0B0FF', '#9400D3', '#DF73FF', '#5D3954', '#663399', '#5A4FCF',
    '#DDA0DD', '#9966CC', '#6B3FA0', '#991199', '#FF7518', '#FF4500', '#FF7F00', '#FF8C00', '#FD6A02',
    '#FFA500', '#E9967A', '#FF5733', '#FF5349', '#FFAE42', '#F28500', '#D2691E', '#ED872D', '#FEC200',
    '#FFA700', '#F56C42', '#DAA520', '#DFFF00', '#FFFA66', '#FFF44F', '#FFFACD', '#FFD700', '#FFF8DC',
    '#FFD700', '#FFFF00', '#FFEF00', '#F5DEB3', '#FFEC8B', '#FFEA00', '#FFFDD0', '#FFF5EE', '#FFD700',
    '#F3E5AB', '#FFF8DC', '#F4BB44', '#FFF0F5', '#FFDF00', '#FAF0BE', '#D4AF37', '#FFA700', '#FFC87C',
    '#FFE135', '#FFF8DC', '#FFF5EE', '#FDF5E6', '#FFFDD0', '#FFFACD', '#EAE0C8', '#FFF5EE', '#FAF0BE',
    '#FFF0F5', '#A52A2A', '#604E37', '#D2B48C', '#3B2F2F', '#804000', '#87421F', '#A97142', '#C19A6B',
    '#8B0000', '#5B3A29', '#CD853F', '#8E7618', '#3D0C02', '#5D3A00', '#704214', '#8A3324', '#654321',
    '#C04000', '#704214', '#B87333', '#905D5D', '#778899', '#A9A9A9', '#A9A9A9', '#B0C4DE', '#696969',
    '#708090', '#6B6B6B', '#808080', '#BEBEBE', '#BEBEBE', '#A2B5CD', '#C0C0C0', '#838996', '#C5C1AA',
    '#8B8B83', '#4A708B', '#D3D3D3', '#0C0C0C', '#000080', '#000000', '#0F0F0F', '#282828', '#050505',
    '#1E1E1E', '#171717', '#333333', '#232323', '#0A0A0A', '#000000', '#2C3531', '#101820', '#000000'
 
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
    <div className="p-4 bg-[#FCFCFC40] rounded-md shadow-md">
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

      {/* Gradient Colors Section
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
      </div>*/}

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
