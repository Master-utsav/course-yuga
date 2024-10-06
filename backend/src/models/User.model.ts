import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  profileImageUrl: string | undefined;
  role: "TEACHER" | "STUDENT";
  userDob?: string;
  bio?: string;
  address?: string;
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: string;
  emailVerificationStatus?: boolean;
  emailSendTime?: string;
  passwordResetOTP?: string;
  passwordResetOTPExpires?: string;
  passwordSendTime?: string;
  phoneNumber?: string;
  phoneNumberVerificationStatus?: boolean;

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
  emailSendTime: { type: String },
  passwordResetOTP: { type: String },
  passwordResetOTPExpires: { type: String },
  passwordSendTime: { type: String },
  phoneNumber: {type: String },
  phoneNumberVerificationStatus: {type :Boolean , default: false},
  userDob: { type: String },
  bio: { type: String, default: "Hey, I am using LMS" , max: [500, "bio must be within the 500 chars" ]},
  address: { type: String },
}, 
{ 
  timestamps: true 
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
