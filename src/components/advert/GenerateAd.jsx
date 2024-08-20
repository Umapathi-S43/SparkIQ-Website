import React, { useState, useRef, useEffect } from "react";
import ProductDetails from "./productDetails";
import CreativeSize from "./creativeSize";
import GeneratedCreatives from "../../Dashboard/components1/GeneratedCreatives";
import ExistingProducts from "./productDetails/ExistingProducts";

export default function GenerateAd({ setPage, pages }) {
  const [isNextSectionOpen, setIsNextSectionOpen] = useState(false);
  const [isThirdSectionOpen, setIsThirdSectionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openModalProductDetails, setOpenModalProductDetails] = useState(false);
  const [openModalCreativeSize, setOpenModalCreativeSize] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false); // New state

  const creativeSizeRef = useRef(null);
  const generatedCreativesRef = useRef(null);

  useEffect(() => {
    // Restore state from localStorage
    const savedIsNextSectionOpen = JSON.parse(localStorage.getItem("isNextSectionOpen"));
    const savedIsThirdSectionOpen = JSON.parse(localStorage.getItem("isThirdSectionOpen"));
    const savedOpenModalProductDetails = JSON.parse(localStorage.getItem("openModalProductDetails"));
    const savedOpenModalCreativeSize = JSON.parse(localStorage.getItem("openModalCreativeSize"));

    if (savedIsNextSectionOpen !== null) setIsNextSectionOpen(savedIsNextSectionOpen);
    if (savedIsThirdSectionOpen !== null) setIsThirdSectionOpen(savedIsThirdSectionOpen);
    if (savedOpenModalProductDetails !== null) setOpenModalProductDetails(savedOpenModalProductDetails);
    if (savedOpenModalCreativeSize !== null) setOpenModalCreativeSize(savedOpenModalCreativeSize);
  }, []);

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem("isNextSectionOpen", JSON.stringify(isNextSectionOpen));
  }, [isNextSectionOpen]);

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem("isThirdSectionOpen", JSON.stringify(isThirdSectionOpen));
  }, [isThirdSectionOpen]);

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem("openModalProductDetails", JSON.stringify(openModalProductDetails));
  }, [openModalProductDetails]);

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem("openModalCreativeSize", JSON.stringify(openModalCreativeSize));
  }, [openModalCreativeSize]);

  const toggleNextSectionAccordion = () => {
    setIsNextSectionOpen(!isNextSectionOpen);
  };

  const toggleThirdSectionAccordion = () => {
    if (openModalProductDetails && openModalCreativeSize) {
      setIsThirdSectionOpen(!isThirdSectionOpen);
    }
  };

  const handleNextSection = () => {
    if (openModalProductDetails) {  // Ensure the product details step is completed
      setIsNextSectionOpen(false);
      setIsThirdSectionOpen(true);
      scrollToGeneratedCreatives(); // Scroll to GeneratedCreatives when both sections are completed
    }
  };

  const handleBack = () => {
    setShowProductDetails(false);  // Show the ExistingProducts component
    setIsNextSectionOpen(false);  // Ensure the next section is not open
    setOpenModalProductDetails(false);  // Mark the ProductDetails step as incomplete
  };

  const handleShowProductDetails = () => {
    setShowProductDetails(true);
    setIsNextSectionOpen(false); // Ensure the next section is not open when moving to ProductDetails
  };

  const scrollToGeneratedCreatives = () => {
    if (generatedCreativesRef.current) {
      generatedCreativesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isNextSectionOpen && creativeSizeRef.current) {
      creativeSizeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  return (
    <div className="flex-grow mr-8 overflow-auto">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-4 pb-0  relative">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="/icon1.svg" alt="" className="w-10 lg:w-12" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-lg lg:text-2xl">
                Generate an Ad Creatives
              </h4>
              <p className="text-[#374151] text-xs lg:text-sm">
                Generate conversion-focused ad creatives using our unique AI.
              </p>
            </span>
          </span>
          <img
            src="/image1.png"
            alt=""
            className="absolute bottom-0 right-24 w-28 lg:w-36 hidden md:block"
          />
        </div>
        <div className="px-4 lg:px-6 flex flex-col gap-4 mb-4">
          {showProductDetails ? (
            <>
              <ProductDetails
                setIsNextSectionOpen={setIsNextSectionOpen}
                isCompleted={openModalProductDetails}
                setIsCompleted={setOpenModalProductDetails}
                setShowProductDetails={setShowProductDetails}
                isNewUser={true}
                handleBack={handleBack}  // Passing handleBack to ProductDetails
              />
            </>
          ) : (
            <ExistingProducts
              setIsNextSectionOpen={setIsNextSectionOpen}
              isCompleted={openModalProductDetails}
              setIsCompleted={setOpenModalProductDetails}
              setShowProductDetails={handleShowProductDetails} // Pass handleShowProductDetails to reset isNextSectionOpen
            />
          )}
          <div ref={creativeSizeRef}>
            <CreativeSize
              isNextSectionOpen={isNextSectionOpen}
              toggleNextSectionAccordion={toggleNextSectionAccordion}
              handleNextSection={handleNextSection}
              setIsLoading={setIsLoading}
              openModalProductDetails={openModalProductDetails}
              isCompleted={openModalCreativeSize}
              setIsCompleted={setOpenModalCreativeSize}
            />
          </div>
        </div>
      </div>

      {/* GeneratedCreatives Section */}
      <div ref={generatedCreativesRef} className="mt-4">
        <GeneratedCreatives
          isThirdSectionOpen={isThirdSectionOpen}
          toggleThirdSectionAccordion={toggleThirdSectionAccordion}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setPage={setPage}
          openModalCreativeSize={openModalCreativeSize}
        />
      </div>
    </div>
  );
}
