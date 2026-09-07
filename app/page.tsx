'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { AddToCartScreen, ProductItem, PriceTier } from '@/components/AddToCartScreen';
import { CartScreen, CartLineItem } from '@/components/CartScreen';

type Category = 'All' | 'Vital' | 'Mee Chiet' | 'OM';
type PrimaryTab = 'Record Stock' | 'Sales' | 'Issue';
type OrderView = 'History' | 'Sale Order';

export type Product = ProductItem;

const initialProducts: Product[] = [
  {
    id: 1,
    category: 'Vital',
    name: 'Vital 250 mL',
    code: 'FG000012',
    pack: 'x40 bottles',
    count: 100,
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
    count: 100,
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
    count: 11,
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
    name: 'Vital drinking water 1500ML',
    code: 'FG000010',
    pack: 'x12 bottles',
    count: 0,
    price: 4.5,
    unit: 'Case',
    image: '/assets/vital-1500.png',
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

const initialCartLines: CartLineItem[] = [
  {
    id: 'vital-250-std',
    productId: 1,
    productName: 'Vital 250 mL',
    productCode: 'FG000012',
    productImage: '/assets/vital-250.png',
    unit: 'Case',
    tier: 'STD',
    quantity: 80,
    unitPrice: 4.0,
    totalPrice: 320.0,
  },
  {
    id: 'vital-250-tdd',
    productId: 1,
    productName: 'Vital 250 mL',
    productCode: 'FG000012',
    productImage: '/assets/vital-250.png',
    unit: 'Case',
    tier: 'TDD',
    quantity: 20,
    unitPrice: 0.0,
    totalPrice: 0.0,
  },
  {
    id: 'vital-350-std',
    productId: 2,
    productName: 'Vital 350 mL',
    productCode: 'FG000013',
    productImage: '/assets/vital-350.jpg',
    unit: 'Case',
    tier: 'STD',
    quantity: 100,
    unitPrice: 2.75,
    totalPrice: 275.0,
  },
  {
    id: 'vital-350-oem-std',
    productId: 3,
    productName: 'Vital 350 mL, OEM (AM)',
    productCode: 'FG000001',
    productImage: '/assets/vital-350.jpg',
    unit: 'Case',
    tier: 'STD',
    quantity: 10,
    unitPrice: 2.75,
    totalPrice: 27.5,
  },
];

const initialProductTiers: Record<number, Record<PriceTier, number>> = {
  1: { STD: 80, TDD: 20, PROMO: 0, FOC: 0 },
  2: { STD: 100, TDD: 0, PROMO: 0, FOC: 0 },
  3: { STD: 11, TDD: 0, PROMO: 0, FOC: 0 },
  4: { STD: 0, TDD: 0, PROMO: 0, FOC: 0 },
  5: { STD: 0, TDD: 0, PROMO: 0, FOC: 0 },
  6: { STD: 0, TDD: 0, PROMO: 0, FOC: 0 },
  7: { STD: 0, TDD: 0, PROMO: 0, FOC: 0 },
};

/** Device status bar */
function DeviceStatusBar() {
  return (
    <div className="device-status" aria-label="Device status">
      <span>7:51</span>
      <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
      <div className="device-icons" aria-hidden="true">
        <img src="/assets/wifi.svg" alt="" />
        <img src="/assets/signal.svg" alt="" />
        <img className="battery" src="/assets/battery.svg" alt="" />
      </div>
    </div>
  );
}

/** Product Card Item matching the cards design with red quantity badge */
function ProductCard({
  product,
  count,
  onClick,
}: {
  product: Product;
  count: number;
  onClick: () => void;
}) {
  return (
    <article
      className="product-card-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={`Select ${product.name}, price $${product.price.toFixed(3)} per ${product.unit}`}
    >
      <div className="card-thumb-box">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`card-thumb-img ${
              product.imageFit === 'cover' ? 'is-cover' : ''
            }`}
          />
        ) : (
          <div className="card-thumb-placeholder" />
        )}
      </div>

      <div className="card-info-box">
        <h2 className="card-product-name">{product.name}</h2>
        <span className="card-product-sku">{product.code}</span>
        <span className="card-product-price">
          ${product.price.toFixed(3)}/ {product.unit}
        </span>
      </div>

      <div className="card-action-box">
        {count > 0 ? (
          <div
            className="card-qty-badge"
            aria-label={`${count} items in cart`}
          >
            {count}
          </div>
        ) : (
          <button
            type="button"
            className="card-add-btn"
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>('Sales');
  const [orderView, setOrderView] = useState<OrderView>('Sale Order');
  const [category, setCategory] = useState<Category>('All');
  const [counts, setCounts] = useState<Record<number, number>>(() =>
    Object.fromEntries(initialProducts.map((p) => [p.id, p.count])),
  );
  const [productTiers, setProductTiers] = useState<Record<number, Record<PriceTier, number>>>(initialProductTiers);
  const [cartLines, setCartLines] = useState<CartLineItem[]>(initialCartLines);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedProductForCart, setSelectedProductForCart] = useState<Product | null>(null);

  const visibleProducts = useMemo(
    () =>
      category === 'All'
        ? initialProducts
        : initialProducts.filter((product) => product.category === category),
    [category],
  );

  const totalCartItems = useMemo(() => {
    return Object.values(counts).reduce((sum, val) => sum + val, 0);
  }, [counts]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2000);
  }

  function handleOpenAddToCart(product: Product) {
    setSelectedProductForCart(product);
  }

  function handleConfirmAddToCart(
    product: Product,
    quantity: number,
    tierBreakdown?: Record<PriceTier, number>,
  ) {
    setCounts((current) => ({
      ...current,
      [product.id]: quantity,
    }));

    if (tierBreakdown) {
      setProductTiers((prev) => ({
        ...prev,
        [product.id]: tierBreakdown,
      }));

      setCartLines((prev) => {
        const withoutProduct = prev.filter((item) => item.productId !== product.id);
        const newLines: CartLineItem[] = [];

        Object.entries(tierBreakdown).forEach(([tierKey, qty]) => {
          if (qty > 0) {
            const tier = tierKey as PriceTier;
            const rate = tier === 'STD' ? 1.0 : tier === 'PROMO' ? 0.75 : 0.0;
            const unitPrice = product.price * rate;
            newLines.push({
              id: `${product.id}-${tierKey.toLowerCase()}`,
              productId: product.id,
              productName: product.name,
              productCode: product.code,
              productImage: product.image || '',
              imageFit: product.imageFit,
              unit: product.unit || 'Case',
              tier,
              quantity: qty,
              unitPrice,
              totalPrice: unitPrice * qty,
            });
          }
        });

        return [...withoutProduct, ...newLines];
      });
    }

    setSelectedProductForCart(null);
    setIsCartOpen(false);

    const breakdownStr =
      tierBreakdown && quantity > 0
        ? Object.entries(tierBreakdown)
            .filter(([, q]) => q > 0)
            .map(([t, q]) => `${q} ${t}`)
            .join(', ')
        : `${quantity} Cases`;

    if (quantity === 0) {
      notify(`Removed ${product.name} from cart`);
    } else {
      notify(`Updated cart: ${product.name} (${breakdownStr})`);
    }
  }

  return (
    <main className="prototype-stage">
      <section className="phone" aria-label="SFA sales order mobile prototype">
        {/* Main List Screen Header */}
        <header className="app-header-sales">
          <DeviceStatusBar />

          {/* Customer Title Row with STAGING badge */}
          <div className="main-nav-bar">
            <Button
              variant="ghost"
              size="icon-sm"
              className="icon-button back-button"
              aria-label="Back"
            >
              <img src="/assets/arrow-left.svg" alt="Back" />
            </Button>

            <div className="title-center-group">
              <h1 className="outlet-name-title">Bun Sophear</h1>
            </div>

            <button
              type="button"
              className="search-button"
              aria-label="Search"
              onClick={() => notify('Search catalog opened')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B49A00"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* Primary Top Level Navigation Tabs */}
          <nav className="primary-sales-tabs" aria-label="Section navigation">
            {(['Record Stock', 'Sales', 'Issue'] as PrimaryTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                className={primaryTab === tab ? 'is-active' : ''}
                onClick={() => setPrimaryTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Sub Navigation Tabs */}
          <nav className="order-sub-tabs" aria-label="Order view options">
            {(['History', 'Sale Order'] as OrderView[]).map((tab) => (
              <button
                key={tab}
                type="button"
                className={orderView === tab ? 'is-active' : ''}
                onClick={() => setOrderView(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Brand Filter Categories & Grid toggle */}
          <div className="category-filter-row">
            <div className="category-chips-list">
              {(['All', 'Vital', 'Mee Chiet', 'OM'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-chip-btn ${category === cat ? 'is-active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="grid-view-btn"
              aria-label="Toggle grid layout"
              onClick={() => notify('Layout toggled')}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B49A00"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>
          </div>
        </header>

        {/* Product Cards List */}
        <div className="product-cards-container" aria-live="polite">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              count={counts[product.id] ?? 0}
              onClick={() => handleOpenAddToCart(product)}
            />
          ))}
        </div>

        {/* Floating View Your Cart Banner */}
        {totalCartItems > 0 && !selectedProductForCart && !isCartOpen && (
          <div className="floating-cart-banner-wrap">
            <button
              type="button"
              className="floating-cart-banner"
              onClick={() => setIsCartOpen(true)}
            >
              <span className="cart-banner-text">View your cart</span>
              <div className="cart-banner-count">{totalCartItems}</div>
            </button>
          </div>
        )}

        {/* Enter Quantity / Add To Cart Screen */}
        {selectedProductForCart && (
          <AddToCartScreen
            product={selectedProductForCart}
            initialTiers={productTiers[selectedProductForCart.id]}
            onBack={() => setSelectedProductForCart(null)}
            onAddToCart={handleConfirmAddToCart}
          />
        )}

        {/* View Cart Screen Modal */}
        {isCartOpen && (
          <CartScreen
            cartLines={cartLines}
            onBack={() => setIsCartOpen(false)}
            onReviewOrder={() => notify('Proceeding to Review Order')}
            onSelectPromotion={() => notify('1 active promotion selected')}
            onManualPromotion={() => notify('Manual Promotion opened')}
          />
        )}

        {toast && (
          <div className="toast-message" role="status">
            {toast}
          </div>
        )}

        <footer className="home-indicator" aria-hidden="true">
          <span />
        </footer>
      </section>
    </main>
  );
}
