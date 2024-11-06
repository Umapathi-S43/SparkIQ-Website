import React from "react";
import './Frames.css'; // Assuming you have custom styles for frames

const FramesComponent = ({ onSelectFrame }) => {
  const frames = [
    { name: "Circle", clipPath: "circle(50%)" },
    { name: "Square", clipPath: "none" },
    { name: "Rectangle", clipPath: "inset(0% 10%)" },
    { name: "Rhombus", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
    { name: "Hexagon", clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" },
    { name: "Pentagon", clipPath: "polygon(50% 0%, 100% 38%, 81% 100%, 19% 100%, 0% 38%)" },
    { name: "Heptagon", clipPath: "polygon(50% 0%, 87% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 13% 20%)" },
    { name: "Octagon", clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" },
    { name: "Nonagon", clipPath: "polygon(50% 0%, 80% 10%, 100% 40%, 90% 75%, 60% 100%, 40% 100%, 10% 75%, 0% 40%, 20% 10%)" },
    { name: "Decagon", clipPath: "polygon(50% 0%, 77% 7%, 96% 30%, 96% 70%, 77% 93%, 50% 100%, 23% 93%, 4% 70%, 4% 30%, 23% 7%)" },
    { name: "Star", clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" },
    { name: "Semicircle", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" },
    { name: "Oval", clipPath: "ellipse(50% 35% at 50% 50%)" },
    { name: "Ellipse", clipPath: "ellipse(50% 40% at 50% 50%)" },
    { name: "Triangle", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" },
    { name: "Parallelogram", clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" },
    { name: "Trapezoid", clipPath: "polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)" },
    { name: "Rounded Triangle", clipPath: "polygon(30% 10%, 80% 90%, 20% 90%)" },
  ];

  // Trigger frame selection to be passed back to the parent component
  const handleFrameSelect = (frame) => {
    onSelectFrame(frame);
  };

  return (
    <div className="frames-component border shadow-md rounded-xl">
      <h3 className="font-semibold text-xl p-4 text-[#082A66]">Select a Frame:</h3>
      <div className="frames-list grid grid-cols-3 gap-4 p-2">
        {frames.map((frame) => (
          <div
            key={frame.name}
            className="hover-frame frame-box p-4"
            style={{
              clipPath: frame.clipPath,
              width: "80px",
              height: "80px",
              backgroundColor: "#FCFCFC",
              overflow: "hidden", // Prevents edges from spilling over
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => handleFrameSelect(frame)}
          >
            {/* Optionally, add frame name as a label */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FramesComponent;
