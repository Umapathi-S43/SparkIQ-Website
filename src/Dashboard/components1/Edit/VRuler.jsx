import React from 'react';
// Vertical Ruler (new component)
const VerticalRuler = ({ min, max, step }) => {
    // Calculate the total number of steps
    const steps = [];
    for (let i = min; i <= max; i += step) {
      steps.push(i);
    }
  
    const rulerContainerStyle = {
      height: '100%', // Full height for vertical ruler
      marginRight: '2px', // Adjust the margin as needed
    };
  
    const rulerStyle = {
      display: 'flex',
      flexDirection: 'column', // For vertical layout
      justifyContent: 'space-between',
      borderLeft: '1px solid #082A66', // Left border for vertical box
      borderRight: '1px solid #082A66', // Right border for vertical box
    };
  
    const rulerTickStyle = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row', // Align ticks horizontally
      alignItems: 'center',
      height: '1cm', // Each step will be spaced appropriately
    };
  
    const tickLineStyle = {
      width: '8px', // Extend width to touch both sides of the ruler
      height: '1px',
      backgroundColor: '#082A66',
    };
  
    return (
      <div style={rulerContainerStyle}>
        <div style={rulerStyle}>
          {steps.map((stepValue, index) => (
            <div key={index} style={rulerTickStyle}>
              <div style={tickLineStyle}></div> {/* Left thin line */}
              <div className='px-1 text-xs'>{stepValue}</div> {/* Step value */}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default VerticalRuler;  