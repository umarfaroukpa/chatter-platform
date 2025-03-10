import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
    // Only handle GET method
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    let client = null;
    try {
        const { id } = req.query;

        // Validate ID format
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid post ID format'
            });
        }

        // Connect to database
        client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db(process.env.MONGODB_DB);

        // Find post
        const post = await db.collection('posts').findOne({ _id: objectId });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: post,
            message: 'Post retrieved successfully'
        });
    } catch (error) {
        console.error('Error retrieving post:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve post',
            error: error.toString()
        });
    } finally {
        if (client) await client.close();
    }
}