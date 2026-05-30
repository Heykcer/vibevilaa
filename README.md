# Vibe Villa 🎉

A modern, full-stack web and mobile application featuring a React Native frontend with Expo and a Node.js/Express backend. Vibe Villa combines beautiful, professional design with powerful backend capabilities to deliver an exceptional user experience.

## Project Overview

**Vibe Villa** is a comprehensive platform that delivers a seamless experience across web, iOS, and Android. The project consists of:

- **Frontend**: Modern mobile app built with Expo, React Native, and TypeScript featuring an incredibly clean design system with deep navy blue, crisp white, and vibrant fruit accents
- **Backend**: Robust REST API built with Node.js and Express, handling business logic, data persistence, and authentication

## Project Structure

```
vibevilaa/
├── frontend/                   # React Native/Expo mobile app
│   ├── src/
│   ├── assets/
│   ├── app.json
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── README.md              # Frontend-specific documentation
│   └── ...
├── backend/                    # Node.js/Express REST API
│   ├── src/
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   ├── package.json
│   └── ...
└── README.md                   # This file
```

## Tech Stack

### Frontend
- Expo (~56.0.5)
- React Native (0.85.3)
- React (19.2.3)
- TypeScript (~6.0.3)
- React Native Reanimated (4.3.1)
- ESLint & Prettier

### Backend
- Node.js
- Express.js
- Database (configured in backend)

## Quick Start

### Prerequisites

- Node.js (16+) and npm/yarn
- Git
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Code editor (VS Code recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Biswahack20/vibevilaa.git
   cd vibevilaa
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   cd ..
   ```

## Setup Instructions

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Choose your platform:
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Press `w` for Web Browser
   - Press `j` for Expo Go (on physical device)

For detailed frontend documentation, see [frontend/README.md](frontend/README.md)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables (if needed):
   ```bash
   # Follow backend-specific configuration
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The backend API will be available at `http://localhost:3000` (or configured port)

## Git Workflow Guide

### For Contributors: Fork & Pull Request Workflow

#### 1. Fork the Repository

1. Click the "Fork" button on [GitHub](https://github.com/Biswahack20/vibevilaa)
2. This creates your own copy of the repository under your account

```bash
# Clone your forked repository
git clone https://github.com/YOUR_USERNAME/vibevilaa.git
cd vibevilaa

# Add the upstream repository to keep sync
git remote add upstream https://github.com/Biswahack20/vibevilaa.git
git remote -v  # Verify remotes
```

#### 2. Create a Feature Branch

Always create a separate branch for your work. Never commit directly to `main`.

```bash
# Update your local main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create a new feature branch
git checkout -b feature/your-feature-name
# Or for bug fixes: git checkout -b fix/bug-name
# Or for documentation: git checkout -b docs/doc-name
```

**Branch Naming Conventions:**
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/doc-name` - Documentation updates
- `refactor/refactor-name` - Code refactoring
- `test/test-name` - Test additions

#### 3. Make Your Changes

Edit and commit your changes:

```bash
# Check status
git status

# Stage individual files (NOT git add .)
git add path/to/file1.ts
git add path/to/file2.tsx
git add frontend/package.json

# Verify staged changes
git status

# Commit with clear message
git commit -m "feat: add user authentication"
```

**Commit Message Format:**
- `feat: description` - New feature
- `fix: description` - Bug fix
- `docs: description` - Documentation
- `style: description` - Formatting/styling
- `refactor: description` - Code refactoring
- `test: description` - Tests
- `chore: description` - Build/dependency updates

#### 4. Keep Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on top of upstream/main
git rebase upstream/main

# If conflicts occur, resolve them, then:
git add resolved_file.ts
git rebase --continue
```

#### 5. Push Your Changes

```bash
# Push your branch to your fork
git push origin feature/your-feature-name

# If you rebased and need force push
git push origin feature/your-feature-name --force-with-lease
```

#### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Ensure the base is `Biswahack20/vibevilaa:main`
4. Add a clear title and description
5. Reference any related issues: `Fixes #123`
6. Wait for review and feedback

#### 7. Address Review Comments

```bash
# Make requested changes
git add specific_file.ts
git commit -m "refactor: address review comments"

# Push updates
git push origin feature/your-feature-name
```

#### 8. Merge

Once approved, maintainers will merge your PR into main.

### Essential Git Commands

```bash
# Check current branch
git branch

# List all branches (including remote)
git branch -a

# Show commit history
git log --oneline -10

# Show changes in working directory
git diff

# Show staged changes
git diff --staged

# Undo unstaged changes
git checkout -- path/to/file

# Undo staged changes
git reset HEAD path/to/file

# Amend last commit (before pushing)
git commit --amend

# View remote URL
git remote -v

# Sync fork with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Important Git Guidelines

⚠️ **DO NOT use `git add .`** - Always stage specific files:
```bash
# ✅ CORRECT
git add frontend/src/components/MyComponent.tsx
git add frontend/package.json

# ❌ WRONG
git add .
```

✅ **DO:**
- Create feature branches for every change
- Stage files individually
- Write clear commit messages
- Keep commits focused and atomic
- Test before pushing

❌ **DON'T:**
- Commit directly to main
- Use `git add .`
- Mix unrelated changes in one commit
- Force push to main
- Commit sensitive data (.env files, secrets)

## Running the Application

### Run Frontend

```bash
cd frontend
npm start
```

Available platforms:
- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

### Run Backend

```bash
cd backend
npm start
```

### Run Both (Parallel Development)

Open two terminals:

**Terminal 1:**
```bash
cd backend
npm start
```

**Terminal 2:**
```bash
cd frontend
npm start
```

### Linting & Formatting (Frontend)

```bash
cd frontend

# Check for code issues
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Clear Cache and Reinstall

```bash
# Frontend
cd frontend
rm -rf node_modules
npm cache clean --force
npm install

# Backend
cd backend
rm -rf node_modules
npm cache clean --force
npm install
```

### Expo Issues

```bash
# Clear Expo cache
expo start -c

# Reset Metro bundler
expo start --clear
```

## Project Guidelines

### Code Quality
- Use TypeScript for type safety
- Follow ESLint and Prettier rules
- Write meaningful commit messages
- Keep functions small and focused

### File Organization
- Group related components together
- Use clear, descriptive file names
- Maintain consistent folder structure
- Add comments for complex logic

### Testing
- Test your changes locally before pushing
- Verify builds succeed on both platforms
- Test on physical device if possible
- Run linting before committing

## Documentation

- [Frontend Documentation](frontend/README.md) - React Native/Expo specific setup and development
- [Backend Documentation](backend/README.md) - API documentation and backend setup

## Contributing

Thank you for contributing to Vibe Villa! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Stage files individually (`git add specific_file.ts`)
4. Commit changes (`git commit -m "feat: add amazing feature"`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Code of Conduct

Be respectful and professional. We're building something great together!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

Need help? 
- Check existing documentation
- Review similar pull requests
- Create an issue with clear details
- Contact the maintainers

---

Happy coding! 🚀
