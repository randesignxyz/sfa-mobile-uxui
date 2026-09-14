'use client';

import { TransactionTypeTag } from '@/components/ui/transaction-type-tag';
import { formatQuantity } from '@/lib/format-number';

export interface PromotionRowItem {
  id?: string | number;
  productName: string;
  type: string;
  quantity: number;
  unit: string;
}

export interface AttachedPromotionsProps {
  promotions?: PromotionRowItem[];
  showDivider?: boolean;
  className?: string;
}

/**
 * Reusable Attached Promotions component.
 * Uses a 3-column CSS Grid (Product Name | Badge | Qty & UoM)
 * where the quantity & UoM column auto-expands to the maximum width across rows.
 */
export function AttachedPromotions({
  promotions = [],
  showDivider = true,
  className = '',
}: AttachedPromotionsProps) {
  if (!promotions || promotions.length === 0) return null;

  return (
    <div className={`cart-item-attached-promos ${className}`}>
      {showDivider && <div className="attached-promo-divider" />}
      {promotions.map((promo, idx) => (
        <div key={promo.id ?? `${promo.type}-${promo.productName}-${idx}`} className="attached-promo-card">
          <span className="attached-promo-name">{promo.productName}</span>
          <div className="attached-promo-pill-qty">
            <TransactionTypeTag code={promo.type} />
            <span className="attached-promo-qty-text">
              +{formatQuantity(promo.quantity)} {promo.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AttachedPromotions;
