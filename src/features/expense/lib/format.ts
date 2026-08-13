export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 8) return accountNumber;

  const head = accountNumber.slice(0, 4);
  const tail = accountNumber.slice(-4);

  return `${head}-****-${tail}`;
}