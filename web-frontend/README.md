# Vibe Villa - Web Frontend

Welcome to the frontend repository for Vibe Villa! This project is built using React and Vite, focusing on a modern, fast, and highly responsive user experience.

## 🚀 Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes with Node.js)

### Installation

1. Clone the repository and navigate to the `web-frontend` directory:
   ```bash
   cd web-frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the local development server:
```bash
npm run dev
```

This will launch Vite's development server. Open your browser to the URL provided in the terminal (typically `http://localhost:5173`) to view the app. 

## 🎨 Styling and Theme Guide

We use a custom, robust CSS Variable design system to ensure a premium look and feel across the application without relying on external CSS frameworks like Tailwind. 

Before building new UI components or modifying existing styles, please read our **[Theme Guide](THEME.md)**. 

Our theme system provides:
- A standardized color palette (with automatic Dark Mode support)
- Unified typography (Inter & Outfit fonts)
- Consistent spacing, shadows, and radii

## 🛠️ Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles the application into static files in the `dist` directory for production.
- `npm run preview`: Boot up a local web server that serves the files from `dist` to preview the production build.
- `npm run lint`: Runs ESLint to catch syntax and style issues.

## 🤝 Contributing

When contributing to the frontend:
1. Ensure your code passes all linting checks.
2. Adhere to the design system variables outlined in `THEME.md`.
3. Test your components in both Light and Dark modes.
