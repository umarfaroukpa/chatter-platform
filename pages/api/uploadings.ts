// pages/api/uploadings.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs/promises';
import { GridFSBucket } from 'mongodb';
import connectToDatabase from '../../lib/mongodb';

const upload = multer({ dest: '/tmp' });

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: `Something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ success: false, error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req: any, res: NextApiResponse) => {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
        const fileBuffer = await fs.readFile(file.path);
        const db = await connectToDatabase(); // Connect to MongoDB using Mongoose
        const bucket = new GridFSBucket(db.connection.db, { bucketName: 'uploads' });

        // Use the native MongoDB collection instead of Mongoose
        const usersCollection = db.connection.db.collection('users'); // Correctly accessing the native MongoDB collection

        const uploadStream = bucket.openUploadStream(file.originalname || 'unknown_file');
        uploadStream.write(fileBuffer);
        uploadStream.end();

        const fileId = uploadStream.id;
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        const uid = req.body.uid;
        if (!uid) {
            throw new Error('UID not provided in request body');
        }

        await usersCollection.updateOne(
            { uid },
            { $set: { profilePicFileId: fileId } },
            { upsert: true }
        );

        await fs.unlink(file.path);

        res.status(200).json({ success: true, fileId: fileId.toString() });
    } catch (error: Error) {
        console.error('Error uploading file to MongoDB:', error.message || error);
        res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apiRoute;
