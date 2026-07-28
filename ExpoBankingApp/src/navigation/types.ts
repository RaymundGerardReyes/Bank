export type AuthStackParamList = {
  Login: undefined;
  OtpVerification: { username: string };
  BiometricSetup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Accounts: undefined;
  Transfers: { sourceAccountNumber?: string } | undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;

  // Money Movement Screens
  TransferReview: {
    sourceAccountNumber: string;
    destinationAccountNumber: string;
    amount: number;
    description?: string;
    idempotencyKey: string;
  };
  TransferConfirm: {
    sourceAccountNumber: string;
    destinationAccountNumber: string;
    amount: number;
    description?: string;
    idempotencyKey: string;
  };
  Deposit: undefined;

  // Transactions & Ledger
  Transactions: { accountNumber?: string } | undefined;
  TransactionDetail: { transaction: any };

  // Statements
  Statements: { accountNumber?: string } | undefined;
  StatementViewer: { statement: any };

  // Profile & Security Settings
  SecuritySettings: undefined;
  DeviceManagement: undefined;
};

export type AdminStackParamList = {
  AuditLogs: undefined;
  AccountStatusManagement: undefined;
};