# Hamrah Bazar - Online Marketplace for Afghanistan

## Overview

Hamrah Bazar (همراه بازار) is a multilingual online marketplace platform designed for Afghanistan, supporting Farsi (Dari), Pashto, and English. The application enables users to browse and post classified listings across various categories including vehicles, real estate, electronics, jewelry, clothing, and services. The platform emphasizes trust, clarity, and mobile-first design patterns inspired by successful marketplace platforms like OLX and Divar.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router

**UI Component System:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library configured with "new-york" style
- Tailwind CSS for utility-first styling with custom HSL-based color system
- Support for light and dark themes with CSS variables

**State Management:**
- React Context API for global state (Language, Theme, Authentication)
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks

**Internationalization:**
- Custom LanguageContext supporting three languages: Farsi (fa), Pashto (ps), and English (en)
- Bi-directional text support (RTL for Farsi/Pashto, LTR for English)
- Translation keys stored in LanguageContext with fallback mechanism

**Design System:**
- Mobile-first responsive approach
- Custom color palette with deep teal primary and warm orange accent colors
- Gradient-based aesthetic for category and city selection circles
- Vazirmatn font for Persian/Pashto, Inter for English

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js for the HTTP server
- TypeScript throughout with ESM module system
- Development server with custom logging middleware

**API Design:**
- RESTful API pattern (routes prefixed with `/api`)
- Centralized route registration in `server/routes.ts`
- Error handling middleware with status code propagation
- JSON request/response with automatic parsing

**Data Layer:**
- Storage abstraction interface (`IStorage`) in `server/storage.ts`
- In-memory implementation (`MemStorage`) for development/prototype
- Prepared for Drizzle ORM integration with PostgreSQL
- UUID-based primary keys using `gen_random_uuid()`

**Database Schema (Drizzle ORM):**
- `users` table: id, name, phone (unique), password, two-factor authentication fields
- `listings` table: id, title, description, price, category, city, imageUrl, userId (foreign key), timestamps
- Zod schema validation using `drizzle-zod` for type-safe inserts

### Data Storage Solutions

**Current Implementation:**
- In-memory Map-based storage for rapid prototyping
- Mock data generators for categories, cities, and listings

**Planned Implementation:**
- PostgreSQL database (configured via Neon serverless driver)
- Drizzle ORM for type-safe database queries
- Connection pooling via `@neondatabase/serverless`
- Migration management through `drizzle-kit`

**Session Management:**
- Prepared for `connect-pg-simple` for PostgreSQL-backed sessions
- Cookie-based session storage strategy

### Authentication and Authorization

**Authentication Strategy:**
- Phone number-based authentication (Afghan context)
- Password hashing (implementation pending)
- Two-factor authentication support via SMS codes with expiry
- Session persistence in localStorage (client-side, prototype phase)

**Authorization:**
- User context via AuthContext
- Protected routes checking `isAuthenticated` status
- User ID association with listings for ownership verification

**Security Considerations:**
- Credentials sent via JSON over HTTPS
- Two-factor expiry mechanism prevents code reuse
- Input validation via Zod schemas

### External Dependencies

**Third-Party Libraries:**
- **Radix UI:** Comprehensive set of unstyled, accessible UI primitives (@radix-ui/react-*)
- **TanStack Query:** Server state management with automatic caching and refetching
- **Tailwind CSS:** Utility-first CSS framework with PostCSS processing
- **Wouter:** Lightweight routing (alternative to React Router)
- **date-fns:** Date manipulation and formatting
- **Embla Carousel:** Touch-enabled carousel component
- **cmdk:** Command palette component
- **class-variance-authority:** Utility for managing component variants
- **Lucide React:** Icon library

**Database & ORM:**
- **Drizzle ORM:** TypeScript ORM with schema-first approach
- **@neondatabase/serverless:** PostgreSQL driver for Neon serverless database
- **drizzle-zod:** Zod schema generation from Drizzle schemas

**Development Tools:**
- **Vite Plugins:** Runtime error overlay, dev banner, cartographer (Replit-specific)
- **TSX:** TypeScript execution for development server
- **esbuild:** Fast JavaScript bundler for production builds

**Build & Deployment:**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.js`
- Static file serving in production mode
- Environment-specific configuration via `NODE_ENV`