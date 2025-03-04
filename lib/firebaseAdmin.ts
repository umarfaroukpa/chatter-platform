// lib/firebaseAdmin.js
import admin from 'firebase-admin';

// Using singleton pattern to prevent multiple initializations
export const initAdmin = () => {
    if (!admin.apps.length) {
        try {
            // If using environment variables (recommended)
            const credential = {
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Replace escaped newlines
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            };

            admin.initializeApp({
                credential: admin.credential.cert(credential),
                databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
            });

            console.log("Firebase Admin initialized");
        } catch (error) {
            console.error('Firebase admin initialization error', error.stack);
        }
    }

    return admin;
};

export default initAdmin;