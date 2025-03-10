import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    postId: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    authorProfilePic?: string;
    tags: string[];
    likes: string[];
    comments: {
        userId: string;
        username: string;
        text: string;
        createdAt: string;
    }[];
    createdAt: string;
    updatedAt?: string;
}

const PostSchema: Schema<IPost> = new Schema({
    postId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorId: { type: String, required: true },
    authorProfilePic: { type: String, default: '' },
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
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
});

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;