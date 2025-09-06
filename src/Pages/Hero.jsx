import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar.jsx';
import MainContent from '../Components/MainContent.jsx';

const Hero = () => {
  const [activeSection, setActiveSection] = useState('Home'); // Could be 'Home', 'Profile', 'Settings', etc.

  return (
    <div className="h-full flex">
      <Sidebar/>
       <main className="flex-1 bg-black-900 text-white p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Hero;
