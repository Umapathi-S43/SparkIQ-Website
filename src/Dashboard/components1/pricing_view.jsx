import React from 'react';
import congratsBg from '../../assets/dashboard_img/congrats_bg.svg'; // Adjust the path as needed
import brandImage from '../../assets/dashboard_img/brand_img.png'; // Adjust the path as needed
import brandIcon from '../../assets/dashboard_img/brand.svg'; // Adjust the path as needed
import icon7 from '../../assets/dashboard_img/ai_img.svg'; // Adjust the path as needed

const PricingSection = ({ price, features, prime }) => (
  <div className={`pricing-section ${prime ? 'prime' : ''} flex-1 flex flex-col items-center`}>
    <div className="inner-box flex flex-col items-center w-full h-full">
      <div className={`price-section flex flex-col items-center ${prime ? 'prime-bg' : ''}`}>
        <img src={icon7} alt="icon7" className="w-32 h-32 mb-4" />
        <div className="text-2xl font-bold flex items-center">
          <span className="dollar-symbol">$</span>
          <span className="price">{price}</span>
          <span className="duration">/ mo</span>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 mt-4 mb-4 rounded">Try Spark +</button>
      </div>
      <hr className="border-t-1 border-gray-300 w-full" />
      <ul className="w-full flex-grow mt-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center mb-2">
            <span className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full mr-2">
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

const Pricing = () => {
  const featuresNormal = [
    'Facebook and Google ads Integration',
    'Multi location targeting',
    'Interest targeting',
    'Ad copies with tone',
    'Simple reporting',
  ];

  const featuresPrime = [
    'Unlimited Workspaces',
    'Share Reports with Clients',
    'Manage unlimited facebook & google ad accounts',
    'PDF Exports',
    'Detailed reporting',
    'Priority support',
    'Competitor Insights',
  ];

  return (
    <div className="container mx-auto flex flex-col items-center">
      <style>{`
        .pricing-section {
          border-top: 2px solid #FDBA74; /* For normal */
          background: #FCFCFC40;
          display: flex;
          flex-direction: column;
        }
        
        .pricing-section.prime {
          border-top: 2px solid #4ADE80; /* For prime */
          background: #FCFCFC40;
        }
        
        .inner-box {
          border-width: 0px 0px 0px 0px;
          border-style: solid;
          border-color: #FCFCFC;
          box-shadow: 0px 1px 0px 0px #0000000D;
          
          background: #FCFCFC40;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .prime-bg {
          background-image: url(${congratsBg});
          background-size: cover;
          background-position: center;
          height: 280px; /* Adjust the height as needed */
          margin: 0;
        }

        .price-section {
          height: 280px; /* Adjust the height as needed */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .dollar-symbol {
          color: #020817;
          font-family: Roboto;
          font-size: 30px;
          font-weight: 500;
          line-height: 50px;
          text-align: left;
        }

        .price {
          font-family: Roboto;
          font-size:30px;
          font-weight: 500;
          line-height: 50px;
          text-align: left;
          color: #082A66;
        }

        .duration {
          font-family: Roboto;
          font-size: 20px;
          font-weight: 400;
          line-height: 24px;
          margin-left: 8px;
          color: #00040A80;
        }
        
        .billing-buttons {
          background: #FCFCFC40;
          border: 1px solid #FCFCFC;
          box-shadow: 0px 20px 40px 0px #3C2A8214;
          width: 322px;
          height: 80px;
          padding: 12px 24px;
          gap: 16px;
          border-radius: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
        }

        .billing-button {
          background: #FCFCFC40;
          border: 1px solid #FCFCFC;
          padding: 12px 24px;
          border-radius: 30px;
          box-shadow: 0px 20px 40px 0px #3C2A8214;
          margin: 0 8px;
          cursor: pointer;
        }

        .billing-button:hover {
          background: #FFF;
        }

        hr {
          border: 1px solid #FCFCFC;
          width: 100%;
        }
      `}</style>
      <div className="w-full max-w-6xl flex flex-col items-center border border-[#FCFCFC] rounded-[32px]">
        <div className="flex justify-between items-center rounded-t-[32px] relative bg-[rgba(252,252,252,0.40)] h-28 p-6 w-full">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="icon1.svg" alt="" className="w-14 h-14" />
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
        <div className="p-4 w-full">
          <div className="billing-buttons flex gap-2 text-nowrap">
            <button className="billing-button">Billed Monthly</button>
            <button className="billing-button">Billed Yearly</button>
          </div>
          <div className="flex mt-8 w-full px-4">
            <PricingSection price="12" features={featuresNormal} />
            <PricingSection price="30" features={featuresPrime} prime />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
