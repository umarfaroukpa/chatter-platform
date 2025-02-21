import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    text: string;
    author: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
}

const CommentSchema: Schema = new Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
