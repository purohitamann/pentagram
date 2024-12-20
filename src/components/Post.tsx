'use client';

import React from 'react';
import { Pentagon } from 'lucide-react';

type Props = {
    id: number;
    image_url: string;
    prompt: string;
    likes: number;
    username: string;
    created_at: string;
};

const handleClick = (id: number) => {
    window.location.href = `/posts/${id}`;
};

const Post = ({ id, url, prompt, likes, username }: { id: number; url: string; prompt: string; likes: number; username: string }) => {
    return (
        <div
            onClick={() => handleClick(id)}
            className="flex flex-col w-full max-w-sm mx-auto border border-gray-800 rounded-lg shadow-md bg-gray-900 hover:bg-gray-800 transition duration-300 cursor-pointer p-4"
        >
            {/* Image */}
            <div className="overflow-hidden rounded-md">
                <img
                    src={url}
                    alt={prompt}
                    className="w-full h-56 object-cover rounded-md hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="pt-4 flex flex-col justify-between text-white">
                {/* Prompt */}
                <p className="text-sm text-gray-400 line-clamp-2">{prompt}</p>

                {/* Metadata */}
                <div className="flex justify-between items-center mt-4">
                    {/* Likes */}
                    <div className="flex items-center space-x-2">
                        <Pentagon className="text-gray-400" />
                        <span className="text-sm">{likes}</span>
                    </div>

                    {/* Username */}
                    <div className="text-sm font-medium text-gray-300">@{username}</div>
                </div>
            </div>
        </div>
    );
};

export default Post;
