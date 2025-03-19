import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import User, { IUserDocument } from '../../../models/User';
import { findOne } from '../../../lib/mongoose-utils';

interface ApiResponse {
  success: boolean;
  data?: UserResponseData;
  error?: string;
}

interface UserResponseData {
  uid: string;
  username?: string;
  email?: string;
  profilePicUrl?: string;
  profilePicFileId?: string;
  [key: string]: string | undefined;
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { uid } = await request.json();

    if (!uid || typeof uid !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid UID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await findOne<IUserDocument>(User, { uid });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = user.toObject({ virtuals: true });
    console.log('Fetched user from MongoDB:', userData);

    const profileUrl = user.profilePicFileId
      ? `/api/files/${user.profilePicFileId}`
      : user.profilePicUrl || '';

    return NextResponse.json({
      success: true,
      data: { ...userData, profilePicUrl: profileUrl }
    });
  } catch (error: unknown) {
    console.error('Error fetching user:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to database or fetch user' },
      { status: 500 }
    );
  }
}