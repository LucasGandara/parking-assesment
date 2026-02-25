import { z } from "zod";

export const registerSchema = z.object({
  buildingId: z.string().min(1, "This field is required."),
  email: z
    .string()
    .min(1, "This field is required.")
    .endsWith(
      "@unosquare.com",
      "Only @unosquare.com email addresses are accepted.",
    ),
  firstName: z.string().min(1, "This field is required."),
  lastName: z.string().min(1, "This field is required."),
  password: z
    .string()
    .min(1, "This field is required.")
    .min(8, "Password must be at least 8 characters."),
  phone: z
    .string()
    .min(1, "This field is required.")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
