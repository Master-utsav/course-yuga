import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  uniqueId: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  profileImageUrl: string | undefined;
  role: "ADMIN" | "STUDENT" | "MASTER";
  userDob?: string;
  bio?: string;
  address?: {
    country: string;
    state: string;
    city: string;
  };
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: string;
  emailVerificationStatus?: boolean;
  emailSendTime?: string;
  passwordResetOTP?: string;
  passwordResetOTPExpires?: string;
  passwordSendTime?: string;
  phoneNumber?: {
    code: string;   
    number: string; 
  };
  phoneNumberVerificationStatus?: boolean;
  uploadedCourses?: string[];
  enrolledIn?: string[];
  bookmarks?: {
    course?: string[];
    video?: string[];
    test?: string[];
  }
  progress: {
    courseId: string;
    completedVideos?: string[];
    count?: number;
  }[];
  history?:{
    video: string;
    time: string;
  }
}

const userSchema = new mongoose.Schema<IUser>({
  uniqueId : { type: String, required: true, unique: true },
  firstName : { type: String, required: [true, "Firstname is required"] },
  lastName: { type: String, required: [true, "LastName is required"] },
  userName: { type: String, required: [true, "Username is required"] },
  password: { type: String, required: [true, "Password is required"] },
  email: { type: String, required: [true, "Email is required"] },
  profileImageUrl: {type : String || undefined},
  role: { type: String, enum: ["ADMIN" , "STUDENT" , "MASTER"], required: true },
  emailVerificationOTP: { type: String },
  emailVerificationOTPExpires: { type: String },
  emailVerificationStatus: { type: Boolean, default: false },
  emailSendTime: { type: String },
  passwordResetOTP: { type: String },
  passwordResetOTPExpires: { type: String },
  passwordSendTime: { type: String },
  phoneNumber: {
    code: { type: String}, 
    number: { type: String}
  },
  phoneNumberVerificationStatus: {type :Boolean , default: false},
  userDob: { type: String },
  bio: { type: String, default: "Hey, I am using LMS" , max: [500, "bio must be within the 500 chars" ]},
  address: { 
    country : {type: String },
    city : {type: String },
    state : {type: String }
  },
  uploadedCourses: [{ type: String, ref: "Course" }],
  enrolledIn: [{ type: String, ref: "Course" }],
  bookmarks: {
    course: [{type: String, ref: "Course"}],
    video: [{type: String, ref: "Video"}],
    test: [{type: String, ref: "Test"}],
  },
  progress: [
    {
      courseId: { type: String, ref: 'Course' },
      completedVideos: [{ type: String, ref: 'Video' }],
      count:  { type: Number }
    },
  ],
  history: [
    {
      video: { type: String, ref: 'Video' },
      time: { type: String }
    }
  ]
}, 
{ 
  timestamps: true 
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
