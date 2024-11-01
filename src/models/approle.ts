import mongoose, { Document, Schema, model } from 'mongoose';

interface IAppRole extends Document {
  user_id: Schema.Types.ObjectId;
  role_id: Schema.Types.ObjectId;
  is_active: boolean;
  created_by: Schema.Types.ObjectId;
  modified_by: Schema.Types.ObjectId;
}

const appRoleSchema = new Schema<IAppRole>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    is_active: { type: Boolean, required: true, default: false },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modified_by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const AppRole = model('Approle', appRoleSchema);

export default AppRole;
