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
            color: '#082A66',
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
            color: '#082A66',
          },
          position: { x: 50, y: 100 }, // Default position
          size: { width: 600, height: 50 }, // Default size
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
            color: '#082A66',
          },
          position: { x: 50, y: 150 }, // Default position
          size: { width: 500, height: 50 }, // Default size
        };
        break;
      default:
        return;
    }
    onAddText(textElement); // Trigger the addition of the element in the template area
  };

  return (
    <div className="border shadow-md p-4 text-[#082A66]">
      <h3 className="font-semibold text-xl pb-6">Default text styles</h3>
      <button className="font-semibold text-2xl border shadow-sm p-4 w-full" onClick={() => handleAddText('heading')}>Add a heading</button>
      <button className="font-semibold text-xl border shadow-sm p-4 w-full" onClick={() => handleAddText('subheading')}>Add a subheading</button>
      <button className="font-semibold text-lg border shadow-sm p-4 w-full" onClick={() => handleAddText('body')}>Add a little bit of body text</button>
    </div>
  );
};

export default TextAdder;
