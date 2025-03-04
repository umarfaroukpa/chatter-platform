import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    author: string;
    authorId: string;
    tags: string[];
    likes: string[];
    comments: {
        userId: string;
        username: string;
        text: string;
        createdAt: string;
    }[];
    createdAt: string;
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: String, required: true },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] },
    comments: {
        type: [{
            userId: String,
            username: String,
            text: String,
            createdAt: { type: String, default: () => new Date().toISOString() }
        }],
        default: []
    },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);