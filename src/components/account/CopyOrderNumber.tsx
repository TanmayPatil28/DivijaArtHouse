'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyOrderNumberProps {
  orderNumber: string;
  className?: string;
}

export function CopyOrderNumber({ orderNumber, className = '' }: CopyOrderNumberProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-text-muted hover:text-text-main bg-white/80 hover:bg-white border border-border-subtle/80 hover:border-gold/50 transition-colors ${className}`}
      title="Copy Order ID"
      aria-label="Copy Order Number"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-600" />
          <span className="text-emerald-700 font-sans">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 text-text-subtle" />
          <span className="font-sans">Copy</span>
        </>
      )}
    </button>
  );
}
