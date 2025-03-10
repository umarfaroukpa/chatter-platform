// pages/api/save-to-firestore.js
import admin from 'firebase-admin';
import { initAdmin } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { uid, userData } = req.body;

    if (!uid || !userData) {
        return res.status(400).json({ success: false, message: 'UID and userData are required' });
    }

    try {
        if (admin.apps.length === 0) {
            initAdmin();
        }
        const firestore = admin.firestore();
        await firestore.collection('users').doc(uid).set(userData, { merge: true });
        return res.status(200).json({ success: true, message: 'User saved to Firestore' });
    } catch (error) {
        console.error('Firestore save error:', error);
        return res.status(500).json({ success: false, message: 'Failed to save to Firestore', error: error.message });
    }
}