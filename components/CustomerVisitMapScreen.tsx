'use client';

import React, { useState } from 'react';
import { Customer } from './CustomersScreen';

interface CustomerVisitMapScreenProps {
  customer: Customer;
  isCheckedIn?: boolean;
  onBack: () => void;
  onCheckIn: (customer: Customer) => void;
  onCheckOut?: (customer: Customer) => void;
  onViewOutletDetail?: (customer: Customer) => void;
}

export function CustomerVisitMapScreen({
  customer,
  isCheckedIn = false,
  onBack,
  onCheckIn,
  onCheckOut,
  onViewOutletDetail,
}: CustomerVisitMapScreenProps) {
  const [toast, setToast] = useState('');
  const [isConfirmCheckoutOpen, setIsConfirmCheckoutOpen] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [checkOutStatus, setCheckOutStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  const handleCheckInClick = () => {
    setCheckInStatus('loading');
    setTimeout(() => {
      setCheckInStatus('success');
      setTimeout(() => {
        setCheckInStatus('idle');
        onCheckIn(customer);
      }, 1500);
    }, 1400);
  };

  const handleCheckOutClick = () => {
    setIsConfirmCheckoutOpen(true);
  };

  const handleProceedCheckOut = () => {
    setIsConfirmCheckoutOpen(false);
    setCheckOutStatus('loading');
    setTimeout(() => {
      setCheckOutStatus('success');
      setTimeout(() => {
        setCheckOutStatus('idle');
        if (onCheckOut) {
          onCheckOut(customer);
        } else {
          onBack();
        }
      }, 1100);
    }, 1000);
  };

  return (
    <div className="map-visit-screen-container" role="region" aria-label="Customer Visit Map">
      {/* Map Viewport */}
      <div className="map-viewport-wrapper">
        <svg
          className="map-vector-canvas"
          viewBox="0 0 390 520"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Map Land Background */}
            <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f7fa" />
              <stop offset="100%" stopColor="#edf1f6" />
            </linearGradient>

            {/* Hospital Zone Area */}
            <linearGradient id="hospitalZoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fecaca" stopOpacity="0.9" />
            </linearGradient>

            {/* Subtle Route Drop Shadow */}
            <filter id="routeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#92400e" floodOpacity="0.25" />
            </filter>

            {/* Marker Pin Drop Shadow */}
            <filter id="pinShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Base Map Land */}
          <rect width="390" height="520" fill="url(#mapBgGrad)" />

          {/* Curved Canal Waterway in bottom left */}
          <path
            d="M -20 310 C 60 330, 110 440, 240 430 C 310 425, 340 400, 410 390"
            fill="none"
            stroke="#cbeafe"
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M -20 310 C 60 330, 110 440, 240 430 C 310 425, 340 400, 410 390"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Hospital Compound Polygon */}
          <polygon
            points="180,240 280,225 295,305 195,320"
            fill="url(#hospitalZoneGrad)"
            stroke="#fca5a5"
            strokeWidth="1.2"
          />
          <polygon
            points="240,270 275,265 270,300 235,305"
            fill="#fee2e2"
            stroke="#f87171"
            strokeWidth="0.8"
          />

          {/* Street Grid - Road Bases (Thick white lanes) */}
          <g stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
            {/* Major diagonal road - Mao Tse Toung Blvd */}
            <path d="M 210 -20 L 410 170" />
            <path d="M 120 -20 L 410 240" />

            {/* Street 271 */}
            <path d="M 85 -20 L -30 380" />
            <path d="M 140 280 L 410 360" />

            {/* Grid Cross Streets */}
            <path d="M -20 50 L 410 160" />
            <path d="M -20 120 L 410 230" />
            <path d="M -20 180 L 410 290" />
            <path d="M -20 240 L 410 350" />
            <path d="M 40 460 L 380 420" />

            {/* Vertical/Diagonal connectors */}
            <path d="M 170 -20 L 70 380" />
            <path d="M 260 -20 L 160 410" />
            <path d="M 330 -20 L 250 430" />
            <path d="M 380 90 L 300 450" />
          </g>

          {/* Street Outlines & Details */}
          <g stroke="#e2e8f0" strokeWidth="1.2" fill="none">
            <path d="M 205 -20 L 405 170" />
            <path d="M 215 -20 L 415 170" />
            <path d="M -20 45 L 410 155" />
            <path d="M -20 55 L 410 165" />
            <path d="M -20 115 L 410 225" />
            <path d="M -20 125 L 410 235" />
            <path d="M 165 -20 L 65 380" />
            <path d="M 175 -20 L 75 380" />
            <path d="M 255 -20 L 155 410" />
            <path d="M 265 -20 L 165 410" />
          </g>

          {/* Street Names / Text Labels */}
          <g fill="#94a3b8" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">
            <text x="35" y="180" transform="rotate(74, 35, 180)">Street 271</text>
            <text x="210" y="62" transform="rotate(32, 210, 62)">Mao Tse Toung Blvd (245)</text>
            <text x="105" y="132" transform="rotate(-38, 105, 132)">St 430</text>
            <text x="95" y="152" transform="rotate(-38, 95, 152)">St 209</text>
            <text x="235" y="130" transform="rotate(74, 235, 130)">St 414</text>
            <text x="290" y="145" transform="rotate(74, 290, 145)">Street 199</text>
            <text x="260" y="185" transform="rotate(-38, 260, 185)">St 430</text>
            <text x="165" y="195" transform="rotate(-38, 165, 195)">Topaz St</text>
            <text x="165" y="215" transform="rotate(-38, 165, 215)">Jade</text>
            <text x="150" y="235" transform="rotate(-38, 150, 235)">St Gold</text>
            <text x="230" y="325" transform="rotate(12, 230, 325)">Street 271</text>
            <text x="56" y="230" transform="rotate(32, 56, 230)">St Silver</text>
            <text x="295" y="390" transform="rotate(74, 295, 390)">77BT</text>
            <text x="260" y="70" fill="#64748b" fontSize="8.5">St 388</text>
            <text x="245" y="45" fill="#64748b" fontSize="8.5">St 384</text>
            <text x="325" y="145" fill="#64748b" fontSize="9.5">Vanda Univ</text>
            <text x="320" y="205" fill="#ea580c" fontSize="9.5">Ancle Hai H...</text>
          </g>

          {/* Hospital Center Label */}
          <g fill="#ef4444" fontSize="9.5" fontWeight="700" textAnchor="middle">
            <text x="145" y="260">KHMER - SOVIET</text>
            <text x="145" y="272">FRIENDSHIP</text>
          </g>

          {/* POI Markers */}
          {/* Hospital Red H Icon */}
          <g transform="translate(215, 252)">
            <circle cx="10" cy="10" r="10" fill="#ef4444" />
            <text x="10" y="14" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">H</text>
          </g>

          {/* Bus Stop Badges */}
          <g transform="translate(150, 48)">
            <circle cx="7" cy="7" r="6.5" fill="#64748b" />
            <text x="7" y="10" fill="#ffffff" fontSize="7" textAnchor="middle">🚏</text>
          </g>
          <g transform="translate(68, 95)">
            <circle cx="6.5" cy="6.5" r="6" fill="#64748b" />
            <text x="6.5" y="9.5" fill="#ffffff" fontSize="6" textAnchor="middle">🚏</text>
          </g>
          <g transform="translate(64, 185)">
            <circle cx="6.5" cy="6.5" r="6" fill="#64748b" />
            <text x="6.5" y="9.5" fill="#ffffff" fontSize="6" textAnchor="middle">🚏</text>
          </g>
          <g transform="translate(174, 282)">
            <circle cx="6.5" cy="6.5" r="6" fill="#64748b" />
            <text x="6.5" y="9.5" fill="#ffffff" fontSize="6" textAnchor="middle">🚏</text>
          </g>
          <g transform="translate(308, 290)">
            <circle cx="6.5" cy="6.5" r="6" fill="#64748b" />
            <text x="6.5" y="9.5" fill="#ffffff" fontSize="6" textAnchor="middle">🚏</text>
          </g>

          {/* Restaurant POI on Canal */}
          <g transform="translate(176, 335)">
            <circle cx="11" cy="11" r="11" fill="#f97316" />
            <text x="11" y="15" fill="#ffffff" fontSize="10" textAnchor="middle">🍴</text>
          </g>

          {/* Cafe POI on St 271 */}
          <g transform="translate(4, 340)">
            <circle cx="10" cy="10" r="10" fill="#ea580c" />
            <text x="10" y="14" fill="#ffffff" fontSize="9" textAnchor="middle">☕</text>
          </g>

          {/* GOLD ROUTE NAVIGATION PATH */}
          <path
            d="M 350 90 L 345 98 L 298 172 L 222 216 L 142 272 L 188 255"
            fill="none"
            stroke="#b49a00"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeShadow)"
          />

          {/* User Starting Point Pulse */}
          <g transform="translate(350, 90)">
            <circle cx="0" cy="0" r="8" fill="#0284c7" fillOpacity="0.25">
              <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="fillOpacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* DESTINATION PIN (Teardrop with Image Placeholder inside) */}
          <g transform="translate(170, 222)" filter="url(#pinShadow)">
            {/* Teardrop Pin Shape */}
            <path
              d="M 22 46 C 22 46, 0 28, 0 16 C 0 7.16 9.85 0 22 0 C 34.15 0 44 7.16 44 16 C 44 28, 22 46, 22 46 Z"
              fill="#ea580c"
            />
            {/* Inner White Frame */}
            <rect x="7" y="6" width="30" height="26" rx="6" fill="#ffffff" />
            {/* Inner Placeholder Artwork (Gradient + Mountains + Sun) */}
            <g transform="translate(10, 9)">
              <rect width="24" height="20" rx="4" fill="#cbd5e1" />
              {/* Sun */}
              <circle cx="17" cy="5" r="2" fill="#94a3b8" />
              {/* Mountains */}
              <path d="M 2 17 L 9 9 L 14 14 L 18 8 L 22 17 Z" fill="#94a3b8" />
            </g>
          </g>
        </svg>

        {/* Top Floating Controls */}
        <div className="map-top-bar">
          {/* Status Bar */}
          <div className="device-status map-status-bar" aria-label="Device status">
            <span className="map-status-time">8:59 <span className="map-nav-arrow">↗</span></span>
            <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
            <div className="device-icons" aria-hidden="true">
              <img src="/assets/signal.svg" alt="" />
              <img src="/assets/wifi.svg" alt="" />
              <img className="battery" src="/assets/battery.svg" alt="" />
            </div>
          </div>

          {/* Staging Badge */}
          <div className="map-staging-badge-row">
            <span className="staging-pill-badge">STAGING</span>
          </div>

          {/* Floating GPS Target / Recenter Button */}
          <button
            type="button"
            className="map-recenter-btn"
            onClick={() => notify('Recaptured GPS location')}
            aria-label="Re-center GPS location"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="7" />
              <line x1="12" y1="1" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="1" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="23" y2="12" />
              <circle cx="12" cy="12" r="2" fill="#1e293b" />
            </svg>
          </button>
        </div>

        {/* Floating Route Distance & Time Badge */}
        <div className="map-route-info-pill">
          <div className="route-info-item">
            {/* Route path turn icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b49a00"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            <span className="route-text-bold">8.1 km</span>
          </div>

          <div className="route-info-item">
            {/* Clock icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b49a00"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="route-text-bold">11 min</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet / Customer Card Info Panel */}
      <div className="map-bottom-sheet">
        {/* Header Row: Customer Avatar, Name, Close Button */}
        <div className="map-sheet-header-row">
          <div className="map-customer-profile-left">
            <div className="map-customer-avatar-box">
              {customer.image ? (
                <img src={customer.image} alt={customer.name} className="map-avatar-img" />
              ) : (
                <div className="map-avatar-placeholder">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="4" fill="#e2e8f0" stroke="none" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>

            <div className="map-customer-name-group">
              <h2 className="map-customer-title">{customer.name}</h2>
            </div>
          </div>

          <button
            type="button"
            className="map-close-btn"
            onClick={onBack}
            aria-label="Close Visit Map"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body Row: Info List (Left) + Solid Check In Button (Right) */}
        <div className="map-sheet-body-row">
          {/* Metadata Rows */}
          <div className="map-meta-info-list">
            {/* Retailer */}
            <div className="map-meta-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
              <span>Retailer</span>
            </div>

            {/* Unplanned */}
            <div className="map-meta-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Unplanned</span>
            </div>

            {/* Time & Distance */}
            <div className="map-meta-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>08:59 AM</span>
              <span className="map-dot-sep">•</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="map-distance-red">8.06 km</span>
            </div>

            {/* Customer name / outlet pin */}
            <div className="map-meta-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{customer.name}</span>
            </div>
          </div>

          {/* Right Action Button: Check In or Check Out */}
          {isCheckedIn ? (
            <button
              type="button"
              className="map-checkin-btn is-checkout"
              onClick={handleCheckOutClick}
              aria-label={`Check out from ${customer.name}`}
            >
              <div className="checkin-btn-content">
                <svg
                  width="22"
                  height="22"
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
                <span className="checkin-btn-label">Check Out</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="map-checkin-btn"
              onClick={handleCheckInClick}
              aria-label={`Check in at ${customer.name}`}
            >
              <div className="checkin-btn-content">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="checkin-btn-label">Check In</span>
              </div>
            </button>
          )}
        </div>

        {/* Bottom Outline Buttons: Direction & Outlet Detail */}
        <div className="map-bottom-actions-row">
          <button
            type="button"
            className="map-outline-btn"
            onClick={() => notify(`Opening directions to ${customer.name}`)}
          >
            Direction
          </button>

          <button
            type="button"
            className="map-outline-btn"
            onClick={() => {
              if (onViewOutletDetail) onViewOutletDetail(customer);
              else notify(`Viewing outlet detail for ${customer.name}`);
            }}
          >
            Outlet Detail
          </button>
        </div>
      </div>

      {/* Check In Loading & Success Modal Overlay */}
      {checkInStatus !== 'idle' && (
        <div className="checkin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Check in status">
          <div className="checkin-modal-card">
            {checkInStatus === 'loading' && (
              <div className="checkin-modal-content">
                <div className="checkin-spinner-wrap">
                  <svg
                    className="checkin-spinner-svg"
                    width="48"
                    height="48"
                    viewBox="0 0 50 50"
                  >
                    <defs>
                      <linearGradient id="spinnerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                      stroke="url(#spinnerGoldGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="95 35"
                    />
                  </svg>
                </div>
                <h3 className="checkin-modal-title">Check...</h3>
              </div>
            )}

            {checkInStatus === 'success' && (
              <div className="checkin-modal-content is-success">
                <div className="checkin-success-icon-wrap">
                  <svg
                    className="checkin-success-svg"
                    width="54"
                    height="54"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="checkin-modal-success-text">
                  <h3 className="checkin-modal-title">Check-in</h3>
                  <h3 className="checkin-modal-title">Successful</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Check Out Confirmation Modal Dialog */}
      {isConfirmCheckoutOpen && (
        <div
          className="checkin-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Check Out"
          onClick={() => setIsConfirmCheckoutOpen(false)}
        >
          <div
            className="checkout-confirm-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="checkout-confirm-icon-wrap">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h3 className="checkout-confirm-title">Confirm Check Out</h3>
            <p className="checkout-confirm-desc">
              Are you sure you want to check out from <span className="checkout-customer-highlight">{customer.name}</span>?
            </p>

            <div className="checkout-confirm-actions">
              <button
                type="button"
                className="checkout-cancel-btn"
                onClick={() => setIsConfirmCheckoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="checkout-confirm-btn"
                onClick={handleProceedCheckOut}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check Out Loading & Success Modal Overlay */}
      {checkOutStatus !== 'idle' && (
        <div className="checkin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Check out status">
          <div className="checkin-modal-card">
            {checkOutStatus === 'loading' && (
              <div className="checkin-modal-content">
                <div className="checkin-spinner-wrap">
                  <svg
                    className="checkin-spinner-svg"
                    width="48"
                    height="48"
                    viewBox="0 0 50 50"
                  >
                    <defs>
                      <linearGradient id="spinnerGoldGradOut" x1="0%" y1="0%" x2="100%" y2="100%">
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
                      stroke="url(#spinnerGoldGradOut)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="95 35"
                    />
                  </svg>
                </div>
                <h3 className="checkin-modal-title">Check Out...</h3>
              </div>
            )}

            {checkOutStatus === 'success' && (
              <div className="checkin-modal-content is-success">
                <div className="checkin-success-icon-wrap">
                  <svg
                    className="checkin-success-svg"
                    width="54"
                    height="54"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="checkin-modal-success-text">
                  <h3 className="checkin-modal-title">Check-out</h3>
                  <h3 className="checkin-modal-title">Successful</h3>
                </div>
              </div>
            )}
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
