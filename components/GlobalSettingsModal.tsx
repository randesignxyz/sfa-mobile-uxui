'use client';

import React from 'react';
import { useSettings, PROMO_CATALOG_TYPES } from '@/context/SettingsContext';
import { TransactionTypeTag } from '@/components/ui/transaction-type-tag';
import { PromoDetailTab } from '@/components/CartScreen';

export function GlobalSettingsModal() {
  const {
    promoSettings,
    setPromoSettings,
    visibleCategories,
    resetPromoSettings,
    isGlobalSettingsOpen,
    setIsGlobalSettingsOpen,
    activeSettingsTab,
    setActiveSettingsTab,
    deviceModel,
    setDeviceModel,
    isLandscape,
    setIsLandscape,
    autoPromotions,
    setAutoPromotions,
    defaultUom,
    setDefaultUom,
    enableNotifications,
    setEnableNotifications,
    resetAllSettings,
  } = useSettings();

  if (!isGlobalSettingsOpen) return null;

  return (
    <div
      className="select-promo-modal-backdrop global-settings-backdrop"
      onClick={() => setIsGlobalSettingsOpen(false)}
    >
      <div
        className="select-promo-modal-sheet global-settings-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Global Settings"
      >
        <div className="sheet-drag-handle" />

        {/* Modal Header */}
        <div className="global-settings-header">
          <div className="global-settings-header-left">
            <h2 className="global-settings-title-text">Global Settings</h2>
            <span className="global-settings-sub-text">
              Configure promotions and system controls
            </span>
          </div>

          <div className="global-settings-header-actions">
            <button
              type="button"
              className="promo-reset-btn"
              onClick={() => {
                if (activeSettingsTab === 'promotions') {
                  resetPromoSettings();
                } else {
                  resetAllSettings();
                }
              }}
              title="Reset current settings to default"
            >
              Reset
            </button>

            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsGlobalSettingsOpen(false)}
              aria-label="Close global settings"
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
        </div>

        {/* Navigation Tabs Bar */}
        <div className="global-settings-tabs-bar" role="tablist" aria-label="Settings categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeSettingsTab === 'promotions'}
            className={`global-settings-tab-btn ${
              activeSettingsTab === 'promotions' ? 'is-active' : ''
            }`}
            onClick={() => setActiveSettingsTab('promotions')}
          >
            Promotions
            <span className="tab-pill-count">{visibleCategories.length}/2</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSettingsTab === 'order'}
            className={`global-settings-tab-btn ${
              activeSettingsTab === 'order' ? 'is-active' : ''
            }`}
            onClick={() => setActiveSettingsTab('order')}
          >
            Order Rules
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSettingsTab === 'device'}
            className={`global-settings-tab-btn ${
              activeSettingsTab === 'device' ? 'is-active' : ''
            }`}
            onClick={() => setActiveSettingsTab('device')}
          >
            Device & Frame
          </button>
        </div>

        <div className="modal-header-divider" />

        {/* Modal Body Content */}
        <div className="global-settings-content">
          {activeSettingsTab === 'promotions' && (
            <div className="global-settings-section-container">
              {/* Promotion Categories */}
              <section className="promo-settings-section">
                <div className="promo-settings-section-header">
                  <span className="promo-settings-section-title">PROMOTION CATEGORIES</span>
                  <span className="promo-settings-badge">
                    {visibleCategories.length}/2 Active
                  </span>
                </div>

                <div className="global-settings-callout-box">
                  <span className="callout-icon">💡</span>
                  <p className="callout-text">
                    Hiding a category will automatically update the title in Manual Promotion
                    (e.g., hiding <strong>Gratis</strong> changes the title to{' '}
                    <strong>Special Promotion</strong>).
                  </p>
                </div>

                <div className="promo-settings-card-group">
                  {(['Special Promotion', 'Gratis'] as PromoDetailTab[]).map((cat) => {
                    const isChecked = promoSettings.categories[cat];
                    const canToggleOff = visibleCategories.length > 1;

                    return (
                      <div key={cat} className="promo-settings-toggle-row">
                        <div className="promo-settings-toggle-info">
                          <span className="promo-settings-label">{cat}</span>
                          <span className="promo-settings-types-hint">
                            {cat === 'Special Promotion'
                              ? 'FOC, TDL, ECT, TDO, TDP, TRA'
                              : 'TDI, TDD, RSD'}
                          </span>
                        </div>
                        <label className="promo-settings-switch-label">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isChecked && !canToggleOff}
                            onChange={(e) => {
                              if (!e.target.checked && !canToggleOff) return;
                              setPromoSettings((prev) => ({
                                ...prev,
                                categories: {
                                  ...prev.categories,
                                  [cat]: e.target.checked,
                                },
                              }));
                            }}
                            className="promo-switch-input"
                          />
                          <span className="promo-switch-slider" />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Special Promotion Types */}
              {promoSettings.categories['Special Promotion'] && (
                <section className="promo-settings-section">
                  <div className="promo-settings-section-header">
                    <span className="promo-settings-section-title">SPECIAL PROMOTION TYPES</span>
                    <span className="promo-settings-badge">
                      {promoSettings.types['Special Promotion'].length}/
                      {PROMO_CATALOG_TYPES['Special Promotion'].length} Enabled
                    </span>
                  </div>

                  <div className="promo-settings-card-group">
                    {PROMO_CATALOG_TYPES['Special Promotion'].map((item) => {
                      const isChecked = promoSettings.types['Special Promotion'].includes(item.code);
                      return (
                        <div key={item.code} className="promo-settings-toggle-row">
                          <div className="promo-settings-type-left">
                            <TransactionTypeTag code={item.code} />
                            <div className="promo-settings-type-info">
                              <span className="promo-settings-label">{item.name}</span>
                              <span className="promo-settings-desc">{item.desc}</span>
                            </div>
                          </div>
                          <label className="promo-settings-switch-label">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextList = e.target.checked
                                  ? [...promoSettings.types['Special Promotion'], item.code]
                                  : promoSettings.types['Special Promotion'].filter((c) => c !== item.code);
                                setPromoSettings((prev) => ({
                                  ...prev,
                                  types: {
                                    ...prev.types,
                                    'Special Promotion': nextList,
                                  },
                                }));
                              }}
                              className="promo-switch-input"
                            />
                            <span className="promo-switch-slider" />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Gratis Types */}
              {promoSettings.categories['Gratis'] && (
                <section className="promo-settings-section">
                  <div className="promo-settings-section-header">
                    <span className="promo-settings-section-title">GRATIS TYPES</span>
                    <span className="promo-settings-badge">
                      {promoSettings.types['Gratis'].length}/
                      {PROMO_CATALOG_TYPES['Gratis'].length} Enabled
                    </span>
                  </div>

                  <div className="promo-settings-card-group">
                    {PROMO_CATALOG_TYPES['Gratis'].map((item) => {
                      const isChecked = promoSettings.types['Gratis'].includes(item.code);
                      return (
                        <div key={item.code} className="promo-settings-toggle-row">
                          <div className="promo-settings-type-left">
                            <TransactionTypeTag code={item.code} />
                            <div className="promo-settings-type-info">
                              <span className="promo-settings-label">{item.name}</span>
                              <span className="promo-settings-desc">{item.desc}</span>
                            </div>
                          </div>
                          <label className="promo-settings-switch-label">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const nextList = e.target.checked
                                  ? [...promoSettings.types['Gratis'], item.code]
                                  : promoSettings.types['Gratis'].filter((c) => c !== item.code);
                                setPromoSettings((prev) => ({
                                  ...prev,
                                  types: {
                                    ...prev.types,
                                    Gratis: nextList,
                                  },
                                }));
                              }}
                              className="promo-switch-input"
                            />
                            <span className="promo-switch-slider" />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeSettingsTab === 'order' && (
            <div className="global-settings-section-container">
              <section className="promo-settings-section">
                <div className="promo-settings-section-header">
                  <span className="promo-settings-section-title">SALES & ORDER CONTROLS</span>
                </div>

                <div className="promo-settings-card-group">
                  <div className="promo-settings-toggle-row">
                    <div className="promo-settings-toggle-info">
                      <span className="promo-settings-label">Auto-evaluate Schemes</span>
                      <span className="promo-settings-types-hint">
                        Automatically match highest discount tiers on quantity thresholds
                      </span>
                    </div>
                    <label className="promo-settings-switch-label">
                      <input
                        type="checkbox"
                        checked={autoPromotions}
                        onChange={(e) => setAutoPromotions(e.target.checked)}
                        className="promo-switch-input"
                      />
                      <span className="promo-switch-slider" />
                    </label>
                  </div>

                  <div className="promo-settings-toggle-row">
                    <div className="promo-settings-toggle-info">
                      <span className="promo-settings-label">Order Notifications</span>
                      <span className="promo-settings-types-hint">
                        Show confirmation toast messages when modifying carts
                      </span>
                    </div>
                    <label className="promo-settings-switch-label">
                      <input
                        type="checkbox"
                        checked={enableNotifications}
                        onChange={(e) => setEnableNotifications(e.target.checked)}
                        className="promo-switch-input"
                      />
                      <span className="promo-switch-slider" />
                    </label>
                  </div>

                  <div className="promo-settings-toggle-row">
                    <div className="promo-settings-toggle-info">
                      <span className="promo-settings-label">Default Unit of Measure</span>
                      <span className="promo-settings-types-hint">
                        Preferred unit when adding new items to order
                      </span>
                    </div>
                    <div className="global-settings-pill-selector">
                      <button
                        type="button"
                        className={`pill-option ${defaultUom === 'Case' ? 'is-selected' : ''}`}
                        onClick={() => setDefaultUom('Case')}
                      >
                        Case
                      </button>
                      <button
                        type="button"
                        className={`pill-option ${defaultUom === 'Pack' ? 'is-selected' : ''}`}
                        onClick={() => setDefaultUom('Pack')}
                      >
                        Pack
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeSettingsTab === 'device' && (
            <div className="global-settings-section-container">
              <section className="promo-settings-section">
                <div className="promo-settings-section-header">
                  <span className="promo-settings-section-title">VIEWPORT & HARDWARE SIMULATION</span>
                </div>

                <div className="promo-settings-card-group">
                  <div className="promo-settings-toggle-row">
                    <div className="promo-settings-toggle-info">
                      <span className="promo-settings-label">Device Hardware Frame</span>
                      <span className="promo-settings-types-hint">
                        Select device chassis profile and screen proportions
                      </span>
                    </div>
                    <div className="global-settings-pill-selector">
                      <button
                        type="button"
                        className={`pill-option ${
                          deviceModel === 'iphone-16-pro-max' ? 'is-selected' : ''
                        }`}
                        onClick={() => setDeviceModel('iphone-16-pro-max')}
                      >
                        16 Pro Max
                      </button>
                      <button
                        type="button"
                        className={`pill-option ${
                          deviceModel === 'iphone-13' ? 'is-selected' : ''
                        }`}
                        onClick={() => setDeviceModel('iphone-13')}
                      >
                        iPhone 13
                      </button>
                    </div>
                  </div>

                  <div className="promo-settings-toggle-row">
                    <div className="promo-settings-toggle-info">
                      <span className="promo-settings-label">Screen Orientation</span>
                      <span className="promo-settings-types-hint">
                        Toggle between portrait and horizontal landscape mode
                      </span>
                    </div>
                    <div className="global-settings-pill-selector">
                      <button
                        type="button"
                        className={`pill-option ${!isLandscape ? 'is-selected' : ''}`}
                        onClick={() => setIsLandscape(false)}
                      >
                        Portrait
                      </button>
                      <button
                        type="button"
                        className={`pill-option ${isLandscape ? 'is-selected' : ''}`}
                        onClick={() => setIsLandscape(true)}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="promo-settings-footer">
          <button
            type="button"
            className="confirm-promotion-cta-btn"
            onClick={() => setIsGlobalSettingsOpen(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default GlobalSettingsModal;
