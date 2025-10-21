# Orca Financial Operations Platform

## Overview

Orca is an enterprise-grade financial operations platform for small investment firms, focusing on two core capabilities:

1. **KYC & Compliance**: Client onboarding, verification, risk assessment, and regulatory documentation with structured workflows
2. **Portfolio Monitoring**: Bloomberg-linked securities master, multi-custodian portfolio tracking, asset allocation analysis, and position-level P&L monitoring

The platform enables efficient client onboarding and ongoing portfolio surveillance for hedge funds and asset managers, positioning as "the Addepar for small hedge funds" - enterprise infrastructure for boutique firms.

## User Preferences

Preferred communication style: Simple, everyday language.
Design aesthetic: Dark theme (#19171f background) with teal accent (#3ea6b6), Bloomberg Terminal inspired
Brand positioning: "Addepar for small hedge funds" - enterprise infrastructure for boutique firms

## System Architecture

### Frontend Architecture

The frontend uses React with TypeScript and Vite, built with shadcn/ui components on Radix UI primitives and styled with Tailwind CSS. It follows a modular, component-based design with clear separation between UI, feature, and page components. The design system is inspired by Carbon Design, prioritizing information density, clear visual hierarchy, and professional trustworthiness. It features a dark-mode-first approach with theme switching via React Context. State management utilizes TanStack Query for server state, React hooks for UI state, and React Context for global state. Wouter handles client-side routing.

### Backend Architecture

The backend is an Express.js server with TypeScript, structured as an ESM application. It implements a RESTful API supporting two major domains:

**KYC & Compliance Domain**: Client and KYC application management, documents, dashboard statistics, wealth information, beneficial ownership, risk assessments, suitability assessments, client classification, RM notes, client approvals, and transaction monitoring.

**Portfolio Monitoring Domain**: Securities master management, custodian management, portfolio lifecycle, and position tracking. Securities master includes Bloomberg identifiers (ISIN, CUSIP, ticker, Bloomberg ID, SEDOL), fixed income analytics (maturity, coupon, duration, credit rating), and risk metrics (PRR, beta). Portfolio system supports multi-custodian portfolios with real-time P&L tracking, asset allocation analysis, leverage metrics, and position-level holdings.

Key features include Zod schema validation, audit logging for all operations, and auto-calculated metrics. The storage layer uses PostgreSQL via Drizzle ORM and Neon serverless, providing full CRUD operations for 18+ tables with multi-tenant isolation. All entities are scoped by `firmId` for multi-tenancy.

### Data Model & Business Logic

**KYC Domain**: The platform supports various KYC workflow states (DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, REQUIRES_UPDATE) and risk classifications (LOW, MEDIUM, HIGH). Client data includes personal, compliance, and risk information. KYC applications track submissions, status, and review details. Document management includes metadata, storage references, and verification status.

**Portfolio Monitoring Domain**: 
- **Securities Master**: Central repository for all securities with multi-identifier support (ticker, ISIN, CUSIP, SEDOL, Bloomberg ID), asset class categorization (cash, fixed_income, equity, alternatives, structured_products), issuer information, and pricing data
- **Custodians**: Prime brokers, banks, and clearing firms with integration endpoints for live data feeds
- **Portfolios**: Client investment accounts with risk profiles, investment objectives, consolidated metrics (total market value, P&L, leverage ratios), and multi-custodian support
- **Positions**: Security-level holdings across custodians with quantity, cost basis, current price, market value, unrealized/realized P&L, allocation percentages, and income tracking

**Bloomberg Integration Readiness**: Securities master designed for Bloomberg Server API (SAPI) and EMSX API integration, with full support for Bloomberg identifiers and reference data fields.

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