import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    cachedClient = await MongoClient.connect(process.env.MONGODB_URI as string);
    return cachedClient;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (err) {
            console.error("Invalid ID format:", err);
            return NextResponse.json(
                { success: false, message: 'Invalid post ID format' },
                { status: 400 }
            );
        }

        const client = await connectToDatabase();
        const db = client.db(process.env.MONGODB_DB as string);

        const post = await db.collection('posts').findOne({ _id: objectId });

        if (!post) {
            return NextResponse.json(
                { success: false, message: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: post,
                message: 'Post retrieved successfully'
            },
            { status: 200 }
        );

    } catch (err) {
        const error = err as Error;
        console.error("Error retrieving post:", error);
        return NextResponse.json(
            {
                success: false,
                message: `Failed to retrieve post: ${error.message}`
            },
            { status: 500 }
        );
    }
}