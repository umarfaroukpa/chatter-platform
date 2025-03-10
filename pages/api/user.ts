import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import User, { IUserDocument } from '../../models/User';
import { findOne } from '../../lib/mongoose-utils';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { uid } = req.body;

  if (!uid || typeof uid !== 'string') {
    return res.status(400).json({ success: false, error: 'Valid UID is required' });
  }

  try {
    await connectToDatabase();

    // Use the utility function instead of direct mongoose method
    const user = await findOne<IUserDocument>(User, { uid });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const userData = user.toObject({ virtuals: true });
    console.log('Fetched user from MongoDB:', userData);

    const profilePicUrl = user.profilePicFileId
      ? `/api/files/${user.profilePicFileId}`
      : '';

    res.status(200).json({
      success: true,
      data: { ...userData, profilePicUrl: user.profilePicUrl || '' }
    });
  } catch (error: any) {
    console.error('Error fetching user:', error.message || error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to database or fetch user'
    });
  }
}