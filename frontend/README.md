# Vibe Villa Frontend 🎉

A modern, responsive mobile and web application built with [Expo](https://expo.dev), [React Native](https://reactnative.dev), and [TypeScript](https://www.typescriptlang.org/). Vibe Villa provides a seamless, beautifully designed experience across iOS, Android, and web platforms.

## Project Description

Vibe Villa Frontend is a full-featured mobile application that runs on iOS, Android, and web platforms. The project is built using Expo, enabling rapid development and deployment across multiple platforms from a single codebase. It features a modern, cohesive design system with vibrant colors and smooth animations.

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (~56.0.5)
- **Runtime**: [React Native](https://reactnative.dev) (0.85.3)
- **UI Library**: React (19.2.3) / React DOM (19.2.3)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (~6.0.3)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (~56.2.7) - File-based routing
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (4.3.1)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
  - react-native-gesture-handler (~2.31.1)
  - react-native-screens (4.25.2)
  - react-native-safe-area-context (~5.7.0)
- **Styling**: Custom CSS modules with themed components
- **Code Quality**:
  - ESLint (^8.57.1) with TypeScript, React, and React Native plugins
  - Prettier (^3.2.5) for code formatting
  - eslint-config-prettier for ESLint and Prettier integration

## Features

- ✨ **Cross-Platform Support**: iOS, Android, and Web with a single codebase
- 🎨 **Theming System**: Dynamic theme support that adapts to device color scheme preferences
- 🎭 **Animated Components**: Smooth, hardware-accelerated animations using Reanimated
- 📱 **Tab Navigation**: Multi-tab interface for intuitive navigation
- 🎯 **File-Based Routing**: Automatic route generation based on file structure
- 🌐 **Responsive Design**: Optimized UI for all screen sizes
- 🔤 **Custom Icons**: Tab icons and animated icon components
- ♿ **Accessibility**: Built with accessibility best practices
- 📦 **Modular Architecture**: Well-organized component and hook structure

## Getting Started

### Prerequisites

- Node.js (16+) and npm/yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS/Android emulators (for mobile development) or [Expo Go](https://expo.dev/go)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

   The app will launch in the Expo development environment. You'll see options to:
   - Open in [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - Open in [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - Open in [Expo Go](https://expo.dev/go) on your physical device
   - Open in Web browser

3. **Platform-specific development**

   ```bash
   npm run android     # Android development
   npm run ios         # iOS development
   npm run web         # Web browser development
   ```

### Environment Configuration

The app requires environment variables for proper configuration. Follow these steps to set up your environment:

1. **Copy the example environment file**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables**

   Edit `.env.local` with your specific configuration:

   ```env
   # API Configuration
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   EXPO_PUBLIC_API_TIMEOUT=30000

   # Authentication
   EXPO_PUBLIC_AUTH_ENABLED=true
   EXPO_PUBLIC_JWT_SECRET=your_jwt_secret_key_here

   # Firebase (if using)
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

   # App Configuration
   EXPO_PUBLIC_ENVIRONMENT=development
   EXPO_PUBLIC_LOG_LEVEL=debug
   ```

3. **Important Security Notes**

   - ⚠️ **Never commit `.env.local`** - Add it to `.gitignore`
   - Use `.env.example` as a template for new environment setups
   - Keep sensitive data like API keys and secrets out of version control
   - Use different `.env.local` files for development, staging, and production

4. **Available Environment Variables**

   See [.env.example](.env.example) for a complete list of available configuration options including:
   - API endpoints and authentication
   - Firebase configuration
   - Feature flags and debug settings
   - Analytics and CDN configuration

## Development Setup

### Code Linting with ESLint

Run ESLint to identify code quality issues:

```bash
npm run lint
```

Automatically fix ESLint issues:

```bash
npm run lint:fix
```

ESLint is configured to check TypeScript and JavaScript files with:
- TypeScript/JavaScript linting via @typescript-eslint
- React and React Hooks rules
- React Native specific rules
- Prettier integration for formatting conflicts

### Code Formatting with Prettier

Format all code files:

```bash
npm run format
```

Check formatting without making changes:

```bash
npm run format:check
```

### Combined Workflow

To ensure consistent code quality:

```bash
npm run lint:fix    # Fix linting issues
npm run format      # Format code
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # App screens and navigation
│   │   ├── _layout.tsx         # Root layout with routing
│   │   ├── index.tsx           # Home screen
│   │   └── explore.tsx         # Explore screen
│   ├── components/             # Reusable UI components
│   │   ├── animated-icon.tsx   # Animated icon component
│   │   ├── app-tabs.tsx        # Tab navigation component
│   │   ├── themed-*.tsx        # Themed components
│   │   └── ui/                 # UI component library
│   ├── constants/              # App constants
│   │   └── theme.ts            # Theme configuration
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-color-scheme.ts # Color scheme hook
│   │   └── use-theme.ts        # Theme hook
│   └── global.css              # Global styles
├── assets/                     # Images, icons, and static assets
├── app.json                    # Expo app configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format all code files |
| `npm run format:check` | Check formatting |
| `npm run reset-project` | Reset to a blank project template |

---

## 🎨 Design System

### Color Palette

Vibe Villa features an incredibly clean, modern, and cohesive design system built on a professional color palette:

#### Primary Colors

| Color | Hex Code | Preview |
|-------|----------|---------|
| **Deep Navy Blue** | `#1A2544` | <img src="https://img.shields.io/badge/Color-1A2544?style=flat&logo=&logoColor=white&label=%20&color=1A2544" alt="Deep Navy Blue" /> |
| **Crisp White** | `#FFFFFF` | <img src="https://img.shields.io/badge/Color-FFFFFF?style=flat&logo=&logoColor=white&label=%20&color=FFFFFF&labelColor=1A2544" alt="Crisp White" /> |

#### Accent Colors

| Color | Hex Code | Preview |
|-------|----------|---------|
| **Vibrant Orange** | `#FF6B35` | <img src="https://img.shields.io/badge/Color-FF6B35?style=flat&logo=&logoColor=white&label=%20&color=FF6B35" alt="Vibrant Orange" /> |
| **Vibrant Teal** | `#4ECDC4` | <img src="https://img.shields.io/badge/Color-4ECDC4?style=flat&logo=&logoColor=white&label=%20&color=4ECDC4" alt="Vibrant Teal" /> |
| **Vibrant Yellow** | `#FFE66D` | <img src="https://img.shields.io/badge/Color-FFE66D?style=flat&logo=&logoColor=1A2544&label=%20&color=FFE66D" alt="Vibrant Yellow" /> |

#### Secondary Colors

| Color | Hex Code | Preview |
|-------|----------|---------|
| **Light Gray** | `#F5F5F5` | <img src="https://img.shields.io/badge/Color-F5F5F5?style=flat&logo=&logoColor=1A2544&label=%20&color=F5F5F5" alt="Light Gray" /> |
| **Dark Text** | `#2C3E50` | <img src="https://img.shields.io/badge/Color-2C3E50?style=flat&logo=&logoColor=white&label=%20&color=2C3E50" alt="Dark Text" /> |

---

### Design Principles

- **Professional & Trustworthy** 🏛️: Deep navy creates authority and credibility
- **Clean & Minimal** ✨: Crisp white provides breathing room and clarity
- **Modern & Vibrant** 🎯: Fruit accent colors inject energy and personality
- **Accessible** ♿: High contrast ratios ensure readability for all users
- **Cohesive** 🎨: Consistent color usage across all components and screens

---

### Visual Design Preview

<div style="background-color: #1A2544; padding: 24px; border-radius: 8px; margin: 20px 0;">
  <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
    <h4 style="color: #1A2544; margin-top: 0;">Deep Navy + Crisp White Card</h4>
    <p style="color: #2C3E50; line-height: 1.6;">This showcases the primary color combination used throughout the app. The deep navy provides a professional foundation while crisp white content areas ensure excellent readability.</p>
    
    <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
      <div style="background-color: #FF6B35; padding: 12px 16px; border-radius: 6px; color: white; font-weight: 600;">Orange CTA</div>
      <div style="background-color: #4ECDC4; padding: 12px 16px; border-radius: 6px; color: white; font-weight: 600;">Teal CTA</div>
      <div style="background-color: #FFE66D; padding: 12px 16px; border-radius: 6px; color: #1A2544; font-weight: 600;">Yellow CTA</div>
    </div>
  </div>
  
  <div style="background-color: #F5F5F5; padding: 16px; border-radius: 8px;">
    <p style="color: #2C3E50; margin: 0; font-size: 14px;">Light gray secondary background for supporting content and card surfaces</p>
  </div>
</div>

---

### Component Design Template

Below is a blank component design template following the Vibe Villa design system:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Color System Constants
const COLORS = {
  primary: '#1A2544',      // Deep Navy Blue
  white: '#FFFFFF',         // Crisp White
  accentOrange: '#FF6B35',  // Vibrant Orange
  accentTeal: '#4ECDC4',    // Vibrant Teal
  accentYellow: '#FFE66D',  // Vibrant Yellow
  lightGray: '#F5F5F5',     // Light Gray
  darkText: '#2C3E50',      // Dark Text
  lightText: '#FFFFFF',     // Light Text
};

interface BlankComponentProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
}

/**
 * BlankComponent - A template component following Vibe Villa design system
 * 
 * Design Features:
 * - Deep navy background with white card surface
 * - Vibrant accent colors for interactive elements
 * - Clean spacing and typography hierarchy
 * - Professional and trustworthy appearance
 */
export const BlankComponent: React.FC<BlankComponentProps> = ({
  title = 'Component Title',
  subtitle = 'Component Subtitle',
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Card Container */}
      <View style={styles.card}>
        {/* Header Section - Deep Navy Background */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Content Section - Crisp White Background */}
        <View style={styles.content}>
          <Text style={styles.bodyText}>
            Add your content here. The design system ensures consistency
            and a professional appearance across all components.
          </Text>

          {/* Accent Color Showcase */}
          <View style={styles.accentRow}>
            <View style={[styles.accentBox, { backgroundColor: COLORS.accentOrange }]} />
            <View style={[styles.accentBox, { backgroundColor: COLORS.accentTeal }]} />
            <View style={[styles.accentBox, { backgroundColor: COLORS.accentYellow }]} />
          </View>
        </View>

        {/* Action Button - Vibrant Accent */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Action Button</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Deep Navy Blue
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.white, // Crisp White
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    backgroundColor: COLORS.primary, // Deep Navy Background
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white, // Light Text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    opacity: 0.8,
  },
  content: {
    padding: 20,
    backgroundColor: COLORS.white, // Crisp White
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.darkText, // Dark Text
    marginBottom: 20,
  },
  accentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  accentBox: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  actionButton: {
    backgroundColor: COLORS.accentOrange, // Vibrant Orange Accent
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default BlankComponent;
```

### Usage Examples

```tsx
// Simple usage
<BlankComponent title="Welcome" subtitle="Get started" />

// With callback
<BlankComponent 
  title="Confirm Action"
  subtitle="Please review before proceeding"
  onPress={() => console.log('Action triggered')}
/>
```

---

### Design Guidelines for New Components

When creating new components, follow these principles:

1. **Color Hierarchy**: Use deep navy for primary elements, white for content, and vibrant accents for CTAs
2. **Spacing**: Maintain consistent padding (16px, 20px, 24px) for visual rhythm
3. **Typography**: Use clear hierarchy with larger, bolder text for headings
4. **Shadows**: Apply subtle shadows to create depth without overwhelming the design
5. **Rounded Corners**: Use 8-12px border radius for a modern, polished look
6. **Interactive States**: Provide visual feedback on touch/hover with opacity or scale changes

---

## Styling & Theming

The app uses a theming system that automatically adapts to the device's color scheme preferences. Components are themed using:

- **Custom hooks** (`use-theme.ts`, `use-color-scheme.ts`) for theme access
- **Themed components** (`themed-text.tsx`, `themed-view.tsx`) for consistent styling
- **CSS modules** for scoped, modular styling
- **Dynamic color schemes** supporting light and dark modes
- **Color system** ensuring professional appearance with deep navy, crisp white, and vibrant accent colors

---

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## License

This project is part of Vibe Villa. See LICENSE file for details.
