// pages/api/comments.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Post from '../../models/Post';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { postId, userId, username, text } = req.body;

    // Validate required fields
    if (!postId || !userId || !text) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        // Verify user exists
        const user = await User.findOne({ uid: userId });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // Create new comment
        const newComment = {
            userId,
            username: user.username || username,
            text,
            createdAt: new Date().toISOString()
        };

        // Add comment to post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment } },
            { new: true }
        );

        // Add comment reference to user
        await User.findOneAndUpdate(
            { uid: userId },
            {
                $push: {
                    comments: {
                        id: postId,
                        text: text.substring(0, 30) + (text.length > 30 ? '...' : '')
                    }
                }
            }
        );

        return res.status(200).json({
            success: true,
            data: newComment,
            commentCount: updatedPost.comments.length
        });
    } catch (error: any) {
        console.error('Error adding comment:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}