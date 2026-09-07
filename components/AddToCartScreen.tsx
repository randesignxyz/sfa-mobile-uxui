'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

export type PriceTier = 'STD' | 'TDD' | 'PROMO' | 'FOC';

export interface TierInfo {
  code: PriceTier;
  label: string;
  badgeBg: string;
  badgeColor: string;
  rateMultiplier: number;
}

export const TIERS: Record<PriceTier, TierInfo> = {
  STD: {
    code: 'STD',
    label: 'Standard',
    badgeBg: '#fef9c3',
    badgeColor: '#b49a00',
    rateMultiplier: 1.0,
  },
  TDD: {
    code: 'TDD',
    label: 'Trade Deal',
    badgeBg: '#e8f8f0',
    badgeColor: '#059669',
    rateMultiplier: 0.0,
  },
  PROMO: {
    code: 'PROMO',
    label: 'Promotion',
    badgeBg: '#e0f2fe',
    badgeColor: '#0284c7',
    rateMultiplier: 0.75,
  },
  FOC: {
    code: 'FOC',
    label: 'Free of Charge',
    badgeBg: '#fef3c7',
    badgeColor: '#d97706',
    rateMultiplier: 0.0,
  },
};

export type ProductItem = {
  id: number;
  category: string;
  name: string;
  code: string;
  pack: string;
  count: number;
  price: number;
  unit: string;
  image: string;
  imageFit?: 'contain' | 'cover';
};

interface AddToCartScreenProps {
  product: ProductItem;
  initialTiers?: Record<PriceTier, number>;
  initialRemark?: string;
  onBack: () => void;
  onAddToCart: (
    product: ProductItem,
    totalQuantity: number,
    tierBreakdown?: Record<PriceTier, number>,
    remark?: string,
  ) => void;
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

export function AddToCartScreen({
  product,
  initialTiers,
  initialRemark,
  onBack,
  onAddToCart,
}: AddToCartScreenProps) {
  // Store quantities for each tier based on initial product state
  const [tierQuantities, setTierQuantities] = useState<Record<PriceTier, number>>(() => {
    if (initialTiers) return initialTiers;
    if (product.id === 1) {
      return { STD: 80, TDD: 20, PROMO: 0, FOC: 0 };
    }
    if (product.count > 0) {
      return { STD: product.count, TDD: 0, PROMO: 0, FOC: 0 };
    }
    return { STD: 0, TDD: 0, PROMO: 0, FOC: 0 };
  });

  const [activeTier, setActiveTier] = useState<PriceTier>(() => {
    if (initialTiers?.TDD && initialTiers.TDD > 0) return 'TDD';
    if (product.id === 1) return 'TDD';
    return 'STD';
  });
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [remark, setRemark] = useState(() => initialRemark ?? (product.id === 1 ? 'ផលិតផលលើកទឹកចិត្តការតាំងលក់ផលិតផល' : ''));
  const [isRemarkFocused, setIsRemarkFocused] = useState(false);

  const currentTierConfig = TIERS[activeTier];
  const activeUnitPrice = product.price * currentTierConfig.rateMultiplier;

  const currentQuantity = tierQuantities[activeTier] || 0;
  const [inputValue, setInputValue] = useState(currentQuantity.toString());

  // Calculate breakdown items that have quantity > 0
  const summaryBreakdown = useMemo(() => {
    return (Object.keys(TIERS) as PriceTier[])
      .filter((tier) => tierQuantities[tier] > 0)
      .map((tier) => {
        const qty = tierQuantities[tier];
        const unitPrice = product.price * TIERS[tier].rateMultiplier;
        const total = qty * unitPrice;
        return {
          tier,
          config: TIERS[tier],
          qty,
          unitPrice,
          total,
        };
      });
  }, [tierQuantities, product.price]);

  // Combined grand total
  const grandTotal = useMemo(() => {
    return summaryBreakdown.reduce((sum, item) => sum + item.total, 0);
  }, [summaryBreakdown]);

  const totalQuantity = useMemo(() => {
    return summaryBreakdown.reduce((sum, item) => sum + item.qty, 0);
  }, [summaryBreakdown]);

  // When switching active tier
  const handleSelectTier = (tier: PriceTier) => {
    setActiveTier(tier);
    setTierDropdownOpen(false);
    const qty = tierQuantities[tier] || 0;
    setInputValue(qty.toString());
  };

  const updateActiveTierQuantity = (qty: number) => {
    setTierQuantities((prev) => ({
      ...prev,
      [activeTier]: qty,
    }));
  };

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      if (inputValue.length <= 1 || inputValue === '0') {
        setInputValue('0');
        updateActiveTierQuantity(0);
      } else {
        const nextVal = inputValue.slice(0, -1);
        const parsed = parseInt(nextVal, 10) || 0;
        setInputValue(nextVal);
        updateActiveTierQuantity(parsed);
      }
    } else if (key === 'clear') {
      setInputValue('0');
      updateActiveTierQuantity(0);
    } else {
      let nextVal = inputValue;
      if (inputValue === '0' || inputValue === '') {
        nextVal = key;
      } else {
        if (inputValue.length < 5) {
          nextVal = inputValue + key;
        }
      }
      const parsed = parseInt(nextVal, 10) || 0;
      setInputValue(nextVal);
      updateActiveTierQuantity(parsed);
    }
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setInputValue('');
      updateActiveTierQuantity(0);
      return;
    }
    const parsed = parseInt(val, 10);
    setInputValue(parsed.toString());
    updateActiveTierQuantity(parsed);
  };

  const handleBlur = () => {
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      setInputValue('0');
      updateActiveTierQuantity(0);
    } else {
      const parsed = parseInt(inputValue, 10);
      setInputValue(parsed.toString());
      updateActiveTierQuantity(parsed);
    }
  };

  const handleConfirm = () => {
    onAddToCart(product, totalQuantity, tierQuantities, remark);
  };

  const remarkSuggestions = [
    'ផលិតផលលើកទឹកចិត្តការតាំងលក់ផលិតផល',
    'ប្រូម៉ូសិនពិសេសប្រចាំខែ',
    'ទិញ ៤ កេះ ថែម ១ កេះ',
    'គំរូសាកល្បង',
  ];

  const handleRemoveTier = (tierToRemove: PriceTier) => {
    setTierQuantities((prev) => ({
      ...prev,
      [tierToRemove]: 0,
    }));
    if (activeTier === tierToRemove) {
      setInputValue('0');
    }
  };

  return (
    <div
      className="add-to-cart-screen"
      aria-label={`Add ${product.name} to cart`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          showKeyboard &&
          !target.closest('.numeric-keyboard-panel') &&
          !target.closest('.quantity-input-field')
        ) {
          setShowKeyboard(false);
        }
        if (
          isRemarkFocused &&
          !target.closest('.remark-input-container') &&
          !target.closest('.remark-suggestions-container')
        ) {
          setIsRemarkFocused(false);
        }
      }}
    >
      {/* Top Device Status Bar */}
      <div className="device-status" aria-label="Device status">
        <span>9:20</span>
        <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
        <div className="device-icons" aria-hidden="true">
          <img src="/assets/wifi.svg" alt="" />
          <img src="/assets/signal.svg" alt="" />
          <img className="battery" src="/assets/battery.svg" alt="" />
        </div>
      </div>

      {/* Screen Navigation Header */}
      <div className="cart-screen-nav">
        <Button
          variant="ghost"
          size="icon-sm"
          className="icon-button back-button"
          onClick={onBack}
          aria-label="Go back"
        >
          <img src="/assets/arrow-left.svg" alt="Back" />
        </Button>

        <div className="nav-spacer" />
      </div>

      <div className="cart-screen-content">
        {/* Product Details Section */}
        <div className="product-summary-card">
          <div className="product-thumb-container">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className={`product-thumb-img ${
                  product.imageFit === 'cover' ? 'is-cover' : ''
                }`}
              />
            ) : (
              <PlaceholderIcon className="product-thumb-placeholder" />
            )}
          </div>

          <div className="product-summary-info">
            <h2 className="product-summary-title">{product.name}</h2>
            <div className="product-summary-sku">{product.code}</div>

            <div className="price-tier-inline-row">
              <span className="product-summary-price">
                ${activeUnitPrice.toFixed(3)}
              </span>

              <div className="tier-dropdown-wrap">
                <button
                  type="button"
                  className="std-badge-btn"
                  style={{
                    backgroundColor: currentTierConfig.badgeBg,
                    color: currentTierConfig.badgeColor,
                  }}
                  onClick={() => setTierDropdownOpen((prev) => !prev)}
                  aria-expanded={tierDropdownOpen}
                >
                  <span>{activeTier}</span>
                  <svg
                    className="std-chevron"
                    style={{ color: currentTierConfig.badgeColor }}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {tierDropdownOpen && (
                  <div className="tier-dropdown-menu">
                    {(['STD', 'TDD'] as PriceTier[]).map((tierKey) => {
                      const tier = TIERS[tierKey];
                      return (
                        <button
                          key={tierKey}
                          type="button"
                          className={`tier-option ${
                            activeTier === tierKey ? 'is-selected' : ''
                          }`}
                          onClick={() => handleSelectTier(tierKey)}
                        >
                          <span
                            className="tier-badge-indicator"
                            style={{
                              backgroundColor: tier.badgeBg,
                              color: tier.badgeColor,
                            }}
                          >
                            {tier.code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="cart-divider" />

        {/* Enter Quantity Section */}
        <div className="quantity-section">
          <h3 className="quantity-section-heading">Enter Quantity</h3>

          <div className="quantity-row">
            <div className="quantity-row-left">
              <div className="unit-icon-box">
                <PlaceholderIcon className="unit-placeholder-icon" />
              </div>
              <div className="unit-details">
                <span className="unit-name">{product.unit || 'Case'}</span>
                <span className="unit-price-rate">
                  ${activeUnitPrice.toFixed(3)}/ {product.unit || 'Case'}
                </span>
              </div>
            </div>

            <div className="quantity-row-right">
              <div className="unit-row-price">${activeUnitPrice.toFixed(3)}</div>
              <div className="quantity-input-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={inputValue}
                  onChange={handleQuantityInputChange}
                  onFocus={() => setShowKeyboard(true)}
                  onClick={() => setShowKeyboard(true)}
                  onBlur={handleBlur}
                  className={`quantity-input-field ${
                    showKeyboard ? 'is-focused' : ''
                  }`}
                  placeholder="0"
                  aria-label="Enter quantity"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Tier Summary Breakdown Section */}
        {summaryBreakdown.length > 0 && (
          <div className="order-summary-section">
            <h3 className="summary-section-heading">Summary</h3>

            <div className="summary-breakdown-list">
              {summaryBreakdown.map((item) => (
                <div
                  key={item.tier}
                  className={`summary-breakdown-row ${
                    activeTier === item.tier ? 'is-active-tier' : ''
                  }`}
                  onClick={() => handleSelectTier(item.tier)}
                  title="Click to edit quantity for this tier"
                >
                  <div className="summary-row-left">
                    <span className="summary-row-qty">
                      x{item.qty} {product.unit || 'Case'}
                    </span>
                    <span
                      className="summary-tier-badge"
                      style={{
                        backgroundColor: item.config.badgeBg,
                        color: item.config.badgeColor,
                      }}
                    >
                      {item.tier}
                    </span>
                  </div>

                  <div className="summary-row-right">
                    <span className="summary-row-price">
                      ${item.total.toFixed(3)}
                    </span>
                    <button
                      type="button"
                      className="remove-tier-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTier(item.tier);
                      }}
                      aria-label={`Remove ${item.tier} tier`}
                      title={`Remove ${item.tier} tier`}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Label Remark Box (44px Height Single Line) */}
            <div
              className="remark-input-container-44"
              onClick={() => {
                setShowKeyboard(false);
                setIsRemarkFocused(true);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowKeyboard(false);
                  setIsRemarkFocused(true);
                }
              }}
            >
              <label className="remark-floating-label">Remark *</label>
              <div className="remark-input-inner">
                <input
                  type="text"
                  value={remark}
                  readOnly
                  className="remark-single-input"
                  placeholder="Tap to select or enter remark..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Sheet for Remark Suggestions */}
      {isRemarkFocused && (
        <div className="remark-sheet-backdrop" onClick={() => setIsRemarkFocused(false)}>
          <div
            className="remark-sheet-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Remark Suggestions"
          >
            <div className="sheet-drag-handle" />

            <div className="remark-sheet-header">
              <div className="sheet-title-wrap">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="sparkle-icon"
                >
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
                <span className="sheet-title">Select Remark</span>
              </div>
            </div>

            {/* Editable input inside sheet */}
            <div className="sheet-input-box">
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                autoFocus
                placeholder="Type custom remark..."
                className="sheet-edit-input"
              />
              {remark.length > 0 && (
                <button
                  type="button"
                  className="sheet-input-clear"
                  onClick={() => setRemark('')}
                  aria-label="Clear"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <div className="sheet-suggestions-list">
              <span className="sheet-suggestions-label">Quick Suggestions:</span>
              <div className="sheet-chips-wrap">
                {remarkSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    className={`sheet-chip ${remark === sug ? 'is-selected' : ''}`}
                    onClick={() => {
                      setRemark(sug);
                      setIsRemarkFocused(false); // Auto close after selection!
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Total & CTA */}
      <div className="cart-screen-footer">
        <div className="cart-total-bar">
          <span className="cart-total-label">Total</span>
          <span className="cart-total-amount">${grandTotal.toFixed(3)}</span>
        </div>

        <button
          type="button"
          className="add-to-cart-btn is-active"
          onClick={handleConfirm}
        >
          Update Cart
        </button>
      </div>

      {/* On-Screen Mobile Numeric Keyboard */}
      {showKeyboard && (
        <div
          className="numeric-keyboard-panel"
          role="region"
          aria-label="Numeric Keyboard"
        >
          <div className="keyboard-toolbar">
            <span className="keyboard-title">
              Quantity for {activeTier} ({product.unit || 'Case'})
            </span>
            <button
              type="button"
              className="keyboard-done-btn"
              onClick={() => setShowKeyboard(false)}
            >
              Done
            </button>
          </div>

          <div className="keyboard-grid">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num, i) => {
              const subs = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];
              return (
                <button
                  key={num}
                  type="button"
                  className="key-btn"
                  onClick={() => handleKeyPress(num)}
                >
                  <span className="key-num">{num}</span>
                  {subs[i] ? <span className="key-sub">{subs[i]}</span> : null}
                </button>
              );
            })}

            <button
              type="button"
              className="key-btn key-special"
              onClick={() => handleKeyPress('clear')}
              aria-label="Clear"
            >
              <span className="key-txt">C</span>
            </button>
            <button
              type="button"
              className="key-btn"
              onClick={() => handleKeyPress('0')}
            >
              <span className="key-num">0</span>
            </button>
            <button
              type="button"
              className="key-btn key-special key-backspace"
              onClick={() => handleKeyPress('backspace')}
              aria-label="Backspace"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Home Indicator */}
      <footer className="home-indicator" aria-hidden="true">
        <span />
      </footer>
    </div>
  );
}
