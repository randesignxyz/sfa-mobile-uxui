'use client';

import React, { useState, useEffect } from 'react';

interface VisitLiveTimerProps {
  startTime?: number; // timestamp in ms
  variant?: 'header' | 'badge' | 'card' | 'compact' | 'map';
  onClick?: () => void;
  className?: string;
  showLimit?: boolean;
}

export function VisitLiveTimer({
  startTime,
  variant = 'badge',
  onClick,
  className = '',
  showLimit = true,
}: VisitLiveTimerProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!startTime) return null;

  const elapsedSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const isWarning = elapsedSeconds >= 12 * 60 && elapsedSeconds < 15 * 60; // 12 - 15m
  const isExpired = elapsedSeconds >= 15 * 60; // >= 15m

  const statusClass = isExpired ? 'is-expired' : isWarning ? 'is-warning' : 'is-normal';

  return (
    <div
      className={`visit-live-timer-chip variant-${variant} ${statusClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={`Visit Duration: ${timeFormatted} (15m checkout limit)`}
    >
      <span className="live-timer-dot" />
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="live-timer-clock-icon"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="live-timer-value">{timeFormatted}</span>
      {showLimit && variant !== 'compact' && (
        <span className="live-timer-limit">/ 15:00</span>
      )}
    </div>
  );
}
