import { useEffect, useState } from "react";
import { logout } from "../Features/Authentication.slice.jsx"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Search, Mic, Video, Bell, User, Menu, Upload } from "lucide-react";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const username = useSelector((state) => state.auth.user?.username);
  const userAvatar = useSelector((state) => state.auth.user?.avatar);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  const handleAuthClick = (e) => {
    if (isAuthenticated) {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        dispatch(logout())
        navigate('/')
      }
    }
    else {
      navigate('/login')
    }
  }

  const handleProfileClick = () => {
    if (isAuthenticated && username) {
      navigate(`/profile/${username}`)
    } else {
      navigate('/unauthorised')
    }
  }

  // Handle search for videos/users
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // For now, search users - can be extended to search videos
      navigate(`/profile/${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  // Handle Enter key in search input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-bl from-gray-800 via-black to-gray-900 text-white0">
      <div className="flex items-center justify-between px-2 sm:px-4 h-14">
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">YT</span>
            </div>
            <span className="text-white font-semibold text-lg sm:text-xl hidden xs:block">MyTube</span>
          </Link>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-8 ">
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-3 sm:px-4 py-2 bg-black border border-gray-700 rounded-l-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-3  sm:px-6 py-2 bg-gray-800 border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-700 transition-colors"
            >
              <Search size={18} className="text-white sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Upload Button - Hidden on very small screens */}
          <Link
            to="/upload"
            className="p-2 rounded-full hover:bg-gray-800 transition-colors hidden sm:block"
            title="Upload"
          >
            <Upload size={20} className="text-white" />
          </Link>

          {/* Notifications - Hidden on very small screens */}
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors hidden sm:block"
            title="Notifications"
          >
            <Bell size={20} className="text-white" />
          </button>

          <button className="flex items-center gap-2" onClick={() => { handleAuthClick() }}>
            log out
          </button>

          {/* User Profile or Sign In */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={username}
                  className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-gray-600 transition-all"
                  onClick={handleProfileClick}
                />
              ) : (
                <button
                  onClick={handleProfileClick}
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <User size={16} className="text-white" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <User size={16} />
              <span className="hidden xs:block">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;


