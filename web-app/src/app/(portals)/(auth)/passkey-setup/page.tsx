"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { passkeyService } from "@/services/auth/passkeyService";

export default function PasskeySetupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="max-w-md w-full" title="Passkey Registration">
        <p className="text-sm text-slate-300 mb-6">
          Register Touch ID, Face ID, or a hardware security key for instant, passwordless sign-in.
        </p>
        <Button
          onClick={() => alert("Passkey registration initiated")}
          disabled={!passkeyService.isSupported()}
          className="w-full"
        >
          Register New Passkey
        </Button>
      </Card>
    </div>
  );
}
