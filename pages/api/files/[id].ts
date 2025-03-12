import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId, GridFSBucket } from 'mongodb';
import connectToDatabase from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Valid file ID is required' });
    }

    try {
        const db = await connectToDatabase();
        const bucket = new GridFSBucket(db.connection.db, { bucketName: 'uploads' });

        // Check if file exists
        const file = await db.connection.db.collection('uploads.files').findOne({
            _id: new ObjectId(id)
        });

        if (!file) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }

        // Set appropriate content type
        res.setHeader('Content-Type', file.contentType || 'application/octet-stream');

        // Stream the file to the response
        const downloadStream = bucket.openDownloadStream(new ObjectId(id));
        downloadStream.pipe(res);

    } catch (error: Error | any) {
        console.error('Error retrieving file:', error.message || error);
        res.status(500).json({ success: false, error: 'Failed to retrieve file' });
    }
}