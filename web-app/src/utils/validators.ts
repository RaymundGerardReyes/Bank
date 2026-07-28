import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const transferSchema = z.object({
  sourceAccountNumber: z.string().min(1, "Source account is required"),
  recipientAccountNumber: z.string().min(1, "Recipient account is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().max(100, "Description cannot exceed 100 characters").optional(),
});

export const transactionSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  description: z.string().max(100, "Description cannot exceed 100 characters").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
