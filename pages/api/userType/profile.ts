import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await connectToDatabase();

    switch (method) {
        case 'POST':
            try {
                const { uid, profileData } = req.body;
                const updatedUser = await User.findOneAndUpdate(
                    { uid },
                    { $set: { ...profileData } },
                    { new: true, upsert: true }
                );
                res.status(200).json({ success: true, data: updatedUser });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
