import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import User, { IUserDocument } from '../../models/User';
import { findOneAndUpdate } from '../../lib/mongoose-utils';

interface ProfileResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProfileResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    await connectToDatabase();
    const { uid, profileData } = req.body;

    if (!uid || !profileData) {
        return res.status(400).json({ success: false, error: 'UID and profile data are required' });
    }

    try {
        // Create an update object only with the fields that are provided
        const updateFields: any = {};

        // Only set fields that are explicitly provided in profileData
        if (profileData.username !== undefined) updateFields.username = profileData.username;
        if (profileData.phoneNumber !== undefined) updateFields.phoneNumber = profileData.phoneNumber;
        if (profileData.email !== undefined) updateFields.email = profileData.email;
        if (profileData.profilePicUrl !== undefined) updateFields.profilePicUrl = profileData.profilePicUrl;
        if (profileData.userType !== undefined) updateFields.userType = profileData.userType;
        if (profileData.tags !== undefined) updateFields.tags = profileData.tags;
        if (profileData.domain !== undefined) updateFields.domain = profileData.domain;
        if (profileData.profilePicFileId !== undefined) updateFields.profilePicFileId = profileData.profilePicFileId;

        // Using your utility function with only the fields that need to be updated
        const updatedUser = await findOneAndUpdate<IUserDocument>(
            User,
            { uid },
            { $set: updateFields },
            { upsert: true, new: true }
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