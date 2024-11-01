import mongoose, { Document, Schema, model } from 'mongoose';

interface IRole extends Document {
  name: string;
  is_active: boolean;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    is_active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const Role = model('Role', roleSchema);

export default Role;
