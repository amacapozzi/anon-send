import { z } from "zod";

export const mailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string({ required_error: "Message body cannot be empty" }).min(5, {
    message: "Message body must be at least 5 characters long",
  }),
  senderId: z.string().cuid().optional(),
  recipient: z.string({ required_error: "Recipient is required" }),
  expiresAt: z.coerce.date().optional(),
  files: z
    .array(
      z.object({
        filename: z.string().min(1, "Filename is required"),
        mimetype: z.string().min(1, "MIME type is required"),
        size: z
          .number()
          .int()
          .positive({ message: "File size must be a positive number" }),
      })
    )
    .optional(),
  maxViews: z.number().int().positive().optional(),
});
