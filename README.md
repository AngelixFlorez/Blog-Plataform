# Blog-Plataform

**Full-stack blog platform with rich text editing, social interactions, and a modern UI**  
Built with React 18 · Spring Boot 4 · JPA · PostgreSQL · JWT Auth

[![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev) [![Spring Boot 4](https://img.shields.io/badge/Spring_Boot-4-6DB33F?logo=springboot&logoColor=white)](https://spring.io) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Java 21](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://jdk.java.net/21) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org) [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com)

---

## ✨ Highlights

Feature | Description
---|---
📝 **Rich Text Editor** | TipTap-powered editor with headings, bold, italic, lists, and image uploads
❤️ **Social Interactions** | Like, bookmark, and comment on posts with real-time feedback
🔐 **JWT Authentication** | Secure login and registration with token-based auth
🏷️ **Categories & Tags** | Organize posts with hierarchical categories and multi-tag support
📄 **Draft System** | Save posts as drafts and publish when ready
🌗 **Dark / Light Mode** | System-aware theme toggle with smooth transitions
📱 **Fully Responsive** | Adaptive layout across mobile, tablet, and desktop
🎨 **NextUI Components** | Beautiful, accessible UI components with consistent design
🐳 **Docker Ready** | Docker Compose with PostgreSQL and Adminer for production-like deployments

---

## 🛠️ Tech Stack

### Frontend

Technology | Purpose
---|---
[React 18](https://react.dev) | UI library with TypeScript
[Vite 5](https://vite.dev) | Fast dev server & bundler
[React Router 7](https://reactrouter.com) | Client-side routing
[Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling
[NextUI 2](https://nextui.org) | React component library
[TipTap 2](https://tiptap.dev) | Rich text editor framework
[Lucide React](https://lucide.dev) | Modern icon set
[Axios](https://axios-http.com) | HTTP client for REST API calls
[React Hot Toast](https://react-hot-toast.com) | Toast notifications
[DOMPurify](https://github.com/cure53/DOMPurify) | HTML sanitization
[Framer Motion](https://motion.dev) | Animation library

### Backend

Technology | Purpose
---|---
[Spring Boot 4](https://spring.io) | Application framework and REST API
[Java 21](https://jdk.java.net/21) | Runtime
[Spring Data JPA](https://spring.io/projects/spring-data-jpa) | ORM and database access
[Hibernate](https://hibernate.org) | JPA implementation
[Spring Security](https://spring.io/projects/spring-security) | Authentication and authorization
[JWT (jjwt 0.12)](https://github.com/jwtk/jjwt) | Token-based auth
[MapStruct 1.6](https://mapstruct.org) | Object mapping between entities and DTOs
[Lombok](https://projectlombok.org) | Boilerplate code reduction
[ImageKit](https://imagekit.io) | Cloud-based image upload and CDN delivery
[H2](https://www.h2database.com) | In-memory database for development
[PostgreSQL](https://www.postgresql.org) | Production database

### Deployment

Technology | Purpose
---|---
[Docker](https://www.docker.com) | Containerized deployment with Docker Compose
[PostgreSQL 16 Alpine](https://hub.docker.com/_/postgres) | Lightweight production database
[Adminer](https://www.adminer.org) | Web-based database management UI

---

## 📁 Project Structure

```
Blog-Plataform/
├── frontend/                        # React SPA (Vite)
│   ├── public/
│   │   └── logo.png                 # App logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthContext.tsx       # Auth provider and context
│   │   │   ├── EmojiPicker.tsx       # Emoji selector component
│   │   │   ├── ErrorBoundary.tsx     # Error boundary wrapper
│   │   │   ├── KeepAlive.tsx         # Backend keep-alive ping
│   │   │   ├── NavBar.tsx            # Top navigation bar
│   │   │   ├── PostForm.tsx          # Post create/edit form (TipTap editor)
│   │   │   └── PostList.tsx          # Post listing with cards
│   │   ├── pages/
│   │   │   ├── CategoriesPage.tsx    # Category management
│   │   │   ├── DraftsPage.tsx        # User's draft posts
│   │   │   ├── EditPostPage.tsx      # Post creation and editing wrapper
│   │   │   ├── HomePage.tsx          # Main feed / landing page
│   │   │   ├── LoginPage.tsx         # Login form
│   │   │   ├── MyLikesPage.tsx       # User's liked posts
│   │   │   ├── MySavesPage.tsx       # User's bookmarked posts
│   │   │   ├── PostPage.tsx          # Post detail view (likes, comments, bookmarks)
│   │   │   ├── RegisterPage.tsx      # Registration form
│   │   │   └── TagsPage.tsx          # Tag management
│   │   ├── services/
│   │   │   └── apiService.ts         # Axios API client
│   │   ├── types/
│   │   │   └── api.ts                # TypeScript type definitions
│   │   ├── utils/
│   │   │   └── sanitize.ts           # DOMPurify wrapper
│   │   ├── App.css                   # Global Tailwind + ProseMirror styles
│   │   ├── App.tsx                   # Root component with routing
│   │   ├── index.css                 # Global styles (fonts, scrollbar)
│   │   └── main.tsx                  # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                          # Spring Boot API
│   └── src/main/
│       ├── java/com/devangeli/blog/
│       │   ├── BlogApplication.java  # Application entry point
│       │   ├── config/
│       │   │   ├── DataSourceConfig.java
│       │   │   ├── SecurityConfig.java
│       │   │   └── WebMvcConfig.java
│       │   ├── controllers/
│       │   │   ├── AuthController.java
│       │   │   ├── BookmarkController.java
│       │   │   ├── CategoryController.java
│       │   │   ├── CommentController.java
│       │   │   ├── LikeController.java
│       │   │   ├── PostController.java
│       │   │   ├── TagController.java
│       │   │   └── UploadController.java
│       │   ├── domain/
│       │   │   ├── entities/         # JPA entities (Post, User, Comment, etc.)
│       │   │   ├── dtos/             # Data transfer objects
│       │   │   └── CreatePostRequest.java
│       │   ├── mappers/              # MapStruct mappers
│       │   ├── repositories/         # Spring Data JPA repositories
│       │   ├── security/             # JWT filter and user details
│       │   └── services/             # Business logic layer
│       └── resources/
│           ├── application.properties
│           ├── application-dev.properties
│           └── application-prod.properties
│
├── Dockerfile                        # Docker build for backend
├── docker-compose.yml                # Full stack deployment
├── init.sql                          # Database initialization script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Java 21** JDK (or later)
- **Maven** (or use the included `mvnw` wrapper)
- A [PostgreSQL](https://www.postgresql.org) instance (for production) or use H2 (development)
- *(Optional)* An [ImageKit](https://imagekit.io) account for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/AngelixFlorez/Blog-Plataform.git
cd Blog-Plataform
```

### 2. Configure environment variables

Create `backend/.env` (or set system env vars):

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/blog
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=your-256-bit-secret-key-here-make-it-at-least-32-bytes-long
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

For development, the app defaults to an H2 in-memory database — no configuration needed.

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on `http://localhost:8080`.

### 4. Run the frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server starts on `http://localhost:5173` and proxies `/api` requests to the backend.

---

## 🐳 Docker Deployment

```bash
docker compose up --build
```

This starts three containers:

| Service | Port | Purpose |
|---------|------|---------|
| `blog` | `8080` | Spring Boot backend (serves both API and SPA) |
| `postgres` | `5432` | PostgreSQL database |
| `adminer` | `8081` | Web-based database admin UI |

---

## 🔗 API Reference

All API routes are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive JWT token |
| `GET` | `/api/v1/auth/profile` | Get current user profile (authenticated) |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/posts` | List all published posts |
| `GET` | `/api/v1/posts/drafts` | List current user's drafts (authenticated) |
| `GET` | `/api/v1/posts/{id}` | Get a single post by ID |
| `POST` | `/api/v1/posts` | Create a new post (authenticated) |
| `PUT` | `/api/v1/posts/{id}` | Update a post (authenticated, owner only) |
| `DELETE` | `/api/v1/posts/{id}` | Delete a post (authenticated, owner only) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/posts/{postId}/comments` | Get all comments for a post |
| `POST` | `/api/v1/posts/{postId}/comments` | Create a comment (authenticated) |
| `DELETE` | `/api/v1/posts/{postId}/comments/{commentId}` | Delete a comment (authenticated, owner only) |

### Social

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/posts/{postId}/like` | Toggle like on a post (authenticated) |
| `GET` | `/api/v1/posts/{postId}/like` | Get like status for current user (authenticated) |
| `GET` | `/api/v1/likes` | List all posts liked by current user (authenticated) |
| `POST` | `/api/v1/posts/{postId}/bookmark` | Toggle bookmark on a post (authenticated) |
| `GET` | `/api/v1/posts/{postId}/bookmark` | Get bookmark status for current user (authenticated) |
| `GET` | `/api/v1/bookmarks` | List all posts bookmarked by current user (authenticated) |

### Categories & Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | List all categories |
| `POST` | `/api/v1/categories` | Create a category (authenticated) |
| `GET` | `/api/v1/tags` | List all tags |
| `POST` | `/api/v1/tags` | Create a tag (authenticated) |

### Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/upload` | Upload an image file (authenticated) |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check (public) |

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

Made with 💜 by [AngelixFlorez](https://github.com/AngelixFlorez)
