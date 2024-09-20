import React, { useState, useEffect } from "react";
import "./ShapeStyles.css"; // Import custom styles

const ShapeStyleLayout = () => {
  const [imageURL, setImageURL] = useState(""); // Store image URL
  const shapes = ["circle", "square", "hexagon","star"]; // Shape types
  const styles = ["none", "grayscale", "rounded"]; // Style types

  useEffect(() => {
    // Get the selected product from localStorage and retrieve the imageURL
    const storedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    if (storedProduct && storedProduct.productImagesList && storedProduct.productImagesList[0]) {
      setImageURL(storedProduct.productImagesList[0].imageURL);
    }
  }, []);

  return (
    <div className="border shadow-md p-4 text-[#082A66]">
      <h3 className="font-semibold text-xl pb-4">Shapes and Styles</h3>

      {/* Display shapes and styles in a grid */}
      {imageURL ? (
        <div className="grid-container">
          {shapes.map((shape) =>
            styles.map((style) => (
              <div key={`${shape}-${style}`} className={`shape-container ${shape} ${style}`}>
                <img src={imageURL} alt={`Styled ${shape}`} className="styled-shape" />
              </div>
            ))
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">No image available</p>
      )}
    </div>
  );
};

export default ShapeStyleLayout;
