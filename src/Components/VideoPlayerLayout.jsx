import { useState, useEffect } from 'react';
import { Bell, ThumbsUp, Share2, XCircle, MenuIcon, EllipsisVertical, Trash, PenIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ListVideoCard from '../Components/ListVideoCard.jsx';
import { getAllVideos } from '../Features/AllVideos.slice.jsx';
import FormatDate from '../Utils/FormatDate';
import FormatDuration from '../Utils/FormatDuration';
import api from '../Services/api.js';

import { confirmAction } from '../Utils/ConfirmAction.js';

const VideoPlayerLayout = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user)
  // console.log("auth user id ", authUser?._id);


  const allVideos = useSelector((state) => state.allVideos.videos);

  const [activeVideo, setActiveVideo] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // console.log(comments[3]);

  const [commentOption, setCommentOption] = useState(false);

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
      // console.log(video);  

    }
  }, [allVideos, videoId]);

  // Navigate back
  const onBack = () => navigate(-1);

  //---------- Views ----------

  useEffect(() => {
    const updateViews = async () => {
      if (!activeVideo?._id) return;

      const token = localStorage.getItem('accessToken');

      try {
        const { data } = await api.post(
          'video/views/add', { videoId: activeVideo?._id });

        // console.log(data?.viewedBy);
        setViewsCount(data?.viewedBy.length);
      } catch (e) {
        console.error('Error updating views:', e?.response?.data || e.message);
      }
    };

    updateViews();
  }, [activeVideo?._id]);



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

  const toggleCommentOption = (id) => {
    if (commentOption === id) {
      setCommentOption(null); // close if already open
    } else {
      setCommentOption(id);   // open

      // auto close after 5 seconds
      setTimeout(() => {
        setCommentOption(null);
      }, 5000);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = await confirmAction("Confirm Deletion.");
    if (!confirmed) return;
    try {
      await api.delete(`comment/delete/${commentId}`);

      fetchComments();
    } catch (e) {
      console.error("Error deleting comment:", e);
    }
  }



  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [Isedited, setIsEdited] = useState();

  const handleUpdateComment = async (commentId) => {
    const confirmed = await confirmAction("Confirm Update?");
    if (!confirmed) return;

    try {
      await api.put(`/comment/update/${commentId}`, {
        newCommentFromUser: editingText.trim(),
      });

      setEditingCommentId(null);
      setEditingText("");
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
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
    <div className="bg-black min-h-screen ml-1 mb-10 -mt-1">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-2 sm:p-4">
        {/* Main Video Section */}
        <div className="flex-1 lg:max-w-4xl">
          {/* Video Player */}
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <video
              src={activeVideo.videoFile}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>

          {/* Video Info */}
          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white leading-tight">
              {activeVideo.title}
            </h1>

            {/* Video Stats and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {/* Left: Channel Info and Subscribe */}
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  src={activeVideo.owner?.avatar}
                  alt={activeVideo.owner?.username || 'User'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0QjU1NjMiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkMxMy42NTY5IDEyIDE1IDEwLjY1NjkgMTUgOUMxNSA3LjM0MzE1IDEzLjY1NjkgNiAxMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyWiIgZmlsbD0iI0ZGRiIvPgo8cGF0aCBkPSJNMTIgMTRDOS43OTA4NiAxNCA4IDE1Ljc5MDkgOCAxOFYyMEgxNlYxOEMxNiAxNS43OTA5IDE0LjIwOTEgMTQgMTIgMTRaIiBmaWxsPSIjRkZGIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                  }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-white text-sm sm:text-base truncate">{activeVideo.owner?.username || 'Unknown User'}</span>
                  <span className="text-xs sm:text-sm text-gray-400">{subscriberCount} subscribers</span>
                </div>
                <button
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-medium transition-colors text-sm ${isSubscribed
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  onClick={handleToggleSubscription}
                >
                  <Bell size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{isSubscribed ? "Subscribed" : "Subscribe"}</span>
                </button>
              </div>

              {/* Right: Like and Share */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full transition-colors text-sm ${isLiked
                    ? "bg-gray-800 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  <ThumbsUp size={14} className="sm:w-4 sm:h-4" />
                  <span>{likeCount}</span>
                </button>
                <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors text-sm">
                  <Share2 size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Video Description */}
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">
                {viewsCount.toLocaleString()} views • {FormatDate(activeVideo.createdAt)}
              </div>
              <div className="text-white whitespace-pre-wrap">
                {activeVideo.description}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {comments.length} Comments
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-3">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={activeVideo.owner?.avatar}
                  alt="Your avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64';
                  }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-transparent border-b border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? comments.map((c) => (
                  <div key={c._id} className="flex gap-3">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={c.owner?.avatar}
                      alt={c.owner?.username || 'User'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">
                          {c.owner?.username || 'Unknown User'}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {FormatDate(c.createdAt)}
                        </span>
                        {/* {c.updatedAt !== c.createdAt && (
                          <span className="text-gray-400 text-xs">(edited)</span>
                        )} */}
                      </div>

                      <p className="text-gray-300 text-sm mb-2">
                        {editingCommentId === c._id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm bg-gray-800 text-white rounded"
                            />
                            <button
                              onClick={() => {
                                handleUpdateComment(c._id)
                                setIsEdited(true)
                              }}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditingText("");
                              }}
                              className="px-2 py-1 bg-gray-600 text-white rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          c.content || "No content"
                        )}
                      </p>


                      <div className="flex items-end">
                        <button
                          onClick={() => handleToggleCommentLike(c._id)}
                          className={`flex gap-2 text-s transition-colors ${c.isLiked ? "text-blue-600" : "text-gray-400 hover:text-white"
                            }`}
                        >
                          <ThumbsUp size={18} />
                          {c.likeCount > 0 && <span>{c.likeCount}</span>}
                        </button>
                      </div>

                    </div>


                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleCommentOption(c._id)}
                        className="p-1 cursor-pointer"
                      >
                        <EllipsisVertical />
                      </button>

                      {commentOption === c._id && (
                        <div className={`absolute left-full top-0 ml-2 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 z-10
                         ${c?.owner?._id === authUser?._id ?
                            "" :
                            "cursor-not-allowed pointer-events-none select-none opacity-50"}`
                        }>
                          <button
                            onClick={() => {
                              setEditingCommentId(c._id);
                              setEditingText(c.content || "");
                            }}

                            className="flex gap-3 w-full text-left px-3 py-1 text-sm text-white hover:bg-gray-700 rounded">
                            Edit <PenIcon size={16} />
                          </button>
                          <button
                            onClick={() => { handleDeleteComment(c?._id) }}
                            className="flex gap-3 w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-red-500 hover:text-white rounded">
                            Delete <Trash size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-400">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
              <div className='p-2'></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Related Videos */}
        <div className="w-full lg:w-80 space-y-2">
          <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Up next</h3>
          <div className="space-y-2 max-h-96 lg:max-h-none overflow-y-auto custom-scrollbar">
            {allVideos.filter(v => v._id !== activeVideo._id).map(video => (
              <ListVideoCard
                key={video._id}
                thumbnail={video.thumbnail}
                title={video.title}
                videoFile={video.videoFile}
                duration={FormatDuration(video.duration)}
                viewCount={video.viewedBy?.length || 0}
                publishedAt={FormatDate(video.createdAt)}
                ownerAvatar={video?.owner?.avatar}
                ownerUsername={video?.owner?.username}
                onClick={() => navigate(`/watch/${video._id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerLayout;
