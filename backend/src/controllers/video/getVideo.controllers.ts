import { Response , Request } from "express";
import VideoModel from "../../models/Video.model";

export async function handleGetAllVideosOfCourse(req: Request , res : Response){

    const {courseId} = req.query;
    
    if(!courseId){
        return res.status(400).json({success : false , message: "Course ID is required"});
    }

    try {
        const videos = await VideoModel.find({courseId});
        if(!videos){
            return res.status(404).json({success : false , message: "No videos found for given course"});
        }
    
        return res.status(200).json({success: true , message: "All videos of the given course" , videos});
    } catch (error) {
        return res.status(500).json({success: false , message: "Internal server error"});   
    }

}