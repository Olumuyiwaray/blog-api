import mongoose, { Document, Schema, model, Types } from 'mongoose';

interface User extends Document {
  username: string;
  name: string;
  password: string;
  salt: string;
  posts: Types.ObjectId[];
}

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
  },
  { timestamps: true }
);

const UserModel = model('User', UserSchema);

export { UserModel, User };
