import { env } from '@/config/env';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ intentId: string }> }) {
    try {
        const { intentId } = await params;
        const body = await req.json();

        // Forward the request to the Spring Boot backend
        const backendUrl = `${env.backendApiBaseUrl}/gateway/payments/${intentId}/checkout`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Pass along the authorization header if needed
                'Authorization': req.headers.get('Authorization') || '',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to proxy checkout request' },
            { status: 500 }
        );
    }
}