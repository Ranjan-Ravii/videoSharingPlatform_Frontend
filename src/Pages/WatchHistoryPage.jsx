import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ListVideoCard from "../Components/ListVideoCard";
import api from "../Services/api";

import FormatDate from "../Utils/FormatDate";
import FormatDuration from "../Utils/FormatDuration";
import VideoPlayerLayout from "../Components/VideoPlayerLayout";

const WatchHistoryPage = () => {
  const authUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);



  useEffect(() => {
    const fetchUserWatchedVideos = async () => {
      try {
        const { data } = await api.get(`/users/history`);
        setVideos(data.data || []);
        // console.log("Fetched history:", data.data);
      } catch (error) {
        console.log("Error while fetching watched history : ", error);
        alert("Error! You may need to Login ");
      }
    };

    if (authUser?.username) {
      fetchUserWatchedVideos();
    }
  }, [authUser]);


  return (
    <div className=" bg-black min-h-full ml-5 mb-15">
      {videos.length === 0 ? (
        <div className="w-full bg-black text-white flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <div>Loading Watch History..</div>
          </div>
        </div>
      ) : (
        videos.map((video) => (
          <ListVideoCard
            key={video._id}
            title={video.title}
            thumbnail={video.thumbnail}
            description=""
            duration={FormatDuration(video.duration)}
            viewCount={video.viewedBy.length}
            publishedAt={FormatDate(video.createdAt)}
            ownerUsername={video.owner?.username}
            ownerAvatar={video.owner?.avatar}
            onClick={() => navigate(`/video/${video?._id}`)}
          />
        ))
      )}
    </div>
  );

};

export default WatchHistoryPage;
