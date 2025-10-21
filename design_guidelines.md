# Design Guidelines for Orca Financial Operations Platform

## Design Approach: Bloomberg Terminal for Hedge Funds

**Selected Approach**: Bloomberg Terminal aesthetic with Addepar-style widget system

**Rationale**: Orca targets small hedge funds and asset managers who need enterprise-grade portfolio monitoring. The design combines Bloomberg's information density and real-time market data presentation with Addepar's professional widget-based dashboards.

**Key Design Principles**:
- **Information Density**: Bloomberg Terminal inspired - maximum data in minimal space
- **Real-time Market Context**: Live market indices, sentiment indicators, and relevant news
- **Professional Trust**: Dark theme (#19171f) with teal accent (#3ea6b6) for financial services
- **Adjustable Widgets**: Addepar-style resizable widget grid for customizable dashboards
- **Clear Visual Hierarchy**: Sparkline charts, sentiment bars, and color-coded performance metrics

---

## Core Design Elements

### A. Color Palette (Bloomberg Terminal Inspired)

**Primary Theme** (Dark Mode First):
- Primary Accent: 183 51% 47% (#3ea6b6 - Teal, Bloomberg-style accent)
- Background: 264 15% 11% (#19171f - Deep charcoal, terminal black)
- Surface: 264 10% 15% (Elevated cards and widgets)
- Border: 264 8% 25% (Subtle widget divisions)
- Text Primary: 0 0% 98% (High contrast white)
- Text Secondary: 0 0% 70% (Muted information)

**Light Mode** (Optional):
- Primary Brand: 183 51% 47% (Teal accent maintained)
- Background: 0 0% 100% (Pure white)
- Surface: 210 20% 98% (Subtle gray for cards)
- Border: 214 20% 91% (Soft divisions)
- Text Primary: 222 47% 11% (High contrast)
- Text Secondary: 215 16% 47% (Supporting information)

**Status Colors** (Both modes):
- Success: 142 76% 36% (KYC approved, documents verified)
- Warning: 38 92% 50% (Pending review, requires attention)
- Destructive: 0 84% 60% (Rejected status, errors)
- Info: 199 89% 48% (In progress, informational states)

**Risk Band Indicators**:
- Low Risk: 142 71% 45%
- Medium Risk: 38 92% 50%
- High Risk: 0 84% 60%

### B. Typography

**Font Families**:
- Primary: Inter (via Google Fonts) - excellent for data-dense UIs
- Monospace: JetBrains Mono - for document IDs, reference numbers

**Scale**:
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body: text-base (16px)
- Labels: text-sm font-medium (14px)
- Helper Text: text-sm text-muted-foreground (14px)
- Captions: text-xs (12px)

**Hierarchy**: Use font weight (medium/semibold) over size variations for compact layouts

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-4, p-6
- Section spacing: space-y-6, space-y-8
- Card gaps: gap-4
- Form field spacing: space-y-4

**Dashboard Grid**:
- Sidebar: Fixed 256px (w-64) on desktop, collapsible on mobile
- Main content: max-w-7xl with px-6 py-8
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6

**Containers**:
- Forms: max-w-2xl for optimal readability
- Data tables: Full width within content area
- Modals: max-w-lg to max-w-3xl based on content

### D. Component Library

**Navigation**:
- Sidebar: Fixed left navigation with firm branding, role-based menu items, user profile footer
- Top bar: Breadcrumbs, search, notifications, user menu
- Active states: Primary color background with white text

**Forms**:
- Multi-step wizard with progress indicator (FormStepper component)
- Input fields: Consistent height (h-10), clear labels, helper text below
- Required indicators: Red asterisk on label
- Validation: Inline error messages in destructive color
- Field groups: Bordered sections with subtle background for logical grouping

**Data Display**:
- Tables: Striped rows, sortable headers, pagination, row actions menu
- Status badges: Rounded-full px-3 py-1 with appropriate status colors
- KYC cards: White/surface background, subtle shadow, clear status indicator
- Document list: File icon, name, upload date, status badge, action buttons

**Overlays**:
- Modals: Centered, backdrop blur, rounded-lg, shadow-xl
- Dropdowns: Border, shadow-md, rounded-md
- Tooltips: Dark background, white text, arrow pointer

**Buttons**:
- Primary actions: Solid primary color, white text
- Secondary: Outline variant
- Destructive: Destructive color for delete/reject actions
- Icon buttons: Square, subtle hover state for table actions

### E. Animations

Use sparingly - only for feedback and transitions:
- Page transitions: None (instant navigation for data apps)
- Hover states: Subtle scale or opacity change (100-200ms)
- Loading states: Spinner or skeleton screens
- Toast notifications: Slide in from top-right

---

## Application-Specific Guidelines

**Dashboard Layout** (Widget-Based):
- Market Indices Widget: Top row with S&P, NASDAQ, Dow, VIX showing sparkline charts and real-time changes
- Market Sentiment Widget: Bullish/bearish indicator with visual sentiment bars (Perplexity-style)
- Portfolio Stats Widget: Total AUM, Unrealized P&L, Portfolio count
- Market Summary Widget: Portfolio-relevant news filtered by holdings
- Equity Sectors Widget: Sector performance with color-coded gains/losses
- Top Holdings Widget: Gainers/Losers tabs showing top movers
- Resizable Widget Grid: Addepar-style 12-column grid allowing custom layouts
- Portfolio Cards: Below widgets showing individual portfolio details

**KYC Form Design**:
- Multi-step process with clear progress (Steps: Personal Info → Business Info → Documents → Review)
- Save draft functionality clearly visible
- Document upload: Drag-and-drop zone, file type indicators, upload progress
- Review step: Summary cards with edit buttons for each section

**Document Management**:
- Grid view for document thumbnails
- List view with detailed metadata
- Document type categorization with icons
- Clear upload status and compliance indicators

**Firm Setup Wizard**:
- Welcome screen with firm logo upload
- Progressive disclosure of configuration options
- Clear "Skip for now" vs "Complete setup" paths

**Trust & Security Indicators**:
- Audit log timestamp displays with precise time
- User action attribution in activity feeds
- Lock icons for secure/encrypted sections
- Compliance badges for approved documents

**Responsive Behavior**:
- Mobile: Single column, hamburger menu, stacked cards
- Tablet: Two-column grids, persistent top navigation
- Desktop: Full sidebar, three-column grids where appropriate

This design creates a professional, efficient platform that prioritizes user productivity and data clarity while maintaining the trust essential for financial operations software.