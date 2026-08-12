"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { authService } from "@/services/auth/authService";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setMessage("If an account exists with that email, a password reset link has been sent.");
      setEmail("");
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-dominant selection:bg-secondary selection:text-accent font-sans">
      <Card className="w-full max-w-md shadow-2xl shadow-accent/5 border-secondary/20" title="Reset Password">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in duration-500">
          <p className="text-sm font-medium text-accent/70 leading-relaxed">
            Enter the email address associated with your enterprise account, and we will send you secure instructions to reset your password.
          </p>

          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-bold text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <Input
            label="Work Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <Button type="submit" isLoading={loading} className="w-full mt-2 py-3.5 shadow-xl shadow-accent/10">
            Send Reset Link
          </Button>

          <div className="mt-4 text-center border-t border-secondary/20 pt-4">
            <Link href="/login" className="text-sm font-bold text-sky-600 hover:text-sky-500 transition-colors">
              &larr; Back to Sign In
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
