import { z } from "zod";

export const updatePinSchema = z
  .object({
    currentPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must only contain digits"),
    newPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must only contain digits"),
    confirmPin: z
      .string()
      .length(4, "PIN must be exactly 4 digits")
      .regex(/^\d+$/, "PIN must only contain digits"),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "New PIN and Confirm PIN do not match",
    path: ["confirmPin"],
  });
