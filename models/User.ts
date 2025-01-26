// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    uid: string;
    userType: "reader" | "writer";
    tags: string[];
    domain?: string;
}

const UserSchema: Schema = new Schema({
    uid: { type: String, required: true },
    userType: { type: String, required: true },
    tags: { type: [String], required: true },
    domain: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
