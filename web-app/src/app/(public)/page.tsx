import { Logo } from "@/components/ui/Logo";
import { StarRating } from "@/components/ui/StarRating";
import Link from "next/link";

export default function MunBankLandingPage() {
  return (
    <div className="min-h-screen bg-surface text-accent font-sans selection:bg-secondary/30 selection:text-accent relative overflow-x-clip">
      {/* Dynamic Motion Background Ambient Blobs (contained so sticky navigation is never disrupted) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[140px] animate-pulse-glow" />
        <div
          className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-1/4 -left-32 w-[550px] h-[550px] bg-sky-400/10 rounded-full blur-[130px] animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* STICKY GLASSMORPHIC NAVIGATION */}
      <header className="sticky top-0 z-50 bg-dominant/80 backdrop-blur-xl border-b border-secondary/20 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-accent/70">
            <a href="#features" className="hover:text-accent transition-colors py-2 relative group cursor-pointer">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full" />
            </a>
            <a href="#testimonials" className="hover:text-accent transition-colors py-2 relative group cursor-pointer">
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full" />
            </a>
            <Link href="/developers" className="hover:text-accent transition-colors py-2 relative group">
              Developers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block font-extrabold text-sm text-accent/80 hover:text-accent transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-dominant text-sm font-extrabold rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Open Free Account
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 px-6 text-center max-w-5xl mx-auto relative z-10">


        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-accent mb-6 leading-[1.1]">
          Banking made for your{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-accent via-secondary to-sky-600">
            future
            <svg
              className="absolute w-full h-3 -bottom-2 left-0 text-secondary/50"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-accent/70 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          Experience effortless money management, real-time ledgers, zero hidden fees, and instant account setup. Secure your financial freedom today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="px-8 py-4 bg-accent hover:bg-accent/90 text-dominant text-base font-extrabold rounded-2xl transition-all duration-200 shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
          >
            Get Started in 3 Minutes
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-dominant/90 hover:bg-dominant backdrop-blur-md border border-secondary/30 text-accent text-base font-extrabold rounded-2xl transition-all duration-200 shadow-sm hover:border-secondary/60 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
          >
            Explore Demo Portal
          </Link>
        </div>

        {/* HIGH-FIDELITY DASHBOARD MOCKUP */}
        <div className="relative mx-auto w-full max-w-4xl group">
          <div className="bg-dominant/70 backdrop-blur-xl rounded-3xl p-3 md:p-4 border border-secondary/30 shadow-2xl shadow-accent/10 transition-all duration-500 group-hover:border-secondary/50 group-hover:shadow-accent/15">
            {/* Browser Window Header */}
            <div className="bg-surface rounded-t-2xl border border-secondary/20 overflow-hidden flex flex-col shadow-inner">
              <div className="h-11 border-b border-secondary/20 flex items-center justify-between px-4 bg-dominant/90">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-surface border border-secondary/30 rounded-lg text-[11px] font-bold text-accent/60">
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  app.munbank.com/accounts
                </div>
                <div className="w-12" />
              </div>

              {/* Mockup Canvas */}
              <div className="p-6 md:p-8 bg-surface/50 flex flex-col gap-6">
                {/* Mock Hero Header Card */}
                <div className="bg-accent text-dominant rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-2xl animate-pulse-glow" />
                  <div className="relative z-10 text-left">
                    <span className="text-dominant/70 text-xs font-extrabold uppercase tracking-widest block mb-1">
                      Total Net Liquidity
                    </span>
                    <span className="text-3xl md:text-5xl font-black tracking-tight font-numeric">
                      ₱1,485,075.50
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                        Active Ledgers: 4
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <div className="px-4 py-2.5 bg-dominant text-accent font-bold text-xs rounded-xl shadow-md">
                      Send Funds
                    </div>
                  </div>
                </div>

                {/* Mock Account Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-dominant rounded-xl border border-secondary/20 shadow-sm text-left">
                    <span className="text-[10px] font-extrabold text-accent/50 uppercase tracking-widest block">Main Treasury</span>
                    <span className="text-lg font-black text-accent block mt-1">₱1,200,000.00</span>
                    <span className="text-[10px] font-bold text-emerald-600 mt-2 inline-block">↑ +12.4% this month</span>
                  </div>
                  <div className="p-4 bg-dominant rounded-xl border border-secondary/20 shadow-sm text-left">
                    <span className="text-[10px] font-extrabold text-accent/50 uppercase tracking-widest block">Merchant Ops</span>
                    <span className="text-lg font-black text-accent block mt-1">₱235,075.50</span>
                    <span className="text-[10px] font-bold text-emerald-600 mt-2 inline-block">● Auto-Settled</span>
                  </div>
                  <div className="p-4 bg-dominant rounded-xl border border-secondary/20 shadow-sm text-left">
                    <span className="text-[10px] font-extrabold text-accent/50 uppercase tracking-widest block">Payroll Reserve</span>
                    <span className="text-lg font-black text-accent block mt-1">₱50,000.00</span>
                    <span className="text-[10px] font-bold text-accent/50 mt-2 inline-block">🔒 Locked Ledger</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-4 bg-secondary/30 rounded-b-3xl w-[104%] -ml-[2%] shadow-2xl backdrop-blur-md" />
        </div>
      </section>

      {/* TRUST BADGES SECTION */}
      <section className="bg-dominant/80 backdrop-blur-md py-8 border-y border-secondary/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black uppercase tracking-wider text-accent">256-BIT SSL SECURED</span>
              <span className="text-[11px] font-semibold text-accent/60">Bank-grade HSM & WebAuthn standard</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-secondary/30" />

          <div className="flex items-center gap-8 font-black text-accent/50 text-sm sm:text-base tracking-wider uppercase">
            <span className="hover:text-accent transition-colors">ISO 27001</span>
            <span className="hover:text-accent transition-colors">SOC2 TYPE II</span>
            <span className="hover:text-accent transition-colors">RSA SHIELD</span>
            <span className="hover:text-accent transition-colors">PCI-DSS COMPLIANT</span>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-surface relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-accent mb-4 tracking-tight">
              Banking Built Around Velocity & Security
            </h2>
            <p className="text-lg text-accent/70 max-w-2xl mx-auto font-medium">
              Everything you need to manage corporate ledgers, high-volume transactions, and virtual accounts with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="glass-panel p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/50 group text-left relative overflow-hidden">
              <div className="w-14 h-14 bg-accent text-dominant rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-accent/20 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-accent mb-3 tracking-tight">Instant Settlement Engine</h3>
              <p className="text-accent/70 font-medium leading-relaxed text-sm">
                Execute cross-border transactions and inter-bank transfers in sub-seconds with automated webhook notifications and idempotency safeguards.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="glass-panel p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/50 group text-left relative overflow-hidden">
              <div className="w-14 h-14 bg-accent text-dominant rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-accent/20 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-accent mb-3 tracking-tight">Virtual Account Management</h3>
              <p className="text-accent/70 font-medium leading-relaxed text-sm">
                Provision virtual sub-accounts dynamically for merchant reconciliation, departmental budgets, or designated client escrows.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="glass-panel p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/50 group text-left relative overflow-hidden">
              <div className="w-14 h-14 bg-accent text-dominant rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-accent/20 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-accent mb-3 tracking-tight">WebAuthn & Risk Governance</h3>
              <p className="text-accent/70 font-medium leading-relaxed text-sm">
                Protect enterprise operations with biometric passkeys, hardware token support, compliance matrices, and real-time fraud monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section id="testimonials" className="py-24 px-6 bg-dominant relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-accent mb-4 tracking-tight">Trusted by Enterprise Leaders</h2>
            <p className="text-accent/70 font-semibold text-sm uppercase tracking-widest">
              Over 2 Million Active Ledgers Managed Globally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-secondary/20 shadow-md text-left transition-all duration-300 hover:shadow-xl">
              <StarRating />
              <p className="text-accent font-semibold text-lg italic mb-6 leading-relaxed">
                "Switching to MunBank was the best decision for our treasury operations. The API speed and automated reconciliation saved us hundreds of engineering hours."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent text-dominant rounded-full flex items-center justify-center font-black shadow-md">
                  SJ
                </div>
                <div>
                  <h4 className="font-extrabold text-accent">Sarah Jenkins</h4>
                  <span className="text-accent/60 text-xs font-bold">VP of Treasury, GlobalPay</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-secondary/20 shadow-md text-left transition-all duration-300 hover:shadow-xl">
              <StarRating />
              <p className="text-accent font-semibold text-lg italic mb-6 leading-relaxed">
                "The WebAuthn passkey integration combined with sub-second ledger settlements makes MunBank the premier enterprise financial platform."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent text-dominant rounded-full flex items-center justify-center font-black shadow-md">
                  MR
                </div>
                <div>
                  <h4 className="font-extrabold text-accent">Marcus Rivera</h4>
                  <span className="text-accent/60 text-xs font-bold">CTO, Apex Financial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-accent py-20 px-6 border-t border-accent/10 relative z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />

        <div className="max-w-4xl mx-auto bg-dominant/95 backdrop-blur-xl rounded-3xl p-10 md:p-16 text-center shadow-2xl border border-secondary/30 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-accent mb-6 tracking-tight">
            Ready to upgrade your financial stack?
          </h2>
          <p className="text-accent/70 text-base md:text-lg font-medium mb-10 max-w-xl mx-auto">
            Join MunBank today. Instant provisioning, TLS 1.3 encryption, and zero setup friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <Link
              href="/register"
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-dominant text-base font-extrabold rounded-xl transition-all duration-200 shadow-xl shadow-accent/20 hover:shadow-accent/30 active:scale-95 text-center cursor-pointer"
            >
              Open Account Now
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-surface hover:bg-secondary/15 text-accent text-base font-extrabold rounded-xl transition-all duration-200 border border-secondary/30 active:scale-95 text-center cursor-pointer"
            >
              Sign In to Console
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dominant pt-16 pb-8 px-6 border-t border-secondary/20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size="sm" showText={true} />
          <div className="flex gap-6 text-accent/70 font-bold text-xs uppercase tracking-wider">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link href="/developers" className="hover:text-accent transition-colors">API Docs</Link>
          </div>
          <p className="text-accent/50 text-xs font-bold">
            © 2026 MunBank Inc. Next.js App Router Hardened Architecture.
          </p>
        </div>
      </footer>
    </div>
  );
}