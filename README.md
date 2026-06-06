# Vibe Villa 🎭

A **mobile-first, anime avatar reality show platform** where contestants communicate only through live chats, audiences watch and react in real time, and votes decide eliminations — all powered by a high-performance, scalable real-time architecture.

---

## 🎯 What is Vibe Villa?

Vibe Villa is a live, streaming reality show application where:

- 🎭 **Contestants** hide behind anime avatars and communicate only through live chat
- 👁️ **Audiences** watch conversations live and react with emojis in real time
- ⚡ **Voting** decides eliminations — results update instantly
- 📱 **Everything happens live**, like a real-time stream on mobile

---

## 🎯 Main Goals

| Goal | Description |
|------|-------------|
| **Real-Time Chat** | Contestants chat instantly via Socket.io |
| **Massive Audience** | Supports thousands to millions of concurrent viewers |
| **Fast Voting** | Live elimination votes without any delay |
| **High Performance** | No lag during heavy traffic events |
| **Secure Platform** | Safe login and protected user data |
| **Mobile Optimized** | Smooth experience on mobile networks |

---

## 📋 Functional Requirements

### Contestant Features
- Login / Register
- Create profile & select anime avatar
- Join villa chat room
- Send & receive messages in real time
- Participate anonymously

### Audience Features
- Watch live chats
- Send emoji reactions
- Cast elimination votes
- View contestant profiles
- Receive live updates instantly

### Admin Features
- Monitor chat activity
- Moderate toxic content
- Manage contestants
- Start / stop voting rounds
- Remove abusive users
- View analytics and reports

### AI Moderation
- Detect toxic messages
- Filter spam content
- Flag abusive behavior
- Automatically mute harmful users

---

## ⚙️ Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Scalability** | Support millions of concurrent users |
| **Availability** | App works 24/7 with no downtime |
| **Low Latency** | Messages appear instantly (<100ms) |
| **Security** | All user data encrypted and protected |
| **Reliability** | No data loss during traffic spikes |
| **Performance** | App stays smooth during live events |
| **Fault Tolerance** | System recovers automatically from failures |
| **Maintainability** | Modular, easy to update and improve |
| **Mobile Optimization** | Low battery and low data usage |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Mobile App** | React Native + Expo |
| **Backend API** | Express.js |
| **Real-Time Communication** | Socket.io |
| **Database** | PostgreSQL + Firebase |
| **Cache & Fast Processing** | Redis |
| **Authentication** | JWT |
| **Hosting** | Kubernetes / Cloud |
| **Monitoring** | Grafana + Prometheus |

---

## 🏗️ System Architecture

```
                ┌──────────────────┐
                │ Mobile Users App │
                │ React Native App │
                └────────┬─────────┘
                         │
              Internet / WebSocket
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ▼                                ▼
 ┌─────────────────┐          ┌──────────────────┐
 │ Express API     │          │ Socket.io Server │
 │ Handles APIs    │          │ Handles Live Chat│
 └────────┬────────┘          └────────┬─────────┘
          │                             │
          └──────────┬──────────────────┘
                     ▼
             ┌──────────────┐
             │ Redis Server │
             │ Fast Memory  │
             └──────┬───────┘
                    │
                    ▼
           ┌──────────────────┐
           │ PostgreSQL DB    │
           │ Permanent Storage│
           └──────────────────┘
```

---

## ⚡ Real-Time Chat Flow

```
Contestant Sends Message
        │
        ▼
Socket.io Server Receives Message
        │
        ▼
Message Validation (spam check, toxicity check)
        │
        ▼
Redis Receives Message (ultra-fast broadcast)
        │
        ▼
Audience Instantly Receives Message
        │
        ▼
Background Worker Saves to PostgreSQL
```

---

## 🗳️ Live Voting Flow

```
Audience Votes
      │
      ▼
Redis Counter Updates Instantly
      │
      ▼
Live Results Displayed on All Devices
      │
      ▼
Every Few Seconds → Data Saved to PostgreSQL
```

---

## 🗄️ Database Design (Simplified)

| Table | Stores |
|-------|--------|
| **Users** | username, password (hashed), avatar, role |
| **Rooms** | villa room info, room status |
| **Messages** | message text, sender, timestamp, room ID |
| **Votes** | contestant votes, voting rounds |
| **Reports** | flagged content, moderation logs |

---

## 📱 Mobile Optimization

- **FlashList** for smooth live chat rendering (low memory, no lag)
- **iOS Keychain / Android Encrypted Storage** for secure token storage
- **Auto-reconnect** on network drop with missed message recovery
- **WebSocket heartbeats** to maintain persistent connections

---

## 🔒 Security Design

| Feature | Purpose |
|---------|---------|
| JWT Authentication | Secure login |
| HTTPS / WSS | Encrypted communication |
| Rate Limiting | Prevent spam voting and chat flooding |
| AI Moderation | Auto-remove abusive messages |
| Secure Storage | Protect tokens on device |
| Input Validation | Prevent injection attacks |

---

## 📈 Scalability Design

The system scales **horizontally** without major redesign:

- Add more API servers
- Add more Socket.io servers behind a load balancer
- Add more Redis nodes in cluster mode
- PostgreSQL read replicas for analytics

---

## 🔭 High Availability Strategy

| Component | Backup Strategy |
|-----------|----------------|
| API Servers | Multiple replicas |
| Socket Servers | Load balancing |
| Redis | Cluster mode |
| PostgreSQL | Replication |
| Cloud | Auto recovery |

---

## 📊 Monitoring & Analytics

**Tools:** Grafana + Prometheus

Monitors:
- Active users and viewers
- Live chat traffic
- Server health
- Voting activity
- Error rates
- App performance metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js (16+) and npm
- Git
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Biswahack20/vibevilaa.git
cd vibevilaa

# Install Frontend
cd frontend && npm install && cd ..

# Install Backend
cd backend && npm install && cd ..
```

### Run Frontend

```bash
cd frontend
npm start
# Press 'a' for Android, 'i' for iOS, 'w' for Web
```

### Run Backend

```bash
cd backend
npm start
# API available at http://localhost:3000
```

---

## 📂 Project Structure

```
vibevilaa/
├── frontend/        # React Native/Expo mobile app
│   ├── src/
│   │   ├── app/     # Screens (index.jsx, _layout.jsx)
│   │   ├── hooks/   # useTheme, useColorScheme
│   │   └── constants/  # theme.js
│   ├── assets/
│   └── README.md
├── backend/         # Node.js/Express REST API
│   ├── src/
│   └── README.md
└── README.md        # This file
```

---

## 🌟 Future Expansion

- 🎙️ Voice chat between contestants
- 🤖 AI-generated episode highlights
- 📹 Live streaming video feeds
- 🌐 Multi-language support
- 📊 Advanced audience analytics
- 🎬 Recommendation engine for show discovery

---

## 🤝 Git Workflow (Contributors)

**Always create feature branches — never commit directly to `main`.**

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Stage files individually (NOT git add .)
git add frontend/src/app/index.jsx

# Commit with conventional message format
git commit -m "feat: add live voting UI"

# Push and open pull request
git push origin feature/your-feature-name
```

**Commit Message Format:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `style:` — Formatting/styling
- `refactor:` — Code refactoring

---

## 📄 License

MIT License — see LICENSE file for details.

---

> 🎭 *Vibe Villa: Where anime avatars clash, alliances form, and only one survives the vote.* 🔴 LIVE
