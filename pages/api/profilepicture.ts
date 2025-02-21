import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI environment variable must be defined');

const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { uid } = req.query;

    try {
        await client.connect();
        const database = client.db('test');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ uid: uid as string });
        if (!user || !user.profilePicFileId) {
            return res.status(404).json({ success: false, message: 'Profile picture not found' });
        }

        const bucket = new GridFSBucket(database, { bucketName: 'uploads' });
        const downloadStream = bucket.openDownloadStream(new ObjectId(user.profilePicFileId));
        res.setHeader('Content-Type', 'image/jpeg'); // Adjust MIME type dynamically if possible
        downloadStream.pipe(res);
    } catch (error: any) {
        console.error('Error retrieving file from MongoDB:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}