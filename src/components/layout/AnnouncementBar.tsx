'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Gift, Truck } from 'lucide-react';

interface AnnouncementBarProps {
  isEnabled?: boolean;
  messages?: Array<{
    text: string;
    link?: string;
    icon?: 'sparkles' | 'gift' | 'truck';
  }>;
}

const DEFAULT_MESSAGES = [
  {
    text: 'Handcrafted Rangolis & Keepsake Crafts, made with devotion.',
    icon: 'sparkles' as const,
  },
  {
    text: 'Festive OHP & Woolen Rangolis for Diwali, Weddings & Pooja.',
    icon: 'gift' as const,
    link: '/shop',
  },
  {
    text: 'Free delivery on orders over ₹999 across India.',
    icon: 'truck' as const,
    link: '/shop',
  },
];

export function AnnouncementBar({
  isEnabled = true,
  messages = DEFAULT_MESSAGES,
}: AnnouncementBarProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!isEnabled || !messages || messages.length === 0) {
    return null;
  }

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'sparkles':
        return <Sparkles className="w-3.5 h-3.5 text-gold inline-block mr-1.5 flex-shrink-0" />;
      case 'gift':
        return <Gift className="w-3.5 h-3.5 text-gold inline-block mr-1.5 flex-shrink-0" />;
      case 'truck':
        return <Truck className="w-3.5 h-3.5 text-gold inline-block mr-1.5 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <aside
      aria-label="Announcements"
      className="relative z-50 w-full overflow-hidden bg-primary text-white py-2.5 text-xs font-medium tracking-wide border-b border-[#C59A5A]/35 shadow-sm select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Mobile single cycling banner / desktop ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center">
        {/* Continuous ticker track for seamless loop */}
        <div
          className={`flex items-center gap-8 whitespace-nowrap will-change-transform ${
            isPaused ? '[animation-play-state:paused]' : ''
          }`}
          style={{
            display: 'inline-flex',
            animation: 'ticker 25s linear infinite',
          }}
        >
          {/* Double array for seamless endless marquee */}
          {[...messages, ...messages, ...messages].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2">
              {renderIcon(item.icon)}
              {item.link ? (
                <Link
                  href={item.link}
                  className="hover:underline transition-opacity hover:opacity-90 underline-offset-2"
                >
                  {item.text}
                </Link>
              ) : (
                <span>{item.text}</span>
              )}
              <span className="text-gold/70 mx-2 select-none text-[11px]" aria-hidden="true">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </aside>
  );
}
