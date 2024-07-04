import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";

const suggestions = [
  "Sum Repairs",
  "Pipe Leaks",
  "Faucet Fix",
  "Pipe Burst",
  "Plumbing Repairs",
];

export default function Targetting({ setPage }) {
  const [duration, setDuration] = useState(null);
  const [estimatedAudience, setEstimatedAudience] = useState("N/A");
  const [gender, setGender] = useState("Male");

  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");

  const updateEstimatedAudience = (duration) => {
    let audience;
    switch (duration) {
      case "Daily":
        audience = "2000";
        break;
      case "Weekly":
        audience = "5000";
        break;
      case "Monthly":
        audience = "25000";
        break;
      default:
        audience = "N/A";
    }
    setEstimatedAudience(audience);
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    updateEstimatedAudience(newDuration);
  };

  const addTag = (tag) => {
    if (!tags.includes(tag) && tag.trim() !== "") {
      setTags([...tags, tag]);
    }
    setInput("");
  };

  const deleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
  };

  return (
    <form className="w-full flex flex-col gap-4">
      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-6 pb-2">
        <h6 className="font-bold pb-4">Gender</h6>
        <div className="border border-[#FCFCFC] rounded-[20px] shadow-sm px-2 py-2 bg-white w-full mx-auto flex justify-between">
          {["Male", "Female", "All"].map((item) => (
            <button
              type="button"
              key={item}
              className={`cursor-pointer flex items-center py-2 px-8 font-bold text-sm rounded-2xl ${
                item === gender ? "targetBg" : ""
              }`}
              onClick={() => {
                setGender(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="flex gap-3 py-4">
          Suggested: <h6 className="font-bold">{gender}</h6>
        </span>
      </div>
      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-6">
        <h6 className="font-bold pb-4">Target Audience Interests</h6>
        <div className="flex flex-col w-full mx-auto rounded-lg">
          <div className="flex flex-col p-2 rounded-lg bg-white border border-[#FCFCFC]">
            <div className="flex flex-wrap items-center ">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="targetBg px-2 py-1 m-1 rounded flex items-center w-fit"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-red-500 text-sm"
                    onClick={() => deleteTag(tag)}
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                className="flex-1 border-none rounded-2xl outline-none p-1 "
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Interests"
                style={{ minWidth: '100px', flex: '1' }}
              />
            </div>
          </div>
          <h4 className="flex items-center gap-2 pb-4 mt-2">
            Suggestions{" "}
            <span className="flex items-center gap-2 h-full cursor-pointer px-2 rounded-lg">
              <img src="/icon7.svg" alt="" />
              <p className="text-[#000000B2] text-sm whitespace-pre">
                AI Assist
              </p>
            </span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={index}
                className="targetBg p-2 rounded-lg hover:bg-blue-200 outline-none"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion} +
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px]">
        <div className="flex items-center justify-between w-full bg-[#FCFCFC66] rounded-t-[30px] p-4">
          <FaUsers className="bg-[#00279926] rounded-[10px] w-12 h-10 px-3" />
          <div className=" rounded-[20px] px-2 py-2 gap-4 bg-[#FCFCFC40] w-full mx-auto flex justify-end">
            {["Daily", "Weekly", "Monthly"].map((item) => (
              <button
                type="button"
                key={item}
                className={`cursor-pointer flex items-center px-4 py-2 font-bold text-sm gap-2 rounded-xl ${
                  duration === item ? "targetBg" : "bg-white"
                }`}
                onClick={() => handleDurationChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center gap-4 py-8">
          <p className="text-xl font-bold">Estimated Audience</p>
          <p className="font-bold text-4xl">{estimatedAudience}</p>
          <img
            src="/figure-3.png"
            alt=""
            className="absolute bottom-0 right-0"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 gap-4">
        <button
          type="button"
          className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-2 px-6 whitespace-pre font-medium border border-[#0086CD80]"
          onClick={() => setPage("adPreview")}
        >
          Go Back
        </button>
        <button
          type="button"
          className="w-fit custom-button rounded-[10px] text-white py-2 px-6 whitespace-pre font-medium"
        >
          Launch Campaign
        </button>
      </div>
    </form>
  );
}
