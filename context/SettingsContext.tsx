'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { PromoTypeCode, PromoDetailTab } from '@/components/CartScreen';

export interface PromoTypeCatalogItem {
  code: PromoTypeCode;
  name: string;
  desc: string;
}

export const PROMO_CATALOG_TYPES: Record<PromoDetailTab, PromoTypeCatalogItem[]> = {
  'Special Promotion': [
    { code: 'FOC', name: 'Free of Charge', desc: 'Bonus items attached to order' },
    { code: 'TDL', name: 'Trade Discount Line', desc: 'Line item trade discount' },
    { code: 'ECT', name: 'Empty Container', desc: 'Returnable container discount' },
    { code: 'TDO', name: 'Trade Discount Order', desc: 'Order-level trade discount' },
    { code: 'TDP', name: 'Trade Discount Product', desc: 'Product-level trade discount' },
    { code: 'TRA', name: 'Trade Allowance', desc: 'General trade promotion allowance' },
  ],
  Gratis: [
    { code: 'TDI', name: 'Trade Discount Invoice', desc: 'Invoice gratis promotion' },
    { code: 'TDD', name: 'Trade Discount Delivery', desc: 'Delivery reward gratis allowance' },
    { code: 'RSD', name: 'Retail Special Discount', desc: 'Special retail incentive' },
  ],
};

export interface PromoDisplaySettings {
  categories: {
    'Special Promotion': boolean;
    Gratis: boolean;
  };
  types: {
    'Special Promotion': PromoTypeCode[];
    Gratis: PromoTypeCode[];
  };
}

export const DEFAULT_PROMO_SETTINGS: PromoDisplaySettings = {
  categories: {
    'Special Promotion': true,
    Gratis: true,
  },
  types: {
    'Special Promotion': ['FOC', 'TDL', 'ECT'],
    Gratis: ['TDI', 'TDD', 'RSD'],
  },
};

export type GlobalSettingsTab = 'promotions' | 'order' | 'device';

export interface SettingsContextType {
  // Promotion settings
  promoSettings: PromoDisplaySettings;
  setPromoSettings: React.Dispatch<React.SetStateAction<PromoDisplaySettings>>;
  resetPromoSettings: () => void;
  visibleCategories: PromoDetailTab[];
  promoDetailsTitle: string;

  // Global settings modal controls
  isGlobalSettingsOpen: boolean;
  setIsGlobalSettingsOpen: (open: boolean) => void;
  activeSettingsTab: GlobalSettingsTab;
  setActiveSettingsTab: (tab: GlobalSettingsTab) => void;
  openGlobalSettings: (tab?: GlobalSettingsTab) => void;

  // General App & Order Controls
  deviceModel: 'iphone-16-pro-max' | 'iphone-13';
  setDeviceModel: (model: 'iphone-16-pro-max' | 'iphone-13') => void;
  isLandscape: boolean;
  setIsLandscape: (landscape: boolean) => void;
  autoPromotions: boolean;
  setAutoPromotions: (enabled: boolean) => void;
  defaultUom: 'Case' | 'Pack';
  setDefaultUom: (uom: 'Case' | 'Pack') => void;
  enableNotifications: boolean;
  setEnableNotifications: (enabled: boolean) => void;
  resetAllSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({
  children,
  initialDeviceModel = 'iphone-16-pro-max',
  initialIsLandscape = false,
  onDeviceModelChange,
  onOrientationChange,
}: {
  children: React.ReactNode;
  initialDeviceModel?: 'iphone-16-pro-max' | 'iphone-13';
  initialIsLandscape?: boolean;
  onDeviceModelChange?: (model: 'iphone-16-pro-max' | 'iphone-13') => void;
  onOrientationChange?: (landscape: boolean) => void;
}) {
  // Promo settings with localStorage persistence
  const [promoSettings, setPromoSettings] = useState<PromoDisplaySettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sfa_promo_display_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            categories: {
              'Special Promotion': parsed?.categories?.['Special Promotion'] ?? true,
              Gratis: parsed?.categories?.Gratis ?? true,
            },
            types: {
              'Special Promotion': Array.isArray(parsed?.types?.['Special Promotion'])
                ? parsed.types['Special Promotion']
                : DEFAULT_PROMO_SETTINGS.types['Special Promotion'],
              Gratis: Array.isArray(parsed?.types?.Gratis)
                ? parsed.types.Gratis
                : DEFAULT_PROMO_SETTINGS.types.Gratis,
            },
          };
        }
      } catch (e) {
        // Fallback to default
      }
    }
    return DEFAULT_PROMO_SETTINGS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sfa_promo_display_settings', JSON.stringify(promoSettings));
      } catch (e) {
        // ignore
      }
    }
  }, [promoSettings]);

  // Modal UI state
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<GlobalSettingsTab>('promotions');

  // App & Device Controls
  const [deviceModel, setDeviceModelState] = useState<'iphone-16-pro-max' | 'iphone-13'>(initialDeviceModel);
  const [isLandscape, setIsLandscapeState] = useState(initialIsLandscape);
  const [autoPromotions, setAutoPromotions] = useState(true);
  const [defaultUom, setDefaultUom] = useState<'Case' | 'Pack'>('Case');
  const [enableNotifications, setEnableNotifications] = useState(true);

  const setDeviceModel = (model: 'iphone-16-pro-max' | 'iphone-13') => {
    setDeviceModelState(model);
    if (onDeviceModelChange) onDeviceModelChange(model);
  };

  const setIsLandscape = (landscape: boolean) => {
    setIsLandscapeState(landscape);
    if (onOrientationChange) onOrientationChange(landscape);
  };

  const openGlobalSettings = (tab?: GlobalSettingsTab) => {
    if (tab) setActiveSettingsTab(tab);
    setIsGlobalSettingsOpen(true);
  };

  const resetPromoSettings = () => {
    setPromoSettings(DEFAULT_PROMO_SETTINGS);
  };

  const resetAllSettings = () => {
    setPromoSettings(DEFAULT_PROMO_SETTINGS);
    setAutoPromotions(true);
    setDefaultUom('Case');
    setEnableNotifications(true);
  };

  // Compute visibleCategories
  const visibleCategories = useMemo(() => {
    const list: PromoDetailTab[] = [];
    if (promoSettings.categories['Special Promotion']) list.push('Special Promotion');
    if (promoSettings.categories['Gratis']) list.push('Gratis');
    return list;
  }, [promoSettings.categories]);

  // Dynamic promo details title based on active categories
  const promoDetailsTitle = useMemo(() => {
    if (visibleCategories.length === 1) {
      return visibleCategories[0];
    }
    return 'Promotion Details';
  }, [visibleCategories]);

  return (
    <SettingsContext.Provider
      value={{
        promoSettings,
        setPromoSettings,
        resetPromoSettings,
        visibleCategories,
        promoDetailsTitle,
        isGlobalSettingsOpen,
        setIsGlobalSettingsOpen,
        activeSettingsTab,
        setActiveSettingsTab,
        openGlobalSettings,
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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
