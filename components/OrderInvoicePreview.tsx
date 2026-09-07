'use client';

import { useMemo, useState, useEffect } from 'react';
import { CartLineItem, PromoTypeCode } from './CartScreen';

interface OrderInvoicePreviewProps {
  cartLines: CartLineItem[];
  linePromotions?: Record<
    string,
    { productName: string; type: PromoTypeCode; quantity: number; unit: string }[]
  >;
  subtotal: number;
  discount: number;
  total: number;
  outletName?: string;
  onClose: () => void;
  onConfirmOrder?: () => void;
  onOrientationChange?: (isLandscape: boolean) => void;
}

export function OrderInvoicePreview({
  cartLines,
  linePromotions = {},
  subtotal,
  discount,
  total,
  outletName = 'Bun Sophear',
  onClose,
  onConfirmOrder,
  onOrientationChange,
}: OrderInvoicePreviewProps) {
  const [toast, setToast] = useState('');
  const [isLandscape, setIsLandscape] = useState(false);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function handleToggleOrientation() {
    const nextState = !isLandscape;
    setIsLandscape(nextState);
    if (onOrientationChange) {
      onOrientationChange(nextState);
    }
    notify(nextState ? 'Switched to Landscape View' : 'Switched to Portrait View');
  }

  // Cleanup orientation when closing
  function handleClose() {
    if (isLandscape && onOrientationChange) {
      onOrientationChange(false);
    }
    onClose();
  }

  useEffect(() => {
    return () => {
      if (onOrientationChange) {
        onOrientationChange(false);
      }
    };
  }, [onOrientationChange]);

  // Compile list of table rows with promo items as nested sub-products
  const tableRows = useMemo(() => {
    let mainIndex = 1;
    const rows: {
      id: string;
      index: number;
      name: string;
      qty: number;
      unit: string;
      unitPrice: number;
      discount: number;
      totalPrice: number;
      isPromo?: boolean;
    }[] = [];

    cartLines.forEach((item, itemIdx) => {
      const lineDiscount = 0.0;
      const currentMainIndex = mainIndex++;

      rows.push({
        id: `item-${item.id || itemIdx}`,
        index: currentMainIndex,
        name: item.productName,
        qty: item.quantity,
        unit: item.unit || 'Case',
        unitPrice: item.unitPrice,
        discount: lineDiscount,
        totalPrice: item.totalPrice,
        isPromo: false,
      });

      // Check if this item has attached promotions - render as sub-products
      const promos = linePromotions[item.id] || [];
      promos.forEach((p, pIdx) => {
        rows.push({
          id: `promo-${item.id}-${pIdx}`,
          index: currentMainIndex,
          name: p.productName,
          qty: p.quantity,
          unit: p.unit || 'Case',
          unitPrice: 0.0,
          discount: 0.0,
          totalPrice: 0.0,
          isPromo: true,
        });
      });
    });

    return rows;
  }, [cartLines, linePromotions]);

  const totalQuantity = useMemo(() => {
    return tableRows.reduce((sum, r) => sum + r.qty, 0);
  }, [tableRows]);

  const invoiceNumber = 'SO-2026-0903-0821';
  const orderDate = '03-Sep-2026 08:21 AM';

  return (
    <div
      className={`invoice-preview-screen ${isLandscape ? 'is-landscape' : ''}`}
      role="region"
      aria-label="Order Invoice Preview"
    >
      {/* Device Status Bar */}
      <div className={`device-status ${isLandscape ? 'is-landscape-status' : ''}`} aria-label="Device status">
        <span>8:21</span>
        {!isLandscape && <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />}
        <div className="device-icons" aria-hidden="true">
          <img src="/assets/wifi.svg" alt="" />
          <img src="/assets/signal.svg" alt="" />
          <img className="battery" src="/assets/battery.svg" alt="" />
        </div>
      </div>

      {/* Navigation Top Bar */}
      <header className="invoice-nav-header">
        <div className="invoice-header-left">
          <button
            type="button"
            className="invoice-back-btn invoice-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#18181b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="invoice-header-title-wrap">
          <h1 className="invoice-nav-title">Order Preview</h1>
          {isLandscape && <span className="invoice-nav-subtitle">Landscape View (Full Width)</span>}
        </div>

        <div className="invoice-header-actions">
          {/* Rotate Screen Button */}
          <button
            type="button"
            className={`invoice-action-icon-btn rotate-screen-btn ${isLandscape ? 'is-active-landscape' : ''}`}
            onClick={handleToggleOrientation}
            aria-label={isLandscape ? 'Rotate to Portrait' : 'Rotate to Landscape'}
            title={isLandscape ? 'Switch to Portrait' : 'Rotate Screen to Landscape'}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`rotate-icon-svg ${isLandscape ? 'rotated' : ''}`}
            >
              {/* Screen rotation icon */}
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            <span className="rotate-btn-label">{isLandscape ? 'Portrait' : 'Rotate'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            className="invoice-action-icon-btn"
            onClick={() => notify('Share dialog opened')}
            aria-label="Share Order"
            title="Share"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b49a00"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </header>

      {/* Printable PDF Sheet Container (Scrollable) */}
      <div className={`invoice-scroll-body ${isLandscape ? 'is-landscape-body' : ''}`}>
        <div className={`invoice-paper-sheet ${isLandscape ? 'is-landscape-sheet' : ''}`}>
          {/* Header Row on Paper */}
          <div className="sale-order-paper-header">
            <div>
              <h1 className="sale-order-main-title">Order Preview</h1>
              <div className="sale-order-sub-meta">
                <span>Invoice #{invoiceNumber}</span> • <span>{orderDate}</span>
              </div>
            </div>

            {/* Quick Landscape Badge/Toggle */}
            <button
              type="button"
              className="quick-orientation-chip"
              onClick={handleToggleOrientation}
              title="Click to toggle orientation"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M21 21v-5h-5" />
              </svg>
              <span>{isLandscape ? 'Portrait Mode' : 'Rotate to Landscape'}</span>
            </button>
          </div>

          {/* Customer & Order Metadata Block */}
          <div className={`sale-order-meta-block ${isLandscape ? 'is-landscape-meta' : ''}`}>
            <div className="meta-col">
              <div className="meta-info-row">
                <span className="meta-row-label">Customer:</span>
                <span className="meta-row-value font-semibold">{outletName}</span>
              </div>
              <div className="meta-info-row">
                <span className="meta-row-label">Customer Phone:</span>
                <span className="meta-row-value">-</span>
              </div>
            </div>
            <div className="meta-col">
              <div className="meta-info-row">
                <span className="meta-row-label">Created By:</span>
                <span className="meta-row-value">000366 - Horn Kakada</span>
              </div>
              <div className="meta-info-row">
                <span className="meta-row-label">Total Items:</span>
                <span className="meta-row-value">{totalQuantity} Cases ({tableRows.length} lines)</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="sale-order-table-container">
            <table className={`sale-order-table ${isLandscape ? 'is-landscape-table' : ''}`}>
              <thead>
                <tr>
                  <th className="so-th-item">Item Name</th>
                  <th className="so-th-qty">Quantity</th>
                  <th className="so-th-price">Unit Price</th>
                  <th className="so-th-discount">Discount</th>
                  <th className="so-th-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`table-row-item ${row.isPromo ? 'sub-product-row' : 'main-product-row'}`}
                  >
                    <td className="so-td-item">
                      <div className={`so-item-name ${row.isPromo ? 'is-sub-product-name' : ''}`}>
                        {row.isPromo && <span className="sub-product-bullet">↳</span>}
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td className="so-td-qty">
                      <span className="so-qty-num">{row.qty}</span>{' '}
                      <span className="so-qty-unit">{row.unit}</span>
                    </td>
                    <td className="so-td-price">
                      {row.isPromo ? (
                        <span className="so-price-free">$0.000</span>
                      ) : (
                        `$${row.unitPrice.toFixed(3)}`
                      )}
                    </td>
                    <td className="so-td-discount">
                      {row.discount > 0 ? (
                        <span className="so-disc-active">-${row.discount.toFixed(3)}</span>
                      ) : (
                        <span className="so-disc-zero">$0.000</span>
                      )}
                    </td>
                    <td className="so-td-total">
                      {row.isPromo ? (
                        <span className="so-total-free">$0.000</span>
                      ) : (
                        `$${row.totalPrice.toFixed(3)}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary / Totals Block */}
          <div className="sale-order-summary-wrapper">
            <div className={`sale-order-summary-box ${isLandscape ? 'is-landscape-summary' : ''}`}>
              <div className="so-summary-row">
                <span className="so-sum-label">Subtotal</span>
                <span className="so-sum-val">${subtotal.toFixed(3)}</span>
              </div>
              <div className="so-summary-row">
                <span className="so-sum-label">VAT</span>
                <span className="so-sum-val">$0.000</span>
              </div>
              <div className="so-summary-row">
                <span className="so-sum-label">Total Discount</span>
                <span className="so-sum-val text-emerald-600">-${discount.toFixed(3)}</span>
              </div>

              <div className="so-summary-divider" />

              <div className="so-grand-total-row">
                <span className="so-grand-label">Grand Total</span>
                <span className="so-grand-val">${total.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast-message" role="status">
          {toast}
        </div>
      )}

      {/* Home Indicator */}
      <div className="home-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
