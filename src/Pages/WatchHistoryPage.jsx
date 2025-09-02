import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ListVideoCard from "../Components/ListVideoCard";
import api from "../Services/api";

const WatchHistoryPage = () => {
    const authUser = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

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

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatTimeAgo = (updatedAt) => {
        const currentDate = new Date();
        const inputDate = new Date(updatedAt);
        const diff = currentDate - inputDate;

        const msInMinute = 60 * 1000;
        const msInHour = 60 * msInMinute;
        const msInDay = 24 * msInHour;
        const msInMonth = 30 * msInDay;
        const msInYear = 12 * msInMonth;

        if (diff >= msInYear) return `${Math.floor(diff / msInYear)} years ago`;
        if (diff >= msInMonth) return `${Math.floor(diff / msInMonth)} months ago`;
        if (diff >= msInDay * 7) return `${Math.floor(diff / (msInDay * 7))} weeks ago`;
        if (diff >= msInDay) return `${Math.floor(diff / msInDay)} days ago`;
        if (diff >= msInHour) return `${Math.floor(diff / msInHour)} hours ago`;
        if (diff >= msInMinute) return `${Math.floor(diff / msInMinute)} minutes ago`;
        return "Just now";
    };

    const handleClickToPlay = (video) => {
        setSelectedVideo(video);
    };

    return (
        <div className="w-[60%] ">
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
                        duration={formatDuration(video.duration)}
                        viewCount={video.viewedBy.length}
                        publishedAt={formatTimeAgo(video.createdAt)}
                        ownerUsername={video.owner?.username}
                        ownerAvatar={video.owner?.avatar}
                        onClick={() => handleClickToPlay(video)}
                        isActive={selectedVideo?._id === video._id}
                    />
                ))
            )}
        </div>
    );
};

export default WatchHistoryPage;
