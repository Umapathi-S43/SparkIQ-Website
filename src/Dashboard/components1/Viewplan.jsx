import React, { useState } from 'react';
import brandImage from '../../assets/dashboard_img/brand_img.png'; // Adjust the path as needed
import congratsBg from '../../assets/dashboard_img/congrats_bg.svg'; // Adjust the path as needed
import aiImg from '../../assets/dashboard_img/ai_img.svg'; // Adjust the path as needed
import comingSoonImage from '/coming-soon-sparkiq.png'; // Provide the correct path for the "Coming Soon" image


const PlanCard = ({ planType, price, billingCycle, features, isProPlan }) => {
  return (
    <div
      className={`border border-[#FCFCFC] bg-[rgba(252,252,252,0.25)] w-full lg:w-1/2 relative flex flex-col ${
        isProPlan ? 'pro-plan' : ''
      }`}
      style={{
        borderTop: isProPlan ? '3px solid #4ADE80' : '3px solid #FDBA74',
        borderLeft: isProPlan ? 'none' : '',
        borderRight: isProPlan ? '' : 'none',
        borderBottomLeftRadius: isProPlan ? '0' : '16px',
        borderBottomRightRadius: isProPlan ? '16px' : '0',
      }}
    >
      {isProPlan && (
        <div className="absolute top-0 right-0 w-full h-1/2">
          <img
            src={congratsBg}
            alt="Background"
            className="w-full h-full object-cover"
            style={{ borderBottomRightRadius: '16px' }}
          />
        </div>
      )}
      <div className="p-6 relative flex-grow z-10">
        <div className="flex items-center justify-center">
          <img src={aiImg} alt="AI Icon" className="w-24 h-24 flex justify-center" />
          <h4 className="text-center text-[#082A66] text-2xl font-bold ">{isProPlan ? 'Pro' : ''}</h4>
        </div>
        <p className="text-center mt-4 text-lg">{`$${price} / ${billingCycle}`}</p>
        <div className="flex justify-center">
          <button className="text-white px-8 py-2 mt-4 rounded-lg" style={{ background: 'linear-gradient(72.16deg, #00A0F5 2.97%, #5CC6FF 97.52%)' }}>Try Spark +</button>
        </div>
      </div>
      <div className="p-6 flex-grow justify-start mt-12">
        <h5 className="text-left font-bold mb-4">Top features</h5>
        <ul className="list-disc list-inside space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-start">
              <span className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full mr-2">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Viewplan = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  const handlePlanChange = (plan) => {
    setIsMonthly(plan === 'monthly');
  };

  const standardFeatures = [
    'Facebook and Google ads Integration',
    'Multi location targeting',
    'Interest targeting',
    'Ad copies with tone',
    'Simple reporting',
  ];

  const proFeatures = [
    'Unlimited Workspaces',
    'Share Reports with Clients',
    'Manage unlimited facebook & google ad accounts',
    'PDF Exports',
    'Detailed reporting',
    'Priority support',
    'Competitor Insights',
  ];

  return (
    <div className="coming-soon p-2 border-2 w-fit lg:ml-10 flex justify-center items-center rounded-xl">
    <img src={comingSoonImage} alt="Coming Soon" className='rounded-lg flex justify-center items-center' style={{ height: '75vh' }} />
  </div>
);
};

export default Viewplan;

    {/*
    <div className="max-w-6xl w-full mx-auto flex flex-col border border-[#FCFCFC] rounded-3xl">
      
      <div className="flex justify-between items-center rounded-t-3xl relative bg-[rgba(252,252,252,0.40)] h-28 p-6 w-full">
        <span className="flex items-center gap-2 lg:gap-4">
          <img src="icon1.svg" alt="icon1" className="w-14 h-14" />
          <span className="flex flex-col">
            <h4 className="text-[#082A66] font-bold text-xl md:text-2xl lg:text-2xl">Pricing</h4>
            <p className="text-[#374151] lg:text-sm text-xs">Pricing that doesn’t burn a hole in your marketing pocket</p>
          </span>
        </span>
        <img
          src={brandImage}
          alt="Brand Banner"
          className="absolute bottom-0 right-24 w-44 hidden lg:block"
        />
      </div>
      
      <div className="border border-[#FCFCFC] m-4 p-4 rounded-xl hide-scrollbar" style={{ overflow: 'auto', maxHeight: '55vh' }}>
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 border border-[#FCFCFC] p-3 rounded-3xl">
            <button
              onClick={() => handlePlanChange('monthly')}
              className={`px-3 py-2 rounded-full text-xs font-bold ${
                isMonthly ? 'bg-white' : 'text-[#082A66]'
              } border border-transparent hover:border-[#FCFCFC]`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => handlePlanChange('yearly')}
              className={`px-3 py-2 rounded-full text-xs font-bold ${
                !isMonthly ? 'bg-white' : 'text-[#082A66]'
              } border border-transparent hover:border-[#FCFCFC]`}
            >
              Billed Yearly
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row m-12 mb-8">
          <PlanCard 
            planType="Standard" 
            price={isMonthly ? '12' : '120'} 
            billingCycle={isMonthly ? 'month' : 'year'} 
            features={standardFeatures}
            isProPlan={false}
          />
          <PlanCard 
            planType="Pro" 
            price={isMonthly ? '30' : '300'} 
            billingCycle={isMonthly ? 'month' : 'year'} 
            features={proFeatures}
            isProPlan={true}
          />
        </div>
      </div>
    </div>
      */}
     