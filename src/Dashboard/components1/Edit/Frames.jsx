import React from "react";

const FramesComponent = ({ onSelectFrame }) => {
  const frames = [
    { name: "Circle", clipPath: "circle(50%)" },
    { name: "Rectangle", clipPath: "none" },
    { name: "Hexagon", clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }
  ];

  // Trigger frame selection to be passed back to the EditTemplate
  const handleFrameSelect = (frame) => {
    onSelectFrame(frame);
  };

  return (
    <div className="frames-component">
      <h2 className="text-white">Select a Frame:</h2>
      <div className="frames-list">
        {frames.map((frame) => (
          <button className="button1 bg-white m-2 px-3 py-1 rounded-md" key={frame.name} onClick={() => handleFrameSelect(frame)}>
            {frame.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FramesComponent;
