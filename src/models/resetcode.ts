import mongoose, { Document, Schema, model } from 'mongoose';

interface IResetCode extends Document {
  code: string;
  user_id: string;
  expires_at: Date;
  is_used: Boolean;
}

const ResetCodeSchema = new Schema<IResetCode>(
  {
    code: { type: String, required: true },
    user_id: { type: String, required: true },
    expires_at: { type: Date, required: true },
    is_used: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const ResetCode = model('Resetcode', ResetCodeSchema);

export default ResetCode;
