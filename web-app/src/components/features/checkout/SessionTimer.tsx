'use client';

import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    expiresAt: string;
}

export default function SessionTimer({ expiresAt }: Props) {
    const [timeLeft, setTimeLeft] = useState<string>('--:--');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft('00:00');
                return;
            }

            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer(); // Initial call
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);
    }, [expiresAt]);

    if (isExpired) {
        return (
            <span className="text-red-600 font-medium flex items-center text-sm animate-pulse">
                <Clock className="w-4 h-4 mr-1.5" /> Session Expired
            </span>
        );
    }

    return (
        <div className="flex items-center text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200 shadow-sm">
            <Clock className="w-4 h-4 mr-2 animate-pulse" />
            <span className="font-mono font-medium text-sm tracking-wide">
                Expires in {timeLeft}
            </span>
        </div>
    );
}