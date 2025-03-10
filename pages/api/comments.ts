import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Post, { IPost } from '../../models/Post';
import User, { IUserDocument } from '../../models/User';
import { findOne, findById, findByIdAndUpdate, findOneAndUpdate } from '../../lib/mongoose-utils';

// Updated interface to include debug and details fields
interface CommentResponse {
    success: boolean;
    data?: any;
    error?: string;
    commentCount?: number;
    debug?: any;  // For development debugging
    details?: any; // For detailed error information
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CommentResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        await connectToDatabase();

        console.log("Request body:", JSON.stringify(req.body, null, 2));

        // Extract data correctly based on frontend structure
        const { postId, comment } = req.body;

        console.log("Extracted postId:", postId);
        console.log("Extracted comment:", comment);

        // Check if required fields exist
        if (!postId || !comment || !comment.userId || !comment.text) {
            console.log("Missing required fields");
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                debug: { receivedPostId: postId, receivedComment: comment }
            });
        }

        const { userId, username, text, timestamp } = comment;

        console.log("User ID:", userId);
        console.log("Looking up user...");

        // Using utility functions consistently
        const user = await findOne<IUserDocument>(User, { _id: userId });
        if (!user) {
            console.log("User not found:", userId);
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log("User found:", user._id);
        console.log("Looking up post...");

        const post = await findById<IPost>(Post, postId);
        if (!post) {
            console.log("Post not found:", postId);
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        console.log("Post found:", post._id);

        const newComment = {
            userId,
            username: username || user.username || 'Anonymous',
            text,
            createdAt: timestamp || new Date().toISOString(),
            reactions: comment.reactions || {}
        };

        console.log("Created comment object:", newComment);
        console.log("Updating post with new comment...");

        const updatedPost = await findByIdAndUpdate<IPost>(
            Post,
            postId,
            { $push: { comments: newComment } },
            { new: true }
        );

        console.log("Post updated successfully");
        console.log("Updating user with new comment reference...");

        await findOneAndUpdate<IUserDocument>(
            User,
            { _id: userId },
            {
                $push: {
                    comments: {
                        id: postId,
                        text: text.substring(0, 30) + (text.length > 30 ? '...' : '')
                    }
                }
            },
            { new: true }
        );

        console.log("User updated successfully");

        return res.status(200).json({
            success: true,
            data: newComment,
            commentCount: updatedPost?.comments.length
        });
    } catch (error: any) {
        console.error('Error adding comment:', error);
        // More detailed error information
        const errorDetails = {
            message: error.message,
            stack: error.stack,
            name: error.name
        };
        console.error('Error details:', errorDetails);
        return res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
        });
    }
}