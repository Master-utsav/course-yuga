import User from "../models/User.model";
import mongoose from "mongoose";
import { transporter } from "../utils/mail.config";
import dotenv from "dotenv"

dotenv.config();

export const sendEmailVerification = async (
  email: string,
  userId: mongoose.Types.ObjectId
) => {
  const verificationLink = process.env.PUBLIC_FRONTEND_EMAIL_VERIFICATION_ROUTE!

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
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .header { text-align: center; background-color: #4CAF50; color: #ffffff; padding: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .logo { width: 150px; margin: 0 auto; display: block; }
          .content { padding: 30px; text-align: center; }
          .content h2 { font-size: 22px; color: #4CAF50; margin: 0; }
          .content p { font-size: 16px; line-height: 1.6; color: #555555; }
          .otp { font-size: 36px; font-weight: bold; color: #333333; letter-spacing: 8px; margin: 20px 0; }
          .cta-button { display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 5px; text-decoration: none; margin-top: 20px; }
          .cta-button:hover { background-color: #45a049; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f4f4; }
          .footer p { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header with Logo -->
        <div class="header">
          <img src="${process.env.PUBLIC_FRONTEND_DOMAIN}/images/course-yuga-logo-light-mode-5.png" alt="Course-Yuga Logo" class="logo" />
          <h1>Email Verification</h1>
        </div>

        <!-- Email Content -->
        <div class="content">
          <h2>Hello,</h2>
          <p>Thanks for registering with Course-Yuga! Please verify your email address using the 6-digit OTP below:</p>
          <div class="otp">${emailVerificationOTP}</div>
          <p>If you did not sign up for this account, please ignore this email.</p>

          <!-- Call to Action Button -->
            <a href="${verificationLink}?email=${email}" class="cta-button">Verify Email</a>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>© 2024 Course-Yuga. All rights reserved.</p>
          <p>Need help? <a href="${process.env.PUBLIC_FRONTEND_DOMAIN}/contact">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
    `;


    const mailOptions = {
      from: `"Course Yuga" <${process.env.PUBLIC_GMAIL}>`, // sender address
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
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { text-align: center; background-color: #FF5722; color: #ffffff; padding: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .logo { width: 120px; margin: 0 auto; display: block; }
            .content { padding: 30px; text-align: center; }
            .content h2 { font-size: 22px; color: #FF5722; margin: 0; }
            .content p { font-size: 16px; line-height: 1.6; color: #555555; }
            .otp { font-size: 36px; font-weight: bold; color: #FF5722; letter-spacing: 8px; margin: 20px 0; }
            .cta-button { display: inline-block; background-color: #FF5722; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 5px; text-decoration: none; margin-top: 20px; }
            .cta-button:hover { background-color: #e64a19; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f4f4; }
            .footer p { margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header with Logo -->
          <div class="header">
            <img src="${process.env.PUBLIC_FRONTEND_DOMAIN}/images/course-yuga-logo-light-mode-5.png" alt="Course-Yuga Logo" class="logo" />
            <h1>Password Reset OTP</h1>
          </div>

          <!-- Email Content -->
          <div class="content">
            <h2>Hello,</h2>
            <p>We received a request to reset your password. Please use the 6-digit OTP below to proceed:</p>
            <div class="otp">${passwordResetOTP}</div>
            <p>If you did not request this change, please ignore this email.</p>
            
            <!-- Call to Action Button -->
            <a href="${process.env.PUBLIC_FRONTEND_DOMAIN}/reset-password" class="cta-button">Reset Password</a>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© 2024 Course-Yuga. All rights reserved.</p>
            <p>Need help? <a href="${process.env.PUBLIC_FRONTEND_DOMAIN}/contact">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
      `;


    const mailOptions = {
      from: `"Course Yuga" <${process.env.PUBLIC_GMAIL}>`, // sender address
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
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
            .header { text-align: center; background-color: #4CAF50; color: #ffffff; padding: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .logo { width: 120px; margin: 0 auto 10px; display: block; }
            .content { padding: 30px; text-align: center; }
            .content h2 { font-size: 22px; color: #4CAF50; margin-bottom: 10px; }
            .content p { font-size: 16px; line-height: 1.6; color: #555555; }
            .button { display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 5px; text-decoration: none; margin-top: 20px; }
            .button:hover { background-color: #45a049; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f4f4; }
            .footer p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header with Logo -->
            <div class="header">
              <img src="${process.env.PUBLIC_FRONTEND_DOMAIN}/images/course-yuga-logo-light-mode-5.png" alt="Course-Yuga Logo" class="logo" />
              <h1>Email Verification</h1>
            </div>

            <!-- Email Content -->
            <div class="content">
              <h2>Hello,</h2>
              <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
              
              <!-- Verification Button -->
              <a href="${verificationLink}?email=${email}" target="_blank" class="button">Verify Email</a>
              
              <p>If you did not sign up for this account, please disregard this email.</p>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>© 2024 Course-Yuga. All rights reserved.</p>
              <p>Need help? <a href="${process.env.PUBLIC_FRONTEND_DOMAIN}/contact">Contact Support</a></p>
            </div>
          </div>
        </body>
        </html>
      `;


      const mailOptions = {
        from: `"Course Yuga" <${process.env.PUBLIC_GMAIL}>`, // sender address
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
              .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
              .header { text-align: center; background-color: #4285F4; color: #ffffff; padding: 20px; }
              .header h1 { margin: 0; font-size: 24px; }
              .logo { width: 120px; margin: 0 auto; display: block; }
              .content { padding: 30px; text-align: center; }
              .content h2 { font-size: 22px; color: #4285F4; margin: 0; }
              .content p { font-size: 16px; line-height: 1.6; color: #555555; }
              .password { font-size: 24px; font-weight: bold; color: #34A853; margin: 20px 0; letter-spacing: 2px; }
              .button { display: inline-block; background-color: #EA4335; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 5px; text-decoration: none; margin-top: 20px; }
              .button:hover { background-color: #cc392b; }
              .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f4f4; }
              .footer p { margin: 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <!-- Header with Logo -->
              <div class="header">
                  <img src="${process.env.PUBLIC_FRONTEND_DOMAIN}/images/course-yuga-logo-light-mode-5.png" alt="Course-Yuga Logo" class="logo" />
                  <h1>Welcome to Course-Yuga with Google</h1>
              </div>

              <!-- Email Content -->
              <div class="content">
                  <h2>Hello,</h2>
                  <p>You've successfully signed in using your Google account!</p>
                  <p>Your temporary password is:</p>
                  <div class="password">${password}</div>
                  <p>We recommend that you reset your password immediately to secure your account.</p>
                  
                  <!-- Call to Action Button -->
                  <a href="${resetPasswordLink}" target="_blank" class="button">Reset Password</a>
                  
                  <p>If you did not sign up for this account, please ignore this email.</p>
              </div>

              <!-- Footer -->
              <div class="footer">
                  <p>© 2024 Course-Yuga. All rights reserved.</p>
                  <p>Need help? <a href="${process.env.PUBLIC_FRONTEND_DOMAIN}/contact">Contact Support</a></p>
              </div>
          </div>
      </body>
      </html>
  `;


        const mailOptions = {
            from: `"Course Yuga" <${process.env.PUBLIC_GMAIL}>`, // sender address
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
                .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
                .header { text-align: center; background-color: #24292e; color: #ffffff; padding: 20px; }
                .header h1 { margin: 0; font-size: 24px; }
                .logo { width: 120px; margin: 0 auto; display: block; }
                .content { padding: 30px; text-align: center; }
                .content h2 { font-size: 22px; color: #24292e; margin: 0; }
                .content p { font-size: 16px; line-height: 1.6; color: #555555; }
                .password { font-size: 24px; font-weight: bold; color: #0366d6; margin: 20px 0; letter-spacing: 2px; }
                .button { display: inline-block; background-color: #28a745; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 5px; text-decoration: none; margin-top: 20px; }
                .button:hover { background-color: #218838; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f4f4; }
                .footer p { margin: 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header with Logo -->
                <div class="header">
                    <img src="${process.env.PUBLIC_FRONTEND_DOMAIN}/images/course-yuga-logo-light-mode-5.png" alt="Course-Yuga Logo" class="logo" />
                    <h1>Welcome to Course-Yuga with GitHub</h1>
                </div>

                <!-- Email Content -->
                <div class="content">
                    <h2>Hello,</h2>
                    <p>You've successfully signed in using your GitHub account!</p>
                    <p>Your temporary password is:</p>
                    <div class="password">${password}</div>
                    <p>For security, please reset your password as soon as possible.</p>
                    
                    <!-- Call to Action Button -->
                    <a href="${resetPasswordLink}" target="_blank" class="button">Reset Password</a>
                    
                    <p>If this wasn't you, feel free to ignore this email.</p>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p>© 2024 Course-Yuga. All rights reserved.</p>
                    <p>Need assistance? <a href="${process.env.PUBLIC_FRONTEND_DOMAIN}/contact">Contact Support</a></p>
                </div>
            </div>
        </body>
        </html>
    `;


      const mailOptions = {
          from: `"Course Yuga" <${process.env.PUBLIC_GMAIL}>`, // sender address
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
