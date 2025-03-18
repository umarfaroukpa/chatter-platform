import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Subdomain from '../../../models/Subdomain';
import { findOne } from '../../../lib/mongoose-utils';
import { Document } from 'mongoose';

interface ISubdomain extends Document {
    subdomain: string;
    userId?: string;
    createdAt?: Date;
}

interface Data {
    available: boolean;
    message: string;
}

export async function POST(request: Request) {
    try {
        const { subdomain, userId, reserve } = await request.json();

        if (!subdomain || subdomain.length < 3) {
            return NextResponse.json(
                { available: false, message: 'Subdomain must be at least 3 characters long.' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingSubdomain = await findOne<ISubdomain>(Subdomain, { subdomain });

        if (existingSubdomain) {
            return NextResponse.json(
                { available: false, message: 'This subdomain is already taken.' },
                { status: 200 }
            );
        }

        if (reserve === true && userId) {
            const newSubdomain = new Subdomain({
                subdomain,
                userId,
                createdAt: new Date(),
            });

            await newSubdomain.save();
            return NextResponse.json(
                { available: true, message: 'Subdomain reserved successfully!' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { available: true, message: 'This subdomain is available!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error occurred while checking subdomain:', error);
        return NextResponse.json(
            { available: false, message: 'An error occurred while checking availability.' },
            { status: 500 }
        );
    }
}