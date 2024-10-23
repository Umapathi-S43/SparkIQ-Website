import React, { useState } from 'react';
import { 
  FaTextHeight, FaImage, FaShapes, FaRegImages, FaUpload 
} from 'react-icons/fa';

// Import necessary components
import AdCreatives from "./AdCreatives";
import TextAdder from "./TextAdder";
import ImageSearchLayout from "./ImageSearch";
import ImageUploadLayout from "./ImageUpload";
import FramesComponent from "./Frames";

// Shapes and their elements
import ShapeWithSVG from "./ShapeWithSVG";
import DesignElements from "./DesignElements";
import OutlineElements from "./OutlineElements";
import GeometricalElements from "./GeometricalElements";
import ArrowElements from "./ArrowElements";
import StarElements from "./StarElements";
import BrushedElements from "./BrushedElements";
import RibbonElements from "./RibbonElements";
import LabelElements from "./LabelElements";
import BadgesShieldElements from "./BadgesShields";
import SpeechBubblesElements from "./SpeechBubbles";
import BlobElements from "./BlobElements";
import SunburstElements from "./SunburstHalftone";

const Sidebar_dynamic = () => {
  const [activeComponent, setActiveComponent] = useState();

  // Define buttons for the sidebar
  const buttons = [
    { name: 'Creatives', icon: <img src="/icon5.svg" alt="Icon" className="w-8 h-8" /> },
    { name: 'Text', icon: <FaTextHeight /> },
    { name: 'Images', icon: <FaImage /> },
    { name: 'Shapes', icon: <FaShapes /> },
    { name: 'Frames', icon: <FaRegImages /> },
    { name: 'Uploads', icon: <FaUpload /> },
  ];

  // Render container for Shapes with multiple sub-components
  const ShapesComponent = () => (
    <div className="m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40] overflow-auto hode-scrollbar">
      <ShapeWithSVG />
      <DesignElements />
      <OutlineElements />
      <GeometricalElements />
      <ArrowElements />
      <StarElements />
      <BrushedElements />
      <RibbonElements />
      <LabelElements />
      <BadgesShieldElements />
      <SpeechBubblesElements />
      <BlobElements />
      <SunburstElements />
    </div>
  );

  // Component map with layout-specific wrapping for each component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Creatives':
        return (
          <div className="w-2/5 m-4 shadow-sm rounded-md">
            <AdCreatives />
          </div>
        );
      case 'Text':
        return (
          <div className="w-2/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40]">
            <TextAdder onAddText={(text) => console.log('Text Added:', text)} />
          </div>
        );
      case 'Images':
        return (
          <div className="m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40] overflow-auto">
            <ImageSearchLayout onSelectImage={(image) => console.log('Image Selected:', image)} />
          </div>
        );
      case 'Shapes':
        return <ShapesComponent />;
      case 'Frames':
        return (
          <div className="m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md bg-[#FCFCFC40] overflow-auto">
            <FramesComponent />
          </div>
        );
      case 'Uploads':
        return (
          <div className="w-3/4 m-4 p-4 shadow-lg border-2 border-[#FCFCFC] rounded-md h-auto overflow-auto hide-scrollbar bg-[#FCFCFC40]">
            <ImageUploadLayout onSelectImage={(image) => console.log('Uploaded Image:', image)} />
          </div>
        );
      default:
      
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <div
        className="flex flex-col items-center p-3 rounded-[12px] bg-[#FCFCFC40] shadow-lg"
        style={{ height: 'calc(100vh - 10rem)' }}
      >
        {buttons.map(({ name, icon }) => (
          <button
            key={name}
            className={`flex flex-col items-center gap-2 text-lg p-2 rounded w-full ${
              activeComponent === name ? 'bg-blue-500 text-white' : ''
            }`}
            onClick={() => setActiveComponent(name)}
          >
            {icon}
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </div>

      {/* Render the active component dynamically */}
      <div
        className="flex-grow flex justify-center relative shadow-lg rounded-md overflow-auto hide-scrollbar"
        style={{ height: 'calc(100vh - 10rem)' }}
      >
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default Sidebar_dynamic;
