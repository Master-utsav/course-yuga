import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  userName: string;
  password: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: string;
  emailVerificationStatus?: boolean;
  passwordResetOTP?: string;
  passwordResetOTPExpires?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName : { type: String, required: [true, "Firstname is required"] },
  userName: { type: String, required: [true, "Username is required"] },
  password: { type: String, required: [true, "Password is required"] },
  email: { type: String, required: [true, "Email is required"] },
  role: { type: String, enum: ["TEACHER" , "STUDENT"], required: true },
  emailVerificationOTP: { type: String },
  emailVerificationOTPExpires: { type: String },
  emailVerificationStatus: { type: Boolean, default: false },
  passwordResetOTP: { type: String },
  passwordResetOTPExpires: { type: String },
}, 
{ 
  timestamps: true 
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
