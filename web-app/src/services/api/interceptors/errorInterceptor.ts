export function handleApiError(responseStatus: number, errorData?: Record<string, unknown>): Error {
  const message = (errorData?.message as string) || `HTTP error ${responseStatus}`;
  const error = new Error(message);
  (error as Error & { status?: number }).status = responseStatus;
  return error;
}
