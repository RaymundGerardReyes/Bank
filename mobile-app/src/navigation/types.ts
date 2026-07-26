export type AuthStackParamList = {
  Login: undefined;
  OtpVerification: { username: string };
  BiometricSetup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Accounts: undefined;
  Transfers: undefined;
  Transactions: { accountNumber?: string };
  Statements: undefined;
  Products: undefined;
  Profile: undefined;
};

export type AdminStackParamList = {
  AuditLogs: undefined;
  AccountStatusManagement: undefined;
};
