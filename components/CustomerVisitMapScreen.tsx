'use client';

import React, { useState } from 'react';
import { Customer } from './CustomersScreen';

interface CustomerVisitMapScreenProps {
  customer: Customer;
  onBack: () => void;
  onCheckIn: (customer: Customer) => void;
  onViewOutletDetail?: (customer: Customer) => void;
}

export function CustomerVisitMapScreen({
  customer,
  onBack,
  onCheckIn,
  onViewOutletDetail,
}: CustomerVisitMapScreenProps) {
  const [toast, setToast] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  const handleCheckInClick = () => {
    setIsCheckedIn(true);
    notify(`Checked in at ${customer.name}`);
    setTimeout(() => {
      onCheckIn(customer);
    }, 600);
  };

  return (
    <div className="map-visit-screen-container" role="region" aria-label="Customer Visit Map">
      {/* Map Background Canvas / SVG Simulation */}
      <div className="map-viewport-wrapper">
        <svg
          className="map-vector-canvas"
          viewBox="0 0 390 540"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Map Land Background */}
            <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4f6f8" />
              <stop offset="100%" stopColor="#e9edf2" />
            </linearGradient>

            {/* Urban Area Zones */}
            <linearGradient id="hospitalZone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fecaca" stopOpacity="0.85" />
            </linearGradient>

            {/* Route Glow */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#b49a00" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Background land */}
          <rect width="390" height="540" fill="url(#mapBgGrad)" />

          {/* River / Canal Waterway */}
          <path
            d="M -10 330 C 80 340, 120 440, 240 430 C 300 425, 340 400, 410 390"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M -10 330 C 80 340, 120 440, 240 430 C 300 425, 340 400, 410 390"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Hospital / Facility Zone */}
          <polygon
            points="140,260 250,230 270,310 160,330"
            fill="url(#hospitalZone)"
            stroke="#fca5a5"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Secondary Grid Streets */}
          <g stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            {/* Horizontal / Angled streets */}
            <path d="M -20 70 L 410 180" />
            <path d="M -20 160 L 410 270" />
            <path d="M -20 280 L 410 390" />
            <path d="M -20 210 L 410 320" />
            <path d="M 60 460 L 380 430" />
            
            {/* Cross streets */}
            <path d="M 50 -20 L -30 360" />
            <path d="M 150 -20 L 70 380" />
            <path d="M 270 -20 L 170 420" />
            <path d="M 370 -20 L 290 440" />
            <path d="M 340 180 L 390 400" />
          </g>

          {/* Street Outlines / Shadows */}
          <g stroke="#e2e8f0" strokeWidth="1" fill="none">
            <path d="M -20 65 L 410 175" />
            <path d="M -20 75 L 410 185" />
            <path d="M -20 155 L 410 265" />
            <path d="M -20 165 L 410 275" />
            <path d="M 145 -20 L 65 380" />
            <path d="M 155 -20 L 75 380" />
            <path d="M 265 -20 L 165 420" />
            <path d="M 275 -20 L 175 420" />
          </g>

          {/* Street Labels */}
          <g fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="sans-serif">
            <text x="35" y="190" transform="rotate(74, 35, 190)">Street 271</text>
            <text x="210" y="70" transform="rotate(28, 210, 70)">Mao Tse Toung Blvd (245)</text>
            <text x="110" y="145" transform="rotate(-40, 110, 145)">St 430</text>
            <text x="100" y="165" transform="rotate(-40, 100, 165)">St 209</text>
            <text x="235" y="140" transform="rotate(74, 235, 140)">St 414</text>
            <text x="290" y="150" transform="rotate(74, 290, 150)">Street 199</text>
            <text x="260" y="190" transform="rotate(-40, 260, 190)">St 430</text>
            <text x="175" y="210" transform="rotate(-40, 175, 210)">Topaz St</text>
            <text x="170" y="230" transform="rotate(-40, 170, 230)">Jade</text>
            <text x="155" y="248" transform="rotate(-40, 155, 248)">St Gold</text>
            <text x="240" y="335" transform="rotate(15, 240, 335)">Street 271</text>
            <text x="66" y="240" transform="rotate(28, 66, 240)">St Silver</text>
            <text x="295" y="400" transform="rotate(74, 295, 400)">77BT</text>
            <text x="320" y="155" fill="#64748b" fontSize="10">Vanda Univ</text>
            <text x="325" y="215" fill="#ea580c" fontSize="10">Ancle Hai H...</text>
          </g>

          {/* Hospital Label */}
          <g fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">
            <text x="158" y="276">KHMER - SOVIET</text>
            <text x="158" y="288">FRIENDSHIP</text>
          </g>

          {/* Map POI Icons */}
          {/* Hospital Icon */}
          <g transform="translate(218, 265)">
            <circle cx="11" cy="11" r="11" fill="#ef4444" />
            <text x="11" y="15" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">H</text>
          </g>

          {/* Bus Stop POIs */}
          <g transform="translate(150, 48)">
            <circle cx="8" cy="8" r="7" fill="#64748b" />
            <text x="8" y="12" fill="#ffffff" fontSize="8" textAnchor="middle">🚏</text>
          </g>
          <g transform="translate(68, 100)">
            <circle cx="7" cy="7" r="6" fill="#64748b" />
          </g>
          <g transform="translate(64, 195)">
            <circle cx="7" cy="7" r="6" fill="#64748b" />
          </g>
          <g transform="translate(176, 252)">
            <circle cx="7" cy="7" r="6" fill="#64748b" />
          </g>
          <g transform="translate(312, 260)">
            <circle cx="7" cy="7" r="6" fill="#64748b" />
          </g>

          {/* Restaurant POI */}
          <g transform="translate(180, 296)">
            <circle cx="11" cy="11" r="11" fill="#f97316" />
            <text x="11" y="15" fill="#ffffff" fontSize="10" textAnchor="middle">🍴</text>
          </g>

          {/* Cafe POI */}
          <g transform="translate(5, 302)">
            <circle cx="11" cy="11" r="11" fill="#ea580c" />
            <text x="11" y="15" fill="#ffffff" fontSize="9" textAnchor="middle">☕</text>
          </g>

          {/* GOLD ROUTE NAVIGATION PATH */}
          <path
            d="M 355 90 L 350 102 L 296 182 L 222 225 L 145 270 L 190 252"
            fill="none"
            stroke="#b49a00"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlow)"
          />

          {/* START / CURRENT USER LOCATION PULSE */}
          <g transform="translate(355, 90)">
            <circle cx="0" cy="0" r="10" fill="#0284c7" fillOpacity="0.25">
              <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="fillOpacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* DESTINATION PIN WITH CUSTOMER AVATAR */}
          <g transform="translate(172, 220)">
            {/* Pin shadow */}
            <ellipse cx="22" cy="46" rx="12" ry="4" fill="#000000" fillOpacity="0.25" />
            
            {/* Custom Location Marker Pin */}
            <path
              d="M 22 46 C 22 46, 0 28, 0 16 C 0 7.16 9.85 0 22 0 C 34.15 0 44 7.16 44 16 C 44 28, 22 46, 22 46 Z"
              fill="#ea580c"
            />
            {/* Avatar container inside Pin */}
            <circle cx="22" cy="16" r="14" fill="#ffffff" />
            <rect x="11" y="5" width="22" height="22" rx="4" fill="#d1d5db" />
            <path
              d="M 14 23 L 19 17 L 23 21 L 27 15 L 30 23 Z"
              fill="#9ca3af"
            />
            <circle cx="16" cy="10" r="2" fill="#9ca3af" />
          </g>
        </svg>

        {/* Top Floating Controls */}
        <div className="map-top-bar">
          {/* Status Bar */}
          <div className="device-status map-status-bar" aria-label="Device status">
            <span>8:59</span>
            <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
            <div className="device-icons" aria-hidden="true">
              <img src="/assets/wifi.svg" alt="" />
              <img src="/assets/signal.svg" alt="" />
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

      {/* Bottom Customer Info & Check In Sheet */}
      <div className="map-bottom-sheet">
        {/* Top Row: Customer Avatar, Name, Close Button */}
        <div className="map-sheet-header-row">
          <div className="map-customer-profile-left">
            <div className="map-customer-avatar-box">
              {customer.image ? (
                <img src={customer.image} alt={customer.name} className="map-avatar-img" />
              ) : (
                <div className="map-avatar-placeholder">
                  <svg
                    width="32"
                    height="32"
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
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Middle Section: Meta Info & Check In Button */}
        <div className="map-sheet-body-row">
          {/* Left Metadata list */}
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

            {/* Planned status */}
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

            {/* Customer location */}
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

          {/* Right Solid Check In Button */}
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
        </div>

        {/* Bottom Action Outline Buttons: Direction & Outlet Detail */}
        <div className="map-bottom-actions-row">
          <button
            type="button"
            className="map-outline-btn"
            onClick={() => notify(`Opening navigation directions to ${customer.name}`)}
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

      {toast && (
        <div className="toast-message" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
