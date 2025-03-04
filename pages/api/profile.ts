// pages/api/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    await connectToDatabase();
    const { uid, profileData } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { uid },
            {
                $set: {
                    username: profileData.username || '',
                    phoneNumber: profileData.phoneNumber || '',
                    email: profileData.email || '',
                    profilePicUrl: profileData.profilePicUrl || '', // Update profilePicUrl here
                    userType: profileData.userType || 'unknown',
                    tags: profileData.tags || [],
                }
            },
            { new: true, upsert: true }
        );
        if (!updatedUser) {
            return res.status(500).json({ success: false, error: 'Failed to update user' });
        }
        res.status(200).json({ success: true, data: updatedUser.toObject() });
    } catch (error: any) {
        console.error('Error updating profile:', error);
        res.status(400).json({ success: false, error: error.message });
    }
}
