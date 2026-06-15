import { z } from "zod";

export const kycDetailsSchema = z.object({
  legalName: z.string().min(2, "Legal name must be at least 2 characters"),
  country: z.string().min(1, "Country is required"),
  documentType: z.enum(["passport", "national_id", "drivers_license"]),
  documentNumber: z.string().min(3, "Document number must be at least 3 characters"),
});
