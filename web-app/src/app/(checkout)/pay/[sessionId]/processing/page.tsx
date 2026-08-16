"use client";

import { ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProcessingPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    useEffect(() => {
        // Phase G Implementation point: This page will poll useCheckoutSession hook
        // For now, mock a delay and push to result
        const timer = setTimeout(() => {
            router.push(`/pay/${sessionId}/result`);
        }, 3000);

        return () => clearTimeout(timer);
    }, [sessionId, router]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute animate-ping inline-flex h-16 w-16 rounded-full bg-blue-100 opacity-75"></div>
                <div className="relative bg-blue-600 rounded-full p-3 shadow-lg shadow-blue-200">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 animate-pulse">Processing Payment</h2>
            <p className="text-sm text-gray-500">Please do not close this window or click back.</p>
        </div>
    );
}