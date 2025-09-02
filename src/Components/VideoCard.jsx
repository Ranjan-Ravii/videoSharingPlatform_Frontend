import React from 'react';

const VideoCard = ({
  title,
  thumbnail,
  description,
  videoFile,
  onClick,
  isActive,
  duration,
  viewCount,
  publishedAt,
  ownerUsername,
  ownerAvatar
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-lg hover:bg-gray-950 transition-all duration-200 group "
    >
      {/* Video/Thumbnail area */}
      <div className="h-40 w-full flex items-center justify-center rounded-lg mb-3 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300" >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400 text-center">
            <span className="text-sm font-medium">No Thumbnail</span>
          </div>
        )}
        {/* Duration overlay */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-gray-100 text-xs px-2 py-1 rounded-md font-medium">
            {duration}
          </div>
        )}
      </div>

      <div className='flex items-start gap-2'>
        <div className="flex-shrink-0">
          <img
            src={ownerAvatar}
            alt={ownerUsername}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-700 group-hover:border-gray-600 transition-colors duration-200"
            onError={e => { e.target.onerror = null;}}
          />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className="text-gray-100 font-semibold line-clamp-2 text-sm leading-tight mb-1 group-hover:text-white transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-300 text-sm font-medium ">{ownerUsername}</p>
          <div className="text-gray-400 text-xs flex items-center gap-2">
            {typeof viewCount === 'number' && (
              <span className="flex items-center gap-1">
                <span>{viewCount.toLocaleString()}</span>
                <span>views</span>
              </span>
            )}
            <span className="text-gray-500">•</span>
            <span>{publishedAt}</span>
          </div>                      
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
