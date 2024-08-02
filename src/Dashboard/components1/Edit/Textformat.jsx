import React, { useState, useRef, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { AiOutlineAlignLeft, AiOutlineAlignRight, AiOutlineAlignCenter } from 'react-icons/ai';
import { BsJustify } from 'react-icons/bs';

const fontFamilies = [
  'Sans Serif', 'Serif', 'Monospace', 'Arial', 'Courier New', 'Calibri', 'Georgia',
  'Tahoma', 'Verdana', 'Times New Roman', 'Arial Black', 'Arial Nova Light',
  'Bahnschrift', 'Sitka Small', 'Source Sans Pro', 'Sylfaen', 'Tahoma',
  'Trebuchet MS', 'Tw Cen MT', 'Verdana', 'Yu Gothic'
];

const fontSizes = [1,2,3,4,,5,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30,44,52,68,72]; // Using HTML font size values

const themeColors = [
  ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'],
  ['#0070C0', '#66B2FF', '#3399FF', '#1A75FF', '#004C99', '#00264D'],
  ['#00B050', '#33D17A', '#66E9A4', '#00A040', '#008030', '#005920'],
  ['#FFC000', '#FFD166', '#FFE299', '#FFB300', '#CC8F00', '#996B00'],
  ['#FF0000', '#FF4D4D', '#FF8080', '#C00000', '#D96666', '#E69999'],
  ['#7030A0', '#9B66CC', '#B499E6', '#602080', '#401060', '#800080'],
  ['#00FFFF', '#40E0D0', '#48D1CC', '#20B2AA', '#008080', '#2E8B57']
];

const standardColors = [
  ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080', '#00FFFF', '#008080']
];

const TextFormatToolbar = ({ onClose }) => {
  const [fontFamily, setFontFamily] = useState('Sans Serif');
  const [fontSize, setFontSize] = useState('3'); // Default to HTML font size value 3
  const [fontColor, setFontColor] = useState('black');
  const [activeCommands, setActiveCommands] = useState([]);

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
    if (document.queryCommandState(command)) {
      setActiveCommands([...activeCommands, command]);
    } else {
      setActiveCommands(activeCommands.filter(cmd => cmd !== command));
    }
  };

  const handleFontChange = (event) => {
    const value = event.target.value;
    setFontFamily(value);
    applyStyle('fontName', value);
  };

  const handleFontSizeChange = (event) => {
    const value = event.target.value;
    setFontSize(value);
    applyStyle('fontSize', value);
  };

  const handleFontColorChange = (color) => {
    setFontColor(color);
    applyStyle('foreColor', color);
  };

  const isActive = (command) => {
    return document.queryCommandState(command);
  };

  useEffect(() => {
    const checkActiveCommands = () => {
      const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];
      setActiveCommands(commands.filter(command => document.queryCommandState(command)));
    };
    checkActiveCommands();
  }, []);

  return (
      <div className="flex flex-wrap space-x-2 p-2 rounded w-fit">
        <select value={fontFamily} onChange={handleFontChange} className="toolbar-select bg-[#FCFCFC40] ">
          {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
        </select>
        <select value={fontSize} onChange={handleFontSizeChange} className="toolbar-select bg-[#FCFCFC40]">
          {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
        </select>
        <button
          className={`toolbar-button  w-10 ${isActive('bold') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('bold')}
        ><b>B</b></button>
        <button
          className={`toolbar-button w-10 ${isActive('italic') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('italic')}
        ><i>I</i></button>
        <button
          className={`toolbar-button w-10 ${isActive('underline') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('underline')}
        ><u>U</u></button>
        <button
          className={`toolbar-button ${isActive('strikeThrough') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('strikeThrough')}
        ><s>abc</s></button>
        <button
          className={`toolbar-button ${isActive('subscript') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('subscript')}
        >x<sub>2</sub></button>
        <button
          className={`toolbar-button ${isActive('superscript') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('superscript')}
        >x<sup>2</sup></button>
        <button
          className={`toolbar-button  ${isActive('justifyLeft') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('justifyLeft')}
        ><AiOutlineAlignLeft /></button>
        <button
          className={`toolbar-button ${isActive('justifyCenter') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('justifyCenter')}
        ><AiOutlineAlignCenter /></button>
        <button
          className={`toolbar-button ${isActive('justifyRight') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('justifyRight')}
        ><AiOutlineAlignRight /></button>
        <button
          className={`toolbar-button  ${isActive('justifyFull') ? 'bg-gray-300' : ''}`}
          onClick={() => applyStyle('justifyFull')}
        ><BsJustify /></button>
        <div className="relative group">
          <button className="toolbar-button flex items-center">
            <span style={{ textDecoration: 'underline', textDecorationColor: fontColor }}>A</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div className="absolute bg-white border mt-2 hidden group-hover:block z-20 p-2">
            <div className="mb-2 text-nowrap">Theme Colors</div>
            <div className="grid grid-cols-6 gap-1 mb-2">
              {themeColors.flatMap((colors, colIndex) =>
                colors.map((color, index) => (
                  <button key={`${colIndex}-${index}`} onClick={() => handleFontColorChange(color)} className="w-3 h-3" style={{ backgroundColor: color }}></button>
                ))
              )}
            </div>
            <div className="mb-2 text-nowrap">Standard Colors</div>
            <div className="grid grid-cols-6 gap-1">
              {standardColors.flatMap((colors, colIndex) =>
                colors.map((color, index) => (
                  <button key={`${colIndex}-${index}`} onClick={() => handleFontColorChange(color)} className="w-3 h-3" style={{ backgroundColor: color }}></button>
                ))
              )}
            </div>
          </div>
        </div>
        <button className="toolbar-button text-xl" onClick={onClose}>×</button>
      </div>
  );
};

export default TextFormatToolbar;
