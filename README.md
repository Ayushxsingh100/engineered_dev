<div align="center">

# engineered.dev

**A full-stack engineering publication platform with a built-in multi-author CMS, role-based access control, and a hybrid Firestore/static data layer.**

Built with Next.js 15 · React 19 · Firebase · TypeScript

[Live Site](https://engineered.dev) · [Report Issue](https://github.com/Ayushxsingh100/engineered_dev/issues)

---

</div>

## 01 — Overview

**Engineered.dev** is a production publishing platform for engineering content — articles on cloud computing, backend systems, distributed architecture, and infrastructure case studies.

Unlike a typical blog starter, this is a complete content management system with:

- **Invite-only multi-author publishing** with granular role-based access control (Owner → Admin → Author)
- **Hybrid data architecture** that reads from Cloud Firestore when configured and falls back to local static data when credentials are absent — zero-downtime, zero-configuration
- **A rich admin CMS** with post lifecycle management (draft → review → scheduled → published → archived), image uploads with cropping, auto-save, and category/series organization
- **Engineering case study pages** with architecture deep-dives, technical challenge breakdowns, and tech stack tagging

The platform is designed for engineering teams who want full control over their publishing workflow without depending on third-party CMS platforms.

---

## 02 — Product Preview

> Screenshots can be captured by running the dev server locally with `npm run dev` and visiting `http://localhost:3000`.

| Page | Description |
|---|---|
| `/` | Homepage with terminal hero, featured articles, and case study spotlight |
| `/blog` | Filterable article listing with tag-based navigation |
| `/blog/[slug]` | Full article reader with table of contents, reading progress, and related posts |
| `/projects` | Engineering case study showcase |
| `/projects/[slug]` | Deep-dive case study with architecture, challenges, and lessons learned |
| `/about` | Team profiles and publication story |
| `/admin` | CMS dashboard (requires authentication) |
| `/admin/posts` | Article management with status filters and bulk actions |

---

## 03 — Core Features

### Public Site
| Feature | Details |
|---|---|
| **Interactive Terminal Hero** | Animated CLI-style hero component on the homepage |
| **MDX Article Engine** | Rich content rendering with syntax highlighting (Shiki), auto-linked headings, GFM support, and custom callout components |
| **Reading Experience** | Table of contents, reading progress bar, estimated reading time, share buttons, and related article suggestions |
| **Command Palette** | `Cmd/Ctrl+K` search across all articles and projects |
| **Engineering Case Studies** | Dedicated project pages with architecture diagrams, technical challenges, and scalability analysis |
| **RSS Feed** | Auto-generated RSS 2.0 and Atom feeds at `/rss.xml` |
| **SEO** | Dynamic sitemap, OpenGraph metadata, structured robots.txt, and per-page meta tags |
| **Dark/Light Mode** | System-aware theme switching with `next-themes` |

### Admin CMS
| Feature | Details |
|---|---|
| **Multi-Author RBAC** | Three roles — `owner`, `admin`, `author` — with granular permission checks (`posts.create`, `posts.publish`, `users.manage`, etc.) |
| **Post Lifecycle** | Full status workflow: Draft → Review → Scheduled → Published → Archived |
| **Rich Editor** | Markdown editor with live preview, image uploads to Firebase Storage, cover image cropping (21:9), and auto-save |
| **Invite System** | Email-based team invitations stored in Firestore. New users auto-provision on first Google sign-in |
| **Category & Series** | Organize content into categories and multi-part series with ordering |
| **Project Editor** | Dedicated editor for engineering case studies with architecture, scalability, and lessons-learned fields |
| **Admin Command Palette** | Keyboard shortcut bar for quick admin navigation |

---

## 04 — Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                        │
│              React 19 Server + Client Components                │
├──────────────────────────┬──────────────────────────────────────┤
│     Public Pages         │         Admin CMS Panel              │
│  Blog · Projects ·      │  Posts · Users · Categories ·        │
│  About · Uses · RSS      │  Projects · Command Palette          │
├──────────────────────────┴──────────────────────────────────────┤
│                  Data Abstraction Layer                          │
│         firebaseServer.ts  ←→  firebaseUtils.ts                 │
├─────────────────────────────┬───────────────────────────────────┤
│    Firebase Cloud Services  │     Static Fallback Layer         │
│  • Firestore (Database)     │  • Local MDX files (blog.ts)      │
│  • Auth (Google OAuth)      │  • Hardcoded projects (projects.ts)│
│  • Storage (Images)         │  • gray-matter frontmatter parsing │
└─────────────────────────────┴───────────────────────────────────┘
```

The system queries Firestore for live content when Firebase credentials are configured. If credentials are absent or a query fails, every function silently falls back to local static data. This means:

- **Development** works instantly without any Firebase setup
- **Production** serves live CMS content from Firestore
- **Failures** are gracefully handled — the site never crashes due to a database issue

---

## 05 — Engineering Highlights

**Hybrid Data Layer with Automatic Fallback**
Every public data function (`getAllPosts`, `getPostBySlug`, `getAllProjects`) validates Firebase availability via `validateFirebaseEnv()` before querying. On failure, it falls back to local file-system data with zero user-facing impact. This is implemented in [`firebaseServer.ts`](src/lib/firebaseServer.ts) and [`firebaseUtils.ts`](src/lib/firebaseUtils.ts).

**Invite-Only Authentication Flow**
Users cannot self-register. An owner sends an invite (stored in `invites/{email}` in Firestore). When the invited user signs in with Google, [`AuthContext.tsx`](src/contexts/AuthContext.tsx) checks for a matching invite, provisions a `users/{uid}` document with the assigned role, and deletes the invite — all in a single auth state change callback.

**Field-Level Firestore Security Rules**
Write operations are validated at the field level. [`firestore.rules`](firestore.rules) enforces an allowlist of permitted fields (`isValidPostData()`), string length constraints (title ≤ 300 chars), and role-based write scoping (authors cannot set `status: "published"` — only admins can).

**Content Validation Before Publish**
The CMS enforces publish-readiness checks via [`validatePostForPublish()`](src/lib/cms-types.ts) — requiring title, slug, excerpt, category, cover image, and body content before a post can transition to `published` status.

---

## 06 — Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15.x (App Router) |
| **UI** | React 19, Tailwind CSS v4, Framer Motion |
| **Typography** | Poppins, Inter, JetBrains Mono (Google Fonts) |
| **Language** | TypeScript 5.x |
| **Database** | Cloud Firestore |
| **Authentication** | Firebase Auth (Google Provider) |
| **Storage** | Firebase Storage (images, avatars) |
| **Content** | MDX via `next-mdx-remote`, `gray-matter` |
| **Syntax Highlighting** | Shiki + `rehype-pretty-code` |
| **Markdown Processing** | `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` |
| **Feeds** | RSS 2.0 + Atom via `feed` library |
| **Image Processing** | `react-easy-crop` with custom canvas cropping |
| **Theming** | `next-themes` (system/light/dark) |
| **Animation** | Framer Motion |
| **Linting** | ESLint 9 + `eslint-config-next` + `typescript-eslint` |

---

## 07 — Project Structure

```
engineered.dev/
├── public/
│   ├── images/              # Team avatars and case study covers
│   └── og-image.png         # OpenGraph preview image
├── scripts/
│   ├── check_users.ts       # List Firestore users and roles
│   ├── update_avatar.ts     # Batch update user avatars
│   └── migrate.js           # MDX frontmatter migration
├── src/
│   ├── app/
│   │   ├── admin/           # CMS: dashboard, posts, projects, users, categories
│   │   ├── api/             # API routes: /preview, /search
│   │   ├── blog/            # Public blog listing + [slug] article pages
│   │   ├── projects/        # Case study listing + [slug] detail pages
│   │   ├── about/           # Team and publication info
│   │   ├── login/           # Google OAuth sign-in
│   │   ├── rss.xml/         # Dynamic RSS feed route
│   │   ├── sitemap.ts       # Auto-generated sitemap
│   │   └── robots.ts        # SEO robots configuration
│   ├── components/
│   │   ├── admin/           # PostEditor, ProjectEditor, BlockEditor, ImageCropper
│   │   ├── mdx/             # Custom MDX components (Callout)
│   │   ├── Header.tsx       # Site header with navigation
│   │   ├── Footer.tsx       # Site footer
│   │   ├── CommandPalette.tsx # Cmd+K search
│   │   ├── TerminalHero.tsx # Animated homepage hero
│   │   └── ...              # BlogCard, ProjectCard, ShareButtons, etc.
│   ├── contexts/
│   │   └── AuthContext.tsx   # Firebase Auth + RBAC provider
│   └── lib/
│       ├── firebase.ts      # Client-side CMS operations (CRUD)
│       ├── firebaseServer.ts # Server-side queries with fallback
│       ├── firebaseConfig.ts # Firebase SDK initialization
│       ├── firebaseUtils.ts  # Shared processors and validators
│       ├── cms-types.ts     # CMS type definitions and RBAC matrix
│       ├── blog.ts          # Local MDX file reader (fallback)
│       ├── projects.ts      # Static project data (fallback)
│       ├── mdx.tsx          # MDX compilation and component map
│       ├── rss.ts           # RSS/Atom feed generation
│       ├── constants.ts     # Site metadata constants
│       └── cropImage.ts     # Canvas-based image cropping
├── firestore.rules          # Firestore security rules
├── storage.rules            # Firebase Storage security rules
├── firestore.indexes.json   # Composite index definitions
├── firebase.json            # Firebase project configuration
└── next.config.ts           # Next.js configuration
```

---

## 08 — Content & Data Flow

```
Author writes in CMS Editor
        │
        ▼
┌─────────────────────┐     ┌──────────────────────┐
│  Auto-save (draft)  │────▶│  Firestore: posts/   │
│  status: "draft"    │     │  {slug} document     │
└─────────────────────┘     └──────────┬───────────┘
                                       │
                            Admin publishes post
                                       │
                                       ▼
                            status: "published"
                            publishedAt: Timestamp
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                      ▼
          Public Site Queries                      RSS Feed Generation
     firebaseServer.getAllPosts()                   rss.ts → /rss.xml
     where("status","==","published")
                    │
                    ▼
          next-mdx-remote compiles
          post.body → React elements
                    │
                    ▼
           Rendered article page
      with ToC, progress bar, sharing
```

**Cover images** are uploaded to Firebase Storage (`/covers/{imageId}`) via the admin editor, cropped client-side using `react-easy-crop`, and stored as download URLs in the Firestore document.

---

## 09 — Security

### Firestore Rules
- **Public reads** limited to `status == "published"` documents
- **Write operations** validate field names against an allowlist and enforce string length constraints
- **Authors** can only edit their own posts and cannot set `status: "published"`
- **Only admins/owners** can publish, delete, or manage categories and users
- **Subscriber writes** validate email format, length, and require `subscribedAt == request.time`

### Firebase Storage Rules
- **Image uploads** restricted to `image/*` MIME types under 5MB
- **Avatar uploads** scoped to `avatars/{userId}` — users can only modify their own
- **Catch-all deny** rule blocks all unmatched paths

### Application Security
- API error responses return generic messages — no server internals leaked to clients
- Firebase client config uses `NEXT_PUBLIC_*` variables (public by design); security is enforced via Firestore/Storage rules
- Admin routes are client-gated via `AuthContext` — unauthenticated users are redirected to `/login`
- Environment validation fails explicitly when required variables are missing

---

## 10 — Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (optional — the site works without it using static fallback data)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ayushxsingh100/engineered_dev.git
cd engineered_dev

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

> The site runs fully without Firebase credentials. To enable the live CMS, add your Firebase project credentials to `.env.local`.

---

## 11 — Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://engineered.dev

# Firebase Client Configuration (Required for live CMS)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@engineered.dev
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Base URL for sitemap, RSS, and OG metadata |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | For CMS | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | For CMS | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | For CMS | Firestore project identifier |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | For CMS | Firebase Storage bucket for image uploads |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | For CMS | Firebase Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | For CMS | Firebase application identifier |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Optional | Default admin email for initial setup |

---

## 12 — Development

```bash
# Start dev server
npm run dev

# Lint codebase
npm run lint

# Production build
npm run build

# Start production server
npm start
```

### Utility Scripts

```bash
# List all Firestore users and their roles
npm run script:check-users

# Batch update user avatars
npm run script:update-avatar

# Migrate MDX frontmatter format
npm run script:migrate
```

---

## 13 — Deployment

The project is configured for Firebase services (Firestore, Auth, Storage). The Next.js application itself can be deployed to any platform that supports Node.js:

- **Vercel** — Zero-config deployment for Next.js
- **Firebase App Hosting** — Integrated with existing Firebase services

Firebase security rules are deployed separately:

```bash
npx firebase-tools deploy --only firestore:rules,storage
```

---

## 14 — Roadmap

Planned features and improvements:

- [ ] Comment system with moderation
- [ ] Newsletter integration with subscriber management
- [ ] Analytics dashboard in admin panel
- [ ] Full-text search with Algolia or Typesense
- [ ] Scheduled post auto-publishing via Cloud Functions
- [ ] Image optimization pipeline
- [ ] Multi-language content support

---

## 15 — License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by [Ayush Singh](https://github.com/Ayushxsingh100)

</div>
