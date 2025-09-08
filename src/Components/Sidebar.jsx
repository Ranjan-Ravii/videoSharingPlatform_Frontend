import { User, History, Heart, FolderOpen, Users, HomeIcon, Menu, TrendingUp, Clock, ThumbsUp, Video, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ collapsed, onToggle }) => {
  const authUser = useSelector((state) => state.auth.user);

  const mainMenuItems = [
    { label: "Home", path: () => "/", icon: <HomeIcon size={24} /> },
    { label: "Trending", path: () => "/trending", icon: <TrendingUp size={24} /> },
    { label: "Subscriptions", path: () => "/subscriptions", icon: <Users size={24} /> },
  ];

  const libraryMenuItems = [
    { label: "Library", path: () => "/library", icon: <Video size={24} /> },
    { label: "History", path: () => "/watch/history", icon: <History size={24} /> },
    { label: "Your videos", path: () => "/your-videos", icon: <Video size={24} /> },
    { label: "Watch later", path: () => "/watch-later", icon: <Clock size={24} /> },
    { label: "Liked videos", path: () => "/like/videos", icon: <ThumbsUp size={24} /> },
  ];

  const userMenuItems = [
    { label: "Profile", path: (username) => `/profile/${username}`, icon: <User size={24} /> },
    { label: "Settings", path: () => "/settings", icon: <Settings size={24} /> },
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'}  bg-gradient-to-bl from-gray-900 via-black to-gray-900 text-white flex flex-col transition-all duration-500 ease-in-out  lg:flex`}>
      {/* Header with Menu Button */}
      <div className="flex items-center justify-between p-2 sm:p-4 ">
        <button
          onClick={onToggle}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <Menu size={20} className="text-white" />
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">YT</span>
            </div> */}
            {/* <span className="text-white font-semibold text-lg">MyTube</span> */}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Main Menu */}
        <div className="px-2">
          {mainMenuItems.map((item) => {
            const path = item.path();
            return (
              <NavLink
                key={item.label}
                to={path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-2 rounded-lg mx-1 transition-all duration-200 ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Library Section */}
        {!collapsed && (
          <div className="px-2 mt-2">
            <div className="px-3 py-2">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Library</h3>
            </div>
            {libraryMenuItems.map((item) => {
              const path = item.path();
              return (
                <NavLink
                  key={item.label}
                  to={path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-3 py-2 rounded-lg mx-1  transition-all duration-200 ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* User Section */}
        {authUser && (
          <div className="px-2 mt-2">
            {!collapsed && (
              <div className="px-3 py-2">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Account</h3>
              </div>
            )}
            {userMenuItems.map((item) => {
              const path = item.label === "Profile" && authUser?.username
                ? item.path(authUser.username)
                : item.path();
              return (
                <NavLink
                  key={item.label}
                  to={path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-3 py-2 rounded-lg mx-1 transition-all duration-200 ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
