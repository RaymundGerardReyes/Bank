import React from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Lock, ArrowDownToLine, ArrowUpRightFromSquare, ShieldAlert } from 'lucide-react';
import { Account } from '@/models/ApiResponse';
import { Button } from '@/components/ui/Button';

interface AccountBalanceCardProps {
  account: Account;
  showGovernance?: boolean;
}

export const AccountBalanceCard: React.FC<AccountBalanceCardProps> = ({ account, showGovernance = false }) => {
  const router = useRouter();
  const isFrozen = account.frozen;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Account Balance Card - Light Mode */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            Account Governance
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            Account #{account.accountNumber}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {account.accountNumber}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            Live Balance
          </p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-slate-900">
              {account.currency} {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            {isFrozen ? (
              <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> FROZEN
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <Button 
            variant="primary" 
            disabled={isFrozen}
            onClick={() => router.push("/transfers")}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
          >
            Transfer
          </Button>
          <Button 
            variant="secondary"
            onClick={() => router.push(`/accounts/${account.accountNumber}`)}
            className="w-full md:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Governance Settings Section - Light Mode */}
      {showGovernance && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" /> Governance & Controller Settings
            </h3>
            <p className="text-sm text-slate-500">Manage security controls, liquidity permissions, and transfer policy restrictions.</p>
          </div>

          <div className="space-y-4">
            {/* Account Freeze Toggle */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Account Freeze State (Lockdown)</h4>
                  <p className="text-sm text-slate-500">Completely freeze this account. Strictly blocks all inbound and outbound transaction activity.</p>
                </div>
              </div>
              <input type="checkbox" className="toggle-checkbox" checked={isFrozen} readOnly />
            </div>

            {/* Allow Incoming Toggle */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Allow Incoming Transfers</h4>
                  <p className="text-sm text-slate-500">Permit deposits, internal transfers, and incoming payments to credit this account.</p>
                </div>
              </div>
              <input type="checkbox" className="toggle-checkbox" checked={account.allowIncoming} readOnly />
            </div>

            {/* Allow Outgoing Toggle */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <ArrowUpRightFromSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Allow Outgoing Transfers</h4>
                  <p className="text-sm text-slate-500">Permit withdrawals, wire payments, and outbound transfers to debit this account.</p>
                </div>
              </div>
              <input type="checkbox" className="toggle-checkbox" checked={account.allowOutgoing} readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountBalanceCard;