import React, { useState } from 'react';
import Moveable from 'react-moveable';
import { MdRotateRight } from 'react-icons/md'; // Rotation Icon

export default function EditScreen() {
  const [elements, setElements] = useState([
    {
      id: 1,
      type: 'button',
      content: 'Click Me',
      position: { x: 50, y: 50 },
      size: { width: 150, height: 50 },
      rotation: 0,
    },
    {
      id: 2,
      type: 'image',
      src: 'https://via.placeholder.com/150',
      position: { x: 250, y: 50 },
      size: { width: 150, height: 150 },
      rotation: 0,
    },
    {
      id: 3,
      type: 'text',
      content: 'Rotate Me!',
      position: { x: 100, y: 250 },
      size: { width: 200, height: 50 },
      rotation: 0,
    },
  ]);

  const [selectedElement, setSelectedElement] = useState(null);

  // Handle rotation change and update the state
  const handleRotationChange = (id, newRotation) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, rotation: newRotation } : el
      )
    );
  };

  // Trigger rotation on element
  const handleRotate = ({ target, beforeRotate }) => {
    const id = parseInt(target.dataset.id, 10); // Get the ID of the element being rotated
    handleRotationChange(id, beforeRotate);
  };

  // Calculate the position of the rotation icon (independent of the border)
  const getRotationIconPosition = (element) => {
    const radians = (element.rotation * Math.PI) / 180;
    const offset = 40; // Adjust the offset to position the rotation icon

    const x =
      element.position.x +
      element.size.width / 2 +
      offset * Math.cos(radians); // Calculate the X position
    const y =
      element.position.y - offset * Math.sin(radians); // Calculate the Y position

    return { x, y };
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        backgroundColor: '#f0f0f0',
      }}
    >
      {/* Render elements: Button, Image, and Text */}
      {elements.map((element) => (
        <div
          key={element.id}
          data-id={element.id}
          style={{
            position: 'absolute',
            top: element.position.y,
            left: element.position.x,
            transform: `rotate(${element.rotation}deg)`,
            width: `${element.size.width}px`,
            height: `${element.size.height}px`,
            cursor: 'pointer',
            // Border is applied only when the element is selected
            }}
          onClick={() => setSelectedElement(element)} // Set selected element on click
        >
          {element.type === 'button' && (
            <button style={{ width: '100%', height: '100%' }}>
              {element.content}
            </button>
          )}
          {element.type === 'image' && (
            <img
              src={element.src}
              alt="element"
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {element.type === 'text' && (
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {element.content}
            </div>
          )}
        </div>
      ))}

      {/* Render Moveable component for the selected element */}
      {selectedElement && (
        <>
          <Moveable
            target={`[data-id="${selectedElement.id}"]`} // Link Moveable to the selected element
            draggable
            rotatable
            onRotate={handleRotate} // Handle rotation logic
            origin={false} // Remove default origin indicator
            throttleRotate={0}
            // Render circle handles at the corners and sides
            renderDirections={["n", "s", "e", "w", "nw", "ne", "sw", "se"]}
            rotationPosition="top" // Place rotation icon on top
          />

          {/* Independent Rotation Icon */}
          <div
            style={{
              position: 'absolute',
              top: `${getRotationIconPosition(selectedElement).y}px`,
              left: `${getRotationIconPosition(selectedElement).x}px`,
              cursor: 'grab',
              zIndex: 1000, // Ensure icon stays on top
              transform: `rotate(${selectedElement.rotation}deg)`, // Rotate icon along with element
            }}
          >
          </div>
        </>
      )}
    </div>
  );
}
