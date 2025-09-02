import { useState, useEffect } from "react";
import ListVideoCard from "../Components/ListVideoCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import NotAvailableCard from "../Utils/NotAvailable";

const Likedvideospage = () => {
    const authUser = useSelector((state) => state.auth.user);
    // const profileUsername = propUsername || authUser?.username;
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);
    const [owner, setOwner] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);



    useEffect(() => {
        const fetchUserLikedVideos = async () => {
            try {
                const { data } = await api.get(`/like/videoslikes/c/${authUser.username}`)
                setVideos(data.data.likedVideos || []);
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

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimeAgo = (updatedAt) => {
        const currentDate = new Date();
        const inputDate = new Date(updatedAt);

        // Calculate the difference in milliseconds
        const timeDifference = currentDate - inputDate;

        // Convert milliseconds to various time units
        const millisecondsInASecond = 1000;
        const millisecondsInAMinute = millisecondsInASecond * 60;
        const millisecondsInAnHour = millisecondsInAMinute * 60;
        const millisecondsInADay = millisecondsInAnHour * 24;
        const millisecondsInAMonth = millisecondsInADay * 30; // Approximate month duration
        const millisecondsInAYear = millisecondsInAMonth * 12;

        // Calculate different units
        const years = Math.floor(timeDifference / millisecondsInAYear);
        const months = Math.floor(timeDifference / millisecondsInAMonth);
        const days = Math.floor(timeDifference / millisecondsInADay);
        const weeks = Math.floor(timeDifference / (millisecondsInADay * 7));

        // Return the largest appropriate unit
        if (years >= 1) {
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
        if (months >= 1) {
            return `${months} month${months > 1 ? 's' : ''} ago`;
        }
        if (weeks >= 1) {
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        if (days >= 1) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        return 'Just now';
    };

    useEffect(() => {
        if (selectedVideo) {
            console.log("Selected video:", selectedVideo);
        }
    }, [selectedVideo]);

    const handleClickToPlay = (video) => {
        setSelectedVideo(video);
    }

    return (
        <div className="w-[60%] "
            onClick={handleClickToPlay}
        >
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
                        duration={formatDuration(like.video.duration)}
                        viewCount={like.video.viewedBy.length}
                        publishedAt={formatTimeAgo(like.video.createdAt)}
                        ownerUsername={owner?.username}
                        ownerAvatar={owner?.avatar}
                        onClick={() => handleClickToPlay(like.video)}
                        isActive={selectedVideo?._id === like.video._id}

                    />
                ))
            )}

        </div>
    );


}

export default Likedvideospage