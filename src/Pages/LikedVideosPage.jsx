import { useState, useEffect } from "react";
import ListVideoCard from "../Components/ListVideoCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

import FormatDate from "../Utils/FormatDate";
import FormatDuration from "../Utils/FormatDuration";
import VideoPlayerLayout from "../Components/VideoPlayerLayout";

const Likedvideospage = () => {
  const authUser = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [owner, setOwner] = useState(null);
  // console.log(videos);


  useEffect(() => {
    const fetchUserLikedVideos = async () => {
      try {
        const { data } = await api.get(`/like/videoslikes/c/${authUser.username}`)
        setVideos(data?.data?.likedVideos || []);
        setOwner(data.data.user || null);
        // console.log(data.data.likedVideos);
      } catch (error) {
        console.log("Error while fetching liked video : ", error);
        alert("Error! You may need to Login ")
      }
    }

    if (authUser?.username) {
      fetchUserLikedVideos();
    }
  }, [authUser])

  console.log(videos);
  
 


  return (
    <div className="min-h-full ml-5 mb-15 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="w-[60%] ">
        {videos.length === 0 ? (
          <div className="w-full bg-black text-white flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <div>Loading Liked videos...</div>
            </div>
          </div>

        ) : (
          videos.map(like => (
            <ListVideoCard
              key={like._id}
              title={like.video.title}
              thumbnail={like.video.thumbnail}
              description=""
              duration={FormatDuration(like.video.duration)}
              viewCount={like.video.viewedBy.length}
              publishedAt={FormatDate(like.createdAt)}
              ownerUsername={owner?.username}
              ownerAvatar={owner?.avatar}
              onClick={() => navigate(`/like/video/${like?.video?._id}`)}
              // isActive={activeVideo?._id === like.video?._id}
            />
          ))
        )}

      </div>
    </div>
  );


}

export default Likedvideospage