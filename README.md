# CrewThread

> A hybrid social platform that combines a **Twitter-style feed**, **LinkedIn-style profiles**, and an **Upwork-style freelance marketplace** — built for job seekers and companies.

CrewThread lets people share posts, build a professional profile, discover and apply to jobs, post and pitch freelance projects, and chat with an AI assistant ("Grok"), all wrapped in a fast, dark, X-inspired UI.

---

## ✨ Features

- 🐦 **Social feed** — post, browse, and engage with a Twitter-style timeline (For you / Following).
- 👤 **Rich profiles** — headline, bio, skills, experience, education, portfolio links, and availability status.
- 💼 **Jobs board** — companies post jobs; job seekers browse and apply.
- 🧑‍💻 **Freelance projects** — post projects and submit proposals, Upwork-style.
- 🔐 **Auth portal** — email/username + password login & signup with secure, session-cookie auth and a job-seeker / company role picker.
- 🤖 **AI assistant ("Grok")** — chat powered by Google Gemini.
- 🖼️ **Media uploads** — image upload & cropping via Cloudinary.
- 🌱 **Demo data seeding** — one click to populate the app with realistic sample content.

---

## 🛠️ Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Framework  | [Next.js 14](https://nextjs.org/) (App Router)      |
| Language   | TypeScript, React 18                                |
| Styling    | Tailwind CSS, Framer Motion, lucide-react icons     |
| Database   | MongoDB via [Mongoose](https://mongoosejs.com/)     |
| Auth       | Stateless HMAC-signed session cookies + scrypt hashing (Node `crypto`, no extra deps) |
| AI         | [Google Generative AI](https://ai.google.dev/) (Gemini) |
| Media      | [Cloudinary](https://cloudinary.com/)               |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ (or 20+)
- A **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- *(Optional)* Cloudinary and Google Gemini accounts for uploads & AI chat

### 1. Clone & install

```bash
git clone https://github.com/sujalsharma02/CrewThread.git
cd CrewThread
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
# Required
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/crewthread

# Recommended — secret used to sign auth session cookies.
# Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=your-long-random-secret

# Optional — image uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional — AI assistant (Google Gemini)
GEMINI_API_KEY=your-gemini-api-key
```

> `.env.local` is git-ignored. Never commit real secrets.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the **"Demo Data"** button on the home page to seed sample users, posts, jobs, and projects, then head to `/signup` to create an account.

---

## 📜 Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create a production build            |
| `npm run start` | Run the production build             |
| `npm run lint`  | Run ESLint (Next.js lint)            |

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router (pages + API routes)
│   ├── api/
│   │   ├── auth/         # signup, login, logout, me
│   │   ├── posts/  jobs/  projects/  users/  chat/  upload/  seed/
│   ├── login/  signup/   # Auth portal pages
│   ├── explore/  jobs/  projects/  messages/  notifications/  grok/  settings/
│   ├── profile/[username]/
│   ├── layout.tsx        # Root layout (wraps app in AuthProvider)
│   └── page.tsx          # Home feed
├── components/
│   ├── auth/             # AuthProvider (context) + AuthForm
│   ├── feed/             # PostCard, CreatePostModal, ImageCropperModal
│   └── layout/           # MainLayout (sidebars, nav)
├── lib/                  # db (mongoose), auth (crypto helpers), utils
└── models/               # Mongoose schemas: User, Post, Job, Project, Proposal
```

---

## 🤝 Contributing

Contributions are very welcome — whether it's a bug fix, a new feature, docs, or design polish. Thank you for helping make CrewThread better!

### Ground rules

- Be respectful and constructive. We follow a "be kind" code of conduct.
- Keep changes focused — one logical change per pull request.
- Match the existing code style (TypeScript, functional React components, Tailwind, the dark/indigo theme tokens already used across the app).

### Workflow

1. **Fork** the repository and clone your fork.
2. **Create a branch** off `main` with a descriptive name:
   ```bash
   git checkout -b feat/job-filters       # or fix/..., docs/..., chore/...
   ```
3. **Make your changes.** Keep commits small and meaningful.
4. **Verify it builds and type-checks** before pushing:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add salary range filter to jobs board
   fix: prevent duplicate username on signup
   docs: clarify env setup
   ```
6. **Push** to your fork and **open a Pull Request** against `main`.
   - Describe *what* changed and *why*.
   - Link any related issues (e.g. `Closes #12`).
   - Add screenshots / clips for UI changes.

### Reporting bugs & requesting features

Open an [issue](https://github.com/sujalsharma02/CrewThread/issues) and include:

- **Bugs:** steps to reproduce, expected vs. actual behavior, screenshots, and environment (OS, browser, Node version).
- **Features:** the problem you're solving and your proposed approach.

### Coding conventions

- **Components:** client components are marked with `"use client"`; keep server-only logic in route handlers / `lib`.
- **Styling:** prefer Tailwind utilities and the existing inline color tokens (`#000`, `#16181c`, `#2f3336`, indigo `#6366f1` → purple `#a855f7` gradient).
- **Data:** all DB access goes through `connectDB()` in `src/lib/db.ts`; never return password fields (the `User` schema keeps `password` as `select: false`).
- **Auth:** use the helpers in `src/lib/auth.ts` rather than rolling new crypto.

---

## 📄 License

CrewThread is open source under the [MIT License](./LICENSE). © 2026 Sujal Sharma.
