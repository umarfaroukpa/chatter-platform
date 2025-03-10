import { MongoClient } from 'mongodb';
import admin from 'firebase-admin';
import { initAdmin } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
    let client = null;

    try {
        // Only handle POST method
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                message: 'Method not allowed'
            });
        }

        // Extract request body
        const { postId, uid } = req.body;

        // Validate required fields
        if (!postId || !uid) {
            return res.status(400).json({
                success: false,
                message: 'Post ID and User ID are required'
            });
        }

        // Initialize Firebase if needed
        if (admin.apps.length === 0) {
            try {
                initAdmin();
                console.log('✅ Firebase Admin successfully initialized');
            } catch (initError) {
                console.error('Firebase Admin Initialization Failed:', initError);
                return res.status(500).json({
                    success: false,
                    message: 'Firebase initialization error',
                    error: initError.toString()
                });
            }
        }

        try {
            // Get user document
            const firestore = admin.firestore();
            const userRef = firestore.collection('users').doc(uid);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get current bookmarks
            const userData = userDoc.data();
            const bookmarks = userData.bookmarks || [];

            // Check if bookmark exists
            if (!bookmarks.includes(postId)) {
                return res.status(404).json({
                    success: false,
                    message: 'Bookmark not found'
                });
            }

            // Remove bookmark
            const updatedBookmarks = bookmarks.filter(id => id !== postId);

            await userRef.update({
                bookmarks: updatedBookmarks
            });

            return res.status(200).json({
                success: true,
                message: 'Bookmark removed successfully'
            });
        } catch (error) {
            console.error('Error removing bookmark:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to remove bookmark',
                error: error.toString()
            });
        }
    } catch (globalError) {
        console.error('Global Error:', globalError);
        return res.status(500).json({
            success: false,
            message: 'Unexpected server error',
            error: globalError.toString()
        });
    } finally {
        if (client) await client.close();
    }
}