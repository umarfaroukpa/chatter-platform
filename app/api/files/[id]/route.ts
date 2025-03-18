import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, GridFSBucket } from 'mongodb';
import connectToDatabase from '../../../../lib/mongodb';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, error: 'Valid file ID is required' },
            { status: 400 }
        );
    }

    try {
        const db = await connectToDatabase();
        const bucket = new GridFSBucket(db.connection.db, { bucketName: 'uploads' });

        const file = await db.connection.db.collection('uploads.files').findOne({
            _id: new ObjectId(id),
        });

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'File not found' },
                { status: 404 }
            );
        }

        const headers = new Headers();
        headers.set('Content-Type', file.contentType || 'application/octet-stream');

        const downloadStream = bucket.openDownloadStream(new ObjectId(id));

        return new NextResponse(downloadStream as any, {
            status: 200,
            headers,
        });
    } catch (error) {
        const typedError = error as Error;
        console.error('Error retrieving file:', typedError.message);
        return NextResponse.json(
            { success: false, error: 'Failed to retrieve file' },
            { status: 500 }
        );
    }
}