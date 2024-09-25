import React from 'react';

const PositionMenu = ({ handlePositionChange }) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <span>Layer Position</span>
      <div className="position-controls">
        <button onClick={() => handlePositionChange('forward')}>Forward</button>
        <button onClick={() => handlePositionChange('backward')}>Backward</button>
        <button onClick={() => handlePositionChange('toFront')}>To Front</button>
        <button onClick={() => handlePositionChange('toBack')}>To Back</button>
      </div>
    </div>
  );
};

export default PositionMenu;
