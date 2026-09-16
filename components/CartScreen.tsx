'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionTypeTag } from '@/components/ui/transaction-type-tag';
import { AttachedPromotions } from './AttachedPromotions';
import { PriceTier, ProductItem } from './AddToCartScreen';
import { OrderInvoicePreview } from './OrderInvoicePreview';
import { formatMoney, formatQuantity } from '@/lib/format-number';
import { getAutomaticPromotions } from '@/lib/automatic-promotions';

export interface CartLineItem {
  id: string;
  productId: number;
  productName: string;
  productCode: string;
  productImage: string;
  imageFit?: 'contain' | 'cover';
  unit: string;
  tier: PriceTier;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type LinePromotionItem = {
  productName: string;
  type: PromoTypeCode;
  quantity: number;
  unit: string;
};

export type ComboGroup = {
  id: string;
  lineIds: string[];
};

export type LinePromotionsMap = Record<string, LinePromotionItem[]>;

interface CartScreenProps {
  cartLines: CartLineItem[];
  customerId?: string;
  customerName?: string;
  isGratisEligible?: boolean;
  onBack: () => void;
  onReviewOrder: () => void;
  onPreview?: () => void;
  onSelectPromotion?: () => void;
  onManualPromotion?: () => void;
  onOrientationChange?: (isLandscape: boolean) => void;
  onEditProduct?: (productId: number) => void;
  initialLinePromotions?: LinePromotionsMap;
  onUpdateLinePromotions?: (promotions: LinePromotionsMap) => void;
  initialComboGroups?: ComboGroup[];
  onUpdateComboGroups?: (groups: ComboGroup[]) => void;
  initialSelectedSchemeId?: string;
  onUpdateSelectedSchemeId?: (schemeId: string) => void;
  initialAppliedGratisIds?: string[];
  onUpdateAppliedGratisIds?: (ids: string[]) => void;
  initialAppliedGratisQuantities?: Record<string, number>;
  onUpdateAppliedGratisQuantities?: (quantities: Record<string, number>) => void;
}

/** Placeholder SVG icon matching image placeholders */
function PlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#ECEBED" />
      <circle cx="34" cy="16" r="4" fill="#D4D2D8" />
      <path
        d="M8 38L22 22L32 32L38 26L44 32V38C44 40.2091 42.2091 42 40 42H12C9.79086 42 8 40.2091 8 38Z"
        fill="#D4D2D8"
      />
    </svg>
  );
}

const promoProductCatalog: ProductItem[] = [
  {
    id: 1,
    category: 'Vital',
    name: 'Vital 250 mL',
    code: 'FG000012',
    pack: 'x40 bottles',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/vital-250.jpg',
    imageFit: 'contain',
  },
  {
    id: 2,
    category: 'Vital',
    name: 'Vital 350 mL',
    code: 'FG000013',
    pack: 'x24 bottles',
    count: 0,
    price: 2.75,
    unit: 'Case',
    image: '/assets/vital-350.jpg',
    imageFit: 'contain',
  },
  {
    id: 3,
    category: 'Vital',
    name: 'Vital 350 mL, OEM (AM)',
    code: 'FG000001',
    pack: 'x24 bottles',
    count: 0,
    price: 2.75,
    unit: 'Case',
    image: '/assets/vital-350.jpg',
    imageFit: 'contain',
  },
  {
    id: 4,
    category: 'Vital',
    name: 'Vital 500 mL',
    code: 'FG000002',
    pack: 'x24 bottles',
    count: 0,
    price: 3.0,
    unit: 'Case',
    image: '/assets/vital-500.jpg',
    imageFit: 'contain',
  },
  {
    id: 5,
    category: 'Vital',
    name: 'Vital 1.5 L',
    code: 'FG000010',
    pack: 'x12 bottles',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/vital-1500.jpg',
    imageFit: 'contain',
  },
  {
    id: 8,
    category: 'Vital',
    name: 'Baby 1.0 L',
    code: 'FG000017',
    pack: 'x12 bottles',
    count: 0,
    price: 3.8,
    unit: 'Case',
    image: '',
  },
  {
    id: 11,
    category: 'Mee Chiet',
    name: 'MC Pack - Minced Pork',
    code: 'OMM0008',
    pack: 'x24 packs',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/mc-pack-minced-pork.jpg',
    imageFit: 'contain',
  },
  {
    id: 12,
    category: 'Mee Chiet',
    name: 'MC Pack - Chicken Egg',
    code: 'OMM0015',
    pack: 'x24 packs',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/mc-pack-chicken-egg.jpg',
    imageFit: 'contain',
  },
  {
    id: 13,
    category: 'Mee Chiet',
    name: 'MC Pack - Beef Stew Original',
    code: 'OMM0011',
    pack: 'x24 packs',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/mc-pack-beef-stew.jpg',
    imageFit: 'contain',
  },
  {
    id: 14,
    category: 'Mee Chiet',
    name: 'MC Pack - Shrimp Sour Soup',
    code: 'OMM0004',
    pack: 'x24 packs',
    count: 0,
    price: 4.0,
    unit: 'Case',
    image: '/assets/mc-pack-shrimp-sour-soup.jpg',
    imageFit: 'contain',
  },
  {
    id: 16,
    category: 'Mee Chiet',
    name: 'MC Pack - Spicy Seafood',
    code: 'OMM0019',
    pack: 'x24 packs',
    count: 0,
    price: 5,
    unit: 'Case',
    image: '/assets/mc-pack-spicy-seafood.jpg',
    imageFit: 'contain',
  },
  {
    id: 19,
    category: 'Mee Chiet',
    name: 'MC Cup - Minced Pork',
    code: 'OMM0029',
    pack: 'x24 cups',
    count: 0,
    price: 9,
    unit: 'Case',
    image: '/assets/mc-cup-minced-pork.jpg',
    imageFit: 'contain',
  },
  {
    id: 20,
    category: 'Mee Chiet',
    name: 'MC Cup - Beef Stew Original',
    code: 'OMM0030',
    pack: 'x24 cups',
    count: 0,
    price: 9,
    unit: 'Case',
    image: '/assets/mc-cup-beef-stew.jpg',
    imageFit: 'contain',
  },
  {
    id: 37,
    category: 'Mee Chiet',
    name: 'MC Cup - Shrimp Sour Soup',
    code: 'OMM0028',
    pack: 'x24 cups',
    count: 0,
    price: 9,
    unit: 'Case',
    image: '/assets/mc-cup-shrimp-sour-soup.jpg',
    imageFit: 'contain',
  },
  {
    id: 38,
    category: 'Mee Chiet',
    name: 'MC Cup - Spicy Seafood',
    code: 'OMM0031',
    pack: 'x24 cups',
    count: 0,
    price: 9,
    unit: 'Case',
    image: '/assets/mc-cup-spicy-seafood.jpg',
    imageFit: 'contain',
  },
  {
    id: 39,
    category: 'Mee Chiet',
    name: 'MC Sa-Sei Egg Noodle 500g',
    code: 'OMM0040',
    pack: 'x20 packs',
    count: 0,
    price: 6,
    unit: 'Case',
    alternateUnit: 'Pcs',
    image: '/assets/mc-sa-sei-egg-noodle-500g.jpg',
    imageFit: 'contain',
  },
  {
    id: 7,
    category: 'OM',
    name: 'OM Drinking Water 500ML',
    code: 'FG000030',
    pack: 'x24 bottles',
    count: 0,
    price: 3.2,
    unit: 'Case',
    image: '/assets/vital-500.jpg',
  },
  {
    id: 23,
    category: 'OM',
    name: 'OM - Oyster Sauce 250g',
    code: 'FD02-OM010001',
    pack: 'x24 bottles',
    count: 0,
    price: 12.5,
    unit: 'Case',
    image: '/assets/om-oyster-sauce-250g.jpg',
    imageFit: 'contain',
  },
  {
    id: 24,
    category: 'OM',
    name: 'OM - Oyster Sauce 600g',
    code: 'FD02-OM010002',
    pack: 'x24 bottles',
    count: 0,
    price: 27.5,
    unit: 'Case',
    image: '/assets/om-oyster-sauce-600g.jpg',
    imageFit: 'contain',
  },
  {
    id: 26,
    category: 'OM',
    name: 'OM - Chili Sauce 250g',
    code: 'FD02-OM010003',
    pack: 'x24 bottles',
    count: 0,
    price: 12.5,
    unit: 'Case',
    image: '/assets/om-chili-sauce-250g.jpg',
    imageFit: 'contain',
  },
  {
    id: 27,
    category: 'OM',
    name: 'OM - Chili Sauce 500g',
    code: 'FD02-OM010004',
    pack: 'x24 bottles',
    count: 0,
    price: 22.5,
    unit: 'Case',
    image: '/assets/om-chili-sauce-500g.jpg',
    imageFit: 'contain',
  },
  {
    id: 31,
    category: 'OM',
    name: 'OM - Pork Powder 165g',
    code: 'FD02-OM010008',
    pack: 'x72 packs',
    count: 0,
    price: 14.5,
    unit: 'Case',
    image: '/assets/om-pork-powder-165g.jpg',
    imageFit: 'contain',
  },
  {
    id: 32,
    category: 'OM',
    name: 'OM - Pork Powder 400g',
    code: 'FD02-OM010009',
    pack: 'x36 packs',
    count: 0,
    price: 18.5,
    unit: 'Case',
    image: '/assets/om-pork-powder-400g.jpg',
    imageFit: 'contain',
  },
  {
    id: 33,
    category: 'OM',
    name: 'OM - Chicken Powder 165g',
    code: 'FD02-OM010010',
    pack: 'x72 packs',
    count: 0,
    price: 14.5,
    unit: 'Case',
    image: '/assets/om-chicken-powder-165g.jpg',
    imageFit: 'contain',
  },
  {
    id: 34,
    category: 'OM',
    name: 'OM - Chicken Powder 400g',
    code: 'FD02-OM010011',
    pack: 'x36 packs',
    count: 0,
    price: 18.5,
    unit: 'Case',
    image: '/assets/om-chicken-powder-400g.jpg',
    imageFit: 'contain',
  },
  {
    id: 35,
    category: 'OM',
    name: 'OM - Vegetable Powder 165g',
    code: 'FD02-OM010012',
    pack: 'x72 packs',
    count: 0,
    price: 14.5,
    unit: 'Case',
    image: '/assets/om-vegetable-powder-165g.jpg',
    imageFit: 'contain',
  },
  {
    id: 36,
    category: 'OM',
    name: 'OM - Vegetable Powder 400g',
    code: 'FD02-OM010013',
    pack: 'x36 packs',
    count: 0,
    price: 18.5,
    unit: 'Case',
    image: '/assets/om-vegetable-powder-400g.jpg',
    imageFit: 'contain',
  },
];

export type PromoTypeCode =
  | 'FOC'
  | 'TDL'
  | 'ECT'
  | 'RSD'
  | 'TDI'
  | 'TDD'
  | 'TDO'
  | 'TDP'
  | 'TRA'
  | string;

export type PromoDetailTab = 'Special Promotion' | 'Gratis';

export const PROMO_TAB_TYPES: Record<PromoDetailTab, PromoTypeCode[]> = {
  'Special Promotion': ['FOC', 'TDL', 'ECT'],
  Gratis: ['TDI', 'TDD', 'RSD'],
};

const PROMOTION_DISPLAY_ORDER: PromoTypeCode[] = [
  'TDO',
  'TDP',
  'FOC',
  'TDL',
  'TRA',
  'ECT',
  'TDI',
  'TDD',
  'RSD',
];

const PROMOTION_TYPES: PromoTypeCode[] = [
  'TDO',
  'TDP',
  'FOC',
  'TDL',
  'TRA',
  'ECT',
  'TDI',
  'TDD',
  'RSD',
];

export interface PromotionScheme {
  id: string;
  name: string;
  description: string;
  appliedPromotions?: {
    productName: string;
    type: PromoTypeCode;
    quantity: number;
    unit: string;
  }[];
}

const PROMOTION_SCHEMES: PromotionScheme[] = [
  {
    id: 'whole-sales',
    name: 'Whole Sales',
    description: 'Whole Sales Promotion Scheme',
  },
  {
    id: 'no-scheme',
    name: 'No Scheme',
    description: '',
  },
];

type GratisPromotion = {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  type: PromoTypeCode;
  remark?: string;
};

const GRATIS_PROMOTIONS: GratisPromotion[] = [
  {
    id: 'gratis-vital-350-tdi',
    productName: 'Vital 350 mL',
    quantity: 5,
    unit: 'Case',
    type: 'TDI',
    remark: 'ផលតិផលលើកទឹកចិត្តការលក់ប្រចាំខែ 1,0,3 ឆ្នាំ 2026',
  },
  {
    id: 'gratis-vital-1500-tdi',
    productName: 'Vital 1.5 L',
    quantity: 5,
    unit: 'Case',
    type: 'TDI',
    remark: 'ផលតិផលលើកទឹកចិត្តការលក់ប្រចាំខែ 1,0,3 ឆ្នាំ 2026',
  },
];

export function CartScreen({
  cartLines,
  customerId,
  customerName = 'Bun Sophear',
  isGratisEligible = false,
  onBack,
  onReviewOrder,
  onPreview,
  onSelectPromotion,
  onManualPromotion,
  onOrientationChange,
  onEditProduct,
  initialLinePromotions,
  onUpdateLinePromotions,
  initialComboGroups,
  onUpdateComboGroups,
  initialSelectedSchemeId,
  onUpdateSelectedSchemeId,
  initialAppliedGratisIds,
  onUpdateAppliedGratisIds,
  initialAppliedGratisQuantities,
  onUpdateAppliedGratisQuantities,
}: CartScreenProps) {
  const [toast, setToast] = useState('');
  const [isManualPromoMode, setIsManualPromoMode] = useState(false);
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([]);
  const [comboGroups, setComboGroups] = useState<ComboGroup[]>(
    initialComboGroups ?? [],
  );
  const [isSelectProductModalOpen, setIsSelectProductModalOpen] = useState(false);
  const [isPromoDetailsModalOpen, setIsPromoDetailsModalOpen] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [isSelectSchemeModalOpen, setIsSelectSchemeModalOpen] = useState(false);
  const [searchSchemeQuery, setSearchSchemeQuery] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    initialSelectedSchemeId ?? 'whole-sales',
  );
  const [isGratisExpanded, setIsGratisExpanded] = useState(false);
  const [appliedGratisIds, setAppliedGratisIds] = useState<string[]>(
    initialAppliedGratisIds ?? [],
  );
  const [gratisQuantities, setGratisQuantities] = useState<Record<string, number>>(() => {
    const base = Object.fromEntries(GRATIS_PROMOTIONS.map((promotion) => [promotion.id, promotion.quantity]));
    return { ...base, ...(initialAppliedGratisQuantities ?? {}) };
  });
  const [appliedGratisQuantities, setAppliedGratisQuantities] = useState<Record<string, number>>(
    initialAppliedGratisQuantities ?? {},
  );
  const [selectedPromoProduct, setSelectedPromoProduct] = useState<ProductItem | null>(null);
  const [searchPromoQuery, setSearchPromoQuery] = useState('');
  const [promoCategory, setPromoCategory] = useState<'All' | 'Vital' | 'Mee Chiet' | 'OM'>('All');
  const [promoDetailTab, setPromoDetailTab] = useState<PromoDetailTab>('Special Promotion');
  const [promoQuantities, setPromoQuantities] = useState<Record<PromoTypeCode, number>>({
    FOC: 0,
    TDL: 0,
    ECT: 0,
    RSD: 0,
    TDI: 0,
    TDD: 0,
    TDO: 0,
    TDP: 0,
    TRA: 0,
  });

  const [linePromotions, setLinePromotions] = useState<LinePromotionsMap>(
    initialLinePromotions ?? {},
  );

  const selectedScheme = useMemo(() => {
    return PROMOTION_SCHEMES.find((scheme) => scheme.id === selectedSchemeId);
  }, [selectedSchemeId]);
  const hasActiveScheme = Boolean(selectedScheme && selectedScheme.id !== 'no-scheme');

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  const subtotal = useMemo(() => {
    return cartLines.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartLines]);
  const discount = 0;
  const total = subtotal - discount;

  const displayedLinePromotions = useMemo(() => {
    const merged: Record<
      string,
      { productName: string; type: PromoTypeCode; quantity: number; unit: string }[]
    > = Object.fromEntries(
      Object.entries(linePromotions).map(([lineId, promotions]) => [lineId, [...promotions]]),
    );

    cartLines.forEach((item) => {
      if (item.tier !== 'STD') return;

      const automaticPromotions = getAutomaticPromotions(
        customerId,
        item.productName,
        item.quantity,
      ).map((promotion) => ({
          productName: item.productName,
          type: promotion.type as PromoTypeCode,
          quantity: promotion.quantity,
          unit: item.unit || 'Case',
        }));

      if (automaticPromotions.length > 0) {
        merged[item.id] = [...automaticPromotions, ...(merged[item.id] || [])];
      }
    });

    Object.values(merged).forEach((promotions) => {
      promotions.sort((a, b) => {
        const aIndex = PROMOTION_DISPLAY_ORDER.indexOf(a.type);
        const bIndex = PROMOTION_DISPLAY_ORDER.indexOf(b.type);
        const aOrder = aIndex === -1 ? PROMOTION_DISPLAY_ORDER.length : aIndex;
        const bOrder = bIndex === -1 ? PROMOTION_DISPLAY_ORDER.length : bIndex;
        return aOrder - bOrder;
      });
    });

    return merged;
  }, [cartLines, customerId, linePromotions, selectedScheme]);

  const filteredPromoProducts = useMemo(() => {
    return promoProductCatalog.filter((product) => {
      const matchCategory = promoCategory === 'All' || product.category === promoCategory;
      const q = searchPromoQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [promoCategory, searchPromoQuery]);

  const filteredSchemes = useMemo(() => {
    const q = searchSchemeQuery.trim().toLowerCase();
    const schemes = PROMOTION_SCHEMES.filter((s) => s.id !== 'no-scheme');
    if (!q) return schemes;
    return schemes.filter((s) => s.name.toLowerCase().includes(q));
  }, [searchSchemeQuery]);

  const handleApplyScheme = (scheme: PromotionScheme) => {
    setSelectedSchemeId(scheme.id);
    if (onUpdateSelectedSchemeId) {
      onUpdateSelectedSchemeId(scheme.id);
    }
    setIsSelectSchemeModalOpen(false);
  };

  const handleSelectPromoProduct = (product: ProductItem) => {
    setSelectedPromoProduct(product);
    setPromoDetailTab('Special Promotion');

    // If any selected line already has confirmed promotions, load them; otherwise start with 0 (no auto-select)
    const targetId =
      selectedLineIds[0] ||
      cartLines.find((l) => l.tier === 'STD')?.id ||
      (cartLines.length > 0 ? cartLines[0].id : '1-std');

    const existing = linePromotions[targetId]?.filter(
      (promotion) => promotion.productName === product.name,
    );
    if (existing && existing.length > 0) {
      const initialMap: Record<PromoTypeCode, number> = {
        FOC: 0,
        TDL: 0,
        ECT: 0,
        RSD: 0,
        TDI: 0,
        TDD: 0,
        TDO: 0,
        TDP: 0,
        TRA: 0,
      };
      existing.forEach((p) => {
        if (p.quantity > 0) {
          initialMap[p.type] = (initialMap[p.type] || 0) + p.quantity;
        }
      });
      setPromoQuantities(initialMap);
    } else {
      // Do not auto-select: start with 0 for all promotion types
      setPromoQuantities({
        FOC: 0,
        TDL: 0,
        ECT: 0,
        RSD: 0,
        TDI: 0,
        TDD: 0,
        TDO: 0,
        TDP: 0,
        TRA: 0,
      });
    }

    setIsSelectProductModalOpen(false);
    setIsPromoDetailsModalOpen(true);
  };

  const handleUpdatePromoQty = (type: PromoTypeCode, delta: number) => {
    setPromoQuantities((prev) => {
      const current = prev[type] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [type]: next };
    });
  };

  const handleConfirmPromotion = () => {
    if (selectedLineIds.length === 0) return;

    const isMultipleLinesSelected = selectedLineIds.length > 1;
    const primaryTargetId = selectedLineIds[0];

    const promoProductName = selectedPromoProduct?.name || 'Vital 250 mL';
    const promoItems: {
      productName: string;
      type: PromoTypeCode;
      quantity: number;
      unit: string;
    }[] = [];

    Object.entries(promoQuantities).forEach(([typeKey, qty]) => {
      if (qty > 0) {
        promoItems.push({
          productName: promoProductName,
          type: typeKey as PromoTypeCode,
          quantity: qty,
          unit: selectedPromoProduct?.unit || 'Case',
        });
      }
    });

    // If multiple UoM lines selected and promo items confirmed, create/update a combined ComboGroup
    if (isMultipleLinesSelected && promoItems.length > 0) {
      const newComboId = `combo-${Date.now()}`;
      setComboGroups((prev) => {
        const filtered = prev.filter(
          (c) => !c.lineIds.some((id) => selectedLineIds.includes(id)),
        );
        const updatedCombos = [
          ...filtered,
          { id: newComboId, lineIds: [...selectedLineIds] },
        ];
        if (onUpdateComboGroups) {
          onUpdateComboGroups(updatedCombos);
        }
        return updatedCombos;
      });
    } else if (promoItems.length === 0) {
      // If promo removed, uncombine any combo group containing these lines
      setComboGroups((prev) => {
        const updatedCombos = prev.filter(
          (c) => !c.lineIds.some((id) => selectedLineIds.includes(id)),
        );
        if (onUpdateComboGroups) {
          onUpdateComboGroups(updatedCombos);
        }
        return updatedCombos;
      });
    }

    setLinePromotions((prev) => {
      const next: LinePromotionsMap = { ...prev };

      // Clear promotions from other selected lines in this combo
      selectedLineIds.forEach((lineId) => {
        if (lineId !== primaryTargetId) {
          delete next[lineId];
        }
      });

      const otherSkuPromotions = (prev[primaryTargetId] || []).filter(
        (promotion) => promotion.productName !== promoProductName,
      );
      const updatedPromotions = [...otherSkuPromotions, ...promoItems];

      if (updatedPromotions.length === 0) {
        delete next[primaryTargetId];
      } else {
        next[primaryTargetId] = updatedPromotions;
      }

      if (onUpdateLinePromotions) {
        onUpdateLinePromotions(next);
      }
      return next;
    });

    if (promoItems.length > 0) {
      notify(
        isMultipleLinesSelected
          ? 'Selected UoMs combined into 1 card with promotion applied'
          : 'Promotion confirmed and attached to item',
      );
    }

    setIsPromoDetailsModalOpen(false);
    setIsManualPromoMode(false);
    setSelectedLineIds([]);
  };

  const groupedCartProducts = useMemo(() => {
    const groups: {
      productId: number;
      productName: string;
      productCode: string;
      productImage?: string;
      imageFit?: 'contain' | 'cover';
      lines: CartLineItem[];
      totalAmount: number;
    }[] = [];
    const seen = new Set<number>();

    cartLines.forEach((item) => {
      if (!seen.has(item.productId)) {
        seen.add(item.productId);
        const lines = cartLines
          .filter((l) => l.productId === item.productId)
          .sort((a, b) => {
            if (a.unit === 'Case' && b.unit !== 'Case') return -1;
            if (a.unit !== 'Case' && b.unit === 'Case') return 1;
            return 0;
          });
        const totalAmount = lines.reduce((sum, l) => sum + l.totalPrice, 0);
        groups.push({
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode,
          productImage: item.productImage,
          imageFit: item.imageFit,
          lines,
          totalAmount,
        });
      }
    });

    return groups;
  }, [cartLines]);

  const cardGroups = useMemo(() => {
    const result: {
      id: string;
      isCombo: boolean;
      productGroups: typeof groupedCartProducts;
      allLineIds: string[];
      totalAmount: number;
      promotions: { productName: string; type: PromoTypeCode; quantity: number; unit: string }[];
    }[] = [];

    const processedLineIds = new Set<string>();

    // 1. Process active combo groups
    comboGroups.forEach((combo) => {
      const matchingLines = cartLines.filter((l) => combo.lineIds.includes(l.id));
      if (matchingLines.length > 0) {
        matchingLines.forEach((l) => processedLineIds.add(l.id));
        const comboLineIds = matchingLines.map((l) => l.id);

        // Group matching lines by product
        const productGroups: typeof groupedCartProducts = [];
        const seenProd = new Set<number>();
        matchingLines.forEach((item) => {
          if (!seenProd.has(item.productId)) {
            seenProd.add(item.productId);
            const pLines = matchingLines
              .filter((l) => l.productId === item.productId)
              .sort((a, b) => {
                if (a.unit === 'Case' && b.unit !== 'Case') return -1;
                if (a.unit !== 'Case' && b.unit === 'Case') return 1;
                return 0;
              });
            productGroups.push({
              productId: item.productId,
              productName: item.productName,
              productCode: item.productCode,
              productImage: item.productImage,
              imageFit: item.imageFit,
              lines: pLines,
              totalAmount: pLines.reduce((sum, l) => sum + l.totalPrice, 0),
            });
          }
        });

        const comboAmount = productGroups.reduce((sum, g) => sum + g.totalAmount, 0);
        const comboPromos = comboLineIds.flatMap((id) => displayedLinePromotions[id] || []);

        result.push({
          id: combo.id,
          isCombo: productGroups.length > 1 || comboLineIds.length > 1,
          productGroups,
          allLineIds: comboLineIds,
          totalAmount: comboAmount,
          promotions: comboPromos,
        });
      }
    });

    // 2. Process remaining single product groups (lines not in any combo)
    const remainingSeen = new Set<number>();
    cartLines.forEach((item) => {
      if (!processedLineIds.has(item.id) && !remainingSeen.has(item.productId)) {
        remainingSeen.add(item.productId);
        const pLines = cartLines
          .filter((l) => l.productId === item.productId && !processedLineIds.has(l.id))
          .sort((a, b) => {
            if (a.unit === 'Case' && b.unit !== 'Case') return -1;
            if (a.unit !== 'Case' && b.unit === 'Case') return 1;
            return 0;
          });
        if (pLines.length > 0) {
          const groupLineIds = pLines.map((l) => l.id);
          const promos = groupLineIds.flatMap((id) => displayedLinePromotions[id] || []);
          const groupAmount = pLines.reduce((sum, l) => sum + l.totalPrice, 0);

          result.push({
            id: `product-${item.productId}`,
            isCombo: false,
            productGroups: [
              {
                productId: item.productId,
                productName: item.productName,
                productCode: item.productCode,
                productImage: item.productImage,
                imageFit: item.imageFit,
                lines: pLines,
                totalAmount: groupAmount,
              },
            ],
            allLineIds: groupLineIds,
            totalAmount: groupAmount,
            promotions: promos,
          });
        }
      }
    });

    return result;
  }, [cartLines, comboGroups, displayedLinePromotions]);

  return (
    <div className="cart-view-screen" aria-label="Shopping Cart">
      {/* Top Device Status Bar */}
      <div className="device-status" aria-label="Device status">
        <span>8:21</span>
        <img className="camera-cutout" src="/assets/camera-cutout.svg" alt="" />
        <div className="device-icons" aria-hidden="true">
          <img src="/assets/wifi.svg" alt="" />
          <img src="/assets/signal.svg" alt="" />
          <img className="battery" src="/assets/battery.svg" alt="" />
        </div>
      </div>

      {/* Screen Navigation Header */}
      <div className="cart-view-nav">
        {isManualPromoMode ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="icon-button back-button"
            onClick={() => {
              setIsManualPromoMode(false);
              setSelectedLineIds([]);
            }}
            aria-label="Back to Cart"
          >
            <img src="/assets/arrow-left.svg" alt="Back" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            className="icon-button back-button"
            onClick={onBack}
            aria-label="Go back"
          >
            <img src="/assets/arrow-left.svg" alt="Back" />
          </Button>
        )}

        <div className="cart-title-group">
          <h1 className="cart-header-title">
            {isManualPromoMode ? 'Manual Promotion' : 'Carts'}
          </h1>
        </div>

        {!isManualPromoMode ? (
          <button
            type="button"
            className="manual-promotion-btn"
            onClick={() => {
              setIsManualPromoMode(true);
              setSelectedLineIds([]);
            }}
          >
            Manual Promotion
          </button>
        ) : (
          <div className="nav-spacer" />
        )}
      </div>

      <div className="cart-view-content">
        {/* Promotion and Gratis Card (Hidden in Manual Promotion mode) */}
        {!isManualPromoMode && (
          <section className="promotion-gratis-card" aria-label="Promotions and Gratis">
            <div className="promotion-gratis-row">
              <div className="promotions-info">
                <div className="promotions-title-row">
                  <span className="promotions-label">Promotions</span>
                  <span className="promotions-count">
                    ({hasActiveScheme ? 1 : 0})
                  </span>
                </div>
                {hasActiveScheme && selectedScheme && (
                  <span className="selected-scheme-badge">
                    {selectedScheme.name}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="select-promotion-btn"
                onClick={() => {
                  if (onSelectPromotion) onSelectPromotion();
                  setIsSelectSchemeModalOpen(true);
                }}
              >
                Select Promo
              </button>
            </div>

            {isGratisEligible && (
              <>
                <div className="promotion-gratis-divider" />

                <div className="promotion-gratis-row is-gratis-row">
                  <div className="promotion-gratis-heading-row">
                    <div className="promotions-title-row">
                      <span className="promotions-label">Gratis</span>
                      <span className="promotions-count">
                        ({appliedGratisIds.length}/{GRATIS_PROMOTIONS.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      className="select-promotion-btn"
                      disabled={!isGratisEligible}
                      onClick={() => setIsGratisExpanded(true)}
                    >
                      Select Gratis
                    </button>
                  </div>

                  {appliedGratisIds.length > 0 && (
                    <div className="applied-gratis-list">
                      {appliedGratisIds.map((gratisId, gIdx) => {
                        const promotion = GRATIS_PROMOTIONS.find((item) => item.id === gratisId);
                        if (!promotion) return null;
                        const prevPromotion =
                          gIdx > 0
                            ? GRATIS_PROMOTIONS.find((item) => item.id === appliedGratisIds[gIdx - 1])
                            : null;
                        const showRemark = Boolean(
                          promotion.remark &&
                            (!prevPromotion || prevPromotion.remark !== promotion.remark),
                        );
                        return (
                          <div className="applied-gratis-row" key={gratisId}>
                            <div className="applied-gratis-product-info">
                              {showRemark && (
                                <span className="applied-gratis-remark">{promotion.remark}</span>
                              )}
                              <span className="applied-gratis-product">{promotion.productName}</span>
                            </div>
                            <div className="applied-gratis-details">
                              <TransactionTypeTag code={promotion.type} />
                              <span className="applied-gratis-quantity">
                                +{formatQuantity(appliedGratisQuantities[gratisId] ?? promotion.quantity)} {promotion.unit}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {/* Cart Line Item Cards */}
        <div className="cart-lines-list">
          {cardGroups.map((card) => {
            return (
              <article key={card.id} className="cart-item-card">
                {card.productGroups.map((group, pIdx) => {
                  return (
                    <div key={group.productId} className="combo-sub-product">
                      {pIdx > 0 && <div className="combo-product-divider" />}

                      <div className="cart-item-top">
                        <div className="cart-item-thumb">
                          {group.productImage ? (
                            <img
                              src={group.productImage}
                              alt={group.productName}
                              className={`cart-thumb-img ${
                                group.imageFit === 'cover' ? 'is-cover' : ''
                              }`}
                            />
                          ) : (
                            <PlaceholderIcon className="cart-thumb-svg" />
                          )}
                        </div>

                        <div className="cart-item-details">
                          <h2 className="cart-item-name">{group.productName}</h2>
                          <span className="cart-item-sku">{group.productCode}</span>
                        </div>
                      </div>

                      {/* UoM Rows with individual selection */}
                      {group.lines.map((line) => {
                        const isLineSelected = selectedLineIds.includes(line.id);

                        return (
                          <div
                            key={line.id}
                            className={`cart-item-meta-row ${
                              isManualPromoMode ? 'is-uom-selectable' : ''
                            } ${isLineSelected ? 'is-uom-selected' : ''}`}
                            onClick={() => {
                              if (isManualPromoMode) {
                                if (isLineSelected) {
                                  setSelectedLineIds((prev) =>
                                    prev.filter((id) => id !== line.id),
                                  );
                                } else {
                                  setSelectedLineIds((prev) => [...prev, line.id]);
                                }
                              }
                            }}
                          >
                            <div className="meta-left">
                              {isManualPromoMode && (
                                <div
                                  className={`manual-promo-checkbox ${
                                    isLineSelected ? 'is-selected' : ''
                                  }`}
                                  aria-label={isLineSelected ? 'Selected' : 'Not selected'}
                                >
                                  {isLineSelected && (
                                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                      <path
                                        d="M2.5 7.5L5.5 10.5L11.5 3.5"
                                        stroke="#ffffff"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}

                              <span className="meta-rate-calc">
                                ${formatMoney(line.unitPrice)} x {formatQuantity(line.quantity)} {line.unit || 'Case'}
                              </span>
                              <TransactionTypeTag code={line.tier} />
                            </div>

                            <span className="meta-right-price">
                              ${formatMoney(line.totalPrice)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Amount Row (rendered if multi-product combo or multi-UoM single product) */}
                {(card.isCombo || (!card.isCombo && card.productGroups[0]?.lines.length > 1)) && (
                  <div className="cart-item-amount-row">
                    <span className="amount-label">Amount</span>
                    <span className="amount-val">
                      ${formatMoney(card.totalAmount)}
                    </span>
                  </div>
                )}

                {/* Attached Promotions (rendered at bottom of product card) */}
                {card.promotions.length > 0 && (
                  <AttachedPromotions promotions={card.promotions} />
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Order Summary & CTA */}
      <div className="cart-summary-footer">
        {!isManualPromoMode && (
          <div className="summary-calc-row total-row-bold">
            <span className="summary-total-label">Total</span>
            <span className="summary-total-amount">${formatMoney(total)}</span>
          </div>
        )}

        {isManualPromoMode ? (
          <div className="manual-promo-actions-row">
            <button
              type="button"
              className="promo-cancel-btn"
              onClick={() => {
                setIsManualPromoMode(false);
                setSelectedLineIds([]);
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className={`promo-select-item-btn ${
                selectedLineIds.length > 0 ? 'is-active' : 'is-disabled'
              }`}
              onClick={() => {
                if (selectedLineIds.length > 0) {
                  setIsSelectProductModalOpen(true);
                }
              }}
              disabled={selectedLineIds.length === 0}
            >
              Select Item
            </button>
          </div>
        ) : (
          <div className="cart-main-actions-row">
            <button
              type="button"
              className="cart-preview-btn"
              onClick={() => {
                if (onPreview) onPreview();
                setIsInvoicePreviewOpen(true);
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview
            </button>

            <button
              type="button"
              className="review-order-btn"
              onClick={onReviewOrder}
            >
              Review Order
            </button>
          </div>
        )}
      </div>

      {/* Select Product Bottom Sheet Modal */}
      {isSelectProductModalOpen && (
        <div
          className="select-promo-modal-backdrop"
          onClick={() => setIsSelectProductModalOpen(false)}
        >
          <div
            className="select-promo-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Select Product"
          >
            <div className="sheet-drag-handle" />

            {/* Modal Header */}
            <div className="select-promo-modal-header">
              <div className="modal-title-wrap">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b49a00"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="promo-tag-icon"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <h2 className="modal-title-text">Select Product</h2>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSelectProductModalOpen(false)}
                aria-label="Close"
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

            <div className="modal-header-divider" />

            {/* Search Input Bar */}
            <div className="modal-search-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchPromoQuery}
                onChange={(e) => setSearchPromoQuery(e.target.value)}
                placeholder="Search by name or code..."
                className="modal-search-input"
              />
              {searchPromoQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchPromoQuery('')}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="modal-category-chips">
              {(['All', 'Vital', 'Mee Chiet', 'OM'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`modal-cat-chip ${
                    promoCategory === cat ? 'is-active' : ''
                  }`}
                  onClick={() => setPromoCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div className="modal-products-list">
              {filteredPromoProducts.map((product) => {
                const targetLineId = selectedLineIds[0];
                const activePromotions = targetLineId
                  ? (linePromotions[targetLineId] || []).filter(
                      (promotion) => promotion.productName === product.name,
                    )
                  : [];
                const isActiveProduct = activePromotions.length > 0;

                return (
                  <article
                    key={product.id}
                    className={`modal-product-card ${isActiveProduct ? 'is-active' : ''}`}
                    onClick={() => handleSelectPromoProduct(product)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${product.name}${isActiveProduct ? ', active promotion' : ''}`}
                  >
                    <div className="modal-product-thumb">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`modal-thumb-img ${
                            product.imageFit === 'cover' ? 'is-cover' : ''
                          }`}
                        />
                      ) : (
                        <PlaceholderIcon className="modal-thumb-placeholder" />
                      )}
                    </div>

                    <div className="modal-product-info">
                      <h3 className="modal-product-name">{product.name}</h3>
                      <span className="modal-product-sku">{product.code}</span>
                    </div>

                    {isActiveProduct && (
                      <div className="modal-product-promo-badges" aria-label="Active promotions">
                        {(() => {
                          const rows = [];
                          for (let i = 0; i < activePromotions.length; i += 3) {
                            rows.push(activePromotions.slice(i, i + 3));
                          }
                          return rows.map((row, rIdx) => (
                            <div key={rIdx} className="modal-product-promo-badges-row">
                              {row.map((promotion) => (
                                <TransactionTypeTag
                                  code={`${promotion.type} x ${formatQuantity(promotion.quantity)}`}
                                  className="modal-product-promo-badge"
                                  key={`${promotion.type}-${promotion.quantity}`}
                                />
                              ))}
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Promotion Details Bottom Sheet Modal */}
      {isPromoDetailsModalOpen && (
        <div
          className="select-promo-modal-backdrop"
          onClick={() => setIsPromoDetailsModalOpen(false)}
        >
          <div
            className="select-promo-modal-sheet promo-details-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Promotion Details"
          >
            <div className="sheet-drag-handle" />

            {/* Modal Header */}
            <div className="promo-details-modal-header">
              <button
                type="button"
                className="promo-back-box-btn"
                onClick={() => {
                  setIsPromoDetailsModalOpen(false);
                  setIsSelectProductModalOpen(true);
                }}
                aria-label="Back to select product"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#18181b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <h2 className="promo-details-title-text">Promotion Details</h2>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setIsPromoDetailsModalOpen(false);
                  setIsManualPromoMode(false);
                }}
                aria-label="Close"
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

            <div className="modal-header-divider" />

            {/* Promotion Details Category Tabs */}
            <div className="promo-details-tabs-bar" role="tablist" aria-label="Promotion categories">
              {(['Special Promotion', 'Gratis'] as PromoDetailTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={promoDetailTab === tab}
                  className={`promo-details-tab-btn ${
                    promoDetailTab === tab ? 'is-active' : ''
                  }`}
                  onClick={() => setPromoDetailTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Promotion Types Stepper List for Selected Tab */}
            <div className="promo-types-list">
              {PROMO_TAB_TYPES[promoDetailTab].map((type) => {
                const qty = promoQuantities[type] || 0;
                const isActive = qty > 0;

                return (
                  <div
                    key={type}
                    className={`promo-type-card ${
                      isActive ? 'is-active' : ''
                    }`}
                  >
                    <TransactionTypeTag
                      code={type}
                      active={isActive}
                      onClick={() => handleUpdatePromoQty(type, qty === 0 ? 1 : -qty)}
                      ariaLabel={`Toggle ${type}`}
                    />

                    <div className="promo-stepper-wrap">
                      <div className="promo-stepper-control">
                        <button
                          type="button"
                          className="promo-step-btn"
                          onClick={() => handleUpdatePromoQty(type, -1)}
                          disabled={qty === 0}
                          aria-label={`Decrease ${type}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={qty > 0 ? '#b49a00' : '#9ca3af'}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>

                        <span className="promo-step-qty">{formatQuantity(qty)}</span>

                        <button
                          type="button"
                          className="promo-step-btn"
                          onClick={() => handleUpdatePromoQty(type, 1)}
                          aria-label={`Increase ${type}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#b49a00"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      <span className="promo-unit-label">Case</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirm Promotion CTA */}
            <button
              type="button"
              className="confirm-promotion-cta-btn"
              onClick={handleConfirmPromotion}
            >
              Confirm Promotion
            </button>
          </div>
        </div>
      )}

      {/* Select Promotion Scheme Bottom Sheet Modal */}
      {isSelectSchemeModalOpen && (
        <div
          className="select-promo-modal-backdrop"
          onClick={() => setIsSelectSchemeModalOpen(false)}
        >
          <div
            className="select-promo-modal-sheet scheme-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Select Promotion"
          >
            <div className="sheet-drag-handle" />

            <div className="select-promo-modal-header">
              <h2 className="modal-title-text select-scheme-title">Select Promotion</h2>
              <div className="gratis-modal-header-actions">
                {selectedSchemeId && (
                  <button
                    type="button"
                    className="gratis-clear-btn"
                    onClick={() => {
                      setSelectedSchemeId('');
                      if (onUpdateSelectedSchemeId) {
                        onUpdateSelectedSchemeId('');
                      }
                      notify('Promotion cleared');
                    }}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsSelectSchemeModalOpen(false)}
                  aria-label="Close"
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

            {/* Search Input Bar */}
            <div className="modal-search-box scheme-search-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="modal-search-icon"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                type="text"
                className="modal-search-input"
                placeholder="Search by name..."
                value={searchSchemeQuery}
                onChange={(e) => setSearchSchemeQuery(e.target.value)}
              />

              {searchSchemeQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchSchemeQuery('')}
                  aria-label="Clear search"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Schemes List */}
            <div className="schemes-list">
              {filteredSchemes.map((scheme) => {
                const isCurrent = selectedSchemeId === scheme.id;

                return (
                  <article
                    key={scheme.id}
                    className={`scheme-card ${isCurrent ? 'is-selected' : ''}`}
                  >
                    <div className="scheme-info">
                      <h3 className="scheme-name">{scheme.name}</h3>
                    </div>

                    <button
                      type="button"
                      className={`scheme-apply-btn ${isCurrent ? 'is-applied' : ''}`}
                      onClick={() => handleApplyScheme(scheme)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Applied' : 'Apply'}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isGratisExpanded && isGratisEligible && (
        <div
          className="select-promo-modal-backdrop"
          onClick={() => setIsGratisExpanded(false)}
        >
          <div
            className="select-promo-modal-sheet scheme-modal-sheet"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-label="Select Gratis"
          >
            <div className="sheet-drag-handle" />
            <div className="select-promo-modal-header">
              <h2 className="modal-title-text select-scheme-title">Select Gratis</h2>
              <div className="gratis-modal-header-actions">
                {appliedGratisIds.length > 0 ? (
                  <button
                    type="button"
                    className="gratis-clear-btn"
                    onClick={() => {
                      setAppliedGratisIds([]);
                      setAppliedGratisQuantities({});
                      if (onUpdateAppliedGratisIds) onUpdateAppliedGratisIds([]);
                      if (onUpdateAppliedGratisQuantities) onUpdateAppliedGratisQuantities({});
                      notify('Gratis promotions cleared');
                    }}
                  >
                    {appliedGratisIds.length > 1 ? 'Clear All' : 'Clear'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="gratis-apply-all-btn"
                    onClick={() => {
                      const applicablePromotions = GRATIS_PROMOTIONS.filter(
                        (promotion) => (gratisQuantities[promotion.id] ?? promotion.quantity) > 0,
                      );
                      const nextIds = applicablePromotions.map((promotion) => promotion.id);
                      const nextQuantities = Object.fromEntries(
                        applicablePromotions.map((promotion) => [
                          promotion.id,
                          gratisQuantities[promotion.id] ?? promotion.quantity,
                        ]),
                      );
                      setAppliedGratisIds(nextIds);
                      setAppliedGratisQuantities(nextQuantities);
                      if (onUpdateAppliedGratisIds) onUpdateAppliedGratisIds(nextIds);
                      if (onUpdateAppliedGratisQuantities) onUpdateAppliedGratisQuantities(nextQuantities);
                      notify('All Gratis promotions applied');
                    }}
                  >
                    Apply All
                  </button>
                )}
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsGratisExpanded(false)}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="modal-header-divider" />

            <div className="gratis-promotion-list">
              {GRATIS_PROMOTIONS.map((promotion) => {
                const isApplied = appliedGratisIds.includes(promotion.id);
                const quantity = gratisQuantities[promotion.id] ?? promotion.quantity;
                const hasQuantityChanged =
                  isApplied && quantity !== appliedGratisQuantities[promotion.id];
                return (
                  <article
                    className={`gratis-promotion-card ${isApplied ? 'is-applied' : ''}`}
                    key={promotion.id}
                  >
                    <div className="gratis-promotion-info">
                      <p className="gratis-remark-line">{promotion.remark || 'ផលតិផលលើកទឹកចិត្តការលក់ប្រចាំខែ 1,0,3 ឆ្នាំ 2026'}</p>
                      <h3>{promotion.productName}</h3>
                      <div className="gratis-transaction-line">
                        <TransactionTypeTag code={promotion.type} />
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={quantity}
                          onChange={(event) =>
                            setGratisQuantities((current) => ({
                              ...current,
                              [promotion.id]: Number(event.target.value.replace(/[^0-9]/g, '')) || 0,
                            }))
                          }
                          className="gratis-quantity-input"
                          aria-label={`${promotion.productName} gratis quantity`}
                        />
                        <span className="gratis-unit-label">{promotion.unit}</span>
                      </div>
                    </div>
                    <div className="gratis-card-actions">
                      {isApplied && (
                        <button
                          type="button"
                          className="gratis-card-clear-btn"
                          onClick={() => {
                            const nextIds = appliedGratisIds.filter((id) => id !== promotion.id);
                            const nextQuantities = { ...appliedGratisQuantities };
                            delete nextQuantities[promotion.id];
                            setAppliedGratisIds(nextIds);
                            setAppliedGratisQuantities(nextQuantities);
                            if (onUpdateAppliedGratisIds) onUpdateAppliedGratisIds(nextIds);
                            if (onUpdateAppliedGratisQuantities) onUpdateAppliedGratisQuantities(nextQuantities);
                            notify('Gratis promotion cleared');
                          }}
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="button"
                        className={`scheme-apply-btn ${isApplied ? 'is-applied' : ''}`}
                        disabled={quantity === 0 || (isApplied && !hasQuantityChanged)}
                        onClick={() => {
                          const nextIds = appliedGratisIds.includes(promotion.id)
                            ? appliedGratisIds
                            : [...appliedGratisIds, promotion.id];
                          const nextQuantities = {
                            ...appliedGratisQuantities,
                            [promotion.id]: quantity,
                          };
                          setAppliedGratisIds(nextIds);
                          setAppliedGratisQuantities(nextQuantities);
                          if (onUpdateAppliedGratisIds) onUpdateAppliedGratisIds(nextIds);
                          if (onUpdateAppliedGratisQuantities) onUpdateAppliedGratisQuantities(nextQuantities);
                          notify(isApplied ? 'Gratis quantity updated' : 'Gratis promotion applied');
                        }}
                      >
                        {isApplied ? (hasQuantityChanged ? 'Update' : 'Applied') : 'Apply'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Order Invoice / PDF Form Preview Screen */}
      {isInvoicePreviewOpen && (
        <OrderInvoicePreview
          cartLines={cartLines}
          linePromotions={displayedLinePromotions}
          appliedGratisPromotions={appliedGratisIds
            .map((id) => {
              const promo = GRATIS_PROMOTIONS.find((p) => p.id === id);
              if (!promo) return null;
              return {
                id: promo.id,
                productName: promo.productName,
                type: promo.type,
                remark: promo.remark || 'ផលតិផលលើកទឹកចិត្តការលក់ប្រចាំខែ 1,0,3 ឆ្នាំ 2026',
                quantity: appliedGratisQuantities[id] ?? promo.quantity,
                unit: promo.unit,
              };
            })
            .filter((item): item is NonNullable<typeof item> => Boolean(item))}
          subtotal={subtotal}
          discount={discount}
          total={total}
          outletName={customerName || 'Bun Sophear'}
          onClose={() => {
            if (onOrientationChange) onOrientationChange(false);
            setIsInvoicePreviewOpen(false);
          }}
          onConfirmOrder={onReviewOrder}
          onOrientationChange={onOrientationChange}
        />
      )}

      {toast && (
        <div className="toast-message" role="status">
          {toast}
        </div>
      )}

      {/* Home Indicator */}
      <footer className="home-indicator" aria-hidden="true">
        <span />
      </footer>
    </div>
  );
}
