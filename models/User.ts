import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    uid: string;
    userType: 'Reader' | 'Writer';
    username?: string;
    phoneNumber?: string;
    email?: string;
    tags: string[];
    domain?: string;
    posts: Array<{ id: string; title: string }>;
    bookmarks: string[];
    comments: string[];
    profilePicFileId?: string;
}

export interface IUserDocument extends IUser, Document {
    profilePicUrl: string;
}

const UserSchema: Schema = new Schema({
    uid: { type: String, required: true, unique: true },
    userType: { type: String, enum: ['Reader', 'Writer'], required: true },
    username: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    tags: { type: [String], default: [] },
    domain: { type: String },
    posts: { type: [{ id: String, title: String }], default: [] },
    bookmarks: { type: [String], default: [] },
    comments: {
        type: [{
            id: { type: String, required: true },
            text: { type: String, required: true }
        }],
        default: []
    },
    profilePicFileId: { type: String }
}, {
    // Important: Enable virtuals in toObject and toJSON
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

UserSchema.virtual('profilePicUrl').get(function () {
    if (this.profilePicFileId) {
        return `/api/files/${this.profilePicFileId}`;
    }
    return '';
});

const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export default User;