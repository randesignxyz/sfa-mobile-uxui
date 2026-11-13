import React from 'react';
import './StatusBadge.css';

const palettes = {
  Approved: { color: '#23764A', background: '#EAF7EF' },
  Pending: { color: '#8A6016', background: '#FFF5DE' },
  Rejected: { color: '#B33A3A', background: '#FDEDEC' },
  Deactivated: { color: '#626975', background: '#F0F1F3' },
};

export default function StatusBadge({ status, className = '' }) {
  const palette = palettes[status] || palettes.Deactivated;
  return (
    <span className={`status-badge ${className}`} style={{ color: palette.color, backgroundColor: palette.background }}>
      <span className="status-badge__dot" aria-hidden="true" />
      <span>{status || 'Unknown'}</span>
    </span>
  );
}
