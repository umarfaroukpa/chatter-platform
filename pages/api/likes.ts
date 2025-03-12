// pages/api/likes.js
import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

type Post = {
    _id: ObjectId;
    title: string;
    content: string;
    author: string;
    likes: string[];
    comments?: { userId: string; text: string }[];
    createdAt: Date;
};

type ResponseData = {
    success: boolean;
    message: string;
    data?: Post;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { postId, userId } = req.body;

        if (!postId || !userId) {
            return res.status(400).json({ success: false, message: 'Post ID and User ID are required' });
        }

        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db(process.env.MONGODB_DB as string);

        // Get the post
        const post = await db.collection<Post>('posts').findOne({ _id: new ObjectId(postId) });

        if (!post) {
            await client.close();
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if user already liked the post
        const likes = post.likes || [];
        const userLikedIndex = likes.indexOf(userId);

        // Toggle like status
        if (userLikedIndex === -1) {
            // User hasn't liked the post, add the like
            await db.collection<Post>('posts').updateOne(
                { _id: new ObjectId(postId) },
                { $push: { likes: userId } }
            );
        } else {
            // User already liked the post, remove the like
            await db.collection<Post>('posts').updateOne(
                { _id: new ObjectId(postId) },
                { $pull: { likes: userId } }
            );
        }

        // Get updated post
        const updatedPost = await db.collection<Post>('posts').findOne({ _id: new ObjectId(postId) });

        await client.close();
        return res.status(200).json({
            success: true,
            message: userLikedIndex === -1 ? 'Post liked successfully' : 'Post unliked successfully',
            data: updatedPost as Post
        });

    } catch (error) {
        console.error('Error handling like:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}