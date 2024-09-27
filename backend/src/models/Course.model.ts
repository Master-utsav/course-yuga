import mongoose, { Document } from "mongoose";

export interface ICourse extends Document {
    slug: string;
    courseName: string;
    courseOwner: mongoose.Types.ObjectId;
    price: string;
    dummyPrice: string;
    description: string;
    imageUrl: string;
}

const courseSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    courseOwner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },  
    price: { type: String, required: true },
    dummyPrice: { type: String, required: false },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;
