# Orca Financial Operations Platform

## Overview

Orca is an enterprise-grade financial operations platform designed for small investment firms, focused on KYC (Know Your Customer) and client onboarding workflows. The application provides compliance officers and financial professionals with tools to manage client verification, risk assessment, and regulatory documentation in a streamlined, data-intensive interface.

**Core Purpose**: Enable investment firms to efficiently onboard clients while maintaining compliance with financial regulations through structured KYC processes, risk band classification, and document management.

**Technology Stack**:
- Frontend: React with TypeScript, Vite build system
- UI Framework: shadcn/ui components with Radix UI primitives
- Styling: Tailwind CSS with custom design system
- Backend: Express.js server
- Database: PostgreSQL via Drizzle ORM and Neon serverless
- State Management: TanStack Query (React Query)
- Routing: Wouter (lightweight client-side routing)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component-Based Design**: The application follows a modular component architecture with clear separation between:
- **UI Components** (`client/src/components/ui/`): Atomic, reusable components built on Radix UI primitives (buttons, cards, forms, dialogs, etc.)
- **Feature Components** (`client/src/components/`): Business-logic components (AppSidebar, ClientTable, KYCFormStepper, DashboardStats, StatusBadge)
- **Pages** (`client/src/pages/`): Route-level components representing distinct views (Dashboard, NewKYC, ClientDetail, Landing)

**Design System Philosophy**: The application adopts Carbon Design System principles adapted for financial services, prioritizing:
- Information density without overwhelming users
- Clear visual hierarchy for compliance-critical information
- Professional trustworthiness through color palette and typography
- Status-driven UI with distinct visual states (draft, submitted, approved, rejected, etc.)

**Theming**: Dark-mode-first approach with light mode support via CSS custom properties. Theme switching managed through React Context (ThemeProvider).

**State Management Strategy**:
- Server state: TanStack Query for data fetching, caching, and synchronization
- UI state: React hooks and component state
- Global state: React Context for theme and sidebar state

**Routing**: Client-side routing implemented with Wouter, a lightweight alternative to React Router. Routes defined declaratively in `App.tsx`.

### Backend Architecture

**Server Framework**: Express.js with TypeScript, structured as an ESM (ES Module) application.

**API Pattern**: RESTful API design with routes prefixed under `/api`. Currently using a modular routing system (`server/routes.ts`) that registers endpoints to the Express app.

**Storage Layer**: Abstraction pattern via `IStorage` interface allowing swappable storage implementations:
- **Current**: In-memory storage (`MemStorage`) for development
- **Intended**: Database-backed storage via Drizzle ORM

**Database Schema** (Drizzle ORM):
- PostgreSQL database accessed through Neon serverless
- Current schema: `users` table with UUID primary keys
- Schema defined in `shared/schema.ts` with Zod validation integration
- Migrations managed via Drizzle Kit

**Development vs Production**:
- Development: Vite dev server with HMR, proxied through Express
- Production: Static asset serving from `dist/public`

### Data Model & Business Logic

**KYC Workflow States**:
- `DRAFT`: Initial state, application in progress
- `SUBMITTED`: Application completed and submitted for review
- `UNDER_REVIEW`: Compliance officer actively reviewing
- `APPROVED`: Client verified and approved
- `REJECTED`: Application denied
- `REQUIRES_UPDATE`: Additional information needed from client

**Risk Classification**:
- `LOW`: Standard risk profile
- `MEDIUM`: Moderate risk requiring additional scrutiny
- `HIGH`: High-risk client requiring enhanced due diligence

**Client Data Structure**: Clients contain personal information, business details, KYC status, risk band, document references, and assignment information.

**Document Management**: File upload and verification system for identity documents, proof of address, and corporate documentation.

### Build & Deployment

**Build Process**:
1. Frontend: Vite bundles React application to `dist/public`
2. Backend: esbuild bundles Express server to `dist/index.js`
3. Single-command build script handles both

**Development Workflow**:
- Hot module replacement via Vite
- TypeScript type checking without emission
- Drizzle migrations via `db:push` command

**Monorepo Structure**: Organized as a unified repository with shared TypeScript types between client and server via `shared/` directory.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless component primitives for accessible, unstyled UI components (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-styled component library built on Radix UI, configured for the project
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating component variants
- **tailwind-merge & clsx**: CSS class composition utilities

### Data & Forms
- **React Hook Form**: Form state management with `@hookform/resolvers` for validation
- **Zod**: Schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod schemas
- **TanStack Query**: Server state management and data fetching

### Database & Backend
- **@neondatabase/serverless**: PostgreSQL serverless driver optimized for edge environments
- **Drizzle ORM**: Type-safe ORM for PostgreSQL with migration support
- **Express**: Web server framework
- **ws**: WebSocket library for Neon database connections

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Static type checking
- **esbuild**: JavaScript bundler for production builds
- **Replit Plugins**: Development environment integration (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer)

### Utilities
- **date-fns**: Date manipulation library
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider component

### Integration Points
- **Database**: Neon PostgreSQL (serverless, connection pooling via `@neondatabase/serverless`)
- **Session Management**: Prepared for `connect-pg-simple` integration (PostgreSQL session store)
- **WebSocket**: Configuration for real-time database connections via `ws` library

### Design Resources
- **Google Fonts**: Inter (primary interface font), JetBrains Mono (monospace for codes/IDs)
- **Custom Color System**: HSL-based color tokens for theme switching
- **Carbon Design System**: Inspiration for enterprise data application patterns