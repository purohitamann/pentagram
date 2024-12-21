"use client";

import { useState } from "react";
import { Pentagon, CornerDownRight } from "lucide-react";
import { Input } from "@/components/ui/input"; // Replace with your ShadCN input path
import { base } from "@/lib/sup";
import { Button } from "@/components/ui/button";
export default function ClientImagePage({
    image,
    comments: initialComments,
}: {
    image: any;
    comments: any[];
}) {
    const [likes, setLikes] = useState(image.likes);
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const supabase = base();

    // Handle like update
    const handleLike = async () => {
        const { error } = await supabase
            .from("images")
            .update({ likes: likes + 1 })
            .eq("id", image.id);

        if (!error) {
            setLikes(likes + 1); // Optimistically update likes
        } else {
            console.error("Error updating likes:", error.message);
        }
    };

    // Handle comment submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        const { error, data } = await supabase
            .from("comments")
            .insert({ image_id: image.id, content: newComment, username: "johndoe" });

        if (!error) {
            if (data) {
                setComments([...comments, data[0]]); // Update comments locally
            }
            setNewComment(""); // Reset input field
        } else {
            console.error("Error adding comment:", error.message);
        }
    };

    return (
        <div className="p-8 text-white bg-gradient-to-r from-gray-800 to-emerald-600 min-h-screen">
            {/* Back to Home */}
            <div className="mb-6 text-sm text-gray-400 hover:text-gray-200">
                <a href="/">← Back to Home</a>
            </div>

            {/* Image Display */}
            <div className="flex justify-center w-1/2 h-1/2 items-center mx-auto">
                <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="rounded-lg shadow-lg border border-gray-800 max-w-full"
                />
            </div>

            {/* Metadata */}
            <div className="flex flex-row justify-between items-center pt-6 border-t border-gray-800 mt-4 pt-4">
                {/* Likes Section */}
                <div
                    className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
                    onClick={handleLike}
                >
                    <Pentagon className="text-gray-400" />
                    <span>{likes} Likes</span>
                </div>
                <div className="text-gray-300 font-medium">Posted by {image.username}</div>
                <div className="text-sm text-gray-500">
                    {new Date(image.created_at).toLocaleDateString()}
                </div>
            </div>

            {/* Prompt */}
            <div className="flex items-center space-x-2 pt-6">
                <CornerDownRight className="text-gray-400" />
                <h1 className="text-xl font-semibold text-gray-200">{image.prompt}</h1>
            </div>
            <div className="flex flex-col">


                {/* Comment Input */}
                <div className="bg-gray-800 p-4 rounded-lg mt-6 shadow-md">
                    <h2 className="text-lg font-md   text-gray-200">Add a Comment</h2>
                    <form onSubmit={handleSubmit} className=" flex flex-row w-full h-1/2 justify-center align-middle gap-4 items-center">
                        <Input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            className="bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-gray-500 rounded-md"
                        />
                        <Button
                            type="submit"
                            className="bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500  text-white rounded-md"
                        >
                            Submit
                        </Button>
                    </form>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-800 p-4 rounded-lg mt-6 shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-200">Comments</h2>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map((comment: any) => (
                                <li key={comment.id} className="mb-4 border-b border-gray-700 pb-4">
                                    <p className="font-medium text-gray-300">{comment.username || "Anonymous"}</p>
                                    <p className="text-gray-400">{comment.content}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
