const quantityFormatter = new Intl.NumberFormat('en-US');
const moneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatQuantity = (value: number) => quantityFormatter.format(value);
export const formatMoney = (value: number) => moneyFormatter.format(value);
