import { useState, useEffect } from 'react';
import { Bell, ThumbsUp, Share2, XCircle } from 'lucide-react';
import api from '../Services/api.js';

import ListVideoCard from '../Components/ListVideoCard.jsx'
import FormatDate from '../Utils/FormatDate';
import FormatDuration from '../Utils/FormatDuration';



const VideoPlayerLayout = ({ activeVideo, listOfVideos, onBack, onSelectVideo }) => {

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewsCount, setViewsCount] = useState(activeVideo?.viewedBy?.length || 0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // ***************** post and get likes on a video ***************** 
  const handleToggleLike = async (e) => {
    if (!activeVideo?._id) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to like this video.');
      return;
    }

    try {
      const { data } = await api.post(`/like/video/likes/${activeVideo?._id}`);

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
        const { data } = await api.get(`/like/video/likes/${activeVideo?._id}`);
        setLikeCount(data?.data?.likeCount ?? 0);
        setIsLiked(data?.data?.isLiked ?? false);
      } catch (e) {
        console.error("Failed to fetch likes:", e);
        // If fetch fails, set default values
        setLikeCount(0);
        setIsLiked(false);
      }
    };
    if (activeVideo?._id) fetchLikes();

  }, [activeVideo?._id]);


  // ****************** post and get comment on a video & toggle likes on a video  ************
  const fetchComments = async () => {
    if (!activeVideo?._id) return console.log("No videoId available, skipping comment fetch");
    try {
      const { data } = await api.get(`like/comment/commentWithLikes/${activeVideo?._id}`);
      // console.log("Comments with likes:", data);

      setComments(data?.data || []);
    } catch (err) {
      console.error("Error fetching comments with likes:", err);
      setComments([]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!activeVideo?._id || !commentText.trim()) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to comment');
      return;
    }

    try {
      const response = await api.post(`/comment/video/addComment/${activeVideo?._id}`, {
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
    if (!activeVideo?._id) return console.log("No videoId available, skipping comment fetch");

    if (activeVideo?._id && activeVideo?._id.trim() !== '') {
      fetchComments();
    } else {
      console.log('videoId is empty or invalid, not fetching comments');
      alert('videoId is empty or invalid')
    }
  }, [activeVideo?._id]);

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


  // *************** Handle subscription ****************
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const handleToggleSubscription = async (e) => {
    e.preventDefault();

    if (!activeVideo?._id) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to like this video.');
      return;
    }

    try {
      const { data } = await api.post("/subscription", { channelId: activeVideo?.owner?._id || activeVideo?.owner });
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
    if (!activeVideo?._id) return;

    const fetchSubscriptionData = async () => {
      try {
        // Fetch subscriber count
        const { data: subData } = await api.get(`/subscription/getUserSubscription/${activeVideo?.owner?._id || activeVideo.owner}`);
        setSubscriberCount(
          (typeof subData?.data?.total === 'number' ? subData.data.total : subData?.data?.subscribers?.length) || 0
        );

        // Fetch current user subscription status
        const { data } = await api.get(
          `/subscription?channelId=${activeVideo?.owner?._id || activeVideo?.owner}`
        );
        setIsSubscribed(data?.data?.subscribed === true);

      } catch (error) {
        console.error("Error fetching subscription info", error.response?.data || error.message);
      }
    };

    fetchSubscriptionData();
  }, [activeVideo?._id, activeVideo?.owner?._id]);


  return (
    <div className="flex h-full w-full">
      <div className='w-[60%] '>
        <div className="w-full relative">
          <button
            className="absolut absolute -top-3 -right-3  bg-black rounded-full z-10 hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
            onClick={onBack}
          >
            <XCircle className="text-gray-300 hover:text-red-400 transition-colors" size={24} />
          </button>
          <video
            src={activeVideo.videoFile}
            controls
            autoPlay
            className="w-full ml-1 rounded-lg"
            style={{ maxHeight: '50vh' }}
          />
          <div className="pt-6">
            <h1 className="text-2xl font-bold text-gray-100 mb-4">{activeVideo.title}</h1>

            <div className="flex items-center justify-between mt-4 w-full">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <img
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
                  src={activeVideo?.owner?.avatar}
                  alt={activeVideo?.owner?.username || 'User'}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-100">{activeVideo?.owner?.username || 'Unknown User'}</span>
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
            <span className='text-gray-300 text-sm'>{viewsCount} views • {FormatDate(activeVideo.createdAt)}</span>
            <div className="text-gray-200 mt-2">{activeVideo.description}</div>
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
                              {FormatDate(c?.createdAt)}
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

      {/* Right side (30%) */}
      <div className=" w-[40%] ml-2 p-4 space-y-2 overflow-y-auto">
        {listOfVideos
          .filter((v) => v._id !== activeVideo._id)
          .map((video) => (
            <ListVideoCard
              key={video._id}
              thumbnail={video.thumbnail}
              title={video.title}
              videoFile={video.videoFile}
              duration={FormatDuration(video.duration)}
              viewCount={video.viewedBy.length}
              publishedAt={FormatDate(video.createdAt)}
              ownerAvatar={video?.owner?.avatar}
              ownerUsername={video?.owner?.username}
              onClick={() => onSelectVideo(video)}
            />
          ))}
      </div>
    </div>
  );
};

export default VideoPlayerLayout;
