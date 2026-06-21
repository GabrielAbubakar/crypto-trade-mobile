import { z } from "zod";

export const signInSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("email"),
    email: z.string().email("Invalid email address"),
    phone: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  z.object({
    method: z.literal("phone"),
    phone: z.string().min(10, "Invalid phone number"),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
]);

export const signUpSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("email"),
    fullName: z.string().min(6, "Full Name must be at least 6 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^(?:\+?234|0)?[789]\d{9}$/, "Invalid Nigerian phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  z.object({
    method: z.literal("phone"),
    fullName: z.string(),
    phone: z
      .string()
      .regex(/^(?:\+?234|0)?[789]\d{9}$/, "Invalid Nigerian phone number"),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
]);
