import { useEffect, useState } from "react";
import { logout } from "../Features/Authentication.slice.jsx"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const Navbar = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const username = useSelector((state) => state.auth.user?.username);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State for search input
    const [searchUsername, setSearchUsername] = useState("");

    const handleAuthClick = (e) => {
        if (isAuthenticated) {
            const confirmed = window.confirm("Are you sure you want to log out?");
            if(confirmed){
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

    // Handle search for username
    const handleSearch = () => {
        if (searchUsername.trim()) {
            navigate(`/profile/${searchUsername.trim()}`);
            setSearchUsername("");
        }
    };

    // Handle Enter key in search input
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            {/* parent div/ container */}
            <div className="flex justify-between items-end px-8  py-2 bg-black  shadow-lg">
                <Link to="/" className="text-gray-100 text-2xl font-black tracking-tight hover:text-red-500 transition-colors duration-200">
                    MyTube
                </Link>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search users..."
                        className="px-4 py-1 w-80 text-gray-100 bg-gray-900 rounded-lg placeholder-gray-400 transition-all duration-200"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <button onClick={handleSearch}
                        className="bg-red-500 text-white font-semibold px-6 py-1 rounded-lg  hover:bg-red-600 transition-colors duration-200 ">
                        Search
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <div
                        onClick={isAuthenticated ? handleAuthClick : handleAuthClick}
                        className="bg-gray-800 text-gray-100 font-semibold px-4 py-1 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700 hover:border-gray-600"
                    >
                        <button>
                            {isAuthenticated ? 'Logout' : 'Sign in'}
                        </button>
                    </div>
                    <Link to="/upload" className="bg-gray-800 text-gray-100 font-semibold px-4 py-1 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700 hover:border-gray-600">Upload</Link>
                    {/* <button onClick={handleProfileClick} className="bg-gray-800 text-gray-100 font-semibold px-4 py-1 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-700 hover:border-gray-600">Profile</button> */}
                </div>
            </div>
        </>
    );
}

export default Navbar;


