# CineScope - Modern Movie Platform & Social Journal

CineScope is a full-stack movie platform designed for film enthusiasts to discover, organize, and collaborate on movie collections. Built with Next.js 15, TypeScript, and MongoDB, it offers a seamless experience from browsing a global database of millions of movies to managing private collaborative lists with friends.

---

## 🚀 Key Features

### 🎬 Movie Discovery & Management
- **Global Catalog**: Integration with **OMDB API** allows users to search and view details for millions of movies dynamically.
- **Curated Database**: A local MongoDB collection for featured and platform-specific movie data.
- **Admin Dashboard**: Specialized tools for admins to import movies from OMDB, manage the catalog (CRUD), and feature titles on the homepage.

### 📚 Custom Movie Collections (Social Journaling)
- **Personal Lists**: Create custom lists like "Friday Night Horror" or "2024 Must Watch."
- **Collaboration (Invite Links)**: Generate unique invite tokens to allow friends to collaborate on your collections in real-time.
- **Privacy Controls**: Toggle collections between **Public** (viewable by the community) and **Private**.

### 👤 User Experience
- **Dynamic Profiles**: Track liked movies, watched history, and personal reviews in a clean, modern dashboard.
- **Interactive Reviews**: Write, edit, and read community reviews for any movie.
- **Advanced Auth**: Secure credentials-based authentication with profile management (name and password updates).
- **Dark Mode Aesthetic**: A premium "Gold & Dark" UI built with Tailwind CSS v4 and Lucide icons.

---

## 🏗️ Technical Architecture

CineScope follows a **Modern Layered MVC Pattern** adapted for the Next.js App Router:

### 1. View Layer (Frontend)
- **React Server Components (RSC)**: Used for heavy data fetching (Profile, Movie Details) to ensure sub-second page loads and optimal SEO.
- **Client Components**: Used for interactive states (Search, Modals, Forms) to provide a snappy, app-like feel.
- **Styling**: Tailwind CSS v4 utilizing CSS variables for a consistent theme and glassmorphism effects.

### 2. API Layer (Backend)
- **Route Handlers**: Next.js API routes act as the Controller layer, handling requests, validating sessions, and communicating with the Database.
- **NextAuth.js**: Implements the security layer, managing JWT-based sessions and role-based access control (Admin vs. User).

### 3. Service Layer (Lib)
- **Dynamic Data Strategy**: A custom library handles data priority:
  1. Check **Local MongoDB** (Custom/Featured data).
  2. Fallback to **OMDB API** (Dynamic global data).
  3. Fallback to **Demo Data** (Development safety net).

### 4. Persistence Layer (Database)
- **MongoDB Atlas**: Cloud-hosted NoSQL database.
- **Mongoose ODM**: Provides schema validation and complex query support (e.g., `$or` queries for shared collections).

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB / Mongoose |
| **Auth** | NextAuth.js |
| **Icons** | Lucide React |
| **API** | OMDB API |
| **Styling** | Tailwind CSS v4 |

---

## 💡 Future Roadmap

- **Activity Feed**: A real-time notification system for collaborator updates.
- **AI Recommendations**: Personalized movie suggestions based on your collection history.
- **Social Profiles**: Public user profiles to discover collections from other cinephiles.
- **Advanced Filters**: Filter global search by IMDB rating, release decade, and runtime.

---

## 🛠️ Setup Instructions

1. **Clone the repo**
2. **Install dependencies**: `npm install`
3. **Set up .env**:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret
   OMDB_API_KEY=your_omdb_key
   ADMIN_EMAIL=admin@cinescope.local
   ADMIN_PASSWORD=Admin123!
   ```
4. **Run development server**: `npm run dev` (Port 3001)

---

Developed as a University Project for the Web Engineering Course.
