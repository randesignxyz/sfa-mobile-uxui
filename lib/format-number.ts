const quantityFormatter = new Intl.NumberFormat('en-US');
const moneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export const formatQuantity = (value: number) => quantityFormatter.format(value);
export const formatMoney = (value: number) => moneyFormatter.format(value);
