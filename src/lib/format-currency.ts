export function formatCurrency(
  amount: number | string | null | undefined,
  currency = 'EUR',
  locale = 'lv-LV',
): string {
  if (amount === null || amount === undefined) {
    return '€0.00';
  }

  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return '€0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}
