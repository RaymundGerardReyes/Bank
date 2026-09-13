"use client";

import { AccountBalanceCard } from "@/components/features/accounts/AccountBalanceCard";
import { MaskedBalance } from "@/components/ui/MaskedBalance";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Account } from "@/models/ApiResponse";
import { accountService } from "@/services/account/accountService";
import { fxService, DEFAULT_RATES_TO_PHP } from "@/services/fx/fxService";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratesToPhp, setRatesToPhp] = useState<Record<string, number>>(DEFAULT_RATES_TO_PHP);

  useEffect(() => {
    Promise.all([
      accountService.getAccounts(),
      fxService.getRates("PHP"),
    ])
      .then(([accountsRes, fxRes]) => {
        setAccounts(accountsRes.data || []);
        if (fxRes?.ratesToPhp) {
          setRatesToPhp(fxRes.ratesToPhp);
        }
      })
      .catch((err) => console.error("Failed to load accounts or FX rates", err))
      .finally(() => setLoading(false));
  }, []);

  // Currency-Segregated Portfolio Breakdown
  const balancesByCurrency = useMemo(() => {
    return accounts
      .filter((acc) => !acc.accountNumber.startsWith("MERCHANT-SETTLEMENT-"))
      .reduce<Record<string, number>>((result, account) => {
        const curr = account.currency || "PHP";
        result[curr] = (result[curr] ?? 0) + Number(account.balance || 0);
        return result;
      }, {});
  }, [accounts]);

  // Unified Grand Total Net Liquidity Converted to Philippine Peso (Core Bank Currency)
  const totalNetLiquidityInPhp = useMemo(() => {
    return accounts
      .filter((acc) => !acc.accountNumber.startsWith("MERCHANT-SETTLEMENT-"))
      .reduce((sum, account) => {
        const curr = account.currency || "PHP";
        const bal = Number(account.balance || 0);
        return sum + fxService.convertAmountToPhp(bal, curr, ratesToPhp);
      }, 0);
  }, [accounts, ratesToPhp]);

  // Enterprise VAM Grouping
  const mainAccounts = useMemo(() => {
    return accounts.filter(
      (acc) => !acc.parentAccountId && !acc.accountNumber.startsWith("MERCHANT-SETTLEMENT-")
    );
  }, [accounts]);

  const subAccountsByParent = useMemo(() => {
    const map = new Map<string, Account[]>();
    accounts.forEach((acc) => {
      if (acc.parentAccountId) {
        const subs = map.get(acc.parentAccountId) || [];
        subs.push(acc);
        map.set(acc.parentAccountId, subs);
      }
    });
    return map;
  }, [accounts]);

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Hero Section: Visual Hierarchy & Aggregate Data */}
      <div className="bg-accent rounded-3xl p-8 md:p-10 shadow-2xl shadow-accent/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border border-accent/80 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse-glow"></div>

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-dominant/70 font-bold uppercase tracking-widest text-xs block">
              Total Net Liquidity
            </span>
            <span className="px-2 py-0.5 bg-dominant/20 text-dominant text-[10px] font-extrabold rounded-md uppercase tracking-wider">
              PHP (₱) Core
            </span>
          </div>

          <div className="mt-1">
            <h2 className="text-4xl md:text-6xl font-black text-dominant tracking-tight">
              <MaskedBalance amount={totalNetLiquidityInPhp} currency="₱" />
            </h2>
          </div>

          {/* Multi-Currency Sub-Accounts Breakdown */}
          {Object.keys(balancesByCurrency).length > 0 && (
            <div className="mt-6 pt-4 border-t border-dominant/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-dominant/70 uppercase tracking-widest">
                  Multi-Currency Sub-Accounts
                </span>
                <span className="text-[10px] text-dominant/60 font-semibold">
                  FX Converted to ₱
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {Object.entries(balancesByCurrency).map(([currency, total]) => {
                  const phpEquivalent = fxService.convertAmountToPhp(total, currency, ratesToPhp);
                  const isPhp = currency === "PHP";
                  return (
                    <div
                      key={currency}
                      className="flex items-center gap-2 bg-dominant/10 backdrop-blur-sm border border-dominant/15 px-3 py-1.5 rounded-xl"
                    >
                      <span className="text-[10px] font-black text-dominant/90 bg-dominant/20 px-1.5 py-0.5 rounded uppercase">
                        {currency}
                      </span>
                      <span className="text-xs font-black text-dominant">
                        <MaskedBalance
                          amount={total}
                          currency={currency === "PHP" ? "₱" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "CAD" ? "CA$" : currency + " "}
                        />
                      </span>
                      {!isPhp && (
                        <span className="text-[10px] font-medium text-dominant/60">
                          (≈ <MaskedBalance amount={phpEquivalent} currency="₱" />)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FX Rates Active
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-white/70 border border-white/10 rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
              TLS 1.3 Encrypted
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <button
            onClick={() => router.push("/transfers")}
            className="px-6 py-3 bg-dominant hover:bg-surface text-accent font-bold rounded-xl shadow-lg transition-all active:scale-95 hover:-translate-y-0.5 cursor-pointer"
          >
            Transfer Funds
          </button>
          <button
            onClick={() => router.push("/transactions/deposit")}
            className="px-6 py-3 bg-secondary/20 hover:bg-secondary/30 border border-secondary/40 text-dominant font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            Deposit Cash
          </button>
        </div>
      </div>

      {/* 2. Enterprise VAM Account Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-accent">Corporate Ledgers</h3>
          <span className="text-xs font-bold text-accent/50">
            {loading ? "Syncing..." : `${mainAccounts.length} Master Accounts Found`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-dominant/90 border border-secondary/20 rounded-3xl text-center shadow-sm">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-accent mb-2">No Accounts Found</h2>
            <p className="text-accent/60 max-w-md mb-6 font-medium text-sm">
              We could not locate a corporate master account linked to your profile.
            </p>
            <button className="px-6 py-3 bg-accent text-dominant font-bold rounded-xl hover:bg-accent/90 transition-all active:scale-95 shadow-lg">
              Contact Support
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {mainAccounts.map((mainAccount) => {
              const subAccounts = subAccountsByParent.get(mainAccount.accountNumber) || [];

              return (
                <div
                  key={mainAccount.accountNumber}
                  className="bg-dominant/90 backdrop-blur-md border border-secondary/20 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden"
                >
                  {/* Decorative faint background for Master Ledger context */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

                  {/* Master Ledger Section */}
                  <div className="relative z-10">
                    <h3 className="text-lg font-extrabold text-accent mb-4 flex items-center gap-3">
                      <div className="p-1.5 bg-accent text-dominant rounded-lg shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      {mainAccount.accountType || "MASTER"} LEDGER
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="md:col-span-1 lg:col-span-1">
                        <AccountBalanceCard account={mainAccount} />
                      </div>
                    </div>
                  </div>

                  {/* Sub-Ledgers Section */}
                  {subAccounts.length > 0 && (
                    <div className="relative z-10 pl-6 md:pl-12 border-l-2 border-dashed border-secondary/30 pt-2 flex flex-col gap-4 mt-2">
                      <h4 className="text-xs font-bold text-accent/50 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-4 h-px bg-secondary/50"></div>
                        Linked Virtual Accounts
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {subAccounts.map((sub) => (
                          <AccountBalanceCard key={sub.accountNumber} account={sub} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provision Action */}
                  <div className="relative z-10 pl-6 md:pl-12 pt-2">
                    <button
                      onClick={() => router.push(`/accounts/new?parent=${mainAccount.accountNumber}`)}
                      className="px-5 py-3 border-2 border-dashed border-secondary/40 hover:border-accent hover:bg-secondary/10 text-accent font-bold rounded-xl transition-all flex items-center gap-2 text-sm shadow-sm active:scale-95 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                      </svg>
                      Provision Sub-Account
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}