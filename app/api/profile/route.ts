import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import User, { IUserDocument } from '../../../models/User';
import { findOneAndUpdate } from '../../../lib/mongoose-utils';

interface ProfileData {
    username?: string;
    phoneNumber?: string;
    email?: string;
    profilePicUrl?: string;
    userType?: string;
    tags?: string[];
    domain?: string;
    profilePicFileId?: string;
}

export async function POST(request: Request) {
    await connectToDatabase();
    const { uid, profileData }: { uid: string; profileData: ProfileData } = await request.json();

    if (!uid || !profileData) {
        return NextResponse.json(
            { success: false, error: 'UID and profile data are required' },
            { status: 400 }
        );
    }

    try {
        const updateFields: Partial<ProfileData> = {};

        if (profileData.username !== undefined) updateFields.username = profileData.username;
        if (profileData.phoneNumber !== undefined) updateFields.phoneNumber = profileData.phoneNumber;
        if (profileData.email !== undefined) updateFields.email = profileData.email;
        if (profileData.profilePicUrl !== undefined) updateFields.profilePicUrl = profileData.profilePicUrl;
        if (profileData.userType !== undefined) updateFields.userType = profileData.userType;
        if (profileData.tags !== undefined) updateFields.tags = profileData.tags;
        if (profileData.domain !== undefined) updateFields.domain = profileData.domain;
        if (profileData.profilePicFileId !== undefined) updateFields.profilePicFileId = profileData.profilePicFileId;

        const updatedUser = await findOneAndUpdate<IUserDocument>(
            User,
            { uid },
            { $set: updateFields },
            { upsert: true, new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, error: 'Failed to update user' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
    } catch (error) {
        const typedError = error as Error;
        console.error('Error updating profile:', typedError);
        return NextResponse.json(
            { success: false, error: typedError.message },
            { status: 400 }
        );
    }
}