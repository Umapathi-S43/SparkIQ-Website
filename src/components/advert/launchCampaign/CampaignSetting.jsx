import React from "react";
import { CiBadgeDollar } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import { MdOutlineDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function CampaignSetting({ setPage }) {
  const navigate = useNavigate();

  const handleLaunch_Campaign = () => {
    localStorage.setItem('task3Completed', 'true');
    navigate('/Congrats', { state: { task3Completed: true } });
  };
  const handle_Goback = () => {
    navigate('/adPreview'); // Redirect to adPreview
  };

  return (
    <form className="w-full flex flex-col gap-4 p-2 lg:p-4">
      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-4 lg:p-6 shadow">
        <span className="flex items-center gap-4 text-lg mb-2 lg:mb-4">
          <GoLocation className="bg-[#00279926] rounded-[10px] w-8 h-8 lg:w-10 lg:h-10 px-2 lg:px-3" />
          <h6 className="font-bold">Enter a Location to Target</h6>
        </span>
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search for location"
            id="location"
            className="rounded-2xl py-2 lg:py-3 pr-10 lg:pr-12 pl-4 lg:pl-6 shadow w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
          />
          <BiSearch className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 h-5 lg:h-6 w-5 lg:w-6" />
        </div>
      </div>

      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-4 lg:p-6 shadow">
        <span className="flex items-center gap-4 text-lg mb-2 lg:mb-4">
          <CiBadgeDollar className="bg-[#00279926] rounded-[10px] w-8 h-8 lg:w-10 lg:h-10 px-2 lg:px-3" />
          <h6 className="font-bold">Enter Campaign Budget</h6>
        </span>
        <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
          <select className="outline-none rounded-2xl w-full sm:w-32 px-2 py-2 lg:py-3">
            <option value="usd">USD</option>
          </select>
          <input
            type="text"
            placeholder="Enter Budget"
            id="budget"
            className="rounded-2xl py-2 lg:py-3 px-4 lg:px-6 shadow w-full focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-6 lg:p-6 shadow">
        <span className="flex items-center gap-4 text-lg mb-2 lg:mb-4">
          <MdOutlineDateRange className="bg-[#00279926] rounded-[10px] w-8 h-8 lg:w-10 lg:h-10 px-2 lg:px-3" />
          <h6 className="font-bold">Campaign Schedule</h6>
        </span>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
          <label className="w-full lg:w-1/2">
            Enter the start date
            <input
              type="date"
              id="start-date"
              className="rounded-2xl py-2 lg:py-3 px-4 w-full mt-2 shadow focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
            />
          </label>
          <label className="w-full lg:w-1/2">
            Enter the end date
            <input
              type="date"
              id="end-date"
              className="rounded-2xl py-2 lg:py-3 px-4 w-full mt-2 shadow focus:ring-2 focus-within:ring-blue-400 focus:outline-none"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center mt-4 lg:mt-6 gap-2 lg:gap-4">
        <button
          type="button"
          className="w-full sm:w-auto bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-2 px-4 lg:py-2 lg:px-6 whitespace-pre font-medium border border-[#0086CD80] hover:opacity-70"
          onClick={handle_Goback}
        >
          Go Back
        </button>
        <button
          type="button"
          className="w-full sm:w-auto custom-button rounded-[10px] text-white py-2 px-4 lg:py-2 lg:px-6 whitespace-pre font-medium"
          onClick={handleLaunch_Campaign}
        >
          Launch Campaign
        </button>
      </div>
    </form>
  );
}
