// app/api/bookmarks/remove/route.ts

import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { initAdmin } from '../../../lib/firebaseAdmin';

export async function POST(request: NextRequest) {
    try {
        // Extract request body
        const { postId, uid } = await request.json();

        // Validate required fields
        if (!postId || !uid) {
            return NextResponse.json(
                { success: false, message: 'Post ID and User ID are required' },
                { status: 400 }
            );
        }

        // Initialize Firebase if needed
        if (admin.apps.length === 0) {
            try {
                initAdmin();
                console.log('✅ Firebase Admin successfully initialized');
            } catch (initError) {
                console.error('Firebase Admin Initialization Failed:', initError);
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Firebase initialization error',
                        error: initError instanceof Error ? initError.message : String(initError)
                    },
                    { status: 500 }
                );
            }
        }

        // Get Firestore instance
        const firestore = admin.firestore();
        const userRef = firestore.collection('users').doc(uid);

        // Get user document
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Get current bookmarks
        const userData = userDoc.data() || {};
        const bookmarks = userData.bookmarks || [];

        // Check if bookmark exists
        if (!bookmarks.includes(postId)) {
            return NextResponse.json(
                { success: false, message: 'Bookmark not found' },
                { status: 404 }
            );
        }

        // Remove bookmark
        const updatedBookmarks = bookmarks.filter((id: string) => id !== postId);

        // Update Firestore
        await userRef.update({
            bookmarks: updatedBookmarks
        });

        return NextResponse.json(
            { success: true, message: 'Bookmark removed successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error removing bookmark:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to remove bookmark',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}