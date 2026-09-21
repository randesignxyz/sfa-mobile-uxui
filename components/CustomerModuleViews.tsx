'use client';

import React, { useState } from 'react';
import type { Customer } from './CustomersScreen';
import type { ProductItem } from './AddToCartScreen';

export interface CustomerModuleViewsProps {
  tab: 'Record Stock' | 'Merchandise' | 'POSM' | 'Insight' | 'Issue' | 'Photo Upload';
  customer: Customer;
  products: ProductItem[];
  notify: (msg: string) => void;
}

export function CustomerModuleViews({
  tab,
  customer,
  products,
  notify,
}: CustomerModuleViewsProps) {
  // --- Record Stock State ---
  const [stockCategory, setStockCategory] = useState<'All' | 'Vital' | 'Mee Chiet' | 'OM'>('All');
  const [stockCounts, setStockCounts] = useState<Record<number, { cases: number; packs: number }>>(() => {
    const initial: Record<number, { cases: number; packs: number }> = {};
    products.forEach((p, idx) => {
      initial[p.id] = { cases: idx % 3 === 0 ? 5 : 2, packs: 0 };
    });
    return initial;
  });

  const filteredStockProducts = products.filter(
    (p) => stockCategory === 'All' || p.category === stockCategory
  );

  const handleUpdateStock = (productId: number, field: 'cases' | 'packs', delta: number) => {
    setStockCounts((prev) => {
      const current = prev[productId] || { cases: 0, packs: 0 };
      const nextVal = Math.max(0, current[field] + delta);
      return {
        ...prev,
        [productId]: { ...current, [field]: nextVal },
      };
    });
  };

  // --- Merchandise Checklist State ---
  const [merchandiseChecks, setMerchandiseChecks] = useState({
    facing: true,
    planogram: true,
    priceTags: true,
    chillerClean: true,
    fifoRotation: false,
    promotionalDisplays: true,
  });

  // --- POSM State ---
  const [posmItems] = useState([
    { id: 1, name: 'Vital 350ml Poster', type: 'Wall Poster', condition: 'Good', date: '10 Aug 2026' },
    { id: 2, name: 'Mee Chiet Acrylic Standee', type: 'Table Tent', condition: 'Good', date: '02 Aug 2026' },
    { id: 3, name: 'Vital Cooler Vinyl Sticker', type: 'Sticker', condition: 'Damaged', date: '15 Jul 2026' },
    { id: 4, name: 'Outdoor Brand Banner 2x1m', type: 'Signage', condition: 'Fair', date: '28 Jun 2026' },
  ]);

  // --- Issues State ---
  const [issues, setIssues] = useState([
    {
      id: 'ISS-1048',
      title: 'Damaged Vital 500mL carton during unloading',
      category: 'Product Quality',
      status: 'Open',
      date: 'Today, 07:45 AM',
      priority: 'High',
    },
    {
      id: 'ISS-0982',
      title: 'Cooler LED lamp flickering',
      category: 'Equipment',
      status: 'Resolved',
      date: '14 Sep 2026',
      priority: 'Normal',
    },
  ]);
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueCategory, setNewIssueCategory] = useState('Product Quality');

  // --- Photos State ---
  const [photos, setPhotos] = useState([
    { id: 1, title: 'Storefront Entrance', time: '07:46 AM', verified: true },
    { id: 2, title: 'Main Gondola Shelf', time: null, verified: false },
    { id: 3, title: 'Vital Chiller Display', time: null, verified: false },
    { id: 4, title: 'POSM & Signage', time: null, verified: false },
  ]);

  return (
    <div className="module-view-container">
      {/* 1. Record Stock Module */}
      {tab === 'Record Stock' && (
        <div className="module-subview">
          <div className="module-filter-bar">
            {(['All', 'Vital', 'Mee Chiet', 'OM'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-chip-btn ${stockCategory === cat ? 'is-active' : ''}`}
                onClick={() => setStockCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="module-section-header">
            <div>
              <h3 className="module-section-title">On-Hand Stock Audit</h3>
              <p className="module-section-desc">Count and record existing customer inventory</p>
            </div>
            <span className="module-pill-badge">{filteredStockProducts.length} SKUs</span>
          </div>

          <div className="module-cards-list">
            {filteredStockProducts.map((p) => {
              const count = stockCounts[p.id] || { cases: 0, packs: 0 };
              return (
                <div key={p.id} className="stock-record-card">
                  <div className="card-thumb-box" style={{ width: 48, height: 48, flexShrink: 0 }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="card-thumb-img" />
                    ) : (
                      <div className="card-thumb-placeholder" />
                    )}
                  </div>
                  <div className="stock-card-details">
                    <h4 className="stock-product-name">{p.name}</h4>
                    <span className="stock-product-sku">{p.code} • {p.pack || p.unit}</span>

                    <div className="stock-steppers-row">
                      <div className="stock-stepper-item">
                        <span className="stock-unit-label">Cases:</span>
                        <div className="stock-stepper-ctrl">
                          <button
                            type="button"
                            className="stock-step-btn"
                            onClick={() => handleUpdateStock(p.id, 'cases', -1)}
                          >
                            -
                          </button>
                          <span className="stock-count-val">{count.cases}</span>
                          <button
                            type="button"
                            className="stock-step-btn"
                            onClick={() => handleUpdateStock(p.id, 'cases', 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="stock-stepper-item">
                        <span className="stock-unit-label">Packs:</span>
                        <div className="stock-stepper-ctrl">
                          <button
                            type="button"
                            className="stock-step-btn"
                            onClick={() => handleUpdateStock(p.id, 'packs', -1)}
                          >
                            -
                          </button>
                          <span className="stock-count-val">{count.packs}</span>
                          <button
                            type="button"
                            className="stock-step-btn"
                            onClick={() => handleUpdateStock(p.id, 'packs', 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="module-bottom-cta">
            <button
              type="button"
              className="module-action-btn primary"
              onClick={() => notify('Stock counts saved successfully')}
            >
              Save Stock Record
            </button>
          </div>
        </div>
      )}

      {/* 2. Merchandise Module */}
      {tab === 'Merchandise' && (
        <div className="module-subview">
          <div className="module-section-header">
            <div>
              <h3 className="module-section-title">Merchandising Standards</h3>
              <p className="module-section-desc">Audit shelf compliance and visual execution</p>
            </div>
            <span className="module-status-chip success">Score: 85%</span>
          </div>

          <div className="merchandise-summary-card">
            <div className="merch-stat">
              <span className="merch-stat-num">65%</span>
              <span className="merch-stat-label">Shelf Share</span>
            </div>
            <div className="merch-stat-divider" />
            <div className="merch-stat">
              <span className="merch-stat-num">Eye-Level</span>
              <span className="merch-stat-label">Placement</span>
            </div>
            <div className="merch-stat-divider" />
            <div className="merch-stat">
              <span className="merch-stat-num">4°C</span>
              <span className="merch-stat-label">Cooler Temp</span>
            </div>
          </div>

          <div className="checklist-card">
            <h4 className="checklist-card-title">Store Execution Checklist</h4>
            {[
              { key: 'facing', label: 'Primary Brand Facing (Vital / Mee Chiet)' },
              { key: 'planogram', label: 'Planogram layout adhered according to guidelines' },
              { key: 'priceTags', label: 'Price tags and promo talkers clearly displayed' },
              { key: 'chillerClean', label: 'Cooler clean, lighted, and fully stocked' },
              { key: 'fifoRotation', label: 'FIFO stock rotation conducted (Check expiry)' },
              { key: 'promotionalDisplays', label: 'Promotional floor stack / endcap placed' },
            ].map((item) => (
              <label key={item.key} className="checklist-row">
                <input
                  type="checkbox"
                  checked={merchandiseChecks[item.key as keyof typeof merchandiseChecks]}
                  onChange={(e) =>
                    setMerchandiseChecks((prev) => ({
                      ...prev,
                      [item.key]: e.target.checked,
                    }))
                  }
                  className="checklist-checkbox"
                />
                <span className="checklist-text">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="module-bottom-cta">
            <button
              type="button"
              className="module-action-btn primary"
              onClick={() => notify('Merchandising audit submitted')}
            >
              Submit Merchandising Audit
            </button>
          </div>
        </div>
      )}

      {/* 3. POSM Module */}
      {tab === 'POSM' && (
        <div className="module-subview">
          <div className="module-section-header">
            <div>
              <h3 className="module-section-title">POSM Materials</h3>
              <p className="module-section-desc">Point of sale materials deployed at outlet</p>
            </div>
            <button
              type="button"
              className="module-header-add-btn"
              onClick={() => notify('POSM Request form opened')}
            >
              + Request POSM
            </button>
          </div>

          <div className="posm-list">
            {posmItems.map((item) => (
              <div key={item.id} className="posm-item-card">
                <div className="posm-item-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b49a00" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="posm-item-info">
                  <h4 className="posm-item-title">{item.name}</h4>
                  <div className="posm-item-meta">
                    <span>{item.type}</span>
                    <span className="dot-sep">•</span>
                    <span>Installed: {item.date}</span>
                  </div>
                </div>
                <span className={`posm-status-tag ${item.condition.toLowerCase()}`}>
                  {item.condition}
                </span>
              </div>
            ))}
          </div>

          <div className="module-bottom-cta">
            <button
              type="button"
              className="module-action-btn outline"
              onClick={() => notify('POSM verification confirmed')}
            >
              Verify All POSM
            </button>
          </div>
        </div>
      )}

      {/* 4. Insight Module */}
      {tab === 'Insight' && (
        <div className="module-subview">
          <div className="module-section-header">
            <div>
              <h3 className="module-section-title">Customer 360 Insights</h3>
              <p className="module-section-desc">Performance, purchasing trends and order habits</p>
            </div>
            <span className="module-pill-badge gold">Direct Outlet</span>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Avg. Order Value</span>
              <span className="kpi-value">$284.50</span>
              <span className="kpi-sub positive">+12% vs last month</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Order Frequency</span>
              <span className="kpi-value">Weekly</span>
              <span className="kpi-sub">Every Tuesday</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Top Selling SKU</span>
              <span className="kpi-value">Vital 350 mL</span>
              <span className="kpi-sub">58 cases / month</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Outstanding Balance</span>
              <span className="kpi-value">$0.00</span>
              <span className="kpi-sub positive">Good Standing</span>
            </div>
          </div>

          <div className="insight-section-card">
            <h4 className="insight-card-heading">Recent Order History</h4>
            <div className="recent-orders-list">
              <div className="order-history-row">
                <div>
                  <span className="order-hist-id">SO-2026-0914</span>
                  <span className="order-hist-date">14 Sep 2026</span>
                </div>
                <div className="order-hist-right">
                  <span className="order-hist-amt">$312.00</span>
                  <span className="order-status-chip delivered">Delivered</span>
                </div>
              </div>
              <div className="order-history-row">
                <div>
                  <span className="order-hist-id">SO-2026-0907</span>
                  <span className="order-hist-date">07 Sep 2026</span>
                </div>
                <div className="order-hist-right">
                  <span className="order-hist-amt">$265.00</span>
                  <span className="order-status-chip delivered">Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Issue Module */}
      {tab === 'Issue' && (
        <div className="module-subview">
          <div className="module-section-header">
            <div>
              <h3 className="module-section-title">Outlet Issues & Tickets</h3>
              <p className="module-section-desc">Report and track complaints or feedback</p>
            </div>
            <button
              type="button"
              className="module-header-add-btn"
              onClick={() => setIsNewIssueModalOpen(true)}
            >
              + Report Issue
            </button>
          </div>

          <div className="issues-list">
            {issues.map((iss) => (
              <div key={iss.id} className="issue-card">
                <div className="issue-card-top">
                  <span className="issue-ticket-id">{iss.id}</span>
                  <span className={`issue-status-badge ${iss.status.toLowerCase()}`}>
                    {iss.status}
                  </span>
                </div>
                <h4 className="issue-title">{iss.title}</h4>
                <div className="issue-card-meta">
                  <span>{iss.category}</span>
                  <span className="dot-sep">•</span>
                  <span>{iss.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* New Issue Dialog Modal */}
          {isNewIssueModalOpen && (
            <div className="checkin-modal-backdrop" role="dialog" aria-modal="true">
              <div className="checkin-modal-card">
                <h3 className="checkin-modal-title">Report New Issue</h3>
                <p className="checkin-modal-subtitle">Log an issue for {customer.name}</p>

                <div className="modal-form-group">
                  <label className="modal-input-label">Issue Category</label>
                  <select
                    className="modal-select-input"
                    value={newIssueCategory}
                    onChange={(e) => setNewIssueCategory(e.target.value)}
                  >
                    <option value="Product Quality">Product Quality / Damaged</option>
                    <option value="Delivery Delay">Delivery Delay</option>
                    <option value="Equipment">Cooler / Equipment Failure</option>
                    <option value="Billing">Pricing / Invoice Discrepancy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="modal-form-group">
                  <label className="modal-input-label">Description</label>
                  <textarea
                    className="modal-textarea-input"
                    rows={3}
                    placeholder="Describe the issue in detail..."
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.target.value)}
                  />
                </div>

                <div className="checkin-modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setIsNewIssueModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="modal-confirm-btn"
                    onClick={() => {
                      if (newIssueTitle.trim()) {
                        setIssues((prev) => [
                          {
                            id: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
                            title: newIssueTitle.trim(),
                            category: newIssueCategory,
                            status: 'Open',
                            date: 'Just now',
                            priority: 'High',
                          },
                          ...prev,
                        ]);
                        setNewIssueTitle('');
                        setIsNewIssueModalOpen(false);
                        notify('Issue reported successfully');
                      }
                    }}
                  >
                    Submit Ticket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Photo Upload Module */}
      {tab === 'Photo Upload' && (
        <div className="module-subview">
          <div className="module-section-header">
            <div>
              <h3 className="module-section-title">Visit Photo Documentation</h3>
              <p className="module-section-desc">Capture photos for audit and verification</p>
            </div>
            <span className="module-pill-badge">{photos.filter((p) => p.verified).length} / {photos.length} Done</span>
          </div>

          <div className="photo-slots-grid">
            {photos.map((item) => (
              <div key={item.id} className={`photo-slot-card ${item.verified ? 'is-verified' : ''}`}>
                <div className="photo-slot-thumb">
                  {item.verified ? (
                    <div className="photo-mock-preview">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="photo-time-badge">{item.time}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="photo-capture-trigger"
                      onClick={() => {
                        setPhotos((prev) =>
                          prev.map((p) =>
                            p.id === item.id ? { ...p, verified: true, time: 'Just now' } : p
                          )
                        );
                        notify(`Captured ${item.title}`);
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b49a00" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span className="photo-capture-text">Tap to Capture</span>
                    </button>
                  )}
                </div>
                <div className="photo-slot-meta">
                  <span className="photo-slot-title">{item.title}</span>
                  {item.verified ? (
                    <span className="photo-status-ok">Verified</span>
                  ) : (
                    <span className="photo-status-pending">Required</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="module-bottom-cta">
            <button
              type="button"
              className="module-action-btn primary"
              onClick={() => notify('Visit photos uploaded successfully')}
            >
              Upload All Photos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
