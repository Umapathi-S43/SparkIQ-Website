import React from 'react';
import { FaArrowUp, FaArrowDown, FaAngleDoubleUp, FaAngleDoubleDown, FaAlignLeft, FaAlignRight, FaAlignCenter } from 'react-icons/fa'; // Corrected icons for alignment
import { MdAlignHorizontalCenter, MdAlignVerticalTop, MdAlignVerticalBottom } from 'react-icons/md'; // Icons for top, middle, bottom

const PositionMenu = ({ handlePositionChange, handleAlignElement }) => {
  return (
    <div className="p-4 bg-[#FCFCFC90] rounded-md shadow-md">
      <span className='text-2xl font-semibold'>Position</span>
      <div className="position-controls mt-4 space-y-4"> {/* Adding margin and spacing between buttons */}
        {/* Forward button */}
        <button
          className="flex items-center gap-2 w-full bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handlePositionChange('forward')}
        >
          <FaArrowUp />
          Forward
        </button>

        {/* Backward button */}
        <button
          className="flex items-center gap-2 w-full bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handlePositionChange('backward')}
        >
          <FaArrowDown />
          Backward
        </button>

        {/* To Front button */}
        <button
          className="flex items-center gap-2 w-full bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handlePositionChange('toFront')}
        >
          <FaAngleDoubleUp />
          To Front
        </button>

        {/* To Back button */}
        <button
          className="flex items-center gap-2 w-full bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handlePositionChange('toBack')}
        >
          <FaAngleDoubleDown />
          To Back
        </button>
      </div>

      {/* Alignment Buttons */}
      <span className='text-xl font-semibold mt-4 block'>Align to the Page</span>
      <div className="align-controls mt-3 grid grid-cols-2 gap-2">
        {/* Align Top */}
        <button
          className="flex flex-row items-center justify-start bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handleAlignElement('top')}
        >
          <MdAlignVerticalTop size={24} />
          <span className="ml-2 text-md">Top</span>
        </button>

        {/* Align Left */}
        <button
          className="flex flex-row items-center justify-start bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handleAlignElement('left')}
        >
          <FaAlignLeft size={24} />
          <span className="ml-2 text-md">Left</span>
        </button>

        {/* Align Center */}
        <button
          className="flex flex-row items-center justify-start bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handleAlignElement('center')}
        >
          <FaAlignCenter size={24} />
          <span className="ml-2 text-md">Center</span>
        </button>

        {/* Align Middle */}
        <button
          className="flex flex-row items-center justify-start bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handleAlignElement('middle')}
        >
          <MdAlignHorizontalCenter size={24} />
          <span className="ml-2 text-md">Middle</span>
        </button>

        {/* Align Right */}
        <button
          className="flex flex-row items-center justify-start bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handleAlignElement('right')}
        >
          <FaAlignRight size={24} />
          <span className="ml-2 text-md">Right</span>
        </button>

        {/* Align Bottom */}
        <button
          className="flex flex-row items-center justify-start bg-gray-300 text-[#082A66] py-2 px-4 rounded hover:text-white"
          onClick={() => handleAlignElement('bottom')}
        >
          <MdAlignVerticalBottom size={24} />
          <span className="ml-2 text-md">Bottom</span>
        </button>
      </div>

    </div>
  );
};

export default PositionMenu;
