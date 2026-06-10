/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '../global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#F7F8FF',
    backgroundElement: '#FFFFFF',
    cardBackground: '#FFFFFF',
    cardBorder: '#E6E8F0',
    backgroundSelected: '#FDE68A',
    textSecondary: '#6B7280',
    textMuted: '#6B7280',
    primary: '#4F46E5',
    accent: '#FF6B35',
    teal: '#4ECDC4',
    yellow: '#F59E0B',
    green: '#10B981',
    danger: '#EF4444',
    neutral: '#64748B',
    secondary: '#7C3AED',
    lightGray: '#E5E7EB',
  },
  dark: {
    text: '#E2E8F0',
    background: '#050A23',
    backgroundElement: 'rgba(15, 23, 58, 0.92)',
    cardBackground: 'rgba(8, 28, 63, 0.96)',
    cardBorder: 'rgba(96, 165, 250, 0.24)',
    backgroundSelected: '#1E40AF',
    textSecondary: '#A5B4FC',
    textMuted: '#94A3B8',
    primary: '#60A5FA',
    accent: '#38BDF8',
    teal: '#22D3EE',
    yellow: '#FACC15',
    green: '#34D399',
    danger: '#FB7185',
    neutral: '#94A3B8',
    secondary: '#7C3AED',
    lightGray: 'rgba(255, 255, 255, 0.08)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  oneHalf: 6,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
