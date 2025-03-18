// app/api/reactions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import mongoose from 'mongoose';

const Post = mongoose.models.Post;

interface ReactionRequest {
    postId: string;
    commentId: string;
    emoji: string;
    userId: string;
}

interface Comment {
    _id: string;
    reactions?: Record<string, number>;
}

interface Post {
    _id: string;
    comments: Comment[];
}

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        // Parse request body
        const { postId, commentId, emoji, userId }: ReactionRequest = await request.json();

        // Validate required fields
        if (!postId || !commentId || !emoji || !userId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        // Find the comment in the post
        const commentIndex = post.comments.findIndex(
            (c: Comment) => c._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Comment not found' },
                { status: 404 }
            );
        }

        // Initialize reactions object if it doesn't exist
        if (!post.comments[commentIndex].reactions) {
            post.comments[commentIndex].reactions = {};
        }

        // Prepare update query
        const reactionKey = `comments.${commentIndex}.reactions.${emoji}`;
        const updateQuery: Record<string, number> = {};
        updateQuery[reactionKey] = 1;

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: updateQuery },
            { new: true }
        );

        return NextResponse.json(
            { success: true, data: updatedPost },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error adding reaction:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}