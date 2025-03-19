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
      try {
        // Create a new user with a hardcoded userType - use one of the valid values from your schema
        const newUser = new User({
          uid,
          username: 'New User',
          userType: 'user', // Try using 'user' instead of 'standard'
          email: '',
          phoneNumber: '',
          tags: [], // Add required array fields
          posts: [],
          bookmarks: [],
          comments: []
        });

        await newUser.save();
        return NextResponse.json({
          success: true,
          data: newUser.toObject({ virtuals: true })
        });
      } catch (createError) {
        console.error('Error creating user:', createError instanceof Error ? createError.message : createError);

        // If the error contains information about valid enum values, log it
        if (createError instanceof Error && createError.message.includes('userType')) {
          console.log('Validation error with userType. Try using one of the valid enum values from your schema.');
        }

        throw createError; // Re-throw to be caught by the outer catch
      }
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
      { success: false, error: error instanceof Error ? error.message : 'Failed to connect to database or fetch user' },
      { status: 500 }
    );
  }
}