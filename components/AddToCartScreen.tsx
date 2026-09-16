'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TransactionTypeTag } from '@/components/ui/transaction-type-tag';
import { formatMoney, formatQuantity } from '@/lib/format-number';
import { getAutomaticPromotions } from '@/lib/automatic-promotions';

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
  packPrice?: number;
  alternatePrice?: number;
  unit: string;
  packUnit?: string;
  alternateUnit?: string;
  image: string;
  imageFit?: 'contain' | 'cover';
};

interface AddToCartScreenProps {
  product: ProductItem;
  customerId?: string;
  initialTiers?: Record<PriceTier, number>;
  initialPackQuantity?: number;
  initialAlternateQuantity?: number;
  onBack: () => void;
  onAddToCart: (
    product: ProductItem,
    totalQuantity: number,
    tierBreakdown?: Record<PriceTier, number>,
    alternateQuantity?: number,
    packQuantity?: number,
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
  customerId,
  initialTiers,
  initialPackQuantity = 0,
  initialAlternateQuantity = 0,
  onBack,
  onAddToCart,
}: AddToCartScreenProps) {
  const isEditingCartItem = initialTiers
    ? Object.values(initialTiers).some((quantity) => quantity > 0) ||
      initialPackQuantity > 0 ||
      initialAlternateQuantity > 0
    : product.count > 0;

  // Store quantities for each tier based on initial product state
  const [tierQuantities, setTierQuantities] = useState<Record<PriceTier, number>>(() => {
    if (initialTiers) return { STD: initialTiers.STD, TDD: 0, PROMO: 0, FOC: 0 };
    if (product.count > 0) {
      return { STD: product.count, TDD: 0, PROMO: 0, FOC: 0 };
    }
    return { STD: 0, TDD: 0, PROMO: 0, FOC: 0 };
  });

  const activeTier: PriceTier = 'STD';
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInputField, setActiveInputField] = useState<'main' | 'pack' | 'alternate'>('main');

  const [packQuantity, setPackQuantity] = useState(initialPackQuantity);
  const [packInputValue, setPackInputValue] = useState(initialPackQuantity.toString());

  const [alternateQuantity, setAlternateQuantity] = useState(initialAlternateQuantity);
  const [alternateInputValue, setAlternateInputValue] = useState(initialAlternateQuantity.toString());

  const currentTierConfig = TIERS[activeTier];
  const activeUnitPrice = product.price * currentTierConfig.rateMultiplier;
  const packUnitPrice = product.packPrice ?? (product.price > 5 ? 4.0 : 2.5);
  const alternateUnitPrice = product.alternatePrice ?? product.price;

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
    return (
      summaryBreakdown.reduce((sum, item) => sum + item.total, 0) +
      packQuantity * packUnitPrice +
      alternateQuantity * alternateUnitPrice
    );
  }, [summaryBreakdown, packQuantity, packUnitPrice, alternateQuantity, alternateUnitPrice]);

  const totalQuantity = useMemo(() => {
    return (
      summaryBreakdown.reduce((sum, item) => sum + item.qty, 0) +
      packQuantity +
      alternateQuantity
    );
  }, [summaryBreakdown, packQuantity, alternateQuantity]);
  const automaticPromotions = getAutomaticPromotions(
    customerId,
    product.name,
    tierQuantities.STD || 0,
  );

  const updateActiveTierQuantity = (qty: number) => {
    setTierQuantities((prev) => ({
      ...prev,
      [activeTier]: qty,
    }));
  };

  const handleKeyPress = (key: string) => {
    if (activeInputField === 'pack') {
      if (key === 'backspace') {
        if (packInputValue.length <= 1 || packInputValue === '0') {
          setPackInputValue('0');
          setPackQuantity(0);
        } else {
          const nextVal = packInputValue.slice(0, -1);
          const parsed = parseInt(nextVal, 10) || 0;
          setPackInputValue(nextVal);
          setPackQuantity(parsed);
        }
      } else if (key === 'clear') {
        setPackInputValue('0');
        setPackQuantity(0);
      } else {
        let nextVal = packInputValue;
        if (packInputValue === '0' || packInputValue === '') {
          nextVal = key;
        } else {
          if (packInputValue.length < 5) {
            nextVal = packInputValue + key;
          }
        }
        const parsed = parseInt(nextVal, 10) || 0;
        setPackInputValue(nextVal);
        setPackQuantity(parsed);
      }
    } else if (activeInputField === 'alternate') {
      if (key === 'backspace') {
        if (alternateInputValue.length <= 1 || alternateInputValue === '0') {
          setAlternateInputValue('0');
          setAlternateQuantity(0);
        } else {
          const nextVal = alternateInputValue.slice(0, -1);
          const parsed = parseInt(nextVal, 10) || 0;
          setAlternateInputValue(nextVal);
          setAlternateQuantity(parsed);
        }
      } else if (key === 'clear') {
        setAlternateInputValue('0');
        setAlternateQuantity(0);
      } else {
        let nextVal = alternateInputValue;
        if (alternateInputValue === '0' || alternateInputValue === '') {
          nextVal = key;
        } else {
          if (alternateInputValue.length < 5) {
            nextVal = alternateInputValue + key;
          }
        }
        const parsed = parseInt(nextVal, 10) || 0;
        setAlternateInputValue(nextVal);
        setAlternateQuantity(parsed);
      }
    } else {
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

  const handlePackInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setPackInputValue('');
      setPackQuantity(0);
      return;
    }
    const parsed = parseInt(val, 10);
    setPackInputValue(parsed.toString());
    setPackQuantity(parsed);
  };

  const handlePackBlur = () => {
    if (packInputValue === '' || isNaN(parseInt(packInputValue, 10))) {
      setPackInputValue('0');
      setPackQuantity(0);
    } else {
      const parsed = parseInt(packInputValue, 10);
      setPackInputValue(parsed.toString());
      setPackQuantity(parsed);
    }
  };

  const handleAlternateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setAlternateInputValue('');
      setAlternateQuantity(0);
      return;
    }
    const parsed = parseInt(val, 10);
    setAlternateInputValue(parsed.toString());
    setAlternateQuantity(parsed);
  };

  const handleAlternateBlur = () => {
    if (alternateInputValue === '' || isNaN(parseInt(alternateInputValue, 10))) {
      setAlternateInputValue('0');
      setAlternateQuantity(0);
    } else {
      const parsed = parseInt(alternateInputValue, 10);
      setAlternateInputValue(parsed.toString());
      setAlternateQuantity(parsed);
    }
  };

  const handleConfirm = () => {
    onAddToCart(product, totalQuantity, tierQuantities, alternateQuantity, packQuantity);
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
          !target.closest('.quantity-input-field') &&
          !target.closest('.cart-screen-footer')
        ) {
          setShowKeyboard(false);
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
                ${formatMoney(activeUnitPrice)}
              </span>

              <div className="tier-dropdown-wrap">
                <TransactionTypeTag code={activeTier} />
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
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`unit-icon-img ${
                      product.imageFit === 'cover' ? 'is-cover' : ''
                    }`}
                  />
                ) : (
                  <PlaceholderIcon className="unit-placeholder-icon" />
                )}
              </div>
              <div className="unit-details">
                <span className="unit-name">{product.unit || 'Case'}</span>
                <span className="unit-price-rate">
                  ${formatMoney(activeUnitPrice)}/ {product.unit || 'Case'}
                </span>
              </div>
            </div>

            <div className="quantity-row-right">
              <div className="unit-row-price">${formatMoney(currentQuantity * activeUnitPrice)}</div>
              <div className="quantity-input-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={inputValue}
                  onChange={handleQuantityInputChange}
                  onFocus={() => {
                    setActiveInputField('main');
                    setShowKeyboard(true);
                  }}
                  onClick={() => {
                    setActiveInputField('main');
                    setShowKeyboard(true);
                  }}
                  onBlur={handleBlur}
                  className={`quantity-input-field ${
                    showKeyboard && activeInputField === 'main' ? 'is-focused' : ''
                  }`}
                  placeholder="0"
                  aria-label="Enter quantity"
                />
              </div>
            </div>
          </div>

          {product.packUnit && (
            <div className="quantity-row pack-unit-row">
              <div className="quantity-row-left">
                <div className="unit-icon-box">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`unit-icon-img ${
                        product.imageFit === 'cover' ? 'is-cover' : ''
                      }`}
                    />
                  ) : (
                    <PlaceholderIcon className="unit-placeholder-icon" />
                  )}
                </div>
                <div className="unit-details">
                  <span className="unit-name">{product.packUnit}</span>
                  <span className="unit-price-rate">
                    ${formatMoney(packUnitPrice)}/ {product.packUnit}
                  </span>
                </div>
              </div>
              <div className="quantity-row-right">
                <div className="unit-row-price">${formatMoney(packQuantity * packUnitPrice)}</div>
                <div className="quantity-input-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={packInputValue}
                    onChange={handlePackInputChange}
                    onFocus={() => {
                      setActiveInputField('pack');
                      setShowKeyboard(true);
                    }}
                    onClick={() => {
                      setActiveInputField('pack');
                      setShowKeyboard(true);
                    }}
                    onBlur={handlePackBlur}
                    className={`quantity-input-field ${
                      showKeyboard && activeInputField === 'pack' ? 'is-focused' : ''
                    }`}
                    placeholder="0"
                    aria-label={`Enter ${product.packUnit} quantity`}
                  />
                </div>
              </div>
            </div>
          )}

          {product.alternateUnit && (
            <div className="quantity-row alternate-unit-row">
              <div className="quantity-row-left">
                <div className="unit-icon-box">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`unit-icon-img ${
                        product.imageFit === 'cover' ? 'is-cover' : ''
                      }`}
                    />
                  ) : (
                    <PlaceholderIcon className="unit-placeholder-icon" />
                  )}
                </div>
                <div className="unit-details">
                  <span className="unit-name">{product.alternateUnit}</span>
                  <span className="unit-price-rate">
                    ${formatMoney(alternateUnitPrice)}/ {product.alternateUnit}
                  </span>
                </div>
              </div>
              <div className="quantity-row-right">
                <div className="unit-row-price">${formatMoney(alternateQuantity * alternateUnitPrice)}</div>
                <div className="quantity-input-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={alternateInputValue}
                    onChange={handleAlternateInputChange}
                    onFocus={() => {
                      setActiveInputField('alternate');
                      setShowKeyboard(true);
                    }}
                    onClick={() => {
                      setActiveInputField('alternate');
                      setShowKeyboard(true);
                    }}
                    onBlur={handleAlternateBlur}
                    className={`quantity-input-field ${
                      showKeyboard && activeInputField === 'alternate' ? 'is-focused' : ''
                    }`}
                    placeholder="0"
                    aria-label={`Enter ${product.alternateUnit} quantity`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Total & CTA */}
      <div className={`cart-screen-footer ${showKeyboard ? 'is-keyboard-open' : ''}`}>
        {totalQuantity > 0 && !showKeyboard ? (
          <section className="footer-order-summary" aria-label="Order summary">
            <div className="footer-summary-heading">
              <span>Order Summary</span>
            </div>
            <div className="footer-summary-divider" />

            <div className="footer-summary-lines-list">
              {summaryBreakdown.map((item) => {
                const isFree = item.tier === 'FOC' || item.tier === 'TDD';
                return (
                  <div className={`footer-summary-line ${isFree ? 'is-promo-line' : ''}`} key={item.tier}>
                    <div className="footer-summary-details-group">
                      <span className={`footer-summary-qty ${isFree ? 'is-promo-qty' : ''}`}>
                        {isFree ? '+' : ''}{formatQuantity(item.qty)} x {product.unit || 'Case'}
                      </span>
                      <TransactionTypeTag code={item.tier} />
                    </div>
                    <span className={`footer-summary-price ${item.total === 0 ? 'is-zero-price' : ''}`}>
                      ${formatMoney(item.total)}
                    </span>
                  </div>
                );
              })}
              {product.packUnit && packQuantity > 0 && (
                <div className="footer-summary-line">
                  <div className="footer-summary-details-group">
                    <span className="footer-summary-qty">
                      {formatQuantity(packQuantity)} x {product.packUnit}
                    </span>
                    <TransactionTypeTag code="STD" />
                  </div>
                  <span className="footer-summary-price">
                    ${formatMoney(packQuantity * packUnitPrice)}
                  </span>
                </div>
              )}
              {product.alternateUnit && alternateQuantity > 0 && (
                <div className="footer-summary-line">
                  <div className="footer-summary-details-group">
                    <span className="footer-summary-qty">
                      {formatQuantity(alternateQuantity)} x {product.alternateUnit}
                    </span>
                    <TransactionTypeTag code="STD" />
                  </div>
                  <span className="footer-summary-price">
                    ${formatMoney(alternateQuantity * alternateUnitPrice)}
                  </span>
                </div>
              )}
              {automaticPromotions.map((promotion) => (
                <div className="footer-summary-line is-promo-line" key={promotion.type}>
                  <div className="footer-summary-details-group">
                    <span className="footer-summary-qty is-promo-qty">
                      +{formatQuantity(promotion.quantity)} x {product.unit || 'Case'}
                    </span>
                    <TransactionTypeTag code={promotion.type} />
                  </div>
                  <span className="footer-summary-price is-zero-price">$0.00</span>
                </div>
              ))}
            </div>

            <div className="cart-total-bar is-in-summary">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">${formatMoney(grandTotal)}</span>
            </div>
          </section>
        ) : (
          <div className="cart-total-bar">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-amount">${formatMoney(grandTotal)}</span>
          </div>
        )}

        <button
          type="button"
          className={
            isEditingCartItem && totalQuantity === 0
              ? 'add-to-cart-btn is-remove'
              : totalQuantity > 0
                ? 'add-to-cart-btn is-active'
                : 'add-to-cart-btn is-disabled'
          }
          disabled={!isEditingCartItem && totalQuantity === 0}
          onClick={handleConfirm}
        >
          {isEditingCartItem
            ? totalQuantity === 0
              ? 'Remove from Cart'
              : 'Update Cart'
            : 'Add to Cart'}
        </button>
      </div>

      {/* On-Screen Mobile Numeric Keyboard */}
      {showKeyboard && (
        <div
          className="numeric-keyboard-panel"
          role="region"
          aria-label="Numeric Keyboard"
        >
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
