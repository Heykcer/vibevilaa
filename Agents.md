# Vibe Villa - Agents Protocol & Working Rules

This document outlines the core development rules, aesthetic guidelines, and project progress for the AI Agents working on Vibe Villa.

## 1. Working Rules & Guidelines

- **Aesthetics First:** The UI must always feel premium, ultra-modern, and heavily tied to the "Interactive Anime Reality Show" theme. Use deep ocean blues, cyan neon accents, and dark-mode glassmorphism where appropriate. Avoid basic/generic UI elements.
- **Fault-Tolerant Architecture:** All page-level components must be wrapped in `ErrorBoundary` components to ensure the application fails silently without displaying crash screens to the user. Global unhandled exceptions should be suppressed natively.
- **Organized Structure:** Maintain a strict component structure (`src/components/Common/`, `src/components/Layout/`, `src/components/Sections/`).
- **Performance:** Use native CSS features (like `IntersectionObserver` scroll animations and `mix-blend-mode`) over installing heavy NPM libraries whenever possible to keep the app lightweight.
- **Documentation:** After completing any major task, the Agent MUST ask the user to review and update `Agents.md` to reflect the latest progress.

## 2. Progress Log (What's Done Till Now)

### Initialization
- Initialized Vite + React frontend project.
- Configured a comprehensive global CSS design system (`App.css`) with standard space/color tokens.

### Layout & Architecture
- Structured the `src/components/` directory into `Common`, `Layout`, and `Sections`.
- Implemented global App-level Error Handling that suppresses browser crashes and fails silently.

### Security & Infrastructure
- Implemented robust Environment Variable validation using Zod in both the frontend (`web-frontend/src/config/env.js`) and backend (`backend/src/config/env.js`) to guarantee secure, strongly-typed startup configurations.

### UI & Aesthetics
- Created a highly dynamic Landing Page featuring:
  - Full viewport background image (`hero-bg.png`).
  - Seamless full-screen `SplashScreen` that perfectly overlays the app and fades out to reveal the content.
  - Transparent floating Navbar with a `mix-blend-mode: screen` logo integration to perfectly remove black backgrounds without losing color.
  - Native, highly advanced "Spring-like" scroll-reveal animations using a custom `IntersectionObserver` component.
  - Ambient glowing Orbs and floating Reality Show emojis across the entire background.

### Documentation & Project Management
- Established `Agents.md` to formally track working rules, aesthetic guidelines, and project progress.
- Defined AI Agent Protocol for continuous self-documentation updates upon task completion.

### Real-Time Chat & Community
- Implemented real-time "Villa Chat Rooms" powered by Socket.IO on both backend and frontend.
- Created `POST /channels` backend route to allow dynamic room creation.
- Built a visually stunning `VillaRoomsPage` (Room Listing & Creation Modal) featuring deep glassmorphism and glowing oceanic borders.
- Developed `ChatRoomPage` for real-time messaging, seamlessly syncing historical messages with instant live-chat broadcasts.

---

> **Note to Agents:** Whenever you complete a new feature or major task, you must explicitly ask the user: *"Should we update Agents.md with these new changes?"*
