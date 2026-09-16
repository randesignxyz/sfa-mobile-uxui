'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { AddToCartScreen, ProductItem, PriceTier } from '@/components/AddToCartScreen';
import { CartScreen, CartLineItem, LinePromotionsMap, ComboGroup } from '@/components/CartScreen';
import { CustomersScreen, Customer, initialCustomers } from '@/components/CustomersScreen';
import { formatMoney, formatQuantity } from '@/lib/format-number';

type Category = 'All' | 'Vital' | 'Mee Chiet' | 'OM';
type PrimaryTab = 'Record Stock' | 'Sales' | 'Issue';
type OrderView = 'History' | 'Sale Order';

export type Product = ProductItem;

const initialProducts: Product[] = [
  {
    id: 6,
    category: 'Vital',
    name: 'Vital 250 mL',
    code: 'FG000012',
    pack: 'x40 bottles',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/vital-250.jpg',
    imageFit: 'contain',
  },
  {
    id: 7,
    category: 'Vital',
    name: 'Vital 350 mL',
    code: 'FG000013',
    pack: 'x24 bottles',
    count: 0,
    price: 3,
    unit: 'Case',
    image: '/assets/vital-350.jpg',
    imageFit: 'contain',
  },
  {
    id: 8,
    category: 'Vital',
    name: 'Vital 350 mL, OEM (AM)',
    code: 'FG000001',
    pack: 'x24 bottles',
    count: 0,
    price: 3,
    unit: 'Case',
    image: '/assets/vital-350.jpg',
    imageFit: 'contain',
  },
  {
    id: 9,
    category: 'Vital',
    name: 'Vital 500 mL',
    code: 'FG000002',
    pack: 'x24 bottles',
    count: 0,
    price: 3.3,
    unit: 'Case',
    image: '/assets/vital-500.jpg',
    imageFit: 'contain',
  },
  {
    id: 10,
    category: 'Vital',
    name: 'Vital 1.5 L',
    code: 'FG000010',
    pack: 'x12 bottles',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/vital-1500.jpg',
    imageFit: 'contain',
  },
  { id: 11, category: 'Mee Chiet', name: 'MC Pack - Minced Pork', code: 'OMM0008', pack: 'x24 packs', count: 0, price: 4.0, unit: 'Case', image: '/assets/mc-pack-minced-pork.jpg', imageFit: 'contain' },
  { id: 12, category: 'Mee Chiet', name: 'MC Pack - Chicken Egg', code: 'OMM0015', pack: 'x24 packs', count: 0, price: 4.0, unit: 'Case', image: '/assets/mc-pack-chicken-egg.jpg', imageFit: 'contain' },
  { id: 13, category: 'Mee Chiet', name: 'MC Pack - Beef Stew Original', code: 'OMM0011', pack: 'x24 packs', count: 0, price: 4.0, unit: 'Case', image: '/assets/mc-pack-beef-stew.jpg', imageFit: 'contain' },
  { id: 14, category: 'Mee Chiet', name: 'MC Pack - Shrimp Sour Soup', code: 'OMM0004', pack: 'x24 packs', count: 0, price: 4.0, unit: 'Case', image: '/assets/mc-pack-shrimp-sour-soup.jpg', imageFit: 'contain' },
  { id: 15, category: 'Mee Chiet', name: 'MC Pack - Machu Kroeung Beef', code: 'OMM0005', pack: 'x24 packs', count: 0, price: 4.0, unit: 'Case', image: '/assets/mc-pack-beef-stew.jpg', imageFit: 'contain' },
  { id: 16, category: 'Mee Chiet', name: 'MC Pack - Spicy Seafood', code: 'OMM0019', pack: 'x24 packs', count: 0, price: 5, unit: 'Case', image: '/assets/mc-pack-spicy-seafood.jpg', imageFit: 'contain' },
  { id: 17, category: 'Mee Chiet', name: 'MC Pack - Salted Egg', code: 'OMM0035', pack: 'x24 packs', count: 0, price: 5, unit: 'Case', image: '/assets/mc-pack-chicken-egg.jpg', imageFit: 'contain' },
  { id: 18, category: 'Mee Chiet', name: 'MC Pack - Lobster Sour Creamy Soup', code: 'OMM0036', pack: 'x24 packs', count: 0, price: 4.0, unit: 'Case', image: '/assets/mc-pack-shrimp-sour-soup.jpg', imageFit: 'contain' },
  { id: 19, category: 'Mee Chiet', name: 'MC Cup - Minced Pork', code: 'OMM0029', pack: 'x24 cups', count: 0, price: 9, unit: 'Case', image: '/assets/mc-cup-minced-pork.jpg', imageFit: 'contain' },
  { id: 20, category: 'Mee Chiet', name: 'MC Cup - Beef Stew Original', code: 'OMM0030', pack: 'x24 cups', count: 0, price: 9, unit: 'Case', image: '/assets/mc-cup-beef-stew.jpg', imageFit: 'contain' },
  { id: 37, category: 'Mee Chiet', name: 'MC Cup - Shrimp Sour Soup', code: 'OMM0028', pack: 'x24 cups', count: 0, price: 9, unit: 'Case', image: '/assets/mc-cup-shrimp-sour-soup.jpg', imageFit: 'contain' },
  { id: 38, category: 'Mee Chiet', name: 'MC Cup - Spicy Seafood', code: 'OMM0031', pack: 'x24 cups', count: 0, price: 9, unit: 'Case', image: '/assets/mc-cup-spicy-seafood.jpg', imageFit: 'contain' },
  { id: 39, category: 'Mee Chiet', name: 'MC Sa-Sei Egg Noodle 500g', code: 'OMM0040', pack: 'x20 packs', count: 0, price: 6, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/mc-sa-sei-egg-noodle-500g.jpg', imageFit: 'contain' },
  { id: 23, category: 'OM', name: 'OM - Oyster Sauce 250g', code: 'FD02-OM010001', pack: 'x24 bottles', count: 0, price: 12.5, packPrice: 4.0, alternatePrice: 1.5, unit: 'Case', packUnit: 'Pack', alternateUnit: 'Pcs', image: '/assets/om-oyster-sauce-250g.jpg', imageFit: 'contain' },
  { id: 24, category: 'OM', name: 'OM - Oyster Sauce 600g', code: 'FD02-OM010002', pack: 'x24 bottles', count: 0, price: 27.5, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/om-oyster-sauce-600g.jpg', imageFit: 'contain' },
  { id: 25, category: 'OM', name: 'OM - Oyster Sauce 6Kg', code: 'FD02-OM010016', pack: '', count: 0, price: 7, unit: 'Case', image: '/assets/om-oyster-sauce-600g.jpg', imageFit: 'contain' },
  { id: 26, category: 'OM', name: 'OM - Chili Sauce 250g', code: 'FD02-OM010003', pack: 'x24 bottles', count: 0, price: 12.5, unit: 'Case', image: '/assets/om-chili-sauce-250g.jpg', imageFit: 'contain' },
  { id: 27, category: 'OM', name: 'OM - Chili Sauce 500g', code: 'FD02-OM010004', pack: 'x24 bottles', count: 0, price: 22.5, unit: 'Case', image: '/assets/om-chili-sauce-500g.jpg', imageFit: 'contain' },
  { id: 28, category: 'OM', name: 'OM - Soy Sauce 200 mL', code: 'FD02-OM010005', pack: '', count: 0, price: 10, unit: 'Case', image: '/assets/om-oyster-sauce-250g.jpg', imageFit: 'contain' },
  { id: 29, category: 'OM', name: 'OM - Soy Sauce 500 mL', code: 'FD02-OM010006', pack: '', count: 0, price: 18, unit: 'Case', image: '/assets/om-oyster-sauce-600g.jpg', imageFit: 'contain' },
  { id: 30, category: 'OM', name: 'OM - Fish Sauce 200 mL', code: 'FD02-OM010007', pack: '', count: 0, price: 15, unit: 'Case', image: '/assets/om-chili-sauce-250g.jpg', imageFit: 'contain' },
  { id: 31, category: 'OM', name: 'OM - Pork Powder 165g', code: 'FD02-OM010008', pack: 'x72 packs', count: 0, price: 14.5, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/om-pork-powder-165g.jpg', imageFit: 'contain' },
  { id: 32, category: 'OM', name: 'OM - Pork Powder 400g', code: 'FD02-OM010009', pack: 'x36 packs', count: 0, price: 18.5, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/om-pork-powder-400g.jpg', imageFit: 'contain' },
  { id: 33, category: 'OM', name: 'OM - Chicken Powder 165g', code: 'FD02-OM010010', pack: 'x72 packs', count: 0, price: 14.5, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/om-chicken-powder-165g.jpg', imageFit: 'contain' },
  { id: 34, category: 'OM', name: 'OM - Chicken Powder 400g', code: 'FD02-OM010011', pack: 'x36 packs', count: 0, price: 18.5, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/om-chicken-powder-400g.jpg', imageFit: 'contain' },
  { id: 35, category: 'OM', name: 'OM - Vegetable Powder 165g', code: 'FD02-OM010012', pack: 'x72 packs', count: 0, price: 14.5, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/om-vegetable-powder-165g.jpg', imageFit: 'contain' },
  { id: 36, category: 'OM', name: 'OM - Vegetable Powder 400g', code: 'FD02-OM010013', pack: 'x36 packs', count: 0, price: 18.5, unit: 'Case', alternateUnit: 'Pcs', image: '/assets/om-vegetable-powder-400g.jpg', imageFit: 'contain' },
];

const initialCartLines: CartLineItem[] = [];

type CustomerCartState = {
  counts: Record<number, number>;
  productTiers: Record<number, Record<PriceTier, number>>;
  cartLines: CartLineItem[];
  linePromotions?: LinePromotionsMap;
  comboGroups?: ComboGroup[];
  selectedSchemeId?: string;
  appliedGratisIds?: string[];
  appliedGratisQuantities?: Record<string, number>;
};

const createEmptyCounts = () => Object.fromEntries(initialProducts.map((product) => [product.id, 0]));

const createEmptyProductTiers = () =>
  Object.fromEntries(
    Object.entries(initialProductTiers).map(([productId, tiers]) => [productId, { ...tiers }]),
  );

const initialProductTiers: Record<number, Record<PriceTier, number>> = {
  1: { STD: 0, TDD: 0, PROMO: 0, FOC: 0 },
  2: { STD: 0, TDD: 0, PROMO: 0, FOC: 0 },
  3: { STD: 0, TDD: 0, PROMO: 0, FOC: 0 },
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
      aria-label={`Select ${product.name}, price $${formatMoney(product.price)} per ${product.unit}`}
    >
      <div className="card-thumb-box">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`card-thumb-img ${product.imageFit === 'cover' ? 'is-cover' : ''
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
          ${formatMoney(product.price)}/ {product.unit}
        </span>
      </div>

      <div className="card-action-box">
        {count > 0 ? (
          <div
            className="card-qty-badge"
            aria-label={`${formatQuantity(count)} items in cart`}
          >
            {formatQuantity(count)}
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
  const [activeNavTab, setActiveNavTab] = useState<'Home' | 'Visit' | 'Order' | 'Customer'>('Customer');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(initialCustomers[4]); // Bun Sophear
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>('Sales');
  const [orderView, setOrderView] = useState<OrderView>('Sale Order');
  const [category, setCategory] = useState<Category>('All');
  const [counts, setCounts] = useState<Record<number, number>>(createEmptyCounts);
  const [productTiers, setProductTiers] = useState<Record<number, Record<PriceTier, number>>>(initialProductTiers);
  const [cartLines, setCartLines] = useState<CartLineItem[]>(initialCartLines);
  const [linePromotions, setLinePromotions] = useState<LinePromotionsMap>({});
  const [comboGroups, setComboGroups] = useState<ComboGroup[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('whole-sales');
  const [appliedGratisIds, setAppliedGratisIds] = useState<string[]>([]);
  const [appliedGratisQuantities, setAppliedGratisQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedProductForCart, setSelectedProductForCart] = useState<Product | null>(null);
  const [wasEditingFromCart, setWasEditingFromCart] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [deviceModel, setDeviceModel] = useState<'iphone-16-pro-max' | 'iphone-13'>('iphone-16-pro-max');
  const [checkedInCustomerIds, setCheckedInCustomerIds] = useState<string[]>([]);
  const [activeMapCustomer, setActiveMapCustomer] = useState<Customer | null>(null);
  const [shouldSlideToOrder, setShouldSlideToOrder] = useState(false);
  const [loadingCall, setLoadingCall] = useState<{
    customer: Customer;
    type: 'Customer Call' | 'Sales Call';
  } | null>(null);
  const [showLeaveCartConfirm, setShowLeaveCartConfirm] = useState(false);
  const [customerCarts, setCustomerCarts] = useState<Record<string, CustomerCartState>>({});
  const [isFifteenMinAlertOpen, setIsFifteenMinAlertOpen] = useState(false);
  const [alertCustomer, setAlertCustomer] = useState<Customer | null>(null);
  const callNavigationTimerRef = useRef<number | null>(null);
  const checkInTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    return () => {
      if (callNavigationTimerRef.current) {
        window.clearTimeout(callNavigationTimerRef.current);
      }
      Object.values(checkInTimersRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const activateCustomerCart = (cust: Customer) => {
    const savedCart = customerCarts[cust.id];
    setSelectedCustomer(cust);
    setCounts(savedCart?.counts ?? createEmptyCounts());
    setProductTiers(savedCart?.productTiers ?? createEmptyProductTiers());
    setCartLines(savedCart?.cartLines ?? []);
    setLinePromotions(savedCart?.linePromotions ?? {});
    setComboGroups(savedCart?.comboGroups ?? []);
    setSelectedSchemeId(savedCart?.selectedSchemeId ?? 'whole-sales');
    setAppliedGratisIds(savedCart?.appliedGratisIds ?? []);
    setAppliedGratisQuantities(savedCart?.appliedGratisQuantities ?? {});
    setSelectedProductForCart(null);
    setWasEditingFromCart(false);
    setIsCartOpen(false);
  };

  const openCallOrder = (cust: Customer, callType: 'Customer Call' | 'Sales Call') => {
    activateCustomerCart(cust);
    setActiveMapCustomer(null);
    setLoadingCall({ customer: cust, type: callType });

    if (callNavigationTimerRef.current) {
      window.clearTimeout(callNavigationTimerRef.current);
    }

    callNavigationTimerRef.current = window.setTimeout(() => {
      setShouldSlideToOrder(true);
      setLoadingCall(null);
      setActiveNavTab('Order');
      callNavigationTimerRef.current = null;
    }, 900);
  };

  const handleCheckInCustomer = (cust: Customer) => {
    setCheckedInCustomerIds((prev) => (prev.includes(cust.id) ? prev : [...prev, cust.id]));
    activateCustomerCart(cust);
    setActiveMapCustomer(cust);
    setActiveNavTab('Order');

    // 15-minute checkout reminder timer (15 * 60 * 1000 ms)
    if (checkInTimersRef.current[cust.id]) {
      clearTimeout(checkInTimersRef.current[cust.id]);
    }
    checkInTimersRef.current[cust.id] = setTimeout(() => {
      setAlertCustomer(cust);
      setIsFifteenMinAlertOpen(true);
    }, 15 * 60 * 1000);
  };

  const handleCheckOutCustomer = (cust: Customer) => {
    if (checkInTimersRef.current[cust.id]) {
      clearTimeout(checkInTimersRef.current[cust.id]);
      delete checkInTimersRef.current[cust.id];
    }
    setCheckedInCustomerIds((prev) => prev.filter((id) => id !== cust.id));
    setActiveMapCustomer(null);
    setIsFifteenMinAlertOpen(false);
    setAlertCustomer(null);
    setActiveNavTab('Customer');
    notify(`Checked out from ${cust.name}`);
  };

  // Touch and pointer swipe gesture handling
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [mouseStartPos, setMouseStartPos] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos) return;
    const deltaX = e.changedTouches[0].clientX - touchStartPos.x;
    const deltaY = e.changedTouches[0].clientY - touchStartPos.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        // Swipe Left: switch to Customer screen when on Order catalog
        if (activeNavTab === 'Order') {
          if (selectedCustomer && checkedInCustomerIds.includes(selectedCustomer.id)) {
            setActiveMapCustomer(selectedCustomer);
          } else {
            setActiveMapCustomer(null);
          }
          setActiveNavTab('Customer');
          notify('Swiped to Customers');
        }
      }
    }
    setTouchStartPos(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a, select, article')) return;
    setMouseStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseStartPos) return;
    const deltaX = e.clientX - mouseStartPos.x;
    const deltaY = e.clientY - mouseStartPos.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        // Drag Left: switch to Customer screen when on Order catalog
        if (activeNavTab === 'Order') {
          if (selectedCustomer && checkedInCustomerIds.includes(selectedCustomer.id)) {
            setActiveMapCustomer(selectedCustomer);
          } else {
            setActiveMapCustomer(null);
          }
          setActiveNavTab('Customer');
          notify('Swiped to Customers');
        }
      }
    }
    setMouseStartPos(null);
  };

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

  const cartItemCountsByCustomer = useMemo(() => {
    const countsMap: Record<string, number> = {};
    Object.entries(customerCarts).forEach(([customerId, cart]) => {
      const lineQty = cart.cartLines?.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
      const countQty = Object.values(cart.counts || {}).reduce((sum, val) => sum + val, 0);
      countsMap[customerId] = Math.max(lineQty, countQty);
    });

    if (selectedCustomer) {
      const activeLineQty = cartLines.reduce((sum, line) => sum + line.quantity, 0);
      const activeCountQty = Object.values(counts || {}).reduce((sum, val) => sum + val, 0);
      countsMap[selectedCustomer.id] = Math.max(activeLineQty, activeCountQty);
    }

    return countsMap;
  }, [customerCarts, selectedCustomer, counts, cartLines]);

  function returnToCustomers() {
    if (selectedCustomer && checkedInCustomerIds.includes(selectedCustomer.id)) {
      setActiveMapCustomer(selectedCustomer);
    } else {
      setActiveMapCustomer(null);
    }
    setShouldSlideToOrder(false);
    setActiveNavTab('Customer');
  }

  function handleBackToCustomers() {
    if (totalCartItems > 0) {
      setShowLeaveCartConfirm(true);
      return;
    }

    returnToCustomers();
  }

  function handleDiscardOrder() {
    setShowLeaveCartConfirm(false);
    setCounts(createEmptyCounts());
    setProductTiers(createEmptyProductTiers());
    setCartLines([]);
    setLinePromotions({});
    setComboGroups([]);
    setSelectedSchemeId('whole-sales');
    setAppliedGratisIds([]);
    setAppliedGratisQuantities({});
    setCustomerCarts((current) => {
      const next = { ...current };
      delete next[selectedCustomer.id];
      return next;
    });
    returnToCustomers();
    notify('Order discarded');
  }

  function handleSaveDraftOrder() {
    setShowLeaveCartConfirm(false);
    setCustomerCarts((current) => ({
      ...current,
      [selectedCustomer.id]: {
        counts,
        productTiers,
        cartLines,
        linePromotions,
        comboGroups,
        selectedSchemeId,
        appliedGratisIds,
        appliedGratisQuantities,
      },
    }));
    returnToCustomers();
    notify('Draft saved');
  }

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
    alternateQuantity = 0,
    packQuantity = 0,
  ) {
    const nextCounts = { ...counts, [product.id]: quantity };
    const nextProductTiers = tierBreakdown
      ? { ...productTiers, [product.id]: tierBreakdown }
      : productTiers;
    let nextCartLines = cartLines;

    if (tierBreakdown) {
      const withoutProduct = cartLines.filter((item) => item.productId !== product.id);
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
      nextCartLines = [...withoutProduct, ...newLines];
      if (product.packUnit && packQuantity > 0) {
        const pUnitPrice = product.packPrice ?? (product.price > 5 ? 4.0 : 2.5);
        nextCartLines.push({
          id: `${product.id}-std-${product.packUnit.toLowerCase()}`,
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          productImage: product.image || '',
          imageFit: product.imageFit,
          unit: product.packUnit,
          tier: 'STD',
          quantity: packQuantity,
          unitPrice: pUnitPrice,
          totalPrice: pUnitPrice * packQuantity,
        });
      }
      if (product.alternateUnit && alternateQuantity > 0) {
        const altUnitPrice = product.alternatePrice ?? product.price;
        nextCartLines.push({
          id: `${product.id}-std-${product.alternateUnit.toLowerCase()}`,
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          productImage: product.image || '',
          imageFit: product.imageFit,
          unit: product.alternateUnit,
          tier: 'STD',
          quantity: alternateQuantity,
          unitPrice: altUnitPrice,
          totalPrice: altUnitPrice * alternateQuantity,
        });
      }
    }

    setCounts(nextCounts);
    setProductTiers(nextProductTiers);
    setCartLines(nextCartLines);
    setCustomerCarts((current) => ({
      ...current,
      [selectedCustomer.id]: {
        counts: nextCounts,
        productTiers: nextProductTiers,
        cartLines: nextCartLines,
        linePromotions: current[selectedCustomer.id]?.linePromotions ?? linePromotions,
        selectedSchemeId: current[selectedCustomer.id]?.selectedSchemeId ?? selectedSchemeId,
        appliedGratisIds: current[selectedCustomer.id]?.appliedGratisIds ?? appliedGratisIds,
        appliedGratisQuantities: current[selectedCustomer.id]?.appliedGratisQuantities ?? appliedGratisQuantities,
      },
    }));

    setSelectedProductForCart(null);
    if (wasEditingFromCart) {
      setWasEditingFromCart(false);
      setIsCartOpen(true);
    } else {
      setIsCartOpen(false);
    }
  }

  const handleUpdateLinePromotions = (next: LinePromotionsMap) => {
    setLinePromotions(next);
    setCustomerCarts((current) => ({
      ...current,
      [selectedCustomer.id]: {
        ...(current[selectedCustomer.id] || {
          counts,
          productTiers,
          cartLines,
        }),
        linePromotions: next,
      },
    }));
  };

  const handleUpdateComboGroups = (groups: ComboGroup[]) => {
    setComboGroups(groups);
    setCustomerCarts((current) => ({
      ...current,
      [selectedCustomer.id]: {
        ...(current[selectedCustomer.id] || {
          counts,
          productTiers,
          cartLines,
        }),
        comboGroups: groups,
      },
    }));
  };

  const handleUpdateSelectedSchemeId = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    setCustomerCarts((current) => ({
      ...current,
      [selectedCustomer.id]: {
        ...(current[selectedCustomer.id] || {
          counts,
          productTiers,
          cartLines,
        }),
        selectedSchemeId: schemeId,
      },
    }));
  };

  const handleUpdateAppliedGratisIds = (ids: string[]) => {
    setAppliedGratisIds(ids);
    setCustomerCarts((current) => ({
      ...current,
      [selectedCustomer.id]: {
        ...(current[selectedCustomer.id] || {
          counts,
          productTiers,
          cartLines,
        }),
        appliedGratisIds: ids,
      },
    }));
  };

  const handleUpdateAppliedGratisQuantities = (quantities: Record<string, number>) => {
    setAppliedGratisQuantities(quantities);
    setCustomerCarts((current) => ({
      ...current,
      [selectedCustomer.id]: {
        ...(current[selectedCustomer.id] || {
          counts,
          productTiers,
          cartLines,
        }),
        appliedGratisQuantities: quantities,
      },
    }));
  };

  return (
    <main className={`prototype-stage ${isLandscape ? 'is-landscape-stage' : ''}`}>
      {/* Web Device Switcher Toolbar */}
      <div className="prototype-device-toolbar" aria-label="Device Switcher">
        <div className="device-switcher-pill" role="tablist" aria-label="Device screen model">
          <button
            type="button"
            role="tab"
            aria-selected={deviceModel === 'iphone-16-pro-max'}
            className={`device-btn ${deviceModel === 'iphone-16-pro-max' ? 'is-active' : ''}`}
            onClick={() => setDeviceModel('iphone-16-pro-max')}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="20" x="5" y="2" rx="3" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
            <span className="device-name">iPhone 16 Pro Max</span>
            <span className="device-resolution">440 × 956</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={deviceModel === 'iphone-13'}
            className={`device-btn ${deviceModel === 'iphone-13' ? 'is-active' : ''}`}
            onClick={() => setDeviceModel('iphone-13')}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="13" height="19" x="5.5" y="2.5" rx="2.5" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
            <span className="device-name">iPhone 13</span>
            <span className="device-resolution">390 × 844</span>
          </button>
        </div>

        <button
          type="button"
          className={`device-orientation-btn ${isLandscape ? 'is-landscape-active' : ''}`}
          onClick={() => setIsLandscape(!isLandscape)}
          title={isLandscape ? 'Switch to Portrait' : 'Switch to Landscape'}
          aria-label={isLandscape ? 'Switch to Portrait' : 'Switch to Landscape'}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
        </button>
      </div>

      <section
        className={`phone device-${deviceModel} ${isLandscape ? 'is-landscape' : ''}`}
        aria-label="SFA sales order mobile prototype"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* If Customer Tab is active, render CustomersScreen */}
        {activeNavTab === 'Customer' ? (
          <CustomersScreen
            onSelectCustomer={(cust) => {
              activateCustomerCart(cust);
              setActiveMapCustomer(null);
              setShouldSlideToOrder(false);
              setActiveNavTab('Order');
            }}
            onCustomerCall={(cust) => openCallOrder(cust, 'Customer Call')}
            onSalesCall={(cust) => openCallOrder(cust, 'Sales Call')}
            checkedInCustomerIds={checkedInCustomerIds}
            activeMapCustomer={activeMapCustomer}
            onCheckInCustomer={handleCheckInCustomer}
            onCheckOutCustomer={handleCheckOutCustomer}
            onCloseMapCustomer={() => setActiveMapCustomer(null)}
            onNavigateTab={setActiveNavTab}
            activeNavTab={activeNavTab}
            cartItemCountsByCustomer={cartItemCountsByCustomer}
            onTrigger15MinAlert={(cust) => {
              setAlertCustomer(cust || selectedCustomer);
              setIsFifteenMinAlertOpen(true);
            }}
          />
        ) : (
          <div
            className={`order-catalog-screen-wrap ${shouldSlideToOrder ? 'slide-left-in' : ''}`}
          >
            {/* Main List Screen Header */}
            <header className="app-header-sales">
              <DeviceStatusBar />

              {/* Customer Title Row with STAGING badge */}
              <div className="main-nav-bar">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="icon-button back-button"
                  aria-label="Back to customers"
                  onClick={handleBackToCustomers}
                >
                  <img src="/assets/arrow-left.svg" alt="Back" />
                </Button>

                <div className="title-center-group">
                  <h1 className="outlet-name-title">{selectedCustomer?.name || 'Bun Sophear'}</h1>
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
                  <div className="cart-banner-count">{formatQuantity(totalCartItems)}</div>
                </button>
              </div>
            )}

            {/* Enter Quantity / Add To Cart Screen */}
            {selectedProductForCart && (
              <AddToCartScreen
                product={selectedProductForCart}
                customerId={selectedCustomer.id}
                initialTiers={productTiers[selectedProductForCart.id]}
                initialPackQuantity={
                  cartLines.find(
                    (line) =>
                      line.productId === selectedProductForCart.id &&
                      line.unit === selectedProductForCart.packUnit,
                  )?.quantity ?? 0
                }
                initialAlternateQuantity={
                  cartLines.find(
                    (line) =>
                      line.productId === selectedProductForCart.id &&
                      line.unit === selectedProductForCart.alternateUnit,
                  )?.quantity ?? 0
                }
                onBack={() => {
                  setSelectedProductForCart(null);
                  if (wasEditingFromCart) {
                    setWasEditingFromCart(false);
                    setIsCartOpen(true);
                  }
                }}
                onAddToCart={handleConfirmAddToCart}
              />
            )}

            {/* View Cart Screen Modal */}
            {isCartOpen && (
              <CartScreen
                cartLines={cartLines}
                customerId={selectedCustomer.id}
                customerName={selectedCustomer.name}
                isGratisEligible={selectedCustomer.id === 'c-1'}
                initialLinePromotions={linePromotions}
                onUpdateLinePromotions={handleUpdateLinePromotions}
                initialComboGroups={comboGroups}
                onUpdateComboGroups={handleUpdateComboGroups}
                initialSelectedSchemeId={selectedSchemeId}
                onUpdateSelectedSchemeId={handleUpdateSelectedSchemeId}
                initialAppliedGratisIds={appliedGratisIds}
                onUpdateAppliedGratisIds={handleUpdateAppliedGratisIds}
                initialAppliedGratisQuantities={appliedGratisQuantities}
                onUpdateAppliedGratisQuantities={handleUpdateAppliedGratisQuantities}
                onBack={() => {
                  setIsLandscape(false);
                  setIsCartOpen(false);
                }}
                onEditProduct={(productId) => {
                  const product = initialProducts.find((p) => p.id === productId);
                  if (product) {
                    setWasEditingFromCart(true);
                    setIsCartOpen(false);
                    setSelectedProductForCart(product);
                  }
                }}
                onReviewOrder={() => notify('Proceeding to Review Order')}
                onManualPromotion={() => notify('Manual Promotion opened')}
                onOrientationChange={setIsLandscape}
              />
            )}
          </div>
        )}

        {loadingCall && (
          <div
            className="checkin-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`Preparing ${loadingCall.type} for ${loadingCall.customer.name}`}
            aria-busy="true"
          >
            <div className="checkin-modal-card">
              <div className="checkin-modal-content">
                <div className="checkin-spinner-wrap" aria-hidden="true">
                  <svg className="checkin-spinner-svg" width="48" height="48" viewBox="0 0 50 50">
                    <defs>
                      <linearGradient id="callSpinnerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#b49a00" stopOpacity="1" />
                        <stop offset="60%" stopColor="#d4af37" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#b49a00" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="url(#callSpinnerGoldGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="95 35"
                    />
                  </svg>
                </div>
                <h3 className="checkin-modal-title">Preparing {loadingCall.type}...</h3>
              </div>
            </div>
          </div>
        )}

        {showLeaveCartConfirm && (
          <div
            className="checkin-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-cart-title"
            aria-describedby="leave-cart-description"
            onClick={() => setShowLeaveCartConfirm(false)}
          >
            <div className="checkout-confirm-card" onClick={(e) => e.stopPropagation()}>
              <div className="leave-cart-icon-wrap" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </div>
              <h2 id="leave-cart-title" className="checkout-confirm-title">Save Order as Draft?</h2>
              <p id="leave-cart-description" className="checkout-confirm-desc">
                You have <span className="checkout-customer-highlight">{formatQuantity(totalCartItems)} {totalCartItems === 1 ? 'item' : 'items'}</span> in the cart for <span className="checkout-customer-highlight">{selectedCustomer?.name || 'this customer'}</span>. Would you like to save this order as a draft or discard it?
              </p>
              <div className="checkout-confirm-actions">
                <button
                  type="button"
                  className="leave-cart-discard-btn"
                  onClick={handleDiscardOrder}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="leave-cart-save-btn"
                  onClick={handleSaveDraftOrder}
                >
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 15-Minute Check-out Reminder Modal Alert */}
        {isFifteenMinAlertOpen && (
          <div
            className="checkin-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="15-Minute Checkout Reminder"
            onClick={() => setIsFifteenMinAlertOpen(false)}
          >
            <div
              className="fifteen-min-reminder-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="fifteen-min-icon-wrap">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>

              <div className="fifteen-min-pill-tag">
                <span>⏱️ 15 MINUTES REACHED</span>
              </div>

              <h2 className="fifteen-min-title">Checkout Reminder</h2>

              <p className="fifteen-min-desc">
                You have been checked in at{' '}
                <span className="checkout-customer-highlight">
                  {alertCustomer?.name || selectedCustomer?.name || 'Customer'}
                </span>{' '}
                for <span className="fifteen-min-time-highlight">15 minutes</span>. Please check out to complete your visit.
              </p>

              <div className="fifteen-min-stat-box">
                <div className="fifteen-min-stat-row">
                  <span className="stat-label">Elapsed Time:</span>
                  <span className="stat-val is-time">15:00 min</span>
                </div>
                <div className="fifteen-min-stat-row">
                  <span className="stat-label">Customer:</span>
                  <span className="stat-val">
                    {alertCustomer?.name || selectedCustomer?.name}
                  </span>
                </div>
              </div>

              <div className="fifteen-min-actions">
                <button
                  type="button"
                  className="fifteen-min-checkout-btn"
                  onClick={() => {
                    setIsFifteenMinAlertOpen(false);
                    const targetCust = alertCustomer || selectedCustomer;
                    if (targetCust) {
                      setActiveMapCustomer(targetCust);
                      setActiveNavTab('Customer');
                      notify(`Opening visit checkout for ${targetCust.name}`);
                    }
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Check Out Now</span>
                </button>

                <button
                  type="button"
                  className="fifteen-min-snooze-btn"
                  onClick={() => {
                    setIsFifteenMinAlertOpen(false);
                    notify('Visit continued (Reminder dismissed)');
                  }}
                >
                  Continue Visit
                </button>
              </div>
            </div>
          </div>
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
