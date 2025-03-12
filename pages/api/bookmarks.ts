import { MongoClient, ObjectId } from 'mongodb';
import admin from 'firebase-admin';
import { initAdmin } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
    let client = null;

    try {
        // Explicit Firebase Admin initialization
        if (admin.apps.length === 0) {
            try {
                initAdmin();
            } catch (initError) {
                console.error('Firebase Admin Initialization Failed:', initError);
                return res.status(500).json({
                    success: false,
                    message: 'Firebase initialization error',
                    error: initError.toString()
                });
            }
        }

        // MongoDB Connection
        try {
            const client = await MongoClient.connect(process.env.MONGODB_URI);
            const db = client.db(process.env.MONGODB_DB);
            const firestore = admin.firestore();

            // Handle GET method - Retrieve bookmarks
            if (req.method === 'GET') {
                // Extract User ID
                const { uid } = req.query;
                if (!uid) {
                    if (client) await client.close();
                    return res.status(400).json({
                        success: false,
                        message: 'User ID is required'
                    });
                }

                // Firestore Access
                let userDoc;
                try {
                    userDoc = await firestore.collection('users').doc(uid).get();
                } catch (firestoreAccessError) {
                    console.error('Detailed Firestore Access Error:', {
                        message: firestoreAccessError.message,
                        stack: firestoreAccessError.stack,
                        name: firestoreAccessError.name
                    });

                    if (client) await client.close();
                    return res.status(500).json({
                        success: false,
                        message: 'Firestore access failed',
                        errorDetails: {
                            message: firestoreAccessError.message,
                            name: firestoreAccessError.name
                        }
                    });
                }

                // Check if user document exists
                if (!userDoc.exists) {
                    if (client) await client.close();
                    return res.status(404).json({
                        success: false,
                        message: 'User not found',
                        uid: uid
                    });
                }

                // Extract bookmarks
                const userData = userDoc.data();
                const bookmarkIds = userData?.bookmarks || [];

                // Handle empty bookmarks
                if (bookmarkIds.length === 0) {
                    if (client) await client.close();
                    return res.status(200).json({
                        success: true,
                        data: [],
                        message: 'No bookmarks found'
                    });
                }

                // Convert and validate bookmark IDs
                const validObjectIds = bookmarkIds.reduce((acc, id) => {
                    try {
                        const objectId = new ObjectId(id);
                        acc.push(objectId);
                    } catch {
                        console.warn(`Invalid bookmark ID: ${id}`);
                    }
                    return acc;
                }, []);

                // Fetch bookmarked posts
                const bookmarkedPosts = await db.collection('posts')
                    .find({ _id: { $in: validObjectIds } })
                    .toArray();

                // Close client and return results
                if (client) await client.close();
                return res.status(200).json({
                    success: true,
                    data: bookmarkedPosts,
                    message: 'Bookmarks retrieved successfully'
                });
            }
            // Handle POST method - Create bookmark
            else if (req.method === 'POST') {
                const { postId, uid } = req.body;

                // Validate required fields
                if (!postId || !uid) {
                    if (client) await client.close();
                    return res.status(400).json({
                        success: false,
                        message: 'Post ID and User ID are required'
                    });
                }

                try {
                    // Validate that post exists
                    try {
                        const postObjectId = new ObjectId(postId);
                        const post = await db.collection('posts').findOne({ _id: postObjectId });

                        if (!post) {
                            if (client) await client.close();
                            return res.status(404).json({
                                success: false,
                                message: 'Post not found'
                            });
                        }
                    } catch (invalidIdError) {
                        if (client) await client.close();
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid post ID format'
                        });
                    }

                    // Get user document
                    const userRef = firestore.collection('users').doc(uid);
                    const userDoc = await userRef.get();

                    if (!userDoc.exists) {
                        if (client) await client.close();
                        return res.status(404).json({
                            success: false,
                            message: 'User not found'
                        });
                    }

                    // Update bookmarks array
                    const userData = userDoc.data();
                    const bookmarks = userData.bookmarks || [];

                    // Check if already bookmarked
                    if (bookmarks.includes(postId)) {
                        if (client) await client.close();
                        return res.status(200).json({
                            success: true,
                            message: 'Post already bookmarked'
                        });
                    }

                    // Add new bookmark
                    await userRef.update({
                        bookmarks: [...bookmarks, postId]
                    });

                    if (client) await client.close();
                    return res.status(200).json({
                        success: true,
                        message: 'Post bookmarked successfully'
                    });
                } catch (bookmarkError) {
                    console.error('Bookmark Operation Error:', bookmarkError);
                    if (client) await client.close();
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to bookmark post',
                        error: bookmarkError.toString()
                    });
                }
            }
            // Handle other methods
            else {
                if (client) await client.close();
                return res.status(405).json({
                    success: false,
                    message: 'Method not allowed'
                });
            }
        } catch (mongoError) {
            console.error('MongoDB Connection Error:', mongoError);
            if (client) await client.close();
            return res.status(500).json({
                success: false,
                message: 'Database connection failed',
                error: mongoError.toString()
            });
        }
    } catch (globalError) {
        console.error('Global Bookmarks API Error:', globalError);
        if (client) await client.close();
        return res.status(500).json({
            success: false,
            message: 'Unexpected server error',
            error: globalError.toString()
        });
    }
}