'use client';

import { useMemo, useState, useEffect, Fragment } from 'react';
import { CartLineItem, PromoTypeCode } from './CartScreen';
import { formatQuantity } from '@/lib/format-number';

const invoiceMoneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatInvoiceMoney = (val: number) => invoiceMoneyFormatter.format(val);

export interface GratisPreviewItem {
  id: string;
  productName: string;
  type?: string;
  remark?: string;
  quantity: number;
  unit: string;
}

interface OrderInvoicePreviewProps {
  cartLines: CartLineItem[];
  linePromotions?: Record<
    string,
    { productName: string; type: PromoTypeCode; quantity: number; unit: string }[]
  >;
  appliedGratisPromotions?: GratisPreviewItem[];
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
  appliedGratisPromotions = [],
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
      tag?: string;
      remark?: string;
      qty: number;
      unit: string;
      unitPrice: number;
      discount: number;
      totalPrice: number;
      isPromo?: boolean;
      isGratis?: boolean;
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

    // Include applied Gratis promotions as dedicated bonus lines
    appliedGratisPromotions.forEach((g, gIdx) => {
      const currentMainIndex = mainIndex++;
      rows.push({
        id: `gratis-${g.id || gIdx}`,
        index: currentMainIndex,
        name: g.productName,
        tag: g.type,
        remark: g.remark || 'ផលតិផលលើកទឹកចិត្តការលក់ប្រចាំខែ 1,0,3 ឆ្នាំ 2026',
        qty: g.quantity,
        unit: g.unit || 'Case',
        unitPrice: 0.0,
        discount: 0.0,
        totalPrice: 0.0,
        isPromo: true,
        isGratis: true,
      });
    });

    return rows;
  }, [cartLines, linePromotions, appliedGratisPromotions]);

  const totalQuantity = useMemo(() => {
    return tableRows.reduce((sum, r) => sum + r.qty, 0);
  }, [tableRows]);

  const totalDistinctItems = useMemo(() => {
    const skuSet = new Set(
      tableRows.map((r) => r.name.trim().toLowerCase().replace(/\s+/g, ' '))
    );
    return skuSet.size;
  }, [tableRows]);


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
        </div>

        <div className="invoice-header-actions">
          {/* Rotate Screen Icon Button (Phone Vertical / Horizontal) */}
          <button
            type="button"
            className={`invoice-action-icon-btn rotate-screen-icon-btn ${isLandscape ? 'is-active-landscape' : ''}`}
            onClick={handleToggleOrientation}
            aria-label={isLandscape ? 'Switch to Portrait (Vertical)' : 'Switch to Landscape (Horizontal)'}
            title={isLandscape ? 'Switch to Portrait (Vertical)' : 'Switch to Landscape (Horizontal)'}
          >
            {isLandscape ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="13" height="20" x="5.5" y="2" rx="2.5" />
                <path d="M12 18.5h.01" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="13" x="2" y="5.5" rx="2.5" />
                <path d="M5.5 12h.01" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Printable PDF Sheet Container (Scrollable) */}
      <div className={`invoice-scroll-body ${isLandscape ? 'is-landscape-body' : ''}`}>
        <div className={`invoice-paper-sheet ${isLandscape ? 'is-landscape-sheet' : ''}`}>
          {/* Clean Header on Paper */}
          <div className="sale-order-paper-header">
            <div>
              <h1 className="sale-order-main-title">Order Preview</h1>
            </div>
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
                <span className="meta-row-value">
                  {formatQuantity(totalQuantity)} ({formatQuantity(totalDistinctItems)} {totalDistinctItems === 1 ? 'item' : 'items'})
                </span>
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
                {tableRows.map((row, idx) => {
                  const isFirstGratis = row.isGratis && (idx === 0 || !tableRows[idx - 1]?.isGratis);
                  const showRemark = Boolean(
                    row.remark && (idx === 0 || tableRows[idx - 1]?.remark !== row.remark)
                  );
                  return (
                    <Fragment key={row.id}>
                      {showRemark && (
                        <tr className={`so-remark-header-row ${isFirstGratis ? 'is-first-gratis-row' : ''}`}>
                          <td colSpan={5} className="so-remark-header-td">
                            <span className="so-remark-header-text">{row.remark}</span>
                          </td>
                        </tr>
                      )}
                      <tr
                        className={`table-row-item ${
                          row.isGratis
                            ? 'gratis-product-row'
                            : row.isPromo
                            ? 'sub-product-row'
                            : 'main-product-row'
                        } ${isFirstGratis && !showRemark ? 'is-first-gratis-row' : ''}`}
                      >
                        <td className="so-td-item">
                          <div
                            className={`so-item-name ${
                              row.isGratis
                                ? 'is-gratis-product-name'
                                : row.isPromo
                                ? 'is-sub-product-name'
                                : ''
                            }`}
                          >
                            {row.isPromo && !row.isGratis && <span className="sub-product-bullet">↳</span>}
                            <span>{row.name}</span>
                          </div>
                        </td>
                        <td className="so-td-qty">
                          <span className="so-qty-num">{formatQuantity(row.qty)}</span>{' '}
                          <span className="so-qty-unit">{row.unit}</span>
                        </td>
                        <td className="so-td-price">
                          {row.isPromo ? (
                            <span className="so-price-free">$0.00</span>
                          ) : (
                            `$${formatInvoiceMoney(row.unitPrice)}`
                          )}
                        </td>
                        <td className="so-td-discount">
                          {row.discount > 0 ? (
                            <span className="so-disc-active">-${formatInvoiceMoney(row.discount)}</span>
                          ) : (
                            <span className="so-disc-zero">$0.00</span>
                          )}
                        </td>
                        <td className="so-td-total">
                          {row.isPromo ? (
                            <span className="so-total-free">$0.00</span>
                          ) : (
                            `$${formatInvoiceMoney(row.totalPrice)}`
                          )}
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary / Totals Block */}
          <div className="sale-order-summary-wrapper">
            <div className={`sale-order-summary-box ${isLandscape ? 'is-landscape-summary' : ''}`}>
              <div className="so-summary-row">
                <span className="so-sum-label">Subtotal</span>
                <span className="so-sum-val">${formatInvoiceMoney(subtotal)}</span>
              </div>
              <div className="so-summary-row">
                <span className="so-sum-label">VAT</span>
                <span className="so-sum-val">$0.00</span>
              </div>

              <div className="so-summary-divider" />

              <div className="so-grand-total-row">
                <span className="so-grand-label">Total</span>
                <span className="so-grand-val">${formatInvoiceMoney(total)}</span>
              </div>
              <div className="so-grand-total-row so-khr-row">
                <span className="so-grand-label">Total (KHR)</span>
                <span className="so-grand-val">៛{formatQuantity(Math.round(total * 4000))}</span>
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
