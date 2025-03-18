import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Post, { IPost } from '../../../models/Post';
import User, { IUserDocument } from '../../../models/User';
import { findOne, findOneAndUpdate } from '../../../lib/mongoose-utils';

interface Comment {
    userId: string;
    username: string;
    text: string;
    createdAt?: string;
    reactions?: Record<string, number>;
}

interface CommentResponse {
    success: boolean;
    data?: Comment;
    error?: string;
    commentCount?: number;
    debug?: unknown;
    details?: unknown;
}

// Cached connection for better performance
let cachedDb: any = null;
async function getDatabase() {
    if (cachedDb) return cachedDb;
    cachedDb = await connectToDatabase();
    return cachedDb;
}

export async function POST(request: NextRequest) {
    try {
        await getDatabase();

        const { postId, comment }: { postId: string; comment: Comment } = await request.json();

        console.log("Request body:", JSON.stringify({ postId, comment }, null, 2));

        if (!postId || !comment?.userId || !comment?.text) {
            console.log("Missing required fields");
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields',
                    debug: { receivedPostId: postId, receivedComment: comment }
                },
                { status: 400 }
            );
        }

        const { userId, username, text, createdAt, reactions = {} } = comment;

        console.log("User ID:", userId);
        console.log("Looking up user...");

        const user = await findOne<IUserDocument>(User, { _id: userId });
        if (!user) {
            console.log("User not found:", userId);
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        console.log("User found:", user._id);
        console.log("Looking up post...");

        // Use findOne to query by postId instead of _id
        const post = await findOne<IPost>(Post, { postId });
        if (!post) {
            console.log("Post not found:", postId);
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        console.log("Post found:", post.postId);

        const newComment: Comment = {
            userId,
            username: username || user.username || 'Anonymous',
            text,
            createdAt: createdAt || new Date().toISOString(),
            reactions
        };

        console.log("Created comment object:", newComment);
        console.log("Updating post with new comment...");

        // Update using findOneAndUpdate with postId
        const updatedPost = await findOneAndUpdate<IPost>(
            Post,
            { postId },
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

        return NextResponse.json(
            {
                success: true,
                data: newComment,
                commentCount: updatedPost?.comments.length
            },
            { status: 200 }
        );
    } catch (error) {
        const typedError = error as Error;
        console.error('Error adding comment:', typedError.message);
        const errorDetails = {
            message: typedError.message,
            stack: process.env.NODE_ENV === 'development' ? typedError.stack : undefined,
            name: typedError.name
        };
        console.error('Error details:', errorDetails);
        return NextResponse.json(
            {
                success: false,
                error: typedError.message,
                details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Adjust as needed
        }
    }
};