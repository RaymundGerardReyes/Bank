import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { TransactionHistoryRecord } from '@/models/TransactionTypes';

interface TransactionListItemProps {
  transaction: TransactionHistoryRecord;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
  const isInbound = transaction.entryType === 'CREDIT';
  
  const formattedDate = new Date(transaction.createdAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 group first:rounded-t-2xl last:rounded-b-2xl last:border-b-0">
      
      {/* Left Section: Icon & Details */}
      <div className="flex items-center gap-4">
        
        {/* Dynamic Icon based on Inbound/Outbound */}
        <div className={`p-3 rounded-full flex-shrink-0 ${
          isInbound ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
        }`}>
          {isInbound ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>

        {/* Transaction Text Details */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-slate-900">
            {isInbound ? `From: ${transaction.senderName}` : `To: ${transaction.recipientName}`}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px] md:max-w-md">
            {transaction.description || (isInbound ? 'Incoming Transfer' : 'Outgoing Transfer')}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right Section: Amount & Status */}
      <div className="flex flex-col items-end gap-1">
        <span className={`text-base font-bold ${
          isInbound ? 'text-emerald-600' : 'text-slate-900'
        }`}>
          {isInbound ? '+' : '-'} {transaction.currency} {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          {transaction.status === 'COMPLETED' && (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Completed</span>
            </>
          )}
          {transaction.status === 'FAILED' && (
            <>
              <XCircle className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-medium text-red-600 uppercase tracking-wider">Failed</span>
            </>
          )}
          {transaction.status === 'PENDING' && (
            <>
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">Pending</span>
            </>
          )}
        </div>
        
        {/* Subtle Transaction Reference on Hover */}
        <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
          Ref: {transaction.transactionReference.substring(0, 8)}...
        </span>
      </div>

    </div>
  );
};

export default TransactionListItem;