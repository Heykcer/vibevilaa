/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '../global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2C3E50', // Dark Text
    background: '#FFFFFF', // Crisp White
    backgroundElement: '#F5F5F5', // Light Gray
    backgroundSelected: '#FFE66D', // Vibrant Yellow
    textSecondary: '#60646C',
    primary: '#1A2544', // Deep Navy Blue
    accent: '#FF6B35', // Vibrant Orange
    teal: '#4ECDC4', // Vibrant Teal
    yellow: '#FFE66D', // Vibrant Yellow
  },
  dark: {
    text: '#FFFFFF', // Crisp White
    background: '#1A2544', // Deep Navy Blue
    backgroundElement: '#2C3E50', // Dark Text as element bg
    backgroundSelected: '#3E5062',
    textSecondary: '#F5F5F5', // Light Gray
    primary: '#1A2544', // Deep Navy Blue
    accent: '#FF6B35', // Vibrant Orange
    teal: '#4ECDC4', // Vibrant Teal
    yellow: '#FFE66D', // Vibrant Yellow
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
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
