'use client';

import { useLocale } from 'next-intl';

/**
 * Hook for accessing typography settings based on current locale
 * Provides font family strings for consistent typography across components
 */
export function useTypography() {
  const locale = useLocale();

  return {
    isHindi: locale === 'hi',
    fontFamily: locale === 'hi'
      ? 'var(--font-hindi), "Noto Sans Devanagari", sans-serif'
      : 'var(--font-sans), system-ui, sans-serif',
    monoFont: 'var(--font-mono), ui-monospace, monospace',
    headingFont: locale === 'hi'
      ? 'var(--font-hindi), "Noto Sans Devanagari", sans-serif'
      : 'var(--font-heading), var(--font-sans), system-ui, sans-serif',
  };
}

/**
 * CSS variable references for inline styles
 */
export const fontVars = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
  heading: 'var(--font-heading)',
  hindi: 'var(--font-hindi)',
} as const;
