import React, { useState } from "react";
import { initialCaptions, initialSuggestions } from "./Data";

export default function Caption({
  setPage,
  setSelectedCaption,
  selectedCaption,
}) {
  const [captions, setCaptions] = useState(initialCaptions.slice(0, 3));
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");

  const handleOnChangeCaption = (e) => {
    setSelectedCaption(e.target.value);
  };

  const getRandomItems = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const handleSuggestionClick = (index) => {
    const randomCaptions = getRandomItems(initialCaptions, 3);
    setCaptions(randomCaptions);
    setSelectedSuggestion(index);
  };

  const refreshSuggestionsAndCaptions = () => {
    const randomCaptions = getRandomItems(initialCaptions, 3);
    const randomSuggestions = getRandomItems(initialSuggestions, 5);
    setCaptions(randomCaptions);
    setSuggestions(randomSuggestions);
    setSelectedSuggestion("");
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8">
      <div>
        <textarea
          className="bg-white border border-[#FCFCFC] rounded-[30px] shadow sm:p-3 w-full min-h-32 lg:h-auto focus:ring-2 focus-within:ring-blue-400 focus:outline-none text-xs sm:text-sm md:text-base lg:text-base overflow-auto hide-scrollbar"
          value={selectedCaption}
          id="selectedCaption"
          onChange={handleOnChangeCaption}
        />

        <label className="flex items-center gap-2 py-4 text-xs sm:text-sm md:text-base lg:text-base">
          <input type="checkbox" />
          Apply this to all templates
        </label>
      </div>
      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[30px] shadow p-2 sm:p-3 flex items-center">
        <span className="flex items-center gap-2 sm:gap-4 w-full">
          <img src="/icon8.svg" alt="" className="w-6 lg:w-12 sm:w-8" />
          <span className="flex flex-col flex-grow">
            <h4 className="text-[#082A66] font-bold text-xs sm:text-sm lg:text-base">
              AI-Assisted Suggestions
            </h4>
            <p className="text-[#374151] text-xs sm:text-sm md:text-base lg:text-sm">
              Upload a photo and details of your product
            </p>
          </span>
          <img
            src="/icon9.svg"
            alt=""
            className="cursor-pointer w-5 sm:w-6 lg:w-8"
            onClick={refreshSuggestionsAndCaptions}
          />
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs sm:text-sm md:text-base lg:text-base">Suggestions</p>
        <div className="flex flex-wrap gap-3 sm:gap-2 mt-2">
          {suggestions.map((item, index) => (
            <button
              key={index}
              className={`flex shadow-sm p-1 w-fit rounded-full text-xs sm:text-sm md:text-base lg:text-sm whitespace-pre ${
                selectedSuggestion === index
                  ? "bg-[#0064FA80] text-white"
                  : "bg-white text-[#082A66]"
              }`}
              onClick={() => handleSuggestionClick(index)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-4">
        {captions.map((item, index) => (
          <div
            className="caption-container flex items-center gap-2 sm:gap-4 bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[30px] shadow p-2 sm:p-3"
            key={index}
          >
            <div className="text-xs sm:text-sm lg:text-sm flex-grow">
              {item}
            </div>
            <img
              src="/image4.svg"
              alt=""
              className="cursor-pointer w-12 sm:w-16 md:w-20 lg:w-24"
              onClick={() => setSelectedCaption(item)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="w-fit custom-button rounded-[20px] text-white py-2 sm:py-3 px-4 sm:px-6 whitespace-pre font-medium text-xs sm:text-sm md:text-base lg:text-lg"
          onClick={() => {
            console.log('Save Template button clicked');
            setPage("adPreview");
          }}
        >
          Save Template
        </button>
      </div>
      <style jsx>{`
        .caption-container {
          display: flex;
          flex-wrap: nowrap;
        }
        @media (max-width: 1024px) {
          .caption-container {
            flex-direction: row;
          }
        }
        @media (max-width: 1024px) and (min-width: 1024px) {
          .caption-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
