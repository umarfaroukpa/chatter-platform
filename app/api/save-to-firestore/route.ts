// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { initAdmin } from '../../../lib/firebaseAdmin';

export async function POST(request: NextRequest) {
    try {
        // Get the request body
        const { uid, userData } = await request.json();

        // Validate input
        if (!uid || !userData) {
            return NextResponse.json(
                { success: false, message: 'UID and userData are required' },
                { status: 400 }
            );
        }

        // Initialize Firebase Admin if not already initialized
        if (admin.apps.length === 0) {
            initAdmin();
        }

        // Save to Firestore
        const firestore = admin.firestore();
        await firestore.collection('users').doc(uid).set(userData, { merge: true });

        return NextResponse.json(
            { success: true, message: 'User saved to Firestore' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Firestore save error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to save to Firestore',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}