// app/api/post/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Post, { IPost } from '../../../models/Post';
import User, { IUserDocument } from '../../../models/User';
import { v4 as uuidv4 } from 'uuid';
import { findOne, findOneAndUpdate, find } from '../../../lib/mongoose-utils';

interface PostData {
    title: string;
    content: string;
    tags: string[];
    uid: string;
}

export async function POST(request: NextRequest) {
    try {
        const { title, content, tags, uid }: PostData = await request.json();

        if (!title || !content || !uid) {
            return NextResponse.json(
                { success: false, error: 'Title, content, and user ID are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await findOne<IUserDocument>(User, { uid });
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        if (user.userType !== 'Writer') {
            return NextResponse.json(
                { success: false, error: 'Only Writers can create posts' },
                { status: 403 }
            );
        }

        const postId = uuidv4();

        const newPost = new Post({
            postId,
            title,
            content,
            author: user.username || 'Anonymous',
            authorId: uid,
            authorProfilePic: user.profilePicUrl || '',
            tags: tags || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            likes: [],
            comments: [],
        });

        await newPost.save();

        await findOneAndUpdate<IUserDocument>(
            User,
            { uid },
            { $push: { posts: { id: postId, title } } },
            { new: true }
        );

        return NextResponse.json(
            { success: true, data: newPost },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating post:', error);
        const typedError = error as Error;
        return NextResponse.json(
            { success: false, error: typedError.message || 'Failed to create post' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get('limit') || '10');
        const page = Number(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;

        const posts = await find<IPost>(
            Post,
            {},
            {
                sort: { createdAt: -1 },
                skip,
                limit,
            }
        );

        return NextResponse.json(
            {
                success: true,
                data: posts,
            },
            {
                status: 200,
                headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
            }
        );
    } catch (error) {
        const typedError = error as Error;
        console.error('Error fetching posts:', typedError);
        return NextResponse.json(
            { success: false, error: typedError.message || 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}