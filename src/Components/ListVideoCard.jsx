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
            className="flex items-start cursor-pointer overflow-hidden p-3 rounded-lg hover:bg-gray-900 transition-all duration-200 group"
        >
            {/* Thumbnail area */}
            <div className="w-[160px] h-[90px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-800 relative group-hover:scale-[1.02] transition-transform duration-200">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400 text-center">
                        <span className="text-xs font-medium">No Thumbnail</span>
                    </div>
                )}
                {/* Duration overlay */}
                {duration && (
                    <div className="absolute bottom-1 right-1 bg-black/80 text-gray-10 px-1.5 py-0.5 rounded text-xs font-medium">
                        {duration}
                    </div>
                )}
            </div>

            {/* Text content */}
            <div className="ml-3 flex-1 min-w-0">
                <h3 className="text-gray-100 font-semibold line-clamp-2 text-sm leading-tight mb-1 group-hover:text-white transition-colors duration-200">
                    {title}
                </h3>
                <p className="text-gray-300 text-sm font-medium mb-1">{ownerUsername}</p>
                <div className="text-gray-400 text-xs flex items-center gap-1">
                    {typeof viewCount === "number" && (
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
    );
}

export default ListVideoCard; 