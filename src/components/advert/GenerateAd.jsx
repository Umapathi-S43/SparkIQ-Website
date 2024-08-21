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
  const [showProductDetails, setShowProductDetails] = useState(false);

  // State for storing data from each section
  const [brandAwarenessData, setBrandAwarenessData] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [retargetingData, setRetargetingData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Brand Color");
  const [productDetails, setProductDetails] = useState(null);
  const [creativeSize, setCreativeSize] = useState(null);

  const creativeSizeRef = useRef(null);
  const generatedCreativesRef = useRef(null);

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("generateAdState"));
    if (savedState) {
      setIsNextSectionOpen(savedState.isNextSectionOpen);
      setIsThirdSectionOpen(savedState.isThirdSectionOpen);
      setSelectedTab(savedState.selectedTab);
      setOpenModalProductDetails(savedState.openModalProductDetails);
      setOpenModalCreativeSize(savedState.openModalCreativeSize);
      setBrandAwarenessData(savedState.brandAwarenessData);
      setSaleData(savedState.saleData);
      setRetargetingData(savedState.retargetingData);
      setProductDetails(savedState.productDetails);
      setCreativeSize(savedState.creativeSize);
      setShowProductDetails(savedState.showProductDetails);

      // Scroll to GeneratedCreatives if the third section was previously open
      if (savedState.isThirdSectionOpen) {
        setTimeout(() => {
          if (generatedCreativesRef.current) {
            generatedCreativesRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100); // Adding a slight delay to ensure that the component has fully rendered
      }

      // Clear the saved state once restored
      localStorage.removeItem("generateAdState");
    }
  }, []);

  // Save the state when necessary
  const saveCurrentState = () => {
    const currentState = {
      isNextSectionOpen,
      isThirdSectionOpen,
      selectedTab,
      openModalProductDetails,
      openModalCreativeSize,
      brandAwarenessData,
      saleData,
      retargetingData,
      productDetails,
      creativeSize,
      showProductDetails,
    };
    localStorage.setItem("generateAdState", JSON.stringify(currentState));
  };

  const toggleNextSectionAccordion = () => {
    setIsNextSectionOpen(!isNextSectionOpen);
  };

  const toggleThirdSectionAccordion = () => {
    if (openModalProductDetails && openModalCreativeSize) {
      setIsThirdSectionOpen(!isThirdSectionOpen);
    }
  };

  const handleNextSection = () => {
    if (openModalProductDetails) {
      setIsNextSectionOpen(false);
      setIsThirdSectionOpen(true);
      scrollToGeneratedCreatives(); // Scroll to GeneratedCreatives when both sections are completed
    }
    saveCurrentState(); // Save state before navigating
  };

  const handleBack = () => {
    setShowProductDetails(false); // Show the ExistingProducts component
    setIsNextSectionOpen(false); // Ensure the next section is not open
    setOpenModalProductDetails(false); // Mark the ProductDetails step as incomplete
    saveCurrentState(); // Save state before navigating back
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
                handleBack={handleBack}
                productDetails={productDetails} // Pass restored product details
              />
            </>
          ) : (
            <ExistingProducts
              setIsNextSectionOpen={setIsNextSectionOpen}
              isCompleted={openModalProductDetails}
              setIsCompleted={setOpenModalProductDetails}
              setShowProductDetails={setShowProductDetails}
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
              creativeSize={creativeSize} // Pass restored creative size
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
          initialBrandAwarenessData={brandAwarenessData} // Pass restored data
          initialSaleData={saleData} // Pass restored data
          initialRetargetingData={retargetingData} // Pass restored data
          initialSelectedTab={selectedTab} // Pass restored selected tab
        />
      </div>
    </div>
  );
}
