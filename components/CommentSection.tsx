"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { EmojiPicker } from "./EmojiPicker";

interface Comment {
    _id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: string;
    reactions: { [key: string]: number } | null | undefined;
}

interface CommentSectionProps {
    postId: string;
    userId: string;
    comments: Comment[];
    refreshPost: () => void;
}

const CommentSection = ({ postId, userId, comments, refreshPost }: CommentSectionProps) => {
    const [commentText, setCommentText] = useState("");
    const [userData, setUserData] = useState<any>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (currentUser.uid) {
                    const response = await axios.post('/api/user', { uid: currentUser.uid });
                    if (response.data.success) {
                        setUserData(response.data.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !userData) return;

        setLoading(true);
        try {
            console.log("Sending comment with data:", {
                postId,
                comment: {
                    userId: userData._id,
                    username: userData.username || "Anonymous",
                    text: commentText
                }
            });

            const response = await axios.post('/api/comments', {
                postId,
                comment: {
                    userId: userData._id,
                    username: userData.username || "Anonymous",
                    text: commentText
                }
            });

            console.log("Comment posted successfully:", response.data);
            setCommentText("");
            refreshPost();
        } catch (error) {
            console.error("Error posting comment:", error);
            // Type-safe error handling
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                    console.error("Status code:", error.response.status);

                    const errorMessage = error.response.data?.error || 'Unknown error';
                    alert(`Failed to post comment: ${errorMessage}`);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    alert("Failed to post comment: No response from server");
                } else {
                    console.error("Error setting up request:", error.message);
                    alert(`Failed to post comment: ${error.message}`);
                }
            } else {
                console.error("Non-Axios error:", error);
                alert("Failed to post comment. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleAddReaction = async (commentId: string, emoji: string) => {
        try {
            await axios.post('/api/reactions', {
                postId,
                commentId,
                emoji,
                userId: userData._id
            });

            refreshPost();
            setShowEmojiPicker(false);
            setSelectedComment(null);
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"
                        rows={2}
                    />
                    <button
                        type="submit"
                        disabled={!commentText.trim() || loading}
                        className={`bg-[#07327a] text-white px-4 py-2 rounded-r ${!commentText.trim() || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                            }`}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-50 p-4 rounded">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{comment.username}</p>
                                    <p className="text-sm text-[#787474]">{formatDate(comment.timestamp)}</p>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setSelectedComment(comment._id);
                                            setShowEmojiPicker(!showEmojiPicker || selectedComment !== comment._id);
                                        }}
                                        className="text-[#787474] hover:text-gray-700"
                                    >
                                        😀 React
                                    </button>

                                    {showEmojiPicker && selectedComment === comment._id && (
                                        <div className="absolute right-0 mt-1 z-10">
                                            <EmojiPicker onEmojiSelect={(emoji) => handleAddReaction(comment._id, emoji)} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="mt-2">{comment.text}</p>

                            {/* Reactions Display - Add null/undefined check */}
                            {comment.reactions && Object.keys(comment.reactions).length > 0 && (
                                <div className="flex flex-wrap mt-2 gap-2">
                                    {Object.entries(comment.reactions).map(([emoji, count]) => (
                                        <span key={emoji} className="bg-gray-200 px-2 py-1 rounded text-sm">
                                            {emoji} {count}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;