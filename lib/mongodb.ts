import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found!');
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as { mongoose?: { conn: Mongoose | null; promise: Promise<Mongoose> | null } }).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Mongoose> {
    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
            console.log('Connected to MongoDB');
            return mongooseInstance;
        }).catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;
