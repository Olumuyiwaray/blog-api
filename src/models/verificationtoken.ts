import mongoose, { Document, Schema, model } from 'mongoose';

interface IVerificationToken extends Document {
  token: string;
  user_id: string;
  expires_at: Date;
  is_confirmed: Boolean;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    token: { type: String, required: true },
    user_id: { type: String, required: true },
    expires_at: { type: Date, required: true },
    is_confirmed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const VerificationToken = model('Verficationcode', VerificationTokenSchema);

export default VerificationToken;
