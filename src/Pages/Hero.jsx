import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar.jsx';

const Hero = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden -ml-5">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Hero;
