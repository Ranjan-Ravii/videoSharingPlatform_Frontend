import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import VideoCard from '../Components/VideoCard';
import api from '../Services/api';
import FormatDate from '../Utils/FormatDate';
import FormatDuration from '../Utils/FormatDuration';
import VideoPlayerLayout from '../Components/VideoPlayerLayout';

const UserProfile = () => {

  const { username } = useParams();
  const navigate = useNavigate();

  const [channelProfile, setChannelProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [userSubscriberCount, setUserSubscriberCount] = useState(0);

  // console.log("channelProfile : ", channelProfile);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // fetch subscriber count of a user. 
  useEffect(() => {
    if (!channelProfile?._id) return;

    const fetchSubscriptionData = async () => {
      try {
        const { data: subData } = await api.get(`/subscription/getUserSubscription/${channelProfile?._id}`);
        setUserSubscriberCount(
          (typeof subData?.data?.total === 'number' ? subData.data.total : subData?.data?.subscribers?.length) || 0
        );
      } catch (error) {
        console.error("Error fetching subscription info", error.response?.data || error.message);
      }
    };

    fetchSubscriptionData();
  }, [channelProfile?._id]);


  useEffect(() => {
    const fetchUserVideo = async () => {
      if (!username) return;

      try {
        const { data } = await api.get(`/video/uservideos/c/${username}`);
        // console.log("User Videos API Response:", data);
        setVideos(data?.data?.userVideos || []);
      } catch (error) {
        console.log("Error while fetching videos: ", error);
        // alert("Error while fetching videos.");
      }
    };

    fetchUserVideo();
  }, [username]);

  // ✅ Fetch channel profile/ user infromations 
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const { data } = await api.get(`/users/c/${username}`);
        // console.log("Channel Profile API Response:", data);

        //  handle both array/object responses
        setChannelProfile(Array.isArray(data?.data) ? data.data[0] : data?.data || null);
      } catch (error) {
        console.log("Error while fetching channel profile: ", error);
        setChannelProfile(null);
      }
    };

    if (username) fetchChannel();
  }, [username]);

  // Handle loading state
  if (!username) {
    return (
      <div className="w-full bg-black text-white flex items-center justify-center">
        <div>Please log in to view your profile</div>
      </div>
    );
  }

  if (!channelProfile) {
    return (
      <div className="w-full bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <div>Loading user profile...</div>
        </div>
      </div>
    );
  }

  const videoCount = videos.length;


  return (
    <div>
      <div className="w-full min-h-screen bg-black text-white">

        <div className="relative h-44 w-full bg-gray-800 rounded-2xl overflow-hidden ">
          <button
            className="absolut absolute -right-0  bg-black rounded-full z-10 hover:bg-gray-700 transition-colors duration-200 border border-gray-700 cursor-pointer"
            onClick={() => { nevigate(-1) }}
          >
            <XCircle className="text-gray-300 hover:text-red-400 transition-colors" size={24} />
          </button>
          {channelProfile?.coverImage || authCoverImage ? (
            <img
              src={channelProfile?.coverImage || authCoverImage}
              alt="Cover"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-700" />
          )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row md:items-center px-8 pt-4 gap-8">
          <div className=''>
            {channelProfile?.avatar || authAvatar ? (
              <img
                src={channelProfile?.avatar || authAvatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-black shadow-xl object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-black shadow-xl bg-gray-700 flex items-center justify-center text-2xl font-bold">
                {(channelProfile?.fullName ||
                  channelProfile?.username ||
                  username ||
                  'U')
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>
          <div className=''>
            <h1 className="text-3xl font-bold">
              {channelProfile?.fullName || username || 'Unknown User'}
            </h1>
            <div className="text-gray-400">
              @{channelProfile?.username || 'unknown'}
            </div>
            <p>About the channel goes here, that i need to add here and update database as well.</p>
            <div className="text-sm text-gray-400 mt-1">
              {userSubscriberCount} subscriber{userSubscriberCount !== 1 ? 's' : ''} • {videoCount} videos
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-800 px-8">
          <nav className="flex gap-8 text-zinc-400">
            <button className="py-3 border-b-2  text-white">Home</button>
            <button className="py-3 hover:text-white">Shorts</button>
            <button className="py-3 hover:text-white">Live</button>
            <button className="py-3 hover:text-white">Playlists</button>
            <button className="py-3 hover:text-white">Posts</button>
          </nav>
        </div>

        {/* Videos Section */}
        <div className="px-2">
          <div className="w-full mx-auto p-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {videos.map((video, index) => (
                <div key={video._id || index} className="transition-all duration-300 text-gray-700 bg-gray-950 rounded-3xl">
                  <VideoCard
                    title={video.title}
                    thumbnail={video.thumbnail}
                    description={video.description}
                    videoFile={video.videoFile}
                    duration={FormatDuration(video.duration)}
                    viewCount={video.viewedBy.length}
                    publishedAt={FormatDate(video.updatedAt)}
                    onClick={() => navigate(`/watch/${video?._id}`)}
                    isActive={false}
                    // ⬇️ FIX: Use video.owner avatar if available, else fallback
                    ownerAvatar={video.owner?.avatar || channelProfile?.avatar || authAvatar}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
