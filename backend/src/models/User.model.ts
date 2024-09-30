import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  profileImageUrl: string | undefined;
  role: "TEACHER" | "STUDENT";
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: string;
  emailVerificationStatus?: boolean;
  passwordResetOTP?: string;
  passwordResetOTPExpires?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName : { type: String, required: [true, "Firstname is required"] },
  lastName: { type: String, required: [true, "LastName is required"] },
  userName: { type: String, required: [true, "Username is required"] },
  password: { type: String, required: [true, "Password is required"] },
  email: { type: String, required: [true, "Email is required"] },
  profileImageUrl: {type : String || undefined},
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
