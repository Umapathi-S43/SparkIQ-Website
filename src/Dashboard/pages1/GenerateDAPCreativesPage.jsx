import React,{useEffect,useState} from 'react';
import Header from '../../Dashboard/components1/header';
import Sidebar from '../../Dashboard/components1/sidebar';
import GenerateAd from '../../components/advert/GenerateAd';
import GenerateDAPCreatives from '../components1/GenerateDAPCreatives';


function GenerateDAPCreativesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setIsSidebarOpen(true);
        } else {
          setIsSidebarOpen(false);
        }
      };
  
      window.addEventListener('resize', handleResize);
      handleResize();
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B3D4E5] to-[#D9E9F2] flex items-center justify-center pl-4 pr-4 pt-0 overflow-hidden">
    <div className="border-2 border-[#FCFCFC] rounded-3xl w-full overflow-hidden" style={{ height: 'calc(100vh - 1rem)' }}>
      <div className="flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`flex-grow transition-transform duration-300 overflow-auto ${isSidebarOpen ? '-ml-6' : 'ml-0'}`} style={{maxHeight:'80vh'}} >
            <div className='m-2 mt-0 ml-0'>
              <GenerateDAPCreatives/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default GenerateDAPCreativesPage
