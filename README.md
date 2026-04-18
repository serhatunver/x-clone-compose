# X Clone (monorepo)

Full-stack X/Twitter-style clone in a **pnpm + Turborepo** workspace.

- **Backend**: `apps/api` (Express 5 + MongoDB)
- **Frontends**:
  - `apps/web` (Nuxt 3 + shadcnui + sidebase auth)
  - `apps/nuxt` (Nuxt 4 + Nuxt UI)
  - `apps/next` (Next.js + shadcnui)

---

## Demo

https://github.com/user-attachments/assets/274fadfb-362a-4322-bf7f-c307b41ddbba

## Project overview

This repository is a monorepo with:

- A versioned REST API mounted at **`/api/v1`**
- Multiple UI implementations living side-by-side
- Shared workspace packages in `packages/`

---

## Tech stack

| Area                      | What’s in this repo                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Monorepo**              | pnpm workspaces, Turborepo                                                                                            |
| **API (`apps/api`)**      | Node.js (>= 24.7), TypeScript 6, Express 5, Mongoose 9, Zod 4, JWT via `jose`, Swagger UI (`/api-docs`), Pino, Vitest |
| **Web (`apps/web`)**      | Nuxt 3, Vue 3, TypeScript, Tailwind CSS, `shadcn-nuxt`, Pinia (+ persisted state), `@sidebase/nuxt-auth`              |
| **Alt Web (`apps/nuxt`)** | Nuxt 4, `@nuxt/ui`, Tailwind v4, Zod                                                                                  |
| **Alt Web (`apps/next`)** | Next.js, React, Tailwind v4                                                                                           |
| **Data**                  | MongoDB                                                                                                               |
| **Dev tooling**           | ESLint (shared presets), Prettier, Husky, nano-staged, Commitlint                                                     |

---

## Architecture / monorepo structure

### Apps

| Path        | Purpose                                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `apps/api`  | Express API served on `PORT` (default `8080`), mounts routes at `/api/v1`, Swagger at `/api-docs`, health at `/health` |
| `apps/web`  | Nuxt 3 UI; expects API base at `NUXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8080/api/v1`)                        |
| `apps/nuxt` | Nuxt 4 UI (alternative); expects API base at `API_BASE` (defaults to `http://localhost:8080/api/v1`)                   |
| `apps/next` | Next.js UI (alternative); currently standard Next defaults apply                                                       |

### Packages

| Path                         | Purpose                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `packages/shared`            | Shared TS build output (`@repo/shared`) used by the API and Nuxt 4 app              |
| `packages/eslint-config`     | Shared ESLint configs (`@repo/eslint-config`) with exports for `api`, `web`, `next` |
| `packages/typescript-config` | Shared tsconfig fragments (`@repo/typescript-config`)                               |

---

## Directory tree (high-level)

```text
x-clone/
├── .husky/                    # Git hooks (pre-commit, commit-msg)
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/       # zod-based env validation + config
│   │   │   ├── lib/          # db + utilities
│   │   │   ├── middlewares/  # auth, logging, rate-limit, errors, etc.
│   │   │   └── modules/      # auth, user, post, follow...
│   │   └── .env.example
│   ├── web/                  # Nuxt 3 app
│   ├── nuxt/                 # Nuxt 4 app
│   └── next/                 # Next.js app
├── packages/
│   ├── shared/               # shared zod schemas, types, utilities
│   ├── eslint-config/        # shared ESLint configs
│   └── typescript-config/    # shared tsconfig
├── docker/
│   └── Dockerfile.dev
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── README.md
```

---

## Getting started (local)

### Prerequisites

- **Node.js**: `>= 24.7.0` (enforced at the workspace root)
- **pnpm**: version is pinned in the root `package.json` (`packageManager`)
- **MongoDB**: local install or MongoDB Atlas or Docker

### Install

```bash
pnpm install
```

### Environment variables

#### API (`apps/api`)

Create `apps/api/.env` from `apps/api/.env.example`.

Required:

- **`MONGO_URI`**: Mongo connection string (e.g. `mongodb://localhost:27017/x-clone`)
- **`CLIENT_URL`**: allowed CORS origin (e.g. `http://localhost:5173`)
- **`JWT_SECRET`**: at least 12 chars

Common:

- **`PORT`**: defaults to `8080`
- **`JWT_EXPIRES_IN`**: defaults to `1d`
- **`COOKIE_MAX_AGE`**: defaults to 1 day (ms)

Rate limiting / crypto tuning (optional; see `.env.example`):

- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`
- `ARGON2_MEMORY`, `ARGON2_PASSES`, `ARGON2_PARALLELISM`, `ARGON2_TAG_LENGTH`, `ARGON2_ALGORITHM`, `ARGON2_VERSION`

#### Web (Nuxt 3) (`apps/web`)

Create `apps/web/.env` (or `.env.local`) from `apps/web/.env.example`.

- **`NUXT_PUBLIC_API_BASE_URL`**: e.g. `http://localhost:8080/api/v1`
- **`COOKIE_DOMAIN`**: used by Nuxt auth cookie config in production (dev defaults to `localhost`)
- **`NODE_ENV`**: `development` by default

#### Nuxt 4 (`apps/nuxt`) (optional)

- **`API_BASE`**: API base URL (defaults to `http://localhost:8080/api/v1`)

---

## Running the stack

### Recommended dev workflow

Run the API and Nuxt 3 app explicitly:

```bash
pnpm dev:api
pnpm dev:web
```

URLs (default):

- **API**: `http://localhost:8080`
  - **Swagger**: `http://localhost:8080/api-docs`
  - **Health**: `http://localhost:8080/health`
- **Web (Nuxt 3)**: `http://localhost:5173`

---

## API overview

The API mounts under **`/api/v1`**. Current route groups registered in `apps/api/src/modules/v1.routes.ts`:

- **`/api/v1/auth`**
- **`/api/v1/user`**
- **`/api/v1/post`**
- **`/api/v1/follow`**

---

## Scripts (root)

These are the scripts currently defined in the root `package.json`:

| Script           | What it does                         |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | `turbo run dev` across the workspace |
| `pnpm dev:api`   | `turbo run dev --filter=api`         |
| `pnpm dev:web`   | `turbo run dev --filter=web`         |
| `pnpm build`     | `turbo run build`                    |
| `pnpm build:api` | `turbo run build --filter=api`       |
| `pnpm build:web` | `turbo run build --filter=web`       |
| `pnpm lint`      | `turbo run lint`                     |
| `pnpm lint:api`  | `turbo run lint --filter=api`        |
| `pnpm lint:web`  | `turbo run lint --filter=web`        |

---

## Dev workflow & conventions

- **TypeScript**: used across apps/packages
- **ESLint**: shared configs from `packages/eslint-config`
- **Git hooks**: Husky + nano-staged (pre-commit) + Commitlint (commit-msg)

---

## License

MIT — see [LICENSE](LICENSE).
