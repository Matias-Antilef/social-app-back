import { Document, Schema } from 'mongoose';

export enum ERole {
  vendedor = 'vendedor',
  admin = 'admin',
}
export interface IUser extends Document {
  username: string;
  email: string;
  role: ERole;
  password: string;
}

export const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ERole,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
