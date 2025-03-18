"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Comment {
    _id: string;
    userId: string;
    username: string;
    text: string;
    createdAt: string; // Changed from timestamp to match schema
    reactions?: Record<string, number>;
}

interface CommentSectionProps {
    postId: string;
    userId: string;
    comments: Comment[];
    refreshPost: () => void;
}

interface UserData {
    _id: string;
    username?: string;
}

const CommentSection = ({ postId, userId, comments, refreshPost }: CommentSectionProps) => {
    const [commentText, setCommentText] = useState("");
    const [userData, setUserData] = useState<UserData | null>(null);
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
            if (axios.isAxiosError(error) && error.response) {
                alert(`Failed to post comment: ${error.response.data.error}`);
            } else {
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
                userId: userData?._id
            });
            refreshPost();
            setShowEmojiPicker(false);
            setSelectedComment(null);
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
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
                        className={`bg-[#07327a] text-white px-4 py-2 rounded-r ${!commentText.trim() || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-50 p-4 rounded">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{comment.username}</p>
                                    <p className="text-sm text-[#787474]">{formatDate(comment.createdAt)}</p>
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
                                    {/* Add EmojiPicker here if needed */}
                                </div>
                            </div>
                            <p className="mt-2">{comment.text}</p>
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