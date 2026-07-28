export interface Statement {
  id: number;
  accountNumber: string;
  statementPeriod: string;
  startDate: string;
  endDate: string;
  pdfDownloadUrl: string;
  generatedAt: string;
}
