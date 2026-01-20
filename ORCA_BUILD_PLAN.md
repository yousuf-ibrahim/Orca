# Orca Build Plan: Hedgineer-Inspired Architecture

## Executive Summary

Orca is a modular operating system for hedge funds and asset managers. This document deconstructs Hedgineer's product surface and translates it into a leaner, more modular, more accessible build plan for Orca.

**Orca's positioning:**
- A modern operating layer for investment teams
- A unifying system of record across research, portfolio, and operations
- A productivity multiplier that works with existing workflows, not against them

---

## A) Hedgineer Component Deconstruction

### Component 1: Centralized Data Model / Data Fabric

**What Hedgineer Offers:**
- Security mappings to join research, portfolio, and operations data
- Automated storage, compute, and lineage management via Databricks
- Data accessibility through SQL, Excel, APIs, and Jupyter Notebooks

**Problem It Solves:**
Hedge funds have fragmented data across OMS, admin, custodians, research tools, and spreadsheets. Every report requires manual reconciliation. Data lineage is unknown—when something is wrong, nobody knows where the error originated.

**Who Uses It:**
- Operations: Data reconciliation, NAV validation
- PMs: Consolidated portfolio view
- Analysts: Research data connected to positions
- IR: Investor-facing metrics

**Why Funds Pay:**
Eliminates "data archaeology" where teams spend hours finding and validating information. Single source of truth reduces errors and speeds up decision-making.

---

### Component 2: Portfolio Analytics

**What Hedgineer Offers:**
- Dashboards with sizing, performance, and volatility analytics
- Factor risk and attribution integration
- Market data and research overlay for bespoke analytics

**Problem It Solves:**
PMs need real-time visibility into portfolio composition, risk exposures, and P&L attribution. Most funds cobble together Excel sheets that break when positions change.

**Who Uses It:**
- PMs: Daily portfolio monitoring, sizing decisions
- Risk: Factor exposure, VaR, stress testing
- COO/CFO: Leverage, liquidity, concentration limits

**Why Funds Pay:**
Real-time portfolio intelligence enables faster decisions and catches problems before they become costly mistakes.

---

### Component 3: Investor Reports (IR)

**What Hedgineer Offers:**
- Custom dashboards updating daily with position sizing, cost basis, RoR
- Automated scheduled reports (daily/monthly/quarterly)
- CRM integration for investor contacts, meeting notes, distribution lists

**Problem It Solves:**
IR teams spend days each month/quarter compiling investor letters, performance summaries, and attribution analysis. Data is pulled manually from admin, formatted in PowerPoint, and reviewed multiple times.

**Who Uses It:**
- IR Team: Investor communications, quarterly letters
- COO/CFO: Investor relationship oversight
- Compliance: Audit trail of investor disclosures

**Why Funds Pay:**
Transforms a multi-day manual process into a push-button workflow. Investors receive consistent, timely, professional reports.

---

### Component 4: Research Tools

**What Hedgineer Offers:**
- Coverage Monitor: Analysts add coverage, ratings, price targets, research notes
- Asset Screener: Custom watchlists with configurable alerts
- Company Pages: Fundamentals, research, risk, events in one view

**Problem It Solves:**
Research is scattered across analyst notebooks, Bloomberg terminals, email threads, and shared drives. There's no single place to see "what do we think about this company?"

**Who Uses It:**
- Analysts: Research input, coverage tracking
- PMs: Research consumption, investment decisions
- CIO: Research process oversight

**Why Funds Pay:**
Institutional memory for the investment team. When an analyst leaves, their research stays. When a PM asks "what's our view on XYZ?", the answer is one click away.

---

### Component 5: Reference Data & Security Master

**What Hedgineer Offers:**
- Single security table connecting front and back office
- Custom tags on securities, companies, and trades
- Full data lineage to understand and correct errors

**Problem It Solves:**
The same security has different identifiers in Bloomberg, the OMS, the admin, and the custodian. Mapping these requires constant manual effort. Custom classifications (sector, theme, strategy) exist only in spreadsheets.

**Who Uses It:**
- Operations: Data reconciliation, corporate actions
- PMs/Analysts: Custom tagging for analysis
- Compliance: Security-level restrictions and monitoring

**Why Funds Pay:**
Eliminates the "which identifier do I use?" problem. Enables consistent reporting and analysis across all systems.

---

### Component 6: Workflow Management

**What Hedgineer Offers:**
- Data access via Excel, APIs, mobile, Claude Desktop
- Scheduled alerts, notifications, auto-reports via email, Slack, Teams
- User-based permissions on data, APIs, and dashboards

**Problem It Solves:**
Investment teams live in Excel, Slack, and email. Forcing them into a new web app creates friction. Insights need to arrive where people already work.

**Who Uses It:**
- Everyone: Consumes insights via preferred channel
- Ops/IT: Configures permissions and access
- PMs: Sets up alerts for specific conditions

**Why Funds Pay:**
Adoption. The best system is useless if nobody uses it. Workflow integration removes friction and drives daily usage.

---

## B) Orca Version: Simpler, More Opinionated, More Modular

### Orca Module 1: Securities Master

**Hedgineer Equivalent:** Reference Data & Security Master + Data Model foundation

**What Orca Version Looks Like:**
- Central repository for all securities with multi-identifier support
- Ticker, ISIN, CUSIP, SEDOL, Bloomberg ID, internal IDs
- Asset class categorization, issuer information, custom tags
- Manual entry + CSV upload + future API integrations

**In Scope (Phase 1):**
- Manual security creation and editing
- Multi-identifier mapping (link one security to multiple IDs)
- Custom tag management (sector, theme, strategy, ESG)
- CSV bulk import/export
- Search by any identifier

**Out of Scope (Layer Later):**
- Live Bloomberg reference data sync
- Corporate actions processing
- Real-time pricing feeds

**Build First:** Security CRUD, identifier mapping, tagging
**Layer Later:** Bloomberg SAPI integration, corporate actions

---

### Orca Module 2: Portfolio Hub

**Hedgineer Equivalent:** Portfolio Analytics + Data Model

**What Orca Version Looks Like:**
- Multi-custodian portfolio tracking
- Position-level holdings with cost basis, current value, P&L
- Asset allocation breakdown by class, sector, geography, strategy
- Concentration metrics and limit monitoring

**In Scope (Phase 1):**
- Portfolio creation with multi-custodian support
- Position entry via CSV upload or manual input
- P&L calculation (unrealized/realized)
- Allocation pie charts and tables
- Concentration alerts (top 5/10, single name limits)

**Out of Scope (Layer Later):**
- Live OMS/EMS integration
- Factor risk models
- Historical performance attribution
- Benchmark comparison

**Build First:** Position tracking, allocation views, P&L display
**Layer Later:** OMS integration, factor models, time-series analytics

---

### Orca Module 3: Research Workspace

**Hedgineer Equivalent:** Research Tools (Coverage Monitor, Asset Screener, Company Pages)

**What Orca Version Looks Like:**
- Coverage list per analyst with ratings, price targets, conviction
- Research notes attached to securities (not lost in email)
- Company pages pulling together all research, positions, and news
- Simple watchlist with basic alerting

**In Scope (Phase 1):**
- Coverage management: Add securities, set ratings (Buy/Hold/Sell), price targets
- Research notes: Markdown-based notes attached to securities
- Company pages: Consolidated view of research + current position + basic data
- Watchlist: Track securities not in portfolio

**Out of Scope (Layer Later):**
- Semantic search across research (RAG/LLM)
- Automated news/events integration
- Quantitative screening tools
- Forecast tracking and hit rates

**Build First:** Coverage tracker, notes editor, company pages
**Layer Later:** AI-powered search, news feeds, screening

---

### Orca Module 4: Investor Reporting

**Hedgineer Equivalent:** Investor Reports

**What Orca Version Looks Like:**
- Report templates: LP letter, quarterly summary, attribution
- Data pulls from Portfolio Hub automatically
- PDF/DOCX export with branded formatting
- Scheduled generation (manual trigger first, scheduled later)

**In Scope (Phase 1):**
- Template library: 3-4 standard report types
- Manual report generation from current portfolio data
- PDF export with professional formatting
- Report history and versioning

**Out of Scope (Layer Later):**
- CRM integration
- Automated scheduling and distribution
- Custom template builder
- Investor portal access

**Build First:** Template rendering, PDF export, report history
**Layer Later:** Scheduling, CRM, investor portal

---

### Orca Module 5: Compliance Center

**Hedgineer Equivalent:** Part of Workflow + Operations (compliance aspects)

**What Orca Version Looks Like:**
- KYC workflow for investor onboarding (already built)
- Regulatory report generation (DFSA, SEC, etc.)
- Audit trail of all system actions
- Rule-based alerts (concentration, restriction violations)

**In Scope (Phase 1):**
- KYC application workflow (exists)
- Document management (exists)
- Basic compliance reports (KYC summary, audit export)
- Manual compliance checks

**Out of Scope (Layer Later):**
- Automated pre-trade compliance
- Integration with order flow
- Real-time restriction monitoring
- Regulatory filing submission

**Build First:** Report generation, audit export
**Layer Later:** Pre-trade compliance, OMS hooks

---

### Orca Module 6: Workflow & Alerts

**Hedgineer Equivalent:** Workflow Management

**What Orca Version Looks Like:**
- Email notifications for key events
- In-app notification center
- Basic scheduled reports (daily digest)
- Role-based permissions

**In Scope (Phase 1):**
- In-app notifications for system events
- Email alerts for critical items (large P&L moves, compliance issues)
- Role-based access control (Admin, PM, Analyst, Ops, IR)
- Basic scheduled email summaries

**Out of Scope (Layer Later):**
- Slack/Teams integration
- Custom alert builder
- Excel add-in
- Mobile app
- API access for external tools

**Build First:** Notifications, role permissions, email alerts
**Layer Later:** Slack, Excel, mobile, API

---

### Orca Module 7: AI Intelligence Layer

**Hedgineer Equivalent:** "Automate with AI" approach + implicit in all modules

**What Orca Version Looks Like:**
- Research Copilot: Search across internal research notes
- Portfolio Insights: Automated health scoring and alerts
- Report Assist: AI-drafted commentary for investor letters
- Data Quality: Automated reconciliation flags

**In Scope (Phase 1):**
- UI/UX established (done)
- Rule-based health scoring and alerts
- Placeholder AI interfaces ready for LLM integration

**Out of Scope (Layer Later):**
- Semantic search with embeddings
- LLM-generated commentary
- Automated data quality checks
- Predictive analytics

**Build First:** Rule-based intelligence, UI foundations
**Layer Later:** LLM integration, embeddings, automation

**AI Roadmap Considerations:**
- Model selection: Start with OpenAI GPT-4 for text generation, evaluate alternatives
- Data privacy: All firm data processed in isolated tenant context, no cross-tenant training
- Evaluation criteria: Accuracy benchmarks, latency targets, cost per query limits
- Hallucination prevention: All AI outputs cite source documents, human review required for external distribution

---

### Orca Module 8: Data Ingestion & Quality

**Hedgineer Equivalent:** Part of "Data Model" and data audit process

**What Orca Version Looks Like:**
- Centralized import pipeline for all data types
- Validation rules with clear error messages
- Data lineage tracking (where did this value come from?)
- Quality dashboards showing data health

**In Scope (Phase 1):**
- CSV import with column mapping
- Validation rules (required fields, data types, value ranges)
- Import history with rollback capability
- Data quality scores per entity type
- Missing data reports

**Out of Scope (Layer Later):**
- API-based data feeds (OMS, custodian, admin)
- Automated reconciliation across sources
- Machine learning data quality checks
- Real-time data streaming

**Build First:** CSV pipeline, validation, import history
**Layer Later:** API feeds, automated reconciliation

---

## C) Implementation Practicality

### Module: Securities Master
| Aspect | Details |
|--------|---------|
| Core Data | Security identifiers, asset class, issuer, custom tags |
| Client-Provided Only | Yes - CSV upload, manual entry |
| Day 1 (No Integrations) | Full CRUD, search, tagging, CSV import/export |
| Layer Later | Bloomberg SAPI, corporate actions, live pricing |

### Module: Portfolio Hub
| Aspect | Details |
|--------|---------|
| Core Data | Positions, quantities, cost basis, current prices |
| Client-Provided Only | Yes - CSV position files, manual entry |
| Day 1 (No Integrations) | Position tracking, P&L, allocations, limits |
| Layer Later | OMS feed, custodian API, factor models |

### Module: Research Workspace
| Aspect | Details |
|--------|---------|
| Core Data | Coverage ratings, notes, price targets |
| Client-Provided Only | Yes - analyst inputs, note uploads |
| Day 1 (No Integrations) | Coverage tracker, notes, company pages |
| Layer Later | News API, semantic search, event calendars |

### Module: Investor Reporting
| Aspect | Details |
|--------|---------|
| Core Data | Portfolio data, templates, branding |
| Client-Provided Only | Yes - pulls from Portfolio Hub |
| Day 1 (No Integrations) | Template reports, PDF export |
| Layer Later | CRM, scheduling, investor portal |

### Module: Compliance Center
| Aspect | Details |
|--------|---------|
| Core Data | KYC applications, documents, audit logs |
| Client-Provided Only | Yes - manual input, document upload |
| Day 1 (No Integrations) | KYC workflow, reports, audit export |
| Layer Later | Pre-trade compliance, regulatory filing |

### Module: Workflow & Alerts
| Aspect | Details |
|--------|---------|
| Core Data | User events, notification preferences |
| Client-Provided Only | Yes - system-generated |
| Day 1 (No Integrations) | In-app notifications, email alerts |
| Layer Later | Slack, Teams, Excel, mobile |

---

## D) Phased Build Order

### Phase 1: Foundation + Highest Leverage
**Timeline: Current + 2-4 weeks**

| Module | Priority | Why First |
|--------|----------|-----------|
| Platform Prerequisites | P0 | Shared infrastructure for all modules |
| Data Ingestion & Quality | P1 | Clean data is foundation for everything |
| Securities Master | P1 | Everything depends on security data |
| Portfolio Hub (basic) | P1 | Core value prop - see your portfolio |
| Compliance Center (KYC) | P1 | Already built, operational |
| User/Auth/Permissions | P1 | Multi-user access control |

**Platform Prerequisites (P0):**
- [ ] Multi-tenant schema expansion (firmId on all entities)
- [ ] Audit logging service (track all user actions)
- [ ] Notification infrastructure (in-app + email queuing)
- [ ] RBAC matrix (Admin, PM, Analyst, Ops, IR, Compliance roles)
- [ ] Error handling and validation framework

**Data Ingestion & Quality Module:**
- [ ] CSV import pipeline with validation rules
- [ ] Data type validation (dates, numbers, identifiers)
- [ ] Duplicate detection and resolution workflow
- [ ] Import history and lineage logging
- [ ] Data quality dashboard (missing fields, validation errors)

**Deliverables:**
- [ ] Security creation, editing, bulk import
- [ ] Multi-identifier mapping
- [ ] Custom tags on securities
- [ ] Position tracking with CSV import
- [ ] Basic P&L and allocation views
- [ ] Concentration monitoring (alerts at thresholds)
- [ ] KYC workflow (exists)
- [ ] Role-based access (Admin, PM, Analyst, Ops)

---

### Phase 2: Analytics + Intelligence
**Timeline: 4-8 weeks**

| Module | Priority | Why Now |
|--------|----------|---------|
| Research Workspace | P2 | Differentiator for investment teams |
| Portfolio Hub (advanced) | P2 | Deeper analytics on positions |
| Investor Reporting | P2 | High-value time saver for IR |
| AI Intelligence (rule-based) | P2 | Health scores, alerts |

**Deliverables:**
- [ ] Coverage tracker with ratings and targets
- [ ] Research notes editor
- [ ] Company pages (research + position + data)
- [ ] Historical P&L tracking
- [ ] Attribution by sector/geography
- [ ] LP letter template with PDF export
- [ ] Quarterly summary report
- [ ] Portfolio health scoring
- [ ] Automated concentration alerts

**Investor Reporting Acceptance Criteria:**
- Performance calculation methodology documented and auditable
- Time-weighted return (TWR) calculation accurate to 2 decimal places
- Disclosure tables include: fees, benchmark comparisons, risk metrics
- Report versioning with approval workflow (draft → review → publish)
- PDF output matches firm branding guidelines

---

### Phase 3: Automation + Polish
**Timeline: 8-12 weeks**

| Module | Priority | Why Last |
|--------|----------|----------|
| Workflow & Alerts | P3 | Polish once core is solid |
| AI Intelligence (LLM) | P3 | Requires content to search |
| Integrations | P3 | Optional for many funds |

**Deliverables:**
- [ ] Email notification system
- [ ] Scheduled report generation
- [ ] Research Copilot with semantic search
- [ ] AI-drafted report commentary
- [ ] Slack/Teams integration (optional)
- [ ] Bloomberg data feed (optional)
- [ ] OMS position feed (optional)

---

## E) What Orca Intentionally Simplifies

| Hedgineer Approach | Orca Simplification |
|--------------------|---------------------|
| Databricks-powered data lake | PostgreSQL with Drizzle ORM |
| Custom SQL/Jupyter access | Pre-built views, CSV export |
| Factor risk model integration | Rule-based concentration/P&L alerts |
| Multi-channel delivery (Excel, Claude) | Web app + email (initially) |
| Full data lineage tracking | Audit log of user actions |
| Custom analytics builder | Opinionated dashboards with key metrics |
| CRM integration for IR | Simple report export (CRM later) |
| OMS/EMS live integration | CSV position upload (OMS later) |

**Orca's Philosophy:**
- 80% of value from 20% of features
- Opinionated defaults beat infinite customization
- Works standalone, integrates later
- Manual entry is acceptable for small teams
- Good enough today beats perfect in 6 months

---

## Module-to-Hedgineer Mapping Summary

| Orca Module | Hedgineer Equivalent | Simplification Level |
|-------------|---------------------|----------------------|
| Data Ingestion & Quality | Data Model + Data Audit | High (CSV-first, no Databricks) |
| Securities Master | Reference Data + Data Model | High (no Databricks) |
| Portfolio Hub | Portfolio Analytics | Medium (no factor models) |
| Research Workspace | Research Tools | Medium (no AI initially) |
| Investor Reporting | Investor Reports | High (no CRM) |
| Compliance Center | Operations + Workflow | Medium (no pre-trade) |
| Workflow & Alerts | Workflow Management | High (web + email only) |
| AI Intelligence | "Automate with AI" | High (rule-based first) |

---

## Success Metrics for Orca

**Phase 1 Success:**
- User can add securities, import positions, see portfolio allocation
- KYC workflow is functional end-to-end
- Multi-user access with role-based permissions

**Phase 2 Success:**
- Research team can track coverage and share notes
- IR can generate investor reports in minutes not days
- Health scores surface portfolio issues automatically

**Phase 3 Success:**
- Alerts arrive before users check the dashboard
- Research is searchable across all historical notes
- Integration pipeline ready for OMS/Bloomberg when needed

---

## Conclusion

Hedgineer provides a comprehensive template for what investment operations software should do. Orca's strategy is to deliver the same core value with:

1. **Simpler architecture** - PostgreSQL, not Databricks
2. **Faster time-to-value** - Works with CSV uploads day one
3. **Lower barrier to entry** - No data audit or custom build required
4. **Modular adoption** - Start with one module, add more as needed

The goal is not to out-feature Hedgineer, but to be the Hedgineer that a 10-person fund can deploy in a week instead of a quarter.
