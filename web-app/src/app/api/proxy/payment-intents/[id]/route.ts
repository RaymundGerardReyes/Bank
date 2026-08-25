import { env } from '@/server/config/env';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Next.js 15 requires awaiting dynamic params
        const { id } = await params;

        // Forward the request to the Spring Boot backend
        const backendUrl = `${env.backendApiBaseUrl}/payment-intents/${id}`;

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.get('Authorization') || '',
                'X-Request-Id': req.headers.get('X-Request-Id') || crypto.randomUUID(),
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy Error: /payment-intents/[id]', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch payment intent status' },
            { status: 500 }
        );
    }
}