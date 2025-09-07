import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from '../Features/AllVideos.slice.jsx'
import { useNavigate } from "react-router-dom";

import VideoCard from "../Components/VideoCard.jsx";
import FormatDate from "../Utils/FormatDate.jsx";
import FormatDuration from "../Utils/FormatDuration.jsx";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { videos, loading, error } = useSelector((state) => state.allVideos);

  useEffect(() => {
    dispatch(getAllVideos())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-lg">Error loading videos: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-full ">
      {/* Main Content */}
      <div className="px-2 sm:px-4 py-4 sm:py-6">
        {/* Page Header */}
        {/* <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Recommended</h1>
          <p className="text-gray-400 text-sm sm:text-base">Videos we think you'll like</p>
        </div> */}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video?._id}
              thumbnail={video.thumbnail}
              title={video.title}
              description={video.description}
              videoFile={video.videoFile}
              viewCount={video?.viewedBy?.length || 0}
              duration={FormatDuration(video.duration)}
              publishedAt={FormatDate(video.createdAt)}
              ownerUsername={video?.owner?.username || video?.owner?.Username}
              ownerAvatar={video?.owner?.avatar}
              onClick={() => navigate(`/watch/${video?._id}`)}
            />
          ))}
        </div>

        {/* Load More Button */}
        {videos.length > 0 && (
          <div className="flex justify-center mt-8">
            <button className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
              
            </button>
          </div>
        )}

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
            <p className="text-gray-400 text-center max-w-md">
              Be the first to upload a video and share your content with the world!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home; 