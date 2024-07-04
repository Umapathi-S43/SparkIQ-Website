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

  return (
    <form className="w-full flex flex-col gap-4">
      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-6 shadow">
        <span className="flex items-center gap-4 text-lg mb-4">
          <GoLocation className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
          <h6 className="font-bold">Enter a Location to Target</h6>
        </span>
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search for location"
            id="location"
            className="rounded-2xl py-3 pr-[100px] pl-[25px] shadow w-full outline-none"
          />
          <BiSearch className="absolute right-4 h-full" />
        </div>
      </div>

      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-6 shadow">
        <span className="flex items-center gap-4 text-lg mb-4">
          <CiBadgeDollar className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
          <h6 className="font-bold">Enter Campaign Budget</h6>
        </span>
        <div className="flex gap-4">
          <select className="outline-none rounded-2xl w-32 px-2">
            <option value="usd">USD</option>
          </select>
          <input
            type="text"
            placeholder="Enter Budget"
            id="budget"
            className="rounded-2xl py-3 pr-[100px] pl-[25px] shadow w-full outline-[#D9E9F2]"
          />
        </div>
      </div>

      <div className="bg-[#FCFCFC40] border border-[#FCFCFC] rounded-[30px] p-6 shadow">
        <span className="flex items-center gap-4 text-lg mb-4">
          <MdOutlineDateRange className="bg-[#00279926] rounded-[10px] w-10 h-10 px-3" />
          <h6 className="font-bold">Campaign Schedule</h6>
        </span>
        <span className="flex gap-8 ">
          <label className="lg:w-1/2">
            Enter the start date
            <input
              type="date"
              id="location"
              className="rounded-2xl py-3 px-2 w-full mt-2 shadow outline-[#D9E9F2]"
            />
          </label>
          <label className="lg:w-1/2">
            Enter the end date
            <input
              type="date"
              id="location"
              className="rounded-2xl py-3 px-2 w-full mt-2 shadow outline-[#D9E9F2]"
            />
          </label>
        </span>
      </div>
      <div className="flex justify-center mt-6 gap-4">
        <button
          type="button"
          className="w-fit bg-[#00A0F51A] rounded-[10px] text-[#007FC2] py-2 px-6 whitespace-pre font-medium border border-[#0086CD80] hover:opacity-70"
          onClick={() => setPage("adPreview")}
        >
          Go Back
        </button>
        <button
          type="button"
          className="w-fit custom-button rounded-[10px] text-white py-2 px-6 whitespace-pre font-medium" 
          onClick={handleLaunch_Campaign}
        >
          Launch Campaign
        </button>
      </div>
    </form>
  );
}
