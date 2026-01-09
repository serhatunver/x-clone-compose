# X Clone - Full Stack Social Media Application

A full-stack social media application with a RESTful API backend and a Nuxt.js frontend. The project is containerized with Docker Compose for development and deployment.

## Demo

https://github.com/user-attachments/assets/274fadfb-362a-4322-bf7f-c307b41ddbba

## Architecture

- **Backend**: Express.js REST API with MongoDB
- **Frontend**: Nuxt.js 3 SPA with Vue 3
- **Containerization**: Docker Compose
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with Bearer tokens

## Tech Stack

### Backend

- **Runtime**: Node.js 20
- **Framework**: Express.js 4.21
- **Language**: TypeScript 5.5
- **Database**: MongoDB with Mongoose 8.5
- **Authentication**: JSON Web Tokens (JWT) with bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Package Manager**: pnpm 8.15
- **Development Tools**: tsx for TypeScript execution

### Frontend

- **Framework**: Nuxt.js 3.14
- **Language**: TypeScript 5.7
- **UI Library**: Vue 3 with Composition API
- **Styling**: Tailwind CSS 6.12
- **Component Library**: shadcn-nuxt
- **State Management**: Pinia 2.3 with persisted state plugin
- **Form Validation**: VeeValidate with Zod schemas
- **Authentication**: @sidebase/nuxt-auth
- **Icons**: Lucide Vue Next
- **Package Manager**: pnpm 10.2

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB
- **Networking**: Docker bridge network

## Features

### Authentication

- User registration with email and username validation
- Login with JWT token generation
- Protected routes with Bearer token verification
- Current user endpoint

### Posts

- Create, read, and delete posts
- Like/unlike posts
- Comment on posts (replies stored as posts with replyTo reference)
- Feed filtering: all posts, following-only, user-specific, and liked posts
- Post detail pages with comment threads

### User Management

- User profiles with unique usernames
- Follow/unfollow with bidirectional relationships
- User discovery and suggested users algorithm (not implemented yet)
- Profile fields: bio, profile image, cover image, link
- Follower and following counts

### Notifications (not implemented yet)

- Notification system infrastructure with MongoDB schema
- Support for follow and like notification types
- Read/unread status tracking
- Timestamp-based notification ordering

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Git
- pnpm (for local development without Docker)

## Installation & Setup

### Using Docker Compose (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd x-clone-compose
```

2. Start all services:

```bash
docker compose up --build
```

This starts:

- MongoDB on port 37017
- Backend API on port 3000
- Frontend application on port 5173
- Swagger API documentation at http://localhost:3000/api-docs

3. Access the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs
- MongoDB: localhost:37017

### Local Development (Without Docker)

#### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the backend directory:

```
NODE_ENV=development
JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/x-clone
```

4. Ensure MongoDB is running locally

5. Start the development server:

```bash
pnpm watch
```

The backend will run on http://localhost:3000

#### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

The frontend will run on http://localhost:5173

## Development

### Docker Compose Development Mode

The Docker Compose configuration includes hot-reload support:

- **Backend**: File changes in `./backend/src` are automatically synced and trigger rebuilds
- **Frontend**: File changes in `./frontend` are automatically synced with Nuxt HMR
- **Package Changes**: Changes to `package.json` files trigger container rebuilds

### Backend Development

- **Watch Mode**: `pnpm watch` - Auto-reloads on file changes
- **Debug Mode**: `pnpm debug` - Runs with Node.js inspector on port 9229
- **Linting**: `pnpm lint` - Run ESLint
- **Formatting**: `pnpm prettier` - Format code with Prettier

### Frontend Development

- **Development Server**: `pnpm dev` - Nuxt dev server with HMR on port 5173
- **Build**: `pnpm build` - Production build
- **Preview**: `pnpm preview` - Preview production build locally
- **Formatting**: `pnpm prettier` - Format code with Prettier

### API Development

Swagger UI is available at `/api-docs` for API testing and documentation.

API routes:
- `/api/v1/auth` - Authentication endpoints
- `/api/v1/user` - User management endpoints
- `/api/v1/post` - Post management endpoints

## Project Structure

```
x-clone-compose/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app entry point
│   │   ├── auth/                  # Authentication module
│   │   │   ├── controller.ts      # Auth controllers
│   │   │   └── routes.ts          # Auth routes
│   │   ├── db/
│   │   │   └── connectMongo.ts    # MongoDB connection
│   │   ├── middleware/
│   │   │   └── protectRoute.ts    # JWT authentication middleware
│   │   ├── posts/                 # Posts module
│   │   │   ├── controller.ts      # Post controllers
│   │   │   ├── model.ts           # Post Mongoose model
│   │   │   └── routes.ts          # Post routes
│   │   ├── users/                 # Users module
│   │   │   ├── controller.ts      # User controllers
│   │   │   ├── model.ts           # User Mongoose model
│   │   │   └── routes.ts          # User routes
│   │   ├── notifications/         # Notifications module
│   │   │   └── model.ts           # Notification model
│   │   ├── lib/
│   │   │   └── utils/
│   │   │       └── generateToken.ts # JWT token generation
│   │   ├── types/
│   │   │   └── types.d.ts         # TypeScript type definitions
│   │   └── swagger.ts             # Swagger configuration
│   ├── Dockerfile.dev             # Backend Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.js
├── frontend/
│   ├── components/                # Vue components
│   │   ├── home/                  # Home page components
│   │   ├── layout/                # Layout components
│   │   ├── profile/               # Profile components
│   │   └── ui/                    # shadcn-nuxt UI components
│   ├── pages/                     # Nuxt pages (file-based routing)
│   │   ├── [username]/            # Dynamic user profile routes
│   │   ├── home.vue               # Home feed page
│   │   ├── login.vue              # Login page
│   │   └── register.vue           # Registration page
│   ├── stores/                    # Pinia stores
│   │   ├── posts.ts               # Posts state management
│   │   └── user.ts                # User state management
│   ├── layouts/                   # Nuxt layouts
│   ├── assets/                    # Static assets
│   ├── middleware/                # Nuxt middleware
│   ├── plugins/                   # Nuxt plugins
│   ├── nuxt.config.ts             # Nuxt configuration
│   ├── Dockerfile.dev             # Frontend Dockerfile
│   └── package.json
└── docker-compose.yml              # Docker Compose configuration
```

## Environment Variables

### Backend

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://mongodb:27017/x-clone
```

### Frontend

Configure in `nuxt.config.ts` or via environment variables:

```env
NODE_ENV=development
NUXT_PORT=5173
PORT=5173
```

## Docker Configuration

### Services

- **mongodb**: MongoDB database
  - Port: 37017 (host) -> 27017 (container)
  - Network: node-network

- **backend**: Express.js API
  - Ports: 3000 (API), 9229 (debugging)
  - Hot reload: Enabled via Docker Compose watch
  - Depends on: mongodb

- **frontend**: Nuxt.js application
  - Ports: 5173 (app), 24678 (HMR)
  - Hot reload: Enabled via Docker Compose watch
  - Depends on: backend

### Networks

All services communicate via Docker bridge network (`node-network`).

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user (protected)

### Posts

- `GET /api/v1/post/all` - Get all posts
- `GET /api/v1/post/following` - Get posts from followed users
- `GET /api/v1/post/user/:username` - Get user's posts
- `GET /api/v1/post/likes/:username` - Get user's liked posts
- `GET /api/v1/post/:postId` - Get single post with comments
- `POST /api/v1/post` - Create new post
- `POST /api/v1/post/like/:postId` - Like/unlike post
- `POST /api/v1/post/comment/:postId` - Comment on post
- `DELETE /api/v1/post/:postId` - Delete post

### Users

- `GET /api/v1/user/profile/:username` - Get user profile
- `GET /api/v1/user/suggested` - Get suggested users to follow
- `POST /api/v1/user/follow/:id` - Follow/unfollow user
- `POST /api/v1/user/update` - Update user profile

## Database Schema

MongoDB with Mongoose ODM. All schemas include automatic timestamps (`createdAt`, `updatedAt`).

### User Schema

**Collection Name**: `users`

**Fields**:

- `_id`: ObjectId (auto-generated)
- `username`: String (required, unique, indexed)
- `password`: String (required, bcrypt hashed)
- `email`: String (required, unique, indexed)
- `followers`: Array of ObjectId references to User
- `following`: Array of ObjectId references to User
- `profileImg`: String (default: empty)
- `coverImg`: String (default: empty)
- `bio`: String (default: empty, max 160 characters)
- `link`: String (default: empty)
- `likedPosts`: Array of ObjectId references to Post

**Virtual Fields**:

- `followersCount`: Number (computed)
- `followingCount`: Number (computed)
- `posts`: Array of Post documents (computed)
- `totalPosts`: Number (computed)

**Indexes**:

- Unique index on `username`
- Unique index on `email`
- Index on `followers` and `following` arrays

### Post Schema

**Collection Name**: `posts`

**Fields**:

- `_id`: ObjectId (auto-generated)
- `user`: ObjectId reference to User (required, autopopulated)
- `content`: String (required, max 280 characters)
- `image`: String (optional)
- `replyTo`: ObjectId reference to Post (optional, for comments)
- `likes`: Array of ObjectId references to User
- `reposts`: Array of ObjectId references to User
- `comments`: Array of ObjectId references to Post

**Plugins**:

- `mongoose-autopopulate`: Automatically populates user and replyTo fields

**Indexes**:

- Index on `user` field
- Index on `replyTo` field
- Index on `likes` array
- Compound index on `user` and `createdAt`

**Relationships**:

- One-to-Many: User → Posts
- One-to-Many: Post → Comments (self-referential via replyTo)
- Many-to-Many: Post ↔ Users (likes)

### Notification Schema

**Collection Name**: `notifications`

**Fields**:

- `_id`: ObjectId (auto-generated)
- `from`: ObjectId reference to User (required)
- `to`: ObjectId reference to User (required)
- `type`: String (required, enum: 'follow', 'like')
- `read`: Boolean (default: false)

**Indexes**:

- Index on `to` field
- Index on `read` field
- Compound index on `to` and `read`
- Compound index on `to` and `createdAt`

**Relationships**:

- Many-to-One: Notification → User (from and to)

### Database Relationships Summary

```
User ──< Post (one-to-many)
User ──< Notification (to) (one-to-many)
User ──< Notification (from) (one-to-many)
User ──< User (followers) (many-to-many via arrays)
User ──< User (following) (many-to-many via arrays)
Post ──< Post (comments) (one-to-many, self-referential)
Post ──< User (likes) (many-to-many via array)
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Note**: This project is developed for educational purposes.
