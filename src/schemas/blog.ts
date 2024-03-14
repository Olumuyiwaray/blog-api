import mongoose, { Document, Schema, model } from "mongoose";


 interface Blog extends Document {
     id: string;
     title: string;
     snippet: string;
     body: string;
     author: mongoose.Types.ObjectId
  }

const BlogSchema = new Schema<Blog>({
    title: { type: String, required: true },
    snippet: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Writer' }

}, { timestamps: true });

const BlogModel = model('Blog', BlogSchema);

export { BlogModel, Blog };