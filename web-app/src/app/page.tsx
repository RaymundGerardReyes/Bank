"use client";

import Link from "next/link";

export default function NovaBankLandingPage() {
  return (
    <div className="min-h-screen bg-dominant text-accent font-sans selection:bg-secondary selection:text-accent">

      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 bg-dominant/90 backdrop-blur-md border-b border-secondary/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/20">
              <span className="text-dominant font-bold text-xl leading-none">N</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-accent">
              NovaBank
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-semibold text-accent/80">
            <Link href="#features" className="hover:text-secondary transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-secondary transition-colors">Testimonials</Link>
            <Link href="/developers" className="hover:text-secondary transition-colors">Developers</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block font-bold text-accent hover:text-secondary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-dominant font-bold rounded-lg transition-all shadow-lg shadow-accent/20"
            >
              Open Free Account
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-accent mb-6 leading-tight">
          Banking made for your <span className="text-secondary inline-block relative">
            future
            {/* Decorative underline */}
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary/40" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
            </svg>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-accent/80 mb-10 max-w-3xl mx-auto font-medium">
          Experience effortless money management with zero hidden fees and instant account setup. Secure your financial freedom today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="px-8 py-4 bg-accent hover:bg-accent/90 text-dominant text-lg font-bold rounded-xl transition-all shadow-xl shadow-accent/20 w-full sm:w-auto"
          >
            Open Free Account
          </Link>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative mx-auto w-full max-w-4xl">
          <div className="bg-secondary/10 rounded-t-3xl p-4 pb-0 border-x border-t border-secondary/30">
            <div className="bg-dominant rounded-t-xl shadow-2xl border border-secondary/40 h-64 md:h-96 overflow-hidden flex flex-col">
              <div className="h-10 border-b border-secondary/20 flex items-center px-4 gap-2 bg-surface">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="flex-1 p-8 flex gap-6">
                <div className="w-1/3 bg-secondary/10 rounded-xl h-full border border-secondary/20"></div>
                <div className="w-2/3 flex flex-col gap-6">
                  <div className="h-32 bg-secondary/10 rounded-xl border border-secondary/20 flex flex-col justify-center px-8">
                    <span className="text-accent/70 font-semibold text-sm uppercase tracking-wider mb-1">Total Net Liquidity</span>
                    <span className="text-accent font-extrabold text-4xl">₱14,850.75</span>
                  </div>
                  <div className="flex-1 bg-secondary/10 rounded-xl border border-secondary/20"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-4 bg-secondary/40 rounded-b-3xl w-[105%] -ml-[2.5%] shadow-xl"></div>
        </div>
      </section>

      {/* TRUST BADGES SECTION */}
      <section className="bg-secondary/10 py-8 border-y border-secondary/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-accent font-extrabold tracking-wide">256-BIT SSL SECURED</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-secondary/50"></div>
          <div className="flex items-center gap-8 font-black text-accent/60 text-xl tracking-tight">
            <span>VeriTrust</span>
            <span>RSA Shield</span>
            <span>GlobalCert</span>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-dominant">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-accent mb-4">Banking Built Around You</h2>
            <p className="text-lg text-accent/70 max-w-2xl mx-auto font-medium">
              Everything you need to manage your money, beautifully designed and obsessively engineered for speed and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-secondary/40 bg-dominant shadow-xl shadow-secondary/10 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 border border-secondary/30">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-accent mb-3">Instant Transfers</h3>
              <p className="text-accent/70 font-medium leading-relaxed">
                Send and receive money globally in milliseconds. No holding periods, no transfer limits, just pure velocity.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-secondary/40 bg-dominant shadow-xl shadow-secondary/10 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 border border-secondary/30">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-accent mb-3">Smart Budgeting Tools</h3>
              <p className="text-accent/70 font-medium leading-relaxed">
                Automated categorization and real-time alerts keep your financial health in focus without the spreadsheet stress.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-secondary/40 bg-dominant shadow-xl shadow-secondary/10 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center mb-6 border border-secondary/30">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-accent mb-3">Round-the-Clock Support</h3>
              <p className="text-accent/70 font-medium leading-relaxed">
                Our encrypted secure chat and dedicated support team are available 24/7/365 to resolve any issue instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section id="testimonials" className="py-24 px-6 bg-dominant">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-accent mb-4">Loved by Over 2 Million Members</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-secondary/10 border border-secondary/30">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-accent font-medium text-lg italic mb-6">
                "Switching to NovaBank was the best financial decision I've made. The mobile app is incredibly smooth, and seeing my transfers clear instantly gives me total peace of mind."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-md shadow-accent/20">
                  <span className="text-dominant font-bold">SJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-accent">Sarah Jenkins</h4>
                  <span className="text-accent/70 text-sm font-bold">Small Business Owner</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-secondary/10 border border-secondary/30">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-accent font-medium text-lg italic mb-6">
                "The security features are unmatched. Knowing my account is protected by enterprise-grade encryption while remaining so easy to use daily is exactly what I needed."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-md shadow-accent/20">
                  <span className="text-dominant font-bold">MR</span>
                </div>
                <div>
                  <h4 className="font-bold text-accent">Marcus Rivera</h4>
                  <span className="text-accent/70 text-sm font-bold">Software Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-secondary py-20 px-6 mt-12 border-t border-accent/10">
        <div className="max-w-4xl mx-auto bg-dominant rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-accent/20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-accent mb-6">Ready to upgrade your banking?</h2>
          <p className="text-accent/70 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
            Join NovaBank today. No credit impact, no hidden fees, and zero hassle.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
            onSubmit={(e) => e.preventDefault()}
            suppressHydrationWarning
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl border-2 border-secondary/50 focus:border-accent focus:outline-none text-accent font-medium placeholder:text-accent/50 bg-surface"
              required
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-dominant font-bold rounded-xl transition-colors whitespace-nowrap shadow-lg shadow-accent/20"
              suppressHydrationWarning
            >
              Get Started in 3 Minutes
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dominant pt-16 pb-8 px-6 border-t border-secondary/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-dominant font-bold text-xs leading-none">N</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-accent">
              NovaBank
            </span>
          </div>
          <div className="flex gap-6 text-accent/70 font-bold text-sm">
            <Link href="#" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Terms of Service</Link>
            <Link href="/developers" className="hover:text-secondary transition-colors">API Docs</Link>
          </div>
          <p className="text-accent/50 text-sm font-bold">
            © 2026 NovaBank Inc. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}