import * as z from "zod";

export const signupSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
    })
    .trim()
    .min(1, {
      message: "Name is required.",
    }),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .trim()
    .email({ message: "Invalid Email Address" }),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .trim()
    .min(8, {
      message: "Password must be at least 8 characters long",
    }),
});

export type SignupInputType = z.infer<typeof signupSchema>;
