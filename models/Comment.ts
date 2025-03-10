import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    userId: string;
    username: string;
    text: string;
    createdAt: string;
}

const CommentSchema: Schema<IComment> = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;