import { env } from '@/server/config/env';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const backendUrl = `${env.backendApiBaseUrl}/payment-intents`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.get('Authorization') || '',
                'X-Request-Id': req.headers.get('X-Request-Id') || crypto.randomUUID(),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Proxy Error: /payment-intents', error);
        return NextResponse.json(
            { success: false, message: 'Gateway integration error' },
            { status: 500 }
        );
    }
}