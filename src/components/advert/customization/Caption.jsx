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
    <div>
      <div>
        <textarea
          className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[30px] shadow p-3 w-full min-h-32 outline-none"
          value={selectedCaption}
          id="selectedCaption"
          onChange={handleOnChangeCaption}
        />

        <label className="flex items-center gap-2 py-4">
          <input type="checkbox" placeholder="Apply this to all templates" />
          Apply this to all templates
        </label>
      </div>
      <div className="bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[30px] shadow p-3 flex items-center">
        <span className="flex items-center gap-4">
          <img src="/icon8.svg" alt="" className="w-12" />
          <span className="flex flex-col">
            <h4 className="text-[#082A66] font-bold text-lg">
              AI-Assisted Suggestions
            </h4>
            <p className="text-[#374151]">
              Upload a photo and details of your product
            </p>
          </span>
          <img
            src="/icon9.svg"
            alt=""
            className="cursor-pointer"
            onClick={refreshSuggestionsAndCaptions}
          />
        </span>
      </div>
      <div className="mt-4">
        <p>Suggestions</p>
        <div className="flex gap-4 mt-2 overflow-auto hide-scrollbar">
          {suggestions.map((item, index) => (
            <button
              key={index}
              className={`shadow-sm p-2 rounded-full text-sm whitespace-pre ${
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
            className="flex items-center gap-4 bg-[#FCFCFC66] border border-[#FCFCFC] rounded-[30px] shadow p-3"
            key={index}
          >
            <div className="text-sm">{item}</div>
            <img
              src="/image4.svg"
              alt=""
              className="cursor-pointer w-28"
              onClick={() => setSelectedCaption(item)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="w-fit custom-button rounded-[20px] text-white py-3 px-10 whitespace-pre font-medium"
          onClick={() => setPage("adPreview")}
        >
          Save Template
        </button>
      </div>
    </div>
  );
}
