import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDocument extends Document {
    _id: string;
    username?: string;
    userType?: string;
    profilePicUrl?: string;
    posts?: { id: string; title: string }[];
    comments?: { id: string; text: string }[];

}

const UserSchema: Schema<IUserDocument> = new Schema({
    _id: { type: String, required: true },
    username: { type: String },
    userType: { type: String, default: 'Reader' },
    profilePicUrl: { type: String },
    posts: [{
        id: { type: String, required: true },
        title: { type: String, required: true }
    }],
    comments: [{
        id: { type: String, required: true },
        text: { type: String, required: true }
    }],

});

export default mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);