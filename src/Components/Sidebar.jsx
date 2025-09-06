import { User, History, Heart, FolderOpen, Users, HomeIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const authUser = useSelector((state) => state.auth.user);

  const menuItems = [
    { label: "Home", path: () => "/", icon: <HomeIcon size={20} /> },
    { label: "Profile", path: (username) => `/profile/${username}`, icon: <User size={20} /> },
    { label: "Playlist", path: () => "/playlist", icon: <FolderOpen size={20} /> },
    { label: "Watch History", path: () => "/watch/history", icon: <History size={20} /> },
    { label: "Liked Video", path: () => "/like/videos", icon: <Heart size={20} /> },
    { label: "Subscriptions", path: () => "/subscriptions", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-20 md:w-1/6 bg-black border-r border-gray-800 flex flex-col items-center py-6 overflow-y-auto">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center">
        <div className="bg-red-500 rounded-full w-12 h-12 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          YT
        </div>
        <span className="mt-2 text-xs font-semibold text-gray-300 hidden md:block">
          MyTube
        </span>
      </div>

      <ul className="flex flex-col gap-2 w-full">
        {menuItems.map((item) => {
          // if path needs username (like profile), pass it
          const path =
            item.label === "Profile" && authUser?.username
              ? item.path(authUser.username)
              : item.path();

          return (
            <li key={item.label}>
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg mx-2 ${
                    isActive
                      ? "bg-red-500/20 text-red-400 border-r-2 border-red-500 font-semibold"
                      : "hover:bg-gray-900 text-gray-300 hover:text-gray-100"
                  }`
                }
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline text-sm">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
