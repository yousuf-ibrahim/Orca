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

## Recent Changes (October 20, 2025)

- **Database Migration**: Converted from in-memory storage to PostgreSQL with full multi-tenant schema
- **API Implementation**: Built complete REST API for clients, KYC applications, and documents with validation
- **Frontend Integration**: Connected Dashboard, NewKYC form, and ClientDetail pages to real database
- **Audit System**: Implemented audit logging for all create operations
- **Data Seeding**: Created seed script with demo firm "Acme Capital Partners" and 4 sample clients

## User Preferences

Preferred communication style: Simple, everyday language.
Design aesthetic: Dark theme (#19171f background) with teal accent (#3ea6b6), Bloomberg Terminal inspired
Brand positioning: "Addepar for small hedge funds" - enterprise infrastructure for boutique firms

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

**Routing**: Client-side routing implemented with Wouter. Active routes:
- `/` - Landing page with firm positioning and logo carousels
- `/dashboard` - Main application view with stats and client table
- `/kyc/new` - Multi-step KYC form for new client onboarding
- `/client/:id` - Client detail view with KYC history and approval actions

### Backend Architecture

**Server Framework**: Express.js with TypeScript, structured as an ESM (ES Module) application.

**API Pattern**: RESTful API design with routes prefixed under `/api`. Modular routing system (`server/routes.ts`) provides:
- **Client Management**: `GET /api/clients`, `POST /api/clients`, `GET /api/clients/:id`, `PATCH /api/clients/:id`
- **KYC Applications**: `POST /api/kyc-applications`, `GET /api/clients/:id/kyc`, `PATCH /api/kyc-applications/:id`
- **Documents**: `POST /api/kyc-applications/:id/documents`, `GET /api/kyc-applications/:id/documents`
- **Dashboard**: `GET /api/dashboard/stats` (aggregated metrics)
- **Validation**: Request body validation via Zod schemas from `drizzle-zod`
- **Audit Logging**: All create operations logged with user context

**Storage Layer**: Database-backed storage (`DbStorage`) implemented via `IStorage` interface:
- **Implementation**: PostgreSQL storage via Drizzle ORM and Neon serverless
- **CRUD Operations**: Full CRUD for firms, users, clients, KYC applications, documents, and audit logs
- **Audit Trail**: All create operations automatically logged to audit_logs table

**Database Schema** (Drizzle ORM):
- PostgreSQL database accessed through Neon serverless
- **Tables**: `firms`, `users`, `clients`, `kyc_applications`, `documents`, `audit_logs`
- **Multi-Tenant Design**: All entities scoped by `firmId` for data isolation
- Schema defined in `shared/schema.ts` with Zod validation integration
- Migrations managed via Drizzle Kit (`npm run db:push`)
- Seed data script creates demo firm and clients (`server/db/seed.ts`)

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

**Client Data Structure** (`clients` table):
- Personal: name, email, phone, type (individual/institutional/family_office/corporate)
- Compliance: status (draft/submitted/under_review/approved/rejected/requires_update)
- Risk: riskScore (0-100), computed risk band (low/medium/high)
- Metadata: firmId, createdAt, updatedAt

**KYC Application Structure** (`kyc_applications` table):
- References: clientId, userId (assigned compliance officer)
- Status: draft/submitted/under_review/approved/rejected/requires_update
- Data: personalInfo (JSON), businessInfo (JSON), complianceInfo (JSON)
- Review: reviewedAt, reviewNotes

**Document Management** (`documents` table):
- Metadata: kycApplicationId, type, filename, filesize, mimetype
- Storage: url (S3/blob storage reference)
- Verification: verified (boolean), verifiedBy (userId), verifiedAt

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