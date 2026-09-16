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

  // Customer Ah Da (c-2)
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

  // Customer Chhin Pov (c-9)
  if (customerId === 'c-9') {
    const pName = productName.toLowerCase();

    // 1. Vital 500 ml, if std = 500, tdo = 75, tdp = 20
    if (pName.includes('vital') && pName.includes('500') && standardQuantity >= 500) {
      return [
        { type: 'TDO', quantity: 75 },
        { type: 'TDP', quantity: 20 },
      ];
    }

    // 2. MC Pack - Machu Kroeung Beef, if std = 25, tdo = 7
    if (pName.includes('machu kroeung') && standardQuantity >= 25) {
      return [
        { type: 'TDO', quantity: 7 },
      ];
    }

    // 3. MC Pack - Duck Stew, if std = 25
    if (pName.includes('duck stew') && standardQuantity >= 25) {
      return [];
    }

    // 4. MC Cup - Shrimp Sour Soup, if std = 25, tdo = 3
    if (pName.includes('shrimp sour soup') && standardQuantity >= 25) {
      return [
        { type: 'TDO', quantity: 3 },
      ];
    }

    // 5. OM - Oyster Sauce 600g, if std = 5
    if (pName.includes('oyster sauce') && pName.includes('600') && standardQuantity >= 5) {
      return [];
    }

    // 6. OM - Soy Sauce 500 mL, if std = 5
    if (pName.includes('soy sauce') && pName.includes('500') && standardQuantity >= 5) {
      return [];
    }

    // 7. OM - Fish Sauce 500 mL, if std = 5
    if (pName.includes('fish sauce') && pName.includes('500') && standardQuantity >= 5) {
      return [];
    }
  }

  return [];
}
