import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import handimg from '../../assets/dashboard_img/hand.png';
import setup from '../../assets/dashboard_img/setup-brand.svg.png';
import connect from '../../assets/dashboard_img/connect.png';
import campaign from '../../assets/dashboard_img/campaign.png';

const HomePage = () => {
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [task1Completed, setTask1Completed] = useState(false);
  const [task2Completed, setTask2Completed] = useState(false);
  const [task3Completed, setTask3Completed] = useState(false);
  const [selectedTask, setSelectedTask] = useState(1); // Open the first task by default
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const task1 = localStorage.getItem('task1Completed') === 'true';
    const task2 = localStorage.getItem('task2Completed') === 'true';
    const task3 = localStorage.getItem('task3Completed') === 'true';

    setTask1Completed(task1);
    //setTask2Completed(task2);
    setTask3Completed(task3);

    let completedCount = 0;
    if (task1) completedCount++;
    //if (task2) completedCount++;
    if (task3) completedCount++;
    setTasksCompleted(completedCount);

    // Automatically expand the appropriate task based on completion status
    if (task1 && !task2) {
      setSelectedTask(2);
    } else if (task1 && task2 && !task3) {
      setSelectedTask(3);
    } else {
      setSelectedTask(1);
    }
  }, []);

  const handleTaskCompletion = (taskNumber) => {
    if (taskNumber === 1 && !task1Completed) {
      setTasksCompleted(tasksCompleted + 1);
      setTask1Completed(true);
      localStorage.setItem('task1Completed', 'true');
      setSelectedTask(2); // Automatically open Task 2
    } else if (taskNumber === 2 && !task2Completed) {
      setTasksCompleted(tasksCompleted + 1);
      setTask2Completed(true);
      localStorage.setItem('task2Completed', 'true');
      setSelectedTask(3); // Automatically open Task 3
    } else if (taskNumber === 3 && !task3Completed) {
      setTasksCompleted(tasksCompleted + 1);
      setTask3Completed(true);
      localStorage.setItem('task3Completed', 'true');
      
    }
  };

  const handleNavigateToBrandSetup = () => {
    setTimeout(() => {
      navigate('/brandsetup', { state: { taskNumber: 1 } });
    }, 100); // Adding a slight delay for smoother transition
  };

  const handleSocialMediaConnect = () => {
    setTimeout(() => {
      navigate('/socialmedia', { state: { taskNumber: 2 } });
    }, 100); // Adding a slight delay for smoother transition
  };

  const handleCreateCampaign = () => {
    setTimeout(() => {
      localStorage.removeItem('generateAdState');
      localStorage.removeItem('selectedProduct');
      localStorage.removeItem('productID');
      navigate('/campaigns', { state: { taskNumber: 3 } });
    }, 100); // Adding a slight delay for smoother transition
  };

  const canAccessTask = (taskNumber) => {
    if (taskNumber === 1) return true;
   // if (taskNumber === 2) return task1Completed;
    //if (taskNumber === 3) return task1Completed && task2Completed;
    if (taskNumber === 3) return task1Completed;
    return false;
  };

  return (
    <div className="flex-grow overflow-y-auto hide-scrollbar" style={{ maxHeight: '80vh' }}>
      <div className="max-w-6xl mx-auto mb-2 border border-[#fcfcfc] rounded-3xl pt-8 flex flex-col items-center gap-6">
        <h1 className="text-xl lg:text-2xl font-medium mb-2 text-center pt-2">
          Welcome to Spark IQ <img src={handimg} alt="Hai" className="inline-block w-6 lg:w-8 h-6 lg:h-8" />
        </h1>
        <div className=" mb-8 w-11/12 lg:w-4/6 border border-[#FCFCFC] bg-[#FCFCFC] bg-opacity-25 rounded-3xl p-6 lg:p-10">
          <h2 className="text-lg lg:text-xl font-bold">Getting Started</h2>
          <p className="text-gray-600 mb-4">Get ready to launch your campaign with our quick checklist!</p>
          <div className="flex flex-col lg:flex-row md:flex-row items-center mb-4">
            <p className="text-sm lg:text-md font-bold mb-2 lg:mb-0 pr-2">{tasksCompleted} out of 2 tasks completed</p>
            <div className="flex-grow lg:ml-4 h-2 bg-white rounded-full w-4/6 md:w-3/6">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(tasksCompleted / 2) * 100}%` }}></div>
            </div>
          </div>
          <div className="space-y-4">
            <div
              className={`border p-3 rounded-lg cursor-pointer ${selectedTask === 1 ? 'bg-[rgba(252,252,252,0.25)] border-[#FCFCFC]' : ''}`}
              onClick={() => canAccessTask(1) && setSelectedTask(1)}
              style={{ opacity: canAccessTask(1) ? '1' : '0.5', pointerEvents: canAccessTask(1) ? 'auto' : 'none' }}
            >
              <div className="flex justify-start relative">
                <div className="absolute w-10 h-10 rounded-lg bg-[rgba(0,39,153,0.15)] flex items-center justify-center">
                  <div className="w-7 h-7 rounded-lg bg-[#082A66] flex items-center justify-center">
                    <div className={`w-4 h-4 text-white font-semibold rounded-full ${task1Completed ? 'bg-white' : 'bg-[#082A66]'} flex items-center justify-center`}>
                      {task1Completed ? (
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
                        '1'
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-grow ml-16">
                  <p className="font-bold text-[#082A66]">Brand Setup</p>
                  {selectedTask === 1 && (
                    <>
                      <p className="text-xs lg:text-sm text-gray-600">Add your brand details and get ready to launch the things</p>
                      <button
                        className="custom-button p-2 pl-6 pr-6 text-white rounded-xl shadow-xl flex justify-center lg:w-fit w-40 mt-3 text-nowrap"
                        onClick={handleNavigateToBrandSetup}
                      >
                        Setup Now
                      </button>
                      <img src={setup} alt="Brand setup" className="absolute right-2 lg:right-6 bottom-1 w-16 lg:w-24 h-20 lg:h-25 hidden lg:block md:block" />
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* <div
              className={`border p-3 rounded-lg cursor-pointer ${selectedTask === 2 ? 'bg-[rgba(252,252,252,0.25)] border-[#FCFCFC]' : ''}`}
              onClick={() => canAccessTask(2) && setSelectedTask(2)}
              style={{ opacity: canAccessTask(2) ? '1' : '0.5', pointerEvents: canAccessTask(2) ? 'auto' : 'none' }}
            >
              <div className="flex justify-start relative">
                <div className="absolute w-10 h-10 rounded-lg bg-[rgba(0,39,153,0.15)] flex items-center justify-center">
                  <div className="w-7 h-7 rounded-lg bg-[#082A66] flex items-center justify-center">
                    <div className={`w-4 h-4 text-white font-semibold rounded-full ${task2Completed ? 'bg-white' : 'bg-[#082A66]'} flex items-center justify-center`}>
                      {task2Completed ? (
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
                        '2'
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-grow ml-16">
                  <p className="font-bold text-[#082A66]">Connect Your Ad Accounts</p>
                  {selectedTask === 2 && (
                    <>
                      <p className="text-xs lg:text-sm text-gray-600">Integrate your Google or Meta accounts to boost your campaigns</p>
                      <button
                        className="custom-button p-2 pl-6 pr-6 text-white rounded-xl shadow-xl flex justify-center lg:w-fit w-40 mt-3 text-nowrap"
                        onClick={handleSocialMediaConnect}
                      >
                        Connect Now
                      </button>
                      <img src={connect} alt="Connect ad accounts" className="absolute right-2 lg:right-6 bottom-1 w-16 lg:w-24 h-20 lg:h-23 hidden lg:block md:block" />
                    </>
                  )}
                </div>
              </div>
            </div>*/}
            <div 
              className={`border p-3 rounded-lg cursor-pointer ${selectedTask === 3 ? 'bg-[rgba(252,252,252,0.25)] border-[#FCFCFC]' : ''}`}
              onClick={() => canAccessTask(3) && setSelectedTask(3)}
              style={{ opacity: canAccessTask(3) ? '1' : '0.5', pointerEvents: canAccessTask(3) ? 'auto' : 'none' }}
            >
              <div className="flex justify-start relative">
                <div className="absolute w-10 h-10 rounded-lg bg-[rgba(0,39,153,0.15)] flex items-center justify-center">
                  <div className="w-7 h-7 rounded-lg bg-[#082A66] flex items-center justify-center">
                    <div className={`w-4 h-4 text-white font-semibold rounded-full ${task3Completed ? 'bg-white' : 'bg-[#082A66]'} flex items-center justify-center`}>
                      {task3Completed ? (
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
                        '3'
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-grow ml-16">
                  <p className="font-bold text-[#082A66]">Generate Your First Creative</p>
                  {selectedTask === 3 && (
                    <>
                    {/*Create a campaign to start reaching your audience*/}
                      <p className="text-xs lg:text-sm text-gray-600">
                      Generate an AI creative to start reaching your audience effectively.
                      </p>
                      <button
                        className="custom-button p-2 pl-6 pr-6 text-white rounded-xl shadow-xl flex justify-center lg:w-fit w-40 mt-3 text-nowrap"
                        onClick={handleCreateCampaign}
                      >
                        Setup Now
                      </button>
                      <img src={campaign} alt="Create campaign" className="absolute right-2 lg:right-6 bottom-1 w-16 lg:w-24 h-20 lg:h-23 hidden lg:block md:block" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
