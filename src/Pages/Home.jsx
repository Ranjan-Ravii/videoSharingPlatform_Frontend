import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos } from '../Features/AllVideos.slice.jsx';
import api from '../Services/api.js';
import FormatFetchedDate from '../Utils/FormatFetchedDate.jsx';
// import { testViewsAPI, logVideoData } from '../Utils/testViewsAPI.js';


const VideoCard = lazy(() => import('../Components/VideoCard'));
const LeftListVideoCard = lazy(() => import('../Components/ListVideoCard.jsx'))
const VideoPlayer = lazy(() => import('../Components/VideoPlayer'));

const Home = () => {

  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.allVideos);

  const [activeVideoIndex, setActiveVideoIndex] = useState(null);
  const activeVideoRef = useRef(null);
  const [videosState, setVideosState] = useState([]);

  useEffect(() => {
    dispatch(getAllVideos());
  }, [dispatch]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      setVideosState(videos);
    }
  }, [videos]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      // console.log('Videos loaded:', videos.length);
      // console.log('First video structure:', videos[0]);
      // console.log('First video ID:', videos[0]?._id);
      // console.log("Videos details : ", videos)
    }
  }, [videos]);

  // useEffect(() => {
  //   if (activeVideoRef.current) {
  //     activeVideoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // }, [activeVideoIndex]);

  const handleCardClick = async (src, index) => {
    // console.log('Card clicked, index:', index);
    // console.log('Video object:', videos[index]);
    // console.log('Video ID:', videos[index]?._id);

    setActiveVideoIndex(index);

    try {
      await api.post("/users/history/add", { videoId: videos[index]?._id });
    } catch (error) {
      console.error("Error adding to watch history:", error);
    }

    try {
      const response = await api.post('/video/views/add', { videoId: videos[index]?._id });
      // console.log("Views updated successfully:", response.data);

      // Update the views count in real-time
      if (response.data?.data?.viewsCount !== undefined) {
        setVideosState(prevVideos => {
          const updatedVideos = [...prevVideos];
          if (updatedVideos[index]) {
            updatedVideos[index] = {
              ...updatedVideos[index],
              viewedBy: Array.from({ length: response.data.data.viewsCount }, (_, i) => ({ _id: `temp_${i}` }))
            };
          }
          return updatedVideos;
        });
      }
    } catch (error) {
      console.error("Error updating views count:", error);
    }
  };


  const handleClosePlayer = () => {
    // if (activeVideoRef.current) {
    //   activeVideoRef.current.pause();
    //   // activeVideoRef.current.removeAttribute("src");
    //   // videoRef.current.load();
    // }
    setActiveVideoIndex(null); // ✅ unmounts VideoPlayer
  };


  const activeVideo = activeVideoIndex !== null ? videos[activeVideoIndex] : null;
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 p-4 bg-red-50 rounded-lg">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => dispatch(getAllVideos())}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Initial grid view: show all videos, no player
  if (activeVideoIndex === null) {
    return (
      <div>
        <div className="w-full mx-auto bg-black ">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={<div>Loading videos...</div>}>
              {videosState.map((video, index) => (
                <div key={video._id || index} className=" transition-all duration-300 text-gray-700">
                  <VideoCard
                    title={video.title}
                    thumbnail={video.thumbnail}
                    description={video.description}
                    videoFile={video.videoFile}
                    duration={formatDuration(video.duration)}
                    viewCount={video.viewedBy.length}
                    publishedAt={FormatFetchedDate(video.createdAt)}
                    onClick={() => handleCardClick(video.videoFile, index)}
                    isActive={false}
                    ownerUsername={video.owner?.username}
                    ownerAvatar={video.owner?.avatar}
                  />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  // Player + list view (current UI)
  return (
    <div className="w-full bg-black">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Video Player */}
          <div className={`w-full md:w-2/3`}>
            <Suspense fallback={<div className="flex justify-center items-center h-96">Loading player...</div>}>
              {activeVideo && (
                <>
                  {/* {console.log('Rendering VideoPlayer with video:', activeVideo)}
                  {console.log('Video ID being passed:', activeVideo._id)} */}
                  <VideoPlayer
                    ref={activeVideoRef}
                    video={activeVideo}
                    onClose={handleClosePlayer}>
                  </VideoPlayer>
                </>
              )}
            </Suspense>
            {/* Comments Section */}
            <div />
          </div>

          {/* Right: Video List */}
          <div className="w-full md:w-1/3">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 md:block hidden">Videos</h1>
            <div className="flex md:flex-col flex-row gap-4 overflow-x-auto md:overflow-y-auto">
              <Suspense fallback={<div>Loading videos...</div>}>
                {videosState.map((video, index) => {
                  if (activeVideoIndex === index) return null;
                  return (
                    <div key={video._id || index} className="transition-all duration-300 min-w-[250px] md:min-w-0">
                      <LeftListVideoCard
                        title={video.title}
                        thumbnail={video.thumbnail}
                        description={video.description}
                        videoFile={video.videoFile}
                        duration={formatDuration(video.duration)}
                        viewCount={video.viewedBy?.length || 0}
                        publishedAt={FormatFetchedDate(video.createdAt)}
                        onClick={() => handleCardClick(index)}
                        isActive={false}
                        ownerUsername={video.owner?.username}
                        ownerAvatar={video.owner?.avatar}
                      />
                    </div>
                  );
                })}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
