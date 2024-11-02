import User from "../models/User.model";
import mongoose from "mongoose";
import { transporter } from "../utils/mail.config";
import dotenv from "dotenv"

dotenv.config();

export const sendEmailVerification = async (
  email: string,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const emailVerificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const emailUser = await User.findByIdAndUpdate(userId, {
      $set: {
        emailVerificationOTP: emailVerificationOTP,
        emailVerificationOTPExpires: Date.now() + 600000,
        emailSendTime: Date.now() + 120000,
      },
    });
    await emailUser.save();

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; background-color: #4CAF50; color: #ffffff; padding: 15px; border-top-left-radius: 10px; border-top-right-radius: 10px; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 20px; text-align: center; }
            .content p { font-size: 16px; line-height: 1.6; color: #555555; }
            .otp { font-size: 32px; font-weight: bold; color: #333333; letter-spacing: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999999; }
            .footer p { margin: 0; }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h1>Email Verification</h1>
            </div>
            <div class="content">
            <p>Hello,</p>
            <p>Thanks for registering with Course-Yuga! Please verify your email address using the 6-digit OTP below:</p>
            <div class="otp">${emailVerificationOTP}</div>
            <p>If you did not sign up for this account, please ignore this email.</p>
            </div>
            <div class="footer">
            <p>© 2024 Course-Yuga. All rights reserved.</p>
            </div>
        </div>
        </body>
        </html>
        `;

    const mailOptions = {
      from: process.env.PUBLIC_GMAIL, // sender address
      to: email,
      subject: "Email Verification OTP",
      html: htmlContent,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const sendResetPasswordVerification = async (
  email: string,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const passwordResetOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const emailUser = await User.findByIdAndUpdate(userId, {
      $set: {
        passwordResetOTP: passwordResetOTP,
        passwordResetOTPExpires: Date.now() + 600000,
        passwordSendTime: Date.now() + 3600000,
      },
    });
    await emailUser.save();

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f2f4f7; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; background-color: #FF5722; color: #ffffff; padding: 15px; border-top-left-radius: 10px; border-top-right-radius: 10px; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 20px; text-align: center; }
          .content p { font-size: 16px; line-height: 1.6; color: #555555; }
          .otp { font-size: 32px; font-weight: bold; color: #FF5722; letter-spacing: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999999; }
          .footer p { margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset OTP</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the 6-digit OTP below to proceed:</p>
            <div class="otp">${passwordResetOTP}</div>
            <p>If you did not request this change, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Course-Yuga. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.PUBLIC_GMAIL, // sender address
      to: email,
      subject: "Password Reset OTP",
      html: htmlContent,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const emailVerificationAlert = async (email: string) => {
    const verificationLink = process.env.PUBLIC_FRONTEND_EMAIL_VERIFICATION_ROUTE!
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification Alert</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f2f4f7; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; background-color: #4CAF50; color: #ffffff; padding: 15px; border-top-left-radius: 10px; border-top-right-radius: 10px; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 20px; text-align: center; }
            .content p { font-size: 16px; line-height: 1.6; color: #555555; }
            .button { display: inline-block; margin: 20px auto; padding: 10px 20px; background-color: #4CAF50; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px; font-size: 18px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999999; }
            .footer p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
              <a href="${verificationLink}" target="_blank" class="button">Verify Email</a>
              <p>If you did not sign up for this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 Course-Yuga. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: process.env.PUBLIC_GMAIL, // sender address
        to: email, 
        subject: "Email Verification Alert", 
        html: htmlContent, 
      };
  
      const mailResponse = await transporter.sendMail(mailOptions);
  
      return mailResponse;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };

  export const sendGoogleAuthPasswordMail = async (email: string, password: string) => {
    const resetPasswordLink = process.env.PUBLIC_FRONTEND_RESET_PASSWORD_ROUTE!;
    
    try {
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Google Authentication Success</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f2f4f7; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; background-color: #4CAF50; color: #ffffff; padding: 15px; border-top-left-radius: 10px; border-top-right-radius: 10px; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 20px; text-align: center; }
                    .content p { font-size: 16px; line-height: 1.6; color: #555555; }
                    .button { display: inline-block; margin: 20px auto; padding: 10px 20px; background-color: #4CAF50; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px; font-size: 18px; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999999; }
                    .footer p { margin: 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Google Authentication Success</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>You've successfully signed in using Google!</p>
                        <p>Your temporary password is: <strong>${password}</strong></p>
                        <p>We recommend you reset your password immediately for security purposes.</p>
                        <a href="${resetPasswordLink}" target="_blank" class="button">Reset Password</a>
                        <p>If you did not sign up for this account, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Course-Yuga. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.PUBLIC_GMAIL, // sender address
            to: email, 
            subject: "Google Authentication Successful", 
            html: htmlContent, 
        };

        const mailResponse = await transporter.sendMail(mailOptions);

        return mailResponse;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

export const sendGithubAuthPasswordMail = async (email: string, password: string) => {
  const resetPasswordLink = process.env.PUBLIC_FRONTEND_RESET_PASSWORD_ROUTE!;
  
  try {
      const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>GitHub Authentication Success</title>
              <style>
                  body { font-family: Arial, sans-serif; background-color: #f2f4f7; color: #333; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                  .header { text-align: center; background-color: #24292e; color: #ffffff; padding: 15px; border-top-left-radius: 10px; border-top-right-radius: 10px; }
                  .header h1 { margin: 0; font-size: 24px; }
                  .content { padding: 20px; text-align: center; }
                  .content p { font-size: 16px; line-height: 1.6; color: #555555; }
                  .button { display: inline-block; margin: 20px auto; padding: 10px 20px; background-color: #24292e; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px; font-size: 18px; }
                  .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999999; }
                  .footer p { margin: 0; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>GitHub Authentication Success</h1>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>You've successfully signed in using GitHub!</p>
                      <p>Your temporary password is: <strong>${password}</strong></p>
                      <p>We recommend you reset your password immediately for security purposes.</p>
                      <a href="${resetPasswordLink}" target="_blank" class="button">Reset Password</a>
                      <p>If you did not sign up for this account, please ignore this email.</p>
                  </div>
                  <div class="footer">
                      <p>© 2024 Course-Yuga. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
      `;

      const mailOptions = {
          from: process.env.PUBLIC_GMAIL, // sender address
          to: email, 
          subject: "GitHub Authentication Successful", 
          html: htmlContent, 
      };

      const mailResponse = await transporter.sendMail(mailOptions);

      return mailResponse;
  } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
  }
};
