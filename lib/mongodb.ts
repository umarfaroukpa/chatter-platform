import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found!');
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Define in global scope
const globalMongoose = global as unknown as {
    mongoose: MongooseCache | undefined;
};

const cached: MongooseCache = globalMongoose.mongoose || {
    conn: null,
    promise: null
};

if (!globalMongoose.mongoose) {
    globalMongoose.mongoose = cached;
}

async function connectToDatabase(): Promise<Mongoose> {
    if (cached.conn) {
        console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const options = {
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            connectTimeoutMS: 30000, // Try connecting for 30 seconds
            retryWrites: true,
            retryReads: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
        };

        console.log('Connecting to MongoDB...');

        cached.promise = mongoose.connect(MONGODB_URI, options)
            .then((mongooseInstance) => {
                console.log('Connected to MongoDB successfully');
                return mongooseInstance;
            })
            .catch((error) => {
                console.error('Failed to connect to MongoDB:', error);

                // Try to provide more helpful error information
                if (error.code === 'ETIMEOUT') {
                    console.error('Connection timed out. This could be due to network issues, firewall settings, or incorrect hostname.');
                } else if (error.code === 'ENOTFOUND') {
                    console.error('Hostname not found. Please check your MongoDB URI for typos.');
                } else if (error.message && error.message.includes('Authentication failed')) {
                    console.error('Authentication failed. Please check your username and password in the connection string.');
                }

                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        // Reset promise so next call tries to connect again
        cached.promise = null;
        throw error;
    }
}

export default connectToDatabase;