# Vibe Villa Frontend 🎭

A **mobile-first anime avatar reality show app** built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev). Contestants communicate anonymously through live chats, audiences watch and react in real time, and votes decide who gets eliminated — all running on a high-performance mobile interface.

---

## 📱 App Overview

The frontend is the face of the Vibe Villa platform:

| User Type       | What They Do                                                             |
| --------------- | ------------------------------------------------------------------------ |
| **Contestants** | Log in, pick an anime avatar, join the villa chat room, chat anonymously |
| **Audience**    | Watch live conversations, send emoji reactions, cast eviction votes      |
| **Admins**      | Moderate content, manage contestants, trigger voting rounds              |

---

## 🛠️ Tech Stack

| Technology                                                                       | Version | Purpose                   |
| -------------------------------------------------------------------------------- | ------- | ------------------------- |
| [Expo](https://expo.dev)                                                         | ~56.0.5 | Cross-platform runtime    |
| [React Native](https://reactnative.dev)                                          | 0.85.3  | Mobile UI framework       |
| [React](https://react.dev)                                                       | 19.2.3  | Component rendering       |
| [TypeScript](https://typescriptlang.org)                                         | ~6.0.3  | Type safety               |
| [Expo Router](https://docs.expo.dev/router/introduction/)                        | ~56.2.7 | File-based routing        |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)   | 4.3.1   | Smooth animations         |
| [Socket.io Client](https://socket.io)                                            | —       | Real-time chat & voting   |
| [Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context) | ~5.7.0  | Device-safe layouts       |
| ESLint + Prettier                                                                | —       | Code quality & formatting |

---

## ✨ Core Features

- 🔴 **Live Stream Banner** — "LIVE" indicator with real-time viewer count
- 🎭 **Anime Avatar Contestant Cards** — Horizontal scroll of active participants with status
- ⚡ **Live Eviction Voting** — Vote progress bars that update instantly (simulating Redis counters)
- 💬 **Real-Time Chat Feed** — Scrollable live conversation with audience participation
- 😂 **Emoji Reactions** — One-tap reaction bar with live counters (🔥 💖 😂 😮 💀)
- 🌗 **Light / Dark Theme** — Fully dynamic, adapts to device color scheme via `useTheme`

---

## 🎨 Design System

Built on the **Vibe Villa Design System** defined in the project README:

### Color Palette

| Color              | Hex       | Role                                          |
| ------------------ | --------- | --------------------------------------------- |
| **Deep Navy Blue** | `#1A2544` | Primary background (dark mode), hero overlays |
| **Crisp White**    | `#FFFFFF` | Text, light mode background                   |
| **Vibrant Orange** | `#FF6B35` | Accent — CTAs, live badges, vote buttons      |
| **Vibrant Teal**   | `#4ECDC4` | Secondary accent — vote bar fill              |
| **Vibrant Yellow** | `#FFE66D` | Tertiary accent — vote bar fill               |
| **Light Gray**     | `#F5F5F5` | Cards, element backgrounds (light mode)       |
| **Dark Text**      | `#2C3E50` | Body text, card backgrounds (dark mode)       |

### Theme Tokens (via `src/constants/theme.js`)

```js
// Light Mode
{
  text: '#2C3E50',           // Dark Text
  background: '#FFFFFF',     // Crisp White
  backgroundElement: '#F5F5F5', // Light Gray
  backgroundSelected: '#FFE66D', // Vibrant Yellow
  primary: '#1A2544',        // Deep Navy Blue
  accent: '#FF6B35',         // Vibrant Orange
  teal: '#4ECDC4',           // Vibrant Teal
  yellow: '#FFE66D',         // Vibrant Yellow
}

// Dark Mode
{
  text: '#FFFFFF',           // Crisp White
  background: '#1A2544',     // Deep Navy Blue
  backgroundElement: '#2C3E50', // Dark Text as element bg
  backgroundSelected: '#3E5062',
  primary: '#1A2544',        // Deep Navy Blue
  accent: '#FF6B35',         // Vibrant Orange
  teal: '#4ECDC4',           // Vibrant Teal
  yellow: '#FFE66D',         // Vibrant Yellow
}
```

### Design Principles

1. **Professional & Trustworthy** — Deep navy creates authority and credibility
2. **Clean & Minimal** — Crisp white provides breathing room and clarity
3. **Modern & Vibrant** — Fruit accent colors inject energy and personality
4. **High Contrast** — All text meets WCAG accessibility ratio requirements
5. **Cohesive** — Consistent tokens used across every screen and component

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── _layout.jsx        # Root stack layout (header hidden)
│   │   └── index.jsx          # Home screen — live villa dashboard
│   ├── components/            # Reusable UI components (future)
│   ├── constants/
│   │   └── theme.js           # Colors, Fonts, Spacing tokens
│   ├── hooks/
│   │   ├── use-color-scheme.js    # Device color scheme (native)
│   │   ├── use-color-scheme.web.js # Color scheme (web hydration)
│   │   └── use-theme.js       # Returns active Colors[scheme]
│   └── global.css             # Web font variables
├── assets/
│   └── images/
│       └── vibe_villa_hero.png # Hero banner image
├── app.json                   # Expo config
├── package.json               # Dependencies & scripts
├── .eslintrc.json             # ESLint config
└── .prettierrc                # Prettier config (endOfLine: auto)
```

---

## 📡 Real-Time Architecture (Frontend Side)

```
User Action (tap vote / send message)
        │
        ▼
React State Update (instant UI feedback)
        │
        ▼
Socket.io emit() → Backend Socket Server
        │
        ▼
Server broadcasts to all connected clients
        │
        ▼
All viewers see update simultaneously
```

---

## 📱 Mobile Optimization

| Strategy                 | Implementation                                      |
| ------------------------ | --------------------------------------------------- |
| **Smooth Scrolling**     | `FlatList` / `FlashList` for live chat rendering    |
| **Keyboard Handling**    | `KeyboardAvoidingView` with platform-aware behavior |
| **Secure Token Storage** | iOS Keychain / Android Encrypted Storage            |
| **Network Recovery**     | Auto-reconnect WebSocket on disconnect              |
| **Low Memory Usage**     | Windowed list rendering for thousands of messages   |

---

## 🔒 Security

- **JWT tokens** stored securely — never in plain AsyncStorage
- **HTTPS / WSS** encrypted connections only
- **Input sanitization** on all text inputs before emit
- **Rate limiting** enforced server-side (Redis counters)
- **AI moderation** flags toxic messages before display

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Emulator, iOS Simulator, or [Expo Go](https://expo.dev/go)

### Install & Run

```bash
cd frontend
npm install
npm start

# Choose platform:
# 'a' → Android Emulator
# 'i' → iOS Simulator
# 'w' → Web Browser
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your API base URL and other config
```

---

## 📜 Available Scripts

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm start`             | Start Expo development server    |
| `npm run android`       | Run on Android emulator          |
| `npm run ios`           | Run on iOS simulator             |
| `npm run web`           | Run in web browser               |
| `npm run lint`          | Check code quality (ESLint)      |
| `npm run lint:fix`      | Auto-fix lint issues             |
| `npm run format`        | Format all files (Prettier)      |
| `npm run format:check`  | Check formatting without changes |
| `npm run reset-project` | Reset to blank template          |

---

## 🧩 Adding New Components

Follow the Vibe Villa design template:

```jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { Spacing } from '../constants/theme';

export default function MyComponent() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <Text style={[styles.title, { color: theme.text }]}>Title</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]}>
        <Text style={styles.buttonText}>Action</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: Spacing.three },
  title: { fontSize: 18, fontWeight: '800' },
  button: { borderRadius: 8, padding: Spacing.two, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
```

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

---

## 📄 License

Part of the Vibe Villa platform. See LICENSE file for details.

---

> 🎭 _The villa is watching. The audience is voting. Who survives tonight?_ 🔴 LIVE
