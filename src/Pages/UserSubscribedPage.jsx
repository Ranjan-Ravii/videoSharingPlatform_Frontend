import { useEffect, useState } from "react";
import api from "../Services/api";
import { useSelector } from "react-redux";
import { Bell, Binoculars, User, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";

const UserSubscribedPage = () => {

  const navigate = useNavigate()

  const authUser = useSelector((state) => state.auth.user)
  const [creatorsData, setCreatersData] = useState(null);

  const [activeUser, setActiveUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // console.log("active userdata ", activeUser);

  useEffect(() => {
    const FetchSubscription = async () => {
      try {
        const { data } = await api.get(`/subscription/getSubscribedChannel/${authUser._id}`)
        setCreatersData(data?.data || null)
      } catch (error) {
        console.log("Error while Fetching User Subscription", error);
      }
    }
    FetchSubscription()
  }, [authUser])


  // toggle subscriptions 
  const handleToggleSubscription = async (channelId) => {

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to like this video.');
      return;
    }

    try {
      const { data } = await api.post("/subscription", { channelId });
      setIsSubscribed(data?.data?.subscribed);
      if (data?.data?.subscribed) {
        setSubscriberCount((prev) => prev + 1);
      } else {
        setSubscriberCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error('Error toggling like:', error?.response?.data || error.message);
      if (error?.response?.status === 401) {
        alert('Please login to subscribe to this channel.');
      } else {
        alert('Failed to  toggle subscription. Please try again.');
      }
    }

  }



  return (
    <div className="w-full min-h-full mb-15 bg-black text-white">
      {!activeUser ? (
        <div>
          {creatorsData?.subscriptions.map((creater, index) => (
            <div
              key={index}
              className="max-w-5xl mx-auto py-2 flex items-center gap-6 border-b border-gray-800"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-28 h-28">
                <img
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                  src={creater?.channel?.avatar}
                  alt={`${creater?.channel?.fullname}'s avatar`}
                />
              </div>

              {/* User Info */}
              <div className="flex flex-col justify-start gap-2">
                {/* Name */}
                <p className="text-xl md:text-2xl font-bold text-white">
                  {creater?.channel?.fullname}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-400">
                  <span>@{creater?.channel?.username}</span>
                  <span className="flex items-center gap-2"> <User size={18} /> {creater?.subscriberCount} </span>
                  <span className="flex items-center gap-2"> <Video size={18} /> {creater?.videoCount}</span>
                </div>

                {/* Bio */}
                <p className="text-sm md:text-base text-gray-500 max-w-2xl line-clamp-2">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam
                  totam iste nesciunt itaque deleniti. Alias nesciunt libero
                  perferendis impedit similique. Corporis culpa nulla recusandae
                  praesentium cupiditate soluta commodi harum laboriosam.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col justify-center items-center gap-4">
                <button
                  onClick={() => {
                    setIsSubscribed(false);
                  }}
                  className="w-fit px-5 py-2 text-sm md:text-base bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center gap-2 cursor-pointer">
                  <Bell size={18} />
                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </button>

                <button 
                onClick={() => {
                  setActiveUser(creater?.channel);
                  navigate(`/profile/${creater?.channel?.username}`)
                }}
                className="w-fit px-5 py-2 text-sm md:text-base bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center gap-2 cursor-pointer">
                  <Binoculars size={18} />
                  <span>View Profile</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
         <div>
          <UserProfile
          activeUser={activeUser}
          isSubscribed={isSubscribed}
          subscriberCount={subscriberCount}
          onToggleSubscription={() => handleToggleSubscription(activeUser._id)}
          onBack={() => setActiveUser(null)}
        />
         </div>
      )}
    </div>
  );
};

export default UserSubscribedPage;
