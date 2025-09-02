import { useState} from 'react';
import { User, History, Heart, FolderOpen, Users, HomeIcon, List } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate()
  
  const menuItems = [
    { label: 'Home', icon: <HomeIcon size={20} /> },
    { label: 'Profile', icon: <User size={20} /> },
    { label: 'Playlist', icon: <FolderOpen size={20} /> },
    { label: 'Watch History', icon: <History size={20} /> },
    { label: 'Liked Video', icon: <Heart size={20} /> },
    { label: 'Subscriptions', icon: <Users size={20} /> },
  ];

  const authUser = useSelector((state) => state.auth.user);
  // const username = authUser.username; 
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleMenuClick = (item) => {
    setActiveSection(item.label);
  };

 
  // Set active section to Home by default when component mounts
  React.useEffect(() => {
    setActiveSection('Home');
  }, [setActiveSection]);

  return (
    <aside className="w-20 md:w-1/6 bg-black border-r border-gray-800 flex flex-col items-center py-6 overflow-y-auto">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center">
        <div className="bg-red-500 rounded-full w-12 h-12 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          YT
        </div>
        <span className="mt-2 text-xs font-semibold text-gray-300 hidden md:block">MyTube</span>
      </div>

      <ul className="flex flex-col gap-2 w-full">
        {menuItems.map((item) => (
          <li
            
            key={item.label}
            onClick={() => handleMenuClick(item)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg mx-2
              ${activeSection === item.label
                ? 'bg-red-500/20 text-red-400 border-r-2 border-red-500 font-semibold'
                : 'hover:bg-gray-900 text-gray-300 hover:text-gray-100'}`}
          >
            <span>{item.icon}</span>
            <span className="hidden md:inline text-sm">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
