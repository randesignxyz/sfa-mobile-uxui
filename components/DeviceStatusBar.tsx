'use client';

import React from 'react';
import { useSettings } from '@/context/SettingsContext';

interface DeviceStatusBarProps {
  className?: string;
  time?: React.ReactNode;
  showCameraCutout?: boolean;
  showSettingsBtn?: boolean;
}

/** Device status bar displaying current time, camera cutout, and native device icons */
export function DeviceStatusBar({
  className = '',
  time = '8:21',
  showCameraCutout = true,
  showSettingsBtn = false,
}: DeviceStatusBarProps) {
  const { openGlobalSettings } = useSettings();

  return (
    <div className={`device-status ${className}`} aria-label="Device status">
      <span>{time}</span>
      {showCameraCutout && <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />}
      <div className="device-icons">
        {showSettingsBtn && (
          <button
            type="button"
            className="device-settings-btn"
            onClick={() => openGlobalSettings()}
            aria-label="Open Global Settings"
            title="Global Settings"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        )}
        <img src="/assets/wifi.svg" alt="WiFi" />
        <img src="/assets/signal.svg" alt="Signal" />
        <img className="battery" src="/assets/battery.svg" alt="Battery" />
      </div>
    </div>
  );
}

export default DeviceStatusBar;
