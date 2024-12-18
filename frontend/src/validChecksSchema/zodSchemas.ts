import { z } from "zod";

// Custom regex for validations
const userNameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const firstNameRegex = /^[a-zA-Z]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Zod schema
export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters long" })
      .regex(firstNameRegex, {
        message: "First name should only contain letters",
      }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters long" })
      .regex(firstNameRegex, {
        message: "Last name should only contain letters",
      }),
    userName: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(16, { message: "Username can't exceed 16 characters" })
      .regex(userNameRegex, {
        message:
          "Username should only contain letters, numbers, or underscores",
      }),

    email: z
      .string()
      .email({ message: "Invalid email format" })
      .regex(emailRegex, { message: "Please provide a valid email" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(passwordRegex, {
        message:
          "Password must contain at least one uppercase, one lowercase, one digit, and one special character",
      }),

    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      })
      .regex(passwordRegex, {
        message: "Confirm Password must match the required pattern",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const loginSchema = z.object({
    identity: z
      .string()
      .min(3, { message: "Identity must be at least 3 characters long" })
      .max(50, { message: "Identity can't exceed 50 characters" })
      .refine(
        (value) => userNameRegex.test(value) || emailRegex.test(value),
        {
          message: "Identity must be a valid username or email",
        }
      ),
    
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(passwordRegex, {
        message:
          "Password must contain at least one uppercase, one lowercase, one digit, and one special character",
      }),
  });

