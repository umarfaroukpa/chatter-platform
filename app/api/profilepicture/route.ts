import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket, ObjectId } from 'mongodb';
import connectToDatabase from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
        return NextResponse.json(
            { success: false, message: 'UID is required' },
            { status: 400 }
        );
    }

    try {

        const mongooseConnection = await connectToDatabase();
        const db = mongooseConnection.connection.db;

        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ uid });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.profilePicFileId) {
            return NextResponse.json(
                { success: false, message: 'Profile picture not set for this user' },
                { status: 404 }
            );
        }

        let fileId;
        try {
            fileId = new ObjectId(user.profilePicFileId);
        } catch (err) {
            console.error('Invalid profilePicFileId format:', user.profilePicFileId);
            return NextResponse.json(
                { success: false, message: 'Invalid profile picture ID format' },
                { status: 400 }
            );
        }

        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const file = await db.collection('uploads.files').findOne({ _id: fileId });

        if (!file) {
            console.error('File not found in GridFS:', fileId);
            return NextResponse.json(
                { success: false, message: 'Profile picture file not found in storage' },
                { status: 404 }
            );
        }

        const downloadStream = bucket.openDownloadStream(fileId);

        const headers = new Headers();
        headers.set('Content-Type', file.contentType || 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=31536000');

        return new NextResponse(downloadStream as any, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error retrieving profile picture:', error);
        const typedError = error as Error;
        return NextResponse.json(
            {
                success: false,
                error: typedError.message || 'Failed to retrieve profile picture',
                details: process.env.NODE_ENV === 'development' ? typedError.stack : undefined
            },
            { status: 500 }
        );
    }
}