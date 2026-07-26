export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidAccountNumber = (accountNo: string): boolean => {
  return /^[A-Z0-9-]{6,20}$/.test(accountNo);
};

export const isValidAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0 && !isNaN(amount);
};
