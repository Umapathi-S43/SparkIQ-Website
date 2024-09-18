import React from 'react';

// Horizontal Ruler (Keep as it is)
const Ruler = ({ min, max, step }) => {
  // Calculate the total number of steps
  const steps = [];
  for (let i = min; i <= max; i += step) {
    steps.push(i);
  }

  const rulerContainerStyle = {
    width: '100%',
    marginTop: '2px', // Adjust the margin as needed
  };

  const rulerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #082A66',
    borderBottom: '1px solid #082A66', // Add bottom border for the ruler box
  };

  const rulerTickStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '1cm', // Each step will be spaced appropriately
  };

  const tickLineStyle = {
    height: '8px', // Extend height to touch both top and bottom of the ruler
    width: '1px',
    backgroundColor: '#082A66',
  };

  return (
    <div className="ml-10"style={rulerContainerStyle}>
      <div style={rulerStyle}>
        {steps.map((stepValue, index) => (
          <div key={index} style={rulerTickStyle}>
            <div style={tickLineStyle}></div> {/* Top thin line */}
            <div style={tickLineStyle}></div> {/* Bottom thin line */}
            <div className='px-1 text-xs'>{stepValue}</div> {/* Step value */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Ruler;
