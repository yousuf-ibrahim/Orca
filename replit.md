# Orca Financial Operations Platform

## Overview

Orca is an enterprise-grade financial operations platform for small investment firms, focusing on three core capabilities:

1. **KYC & Compliance**: Client onboarding, verification, risk assessment, and regulatory documentation with structured workflows
2. **Portfolio Monitoring**: Bloomberg-linked securities master, multi-custodian portfolio tracking, asset allocation analysis, and position-level P&L monitoring
3. **AI-Powered Intelligence**: Research Copilot for semantic document search, Portfolio Intelligence (health scores, risk alerts), and Compliance Automation (one-click report generation)

The platform enables efficient client onboarding and ongoing portfolio surveillance for hedge funds and asset managers, positioning as "the Addepar for small hedge funds" - enterprise infrastructure for boutique firms. AI tools are designed to augment human judgment, not replace it—all insights are auditable with source citations.

## User Preferences

Preferred communication style: Simple, everyday language.
Design aesthetic: Dark theme with Storm Neutral Scale (260 hue), Teal Accent Ladder (#3ea6b6), precision minimalism approach
Brand positioning: "Addepar for small hedge funds" - enterprise infrastructure for boutique firms

## Recent Changes

**Infrastructure Audit Feature (March 2026)**:
- Added `audits` table to PostgreSQL schema (id, created_at, firm_name, form_data, report jsonb)
- Built 5-step intake form at `/audit` — fund profile, systems inventory, pain points, open questions, review
- Server-side Anthropic API integration (`claude-sonnet-4-5`) at `POST /api/audit/generate`, stores results in DB
- Report display at `/audit/:id` with maturity gauge, risk cards, integration gaps table, effort/impact matrix, roadmap timeline
- Static demo report at `/audit/demo` — Silverline Capital Partners case study with credible Geneva↔IB findings
- Added "Infrastructure Audit" to sidebar (AI-Powered section, ClipboardCheck icon)
- Added "Sample Audit Report" button to Dashboard header, Infrastructure Audit quick action card
- Print CSS for `window.print()` report export (hides sidebar/nav)
- Installed `@anthropic-ai/sdk` package

## Phase 1 Implementation

**Design System Overhaul (January 2026)**:
- Implemented Storm Neutral Scale with 260 hue (--neutral-950 to --neutral-50)
- Added Teal Accent Ladder (--teal-900 to --teal-100) for primary colors
- Created semantic status colors: success (158 64% 52%), warning (38 92% 55%), error (0 72% 55%), info (199 89% 55%)
- Added supporting colors: ember (24 95% 66%), lime (158 64% 80%)
- Refined typography with -0.015em letter-spacing, optimized text rendering
- Softer, layered shadow system (shadow-2xs through shadow-2xl)
- Added utility classes: transition-smooth, gradient-hero, glass, skeleton-loading, glow-primary, text-gradient

**Phase 1 Foundation Features**:
- Securities Master page (`/securities`) with search, filter, and table view
- CSV Import pipeline (`/securities/import`) with validation and progress tracking
- Enhanced Portfolio Detail page with position-level P&L, asset allocation charts, custodian breakdown
- Updated AppSidebar with Database icon for Securities navigation
- Consistent p-6 lg:p-8 spacing across all main pages

## Strategic Direction (Hedgineer-Inspired)

Orca is modeled after Hedgineer's comprehensive approach but simplified for faster deployment:
- **Securities Master**: Multi-identifier repository with custom tagging (CSV-first, Bloomberg later)
- **Portfolio Hub**: Position tracking, P&L, allocations (CSV-first, OMS later)
- **Research Workspace**: Coverage tracker, notes, company pages (rule-based first, AI search later)
- **Investor Reporting**: Template-based LP letters and reports (manual first, scheduled later)
- **Compliance Center**: KYC workflows, audit trails, regulatory reports
- **AI Intelligence**: Rule-based health scores and alerts (LLM integration later)

Philosophy: 80% of value from 20% of features. Works standalone with CSV uploads, integrates later.
See ORCA_BUILD_PLAN.md for full phased roadmap.

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

**AI-Powered Intelligence Domain**:
- **Research Copilot** (`/research`): Semantic search across IC notes, memos, and research documents. Natural language queries with AI-synthesized answers and source citations.
- **Portfolio Health Widget**: Automated health scoring based on P&L, leverage, and concentration metrics with AI-generated alerts and recommendations.
- **Risk Insights Widget**: Scenario analysis, correlation warnings, and factor exposure insights for portfolio risk management.
- **Compliance Reports** (`/compliance/reports`): One-click generation of regulatory filings (DFSA quarterly), LP performance letters, audit trail exports, and KYC status summaries.

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