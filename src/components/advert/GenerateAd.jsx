import React, { useState, useRef, useEffect } from "react";
import ProductDetails from "./productDetails";
import CreativeSize from "./creativeSize";
import GeneratedCreatives from "../../Dashboard/components1/GeneratedCreatives";

export default function GenerateAd({ setPage, pages }) {
  const [isNextSectionOpen, setIsNextSectionOpen] = useState(false);
  const [isThirdSectionOpen, setIsThirdSectionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openModalProductDetails, setOpenModalProductDetails] = useState(false);
  const [openModalCreativeSize, setOpenModalCreativeSize] = useState(false);
  const creativeSizeRef = useRef(null);

  const toggleNextSectionAccordion = () => {
    setIsNextSectionOpen(!isNextSectionOpen);
  };

  const toggleThirdSectionAccordion = () => {
    if (openModalProductDetails && openModalCreativeSize) {
      setIsThirdSectionOpen(!isThirdSectionOpen);
    }
  };

  const handleNextSection = () => {
    setIsNextSectionOpen(false);
    setIsThirdSectionOpen(true);
  };

  useEffect(() => {
    if (isNextSectionOpen && creativeSizeRef.current) {
      creativeSizeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNextSectionOpen]);

  return (
    <div className="flex-grow">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 border border-[#FCFCFC] rounded-3xl h-[calc(100vh-180px)]">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-6 relative ">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="/icon1.svg" alt="" className="w-10 lg:w-14" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl lg:text-2xl">
                Generate an Ad Creatives
              </h4>
              <p className="text-[#374151] text-xs lg:text-base">
                Generate conversion-focused ad creatives using our unique AI.
              </p>
            </span>
          </span>
          <img
            src="/image1.png"
            alt=""
            className="absolute bottom-0 right-24 w-32 lg:w-44 hidden md:block"
          />
        </div>
        <div className="px-4 lg:px-6 flex flex-col gap-6 overflow-y-auto hide-scrollbar" style={{ maxHeight: '70vh' }}>
          <ProductDetails
            setIsNextSectionOpen={setIsNextSectionOpen}
            isCompleted={openModalProductDetails}
            setIsCompleted={setOpenModalProductDetails}
          />
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
    </div>
  );
}
