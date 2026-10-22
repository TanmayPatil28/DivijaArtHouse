import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  /** Optional eyebrow pill label, e.g. "HANDCRAFTED CROCHET FLORALS" */
  eyebrow?: string;
  /** Optional custom icon in eyebrow, defaults to Gold Sparkles */
  eyebrowIcon?: React.ReactNode;
  /** Optional suffix inside the eyebrow pill, e.g. "pune studio" */
  eyebrowSuffix?: string;
  /** Main lead title in bold geometric sans, e.g. "Some feelings" */
  titleLead: string;
  /** Signature editorial italic accent in Playfair Serif, e.g. "deserve to stay." */
  titleAccent: string;
  /** Optional trailing text after the accent */
  titleEnd?: string;
  /** Subtitle or narrative description */
  description?: string | React.ReactNode;
  /** Text alignment: left, center, right */
  align?: 'left' | 'center' | 'right';
  /** Visual theme: light (on ivory/white canvas) or dark (on wine/dark canvas) */
  theme?: 'light' | 'dark';
  /** Semantic HTML tag for the title */
  headingTag?: 'h1' | 'h2' | 'h3';
  /** Header scale */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional trailing action/CTA button (e.g., "Shop All Favourites ->") */
  action?: React.ReactNode;
  /** Custom wrapper classes */
  className?: string;
  /** Optional child elements below description */
  children?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  eyebrowSuffix,
  titleLead,
  titleAccent,
  titleEnd,
  description,
  align = 'left',
  theme = 'light',
  headingTag = 'h2',
  size = 'lg',
  action,
  className,
  children,
}: SectionHeaderProps) {
  const HeadingComponent = headingTag;

  const isDark = theme === 'dark';
  const isCentered = align === 'center';

  const sizeClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-2xl sm:text-3xl md:text-4xl',
    xl: 'text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.14]',
  }[size];

  return (
    <div
      className={cn(
        'w-full flex flex-col',
        action
          ? 'sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-10'
          : isCentered
          ? 'items-center text-center max-w-3xl mx-auto mb-8 sm:mb-12'
          : 'items-start text-left mb-6 sm:mb-8',
        className
      )}
    >
      <div
        className={cn(
          'space-y-2.5',
          isCentered ? 'text-center' : 'text-left',
          action && 'max-w-2xl'
        )}
      >
        {/* Eyebrow Ribbon Pill */}
        {eyebrow && (
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest shadow-2xs backdrop-blur-sm select-none',
              isDark
                ? 'bg-white/10 border border-gold/40 text-gold-light'
                : 'bg-white/90 border border-gold/40 text-primary'
            )}
          >
            {eyebrowIcon !== undefined ? (
              eyebrowIcon
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
            )}
            <span>{eyebrow}</span>
            {eyebrowSuffix && (
              <>
                <span className="w-1 h-1 rounded-full bg-gold/70" />
                <span className="text-[11px] text-text-muted font-medium lowercase">
                  {eyebrowSuffix}
                </span>
              </>
            )}
          </div>
        )}

        {/* Signature Editorial Duo-Font Headline */}
        <HeadingComponent
          className={cn(
            'font-semibold tracking-tight transition-colors',
            sizeClasses,
            isDark ? 'text-white' : 'text-text-main'
          )}
        >
          {titleLead}{' '}
          <span
            className={cn(
              'font-serif italic font-normal inline-block',
              isDark ? 'text-gold' : 'text-primary'
            )}
          >
            {titleAccent}
          </span>
          {titleEnd && <span> {titleEnd}</span>}
        </HeadingComponent>

        {/* Narrative Description / Subtitle */}
        {description && (
          <div
            className={cn(
              'text-sm sm:text-base leading-relaxed font-normal',
              isDark ? 'text-[#FAF5F0]/85' : 'text-text-muted',
              isCentered && 'max-w-2xl mx-auto'
            )}
          >
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        )}

        {children}
      </div>

      {/* Trailing Action / CTA */}
      {action && <div className="shrink-0 pt-2 sm:pt-0">{action}</div>}
    </div>
  );
}
