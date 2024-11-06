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
     // New frames based on your SVGs
    {
    name: "CustomShape2",
    clipPath: "path('M357.51514,12.436a55.38862,55.38862,0,0,1-29.12561-8.30243A28.23173,28.23173,0,0,0,297.14936,5.3603c-6.3797,4.473-13.99538,22.42-22.16889,22.42-8.17374,0-15.78963-17.94707-22.16947-22.42019a28.23156,28.23156,0,0,0-31.24-1.22664c-8.59156,5.28051-18.53434,34.38055-29.12569,34.38055S171.91118,9.414,163.31962,4.1335a28.23156,28.23156,0,0,0-31.24,1.22664C125.69979,9.83326,118.08389,26.707,109.91016,26.707c-8.17351,0-15.7892-16.87364-22.16889-21.34666A28.23173,28.23173,0,0,0,56.5011,4.13355,55.38865,55.38865,0,0,1,27.37549,12.436,54.97457,54.97457,0,0,1,5.744,8.00348C2.98628,6.82758,0,9.04955,0,12.23465H0V299.99982H400V22.24987c0-11.21646-10.60446-18.74345-20.27432-14.49165A55.00039,55.00039,0,0,1,357.51514,12.436Z')",
  },
 
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
              backgroundColor: "#082A66",
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
