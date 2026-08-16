"use client";

import { CheckoutResult } from "@/components/checkout/CheckoutResult";
import { checkoutService } from "@/services/checkout/checkoutService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
    const params = useParams();
    const sessionId = params.sessionId as string;

    const [status, setStatus] = useState<string>("PROCESSING");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinalState = async () => {
            try {
                const data = await checkoutService.validateSession(sessionId);
                setStatus(data.status);
            } catch (err) {
                setStatus("FAILED");
            } finally {
                setLoading(false);
            }
        };
        fetchFinalState();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <CheckoutResult status={status} />;
}