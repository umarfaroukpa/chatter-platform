import mongoose, { Schema, Document, model } from 'mongoose';
import { IPost } from './Post'
import { IComment } from './Comment'

interface IUser extends Document {
    uid: string;
    userType: "reader" | "writer";
    tags: string[];
    domain?: string;
    posts: IPost[];  // Array of posts by the user
    bookmarks: IPost[];  // Array of bookmarked posts
    comments: IComment[]; // Array of comments made by the user
}

const UserSchema: Schema = new Schema({
    uid: { type: String, required: true },
    userType: { type: String, required: true },
    tags: { type: [String], required: true },
    domain: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Link to Post model
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);


