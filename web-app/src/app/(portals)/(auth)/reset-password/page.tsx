"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/auth/authService";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useRef, useState } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // FIX: Strict ref lock to prevent React StrictMode or double-clicks from firing twice
  const isSubmitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If already submitting, block the second ghost request immediately
    if (isSubmitting.current) return;

    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Lock the form
    isSubmitting.current = true;
    setLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      // Unlock only if it fails, so they can try again
      isSubmitting.current = false;
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to reset password.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center animate-in fade-in duration-500">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold mb-6">
          Your password has been successfully reset.
        </div>
        <Button onClick={() => router.push("/login")} className="w-full py-3.5 shadow-xl shadow-accent/10">
          Return to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-in fade-in duration-500">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm font-bold text-center">
          {error}
        </div>
      )}
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Minimum 8 characters"
        required
        disabled={loading}
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Repeat new password"
        required
        disabled={loading}
      />
      <Button type="submit" isLoading={loading} disabled={loading} className="w-full mt-2 py-3.5 shadow-xl shadow-accent/10">
        Update Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-dominant selection:bg-secondary selection:text-accent">
      <Card className="w-full max-w-md shadow-2xl shadow-accent/5 border-secondary/20" title="Create New Password">
        <p className="text-sm font-medium text-accent/70 leading-relaxed mb-6">
          Please enter your new password below. Ensure it is at least 8 characters long.
        </p>
        <Suspense fallback={<div className="text-center text-accent/50 text-sm animate-pulse">Verifying security token...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}