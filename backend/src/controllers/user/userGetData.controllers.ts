import { Response } from "express";
import User from "../../models/User.model";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";

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




