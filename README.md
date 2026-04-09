# X Clone

> A full-stack, X-style social feed demo: posts, likes, threaded replies, follows, and profiles — organized as a **pnpm + Turborepo monorepo**.

<p align="center">
  <strong>API</strong> (Express · MongoDB) &nbsp;·&nbsp; <strong>Web</strong> (Nuxt 3 · Vue 3)
</p>

## Demo

https://github.com/user-attachments/assets/274fadfb-362a-4322-bf7f-c307b41ddbba

---

## Project overview

**X Clone** is an monorepo that splits the backend and frontend into **`apps/api`** and **`apps/web`**, with shared tooling in **`packages/`**.

---

## Tech stack

| Layer             | Technologies                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Monorepo**      | [pnpm](https://pnpm.io/) workspaces · [Turborepo](https://turbo.build/)                                                                                                                    |
| **`apps/api`**    | Node.js 24 · TypeScript · Express 5 · Mongoose · Zod · [jose](https://github.com/panva/jose) (JWT) · Argon2 · Swagger UI · Pino · Vitest                                                   |
| **`apps/web`**    | Nuxt 3 · Vue 3 · TypeScript · Tailwind CSS · [shadcn-nuxt](https://www.shadcn-vue.com/) · Pinia · VeeValidate · Zod · [@sidebase/nuxt-auth](https://sidebase.io/nuxt-auth/) · Lucide icons |
| **Quality & Git** | ESLint · Prettier · [Husky](https://typicode.github.io/husky/) · [nano-staged](https://github.com/usualoma/nano-staged) · [Commitlint](https://commitlint.js.org/) (Conventional Commits)  |
| **Data**          | MongoDB                                                                                                                                                                                    |
| **Containers**    | Docker Compose · `docker/Dockerfile.dev` (monorepo-aware)                                                                                                                                  |

---

## Monorepo structure

| Path                         | Role                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `apps/api`                   | REST API (`/api/v1`), auth, posts, users, follow relations, Swagger at `/api-docs`. |
| `apps/web`                   | Nuxt 3 app: pages, layouts, components, Pinia stores, server middleware.            |
| `packages/eslint-config`     | Shared ESLint presets (`api.js`, `web.js`).                                         |
| `packages/typescript-config` | Shared `tsconfig` fragments for apps.                                               |
| `docker/`                    | Development image used by Compose (root `pnpm install`, run via `pnpm --filter`).   |

### Directory tree

```text
x-clone-compose/
├── .husky/                    # Git hooks (pre-commit, commit-msg)
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/        # env validation, app config
│   │   │   ├── lib/           # db, logger, auth helpers
│   │   │   ├── middlewares/   # auth, rate limit, errors, validation
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── follow/
│   │   │   │   ├── notification/
│   │   │   │   ├── post/
│   │   │   │   └── user/
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   └── swagger.ts
│   │   └── package.json
│   └── web/
│       ├── assets/
│       ├── components/
│       ├── composables/
│       ├── layouts/
│       ├── middleware/
│       ├── pages/
│       ├── plugins/
│       ├── server/
│       ├── stores/
│       ├── nuxt.config.ts
│       └── package.json
├── docker/
│   └── Dockerfile.dev         # Monorepo dev image (Compose)
├── packages/
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js** 24.x (required by `apps/api`)
- **pnpm** (version pinned in root `package.json` via `packageManager`)
- **MongoDB** running locally _or_ use Docker Compose (includes MongoDB)

### 1. Clone & install

```bash
git clone <your-fork-or-repo-url>.git
cd x-clone-compose
pnpm install
```

### 2. Environment variables

| App | File                            | Notes                                                                                                                       |
| --- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| API | `apps/api/.env`                 | Copy from `apps/api/.env.example`. Set `MONGO_URI`, `JWT_SECRET` (≥ 12 chars), `CLIENT_URL` (e.g. `http://localhost:5173`). |
| Web | `apps/web/.env` or `.env.local` | Copy from `apps/web/.env.example`. Set `NUXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:3000/api/v1`).                    |

### 3. Run everything (local)

With MongoDB available at the URI in `apps/api/.env`:

```bash
pnpm dev
```

| Service | URL                                                              |
| ------- | ---------------------------------------------------------------- |
| Web     | [http://localhost:5173](http://localhost:5173)                   |
| API     | [http://localhost:3000](http://localhost:3000)                   |
| Swagger | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) |

Run a single app:

```bash
pnpm dev:api
pnpm dev:web
```

### 4. Docker Compose (optional)

Build and start API, web, and MongoDB:

```bash
docker compose up --build
```

- MongoDB is exposed on host port **37017** → container `27017`.
- Compose injects API env vars; override `JWT_SECRET` in production.
- **Watch mode** (Compose Watch): `docker compose watch` syncs `apps/api/src` and `apps/web` into containers for faster iteration.

---

## Root scripts (Turborepo)

All of these run from the **repository root** and delegate to `turbo run`.

| Script                              | Description                                                          |
| ----------------------------------- | -------------------------------------------------------------------- |
| `pnpm dev`                          | Runs `dev` in all packages/apps that define it (API + Web together). |
| `pnpm dev:api` / `pnpm dev:web`     | `turbo run dev` filtered to `api` or `web`.                          |
| `pnpm build`                        | Production builds for all apps (`dist/`, `.output/`, etc.).          |
| `pnpm build:api` / `pnpm build:web` | Filtered builds.                                                     |
| `pnpm lint`                         | ESLint across the workspace.                                         |
| `pnpm lint:api` / `pnpm lint:web`   | Filtered lint.                                                       |

---

## Pre-commit hooks (Husky + nano-staged + Commitlint)

| Hook           | File                | What runs                                                                                                                                                                                                                                    |
| -------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **pre-commit** | `.husky/pre-commit` | `pnpm exec nano-staged` — lints **only staged** files using the mappings in root `package.json` → `nano-staged`. Staged `apps/api` TS/JS hits `turbo run lint --filter=api`; staged `apps/web` TS/JS/Vue hits `turbo run lint --filter=web`. |
| **commit-msg** | `.husky/commit-msg` | `commitlint` with `@commitlint/config-conventional` — commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat(web): add login form`).                                                           |

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE).

---

**Note:** Built for learning.
