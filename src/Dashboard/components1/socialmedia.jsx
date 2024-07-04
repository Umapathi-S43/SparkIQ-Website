import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import insta from '../../assets/dashboard_img/instagram.png';
import linkimg from '../../assets/dashboard_img/link2.png';
import linkimg2 from '../../assets/dashboard_img/link3.png';
import meta from '../../assets/dashboard_img/metasvg.svg';
import glogo from '../../assets/dashboard_img/glogosvg.svg';
import brandl from '../../assets/dashboard_img/brand_img.png';

const SocialMediaConnect = ({ handleTaskCompletion }) => {
  const [selectedMetaAccount, setSelectedMetaAccount] = useState(null);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState(null);
  const [metaDropdownVisible, setMetaDropdownVisible] = useState(false);
  const [googleDropdownVisible, setGoogleDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const metaAccounts = [
    { id: 1, name: 'John Smith', img: meta },
    { id: 2, name: 'Jane Doe', img: meta },
    { id: 3, name: 'Shane Warne', img: meta },
  ];

  const googleAccounts = [
    { id: 1, name: 'John Smith', img: glogo },
    { id: 2, name: 'Jane Doe', img: glogo },
    { id: 3, name: 'Shane Warne', img: glogo },
  ];

  const handleSelectMetaAccount = (account) => {
    setSelectedMetaAccount(account);
    setMetaDropdownVisible(false);
  };

  const handleSelectGoogleAccount = (account) => {
    setSelectedGoogleAccount(account);
    setGoogleDropdownVisible(false);
  };

  const handleSaveAndContinue_social = () => {
    localStorage.setItem('task2Completed', 'true');
    navigate('/homepage', { state: { task2Completed: true } });
  };

  const AccountDropdown = ({ accounts, selectedAccount, setSelectedAccount, dropdownVisible, setDropdownVisible, logo }) => (
    <div className={`relative ${selectedAccount ? 'p-2 rounded-2xl border border-[#FCFCFC] bg-[rgba(252,252,252,0.25)]' : ''}`}>
      <button
        className={`px-4 py-2 rounded-xl flex items-center ${selectedAccount ? 'bg-[#FCFCFC] text-black' : 'bg-gradient-to-r from-[#283048] to-[#859398] text-white'}`}
        onClick={() => setDropdownVisible(!dropdownVisible)}
        style={{ width: '100%' }}
      >
        {selectedAccount ? (
          <>
            <img src={selectedAccount.img} alt="Account" className="w-6 h-6 mr-2" />
            <span>{selectedAccount.name}</span>
            {dropdownVisible ? <IoIosArrowUp className="ml-2" /> : <IoIosArrowDown className="ml-2" />}
          </>
        ) : (
          <>
            <img src={logo} alt="Link" className="w-4 h-4 mr-2" />
            <span>Connect Account</span>
          </>
        )}
      </button>
      {dropdownVisible && (
        <div className="absolute bg-white shadow-md rounded-lg mt-2 w-full z-10 max-h-48 overflow-auto">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => {
                setSelectedAccount(account);
                setDropdownVisible(false);
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-200"
            >
              <img src={account.img} alt={account.name} className="w-6 h-6 mr-2" />
              <span>{account.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-grow rounded-3xl p-2 overflow-auto hide-scrollbar" style={{ maxHeight: '80vh' }}>
      <div className="w-full max-w-6xl mx-auto border border-[#fcfcfc] rounded-2xl lg:rounded-3xl flex flex-col items-center">
        <div className="w-full bg-[rgba(252,252,252,0.40)] lg:h-auto h-40px lg:rounded-t-3xl rounded-t-2xl p-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-[rgba(0,39,153,0.15)] lg:ml-4 ml-1 lg:w-12 lg:h-12 w-10 h-10 rounded-xl lg:rounded-xl flex items-center justify-center">
                <div className="bg-[#082a66] rounded-lg flex items-center justify-center lg:w-8 lg:h-8 w-6 h-6">
                  <img src={linkimg} alt="Brand Icon" className="w-4 h-4" />
                </div>
              </div>
              <h1 className="lg:text-3xl text-2xl font-bold text-[#082a66] text-nowrap lg:ml-4 ml-2">Social Media Connect</h1>
            </div>
            <img src={brandl} alt="Brand Banner" className="lg:w-[180px] lg:h-[90px] w-[120px] h-[64px] relative bottom-[-9px] mr-20 hidden lg:block md:block" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:p-6 lg:pt-0 w-full ">
          <div className="flex lg:justify-center items-center justify-around mb-4 lg:mb-0 lg:mr-8 m-auto lg:pt-0 lg:w-96 lg:h-96 w-72 h-72 bg-gradient-to-b from-[#00A0F5] to-[#0085CC] rounded-2xl">
            <img src={insta} alt="Instagram" className="flex items-center justify-center w-56 h-56 rounded-lg object-cover" />
          </div>
          <div className="flex-grow m-2">
            <div className="border border-[#fcfcfc] bg-[rgba(252,252,252,0.25)] rounded-3xl shadow-inner mb-2">
              <div className="flex items-center justify-between bg-[#F6F8FE] p-4 mb-4 rounded-t-3xl">
                <div className="flex items-center">
                  <div className="bg-[rgba(0,39,153,0.15)] w-10 h-10 rounded-full flex items-center justify-center">
                    <img src={linkimg2} alt="Link" className="w-4 h-4" />
                  </div>
                  <h2 className=" flex-row text-lg font-bold text-blue-900 ml-4">Connect Your Ad Accounts</h2>
                </div>
              </div>
              <div className="flex flex-col space-y-4 p-4">
                <div className="p-4 rounded-lg shadow-md bg-[rgba(252,252,252,0.35)] lg:h-24 h-auto flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="bg-[rgba(0,39,153,0.15)] w-9 h-9 rounded-md flex items-center justify-center">
                      <div className="bg-[#082a66] rounded-md p-1 flex items-center justify-center w-6 h-6">
                        <img src={meta} alt="Meta" className="w-4 h-3" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-blue-900">Meta Ad Account</h3>
                      <p className="text-gray-600">Connect and link your ad accounts</p>
                    </div>
                  </div>
                  <div className="flex justify-center w-full sm:w-auto"> {/* Updated line */}
                    <AccountDropdown
                      accounts={metaAccounts}
                      selectedAccount={selectedMetaAccount}
                      setSelectedAccount={setSelectedMetaAccount}
                      dropdownVisible={metaDropdownVisible}
                      setDropdownVisible={setMetaDropdownVisible}
                      logo={linkimg}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg shadow-md bg-[rgba(252,252,252,0.35)] lg:h-24 h-auto flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="bg-[rgba(0,39,153,0.15)] w-9 h-9 rounded-md flex items-center justify-center">
                      <div className="bg-[#082a66] rounded-md p-1 flex items-center justify-center w-6 h-6">
                        <img src={glogo} alt="Google" className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-blue-900">Google Ad Account</h3>
                      <p className="text-gray-600">Connect and link your ad accounts</p>
                    </div>
                  </div>
                  <div className="flex justify-center w-full sm:w-auto"> {/* Updated line */}
                    <AccountDropdown
                      accounts={googleAccounts}
                      selectedAccount={selectedGoogleAccount}
                      setSelectedAccount={setSelectedGoogleAccount}
                      dropdownVisible={googleDropdownVisible}
                      setDropdownVisible={setGoogleDropdownVisible}
                      logo={linkimg}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="custom-button p-2 lg:pl-6 lg:pr-6 m-4 lg:mb-0 text-white rounded-xl shadow-inner flex justify-center w-fit mt-1" onClick={handleSaveAndContinue_social}>
                Save and Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaConnect;
