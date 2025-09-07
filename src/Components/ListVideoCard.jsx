import React from 'react'

const ListVideoCard = ({
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
            className="flex gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-800 transition-all duration-200 group"
        >
            {/* Thumbnail area */}
            <div className="w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800 relative group-hover:scale-[1.02] transition-transform duration-200">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                {/* Duration overlay */}
                {duration && (
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                        {duration}
                    </div>
                )}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium line-clamp-2 text-sm leading-tight mb-1 group-hover:text-gray-100 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm mb-1 hover:text-white transition-colors">
                    {ownerUsername}
                </p>
                <div className="text-gray-400 text-xs flex items-center gap-1">
                    {typeof viewCount === "number" && viewCount > 0 && (
                        <>
                            <span>{viewCount.toLocaleString()} views</span>
                            <span>•</span>
                        </>
                    )}
                    <span>{publishedAt}</span>
                </div>
            </div>
        </div>
    );
}

export default ListVideoCard; 