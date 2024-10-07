import React from 'react';

const TextAdder = ({ onAddText }) => {
  const handleAddText = (type) => {
    let textElement;
    switch (type) {
      case 'heading':
        textElement = {
          type: 'text',
          content: 'Add a heading',
          style: {
            fontSize: '72px', // Example size for heading
            fontFamily: 'Arial',
            color: '#FCFCFC',
          },
          position: { x: 50, y: 50 }, // Default position
          size: { width: 520, height: 120 }, // Default size
        };
        break;
      case 'subheading':
        textElement = {
          type: 'text',
          content: 'Add a subheading',
          style: {
            fontSize: '52px', // Example size for subheading
            fontFamily: 'Arial',
            fontWeight: 'normal',
            color: '#FCFCFC',
          },
          position: { x: 50, y: 100 }, // Default position
          size: { width: 600, height: 80 }, // Default size
        };
        break;
      case 'body':
        textElement = {
          type: 'text',
          content: 'Add a little bit of body text',
          style: {
            fontSize: '44px', // Example size for body text
            fontFamily: 'Arial',
            fontWeight: 'normal',
            color: '#FCFCFC',
          },
          position: { x: 50, y: 150 }, // Default position
          size: { width: 560, height: 70 }, // Default size
        };
        break;
      case 'default-text':
        textElement = {
          type: 'text',
          content: 'Add a text',
          style: {
            fontSize: '44px',
            fontFamily: 'Arial',
            fontWeight: 'normal',
            color: '#FCFCFC',
          },
          position: { x: 50, y: 150 }, // Default position
          size: { width: 600, height: 90 }, // Default size
        };
        break;
      default:
        return; // This ensures the function exits if no valid type is provided
    }
    onAddText(textElement); // Trigger the addition of the element in the template area
  };

  return (
    <div className="border shadow-md p-4 text-[#082A66] gap-4 rounded-lg">
      <div>
        <button
          className="font-semibold text-xl shadow-sm rounded-lg p-2 mb-2 w-full custom-button text-white border-2"
          onClick={() => handleAddText('default-text')}
        >
          <span style={{ fontWeight: 'bold', fontSize: '22px', fontFamily: 'Arial' }}>T</span> Add a text box
        </button>
      </div>
      <h3 className="font-semibold text-xl pb-2 mt-5">Default text styles</h3>
      <button
        className="font-semibold text-xl border-2 border-[#FCFCFC] shadow-sm rounded-lg p-4 mb-2 w-full hover:bg-[#9A9A9A99] hover:text-white"
        onClick={() => handleAddText('heading')}
      >
        Add a heading
      </button>
      <button
        className="font-semibold text-lg border-2 border-[#FCFCFC]  shadow-sm p-3 w-full rounded-lg mb-2 hover:bg-[#9A9A9A99] hover:text-white"
        onClick={() => handleAddText('subheading')}
      >
        Add a subheading
      </button>
      <button
        className="font-semibold text-md border-2 border-[#FCFCFC]  shadow-sm p-2 w-full rounded-lg mb-2 hover:bg-[#9A9A9A99] hover:text-white transition-all duration-300 ease-in-out"
        onClick={() => handleAddText('body')}
      >
        Add a little bit of body text
      </button>
    </div>
  );
};

export default TextAdder;
