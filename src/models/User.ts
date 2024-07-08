import mongoose, { Document, Schema, model, Types } from 'mongoose';

interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  profile_image?: string;
  isVerified: boolean;
  verificationToken: string;
  verificationExpires: Date;
  posts: Types.ObjectId[];
  resetPasswordToken: string;
  resetPasswordExpires: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    profile_image: {
      type: String,
      default:
        'data:image/jpeg;base64,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',
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    resetPasswordToken: { type: String, default: '' },
    resetPasswordExpires: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

const User = model('User', UserSchema);

export { User, IUser };
