import mongoose, { Schema, Types, Document, model } from "mongoose";

export enum VideoType {
  PERSONAL = "PERSONAL",
  YOUTUBE = "YOUTUBE",
}

export interface IVideoTimeStamps {
  time: number; 
  text: string; 
}

export interface IVideo extends Document {
  videoName: string;
  tutorName: string;
  videoType: VideoType;
  courseId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  thumbnail: string;
  videoUrl: string;
  description?: string;
  watchedBy?: Types.ObjectId[]; 
  watchCount?: number; 
  videoTimeStamps?: IVideoTimeStamps[]; 
  isVerified: boolean;
}

// Define the Video schema
const videoSchema = new Schema<IVideo>(
  {
    videoName: { type: String, required: true, trim: true },
    tutorName: { type: String, required: true, trim: true },
    videoType: {
      type: String,
      enum: Object.values(VideoType),
      required: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, trim: true },
    watchedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], 
    videoTimeStamps: [
      {
        time: { type: Number, required: true }, 
        text: { type: String, required: true, trim: true }, 
      },
    ],
    isVerified: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

videoSchema.virtual("watchCount").get(function (this: IVideo) {
  return this.watchedBy?.length ?? 0;
});

const VideoModel = mongoose.models.Video || model<IVideo>("Video", videoSchema);

export default VideoModel;
