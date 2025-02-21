import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs/promises';
import { MongoClient, GridFSBucket } from 'mongodb';

const upload = multer({ dest: '/tmp' });

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        console.error('API Error:', error);
        res.status(500).json({ error: `Something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req: any, res: NextApiResponse) => {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    let client: MongoClient | null = null;

    try {
        const fileBuffer = await fs.readFile(file.path);
        const uri = (process.env.MONGODB_URI || '').replace(/:([^:@]+)@/, ':****@');
        console.log('Connecting to MongoDB with URI:', uri);

        client = new MongoClient(process.env.MONGODB_URI as string, { tls: true });
        await client.connect();

        const db = client.db('test');
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const usersCollection = db.collection('users');

        const uploadStream = bucket.openUploadStream(file.originalname || 'unknown_file');
        uploadStream.write(fileBuffer);
        uploadStream.end();

        const fileId = uploadStream.id;
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        // Get UID from request body
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
    } catch (error: any) {
        console.error('Error uploading file to MongoDB:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (client) await client.close();
    }
});

export const config = {
    api: {
        bodyParser: false, // Multer handles body parsing
    },
};

export default apiRoute;