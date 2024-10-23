// Sidebar.js
import React from 'react';
import { FaTextHeight, FaImage, FaShapes, FaRegImages, FaUpload } from 'react-icons/fa';

const Sidebar_Edit = ({ setActiveComponent }) => {
  return (
    <div
      className="flex flex-col items-center p-3 rounded-[12px] bg-[#FCFCFC40] shadow-lg"
      style={{ height: 'calc(100vh - 10rem)' }}
    >
      <button
        className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
        //onClick={() => setActiveComponent('Creatives')}
      >
        <img src="/icon5.svg" alt="Icon" className="w-8 h-8" />
        <span className="text-sm">Creatives</span>
      </button>

      <div className="flex flex-col items-center justify-center space-y-2 mt-4">
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent('Text')}
        >
          <FaTextHeight />
          <span className="text-sm">Text</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent('Images')}
        >
          <FaImage />
          <span className="text-sm">Image</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent('Shapes')}
        >
          <FaShapes />
          <span className="text-sm">Shape</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent('Frames')}
        >
          <FaRegImages />
          <span className="text-sm">Frame</span>
        </button>
        <button
          className="flex flex-col items-center gap-2 text-lg p-2 rounded w-full"
          onClick={() => setActiveComponent('Uploads')}
        >
          <FaUpload />
          <span className="text-sm">Uploads</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar_Edit;


