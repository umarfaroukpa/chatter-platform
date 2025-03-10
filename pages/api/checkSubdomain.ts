import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import Subdomain from '../../models/Subdomain';
import { findOne } from '../../lib/mongoose-utils';
import { Document } from 'mongoose';

// Define the interface outside the handler to avoid conflicts
interface ISubdomain extends Document {
    subdomain: string;
    userId?: string; // Optional: to associate with user
    createdAt?: Date;
}

interface Data {
    available: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        const { subdomain, userId } = req.body;

        if (!subdomain || subdomain.length < 3) {
            return res.status(400).json({ available: false, message: 'Subdomain must be at least 3 characters long.' });
        }

        try {
            await connectToDatabase();

            // Use the utility function instead of direct mongoose method
            const existingSubdomain = await findOne<ISubdomain>(Subdomain, { subdomain });

            if (existingSubdomain) {
                return res.status(200).json({ available: false, message: 'This subdomain is already taken.' });
            }

            // If the subdomain is available and we have a userId, save it to the database
            if (req.body.reserve === true && userId) {
                const newSubdomain = new Subdomain({
                    subdomain,
                    userId,
                    createdAt: new Date()
                });

                await newSubdomain.save();
                return res.status(200).json({ available: true, message: 'Subdomain reserved successfully!' });
            }

            return res.status(200).json({ available: true, message: 'This subdomain is available!' });
        } catch (error) {
            console.error('Error occurred while checking subdomain:', error);
            return res.status(500).json({ available: false, message: 'An error occurred while checking availability.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}