import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '../../../lib/mongodb';
import User, { IUserDocument } from '../../../models/User';
import { findOne } from '../../../lib/mongoose-utils';

// Handle CORS
function getCorsHeaders(): Record<string, string> {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

// GET Method: Fetch bookmarks
export async function GET(req: NextRequest) {
    const headers = getCorsHeaders();

    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers });
    }

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
        return NextResponse.json(
            { success: false, message: 'User ID is required' },
            { status: 400, headers }
        );
    }

    try {
        await connectToDatabase();
        // Use the type-safe findOne wrapper
        const user = await findOne<IUserDocument>(User, { uid });

        if (!user || !user.bookmarks || user.bookmarks.length === 0) {
            return NextResponse.json({ success: true, data: [] }, { status: 200, headers });
        }

        const bookmarkedPosts = await mongoose.connection.db
            .collection('posts')
            .find({ _id: { $in: user.bookmarks.map(id => new mongoose.Types.ObjectId(id)) } })
            .toArray();

        return NextResponse.json({ success: true, data: bookmarkedPosts }, { status: 200, headers });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error fetching bookmarks',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500, headers }
        );
    }
}

// POST Method: Add/Remove bookmark
export async function POST(req: NextRequest) {
    const headers = getCorsHeaders();

    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers });
    }

    const body = await req.json();
    const { postId, uid } = body;

    if (!postId || !uid) {
        return NextResponse.json(
            { success: false, message: 'Post ID and User ID are required' },
            { status: 400, headers }
        );
    }

    try {
        await connectToDatabase();
        // Use the type-safe findOne wrapper
        const user = await findOne<IUserDocument>(User, { uid });

        if (!user) {
            const newUser = new User({ uid, bookmarks: [postId] });
            await newUser.save();
            return NextResponse.json(
                { success: true, message: 'Bookmark added', isBookmarked: true },
                { status: 200, headers }
            );
        }

        const bookmarks = Array.isArray(user.bookmarks) ? user.bookmarks : [];
        const bookmarkIndex = bookmarks.indexOf(postId);

        if (bookmarkIndex === -1) {
            user.bookmarks.push(postId);
            await user.save();
            return NextResponse.json(
                { success: true, message: 'Bookmark added', isBookmarked: true },
                { status: 200, headers }
            );
        } else {
            user.bookmarks = user.bookmarks.filter(id => id !== postId);
            await user.save();
            return NextResponse.json(
                { success: true, message: 'Bookmark removed', isBookmarked: false },
                { status: 200, headers }
            );
        }
    } catch (error) {
        console.error('Error updating bookmarks:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Error updating bookmarks',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500, headers }
        );
    }
}