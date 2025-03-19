import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import connectToDatabase from '../../../lib/mongodb';

interface UploadResponse {
    success: boolean;
    fileId?: string;
    error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        // Get form data from the request
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const uid = formData.get('uid') as string | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file uploaded' },
                { status: 400 }
            );
        }

        if (!uid) {
            return NextResponse.json(
                { success: false, error: 'UID not provided' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Connect to database
        const db = await connectToDatabase();
        const bucket = new GridFSBucket(db.connection.db, { bucketName: 'uploads' });
        const usersCollection = db.connection.db.collection('users');

        // Upload file to GridFS
        const uploadStream = bucket.openUploadStream(file.name || 'unknown_file');
        uploadStream.write(fileBuffer);
        uploadStream.end();

        const fileId = uploadStream.id;
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        // Update user document
        await usersCollection.updateOne(
            { uid },
            { $set: { profilePicFileId: fileId } },
            { upsert: true }
        );

        return NextResponse.json(
            { success: true, fileId: fileId.toString() },
            { status: 200 }
        );

    } catch (error) {
        const typedError = error as Error;
        console.error('Error uploading file to MongoDB:', typedError.message);
        return NextResponse.json(
            {
                success: false,
                error: typedError.message || 'Internal server error'
            },
            { status: 500 }
        );
    }
}