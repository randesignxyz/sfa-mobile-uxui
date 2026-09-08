'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { CustomerVisitMapScreen } from './CustomerVisitMapScreen';

export interface ShippingAddress {
  id: string;
  address: string;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  khmerName: string;
  name: string;
  code: string;
  phone: string;
  type: 'Direct' | 'Indirect';
  isProspect?: boolean;
  address?: string;
  shippingAddresses?: ShippingAddress[];
  image?: string;
}

export const initialCustomers: Customer[] = [
  {
    id: 'c-1',
    khmerName: 'អា ហ្គ័ង',
    name: 'A Houng',
    code: 'L903030',
    phone: '093 636332',
    type: 'Direct',
    address: 'In front of Khmer Soviet Friendship Hospital, Chamraeun Phal, Boeng Tumpun 1, Mean Chey, Phnom Penh',
    shippingAddresses: [
      {
        id: 'addr-1',
        address: 'In front of Khmer Soviet Friendship Hospital, Chamraeun Phal, Boeng Tumpun 1, Mean Chey, Phnom Penh',
        isDefault: true,
      },
    ],
  },
  {
    id: 'c-2',
    khmerName: 'អា ដា',
    name: 'Ah Da',
    code: 'C000017',
    phone: '097 8050400',
    type: 'Direct',
    address: '#89, St 598, Sangkat Toul Kork, Khan Tuol Kouk, Phnom Penh',
    shippingAddresses: [
      {
        id: 'addr-2',
        address: '#89, St 598, Sangkat Toul Kork, Khan Tuol Kouk, Phnom Penh',
        isDefault: true,
      },
    ],
  },
  {
    id: 'c-3',
    khmerName: 'អាន សេង',
    name: 'An Seng',
    code: 'L905421',
    phone: '012 914330',
    type: 'Indirect',
    address: 'Russian Blvd, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
  },
  {
    id: 'c-4',
    khmerName: 'អាំង កញ្ញា',
    name: 'Ang Kanha',
    code: 'L908812',
    phone: '088 776655',
    type: 'Direct',
    address: 'St 130, Central Market, Phnom Penh',
  },
  {
    id: 'c-5',
    khmerName: 'ប៊ុន សុភារ',
    name: 'Bun Sophear',
    code: 'L901020',
    phone: '012 345678',
    type: 'Direct',
    address: 'St 1003, Aeon Sen Sok, Phnom Penh',
  },
  {
    id: 'c-6',
    khmerName: 'ចាន់ ធីតា',
    name: 'Chan Thida',
    code: 'C000045',
    phone: '096 554433',
    type: 'Indirect',
    address: 'St 315, Boeung Kak 2, Phnom Penh',
  },
  {
    id: 'c-7',
    khmerName: 'ហេង សុខា',
    name: 'Heng Sokha',
    code: 'L904499',
    phone: '085 221199',
    type: 'Direct',
    address: 'St 51, Boeung Keng Kang 1, Phnom Penh',
  },
  {
    id: 'c-8',
    khmerName: 'គឹម ស៊ាង',
    name: 'Kim Seang',
    code: 'C000088',
    phone: '078 998877',
    type: 'Indirect',
    address: 'National Road 6A, Chroy Changvar, Phnom Penh',
  },
];

type PrimaryFilterTab = 'Customers' | 'Prospect';
type SubFilterType = 'All' | 'Direct' | 'Indirect';

interface CustomersScreenProps {
  onSelectCustomer?: (customer: Customer) => void;
  onNavigateTab?: (tab: 'Home' | 'Visit' | 'Order' | 'Customer') => void;
  activeNavTab?: 'Home' | 'Visit' | 'Order' | 'Customer';
  onCustomerCall?: (customer: Customer) => void;
  onSalesCall?: (customer: Customer) => void;
  checkedInCustomerIds?: string[];
  activeMapCustomer?: Customer | null;
  onCheckInCustomer?: (customer: Customer) => void;
  onCheckOutCustomer?: (customer: Customer) => void;
  onCloseMapCustomer?: () => void;
}

/** Placeholder image icon matching design */
function ImagePlaceholderIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

interface SwipeableCustomerCardProps {
  customer: Customer;
  isSwiped: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSelect: () => void;
  onVisit: () => void;
  onCustomerCall?: () => void;
  onSalesCall?: () => void;
}

function SwipeableCustomerCard({
  customer,
  isSwiped,
  onSwipeLeft,
  onSwipeRight,
  onSelect,
  onVisit,
  onCustomerCall,
  onSalesCall,
}: SwipeableCustomerCardProps) {
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.customer-swipe-btn')) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      isDraggingRef.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 0.6;

    if (Math.abs(deltaX) > 20 && isHorizontal) {
      if (deltaX < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
    pointerStartRef.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.customer-swipe-btn')) return;
    pointerStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.touches[0].clientX - pointerStartRef.current.x;
    const deltaY = e.touches[0].clientY - pointerStartRef.current.y;
    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!pointerStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - pointerStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - pointerStartRef.current.y;
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 0.6;

    if (Math.abs(deltaX) > 20 && isHorizontal) {
      if (deltaX < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
    pointerStartRef.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (isSwiped) {
      onSwipeRight();
    } else {
      onSelect();
    }
  };

  return (
    <div
      className={`customer-swipe-row-container ${isSwiped ? 'is-swiped' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartRef.current = null;
        isDraggingRef.current = false;
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <article
        className={`customer-card-item ${isSwiped ? 'is-swiped-left' : ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (isSwiped) onSwipeRight();
            else onSelect();
          }
        }}
        aria-label={`Customer ${customer.name}, code ${customer.code}`}
      >
        {/* Left Image Placeholder */}
        <div className="customer-avatar-box">
          {customer.image ? (
            <img src={customer.image} alt={customer.name} className="customer-avatar-img" />
          ) : (
            <div className="customer-avatar-placeholder">
              <ImagePlaceholderIcon />
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="customer-card-details">
          <div className="customer-names-block">
            <div className="customer-khmer-name">{customer.khmerName}</div>
            <h2 className="customer-latin-name">{customer.name}</h2>
          </div>

          <div className="customer-meta-row">
            {/* Document / SKU Code */}
            <div className="customer-code-meta">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="meta-svg-icon"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
              <span>{customer.code}</span>
            </div>

            {/* Phone */}
            <div className="customer-phone-meta">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="meta-svg-icon"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>
      </article>

      {/* Swipe Actions Panel: Visit, Customer Call, Sales Call */}
      <div className={`customer-swipe-action-panel ${isSwiped ? 'is-visible' : ''}`}>
        {/* Visit Button */}
        <button
          type="button"
          className="customer-swipe-btn is-visit"
          onClick={(e) => {
            e.stopPropagation();
            onVisit();
          }}
          aria-label={`Visit ${customer.name}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="customer-swipe-btn-label">Visit</span>
        </button>

        {/* Customer Call Button */}
        <button
          type="button"
          className="customer-swipe-btn is-customer-call"
          onClick={(e) => {
            e.stopPropagation();
            if (onCustomerCall) onCustomerCall();
          }}
          aria-label={`Customer Call ${customer.name}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="customer-swipe-btn-label">Customer<br />Call</span>
        </button>

        {/* Sales Call Button */}
        <button
          type="button"
          className="customer-swipe-btn is-sales-call"
          onClick={(e) => {
            e.stopPropagation();
            if (onSalesCall) onSalesCall();
          }}
          aria-label={`Sales Call ${customer.name}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="m9 14 2 2 4-4" />
          </svg>
          <span className="customer-swipe-btn-label">Sales<br />Call</span>
        </button>
      </div>
    </div>
  );
}

export function CustomersScreen({
  onSelectCustomer,
  onNavigateTab,
  activeNavTab = 'Customer',
  onCustomerCall,
  onSalesCall,
  checkedInCustomerIds = [],
  activeMapCustomer = null,
  onCheckInCustomer,
  onCheckOutCustomer,
  onCloseMapCustomer,
}: CustomersScreenProps) {
  const [primaryTab, setPrimaryTab] = useState<PrimaryFilterTab>('Customers');
  const [subFilter, setSubFilter] = useState<SubFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [swipedCustomerId, setSwipedCustomerId] = useState<string | null>(null);
  const [visitCustomer, setVisitCustomer] = useState<Customer | null>(null);
  const [activeMapVisitCustomer, setActiveMapVisitCustomer] = useState<Customer | null>(activeMapCustomer);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setActiveMapVisitCustomer(activeMapCustomer);
  }, [activeMapCustomer]);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  const allCount = 383;
  const directCount = 228;
  const indirectCount = 155;

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter((c) => {
      // Primary tab check
      if (primaryTab === 'Prospect' && !c.isProspect) {
        return false;
      }
      // Sub filter
      if (subFilter !== 'All' && c.type !== subFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.khmerName.includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.phone.includes(q)
        );
      }
      return true;
    });
  }, [primaryTab, subFilter, searchQuery]);

  if (activeMapVisitCustomer) {
    const isCheckedIn = checkedInCustomerIds.includes(activeMapVisitCustomer.id);
    return (
      <CustomerVisitMapScreen
        customer={activeMapVisitCustomer}
        isCheckedIn={isCheckedIn}
        onBack={() => {
          setActiveMapVisitCustomer(null);
          setVisitCustomer(null);
          setSwipedCustomerId(null);
          if (onCloseMapCustomer) onCloseMapCustomer();
        }}
        onCheckIn={(cust) => {
          if (onCheckInCustomer) {
            onCheckInCustomer(cust);
          } else if (onSelectCustomer) {
            onSelectCustomer(cust);
          } else {
            notify(`Checked in at ${cust.name}`);
          }
        }}
        onCheckOut={(cust) => {
          setActiveMapVisitCustomer(null);
          setVisitCustomer(null);
          setSwipedCustomerId(null);
          if (onCloseMapCustomer) onCloseMapCustomer();
          if (onCheckOutCustomer) {
            onCheckOutCustomer(cust);
          } else {
            notify(`Checked out from ${cust.name}`);
          }
        }}
        onViewOutletDetail={(cust) => {
          setActiveMapVisitCustomer(null);
          if (onCloseMapCustomer) onCloseMapCustomer();
          if (onSelectCustomer) {
            onSelectCustomer(cust);
          }
        }}
      />
    );
  }

  return (
    <div className="customers-screen-container" role="region" aria-label="Customers list screen">
      {/* Top Header Section */}
      <header className="customers-app-header">
        {/* Device Status Bar */}
        <div className="device-status" aria-label="Device status">
          <span>3:09</span>
          <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
          <div className="device-icons" aria-hidden="true">
            <img src="/assets/wifi.svg" alt="" />
            <img src="/assets/signal.svg" alt="" />
            <img className="battery" src="/assets/battery.svg" alt="" />
          </div>
        </div>

        {/* Title Bar with STAGING badge & Action buttons */}
        <div className="customers-top-bar">
          <div className="customers-title-left">
            <h1 className="customers-main-title">Customers</h1>
            <span className="staging-pill-badge">STAGING</span>
          </div>

          <div className="customers-top-actions">
            <button
              type="button"
              className="customers-icon-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search customers"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#18181b"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className="customers-icon-btn"
              onClick={() => notify('Barcode/QR Scanner opened')}
              aria-label="Scan QR or Barcode"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#18181b"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="6" height="6" x="3" y="3" rx="1" />
                <rect width="6" height="6" x="15" y="3" rx="1" />
                <rect width="6" height="6" x="3" y="15" rx="1" />
                <path d="M15 15h2v2h-2z" />
                <path d="M19 15v4" />
                <path d="M15 19h4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search input if toggled */}
        {isSearchOpen && (
          <div className="customers-search-input-wrap">
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
              className="customers-search-field"
              placeholder="Search name, code, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Primary Segmented Tab Switcher (Customers | Prospect) */}
        <div className="customers-segmented-tab-container">
          <div className="customers-segmented-tab-track">
            <button
              type="button"
              className={`segmented-tab-btn ${primaryTab === 'Customers' ? 'is-active' : ''}`}
              onClick={() => setPrimaryTab('Customers')}
            >
              Customers
            </button>
            <button
              type="button"
              className={`segmented-tab-btn ${primaryTab === 'Prospect' ? 'is-active' : ''}`}
              onClick={() => {
                setPrimaryTab('Prospect');
                notify('Prospect list view');
              }}
            >
              Prospect
            </button>
          </div>
        </div>

        {/* Sub Filter Chips (All(383) | Direct(228) | Indirect(155)) */}
        <div className="customers-sub-chips-row">
          <button
            type="button"
            className={`customer-sub-chip ${subFilter === 'All' ? 'is-active' : ''}`}
            onClick={() => setSubFilter('All')}
          >
            All<span className="chip-count">({allCount})</span>
          </button>

          <button
            type="button"
            className={`customer-sub-chip ${subFilter === 'Direct' ? 'is-active' : ''}`}
            onClick={() => setSubFilter('Direct')}
          >
            Direct<span className="chip-count">({directCount})</span>
          </button>

          <button
            type="button"
            className={`customer-sub-chip ${subFilter === 'Indirect' ? 'is-active' : ''}`}
            onClick={() => setSubFilter('Indirect')}
          >
            Indirect<span className="chip-count">({indirectCount})</span>
          </button>
        </div>
      </header>

      {/* Scrollable Customer Cards List */}
      <div className="customers-list-scroll-body">
        {filteredCustomers.length === 0 ? (
          <div className="customers-empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">No customers found</div>
            <div className="empty-state-desc">Try changing your search or filter selection.</div>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <SwipeableCustomerCard
              key={cust.id}
              customer={cust}
              isSwiped={swipedCustomerId === cust.id}
              onSwipeLeft={() => setSwipedCustomerId(cust.id)}
              onSwipeRight={() => setSwipedCustomerId(null)}
              onSelect={() => {
                if (onSelectCustomer) {
                  onSelectCustomer(cust);
                } else {
                  notify(`Selected ${cust.name}`);
                }
              }}
              onVisit={() => {
                setSwipedCustomerId(null);
                setVisitCustomer(cust);
              }}
              onCustomerCall={() => {
                if (onCustomerCall) {
                  onCustomerCall(cust);
                } else if (onSelectCustomer) {
                  onSelectCustomer(cust);
                } else {
                  notify(`Customer Call: ${cust.name}`);
                }
              }}
              onSalesCall={() => {
                if (onSalesCall) {
                  onSalesCall(cust);
                } else if (onSelectCustomer) {
                  onSelectCustomer(cust);
                } else {
                  notify(`Sales Call: ${cust.name}`);
                }
              }}
            />
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        className="customer-fab-btn"
        onClick={() => notify('Add New Customer opened')}
        aria-label="Add new customer"
        title="Add Customer"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      </button>

      {/* Bottom Navigation Bar */}
      <nav className="customers-bottom-nav" aria-label="Main Navigation">
        {/* Home */}
        <button
          type="button"
          className={`bottom-nav-item ${activeNavTab === 'Home' ? 'is-active' : ''}`}
          onClick={() => {
            if (onNavigateTab) onNavigateTab('Home');
            else notify('Home tab');
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="bottom-nav-label">Home</span>
        </button>

        {/* Visit */}
        <button
          type="button"
          className={`bottom-nav-item ${activeNavTab === 'Visit' ? 'is-active' : ''}`}
          onClick={() => {
            if (onNavigateTab) onNavigateTab('Visit');
            else notify('Visit tab');
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="bottom-nav-label">Visit</span>
        </button>

        {/* Order */}
        <button
          type="button"
          className={`bottom-nav-item ${activeNavTab === 'Order' ? 'is-active' : ''}`}
          onClick={() => {
            if (onNavigateTab) onNavigateTab('Order');
            else notify('Order tab');
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <span className="bottom-nav-label">Order</span>
        </button>

        {/* Customer (Active) */}
        <button
          type="button"
          className={`bottom-nav-item ${activeNavTab === 'Customer' ? 'is-active' : ''}`}
          onClick={() => {
            if (onNavigateTab) onNavigateTab('Customer');
            else notify('Customer tab');
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="bottom-nav-label">Customer</span>
        </button>
      </nav>

      {/* Shipping Address Bottom Sheet for Visit */}
      {visitCustomer && (
        <div
          className="customer-bottom-sheet-backdrop"
          onClick={() => setVisitCustomer(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Choose Shipping Address for Visit"
        >
          <div
            className="customer-bottom-sheet-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="bottom-sheet-handle" />

            {/* Shipping Address Card List */}
            <div className="shipping-address-list">
              <div
                className="shipping-address-card"
                onClick={() => {
                  const cust = visitCustomer;
                  setVisitCustomer(null);
                  setActiveMapVisitCustomer(cust);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="shipping-address-left">
                  <div className="shipping-map-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B49A00"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                      <line x1="9" y1="3" x2="9" y2="18" />
                      <line x1="15" y1="6" x2="15" y2="21" />
                    </svg>
                  </div>
                  <div className="shipping-address-text-group">
                    <h3 className="shipping-customer-name">{visitCustomer.name}</h3>
                    <p className="shipping-customer-address">
                      {visitCustomer.address ||
                        'In front of Khmer Soviet Friendship Hospital, Chamraeun Phal, Boeng Tumpun 1, Mean Chey, Phnom Penh'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="shipping-badge-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const cust = visitCustomer;
                    setVisitCustomer(null);
                    setActiveMapVisitCustomer(cust);
                  }}
                  aria-label={`Confirm shipping address for ${visitCustomer.name}`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M15 18H9" />
                    <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-4" />
                    <circle cx="7" cy="18" r="2" />
                    <circle cx="17" cy="18" r="2" />
                  </svg>
                  <span>Shipping</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-message" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
