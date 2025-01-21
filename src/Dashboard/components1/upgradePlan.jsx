import React from "react";
import { MdMail, MdPhone } from "react-icons/md";
import brandImage from "../../assets/dashboard_img/brand_img.png";

const UpgradePlan = () => {
  return (
    <div className="flex-grow mb-6 h-screen flex items-start justify-start">
      <div className="max-w-6xl mx-auto border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
      <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl p-4">
      <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center lg:ml-4">
                <div className="absolute flex items-center justify-center lg:w-12 lg:h-12 w-10 h-10 bg-[rgba(0,39,153,0.15)] rounded-2xl"></div>
                <div className="relative lg:w-8 lg:h-8 w-7 h-7 bg-[#082A66] rounded-xl flex items-center justify-center">
                  <MdMail className="text-white w-4 h-4" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="lg:text-3xl text-xl font-bold text-[#082a66] lg:ml-4">
                  Upgrade Your Plan
                </h1>
                <p className="lg:text-sm text-xs text-[#082a66] lg:ml-4">
                  Enhance your creative capabilities and unlock advanced features.
                </p>
              </div>
            </div>
            <img
              src={brandImage}
              alt="Brand Banner"
              className="w-[180px] h-[90px] mr-20 md:-mb-4 hidden lg:block"
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full mt-10 px-6 mb-20">
          <p className="text-[#374151] text-lg font-medium text-center mb-12">
            Upgrade your plan to access advanced features and take your creativity
            to the next level. For more details, please contact the administrator.
          </p>

          {/* Helpline and Contact Information */}
          <div className="mt-8 flex flex-col items-center gap-4 pb-20">
            <div className="flex items-center gap-4">
              <MdMail className="text-2xl text-[#082A66]" />
              <a
                href="mailto:admin@sprakiq.ai"
                className="text-[#082A66] font-medium text-lg"
              >
                admin@sprakiq.ai
              </a>
            </div>
            <div className="flex items-center gap-4">
              <MdPhone className="text-2xl text-[#082A66]" />
              <span className="text-[#082A66] font-medium text-lg">
                +91 9133453036
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
