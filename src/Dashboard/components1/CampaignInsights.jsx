import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import brandImage from "../../assets/dashboard_img/brand_img.png"; // Adjust the path as needed
import fileIcon from "../../assets/dashboard_img/file_c.svg"; // Adjust the path as needed
import larrow from "../../assets/dashboard_img/larrow.svg"; // Adjust the path as needed
import pimage from "../../assets/dashboard_img/product_img.svg";
import productImage from "../../assets/dashboard_img/product_img.svg";
import clockIcon from "../../assets/dashboard_img/clock.png";
import fireIcon from "../../assets/dashboard_img/fire.png";
import frockIcon from "../../assets/dashboard_img/frock.png";
import shareIcon from "../../assets/dashboard_img/share.svg";

const CampaignInsights = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedTime, setSelectedTime] = useState("Last 30 days");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("CTR");
  const [view, setView] = useState("Campaign Insights");

  if (!state || !state.campaign) {
    return <div>No campaign data available</div>;
  }

  const { campaign } = state;

  useEffect(() => {
    if (view === "Campaign Insights") {
      initializeChart();
    }
  }, [view, selectedMetric]);

  const initializeChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: selectedMetric,
              data: [
                2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2,
              ], // Sample data, update based on metric
              borderColor: "#00A0F5",
              backgroundColor: "rgba(0, 160, 245, 0.1)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#00A0F5",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#00A0F5",
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              mode: "nearest",
              intersect: false,
              backgroundColor: "#fff",
              borderColor: "#00A0F5",
              borderWidth: 1,
              titleColor: "#00A0F5",
              bodyColor: "#000",
              displayColors: false,
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.raw}`;
                },
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Month",
              },
            },
            y: {
              title: {
                display: true,
                text: selectedMetric,
              },
              beginAtZero: true,
            },
          },
          onHover: function (event, chartElement) {
            event.native.target.style.cursor = chartElement[0]
              ? "pointer"
              : "default";
          },
        },
      });
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setIsDropdownOpen(false);
  };

  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  const handleViewChange = (view) => {
    setView(view);
  };

  const AdLevelInsights = () => {
    const adData = [
      {
        id: 1,
        template: "Template 1",
        ctr: "2.18%",
        cpm: "$11.5",
        results: 7,
        impression: 25314,
        amountSpend: "$240",
        details: [
          "Don't Miss Out! HM US",
          "White Pile Coat for Ladies",
          "Calf-Length and Lined",
        ],
      },
      {
        id: 2,
        template: "Template 1",
        ctr: "2.18%",
        cpm: "$11.5",
        results: 7,
        impression: 25314,
        amountSpend: "$240",
        details: [
          "Don't Miss Out! HM US",
          "White Pile Coat for Ladies",
          "Calf-Length and Lined",
        ],
      },
      {
        id: 3,
        template: "Template 1",
        ctr: "2.18%",
        cpm: "$11.5",
        results: 7,
        impression: 25314,
        amountSpend: "$240",
        details: [
          "Don't Miss Out! HM US",
          "White Pile Coat for Ladies",
          "Calf-Length and Lined",
        ],
      },
      {
        id: 4,
        template: "Template 1",
        ctr: "2.18%",
        cpm: "$11.5",
        results: 7,
        impression: 25314,
        amountSpend: "$240",
        details: [
          "Don't Miss Out! HM US",
          "White Pile Coat for Ladies",
          "Calf-Length and Lined",
        ],
      },
    ];

    return (
      <div className="overflow-auto">
        <table className="min-w-full bg-[rgba(252,252,252,0.40)] rounded-2xl">
          <thead>
            <tr className="w-full  border-b border-gray-200 text-[#6B7280] p-4">
              <th className="py-4 text-left  font-medium pl-6">On / Off</th>
              <th className="py-2 text-left font-medium  pl-10">
                Ad Creatives
              </th>
              <th className="py-2 text-left font-medium pl-10">CTR</th>
              <th className="py-2 text-left font-medium pl-6">Cpm</th>
              <th className="py-2 text-left font-medium pl-6">Results</th>
              <th className="py-2 text-left font-medium pl-6">Impression</th>
              <th className="py-2 text-left font-medium pl-6">Amount Spend</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {adData.map((ad) => (
              <tr key={ad.id} className="border-b border-gray-200">
                <td className="py-4 px-6 text-center">
                  <Switch isChecked={true} onToggle={() => {}} />
                </td>
                <td className="py-4 px-6 flex items-center">
                  <img
                    src={productImage}
                    alt="Ad Creative"
                    className="w-34 h-34 mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-[#082A66]">{ad.template}</h3>
                    <ul>
                      {ad.details.map((detail, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {index === 0 ? (
                            <span>
                              <img
                                src={clockIcon}
                                alt="Clock"
                                className="inline-block h-3 mr-1"
                              />
                            </span>
                          ) : index === 1 ? (
                            <span>
                              <img
                                src={frockIcon}
                                alt="Frock"
                                className="inline-block h-3 mr-1"
                              />
                            </span>
                          ) : (
                            <span>
                              <img
                                src={fireIcon}
                                alt="Fire"
                                className="inline-block h-3 mr-1"
                              />
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">{ad.ctr}</td>
                <td className="py-4 px-6 text-center">{ad.cpm}</td>
                <td className="py-4 px-6 text-center">{ad.results}</td>
                <td className="py-4 px-6 text-center">{ad.impression}</td>
                <td className="py-4 px-6 text-center">{ad.amountSpend}</td>
                <td className="py-4 px-6 text-center">
                  <button className="p-2 bg-[#0053EC] rounded-lg">
                    <img src={shareIcon} alt="Share" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 border border-[#FCFCFC] rounded-3xl mx-auto max-w-6xl w-full">
      <div className="flex justify-between items-center rounded-t-3xl bg-[rgba(252,252,252,0.40)] p-3 lg:p-6 relative">
        <span className="flex items-center gap-2 lg:gap-4">
          <img src="/icon1.svg" alt="" className="w-10 lg:w-14" />
          <span className="flex flex-col">
            <h4 className="text-[#082A66] font-bold text-xl lg:text-2xl">
              Campaign Metrics
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
      <div className="overflow-auto" style={{ maxHeight: "62vh" }}>
        <div className="flex justify-between items-start pt-0 rounded-3xl p-6 pb-0 pl-4 lg:mt-0">
          <div className="flex flex-col items-start gap-1 lg:gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 ml-2"
            >
              <img src={larrow} alt="Back" className="w-1" />
              <div className="flex items-center gap-1 text-[#082A66] text-sm">
                <span>{campaign.id}</span>
                <img src={fileIcon} alt="File Icon" className="w-3 h-3" />
              </div>
            </button>
            <div className="flex items-center p-2 gap-2 mt-3 ml-0 bg-[#FCFCFC40] border border-[#FCFCFC] rounded-3xl shadow-[0px_20px_40px_0px_#3C2A8214]">
              <button
                onClick={() => handleViewChange("Campaign Insights")}
                className={`px-3 py-2 rounded-full text-[#082A66] text-sm font-bold ${
                  view === "Campaign Insights" ? "bg-white" : ""
                }`}
              >
                Campaign Insights
              </button>
              <button
                onClick={() => handleViewChange("Ad Level Insights")}
                className={`px-3 py-2 rounded-full text-[#082A66] text-sm font-bold ${
                  view === "Ad Level Insights" ? "bg-white" : ""
                }`}
              >
                Ad Level Insights
              </button>
            </div>
          </div>
          <div className="relative p-2 bg-[#FCFCFC40] border border-[#FCFCFC] shadow-[0px_10px_35px_0px_#3C2A820F] rounded-3xl">
            <button
              onClick={handleDropdownToggle}
              className="px-8 py-2 rounded-full text-[#082A66] font-semibold bg-white relative"
            >
              {selectedTime}
              <svg
                className={`w-4 h-4 ml-2 inline-block transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 w-full mt-2 bg-white border border-[#FCFCFC] rounded-xl shadow-lg z-10">
                <button
                  onClick={() => handleTimeSelection("Last 30 days")}
                  className="block w-full text-left px-4 py-2 text-[#082A66] hover:bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] rounded-t-xl"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => handleTimeSelection("Last 7 days")}
                  className="block w-full text-left px-4 py-2 text-[#082A66] hover:bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2]"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => handleTimeSelection("Last 3 months")}
                  className="block w-full text-left px-4 py-2 text-[#082A66] hover:bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2]"
                >
                  Last 3 months
                </button>
                <button
                  onClick={() => handleTimeSelection("Last 6 months")}
                  className="block w-full text-left px-4 py-2 text-[#082A66] hover:bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2]"
                >
                  Last 6 months
                </button>
                <button
                  onClick={() => handleTimeSelection("Last 1 year")}
                  className="block w-full text-left px-4 py-2 text-[#082A66] hover:bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] rounded-b-xl"
                >
                  Last 1 year
                </button>
              </div>
            )}
          </div>
        </div>
        {view === "Campaign Insights" && (
          <>
            <h2 className="text-[#082A66] font-semibold text-lg m-6">
              Campaign Metrics
            </h2>
            <div className="flex flex-wrap gap-6 m-4 bg-[rgba(252,252,252,0.40)] p-3 lg:mr-6 pt-0 pb-0 rounded-xl">
              <div className="flex items-center gap-4">
                <img
                  src={pimage}
                  alt="Campaign"
                  className="w-24 h-24 rounded-xl"
                />
                <div>
                  <h3 className="text-[#082A66] font-bold text-lg">
                    {campaign.info}
                  </h3>
                  <span
                    className={`inline-block px-3 mt-2 py-1 rounded-md text-sm font-semibold ${
                      campaign.status === "In Review"
                        ? "bg-[#DA9EFF33] text-[#DA9EFF] border border-[#DA9EFF]"
                        : campaign.status === "Pending"
                        ? "bg-[#FFC27033] text-[#FFC270] border border-[#FFC270]"
                        : "bg-[#80F4A833] text-[#80F4A8] border border-[#80F4A8]"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-24">
                <div>
                  <h4 className="text-[#6B7280] font-roboto font-normal pt-4 ml-8">
                    Started On
                  </h4>
                  <p className="pt-2 ml-6">
                    {new Date(campaign.startedOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#6B7280] font-roboto font-normal pt-4">
                    Ends On
                  </h4>
                  <p className="pt-2">
                    {new Date(campaign.endsOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between m-6 p-2 pl-3 pr-3 gap-8 lg:ml-20 bg-[rgba(252,252,252,0.60)]  rounded-3xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#082A66] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#1C68ED]"></div>
                  </div>
                  <span className="ml-2 text-[#082A66]">3 live ads</span>
                </div>
                <button
                  className="px-4 py-2 rounded-full border text-white"
                  style={{
                    background:
                      "radial-gradient(156.73% 166.53% at -50.24% -35.81%, #1547DB 30%, #1547DB 80%)",
                  }}
                >
                  View
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6 m-4 bg-[rgba(252,252,252,0.40)] p-3 lg:mr-6 pt-0 pb-0 rounded-xl">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-start justify-center w-full gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-md font-medium text-gray-900 m-4 mb-2">
                        Amount Spent
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full ml-6 mt-2 flex items-center justify-center cursor-pointer ${
                          selectedMetric === "Amount Spent"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => handleMetricChange("Amount Spent")}
                      >
                        {selectedMetric === "Amount Spent" && (
                          <span className="text-white text-xs">&#10003;</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-bold text-[#082A66] ml-4 mb-4">
                      $844
                    </p>
                  </div>
                  <div className="flex items-start justify-center h-28 border-r border-gray-300"></div>
                </div>
                <div className="flex items-start justify-center w-full gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-md font-medium text-gray-900 m-4 mb-2">
                        Results
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full  ml-6 mt-2 flex items-center justify-center cursor-pointer ${
                          selectedMetric === "Results"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => handleMetricChange("Results")}
                      >
                        {selectedMetric === "Results" && (
                          <span className="text-white text-xs">&#10003;</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-bold text-[#082A66] ml-4 mb-4">
                      $18
                    </p>
                  </div>
                  <div className="flex items-start justify-center  h-28 border-r border-gray-300"></div>
                </div>
                <div className="flex items-start justify-center w-full gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-md font-medium text-gray-900 m-4 mb-2">
                        Cost per result
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full ml-6 mt-2 flex items-center justify-center cursor-pointer ${
                          selectedMetric === "Cost per result"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => handleMetricChange("Cost per result")}
                      >
                        {selectedMetric === "Cost per result" && (
                          <span className="text-white text-xs">&#10003;</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-bold text-[#082A66] ml-4 mb-4">
                      $46.8
                    </p>
                  </div>
                  <div className="flex items-start justify-center h-28 border-r border-gray-300"></div>
                </div>
                <div className="flex items-start justify-center w-full gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-md font-medium text-gray-900 m-4 mb-2">
                        ROAS
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full ml-6 mt-2 flex items-center justify-center cursor-pointer ${
                          selectedMetric === "ROAS"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => handleMetricChange("ROAS")}
                      >
                        {selectedMetric === "ROAS" && (
                          <span className="text-white text-xs">&#10003;</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-bold text-[#082A66] ml-4 mb-4">
                      $2.11
                    </p>
                  </div>
                  <div className="flex items-start justify-center h-28 border-r border-gray-300"></div>
                </div>
                <div className="flex items-start justify-center w-full gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-md font-medium text-gray-900 m-4 mb-2">
                        CTR
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full ml-6 mt-2 flex items-center justify-center cursor-pointer ${
                          selectedMetric === "CTR"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => handleMetricChange("CTR")}
                      >
                        {selectedMetric === "CTR" && (
                          <span className="text-white text-xs">&#10003;</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xl font-bold text-[#082A66] ml-4 mb-4">
                      2.18%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 m-4 border border-[#FCFCFC] bg-[rgba(252,252,252,0.25)] rounded-3xl">
              <h2 className="text-[#082A66] font-bold text-2xl">
                {selectedMetric}{" "}
              </h2>
              <div className="relative">
                <canvas ref={chartRef} id="ctrChart"></canvas>
              </div>
            </div>
          </>
        )}
        {view === "Ad Level Insights" && (
          <div className="m-6">
            <AdLevelInsights />
          </div>
        )}
      </div>
    </div>
  );
};

// Switch Component within the same file
const Switch = ({ isChecked, onToggle }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={onToggle} />
      <span className="slider round"></span>
    </label>
  );
};

// Add CSS for the Switch within a <style> tag
const styles = `
  .switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #4CAF50;
  }

  input:checked + .slider:before {
    transform: translateX(14px);
  }
`;

export default CampaignInsights;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
