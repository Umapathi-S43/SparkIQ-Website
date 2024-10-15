import React, { useState } from 'react';

const GradientColorMenu = ({ handleGradientColorChange }) => {
  const [customColor, setCustomColor] = useState('#C70039'); // State for real-time color picker

  const gradientColors = [
    // Pink Gradients
    'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(45deg, #fcb69f 0%, #ff7eb3 100%)',
    'linear-gradient(45deg, #ff758c 0%, #ff7eb3 100%)',
    'linear-gradient(45deg, #ff6f91 0%, #ffa69e 100%)',
    'linear-gradient(45deg, #ff9a8b 0%, #fecfef 100%)',

    // Red Gradients
    'linear-gradient(45deg, #ff9966 0%, #ff5e62 100%)',
    'linear-gradient(45deg, #ff6a00 0%, #ee0979 100%)',
    'linear-gradient(45deg, #ff4e50 0%, #f9d423 100%)',
    'linear-gradient(45deg, #ff0844 0%, #ffb199 100%)',
    'linear-gradient(45deg, #ff512f 0%, #dd2476 100%)',

    // Orange Gradients
    'linear-gradient(45deg, #f7b733 0%, #fc4a1a 100%)',
    'linear-gradient(45deg, #f09819 0%, #edde5d 100%)',
    'linear-gradient(45deg, #ff9a9e 0%, #ff7e5f 100%)',
    'linear-gradient(45deg, #ffb347 0%, #ffcc33 100%)',
    'linear-gradient(45deg, #f857a6 0%, #ff5858 100%)',

    // Yellow Gradients
    'linear-gradient(45deg, #fddb92 0%, #ffebd4 100%)',
    'linear-gradient(45deg, #ffe259 0%, #ffa751 100%)',
    'linear-gradient(45deg, #fcff9e 0%, #c67700 100%)',
    'linear-gradient(45deg, #fceabb 0%, #f8b500 100%)',
    'linear-gradient(45deg, #f7ff00 0%, #db36a4 100%)',

    // Green Gradients
    'linear-gradient(45deg, #38ef7d 0%, #11998e 100%)',
    'linear-gradient(45deg, #56ab2f 0%, #a8e063 100%)',
    'linear-gradient(45deg, #3bb78f 0%, #0bab64 100%)',
    'linear-gradient(45deg, #add100 0%, #7b920a 100%)',
    'linear-gradient(45deg, #b7f8db 0%, #50a7c2 100%)',

    // Blue Gradients
    'linear-gradient(45deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(45deg, #56ccf2 0%, #2f80ed 100%)',
    'linear-gradient(45deg, #00c6ff 0%, #0072ff 100%)',
    'linear-gradient(45deg, #36d1dc 0%, #5b86e5 100%)',
    'linear-gradient(45deg, #73c8a9 0%, #373b44 100%)',

    // Light Blue Gradients
    'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(45deg, #83a4d4 0%, #b6fbff 100%)',
    'linear-gradient(45deg, #72c2ff 0%, #bed1ff 100%)',
    'linear-gradient(45deg, #7f7fd5 0%, #86a8e7 100%)',
    'linear-gradient(45deg, #2193b0 0%, #6dd5ed 100%)',

    // Purple Gradients
    'linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(45deg, #a770ef 0%, #cf8bf3 100%)',
    'linear-gradient(45deg, #aa076b 0%, #61045f 100%)',
    'linear-gradient(45deg, #c471f5 0%, #fa71cd 100%)',
    'linear-gradient(45deg, #c31432 0%, #240b36 100%)',

    // Brown Gradients
    'linear-gradient(45deg, #d1913c 0%, #ffd194 100%)',
    'linear-gradient(45deg, #b79891 0%, #94716b 100%)',
    'linear-gradient(45deg, #b06ab3 0%, #4568dc 100%)',
    'linear-gradient(45deg, #603813 0%, #b29f94 100%)',
    'linear-gradient(45deg, #eacda3 0%, #d6ae7b 100%)',

    // Teal Gradients
    'linear-gradient(45deg, #00d2ff 0%, #3a7bd5 100%)',
    'linear-gradient(45deg, #13547a 0%, #80d0c7 100%)',
    'linear-gradient(45deg, #2bc0e4 0%, #eaecc6 100%)',
    'linear-gradient(45deg, #1fa2ff 0%, #12d8fa 100%)',
    'linear-gradient(45deg, #159957 0%, #155799 100%)',

    // Gray Gradients
    'linear-gradient(45deg, #bdc3c7 0%, #2c3e50 100%)',
    'linear-gradient(45deg, #e0eafc 0%, #cfdef3 100%)',
    'linear-gradient(45deg, #757f9a 0%, #d7dde8 100%)',
    'linear-gradient(45deg, #c9d6ff 0%, #e2e2e2 100%)',
    'linear-gradient(45deg, #e6e9f0 0%, #eef1f5 100%)',

    // Black and White Gradients
    'linear-gradient(45deg, #000000 0%, #434343 100%)',
    'linear-gradient(45deg, #e6e9f0 0%, #eef1f5 100%)',
    'linear-gradient(45deg, #000000 0%, #0f9b0f 100%)',
    'linear-gradient(45deg, #232526 0%, #414345 100%)',
    'linear-gradient(45deg, #bdc3c7 0%, #2c3e50 100%)',

    // Rainbow Gradients
    'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(45deg, #ff6a88 0%, #fdc830 100%)',
    'linear-gradient(45deg, #ff9966 0%, #ff5e62 100%)',
    'linear-gradient(45deg, #f7ff00 0%, #db36a4 100%)',
    'linear-gradient(45deg, #00c6ff 0%, #0072ff 100%)',

    // Sunset Gradients
    'linear-gradient(45deg, #ff7e5f 0%, #feb47b 100%)',
    'linear-gradient(45deg, #e96443 0%, #904e95 100%)',
    'linear-gradient(45deg, #f2994a 0%, #f2c94c 100%)',
    'linear-gradient(45deg, #de6161 0%, #2657eb 100%)',
    'linear-gradient(45deg, #fc5c7d 0%, #6a82fb 100%)',

    // Pastel Gradients
    'linear-gradient(45deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(45deg, #fddb92 0%, #d1fdff 100%)',

    'linear-gradient(45deg, #7FFF00 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #3BB78F 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #FFD700 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #8B008B 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #FF1493 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #9400D3 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #00008B 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #800000 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #99CCFF 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #B0E0E6 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #E0FFFF 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #6495ED 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #00FFFF 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #40E0D0 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #0ABAB5 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #002D62 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #26619C 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #5D8AA8 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #002147 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #4B0082 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #007BA7 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #007FFF 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #5C7D8E 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #0047AB 0%, #FFFFFF 100%)',
    'linear-gradient(45deg, #191970 0%, #FFFFFF 100%)',
    'linear-gradient(145deg, #0F52BA 0%, #FFFFFF 100%)',
     // Gradients for each color with white
  'linear-gradient(45deg, #7FFF00 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #7FFF00 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #7FFF00 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #7FFF00 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #3BB78F 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #3BB78F 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #3BB78F 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #3BB78F 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #FFD700 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #FFD700 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #FFD700 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #FFD700 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #8B008B 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #8B008B 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #8B008B 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #8B008B 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #FF1493 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #FF1493 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #FF1493 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #FF1493 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #9400D3 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #9400D3 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #9400D3 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #9400D3 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #00008B 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #00008B 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #00008B 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #00008B 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #800000 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #800000 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #800000 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #800000 0%, #FFFFFF 100%)',

  'linear-gradient(45deg, #99CCFF 0%, #FFFFFF 100%)',
  'linear-gradient(145deg, #99CCFF 0%, #FFFFFF 100%)',
  'linear-gradient(60deg, #99CCFF 0%, #FFFFFF 100%)',
  'linear-gradient(120deg, #99CCFF 0%, #FFFFFF 100%)',

  // Gradients for each color with gray
  'linear-gradient(45deg, #7FFF00 0%, #808080 100%)',
  'linear-gradient(145deg, #7FFF00 0%, #808080 100%)',
  'linear-gradient(60deg, #7FFF00 0%, #808080 100%)',
  'linear-gradient(120deg, #7FFF00 0%, #808080 100%)',

  'linear-gradient(45deg, #3BB78F 0%, #808080 100%)',
  'linear-gradient(145deg, #3BB78F 0%, #808080 100%)',
  'linear-gradient(60deg, #3BB78F 0%, #808080 100%)',
  'linear-gradient(120deg, #3BB78F 0%, #808080 100%)',

  'linear-gradient(45deg, #FFD700 0%, #808080 100%)',
  'linear-gradient(145deg, #FFD700 0%, #808080 100%)',
  'linear-gradient(60deg, #FFD700 0%, #808080 100%)',
  'linear-gradient(120deg, #FFD700 0%, #808080 100%)',

  'linear-gradient(45deg, #8B008B 0%, #808080 100%)',
  'linear-gradient(145deg, #8B008B 0%, #808080 100%)',
  'linear-gradient(60deg, #8B008B 0%, #808080 100%)',
  'linear-gradient(120deg, #8B008B 0%, #808080 100%)',

  // Additional combinations of the solid colors
  'linear-gradient(45deg, #FF1493 0%, #FFD700 100%)',
  'linear-gradient(145deg, #FF1493 0%, #FFD700 100%)',
  'linear-gradient(60deg, #FF1493 0%, #FFD700 100%)',
  'linear-gradient(120deg, #FF1493 0%, #FFD700 100%)',

  'linear-gradient(45deg, #9400D3 0%, #3BB78F 100%)',
  'linear-gradient(145deg, #9400D3 0%, #3BB78F 100%)',
  'linear-gradient(60deg, #9400D3 0%, #3BB78F 100%)',
  'linear-gradient(120deg, #9400D3 0%, #3BB78F 100%)',

  'linear-gradient(45deg, #00008B 0%, #FFD700 100%)',
  'linear-gradient(145deg, #00008B 0%, #FFD700 100%)',
  'linear-gradient(60deg, #00008B 0%, #FFD700 100%)',
  'linear-gradient(120deg, #00008B 0%, #FFD700 100%)',

  'linear-gradient(45deg, #800000 0%, #99CCFF 100%)',
  'linear-gradient(145deg, #800000 0%, #99CCFF 100%)',
  'linear-gradient(60deg, #800000 0%, #99CCFF 100%)',
  'linear-gradient(120deg, #800000 0%, #99CCFF 100%)',

  ];

  const solidColors = [
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

  // Function to handle custom color change
  const handleCustomColorChange = (event) => {
    const color = event.target.value;
    setCustomColor(color);
    handleGradientColorChange(color); // Apply the custom color
  };

  return (
    <div className="p-4 bg-[#FCFCFC40] rounded-md shadow-md">
      <span className="block font-semibold">Select Background Color</span>
      <div className="mt-4">
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
              onClick={() => handleGradientColorChange(color)}
            />
          ))}
          {solidColors.map((color, index) => (
            <button
              key={`solid-${index}`}
              className="color-option"
              style={{
                backgroundColor: color,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '5px',
                border: '1px solid #ccc',
              }}
              onClick={() => handleGradientColorChange(color)}
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

export default GradientColorMenu;
