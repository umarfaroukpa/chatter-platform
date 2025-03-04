import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import mongoose from 'mongoose';

const Post = mongoose.models.Post;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const { postId, commentId, emoji, userId } = req.body;

        if (!postId || !commentId || !emoji || !userId) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Find the post and comment
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // Find the comment in the post
        const commentIndex = post.comments.findIndex(
            (c: any) => c._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        // Initialize reactions object if it doesn't exist
        if (!post.comments[commentIndex].reactions) {
            post.comments[commentIndex].reactions = {};
        }

        // Increment reaction count
        const reactionKey = `comments.${commentIndex}.reactions.${emoji}`;
        const updateQuery: any = {};
        updateQuery[reactionKey] = 1;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: updateQuery },
            { new: true }
        );

        return res.status(200).json({ success: true, data: updatedPost });
    } catch (error: any) {
        console.error('Error adding reaction:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}