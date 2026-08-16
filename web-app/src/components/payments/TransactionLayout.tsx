import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Card } from "../common/Card";
import { TransactionState } from "@/models/TransactionTypes";
import { TransactionProgress } from "./TransactionProgress";

interface TransactionLayoutProps {
  title: string;
  subtitle: string;
  currentState?: TransactionState;
  children: React.ReactNode;
}

export const TransactionLayout: React.FC<TransactionLayoutProps> = ({ title, subtitle, currentState, children }) => {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation */}
      <Link href="/transfers" className="inline-flex items-center gap-2 text-accent/60 hover:text-accent font-semibold transition-colors w-fit">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Options
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-accent tracking-tight">{title}</h1>
        <p className="text-sm text-accent/70 font-medium mt-1">{subtitle}</p>
      </div>

      {currentState && <TransactionProgress currentState={currentState} />}

      {/* Main Content Area */}
      <Card className="border-none shadow-2xl shadow-secondary/10 bg-surface/80 backdrop-blur-xl p-6 sm:p-8">
        {children}
      </Card>
    </div>
  );
};
