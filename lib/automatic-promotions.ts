export type AutomaticPromotion = {
  type: 'TDO' | 'TDP';
  quantity: number;
};

/** Returns customer- and SKU-specific automatic promotion quantities. */
export function getAutomaticPromotions(
  customerId: string | undefined,
  productName: string,
  standardQuantity: number,
): AutomaticPromotion[] {
  // Customer Bong Tab (c-1)
  if (customerId === 'c-1') {
    if ((productName === 'Vital 250 mL' || productName.toLowerCase().includes('250')) && standardQuantity >= 500) {
      return [
        { type: 'TDO', quantity: 75 },
        { type: 'TDP', quantity: 20 },
      ];
    }
    return [];
  }

  // Customer (c-2)
  if (customerId === 'c-2') {
    if (productName === 'Vital 250 mL' && standardQuantity >= 100) {
      return [
        { type: 'TDO', quantity: 14 },
        { type: 'TDP', quantity: 4 },
      ];
    }

    if (productName === 'Vital 350 mL' && standardQuantity >= 250) {
      return [
        { type: 'TDO', quantity: 36 },
        { type: 'TDP', quantity: 10 },
      ];
    }
  }

  return [];
}
