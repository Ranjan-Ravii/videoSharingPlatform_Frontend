import React, { useEffect, useState, useRef } from 'react';
import { XCircle, ThumbsUp, Share2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import api from '../Services/api';

import FormatFetchedDate from '../Utils/FormatFetchedDate';

const VideoPlayer = React.forwardRef(({ video, onClose }, videoRef) => {
  // const videoRef = useRef(null);
  const navigate = useNavigate()

  if (!video) {
    console.log('VideoPlayer: No video provided');
    return null;
  }

  if (!video._id) {
    console.error('VideoPlayer: Video object missing _id property:', video);
    return null;
  }

  const {
    videoFile = '',
    title = 'Untitled Video',
    description = 'No description available.',
    viewCount = '0',
    publishedAt = 'Unknown date',
    _id: videoId = '',
  } = video;

  // console.log('VideoPlayer received video:', video);
  // console.log('VideoId extracted:', videoId);
  // console.log('Video object keys:', Object.keys(video));
  // console.log("viewsCount ", video?.viewedBy?.length);

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewsCount, setViewsCount] = useState(video?.viewedBy?.length || 0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);



  // ***************** post and get likes on a video ***************** 
  const handleToggleLike = async (e) => {
    e.preventDefault();

    if (!videoId) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to like this video.');
      return;
    }

    try {
      const { data } = await api.post(`/like/video/likes/${videoId}`);

      // Update like count and toggle liked state
      setLikeCount(data?.data?.likeCount ?? 0);
      setIsLiked(prev => !prev); // Toggle the liked state

      // console.log("Updated like count:", data?.data?.likeCount);
      // console.log("Response message:", data?.message);

    } catch (e) {
      console.error('Error toggling like:', e?.response?.data || e.message);
      if (e?.response?.status === 401) {
        alert('Please login to like this video.');
      } else {
        alert('Failed to toggle like. Please try again.');
      }
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data } = await api.get(`/like/video/likes/${videoId}`);
        setLikeCount(data?.data?.likeCount ?? 0);
        setIsLiked(data?.data?.isLiked ?? false);
      } catch (e) {
        console.error("Failed to fetch likes:", e);
        // If fetch fails, set default values
        setLikeCount(0);
        setIsLiked(false);
      }
    };
    if (videoId) fetchLikes();

  }, [videoId]);


  // ****************** post and get comment on a video & toggle likes on a video  ************
  const fetchComments = async () => {
    if (!videoId) return console.log("No videoId available, skipping comment fetch");
    try {
      const { data } = await api.get(`like/comment/commentWithLikes/${videoId}`);
      // console.log("Comments with likes:", data);

      setComments(data?.data || []);
    } catch (err) {
      console.error("Error fetching comments with likes:", err);
      setComments([]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!videoId || !commentText.trim()) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to comment');
      return;
    }

    try {
      const response = await api.post(`/comment/video/addComment/${videoId}`, {
        commentFromUser: commentText.trim(),
      });
      // console.log('Comment added response:', response.data); // Debuging 

      setCommentText('');

      // Refetch comments to show the new comment
      await fetchComments();
    } catch (e) {
      console.error('Error adding comment:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      if (e.response?.status === 401) {
        alert('Please login to comment');
      } else {
        alert('Error adding comment. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (!videoId) return console.log("No videoId available, skipping comment fetch");

    if (videoId && videoId.trim() !== '') {
      fetchComments();
    } else {
      console.log('videoId is empty or invalid, not fetching comments');
      alert('videoId is empty or invalid')
    }
  }, [videoId]);

  const handleToggleCommentLike = async (commentId) => {
    try {
      const { data } = await api.post(`/like/comment/${commentId}`);
      console.log("Comment like toggled:", data);

      // Refresh comments to get updated like counts
      await fetchComments();
    } catch (e) {
      console.error("Error toggling comment like:", e);
    }
  };

  // ************* Handling views on Videos & periodically fetch views count ************************
  const fetchViewsCount = async () => {
    try {
      const response = await api.get(`/video/Views/${video?._id}`);
      if (response.data?.data?.viewsCount !== undefined) {
        setViewsCount(response.data.data.viewsCount);
      }
    } catch (error) {
      console.error("Error Fetching views count", error);
    }
  }

  useEffect(() => {
    if (video?.viewedBy?.length !== undefined) {
      setViewsCount(video.viewedBy.length);
    }
  }, [video]);

  useEffect(() => {
    if (!videoId) return;

    const interval = setInterval(() => {
      fetchViewsCount();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [videoId]);


  // *************** Handle subscription ****************
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  // console.log(isSubscribed);

  const handleToggleSubscription = async (e) => {
    e.preventDefault();

    if (!videoId) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to like this video.');
      return;
    }

    try {
      const { data } = await api.post("/subscription", { channelId: video?.owner?._id || video?.owner });
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

  useEffect(() => {
    if (!videoId) return;

    const fetchSubscriptionData = async () => {
      try {
        // Fetch subscriber count
        const { data: subData } = await api.get(`/subscription/getUserSubscription/${video?.owner?._id}`);
        setSubscriberCount(
          (typeof subData?.data?.total === 'number' ? subData.data.total : subData?.data?.subscribers?.length) || 0
        );

        // Fetch current user subscription status
        const { data } = await api.get(
          `/subscription?channelId=${video?.owner?._id || video?.owner}`
        );
        setIsSubscribed(data?.data?.subscribed === true);

      } catch (error) {
        console.error("Error fetching subscription info", error.response?.data || error.message);
      }
    };

    fetchSubscriptionData();
  }, [videoId, video?.owner?._id]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
    };
  }, [videoRef]);


return (
  <div className="bg-black p-6 rounded-xl shadow-2xl border border-gray-950">
    <div className="relative">
      <button
        onClick={() => onClose()}
        className="absolute -top-3 -right-3 bg-black rounded-full z-10 hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
      >
        <XCircle className="text-gray-300 hover:text-red-400 transition-colors" size={24} />
      </button>

      <video
        key={videoId}
        ref={videoRef}
        src={videoFile}
        controls
        autoPlay
        // playsInline // *** CHANGE: iOS inline playback, fewer background surprises
        // preload="metadata" // *** CHANGE: be conservative
        className="w-full rounded-lg"
        style={{ maxHeight: '50vh' }}
      >
        Your browser does not support the video tag.
      </video>

      <div className="pt-6">
        <h1 className="text-2xl font-bold text-gray-100 mb-4">{title}</h1>

        <div className="flex items-center justify-between mt-4 w-full">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
              src={video?.owner?.avatar}
              alt={video?.owner?.username || 'User'}
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-100">{video?.owner?.username || 'Unknown User'}</span>
              <span className="text-sm text-gray-400">{subscriberCount}</span>
            </div>
            <button
              className={`flex items-center justify-center gap-2 h-10 px-6 ml-4 rounded-full text-gray-100 transition-colors duration-200 font-medium cursor-pointer
                  ${isSubscribed ? "bg-black hover:bg-gray-800" : "bg-red-500 hover:bg-red-900"}
                  `}
              onClick={handleToggleSubscription}
            >
              <Bell size={20} />
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div onClick={handleToggleLike}
              className={`flex items-center gap-2 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 cursor-pointer ${isLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
              <button className='text-lg font-medium'>
                {likeCount > 0 ? `${likeCount}` : ''}
              </button>
              <ThumbsUp size={20} />
            </div>
            <button className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-gray-100">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className='mt-6 p-4 bg-black rounded-lg border border-gray-800'>
        <span className='text-gray-300 text-sm'>{viewsCount} views • {FormatFetchedDate(video.createdAt)}</span>
        <div className="text-gray-200 mt-2">{description}</div>
      </div>
    </div>

    <form onSubmit={handleAddComment} className="mt-6 flex gap-3">
      <input
        type="text"
        className="flex-1 p-3 bg-black text-gray-100 border-b border-gray-700 rounded-lg focus:outline-none  duration-200 placeholder-gray-400"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button type="submit" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium ">
        Comment
      </button>
    </form>

    <div className="mt-8">
      <h3 className="font-semibold mb-4 text-gray-100 text-lg">Comments</h3>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c?._id} className="flex items-start justify-between pb-4 border-b border-black last:border-b-0">
            <div className="flex-1">
              <div className='flex items-start gap-3'>
                <img
                  className='h-10 w-10 rounded-full object-cover border border-gray-700'
                  src={c?.owner?.avatar}
                  alt={c?.owner?.username || 'User'}
                />
                <div className="flex-1">
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='text-gray-300 font-medium'>{c?.owner?.username || 'Unknown User'}</p>
                    <span className='text-gray-500 text-sm'>
                      {FormatFetchedDate(c?.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-200"> {c?.content || 'No content'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleToggleCommentLike(c?._id)}
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 ${c?.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              {c?.likeCount > 0 && <span className="text-sm">{c?.likeCount}</span>}
              <ThumbsUp size={18} />
            </button>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  </div>
);
})

export default VideoPlayer;
