# YourWork — AI-Assisted Portfolio Platform

> Build a credible, beautiful portfolio in minutes. Upload your materials, let AI draft the content, review and refine it, then publish a responsive, SEO-ready site.

[![CI/CD](https://github.com/MrJackson2077/portfolio-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/MrJackson2077/portfolio-platform/actions/workflows/ci.yml)

---

## 📋 Overview

YourWork is an **AI-assisted portfolio builder** where users:

1. **Upload** their resume, work documents, project links, and media
2. **Generate** — AI extracts facts and drafts every portfolio section
3. **Review & refine** — accept, edit, or regenerate each section
4. **Publish** — go live at a shareable URL in seconds

---

## 🗂 Project Structure

```
portfolio-platform/
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline (lint → build → security → deploy)
│
├── app_src/                # Next.js 14 frontend (TypeScript)
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── login/page.tsx        # Login
│   │   │   ├── signup/page.tsx       # Signup + onboarding wizard
│   │   │   ├── workspace/page.tsx    # Dashboard
│   │   │   ├── studio/page.tsx       # Content Studio (profile, projects, assets)
│   │   │   ├── templates/page.tsx    # Template gallery
│   │   │   ├── editor/page.tsx       # Portfolio block editor
│   │   │   ├── p/[slug]/page.tsx     # Public portfolio pages
│   │   │   └── settings/page.tsx     # Account settings
│   │   ├── components/
│   │   │   ├── ui/                   # Button, Input, Card, Modal, Toast…
│   │   │   └── layout/               # Sidebar, AppTopBar, AppLayout
│   │   ├── context/
│   │   │   └── AppContext.tsx        # Global state management
│   │   ├── lib/
│   │   │   ├── types.ts              # All TypeScript interfaces
│   │   │   └── mock-data.ts          # Demo data + simulated AI generation
│   │   └── styles/
│   │       └── globals.css           # CSS design system (tokens, reset, utilities)
│   └── package.json
│
├── controllers/
│   └── AuthController.js   # Auth logic: register, login, logout, refresh, reset
│
├── database/
│   └── db.js               # PostgreSQL connection pool + query helpers + schema
│
└── README.md
```

---

## 🚀 Getting Started

### Frontend (Next.js)

```bash
cd app_src
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend (coming in Phase 2)

The `controllers/` and `database/` folders are the foundation for a Node.js/Express API server. Install dependencies when ready:

```bash
npm install pg bcrypt jsonwebtoken uuid validator
```

Required environment variables (copy `.env.example` → `.env`):

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/yourwork
# or individually:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yourwork
DB_USER=postgres
DB_PASSWORD=your_password

# Auth
JWT_SECRET=your_super_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret

# App
APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🎨 Design System

Dark-mode first with a vibrant indigo/cyan palette. CSS custom properties drive all tokens:

| Token | Value |
|-------|-------|
| `--brand-primary` | `hsl(246, 83%, 62%)` — indigo violet |
| `--brand-secondary` | `hsl(196, 94%, 52%)` — electric cyan |
| `--surface-bg` | `hsl(225, 22%, 6%)` — deep navy |
| `--font-sans` | Inter |
| `--font-display` | Playfair Display |

---

## 🤖 AI Model Support

The platform supports multiple AI providers via a model-selector dropdown. Currently simulated; real API integration is Phase 2.

| Model | Provider | Free |
|-------|----------|------|
| Gemini 2.0 Flash | Google | ✅ |
| Gemini 1.5 Pro | Google | ✅ |
| GPT-4o | OpenAI | ❌ |
| GPT-4o Mini | OpenAI | ❌ |
| Claude 3.5 Sonnet | Anthropic | ❌ |
| Llama 3 70B | Meta (Open Source) | ✅ |
| Mistral Large | Mistral AI | ✅ |

---

## 🔄 CI/CD Pipeline

Six jobs run on every push and pull request:

| Job | Trigger | Description |
|-----|---------|-------------|
| `lint` | All pushes | ESLint + TypeScript type check |
| `build` | After lint | Next.js production build |
| `backend-check` | All pushes | Dependency audit + secrets scan |
| `security` | After build | npm audit (critical → fail) |
| `deploy-preview` | Pull requests | Preview deployment comment on PR |
| `deploy-production` | Push to `main` | Production deployment |

---

## 📄 API Routes (Phase 2)

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| `POST` | `/api/auth/register` | `AuthController.register` | Create account |
| `POST` | `/api/auth/login` | `AuthController.login` | Issue JWT tokens |
| `POST` | `/api/auth/logout` | `AuthController.logout` | Revoke session |
| `GET` | `/api/auth/me` | `AuthController.me` | Get current user |
| `POST` | `/api/auth/refresh` | `AuthController.refresh` | Refresh access token |
| `POST` | `/api/auth/forgot` | `AuthController.forgotPassword` | Request reset email |
| `POST` | `/api/auth/reset` | `AuthController.resetPassword` | Complete password reset |

---

## 🛡 Security Notes

- Passwords hashed with **bcrypt** (12 rounds)
- **JWT HS256** access tokens (7d TTL) + refresh tokens (30d)
- Constant-time password comparison to prevent user enumeration
- All sensitive actions written to `audit_events` table
- Private-by-default: no content is public until explicitly published

---

## 📍 Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Frontend MVP with simulated AI |
| Phase 2 | 🔜 Next | Node.js backend + PostgreSQL + real AI APIs |
| Phase 3 | 📋 Planned | Custom domains, subscriptions, analytics |

---

## 📝 License

MIT — see [LICENSE](LICENSE) for details.
