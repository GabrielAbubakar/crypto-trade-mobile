import { z } from "zod";

export const signInSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("email"),
    email: z.email("Invalid email address"),
    mobile: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  z.object({
    method: z.literal("mobile"),
    mobile: z.string().min(10, "Invalid mobile number"),
    email: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
]);

export const signUpSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("email"),
    email: z.email("Invalid email address"),
    mobile: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  z.object({
    method: z.literal("mobile"),
    mobile: z.string().min(10, "Invalid mobile number"),
    email: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
]);

