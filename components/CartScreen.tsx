'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PriceTier, TIERS, ProductItem } from './AddToCartScreen';
import { OrderInvoicePreview } from './OrderInvoicePreview';

export interface CartLineItem {
  id: string;
  productId: number;
  productName: string;
  productCode: string;
  productImage: string;
  imageFit?: 'contain' | 'cover';
  unit: string;
  tier: PriceTier;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CartScreenProps {
  cartLines: CartLineItem[];
  onBack: () => void;
  onReviewOrder: () => void;
  onPreview?: () => void;
  onSelectPromotion?: () => void;
  onManualPromotion?: () => void;
  onOrientationChange?: (isLandscape: boolean) => void;
}

/** Placeholder SVG icon matching image placeholders */
function PlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#ECEBED" />
      <circle cx="34" cy="16" r="4" fill="#D4D2D8" />
      <path
        d="M8 38L22 22L32 32L38 26L44 32V38C44 40.2091 42.2091 42 40 42H12C9.79086 42 8 40.2091 8 38Z"
        fill="#D4D2D8"
      />
    </svg>
  );
}

const promoProductCatalog: ProductItem[] = [
  {
    id: 1,
    category: 'Vital',
    name: 'Vital 250 mL',
    code: 'FG000012',
    pack: 'x40 bottles',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/vital-250.png',
  },
  {
    id: 2,
    category: 'Vital',
    name: 'Vital 350 mL',
    code: 'FG000013',
    pack: 'x24 bottles',
    count: 0,
    price: 2.75,
    unit: 'Case',
    image: '/assets/vital-350.jpg',
  },
  {
    id: 3,
    category: 'Vital',
    name: 'Vital 350 mL, OEM (AM)',
    code: 'FG000001',
    pack: 'x24 bottles',
    count: 0,
    price: 2.75,
    unit: 'Case',
    image: '/assets/vital-350.jpg',
  },
  {
    id: 4,
    category: 'Vital',
    name: 'Vital 500 mL',
    code: 'FG000002',
    pack: 'x24 bottles',
    count: 0,
    price: 3.0,
    unit: 'Case',
    image: '/assets/vital-500.jpg',
    imageFit: 'cover',
  },
  {
    id: 5,
    category: 'Vital',
    name: 'Vital 1.5 L',
    code: 'FG000010',
    pack: 'x12 bottles',
    count: 0,
    price: 4.5,
    unit: 'Case',
    image: '/assets/vital-1500.png',
  },
  {
    id: 8,
    category: 'Vital',
    name: 'Baby 1.0 L',
    code: 'FG000017',
    pack: 'x12 bottles',
    count: 0,
    price: 3.8,
    unit: 'Case',
    image: '',
  },
  {
    id: 6,
    category: 'Mee Chiet',
    name: 'Mee Chiet minced pork instant noodle 65g',
    code: 'FG000020',
    pack: 'x24 packs',
    count: 0,
    price: 5.5,
    unit: 'Case',
    image: '/assets/mee-chiet-pork.jpg',
    imageFit: 'cover',
  },
  {
    id: 7,
    category: 'OM',
    name: 'OM Drinking Water 500ML',
    code: 'FG000030',
    pack: 'x24 bottles',
    count: 0,
    price: 3.2,
    unit: 'Case',
    image: '/assets/vital-500.jpg',
  },
];

export type PromoTypeCode =
  | 'FOC'
  | 'TDL'
  | 'ECT'
  | 'RSD'
  | 'TDI'
  | 'TDD'
  | 'TDO'
  | 'TDP'
  | 'TRA'
  | string;

export type PromoDetailTab = 'Special Promotion' | 'Gratis';

export const PROMO_TAB_TYPES: Record<PromoDetailTab, PromoTypeCode[]> = {
  'Special Promotion': ['FOC', 'TDL', 'ECT'],
  Gratis: ['RSD', 'TDI', 'TDD'],
};

const PROMOTION_TYPES: PromoTypeCode[] = [
  'FOC',
  'TDL',
  'ECT',
  'RSD',
  'TDI',
  'TDD',
  'TDO',
  'TDP',
  'TRA',
];

export interface PromotionScheme {
  id: string;
  name: string;
  description: string;
  appliedPromotions?: {
    productName: string;
    type: PromoTypeCode;
    quantity: number;
    unit: string;
  }[];
}

const PROMOTION_SCHEMES: PromotionScheme[] = [
  {
    id: 'no-scheme',
    name: 'No Scheme',
    description: 'No description',
    appliedPromotions: [],
  },
  {
    id: 'whole-sales',
    name: 'Whole Sales',
    description: 'Vital 250mL Standard tier with 1 Case FOC, TDL, TRA',
    appliedPromotions: [
      { productName: 'Vital 250 mL', type: 'FOC', quantity: 1, unit: 'Case' },
      { productName: 'Vital 250 mL', type: 'TDL', quantity: 1, unit: 'Case' },
      { productName: 'Vital 250 mL', type: 'TRA', quantity: 1, unit: 'Case' },
    ],
  },
  {
    id: 'retailer',
    name: 'Retailer',
    description: 'Buy 100 Cases Vital 350mL get 2 Cases FOC bonus',
    appliedPromotions: [
      { productName: 'Vital 350 mL', type: 'FOC', quantity: 2, unit: 'Case' },
    ],
  },
  {
    id: 'cde',
    name: 'CDE',
    description: 'Trade allowance 2 Cases TRA + 1 Case TDL on commercial orders',
    appliedPromotions: [
      { productName: 'Vital 250 mL', type: 'TRA', quantity: 2, unit: 'Case' },
      { productName: 'Vital 250 mL', type: 'TDL', quantity: 1, unit: 'Case' },
    ],
  },
];

export function CartScreen({
  cartLines,
  onBack,
  onReviewOrder,
  onPreview,
  onSelectPromotion,
  onManualPromotion,
  onOrientationChange,
}: CartScreenProps) {
  const [toast, setToast] = useState('');
  const [isManualPromoMode, setIsManualPromoMode] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [isSelectProductModalOpen, setIsSelectProductModalOpen] = useState(false);
  const [isPromoDetailsModalOpen, setIsPromoDetailsModalOpen] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [isSelectSchemeModalOpen, setIsSelectSchemeModalOpen] = useState(false);
  const [searchSchemeQuery, setSearchSchemeQuery] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('whole-sales');
  const [selectedPromoProduct, setSelectedPromoProduct] = useState<ProductItem | null>(null);
  const [searchPromoQuery, setSearchPromoQuery] = useState('');
  const [promoCategory, setPromoCategory] = useState<'All' | 'Vital' | 'Mee Chiet' | 'OM'>('All');
  const [promoDetailTab, setPromoDetailTab] = useState<PromoDetailTab>('Special Promotion');
  const [promoQuantities, setPromoQuantities] = useState<Record<PromoTypeCode, number>>({
    FOC: 0,
    TDL: 0,
    ECT: 0,
    RSD: 0,
    TDI: 0,
    TDD: 0,
    TDO: 0,
    TDP: 0,
    TRA: 0,
  });

  const [linePromotions, setLinePromotions] = useState<
    Record<
      string,
      { productName: string; type: PromoTypeCode; quantity: number; unit: string }[]
    >
  >(() => ({
    'vital-250-std': [
      { productName: 'Vital 250 mL', type: 'FOC', quantity: 1, unit: 'Case' },
      { productName: 'Vital 250 mL', type: 'TDL', quantity: 1, unit: 'Case' },
      { productName: 'Vital 250 mL', type: 'TRA', quantity: 1, unit: 'Case' },
    ],
  }));

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  const subtotal = useMemo(() => {
    return cartLines.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartLines]);

  const discount = 0;
  const total = subtotal - discount;

  const filteredPromoProducts = useMemo(() => {
    return promoProductCatalog.filter((product) => {
      const matchCategory = promoCategory === 'All' || product.category === promoCategory;
      const q = searchPromoQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [promoCategory, searchPromoQuery]);

  const filteredSchemes = useMemo(() => {
    const q = searchSchemeQuery.trim().toLowerCase();
    if (!q) return PROMOTION_SCHEMES;
    return PROMOTION_SCHEMES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [searchSchemeQuery]);

  const handleApplyScheme = (scheme: PromotionScheme) => {
    setSelectedSchemeId(scheme.id);
    if (scheme.appliedPromotions && scheme.appliedPromotions.length > 0) {
      const targetId =
        cartLines.find((l) => l.tier === 'STD')?.id ||
        (cartLines.length > 0 ? cartLines[0].id : 'vital-250-std');
      setLinePromotions({
        [targetId]: scheme.appliedPromotions,
      });
      notify(`Applied "${scheme.name}"`);
    } else {
      setLinePromotions({});
      notify('Removed promotion scheme');
    }
    setIsSelectSchemeModalOpen(false);
  };

  const handleSelectPromoProduct = (product: ProductItem) => {
    setSelectedPromoProduct(product);
    setPromoDetailTab('Special Promotion');

    // If this specific line already has confirmed promotions, load them; otherwise start with 0 (no auto-select)
    const targetId =
      selectedLineId ||
      cartLines.find((l) => l.tier === 'STD')?.id ||
      (cartLines.length > 0 ? cartLines[0].id : '1-std');

    const existing = linePromotions[targetId];
    if (existing && existing.length > 0) {
      const initialMap: Record<PromoTypeCode, number> = {
        FOC: 0,
        TDL: 0,
        ECT: 0,
        RSD: 0,
        TDI: 0,
        TDD: 0,
        TDO: 0,
        TDP: 0,
        TRA: 0,
      };
      existing.forEach((p) => {
        if (p.quantity > 0) {
          initialMap[p.type] = (initialMap[p.type] || 0) + p.quantity;
        }
      });
      setPromoQuantities(initialMap);
    } else {
      // Do not auto-select: start with 0 for all promotion types
      setPromoQuantities({
        FOC: 0,
        TDL: 0,
        ECT: 0,
        RSD: 0,
        TDI: 0,
        TDD: 0,
        TDO: 0,
        TDP: 0,
        TRA: 0,
      });
    }

    setIsSelectProductModalOpen(false);
    setIsPromoDetailsModalOpen(true);
  };

  const handleUpdatePromoQty = (type: PromoTypeCode, delta: number) => {
    setPromoQuantities((prev) => {
      const current = prev[type] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [type]: next };
    });
  };

  const handleConfirmPromotion = () => {
    const promoItems: {
      productName: string;
      type: PromoTypeCode;
      quantity: number;
      unit: string;
    }[] = [];

    Object.entries(promoQuantities).forEach(([typeKey, qty]) => {
      if (qty > 0) {
        promoItems.push({
          productName: selectedPromoProduct?.name || 'Vital 250 mL',
          type: typeKey as PromoTypeCode,
          quantity: qty,
          unit: selectedPromoProduct?.unit || 'Case',
        });
      }
    });

    if (promoItems.length > 0) {
      const targetId =
        selectedLineId ||
        cartLines.find((l) => l.tier === 'STD')?.id ||
        (cartLines.length > 0 ? cartLines[0].id : 'default');

      setLinePromotions((prev) => ({
        ...prev,
        [targetId]: promoItems,
      }));
      notify('Promotion confirmed and attached to cart');
    } else {
      if (selectedLineId) {
        setLinePromotions((prev) => {
          const next = { ...prev };
          delete next[selectedLineId];
          return next;
        });
      }
    }

    setIsPromoDetailsModalOpen(false);
    setIsManualPromoMode(false);
    setSelectedLineId(null);
  };

  return (
    <div className="cart-view-screen" aria-label="Shopping Cart">
      {/* Top Device Status Bar */}
      <div className="device-status" aria-label="Device status">
        <span>8:21</span>
        <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
        <div className="device-icons" aria-hidden="true">
          <img src="/assets/wifi.svg" alt="" />
          <img src="/assets/signal.svg" alt="" />
          <img className="battery" src="/assets/battery.svg" alt="" />
        </div>
      </div>

      {/* Screen Navigation Header */}
      <div className="cart-view-nav">
        {isManualPromoMode ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="icon-button back-button"
            onClick={() => {
              setIsManualPromoMode(false);
              setSelectedLineId(null);
            }}
            aria-label="Back to Cart"
          >
            <img src="/assets/arrow-left.svg" alt="Back" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            className="icon-button back-button"
            onClick={onBack}
            aria-label="Go back"
          >
            <img src="/assets/arrow-left.svg" alt="Back" />
          </Button>
        )}

        <div className="cart-title-group">
          <h1 className="cart-header-title">
            {isManualPromoMode ? 'Manual Promotion' : 'Carts'}
          </h1>
        </div>

        {!isManualPromoMode ? (
          <button
            type="button"
            className="manual-promotion-btn"
            onClick={() => {
              setIsManualPromoMode(true);
              setSelectedLineId(null);
            }}
          >
            Manual Promotion
          </button>
        ) : (
          <div className="nav-spacer" />
        )}
      </div>

      <div className="cart-view-content">
        {/* Promotions Card (Hidden in Manual Promotion mode) */}
        {!isManualPromoMode && (
          <div className="promotions-card">
            <div className="promotions-info">
              <span className="promotions-label">Promotions</span>
              <span className="promotions-count">
                ({Object.keys(linePromotions).length > 0 ? 1 : 0})
              </span>
            </div>

            <button
              type="button"
              className="select-promotion-btn"
              onClick={() => {
                if (onSelectPromotion) onSelectPromotion();
                setIsSelectSchemeModalOpen(true);
              }}
            >
              Select Promotion
            </button>
          </div>
        )}

        {/* Cart Line Item Cards */}
        <div className="cart-lines-list">
          {cartLines.map((item) => {
            const tierConfig = TIERS[item.tier] || TIERS.STD;
            const isEligible = item.tier === 'STD' || item.unitPrice > 0;
            const isSelected = selectedLineId === item.id;

            return (
              <article
                key={item.id}
                className={`cart-item-card ${
                  isManualPromoMode && isEligible ? 'is-selectable' : ''
                } ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  if (isManualPromoMode && isEligible) {
                    setSelectedLineId(isSelected ? null : item.id);
                  }
                }}
              >
                <div className="cart-item-top">
                  <div className="cart-item-thumb">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className={`cart-thumb-img ${
                          item.imageFit === 'cover' ? 'is-cover' : ''
                        }`}
                      />
                    ) : (
                      <PlaceholderIcon className="cart-thumb-svg" />
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.productName}</h2>
                    <span className="cart-item-sku">{item.productCode}</span>
                  </div>
                </div>

                <div className="cart-item-meta-row">
                  <div className="meta-left">
                    {isManualPromoMode && isEligible && (
                      <div
                        className={`manual-promo-radio ${
                          isSelected ? 'is-selected' : ''
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && <span className="radio-inner-dot" />}
                      </div>
                    )}

                    <span className="meta-rate-calc">
                      ${item.unitPrice.toFixed(3)} x {item.quantity} {item.unit || 'Case'}
                    </span>
                    <span
                      className="summary-tier-badge"
                      style={{
                        backgroundColor: tierConfig.badgeBg,
                        color: tierConfig.badgeColor,
                      }}
                    >
                      {item.tier}
                    </span>
                  </div>

                  <span className="meta-right-price">
                    ${item.totalPrice.toFixed(3)}
                  </span>
                </div>

                <div className="cart-item-amount-row">
                  <span className="amount-label">Amount</span>
                  <span className="amount-val">
                    ${item.totalPrice.toFixed(3)}
                  </span>
                </div>

                {/* Attached Promotions Sub-Cards */}
                {linePromotions[item.id] && linePromotions[item.id].length > 0 && (
                  <div className="cart-item-attached-promos">
                    <div className="attached-promo-divider" />
                    {linePromotions[item.id].map((promo, idx) => (
                      <div key={idx} className="attached-promo-card">
                        <span className="attached-promo-name">{promo.productName}</span>
                        <div className="attached-promo-pill-qty">
                          <span className="attached-promo-type-badge">{promo.type}</span>
                          <span className="attached-promo-qty-text">
                            +{promo.quantity} {promo.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Order Summary & CTA */}
      <div className="cart-summary-footer">
        <div className="summary-calc-row">
          <span className="summary-calc-label">Subtotal</span>
          <span className="summary-calc-val">${subtotal.toFixed(3)}</span>
        </div>

        <div className="summary-calc-row">
          <span className="summary-calc-label">Discount</span>
          <span className="summary-calc-val">-${discount.toFixed(3)}</span>
        </div>

        <div className="summary-calc-row total-row-bold">
          <span className="summary-total-label">Total</span>
          <span className="summary-total-amount">${total.toFixed(3)}</span>
        </div>

        {isManualPromoMode ? (
          <div className="manual-promo-actions-row">
            <button
              type="button"
              className="promo-cancel-btn"
              onClick={() => {
                setIsManualPromoMode(false);
                setSelectedLineId(null);
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className={`promo-select-item-btn ${
                selectedLineId ? 'is-active' : 'is-disabled'
              }`}
              onClick={() => {
                if (selectedLineId) {
                  setIsSelectProductModalOpen(true);
                }
              }}
              disabled={!selectedLineId}
            >
              Select Item
            </button>
          </div>
        ) : (
          <div className="cart-main-actions-row">
            <button
              type="button"
              className="cart-preview-btn"
              onClick={() => {
                if (onPreview) onPreview();
                setIsInvoicePreviewOpen(true);
              }}
            >
              Preview
            </button>

            <button
              type="button"
              className="review-order-btn"
              onClick={onReviewOrder}
            >
              Review Order
            </button>
          </div>
        )}
      </div>

      {/* Select Product Bottom Sheet Modal */}
      {isSelectProductModalOpen && (
        <div
          className="select-promo-modal-backdrop"
          onClick={() => setIsSelectProductModalOpen(false)}
        >
          <div
            className="select-promo-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Select Product"
          >
            <div className="sheet-drag-handle" />

            {/* Modal Header */}
            <div className="select-promo-modal-header">
              <div className="modal-title-wrap">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b49a00"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="promo-tag-icon"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <h2 className="modal-title-text">Select Product</h2>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSelectProductModalOpen(false)}
                aria-label="Close"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#52525b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-header-divider" />

            {/* Search Input Bar */}
            <div className="modal-search-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchPromoQuery}
                onChange={(e) => setSearchPromoQuery(e.target.value)}
                placeholder="Search by name or code..."
                className="modal-search-input"
              />
              {searchPromoQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchPromoQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="modal-category-chips">
              {(['All', 'Vital', 'Mee Chiet', 'OM'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`modal-cat-chip ${
                    promoCategory === cat ? 'is-active' : ''
                  }`}
                  onClick={() => setPromoCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div className="modal-products-list">
              {filteredPromoProducts.map((product) => (
                <article
                  key={product.id}
                  className="modal-product-card"
                  onClick={() => handleSelectPromoProduct(product)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="modal-product-thumb">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`modal-thumb-img ${
                          product.imageFit === 'cover' ? 'is-cover' : ''
                        }`}
                      />
                    ) : (
                      <PlaceholderIcon className="modal-thumb-placeholder" />
                    )}
                  </div>

                  <div className="modal-product-info">
                    <h3 className="modal-product-name">{product.name}</h3>
                    <span className="modal-product-sku">{product.code}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Promotion Details Bottom Sheet Modal */}
      {isPromoDetailsModalOpen && (
        <div
          className="select-promo-modal-backdrop"
          onClick={() => setIsPromoDetailsModalOpen(false)}
        >
          <div
            className="select-promo-modal-sheet promo-details-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Promotion Details"
          >
            <div className="sheet-drag-handle" />

            {/* Modal Header */}
            <div className="promo-details-modal-header">
              <button
                type="button"
                className="promo-back-box-btn"
                onClick={() => {
                  setIsPromoDetailsModalOpen(false);
                  setIsSelectProductModalOpen(true);
                }}
                aria-label="Back to select product"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#18181b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <h2 className="promo-details-title-text">Promotion Details</h2>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setIsPromoDetailsModalOpen(false);
                  setIsManualPromoMode(false);
                }}
                aria-label="Close"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#52525b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-header-divider" />

            {/* Promotion Details Category Tabs */}
            <div className="promo-details-tabs-bar" role="tablist" aria-label="Promotion categories">
              {(['Special Promotion', 'Gratis'] as PromoDetailTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={promoDetailTab === tab}
                  className={`promo-details-tab-btn ${
                    promoDetailTab === tab ? 'is-active' : ''
                  }`}
                  onClick={() => setPromoDetailTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="promo-types-section-title">
              {promoDetailTab === 'Special Promotion' ? 'SPECIAL PROMOTION TYPES' : 'GRATIS TYPES'}
            </div>

            {/* Promotion Types Stepper List for Selected Tab */}
            <div className="promo-types-list">
              {PROMO_TAB_TYPES[promoDetailTab].map((type) => {
                const qty = promoQuantities[type] || 0;
                const isActive = qty > 0;

                return (
                  <div
                    key={type}
                    className={`promo-type-card ${
                      isActive ? 'is-active' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className={`promo-type-pill ${
                        isActive ? 'is-active' : ''
                      }`}
                      onClick={() => handleUpdatePromoQty(type, qty === 0 ? 1 : -qty)}
                      aria-label={`Toggle ${type}`}
                    >
                      {type}
                    </button>

                    <div className="promo-stepper-wrap">
                      <div className="promo-stepper-control">
                        <button
                          type="button"
                          className="promo-step-btn"
                          onClick={() => handleUpdatePromoQty(type, -1)}
                          disabled={qty === 0}
                          aria-label={`Decrease ${type}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={qty > 0 ? '#b49a00' : '#9ca3af'}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>

                        <span className="promo-step-qty">{qty}</span>

                        <button
                          type="button"
                          className="promo-step-btn"
                          onClick={() => handleUpdatePromoQty(type, 1)}
                          aria-label={`Increase ${type}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#b49a00"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      <span className="promo-unit-label">Case</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirm Promotion CTA */}
            <button
              type="button"
              className="confirm-promotion-cta-btn"
              onClick={handleConfirmPromotion}
            >
              Confirm Promotion
            </button>
          </div>
        </div>
      )}

      {/* Select Promotion Scheme Bottom Sheet Modal */}
      {isSelectSchemeModalOpen && (
        <div
          className="select-promo-modal-backdrop"
          onClick={() => setIsSelectSchemeModalOpen(false)}
        >
          <div
            className="select-promo-modal-sheet scheme-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Select Promotion"
          >
            <div className="sheet-drag-handle" />

            <div className="select-promo-modal-header">
              <h2 className="modal-title-text select-scheme-title">Select Promotion</h2>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSelectSchemeModalOpen(false)}
                aria-label="Close"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#52525b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="modal-search-box scheme-search-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="modal-search-icon"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                type="text"
                className="modal-search-input"
                placeholder="Search by name or description..."
                value={searchSchemeQuery}
                onChange={(e) => setSearchSchemeQuery(e.target.value)}
              />

              {searchSchemeQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchSchemeQuery('')}
                  aria-label="Clear search"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Schemes List */}
            <div className="schemes-list">
              {filteredSchemes.map((scheme) => {
                const isCurrent =
                  selectedSchemeId === scheme.id &&
                  (scheme.id === 'no-scheme'
                    ? Object.keys(linePromotions).length === 0
                    : Object.keys(linePromotions).length > 0);

                return (
                  <article
                    key={scheme.id}
                    className={`scheme-card ${isCurrent ? 'is-selected' : ''}`}
                  >
                    <div className="scheme-info">
                      <h3 className="scheme-name">{scheme.name}</h3>
                      <p className="scheme-description">{scheme.description}</p>
                    </div>

                    <button
                      type="button"
                      className={`scheme-apply-btn ${isCurrent ? 'is-applied' : ''}`}
                      onClick={() => handleApplyScheme(scheme)}
                    >
                      {isCurrent ? 'Applied' : 'Apply'}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Order Invoice / PDF Form Preview Screen */}
      {isInvoicePreviewOpen && (
        <OrderInvoicePreview
          cartLines={cartLines}
          linePromotions={linePromotions}
          subtotal={subtotal}
          discount={discount}
          total={total}
          outletName="Bun Sophear"
          onClose={() => {
            if (onOrientationChange) onOrientationChange(false);
            setIsInvoicePreviewOpen(false);
          }}
          onConfirmOrder={onReviewOrder}
          onOrientationChange={onOrientationChange}
        />
      )}

      {toast && (
        <div className="toast-message" role="status">
          {toast}
        </div>
      )}

      {/* Home Indicator */}
      <footer className="home-indicator" aria-hidden="true">
        <span />
      </footer>
    </div>
  );
}
