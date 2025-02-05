import React, { useState, useEffect, useRef } from "react";
import ProductDetails from "./productDetails";
import ExistingProducts from "./productDetails/ExistingProducts";
import LookingFor from "./lookingFor";
import CreativeFormat from "./creativeFormat";
import Creatives from "./Creatives";

export default function GenerateAd() {
  // -----------------------------
  // ACCORDION-LIKE STATES
  // -----------------------------
  const [isLookingForOpen, setIsLookingForOpen] = useState(false);
  const [isCreativeFormatOpen, setIsCreativeFormatOpen] = useState(false);
  const [isCreativesOpen, setIsCreativesOpen] = useState(false);

  // COMPLETION BADGE STATES
  const [openModalProductDetails, setOpenModalProductDetails] = useState(false);
  const [openModalLookingFor, setOpenModalLookingFor] = useState(false);
  const [openModalCreativeFormat, setOpenModalCreativeFormat] = useState(false);
  const [openModalCreatives, setOpenModalCreatives] = useState(false);

  // Toggle between showing (steps 1–3) vs. hiding them
  const [showGenerateAdSteps, setShowGenerateAdSteps] = useState(true);

  // Show either "ExistingProducts" or "ProductDetails" in step 1
  const [showProductDetails, setShowProductDetails] = useState(false);

  // For scrolling
  const stepsRef = useRef(null);

  // Optionally clear localStorage on mount
  useEffect(() => {
    localStorage.removeItem("brand_id");
    localStorage.removeItem("product_id");
    // localStorage.removeItem("lookingFor");
  }, []);

  // -----------------------------------
  // SCROLL HELPERS
  // -----------------------------------
  const scrollToGenerateAdSteps = () => {
    if (stepsRef.current) {
      stepsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // If user re-opens the steps, we want them scrolled into view
  const openGenerateAdSteps = () => {
    setShowGenerateAdSteps(true);
    // wait for DOM update, then scroll
    setTimeout(() => {
      scrollToGenerateAdSteps();
    }, 50);
  };

  // -----------------------------------
  // STEP NAV / FLOW
  // -----------------------------------

  // 1) Product => LookingFor
  const handleNextToLookingFor = () => {
    setOpenModalProductDetails(true);
    setShowProductDetails(false);
    setOpenModalLookingFor(false);
    setIsLookingForOpen(true);
  };

  // 2) LookingFor => CreativeFormat
  const handleNextToCreativeFormat = () => {
    setOpenModalLookingFor(true);
    setIsLookingForOpen(false);
    setIsCreativeFormatOpen(true);
    setOpenModalCreativeFormat(false);
  };

  // 3) CreativeFormat => Creatives
  const handleOpenCreatives = () => {
    setOpenModalCreativeFormat(true);
    setIsCreativeFormatOpen(false);
    // Hide steps 1-3
    setShowGenerateAdSteps(false);
    // Now open Creatives
    setIsCreativesOpen(true);
    setOpenModalCreatives(false);
  };

  // If user wants to go back to step 1, for example
  const handleBackToExisting = () => {
    // Show step 1 again
    setShowProductDetails(false);
    setOpenModalProductDetails(false);
    setIsLookingForOpen(false);
    setIsCreativeFormatOpen(false);
    setShowGenerateAdSteps(true);
    // Optionally scroll
    scrollToGenerateAdSteps();
  };

  // If user was in LookingFor, clicks "Back to Product"
  const handleBackToProduct = () => {
    setOpenModalLookingFor(false);
    setIsLookingForOpen(false);
    setShowProductDetails(true);
    // Keep steps visible
  };

  // -----------------------------------
  // TOGGLE ACCORDIONS
  // -----------------------------------
  const toggleLookingForAccordion = () => {
    setShowProductDetails(false);
    setOpenModalProductDetails(false);
    setIsCreativeFormatOpen(false);
    setIsCreativesOpen(false);
    setIsLookingForOpen(!isLookingForOpen);
  };

  const toggleCreativeFormatAccordion = () => {
    setShowProductDetails(false);
    setOpenModalProductDetails(false);
    setIsLookingForOpen(false);
    setIsCreativesOpen(false);
    setIsCreativeFormatOpen(!isCreativeFormatOpen);
  };

  const toggleCreativesAccordion = () => {
    // If the user wants to see Creatives again, we can keep
    // steps hidden or you might choose to re-show them
    setIsLookingForOpen(false);
    setIsCreativeFormatOpen(false);
    setIsCreativesOpen(!isCreativesOpen);
  };

  return (
    <div className="flex-grow lg:mr-8 lg:ml-0 ml-2 mx-auto overflow-auto">
      {/* If we want the steps visible, show them */}
      {showGenerateAdSteps && (
        <div
          ref={stepsRef}
          className="max-w-6xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl mb-4"
        >
          {/* ========== HEADER ========== */}
          <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-4 pb-0 relative">
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

          {/* ========== BODY ========== */}
          <div className="px-4 lg:px-6 flex flex-col gap-4 mb-4 overflow-auto"style={{maxHeight:'80vh'}}>
            {/* STEP 1) Existing or ProductDetails */}
            {!showProductDetails && (
              <ExistingProducts
                setIsNextSectionOpen={setIsLookingForOpen}
                isCompleted={openModalProductDetails}
                setIsCompleted={setOpenModalProductDetails}
                setShowProductDetails={setShowProductDetails}
              />
            )}

            {showProductDetails && (
              <ProductDetails
              setIsNextSectionOpen={setIsLookingForOpen}
              isCompleted={openModalProductDetails}
              setIsCompleted={setOpenModalProductDetails}
              setShowProductDetails={setShowProductDetails}
                handleBack={handleBackToExisting}
              />
            )}

            {/* STEP 2) LookingFor */}
            <LookingFor
              isNextSectionOpen={isLookingForOpen}
              toggleNextSectionAccordion={toggleLookingForAccordion}
              handleNextSection={handleNextToCreativeFormat}
              isCompleted={openModalLookingFor}
              setIsCompleted={setOpenModalLookingFor}
            />

            {/* STEP 3) CreativeFormat */}
            <CreativeFormat
              isNextSectionOpen={isCreativeFormatOpen}
              toggleNextSectionAccordion={toggleCreativeFormatAccordion}
              isCompleted={openModalCreativeFormat}
              setIsCompleted={setOpenModalCreativeFormat}
              handleNextSection={handleOpenCreatives}
            />
          </div>
        </div>
      )}

      {/* STEP 4) Creatives */}
      <Creatives
        isNextSectionOpen={isCreativesOpen}
        toggleNextSectionAccordion={toggleCreativesAccordion}
        isCompleted={openModalCreatives}
        setIsCompleted={setOpenModalCreatives}
        // If user wants to go back to steps, we can do so:
        showGenerateAdSteps={openGenerateAdSteps} 
        // ^ A custom prop we define so user can re-show steps
      />
    </div>
  );
}
