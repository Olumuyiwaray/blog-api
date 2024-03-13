import mongoose, { Document, Schema, model } from "mongoose";


 interface Writer extends Document {
     id: string;
     username: string;
     name: string;
     posts: string[];
  }

const WriterSchema = new Schema<Writer>({
    username: { type: String, required: true },
    name: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]

}, { timestamps: true });

const WriterModel = model('Writer', WriterSchema);

export { WriterModel };