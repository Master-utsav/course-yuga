import { Response } from "express";
import User from "../../models/User.model";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import VideoModel from "../../models/Video.model";
import CourseModel from "../../models/Course.model";

export async function handleGetUserDataFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const data = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id,
      email: user.email,
      emailVerificationStatus: user.emailVerificationStatus,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
      phoneNumberVerificationStatus: user.phoneNumberVerificationStatus,
      role: user.role,
      bio: user.bio,
      userDob: user.userDob,
      address: user.address,
      enrolledIn: user.enrolledIn,
      bookmarks: user.bookmarks,
      progress : user.progress,   
  };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleGetUsersBookmarkedVideo(req: AuthenticatedRequest , res: Response) {
   const userId = req.userId;

   if(!userId){
    return res.status(401).json({success: false , message: "Unauthorized"})
   }

   const {videoIds} = req.body;
 
   if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return res.status(400).json({ success: false, message: 'VideoIds are required' });
  }

  try {

    const videos = await VideoModel.find({
      _id: { $in: videoIds },
    });

    if (!videos || videos.length === 0) {
      return res.status(404).json({success: false, message: 'No videos found for the provided IDs'});
    }

    return res.status(200).json({ success: true, videos });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({success: false, message: 'An error occurred while fetching videos'});
  }
}
export async function handleGetUsersBookmarkedCourses(req: AuthenticatedRequest , res: Response) {
   const userId = req.userId;

   if(!userId){
    return res.status(401).json({success: false , message: "Unauthorized"})
   }

   const {courseIds} = req.body;
 
   if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return res.status(400).json({ success: false, message: 'CourseIds are required' });
  }

  try {

    const courses = await CourseModel.find({
      _id: { $in: courseIds },
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({success: false, message: 'No courses found for the provided IDs'});
    }

    return res.status(200).json({ success: true, courses });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({success: false, message: 'An error occurred while fetching courses'});
  }
}

// export async function handleGetUsersBookmarkedTest(req: AuthenticatedRequest , res: Response) {
//    const userId = req.userId;

//    if(!userId){
//     return res.status(401).json({success: false , message: "Unauthorized"})
//    }

//    const {testIds} = req.body;
 
//    if (!Array.isArray(testIds) || testIds.length === 0) {
//     return res.status(400).json({ success: false, message: 'VideoIds are required' });
//   }

//   try {

//     const tests = await TestModel.find({
//       _id: { $in: testIds },
//     });

//     if (!tests || tests.length === 0) {
//       return res.status(404).json({success: false, message: 'No tests found for the provided IDs'});
//     }

//     return res.status(200).json({ success: true, tests });

//   } catch (error) {
//     console.error('Error fetching tests:', error);
//     return res.status(500).json({success: false, message: 'An error occurred while fetching tests'});
//   }
// }




