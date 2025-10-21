# Orca Financial Operations Platform

## Overview

Orca is an enterprise-grade financial operations platform for small investment firms, focusing on KYC (Know Your Customer) and client onboarding. It provides compliance officers and financial professionals with tools for client verification, risk assessment, and regulatory documentation through a streamlined, data-intensive interface. The platform's core purpose is to enable efficient client onboarding while ensuring compliance with financial regulations via structured KYC processes, risk band classification, and document management.

## User Preferences

Preferred communication style: Simple, everyday language.
Design aesthetic: Dark theme (#19171f background) with teal accent (#3ea6b6), Bloomberg Terminal inspired
Brand positioning: "Addepar for small hedge funds" - enterprise infrastructure for boutique firms

## System Architecture

### Frontend Architecture

The frontend uses React with TypeScript and Vite, built with shadcn/ui components on Radix UI primitives and styled with Tailwind CSS. It follows a modular, component-based design with clear separation between UI, feature, and page components. The design system is inspired by Carbon Design, prioritizing information density, clear visual hierarchy, and professional trustworthiness. It features a dark-mode-first approach with theme switching via React Context. State management utilizes TanStack Query for server state, React hooks for UI state, and React Context for global state. Wouter handles client-side routing.

### Backend Architecture

The backend is an Express.js server with TypeScript, structured as an ESM application. It implements a RESTful API, supporting core workflows like client and KYC application management, documents, and dashboard statistics, alongside comprehensive KYC workflows for wealth information, beneficial ownership, risk assessments, suitability assessments, client classification, RM notes, client approvals, and transaction monitoring. Key features include Zod schema validation, audit logging for all operations, and auto-updates for risk scores. The storage layer uses PostgreSQL via Drizzle ORM and Neon serverless, providing full CRUD operations for 14 tables with multi-tenant isolation. The database schema includes core tables for firms, users, clients, KYC applications, documents, and audit logs, plus additional tables for detailed KYC workflows. All entities are scoped by `firmId` for multi-tenancy.

### Data Model & Business Logic

The platform supports various KYC workflow states (DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, REQUIRES_UPDATE) and risk classifications (LOW, MEDIUM, HIGH). Client data includes personal, compliance, and risk information. KYC applications track submissions, status, and review details. Document management includes metadata, storage references, and verification status.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless component primitives.
- **shadcn/ui**: Pre-styled component library based on Radix UI.
- **Lucide React**: Icon library.
- **class-variance-authority**, **tailwind-merge**, **clsx**: CSS utilities.

### Data & Forms
- **React Hook Form**: Form state management with resolvers.
- **Zod**: Schema validation.
- **drizzle-zod**: Drizzle ORM and Zod integration.
- **TanStack Query**: Server state management and data fetching.

### Database & Backend
- **@neondatabase/serverless**: PostgreSQL serverless driver.
- **Drizzle ORM**: Type-safe ORM for PostgreSQL.
- **Express**: Web server framework.
- **ws**: WebSocket library.

### Development Tools
- **Vite**: Build tool and dev server.
- **TypeScript**: Static type checking.
- **esbuild**: JavaScript bundler.
- **Replit Plugins**: Development environment integration.

### Utilities
- **date-fns**: Date manipulation.
- **nanoid**: Unique ID generation.
- **wouter**: Lightweight routing library.
- **cmdk**: Command palette component.
- **embla-carousel-react**: Carousel component.

### Integration Points
- **Database**: Neon PostgreSQL.
- **Session Management**: Prepared for `connect-pg-simple`.
- **WebSocket**: Real-time database connections via `ws`.