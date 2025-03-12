'use client';

import { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

// Emoji picker component
const EmojiPicker = ({ onSelectEmoji, onClose }) => {
    const commonEmojis = ['👍', '👎', '😀', '😂', '😊', '😎', '🎉', '❤️', '🔥', '👏'];

    return (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="flex flex-wrap gap-1 max-w-[200px]">
                {commonEmojis.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => {
                            onSelectEmoji(emoji);
                            onClose();
                        }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Individual comment component
const CommentItem = ({ comment, currentUserId, onLike, onReply }) => {
    const { id, text, timestamp, author, profilePic, likes = [], replies = [] } = comment;
    const formattedTime = timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : 'just now';
    const isLiked = likes.includes(currentUserId);

    return (
        <div className="comment-item mb-4">
            <div className="flex items-start space-x-3">
                <Image
                    src={profilePic || "/default-avatar.png"}
                    alt={author || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{author || 'Anonymous User'}</span>
                            <span className="text-xs text-gray-500">{formattedTime}</span>
                        </div>
                        <p className="text-sm whitespace-pre-line">{text}</p>
                    </div>

                    <div className="flex items-center space-x-4 mt-1 ml-1">
                        <button
                            onClick={() => onLike(id)}
                            className={`text-xs flex items-center ${isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                        >
                            👍 {likes.length > 0 && <span className="ml-1">{likes.length}</span>}
                        </button>
                        <button
                            onClick={() => onReply(id)}
                            className="text-xs text-gray-500"
                        >
                            Reply
                        </button>
                    </div>

                    {/* Nested replies */}
                    {replies.length > 0 && (
                        <div className="ml-4 mt-2 space-y-3">
                            {replies.map(reply => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    currentUserId={currentUserId}
                                    onLike={onLike}
                                    onReply={onReply}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Comment input component
const CommentInput = ({ postId, onCommentAdded, parentCommentId = null, placeholder = "Write a comment..." }) => {
    const [commentText, setCommentText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!commentText.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);


            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                    parentCommentId,
                    text: commentText
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCommentText('');
                if (onCommentAdded) onCommentAdded(data.comment);
            } else {
                console.error('Failed to add comment:', data.error);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const insertEmoji = (emoji) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const newText = commentText.substring(0, start) + emoji + commentText.substring(end);
            setCommentText(newText);

            // Set cursor position after the inserted emoji
            setTimeout(() => {
                textarea.selectionStart = start + emoji.length;
                textarea.selectionEnd = start + emoji.length;
                textarea.focus();
            }, 0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2 mb-4">
            <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                <textarea
                    ref={textareaRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={placeholder}
                    rows={2}
                    className="w-full p-3 resize-none focus:outline-none"
                />

                <div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-200">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
                        >
                            😀
                        </button>

                        {showEmojiPicker && (
                            <EmojiPicker
                                onSelectEmoji={insertEmoji}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!commentText.trim() || isSubmitting}
                        className={`px-3 py-1 rounded text-sm font-medium ${!commentText.trim() || isSubmitting
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </form>
    );
};

// Main comments component
export default function CommentsSection({ postId, initialComments = [] }) {
    const [comments, setComments] = useState(initialComments);
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const currentUserId = 'current-user-id';

    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [newComment, ...prevComments]);
    };

    const handleReplyAdded = (parentId, newReply) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === parentId
                    ? { ...comment, replies: [...(comment.replies || []), newReply] }
                    : comment
            )
        );
        setReplyingTo(null);
    };

    const handleLike = async (commentId) => {
        try {

            const response = await fetch(`/api/comments/${commentId}/like`, {
                method: 'POST',
            });

            const data = await response.json();

            if (data.success) {
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === commentId
                            ? {
                                ...comment,
                                likes: comment.likes.includes(currentUserId)
                                    ? comment.likes.filter(id => id !== currentUserId)
                                    : [...comment.likes, currentUserId]
                            }
                            : comment
                    )
                );
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    return (
        <div className="comments-section mt-6">
            <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>

            {/* Main comment input */}
            <CommentInput
                postId={postId}
                onCommentAdded={handleCommentAdded}
            />

            {/* Comments list */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-4">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id}>
                            <CommentItem
                                comment={comment}
                                currentUserId={currentUserId}
                                onLike={handleLike}
                                onReply={(commentId) => setReplyingTo(commentId)}
                            />

                            {replyingTo === comment.id && (
                                <div className="ml-12">
                                    <CommentInput
                                        postId={postId}
                                        parentCommentId={comment.id}
                                        onCommentAdded={(newReply) => handleReplyAdded(comment.id, newReply)}
                                        placeholder={`Reply to ${comment.author || 'Anonymous'}...`}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}