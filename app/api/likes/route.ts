import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

type Post = {
    _id: ObjectId; // MongoDB's default _id field
    postId: string; // Your custom UUID field
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

export async function POST(request: NextRequest) {
    let client: MongoClient | null = null;

    try {
        // Parse request body
        const { postId, userId } = await request.json();

        // Validate inputs
        if (!postId || !userId) {
            return NextResponse.json(
                { success: false, message: 'Post ID and User ID are required' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        client = await MongoClient.connect(process.env.MONGODB_URI as string);
        const db = client.db(process.env.MONGODB_DB as string);

        // Get the post using postId (not _id)
        const post = await db.collection<Post>('posts').findOne({ postId });

        if (!post) {
            return NextResponse.json(
                { success: false, message: 'Post not found' },
                { status: 404 }
            );
        }

        // Check if user already liked the post
        const likes = post.likes || [];
        const userLikedIndex = likes.indexOf(userId);

        // Toggle like status
        if (userLikedIndex === -1) {
            // User hasn't liked the post, add the like
            await db.collection<Post>('posts').updateOne(
                { postId },
                { $push: { likes: userId } }
            );
        } else {
            // User already liked the post, remove the like
            await db.collection<Post>('posts').updateOne(
                { postId },
                { $pull: { likes: userId } }
            );
        }

        // Get updated post
        const updatedPost = await db.collection<Post>('posts').findOne({ postId });

        return NextResponse.json(
            {
                success: true,
                message: userLikedIndex === -1 ? 'Post liked successfully' : 'Post unliked successfully',
                data: updatedPost as Post
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error handling like:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        if (client) await client.close();
    }
}