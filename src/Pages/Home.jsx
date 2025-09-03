import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from '../Features/AllVideos.slice.jsx'

import VideoCard from "../Components/VideoCard.jsx";
import FormatDate from "../Utils/FormatDate.jsx";
import FormatDuration from "../Utils/FormatDuration.jsx";
import VideoPlayerLayout from "../Components/VideoPlayerLayout.jsx";

const Home = () => {

  const dispatch = useDispatch()
  const { videos, loading, error } = useSelector((state) => state.allVideos);
  const [activeVideo, setActiveVideo] = useState(null);


  useEffect(() => {
    dispatch(getAllVideos())
  }, [dispatch])


  return (
    <div>
      {/* if no active videos then show the grid of videos */}
      {!activeVideo ? (  
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-6">
          {videos.map((video) => (
            <VideoCard
              key={video?._id}
              thumbnail={video.thumbnail}
              title={video.title}
              description={video.description}
              videoFile={video.videoFile}
              viewCount={video?.viewedBy.length}
              duration={FormatDuration(video.duration)}
              publishedAt={FormatDate(video.createdAt)}
              ownerUsername={video?.owner?.Username}
              ownerAvatar={video?.owner?.avatar}
              onClick={() => {
                // console.log("video clicked", video?._id);
                setActiveVideo(video);
              }}
            />
          ))}
        </div>
      ) : (
        // player + list of videos at the right. 
        <VideoPlayerLayout
          activeVideo={activeVideo}
          listOfVideos={videos}
          onSelectVideo={(video) => setActiveVideo(video)}
          onBack={() => setActiveVideo(null)}
        />
      )}
    </div>
  )
}

export default Home; 