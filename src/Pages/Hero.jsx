import { useState } from 'react';
import Sidebar from '../Components/leftSidebar.jsx';
import MainContent from '../Components/MainContent.jsx';

const Hero = () => {
  const [activeSection, setActiveSection] = useState('Home'); // Could be 'Home', 'Profile', 'Settings', etc.

  return (
    <div className="h-full flex">
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
      <MainContent activeSection={activeSection} />
    </div>
  );
};

export default Hero;
