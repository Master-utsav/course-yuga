"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFetchCourseByIdFunction = handleFetchCourseByIdFunction;
exports.handleFetchAllCoursesFunction = handleFetchAllCoursesFunction;
exports.handleFetchAllCoursesAsPerParams = handleFetchAllCoursesAsPerParams;
exports.handleGetCourseBySearchParams = handleGetCourseBySearchParams;
exports.handleGetCoursesByUserIdFunction = handleGetCoursesByUserIdFunction;
const Course_model_1 = __importDefault(require("../../models/Course.model"));
async function handleFetchCourseByIdFunction(req, res) {
    const { courseId } = req.body;
    if (!courseId) {
        return res.status(400).json({ success: false, message: "Missing 'courseId' parameter" });
    }
    try {
        let course = await Course_model_1.default.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        course = {
            courseName: course.courseName,
            courseId: course.courseId,
            tutorName: course.tutorName,
            courseType: course.courseType,
            description: course.description ?? '',
            currency: course.currency,
            sellingPrice: course.sellingPrice,
            originalPrice: course.originalPrice,
            thumbnail: course.thumbnail,
            isVerified: course.isVerified,
            uploadedBy: course.uploadedBy,
            ratings: course.ratings ?? [],
            ratingCount: course.ratings?.length ?? 0,
            likedBy: course.likedBy ?? [],
            likedCount: course.likedBy?.length ?? 0,
            markdownContent: course.markdownContent ?? '',
            redirectLink: course.redirectLink ?? '',
            enrolledBy: course.enrolledBy ?? [],
            enrolledCount: course.enrolledBy?.length ?? 0,
            videos: course.videos ?? []
        };
        return res.status(200).json({ success: true, course });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
async function handleFetchAllCoursesFunction(req, res) {
    try {
        const courses = await Course_model_1.default.find().select("tutorName courseId courseName description ratingCount rating thumbnail sellingPrice currency courseType originalPrice");
        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        const coursesData = courses.map((course) => ({
            tutorName: course.tutorName,
            courseId: course.courseId,
            courseName: course.courseName,
            description: course.description,
            ratingCount: course.ratingCount,
            rating: course.rating,
            thumbnail: course.thumbnail,
            currency: course.currency,
            sellingPrice: course.sellingPrice,
            courseType: course.courseType,
            originalPrice: course.originalPrice,
        }));
        return res.status(200).json({ success: true, data: coursesData });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
function buildSortQuery(order) {
    switch (order) {
        case "Latest":
            return { createdAt: -1 }; // Newest first
        case "Oldest":
            return { createdAt: 1 }; // Oldest first
        case "A to Z":
            return { courseName: 1 }; // Alphabetical order (ascending)
        case "Z to A":
            return { courseName: -1 }; // Alphabetical order (descending)
        default:
            return { createdAt: -1 }; // Default: Newest first
    }
}
async function handleFetchAllCoursesAsPerParams(req, res) {
    try {
        const { order, category } = req.query;
        const filter = category
            ? { courseType: { $regex: new RegExp(`^${category}$`, 'i') } }
            : {};
        const sort = buildSortQuery(order);
        const courses = await Course_model_1.default.find(filter).sort(sort).lean().exec();
        if (!courses || courses.length === 0) {
            return res.status(400).json({ success: false, message: "No Course found" });
        }
        const transformedCourses = courses.map((course) => ({
            courseName: course.courseName,
            courseId: course.courseId,
            tutorName: course.tutorName,
            courseType: course.courseType,
            description: course.description ?? "",
            currency: course.currency,
            sellingPrice: course.sellingPrice,
            originalPrice: course.originalPrice,
            thumbnail: course.thumbnail,
            isVerified: course.isVerified,
            uploadedBy: course.uploadedBy,
            ratings: course.ratings ?? [],
            ratingCount: course.ratings?.length ?? 0,
            likedBy: course.likedBy ?? [],
            likedCount: course.likedBy?.length ?? 0,
            markdownContent: course.markdownContent ?? "",
            redirectLink: course.redirectLink ?? "",
            enrolledBy: course.enrolledBy ?? [],
            enrolledCount: course.enrolledBy?.length ?? 0,
            videos: course.videos ?? [],
        }));
        return res.status(200).json({ success: true, data: transformedCourses });
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
async function handleGetCourseBySearchParams(req, res) {
    try {
        const { searchTerm } = req.query; // Get searchTerm from query parameters
        // Ensure searchTerm is defined and is a string
        if (typeof searchTerm !== 'string') {
            return res.status(400).json({ success: false, message: "Invalid search term" });
        }
        // Build a regular expression for case-insensitive search
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
        // Fetch courses matching the search term in courseName or tutorName
        const updatedCourseData = await Course_model_1.default.find({
            $or: [
                { courseName: { $regex: regex } },
                { tutorName: { $regex: regex } },
            ],
        });
        if (!updatedCourseData) {
            return res.status(400).json({ success: false, message: "No Course found" });
        }
        const transformedCourses = updatedCourseData.map(course => ({
            courseName: course.courseName,
            courseId: course.courseId,
            tutorName: course.tutorName,
            courseType: course.courseType,
            description: course.description ?? '',
            currency: course.currency,
            sellingPrice: course.sellingPrice,
            originalPrice: course.originalPrice,
            thumbnail: course.thumbnail,
            isVerified: course.isVerified,
            uploadedBy: course.uploadedBy,
            ratings: course.ratings ?? [],
            ratingCount: course.ratings?.length ?? 0,
            likedBy: course.likedBy ?? [],
            likedCount: course.likedBy?.length ?? 0,
            markdownContent: course.markdownContent ?? '',
            redirectLink: course.redirectLink ?? '',
            enrolledBy: course.enrolledBy ?? [],
            enrolledCount: course.enrolledBy?.length ?? 0,
            videos: course.videos ?? []
        }));
        return res.status(200).json({ success: true, data: transformedCourses });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
async function handleGetCoursesByUserIdFunction(req, res) {
    const userId = req.userId;
    const uniqueId = req.userUniqueId;
    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!uniqueId) {
        return res.status(400).json({ success: false, message: "Unique ID is required" });
    }
    try {
        const courses = await Course_model_1.default.find({ uploadedBy: uniqueId });
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: "No courses found" });
        }
        const transformedCourses = courses.map(course => ({
            courseName: course.courseName,
            courseId: course.courseId,
            tutorName: course.tutorName,
            courseType: course.courseType,
            description: course.description ?? '',
            currency: course.currency,
            sellingPrice: course.sellingPrice,
            originalPrice: course.originalPrice,
            thumbnail: course.thumbnail,
            isVerified: course.isVerified,
            uploadedBy: course.uploadedBy,
            ratings: course.ratings ?? [],
            ratingCount: course.ratings?.length ?? 0,
            likedBy: course.likedBy ?? [],
            likedCount: course.likedBy?.length ?? 0,
            markdownContent: course.markdownContent ?? '',
            redirectLink: course.redirectLink ?? '',
            enrolledBy: course.enrolledBy ?? [],
            enrolledCount: course.enrolledBy?.length ?? 0,
            videos: course.videos ?? []
        }));
        return res.status(200).json({ success: true, data: transformedCourses });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
;
