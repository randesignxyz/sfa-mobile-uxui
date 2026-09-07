'use client';

import { useMemo, useState } from 'react';
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
}: OrderInvoicePreviewProps) {
  const [toast, setToast] = useState('');

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  // Compile full list of table rows including attached promotion lines
  const tableRows = useMemo(() => {
    let index = 1;
    const rows: {
      index: number;
      name: string;
      code: string;
      type: string;
      qty: number;
      unit: string;
      unitPrice: number;
      totalPrice: number;
      isPromo?: boolean;
    }[] = [];

    cartLines.forEach((item) => {
      rows.push({
        index: index++,
        name: item.productName,
        code: item.productCode,
        type: item.tier,
        qty: item.quantity,
        unit: item.unit || 'Case',
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      });

      // Check if this item has attached promotions
      const promos = linePromotions[item.id] || [];
      promos.forEach((p) => {
        rows.push({
          index: index++,
          name: p.productName,
          code: item.productCode,
          type: p.type,
          qty: p.quantity,
          unit: p.unit || 'Case',
          unitPrice: 0.0,
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
    <div className="invoice-preview-screen" role="region" aria-label="Order Invoice Preview">
      {/* Device Status Bar */}
      <div className="device-status" aria-label="Device status">
        <span>8:21</span>
        <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
        <div className="device-icons" aria-hidden="true">
          <img src="/assets/wifi.svg" alt="" />
          <img src="/assets/signal.svg" alt="" />
          <img className="battery" src="/assets/battery.svg" alt="" />
        </div>
      </div>

      {/* Navigation Top Bar */}
      <header className="invoice-nav-header">
        <button
          type="button"
          className="invoice-back-btn invoice-close-btn"
          onClick={onClose}
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

        <div className="invoice-header-title-wrap">
          <h1 className="invoice-nav-title">Order Preview</h1>
        </div>

        <div className="invoice-header-actions">
          <button
            type="button"
            className="invoice-action-icon-btn"
            onClick={() => notify('Order Preview PDF downloaded')}
            aria-label="Download PDF"
            title="Download PDF"
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

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
      <div className="invoice-scroll-body">
        <div className="invoice-paper-sheet">
          {/* Large Title */}
          <h1 className="sale-order-main-title">Order Preview</h1>

          {/* Customer & Order Metadata Block */}
          <div className="sale-order-meta-block">
            <div className="meta-info-row">
              <span className="meta-row-label">Customer:</span>
              <span className="meta-row-value">{outletName}</span>
            </div>
            <div className="meta-info-row">
              <span className="meta-row-label">Customer Phone:</span>
              <span className="meta-row-value">-</span>
            </div>
            <div className="meta-info-row">
              <span className="meta-row-label">Created By:</span>
              <span className="meta-row-value">000366 - Horn Kakada</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="sale-order-table-container">
            <table className="sale-order-table">
              <thead>
                <tr>
                  <th className="so-th-item">Item Name</th>
                  <th className="so-th-qty">Quantity</th>
                  <th className="so-th-price">Unit Price</th>
                  <th className="so-th-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.index}>
                    <td className="so-td-item">
                      <div className="so-item-name">{row.name}</div>
                    </td>
                    <td className="so-td-qty">
                      <span className="so-qty-num">{row.qty}</span>{' '}
                      <span className="so-qty-unit">{row.unit}</span>
                    </td>
                    <td className="so-td-price">${row.unitPrice.toFixed(3)}</td>
                    <td className="so-td-total">${row.totalPrice.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary / Totals Block */}
          <div className="sale-order-summary-wrapper">
            <div className="sale-order-summary-box">
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
                <span className="so-sum-val">${discount.toFixed(3)}</span>
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
