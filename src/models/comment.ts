import mongoose, { Document, Schema, model } from 'mongoose';

interface IComment extends Document {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = model('Comment', commentSchema);

export { Comment, IComment };
