import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found!');
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

//  I use module-level variables instead of namespace
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// this is define in global scope 
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