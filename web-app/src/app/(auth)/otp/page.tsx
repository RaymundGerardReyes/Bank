"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";

export default function OtpPage() {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/accounts");
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md" title="Two-Factor Verification">
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <p className="text-sm text-slate-300">
            Enter the 6-digit authentication code sent to your registered device.
          </p>
          <Input
            label="OTP Code"
            type="text"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="123456"
            required
          />
          <Button type="submit" isLoading={loading} className="w-full mt-2">
            Verify Code
          </Button>
        </form>
      </Card>
    </div>
  );
}
