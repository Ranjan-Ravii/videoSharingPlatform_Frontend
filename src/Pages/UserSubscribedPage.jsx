import { useState } from "react";

const UserSubscribedPage = () => {


    const FetchSubscription = () => {
        
    }



    return (
        <div className="w-full min-h-screen bg-black">
            <div className="max-w-5xl mx-auto px-4  flex items-center gap-6">
                <div className="flex-shrink-0 w-28 h-28">
                    <img
                        className="w-full h-full rounded-full object-cover border-4 border-white "
                        src="https://cdn.pixabay.com/photo/2022/09/01/22/42/woman-7426320_1280.png"
                        alt="User profile"
                    />
                </div>

                {/* User Info */}
                <div className="flex flex-col justify-start gap-2">
                    <p className="text-3xl font-bold">Full Name</p>
                    <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                        <span>@username</span>
                        <span>• 1.2k Subscribers</span>
                        <span>• 35 Videos</span>
                    </div>
                    <p className="text-gray-700 max-w-2xl line-clamp-2">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam
                        totam iste nesciunt itaque deleniti. Alias nesciunt libero
                        perferendis impedit similique. Corporis culpa nulla recusandae
                        praesentium cupiditate soluta commodi harum laboriosam.
                    </p>

                    <div className=" flex justify-start gap-8">
                        <button className="mt-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-fit">
                            Subscribed
                        </button>
                        <button className="mt-4 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-fit">
                            Explore
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserSubscribedPage;
