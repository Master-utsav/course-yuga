import { Request, Response } from "express";
import User, { IUser } from "../models/User.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  checkConstraints,
  checkLoginConstraintsAsEmail,
  checkLoginConstraintsAsUserName,
  checkPasswordConstraints,
  returnIdentity,
} from "../validchecks/checkAuthConstraints";
import {
  emailVerificationAlert,
  sendEmailVerification,
  sendResetPasswordVerification,
} from "../helpers/mailer";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import twilio from "twilio";

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
      email: user.email,
      emailVerificationStatus: user.emailVerificationStatus,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
      phoneNumberVerificationStatus: user.phoneNumberVerificationStatus,
      role: user.role,
      bio: user.bio,
      userDob: user.userDob,
      address: user.address,
    };
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleSignUpFunction(req: Request, res: Response) {
  try {
    const { userName, firstName, lastName, email, password }: IUser = req.body;

    if (!userName || !firstName || !email || !password || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: "Please filled all the fields" });
    }

    const isValid = checkConstraints(
      userName,
      firstName,
      lastName,
      email,
      password
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Constraints" });
    }

    const user = await User.findOne({ email: email });

    if (user && user.email === email && !user.emailVerificationStatus) {
      // TODO: sending a mail to user that please verify the email , someone try to signup by your email
      await emailVerificationAlert(user.email);
    }

    if (user && user.emailVerificationStatus === true) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with this email",
        });
    }

    const username = await User.findOne({ userName: userName });
    if (username && username.emailVerificationStatus) {
      return res
        .status(400)
        .json({ success: false, message: "User Name already taken" });
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      role: "STUDENT",
    });

    const userId = newUser._id;

    await newUser.save();

    await sendEmailVerification(email, userId);

    return res
      .status(201)
      .json({
        success: true,
        message: "signed up successfully, please verify your email",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleLoginFunction(req: Request, res: Response) {
  try {
    const { identity, password } = req.body;

    if (!identity || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    let userIdentity: null | string = null;
    const returnedIdentity = returnIdentity(identity);

    if (returnedIdentity === "userName") {
      const isValidConstraintsAsUserName = checkLoginConstraintsAsUserName(
        identity,
        password
      );
      if (!isValidConstraintsAsUserName) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid username or password" });
      }

      userIdentity = identity;
    } else if (returnedIdentity === "email") {
      const isValidConstraintsAsEmail = checkLoginConstraintsAsEmail(
        identity,
        password
      );
      if (!isValidConstraintsAsEmail) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      userIdentity = identity;
    }

    const user = await User.findOne({
      $or: [{ userName: userIdentity }, { email: userIdentity }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15d",
      }
    );

    const userData = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerificationStatus: user.emailVerificationStatus,
      profileImageUrl: user.profileImageUrl || "",
    };

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token, userData });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleEmailVerificationOTP(req: Request, res: Response) {
  try {
    const { otp, email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exists" });
    }
    if (user?.emailVerificationOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const userId = user._id;
    const updateUseremailVerificationStatus = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          emailVerificationStatus: true,
        },
        $unset: {
          emailSendTime: "",
          emailVerificationOTP: "",
          emailVerificationOTPExpires: "",
        },
      }
    );
    await updateUseremailVerificationStatus.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleResendVerficationOTPFunction(
  req: Request,
  res: Response
) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exists" });
    }

    if (user && user.emailVerificationStatus) {
      return res
        .status(400)
        .json({ success: false, message: "email already Verified exists" });
    }

    if (user?.emailSendTime) {
      const emailTime = user.emailSendTime.getTime();
      const currentTime = Date.now();
      const remainingTime = emailTime - currentTime;
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      if (remainingTime > 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: `try after ${minutes}min ${seconds}s`,
          });
      }
    }

    await sendEmailVerification(user.email, user._id);

    return res
      .status(200)
      .json({ message: "verification mail send successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleChangePasswordFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    const { email } = req.body;
    const user = await User.findOne({ $and: [{ email }, { _id: userId }] });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exists" });
    }
    if (!user?.emailVerificationStatus) {
      return res
        .status(400)
        .json({ success: false, message: "email not verified" });
    }

    if (user && user.passwordResetOTPExpires) {
      const emailTime = user.passwordResetOTPExpires;
      const currentTime = Date.now();
      const remainingTime = emailTime - currentTime;
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      if (remainingTime > 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: `try after ${minutes}min ${seconds}s`,
          });
      } else {
        await sendResetPasswordVerification(user.email, user._id);
      }
    }

    if (user && user.passwordSendTime) {
      const emailTime = user.passwordSendTime;
      const currentTime = Date.now();
      const remainingTime = emailTime - currentTime;
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      if (remainingTime > 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: `try after ${hours}hr ${minutes}min ${seconds}s`,
          });
      }
    }

    await sendResetPasswordVerification(user.email, user._id);

    return res
      .status(200)
      .json({ message: "OTP send successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleChangePasswordVerificationOTP(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    const { otp, newPassword } = req.body;

    if (!newPassword || !otp || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Empty fields is not acceptable" });
    }

    const isValidPassword = checkPasswordConstraints(newPassword);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exists" });
    }
    if (user?.passwordResetOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user?.passwordResetOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user && user.passwordResetOTPExpires) {
      const emailTime = user.passwordResetOTPExpires;
      const currentTime = Date.now();
      const remainingTime = emailTime - currentTime;
      if (remainingTime < 0) {
        return res.status(404).json({ success: false, message: `OTP expires` });
      }
    }

    const updateUserPassword = await User.findByIdAndUpdate(userId, {
      $set: {
        password: hashedPassword,
        passwordSendTime: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15days
      },
      $unset: {
        passwordResetOTP: "",
        passwordResetOTPExpires: "",
      },
    });
    await updateUserPassword.save();

    return res
      .status(200)
      .json({ success: true, message: "Password Changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleResetPasswordFunction(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesn't exists" });
    }
    if (!user?.emailVerificationStatus) {
      return res
        .status(400)
        .json({ success: false, message: "email not verified" });
    }

    if (user && user.passwordResetOTPExpires) {
      const emailTime = user.passwordResetOTPExpires;
      const currentTime = Date.now();
      const remainingTime = emailTime - currentTime;
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      if (remainingTime > 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: `try after ${minutes}min ${seconds}s`,
          });
      } else {
        await sendResetPasswordVerification(user.email, user._id);
      }
    }

    if (user && user.passwordSendTime) {
      const emailTime = user.passwordSendTime;
      const currentTime = Date.now();
      const remainingTime = emailTime - currentTime;
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      if (remainingTime > 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: `try after ${hours}hr ${minutes}min ${seconds}s`,
          });
      }
    }

    await sendResetPasswordVerification(user.email, user._id);

    return res
      .status(200)
      .json({ message: "OTP send successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleResetPasswordVerificationOTP(
  req: Request,
  res: Response
) {
  try {
    const { otp, newPassword, email } = req.body;

    if (!otp || !newPassword || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isValidPassword = checkPasswordConstraints(newPassword);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password format" });
    }

    const user = await User.findOne({ email, passwordResetOTP: otp });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or email" });
    }

    if (user && user.passwordResetOTPExpires) {
      const emailTime = user.passwordResetOTPExpires;
      const currentTime = Date.now();
      const remainingTime = emailTime - currentTime;
      if (remainingTime < 0) {
        return res.status(404).json({ success: false, message: `OTP expires` });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateUserPassword = await User.findByIdAndUpdate(user._id, {
      $set: {
        password: hashedPassword,
        passwordSendTime: Date.now() + 15 * 24 * 60 * 60 * 1000,
      },
      $unset: {
        passwordResetOTP: "",
        passwordResetOTPExpires: "",
      },
    });
    await updateUserPassword.save();

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleUpdateUserFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    const { firstName, lastName, userDob, role, address, bio } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }

    // Initialize updateData object with optional fields if they are not null or undefined
    const updateData: {
      firstName?: string;
      lastName?: string;
      userDob?: string;
      role?: string;
      address?: {
        country : string,
        city : string,
        state : string
      };
      bio?: string;
    } = {};

    if (firstName != null) updateData.firstName = firstName;
    if (lastName != null) updateData.lastName = lastName;
    if (userDob != null) updateData.userDob = userDob;
    if (role != null) updateData.role = role;
    if (address != null) updateData.address = address;
    if (bio != null) updateData.bio = bio;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handleDeleteAccountFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.userId;
  const { password } = req.body;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No user found" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const deletedUser = await User.deleteOne({ email: user.email });

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export async function handlePhoneNumberOTPCheckFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.userId;
  const { to, code, countryCode } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!to || !code || !countryCode) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameters: to, code , countryCode",
    });
  }

  function removeCountryCode(phoneNumber: string, countryCode: string): string {
    if (phoneNumber.startsWith(countryCode)) {
      return phoneNumber.slice(countryCode.length);
    }
    return phoneNumber;
  }
  
  const number = removeCountryCode(to , countryCode);


  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;

    const check = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({ to, code });

    if (check.status === "approved") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          phoneNumberVerificationStatus: true,
          "phoneNumber.number": number,
          "phoneNumber.code": countryCode,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Verification successful.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP.",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function handlePhoneNumberOTPSendFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  const userId = req.userId;
  const { to, channel = "sms", locale = "en" } = req.body;

  if (!to || to.trim() === "") {
    return res.status(400).json({
      success: false,
      message:
        "Missing 'to' parameter; please provide a phone number or email.",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;

    await client.verify.v2.services(VERIFY_SERVICE_SID).verifications.create({
      to,
      channel,
      locale,
    });

    return res
      .status(200)
      .json({ success: true, message: `OTP sent to ${to}` });
  } catch (error : any) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
}
