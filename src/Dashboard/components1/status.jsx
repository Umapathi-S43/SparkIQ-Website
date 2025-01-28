import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import handimg from "../../assets/dashboard_img/hand.png";
import setup from "../../assets/dashboard_img/setup-brand.svg.png";
import productSetup from "../../assets/dashboard_img/bag.svg";
import campaign from "../../assets/dashboard_img/campaign.png";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../components/utils/Constant";
import { jwtToken } from "../../components/utils/jwtToken";

const HomePage = () => {
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [task1Completed, setTask1Completed] = useState(false);
  const [task2Completed, setTask2Completed] = useState(false);
  const [task3Completed, setTask3Completed] = useState(false);
  const [selectedTask, setSelectedTask] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/info`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const userInfo = response.data.data;
        const task1 = userInfo.brandsCompleted >= 1;
        const task2 = userInfo.productsCreated >= 1;
        const task3 = userInfo.generatedImages >= 1;

        setTask1Completed(task1);
        setTask2Completed(task2);
        setTask3Completed(task3);

        let completedCount = 0;
        if (task1) completedCount++;
        if (task2) completedCount++;
        if (task3) completedCount++;
        setTasksCompleted(completedCount);

        if (task1 && !task2) {
          setSelectedTask(2);
        } else if (task1 && task2 && !task3) {
          setSelectedTask(3);
        } else {
          setSelectedTask(1);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        toast.error("An error occurred while fetching user info. Please try again.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleNavigateToBrandSetup = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/info`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const userInfo = response.data.data;

      if (userInfo.brandsCompleted < userInfo.maxBrands) {
        setTimeout(() => {
          navigate("/brandsetup", { state: { taskNumber: 1 } });
        }, 100);
      } else {
        toast.error(
          "You have reached the maximum number of brands. Upgrade your plan to add more."
        );
        setTimeout(() => {
          navigate("/upgrade");
        }, 100);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleNavigateToProductSetup = () => {
    setTimeout(() => {
      navigate("/productdetails", { state: { taskNumber: 2 } });
    }, 100);
  };

  const handleCreateCampaign = () => {
    setTimeout(() => {
      localStorage.removeItem("generateAdState");
      localStorage.removeItem("selectedProduct");
      localStorage.removeItem("productID");
      navigate("/campaigns", { state: { taskNumber: 3 } });
    }, 100);
  };

  const canAccessTask = (taskNumber) => {
    if (taskNumber === 1) return true;
    if (taskNumber === 2) return task1Completed;
    if (taskNumber === 3) return task1Completed && task2Completed;
    return false;
  };

  return (
    <div className="flex-grow overflow-y-auto hide-scrollbar" style={{ maxHeight: "80vh" }}>
      <div className="max-w-6xl mx-auto mb-2 border border-[#fcfcfc] rounded-3xl pt-8 flex flex-col items-center gap-6">
        <h1 className="text-xl lg:text-2xl font-medium mb-2 text-center pt-2">
          Welcome to Spark IQ <img src={handimg} alt="Hai" className="inline-block w-6 lg:w-8 h-6 lg:h-8" />
        </h1>
        <div className="mb-8 w-11/12 lg:w-4/6 border border-[#FCFCFC] bg-[#FCFCFC] bg-opacity-25 rounded-3xl p-6 lg:p-10">
          <h2 className="text-lg lg:text-xl font-bold">Getting Started</h2>
          <p className="text-gray-600 mb-4">Get ready to launch your campaign with our quick checklist!</p>
          <div className="flex flex-col lg:flex-row items-center mb-4">
            <p className="text-sm lg:text-md font-bold mb-2 lg:mb-0 pr-2">{tasksCompleted} out of 3 tasks completed</p>
            <div className="flex-grow lg:ml-4 h-2 bg-white rounded-full w-4/6">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(tasksCompleted / 3) * 100}%` }}></div>
            </div>
          </div>
          <div className="space-y-4">
            {/* Task 1: Brand Setup */}
            <Task
              taskNumber={1}
              title="Brand Setup"
              description="Add your brand details and get ready to launch the things"
              isCompleted={task1Completed}
              isActive={selectedTask === 1}
              canAccess={canAccessTask(1)}
              handleTaskAction={handleNavigateToBrandSetup}
              image={setup}
            />

            {/* Task 2: Product Setup */}
            <Task
              taskNumber={2}
              title="Product Setup"
              description="Add your product details to prepare for campaigns"
              isCompleted={task2Completed}
              isActive={selectedTask === 2}
              canAccess={canAccessTask(2)}
              handleTaskAction={handleNavigateToProductSetup}
              image={campaign}
            />

            {/* Task 3: Generate Creatives */}
            <Task
              taskNumber={3}
              title="Generate Your First Creative"
              description="Generate an AI creative to start reaching your audience effectively."
              isCompleted={task3Completed}
              isActive={selectedTask === 3}
              canAccess={canAccessTask(3)}
              handleTaskAction={handleCreateCampaign}
              image={campaign}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Task = ({ taskNumber, title, description, isCompleted, isActive, canAccess, handleTaskAction, image }) => (
  <div
    className={`border p-3 rounded-lg cursor-pointer ${isActive ? "bg-[rgba(252,252,252,0.25)] border-[#FCFCFC]" : ""}`}
    onClick={() => canAccess && handleTaskAction()}
    style={{ opacity: canAccess ? "1" : "0.5", pointerEvents: canAccess ? "auto" : "none" }}
  >
    <div className="flex justify-start relative">
      <div className="absolute w-10 h-10 rounded-lg bg-[rgba(0,39,153,0.15)] flex items-center justify-center">
        <div className="w-7 h-7 rounded-lg bg-[#082A66] flex items-center justify-center">
          <div className={`w-4 h-4 text-white font-semibold rounded-full ${isCompleted ? 'bg-white' : 'bg-[#082A66]'} flex items-center justify-center`}>
            {isCompleted ? (
              <svg
                className="w-3 h-3 text-[#082A66]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              taskNumber
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow ml-16">
        <p className="font-bold text-[#082A66]">{title}</p>
        {isActive && (
          <>
            <p className="text-xs lg:text-sm text-gray-600">{description}</p>
            <button className="custom-button p-2 pl-6 pr-6 text-white rounded-xl shadow-xl flex justify-center lg:w-fit w-40 mt-3 text-nowrap">
              Setup Now
            </button>
            <img src={image} alt={title} className="absolute right-2 lg:right-6 bottom-1 w-16 lg:w-24 h-20 hidden lg:block" />
          </>
        )}
      </div>
    </div>
  </div>
);

export default HomePage;
