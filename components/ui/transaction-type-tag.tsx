import * as React from 'react';

import { cn } from '@/lib/utils';

type TransactionTypeTagProps = {
  code: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

/** Shared transaction-code badge used in product, cart, and promotion views. */
export function TransactionTypeTag({
  code,
  active = false,
  className,
  onClick,
  ariaLabel,
}: TransactionTypeTagProps) {
  const classes = cn('transaction-type-tag', active && 'is-active', className);

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={ariaLabel}>
        {code}
      </button>
    );
  }

  return <span className={classes}>{code}</span>;
}
