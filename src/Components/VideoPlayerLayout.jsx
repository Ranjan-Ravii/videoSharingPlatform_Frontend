import { useState, useEffect } from 'react';
import { Bell, ThumbsUp, Share2, XCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ListVideoCard from '../Components/ListVideoCard.jsx';
import { getAllVideos } from '../Features/AllVideos.slice.jsx';
import FormatDate from '../Utils/FormatDate';
import FormatDuration from '../Utils/FormatDuration';
import api from '../Services/api.js';

const VideoPlayerLayout = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allVideos = useSelector((state) => state.allVideos.videos);

  const [activeVideo, setActiveVideo] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Fetch all videos if Redux is empty
  useEffect(() => {
    if (!allVideos || allVideos.length === 0) {
      dispatch(getAllVideos());
    }
  }, [allVideos, dispatch]);

  // Set active video from URL
  useEffect(() => {
    if (allVideos && allVideos.length > 0 && videoId) {
      const video = allVideos.find((v) => v._id === videoId);
      setActiveVideo(video || null);
      setViewsCount(video?.viewedBy?.length || 0);
    }
  }, [allVideos, videoId]);

  // Navigate back
  const onBack = () => navigate(-1);

  // ---------- Likes ----------
  const handleToggleLike = async () => {
    if (!activeVideo?._id) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to like this video.');
      return;
    }

    try {
      const { data } = await api.post(`/like/video/likes/${activeVideo._id}`);
      setLikeCount(data?.data?.likeCount ?? 0);
      setIsLiked(prev => !prev);
    } catch (e) {
      console.error('Error toggling like:', e?.response?.data || e.message);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      if (!activeVideo?._id) return;
      try {
        const { data } = await api.get(`/like/video/likes/${activeVideo._id}`);
        setLikeCount(data?.data?.likeCount ?? 0);
        setIsLiked(data?.data?.isLiked ?? false);
      } catch (e) {
        setLikeCount(0);
        setIsLiked(false);
      }
    };
    fetchLikes();
  }, [activeVideo?._id]);

  // ---------- Comments ----------
  const fetchComments = async () => {
    if (!activeVideo?._id) return;
    try {
      const { data } = await api.get(`like/comment/commentWithLikes/${activeVideo._id}`);
      setComments(data?.data || []);
    } catch (err) {
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
      await api.post(`/comment/video/addComment/${activeVideo._id}`, {
        commentFromUser: commentText.trim(),
      });
      setCommentText('');
      fetchComments();
    } catch (e) {
      console.error('Error adding comment:', e);
    }
  };

  useEffect(() => {
    if (activeVideo?._id) fetchComments();
  }, [activeVideo?._id]);

  const handleToggleCommentLike = async (commentId) => {
    try {
      await api.post(`/like/comment/${commentId}`);
      fetchComments();
    } catch (e) {
      console.error("Error toggling comment like:", e);
    }
  };

  // ---------- Subscription ----------
  const handleToggleSubscription = async () => {
    if (!activeVideo?.owner?._id) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to subscribe.');
      return;
    }

    try {
      const { data } = await api.post("/subscription", { channelId: activeVideo.owner._id });
      setIsSubscribed(data?.data?.subscribed);
      setSubscriberCount(prev => data?.data?.subscribed ? prev + 1 : Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  useEffect(() => {
    if (!activeVideo?.owner?._id) return;

    const fetchSubscriptionData = async () => {
      try {
        const { data: subData } = await api.get(`/subscription/getUserSubscription/${activeVideo?.owner?._id || activeVideo.owner}`);
        setSubscriberCount((typeof subData?.data?.total === 'number' ? subData.data.total : subData?.data?.subscribers?.length) || 0);


        const { data } = await api.get(
          `/subscription?channelId=${activeVideo?.owner?._id || activeVideo?.owner}`
        );
        setIsSubscribed(data?.data?.subscribed === true);

      } catch (error) {
        console.error("Error fetching subscription info", error);
      }
    };

    fetchSubscriptionData();
  }, [activeVideo?.owner?._id, activeVideo?._id]);

  if (!activeVideo) return <div className="text-white p-4">Loading or Video not found...</div>;

  return (
    <div className="flex h-full w-full">
      {/* Left 60% - Video Player */}
      <div className="w-[60%]">
        <div className="w-full relative">
          <button
            className="absolute -top-3 -right-3 bg-black rounded-full z-10 hover:bg-gray-700 transition-colors border border-gray-700"
            onClick={onBack}
          >
            <XCircle className="text-gray-300 hover:text-red-400" size={24} />
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
                  src={activeVideo.owner?.avatar}
                  alt={activeVideo.owner?.username || 'User'}
                />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-100">{activeVideo.owner?.username || 'Unknown User'}</span>
                  <span className="text-sm text-gray-400">{subscriberCount}</span>
                </div>
                <button
                  className={`flex items-center justify-center gap-2 h-10 px-6 ml-4 rounded-full text-gray-100 font-medium cursor-pointer
                    ${isSubscribed ? "bg-black hover:bg-gray-800" : "bg-red-500 hover:bg-red-900"}`}
                  onClick={handleToggleSubscription}
                >
                  <Bell size={20} />
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-6">
                <div
                  onClick={handleToggleLike}
                  className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer
                    ${isLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
                >
                  {likeCount > 0 && <span className="text-lg font-medium">{likeCount}</span>}
                  <ThumbsUp size={20} />
                </div>
                <button className="flex items-center gap-2 p-3 rounded-xl text-gray-300 hover:text-gray-100">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-black rounded-lg border border-gray-800">
            <span className="text-gray-300 text-sm">{viewsCount} views • {FormatDate(activeVideo.createdAt)}</span>
            <div className="text-gray-200 mt-2">{activeVideo.description}</div>
          </div>

        </div>

        {/* Comments */}
        <form onSubmit={handleAddComment} className="mt-6 flex gap-3">
          <input
            type="text"
            className="flex-1 p-3 bg-black text-gray-100 border-b border-gray-700 rounded-lg focus:outline-none placeholder-gray-400"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium">
            Comment
          </button>
        </form>

        <div className="mt-8">
          <h3 className="font-semibold mb-4 text-gray-100 text-lg">Comments</h3>
          <div className="space-y-4">
            {comments.length > 0 ? comments.map((c) => (
              <div key={c._id} className="flex items-start justify-between pb-4 border-b border-black last:border-b-0">
                <div className="flex-1 flex items-start gap-3">
                  <img className="h-10 w-10 rounded-full object-cover border border-gray-700" src={c.owner?.avatar} alt={c.owner?.username || 'User'} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-300 font-medium">{c.owner?.username || 'Unknown User'}</p>
                      <span className="text-gray-500 text-sm">{FormatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-gray-200">{c.content || 'No content'}</p>
                  </div>
                </div>
                <button onClick={() => handleToggleCommentLike(c._id)}
                  className={`flex items-center gap-2 p-2 rounded-lg ${c.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                  {c.likeCount > 0 && <span className="text-sm">{c.likeCount}</span>}
                  <ThumbsUp size={18} />
                </button>
              </div>
            )) : <div className="text-gray-500 text-center py-8">No comments yet.</div>}
          </div>
        </div>

      </div>

      {/* Right Sidebar - 40% */}
      <div className="w-[40%] ml-2 p-4 space-y-2 overflow-y-auto">
        {allVideos.filter(v => v._id !== activeVideo._id).map(video => (
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
            onClick={() => navigate(`/video/${video._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoPlayerLayout;
