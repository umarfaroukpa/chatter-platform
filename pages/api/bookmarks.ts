import { MongoClient, ObjectId } from 'mongodb';
import admin from 'firebase-admin';
import { initAdmin } from '../../lib/firebaseAdmin';

// Initialize Firebase Admin if not already initialized
if (!global.firebaseAdmin) {
    initAdmin();
}

export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db(process.env.MONGODB_DB);

        // GET: Fetch user's bookmarks
        if (req.method === 'GET') {
            const { uid } = req.query;

            if (!uid) {
                await client.close();
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            // Get the user's bookmarks from Firestore
            const firestore = admin.firestore();
            const userDoc = await firestore.collection('users').doc(uid).get();

            if (!userDoc.exists) {
                await client.close();
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const userData = userDoc.data();
            const bookmarkIds = userData.bookmarks || [];

            // If no bookmarks, return empty array
            if (bookmarkIds.length === 0) {
                await client.close();
                return res.status(200).json({ success: true, data: [] });
            }

            // Convert string IDs to ObjectId
            const objectIds = bookmarkIds.map(id => new ObjectId(id));

            // Fetch the bookmarked posts
            const bookmarkedPosts = await db.collection('posts')
                .find({ _id: { $in: objectIds } })
                .toArray();

            await client.close();
            return res.status(200).json({ success: true, data: bookmarkedPosts });
        }

        // POST: Add or remove bookmark
        if (req.method === 'POST') {
            const { postId, uid } = req.body;

            if (!postId || !uid) {
                await client.close();
                return res.status(400).json({ success: false, message: 'Post ID and User ID are required' });
            }

            // Check if post exists
            const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

            if (!post) {
                await client.close();
                return res.status(404).json({ success: false, message: 'Post not found' });
            }

            // Update user's bookmarks in Firestore
            const firestore = admin.firestore();
            const userRef = firestore.collection('users').doc(uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                await client.close();
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const userData = userDoc.data();
            const bookmarks = userData.bookmarks || [];

            // Check if post is already bookmarked
            const bookmarkIndex = bookmarks.indexOf(postId);

            if (bookmarkIndex === -1) {
                // Add bookmark
                await userRef.update({
                    bookmarks: [...bookmarks, postId]
                });

                await client.close();
                return res.status(200).json({
                    success: true,
                    message: 'Post bookmarked successfully',
                    isBookmarked: true
                });
            } else {
                // Remove bookmark
                bookmarks.splice(bookmarkIndex, 1);
                await userRef.update({ bookmarks });

                await client.close();
                return res.status(200).json({
                    success: true,
                    message: 'Post removed from bookmarks',
                    isBookmarked: false
                });
            }
        }

    } catch (error) {
        console.error('Error handling bookmark:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}