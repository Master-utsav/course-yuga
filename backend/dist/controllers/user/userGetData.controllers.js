"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetUserDataFunction = handleGetUserDataFunction;
exports.handleGetUsersBookmarkedVideo = handleGetUsersBookmarkedVideo;
exports.handleGetUsersBookmarkedCourses = handleGetUsersBookmarkedCourses;
const User_model_1 = __importDefault(require("../../models/User.model"));
const Video_model_1 = __importDefault(require("../../models/Video.model"));
const Course_model_1 = __importDefault(require("../../models/Course.model"));
async function handleGetUserDataFunction(req, res) {
    try {
        const userId = req.userId;
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const data = {
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            uniqueId: user.uniqueId,
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
            progress: user.progress,
        };
        return res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}
async function handleGetUsersBookmarkedVideo(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { videoIds } = req.body;
    if (!Array.isArray(videoIds) || videoIds.length === 0) {
        return res.status(400).json({ success: false, message: 'VideoIds are required' });
    }
    try {
        const videos = await Video_model_1.default.find({ videoId: { $in: videoIds } })
            .lean()
            .exec();
        if (!videos || videos.length === 0) {
            return res.status(404).json({ success: false, message: 'No videos found for the provided IDs' });
        }
        const filteredVideos = videos.map((video) => ({
            videoName: video.videoName,
            tutorName: video.tutorName,
            videoType: video.videoType,
            courseId: video.courseId,
            videoId: video.videoId,
            uploadedBy: video.uploadedBy,
            thumbnail: video.thumbnail,
            videoUrl: video.videoUrl,
            description: video.description ?? '',
            watchedBy: video.watchedBy ?? [],
            watchCount: video.watchCount ?? 0,
            videoTimeStamps: video.videoTimeStamps ?? [],
            isVerified: video.isVerified,
            markdownContent: video.markdownContent ?? '',
            pub_id: video.pub_id ?? '',
        }));
        return res.status(200).json({ success: true, videos: filteredVideos });
    }
    catch (error) {
        console.error('Error fetching videos:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching videos' });
    }
}
async function handleGetUsersBookmarkedCourses(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { courseIds } = req.body;
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
        return res.status(400).json({ success: false, message: 'CourseIds are required' });
    }
    try {
        const courses = await Course_model_1.default.find({ courseId: { $in: courseIds } })
            .lean() // Convert to plain objects
            .exec();
        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: 'No courses found for the provided IDs' });
        }
        const filteredCourses = courses.map((course) => ({
            courseName: course.courseName,
            courseId: course.courseId,
            tutorName: course.tutorName,
            courseType: course.courseType,
            description: course.description,
            currency: course.currency,
            sellingPrice: course.sellingPrice,
            originalPrice: course.originalPrice,
            thumbnail: course.thumbnail,
            isVerified: course.isVerified,
            uploadedBy: course.uploadedBy,
            ratings: course.ratings ?? [],
            likedBy: course.likedBy ?? [],
            enrolledBy: course.enrolledBy ?? [],
            ratingCount: course.ratingCount,
            rating: course.rating,
            likedCount: course.likedCount,
            enrolledCount: course.enrolledCount,
            markdownContent: course.markdownContent ?? '',
            redirectLink: course.redirectLink ?? '',
            videos: course.videos ?? [],
        }));
        return res.status(200).json({ success: true, courses: filteredCourses });
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching courses' });
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