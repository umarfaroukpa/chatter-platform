import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/lib/credential';

export const initAdmin = () => {
    if (admin.apps.length) {
        return admin;
    }

    try {
        const credentials: ServiceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID!.replace(/["',]/g, '').trim(),
            privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n').trim(),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL!.replace(/["',]/g, '').trim()
        };

        // Comprehensive credential validation
        if (!credentials.privateKey) {
            throw new Error('Firebase private key is missing');
        }
        if (!credentials.clientEmail) {
            throw new Error('Firebase client email is missing');
        }
        if (!credentials.projectId) {
            throw new Error('Firebase project ID is missing');
        }

        console.log('Credentials:', {
            projectId: credentials.projectId,
            clientEmail: credentials.clientEmail,
            privateKeyLength: credentials.privateKey.length
        });

        admin.initializeApp({
            credential: admin.credential.cert(credentials),
        });

        console.log("✅ Firebase Admin successfully initialized");
        return admin;
    } catch (error) {
        console.error('🚨 Firebase Admin Initialization Error:', error);
        console.error('Detailed Error:', JSON.stringify(error, null, 2));
        throw error;
    }
};

export default initAdmin;