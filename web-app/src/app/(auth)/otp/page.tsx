"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function OtpPage() {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Automatically trigger the OTP email when the page loads
  useEffect(() => {
    let storedEmail = typeof window !== "undefined" ? sessionStorage.getItem("registration_email") : null;
    
    // Check URL query parameters if not in sessionStorage
    if (!storedEmail && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      storedEmail = params.get("email");
    }

    // Default fallback for development/testing
    if (!storedEmail) {
      storedEmail = "user@example.com";
    }

    setEmail(storedEmail);
    triggerSendOtp(storedEmail);
  }, []);

  const triggerSendOtp = async (targetEmail: string) => {
    setIsSending(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/proxy/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code");
      setMessage("A new 6-digit code has been sent to your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/proxy/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired OTP code.");
      }

      // Success! Clear session storage and move to the dashboard
      sessionStorage.removeItem("registration_email");
      router.push("/accounts");

    } catch (err: any) {
      setError(err.message);
      setOtpCode(""); // Clear the input so they can try again
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-dominant selection:bg-secondary selection:text-accent">
      <Card className="w-full max-w-md shadow-2xl shadow-accent/5 border-secondary/20" title="Security Verification">
        <form onSubmit={handleVerify} className="flex flex-col gap-4">

          <p className="text-sm font-medium text-accent/70 leading-relaxed">
            We have sent a 6-digit verification code to <span className="font-extrabold text-accent">{email || "your email"}</span>.
            Please enter it below to verify your identity.
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
            label="6-Digit OTP Code"
            type="text"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} // Force numbers only
            placeholder="123456"
            required
            className="text-center text-2xl tracking-[0.5em] font-mono"
          />

          <Button type="submit" isLoading={loading} className="w-full mt-4 py-3 shadow-lg shadow-accent/20">
            Verify Code
          </Button>

          <button
            type="button"
            onClick={() => email && triggerSendOtp(email)}
            disabled={isSending || !email}
            className="mt-2 text-sm font-bold text-secondary hover:text-sky-500 transition-colors disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Didn't receive a code? Resend"}
          </button>
        </form>
      </Card>
    </div>
  );
}