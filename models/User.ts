// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IPost } from './Post';
import { IComment } from './Comment';

export interface IUser extends Document {
    uid: string;
    userType: "reader" | "writer";
    username?: string;
    phoneNumber?: string;
    email?: string;
    profilePicUrl?: string;
    tags: string[];
    domain?: string;
    posts: IPost[];
    bookmarks: IPost[];
    comments: IComment[];
    // For GridFS
    profilePicFileId?: string;
}

const UserSchema: Schema = new Schema({
    uid: { type: String, required: true },
    userType: { type: String, required: true },
    username: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    profilePicUrl: { type: String },
    tags: { type: [String], required: true },
    domain: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    // For GridFS
    profilePicFileId: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);