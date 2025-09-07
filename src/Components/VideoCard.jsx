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
      className="cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Video/Thumbnail area */}
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Duration overlay */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {duration}
          </div>
        )}

        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="flex gap-3">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          <img
            src={ownerAvatar}
            alt={ownerUsername}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0QjU1NjMiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkMxMy42NTY5IDEyIDE1IDEwLjY1NjkgMTUgOUMxNSA3LjM0MzE1IDEzLjY1NjkgNiAxMiA2QzEwLjM0MzEgNiA5IDcuMzQzMTUgOSA5QzkgMTAuNjU2OSAxMC4zNDMxIDEyIDEyIDEyWiIgZmlsbD0iI0ZGRiIvPgo8cGF0aCBkPSJNMTIgMTRDOS43OTA4NiAxNCA4IDE1Ljc5MDkgOCAxOFYyMEgxNlYxOEMxNiAxNS43OTA5IDE0LjIwOTEgMTQgMTIgMTRaIiBmaWxsPSIjRkZGIi8+Cjwvc3ZnPgo8L3N2Zz4K';
            }}
          />
        </div>

        {/* Video Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2 group-hover:text-gray-100 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mb-1 hover:text-white transition-colors">
            {ownerUsername}
          </p>
          <div className="text-gray-400 text-xs flex items-center gap-1">
            {typeof viewCount === 'number' && viewCount > 0 && (
              <>
                <span>{viewCount.toLocaleString()} views</span>
                <span>•</span>
              </>
            )}
            <span>{publishedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
