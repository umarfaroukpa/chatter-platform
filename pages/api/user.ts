// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import User, { IUser } from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { uid } = req.body;

  try {
    await connectToDatabase(); // Ensure connection succeeds
    const user = await User.findOne({ uid }).exec() as IUser | null;
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const userData = user.toObject();
    console.log('Fetched user from MongoDB:', userData);
    res.status(200).json({ success: true, data: { ...userData, profilePicUrl: user.profilePicUrl || '' } });
  } catch (error: any) {
    console.error('Error fetching user:', error.message || error);
    res.status(500).json({ success: false, error: 'Failed to connect to database or fetch user' });
  }
}