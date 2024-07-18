import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import brandImage from '../../assets/dashboard_img/brand_img.png'; // Adjust the path as needed
import fileIcon from '../../assets/dashboard_img/file_c.svg'; // Adjust the path as needed

const ExistingCampaigns = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const updateRowsPerPage = () => {
      const availableHeight = window.innerHeight - 570; // Adjust this value based on other components' heights
      const rowHeight = 54; // Approximate height of a table row
      const newRowsPerPage = Math.floor(availableHeight / rowHeight);
      setRowsPerPage(newRowsPerPage > 0 ? newRowsPerPage : 3);
    };

    updateRowsPerPage();
    window.addEventListener('resize', updateRowsPerPage);

    return () => {
      window.removeEventListener('resize', updateRowsPerPage);
    };
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleCampaignClick = (campaign) => {
    navigate(`/campaign-insights/${campaign.id}`, { state: { campaign } });
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex-grow overflow-y-auto hide-scrollbar" style={{ maxHeight: '90vh' }}>
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 border border-[#FCFCFC] rounded-3xl h-[calc(100vh-180px)]">
        <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-6 relative">
          <span className="flex items-center gap-2 lg:gap-4">
            <img src="/icon1.svg" alt="" className="w-10 lg:w-14" />
            <span className="flex flex-col">
              <h4 className="text-[#082A66] font-bold text-xl lg:text-2xl">
                Existing Campaigns
              </h4>
              <p className="text-[#374151] text-xs lg:text-base">
                Modify or create new campaigns
              </p>
            </span>
          </span>
          <img
            src={brandImage}
            alt="Brand Banner"
            className="absolute bottom-0 right-24 w-44 hidden lg:block"
          />
        </div>
        <div className="flex justify-end pr-6">
          <div className="p-2 border border-1 border-[#FCFCFC80] bg-[rgba(252,252,252,0.25)] rounded-3xl">
            <button className="bg-[#00A0F5] text-white px-6 py-3 rounded-3xl shadow-[0_13px_25px_0_#00A0F557]">
              Create Campaign
            </button>
          </div>
        </div>
        <div className="m-6 mt-0 border border-[#FCFCFC] bg-[rgba(252,252,252,0.25)] rounded-3xl">
          <table className="w-full divide-y divide-[#FCFCFC] rounded-3xl">
            <thead className="bg-[rgba(252,252,252,0.50)]">
              <tr className="rounded-t-3xl">
                <th className="px-4 py-6 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider rounded-tl-3xl">
                  Started On
                </th>
                <th className="px-4 py-6 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Campaign Info
                </th>
                <th className="px-4 py-6 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Amount Spent
                </th>
                <th className="px-4 py-6 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  ROAS
                </th>
                <th className="px-4 py-6 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-4 py-6 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider rounded-tr-3xl">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FCFCFC] rounded-b-3xl">
              {currentCampaigns.map((campaign, index) => (
                <tr key={index} className="rounded-lg">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#082A66]">{campaign.startedOn}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#082A66]">
                    <button 
                      className="items-center gap-1 bg-[rgba(252,252,252,0.40)] p-1 rounded-md text-xs inline-block text-[#6B7280]"
                      onClick={() => handleCampaignClick(campaign)}
                    >
                      <span className="flex items-center">
                        {campaign.id}
                        <img src={fileIcon} alt="File Icon" className="ml-1 w-4 h-4" />
                      </span>
                    </button>
                    <div className="mt-2">{campaign.info}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#082A66]">
                    {campaign.amountSpent}
                    <div className="flex items-center mt-2">
                      <div className="relative w-[60px] h-[6px] bg-[#D9D9D9] rounded-full">
                        <div className="absolute top-0 left-0 h-full bg-[#00A0F5] rounded-full" style={{ width: campaign.percentage }}></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-[#082A66]">{campaign.percentage}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#082A66]">{campaign.roas}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#082A66]">{campaign.ctr}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`w-[122px] h-[43px] inline-flex items-center justify-center leading-5 font-semibold rounded-lg ${
                      campaign.status === 'In Review' ? 'bg-[#F9F1FE] text-[#DA9EFF] border border-[#DA9EFF]' :
                      campaign.status === 'Pending' ? 'bg-[#FFEDD5] text-[#FF960A] border border-[#FFC270]' :
                      'bg-[#DCFCE7] text-[#80F4A8] border border-[#80F4A8]'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="6" className="px-4 py-3 text-right pr-14">
                  {currentPage > 1 ? (
                    <button onClick={handlePrevPage} className="px-4 py-1 bg-white border border-gray-300 rounded-md mr-2">Prev</button>
                  ) : (
                    <button className="px-4 py-1 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed mr-2" disabled>Prev</button>
                  )}
                  {(currentPage * rowsPerPage) < campaigns.length ? (
                    <button onClick={handleNextPage} className="px-4 py-1 bg-white border border-gray-300 rounded-md">Next</button>
                  ) : (
                    <button className="px-4 py-1 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed" disabled>Next</button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const campaigns = [
  {
    id: '64997866543456',
    startedOn: '14 December, 2024',
    info: 'Pile Coar - White - Ladies | HS',
    amountSpent: '$844',
    percentage: '24%',
    roas: '$2.11',
    ctr: '1 days',
    status: 'In Review'
  },
  {
    id: '64997866543456',
    startedOn: '14 December, 2024',
    info: 'Pile Coar - White - Ladies | HS',
    amountSpent: '$844',
    percentage: '84%',
    roas: '$2.11',
    ctr: '1 days',
    status: 'Pending'
  },
  {
    id: '64997866543456',
    startedOn: '14 December, 2024',
    info: 'Pile Coar - White - Ladies | HS',
    amountSpent: '$844',
    percentage: '84%',
    roas: '$2.11',
    ctr: '1 days',
    status: 'Completed'
  },
  {
    id: '64997866543456',
    startedOn: '14 December, 2024',
    info: 'Pile Coar - White - Ladies | HS',
    amountSpent: '$844',
    percentage: '84%',
    roas: '$2.11',
    ctr: '1 days',
    status: 'In Review'
  },
  {
    id: '64997866543457',
    startedOn: '15 December, 2024',
    info: 'Pile Coar - Blue - Ladies | HS',
    amountSpent: '$900',
    percentage: '65%',
    roas: '$2.50',
    ctr: '2 days',
    status: 'In Review'
  },
  {
    id: '64997866543458',
    startedOn: '16 December, 2024',
    info: 'Pile Coar - Red - Ladies | HS',
    amountSpent: '$780',
    percentage: '50%',
    roas: '$1.90',
    ctr: '3 days',
    status: 'Pending'
  }
];

export default ExistingCampaigns;
