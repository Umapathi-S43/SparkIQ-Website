import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from "../../../components/utils/Constant";
import { jwtToken } from "../../../components/utils/jwtToken";

const ArrowElements = ({ handleAddSVG }) => {
  const [svgData, setSvgData] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Default state is closed

  useEffect(() => {
    // Fetch SVG metadata to display a list of SVGs
    const fetchSVGList = async () => {
      try {
        const response = await axios.get(`${baseUrl}/svg`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setSvgData(response.data); // Assuming response.data is an array of SVG metadata
      } catch (error) {
        console.error('Error fetching SVG list:', error);
      }
    };

    fetchSVGList();
  }, []);

  const fetchSVGById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/svg/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data; // Assuming response.data contains the SVG content
    } catch (error) {
      console.error('Error fetching SVG:', error);
      return null;
    }
  };

  const handleSVGClick = async (id) => {
    const svgContent = await fetchSVGById(id);
    if (svgContent) {
      const timestamp = Date.now();
      handleAddSVG(svgContent, `${id}-${timestamp}`); // Pass both the SVG content and the custom name
    }
  };

  return (
    <div className="border-2 shadow-md p-3 pl-2 text-[#FCFCFC]">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h5 className="font-semibold text-xl pb-4 pt-2 text-[#082A66]">Arrow Elements</h5>
        <span>{isOpen ? '▼' : '▲'}</span>
      </div>
      {isOpen && (
        <div className="grid-container">
          {svgData
            .filter((svg) => svg.id <= 76) // Only include SVGs with an ID of 76 or less
            .map((svg) => (
              <div
                className="shape-box"
                key={svg.id}
                onClick={() => handleSVGClick(svg.id)}
                style={{
                  width: '90px',
                  height: '90px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                dangerouslySetInnerHTML={{ __html: svg.svgContent }} // Assuming svgContent contains SVG markup
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ArrowElements;
