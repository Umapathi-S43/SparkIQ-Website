import React, { useState, useEffect, useRef } from "react";
import ProductDetails from "./productDetails";
import ExistingProducts from "./productDetails/ExistingProducts";
import LookingFor from "./lookingFor";
import CreativeFormat from "./creativeFormat";
import Creatives from "./Creatives";
import toast from "react-hot-toast";

export default function GenerateAd() {
  // -----------------------------
  // ACCORDION-LIKE STATES
  // -----------------------------
  const [isLookingForOpen, setIsLookingForOpen] = useState(false);
  const [isCreativeFormatOpen, setIsCreativeFormatOpen] = useState(false);
  const [isCreativesOpen, setIsCreativesOpen] = useState(false);

  // COMPLETION BADGE (COMPLETION) STATES – these indicate that a step is “completed”
  const [openModalProductDetails, setOpenModalProductDetails] = useState(false);
  const [openModalLookingFor, setOpenModalLookingFor] = useState(false);
  const [openModalCreativeFormat, setOpenModalCreativeFormat] = useState(false);
  const [openModalCreatives, setOpenModalCreatives] = useState(false);
  const [creativePayload, setCreativePayload] = useState(null);

  // Toggle between showing steps (1–3) vs. hiding them (step 4 open)
  const [showGenerateAdSteps, setShowGenerateAdSteps] = useState(true);

  // Show either "ExistingProducts" or "ProductDetails" in step 1
  const [showProductDetails, setShowProductDetails] = useState(false);

  // For scrolling
  const stepsRef = useRef(null);

  // Optionally clear localStorage on mount
  useEffect(() => {
    localStorage.removeItem("brand_id");
    localStorage.removeItem("product_id");
  }, []);

  // -----------------------------------
  // SCROLL HELPERS
  // -----------------------------------
  const scrollToGenerateAdSteps = () => {
    if (stepsRef.current) {
      stepsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // When re-opening the steps, scroll to them
  const openGenerateAdSteps = () => {
    setShowGenerateAdSteps(true);
    setTimeout(() => {
      scrollToGenerateAdSteps();
    }, 50);
  };

  // -----------------------------------
  // STEP NAVIGATION / FLOW
  // -----------------------------------
  // 1) Product → LookingFor
  const handleNextToLookingFor = () => {
    // Mark Step 1 complete:
    setOpenModalProductDetails(true);
    setShowProductDetails(false);
    // Open step 2 (LookingFor) if step 1 is complete
    setOpenModalLookingFor(false);
    setIsLookingForOpen(true);
  };

  // 2) LookingFor → CreativeFormat
  const handleNextToCreativeFormat = () => {
    // Mark Step 2 complete:
    setOpenModalLookingFor(true);
    // Open step 3 (CreativeFormat) only if step 1 and step 2 are complete
    setIsLookingForOpen(false);
    setIsCreativeFormatOpen(true);
    setOpenModalCreativeFormat(false);
  };

  // 3) CreativeFormat → Creatives
  const handleOpenCreatives = () => {
    // Mark Step 3 complete:
    setOpenModalCreativeFormat(true);
    setIsCreativeFormatOpen(false);
    // Hide steps 1-3 and open step 4 (Creatives)
    setShowGenerateAdSteps(false);
    setIsCreativesOpen(true);
    setOpenModalCreatives(false);
  };

  // If user wants to go back to step 1 (for editing)
  const handleBackToExisting = () => {
    setShowProductDetails(false);
    setOpenModalProductDetails(false);
    setIsLookingForOpen(false);
    setIsCreativeFormatOpen(false);
    setIsCreativesOpen(false);
    setShowGenerateAdSteps(true);
    scrollToGenerateAdSteps();
  };

  // If user was in LookingFor and clicks "Back to Product"
  const handleBackToProduct = () => {
    setOpenModalLookingFor(false);
    setIsLookingForOpen(false);
    setShowProductDetails(true);
  };

  // -----------------------------------
  // TOGGLE ACCORDIONS (only one open at a time with restrictions)
  // -----------------------------------
  const toggleLookingForAccordion = () => {
    // Restrict: Step 2 (LookingFor) cannot be opened unless step 1 is complete
    if (!openModalProductDetails) {
      toast.error("Please complete the Product selection.");
      return;
    }
    setIsLookingForOpen(!isLookingForOpen);
    // Close other sections
    setIsCreativeFormatOpen(false);
    setIsCreativesOpen(false);
  };

  const toggleCreativeFormatAccordion = () => {
    // Restrict: Step 3 (CreativeFormat) cannot be opened unless step 1 and step 2 are complete
    if (!openModalProductDetails || !openModalLookingFor) {
      toast.error("Please complete the Product selection and format.");
      return;
    }
    setIsCreativeFormatOpen(!isCreativeFormatOpen);
    // Close other sections
    setIsLookingForOpen(false);
    setIsCreativesOpen(false);
  };

  const toggleCreativesAccordion = () => {
    // Restrict: Step 4 (Creatives) cannot be opened unless steps 1, 2 and 3 are complete
    if (!openModalProductDetails || !openModalLookingFor || !openModalCreativeFormat) {
      toast.error("Please complete the previous sections before proceeding to Creatives.");
      return;
    }
    setIsCreativesOpen(!isCreativesOpen);
    // Close other sections
    setIsLookingForOpen(false);
    setIsCreativeFormatOpen(false);
  };

  return (
    <div className="flex-grow lg:mr-8 lg:ml-0 ml-2 mx-auto overflow-auto">
      {/* Steps 1–3 */}
      {showGenerateAdSteps && (
        <div
          ref={stepsRef}
          className="max-w-6xl w-full mx-auto flex flex-col gap-6 border border-[#FCFCFC] rounded-3xl mb-4"
        >
          {/* HEADER */}
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

          {/* BODY */}
          <div
            className="px-4 lg:px-6 flex flex-col gap-4 mb-4 overflow-auto"
            style={{ maxHeight: "80vh" }}
          >
            {/* STEP 1: ExistingProducts or ProductDetails */}
            {!showProductDetails ? (
              <ExistingProducts
                setIsNextSectionOpen={setIsLookingForOpen}
                isCompleted={openModalProductDetails}
                setIsCompleted={setOpenModalProductDetails}
                setShowProductDetails={setShowProductDetails}
              />
            ) : (
              <ProductDetails
                setIsNextSectionOpen={setIsLookingForOpen}
                isCompleted={openModalProductDetails}
                setIsCompleted={setOpenModalProductDetails}
                setShowProductDetails={setShowProductDetails}
                handleBack={handleBackToExisting}
              />
            )}

            {/* STEP 2: LookingFor */}
            <LookingFor
              isNextSectionOpen={isLookingForOpen}
              toggleNextSectionAccordion={toggleLookingForAccordion}
              handleNextSection={handleNextToCreativeFormat}
              isCompleted={openModalLookingFor}
              setIsCompleted={setOpenModalLookingFor}
            />

            {/* STEP 3: CreativeFormat */}
            <CreativeFormat
              isNextSectionOpen={isCreativeFormatOpen}
              toggleNextSectionAccordion={toggleCreativeFormatAccordion}
              isCompleted={openModalCreativeFormat}
              setIsCompleted={setOpenModalCreativeFormat}
              handleNextSection={handleOpenCreatives}
              setCreativePayload={setCreativePayload} // Pass setter function to child
            />
          </div>
        </div>
      )}

      {/* STEP 4: Creatives */}
      <Creatives
        isNextSectionOpen={isCreativesOpen}
        toggleNextSectionAccordion={toggleCreativesAccordion}
        isCompleted={openModalCreatives}
        setIsCompleted={setOpenModalCreatives}
        showGenerateAdSteps={openGenerateAdSteps} // Allow user to re-show steps if needed
        creativePayload={creativePayload} // Pass payload as prop
      />
    </div>
  );
}
