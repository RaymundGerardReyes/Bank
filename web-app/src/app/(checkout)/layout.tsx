import { ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Bank Branding Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center shadow-inner">
                        <span className="text-white font-bold text-xl">N</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">NovaBank</span>
                </div>

                {/* Security Trust Badge */}
                <div className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium tracking-wide">Secure Payment</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
                <p>Powered by NovaBank Secure Checkout</p>
                <p className="text-xs mt-1">© {new Date().getFullYear()} NovaBank. All rights reserved.</p>
            </footer>
        </div>
    );
}