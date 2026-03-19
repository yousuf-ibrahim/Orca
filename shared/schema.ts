import { pgTable, text, serial, integer, timestamp, boolean, jsonb, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Firms (Multi-tenant)
export const firms = pgTable("firms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").notNull().unique(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFirmSchema = createInsertSchema(firms).omit({
  id: true,
  createdAt: true,
});
export type InsertFirm = z.infer<typeof insertFirmSchema>;
export type Firm = typeof firms.$inferSelect;

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Clients (Enhanced with full KYC fields)
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  // Basic information
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  
  // Client classification
  type: text("type").notNull(), // individual, joint, entity, trust, family_office
  clientCategory: text("client_category"), // professional, market_counterparty
  
  // Personal details (for individuals)
  dateOfBirth: date("date_of_birth"),
  placeOfBirth: text("place_of_birth"),
  nationality: text("nationality"),
  residentialAddress: text("residential_address"),
  
  // Tax information
  taxResidencies: jsonb("tax_residencies").default([]), // [{country, tin}, ...]
  isUsPerson: boolean("is_us_person").default(false),
  usTin: text("us_tin"),
  
  // Professional details
  currentOccupation: text("current_occupation"),
  employer: text("employer"),
  sector: text("sector"),
  
  // PEP screening
  isPep: boolean("is_pep").default(false),
  pepDetails: jsonb("pep_details"), // {role, country, relationship}
  
  // Compliance status
  status: text("status").notNull().default("pending"), // draft, submitted, under_review, approved, rejected, requires_update
  riskScore: integer("risk_score"),
  riskBand: text("risk_band"), // low, medium, high
  
  // Relationship management
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  relationshipStartDate: date("relationship_start_date"),
  
  // Review tracking
  lastReviewDate: date("last_review_date"),
  nextReviewDate: date("next_review_date"),
  enhancedDueDiligence: boolean("enhanced_due_diligence").default(false),
  
  // Entity-specific fields
  companyRegistrationNumber: text("company_registration_number"),
  dateOfIncorporation: date("date_of_incorporation"),
  countryOfIncorporation: text("country_of_incorporation"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// KYC Applications
export const kycApplications = pgTable("kyc_applications", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  status: text("status").notNull().default("draft"),
  step: integer("step").notNull().default(0),
  data: jsonb("data").notNull().default({}),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertKycApplicationSchema = createInsertSchema(kycApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertKycApplication = z.infer<typeof insertKycApplicationSchema>;
export type KycApplication = typeof kycApplications.$inferSelect;

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  kycApplicationId: integer("kyc_application_id").notNull().references(() => kycApplications.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  type: text("type").notNull(),
  filename: text("filename").notNull(),
  filesize: integer("filesize").notNull(),
  url: text("url").notNull(),
  verified: boolean("verified").notNull().default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  userId: integer("user_id").references(() => users.id),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  action: text("action").notNull(),
  changes: jsonb("changes"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// Wealth Information (Source of Wealth & Funds)
export const wealthInformation = pgTable("wealth_information", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  // Wealth narratives
  sourceOfWealthNarrative: text("source_of_wealth_narrative"), // How wealth was built
  sourceOfFundsNarrative: text("source_of_funds_narrative"), // Source of funds being invested
  
  // Financial position
  totalNetWorth: decimal("total_net_worth", { precision: 15, scale: 2 }),
  liquidAssets: decimal("liquid_assets", { precision: 15, scale: 2 }),
  illiquidAssets: decimal("illiquid_assets", { precision: 15, scale: 2 }),
  liabilities: decimal("liabilities", { precision: 15, scale: 2 }),
  annualIncome: decimal("annual_income", { precision: 15, scale: 2 }),
  incomeSource: text("income_source"),
  
  // Asset breakdown
  assetBreakdown: jsonb("asset_breakdown"), // {cash: X, securities: Y, realEstate: Z, etc}
  
  // Verification
  wealthVerificationStatus: text("wealth_verification_status").default("pending"), // pending, verified, requires_additional_info
  verificationPercentage: integer("verification_percentage").default(0), // 0-100%
  verifiedBy: integer("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  verificationNotes: text("verification_notes"),
  
  version: integer("version").default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertWealthInformationSchema = createInsertSchema(wealthInformation).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWealthInformation = z.infer<typeof insertWealthInformationSchema>;
export type WealthInformation = typeof wealthInformation.$inferSelect;

// Beneficial Ownership (for entities - multi-layer tracking)
export const beneficialOwnership = pgTable("beneficial_ownership", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id), // The entity client
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  // Ownership structure
  layer: integer("layer").notNull().default(1), // 1=direct, 2=one level up, etc
  ownerType: text("owner_type").notNull(), // natural_person, corporation, trust, nominee
  
  // Owner details
  ownerName: text("owner_name").notNull(),
  ownershipPercentage: decimal("ownership_percentage", { precision: 5, scale: 2 }), // up to 100.00%
  
  // Natural person details
  nationality: text("nationality"),
  dateOfBirth: date("date_of_birth"),
  passportNumber: text("passport_number"),
  residentialAddress: text("residential_address"),
  
  // Corporate details
  companyRegistrationNumber: text("company_registration_number"),
  countryOfIncorporation: text("country_of_incorporation"),
  
  // Trust details
  trustName: text("trust_name"),
  trusteeName: text("trustee_name"),
  
  // Flags
  isUltimateBeneficialOwner: boolean("is_ultimate_beneficial_owner").default(false),
  isPep: boolean("is_pep").default(false),
  pepDetails: text("pep_details"),
  
  // Documents
  documentIds: jsonb("document_ids").default([]), // Array of document IDs
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBeneficialOwnershipSchema = createInsertSchema(beneficialOwnership).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBeneficialOwnership = z.infer<typeof insertBeneficialOwnershipSchema>;
export type BeneficialOwnership = typeof beneficialOwnership.$inferSelect;

// Risk Assessments (replaces Excel scoring)
export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  // Assessment context
  assessmentType: text("assessment_type").notNull(), // initial, periodic_review, enhanced_dd
  assessmentDate: date("assessment_date").notNull(),
  
  // Risk factor scores (1-5 scale typically)
  countryRisk: integer("country_risk"),
  occupationRisk: integer("occupation_risk"),
  productRisk: integer("product_risk"),
  channelRisk: integer("channel_risk"),
  pepRisk: integer("pep_risk"),
  sourceOfWealthRisk: integer("source_of_wealth_risk"),
  transactionPatternRisk: integer("transaction_pattern_risk"),
  
  // Calculated scores
  totalRiskScore: integer("total_risk_score"),
  riskBand: text("risk_band"), // low, medium, high, prohibited
  
  // Compliance officer assessment
  assessedBy: integer("assessed_by").references(() => users.id),
  assessmentNotes: text("assessment_notes"),
  overrideReason: text("override_reason"), // If manually adjusted
  
  // Approval
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  
  version: integer("version").default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  createdAt: true,
});
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;
export type RiskAssessment = typeof riskAssessments.$inferSelect;

// Suitability Assessments (investment appropriateness)
export const suitabilityAssessments = pgTable("suitability_assessments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  assessmentDate: date("assessment_date").notNull(),
  
  // Investment objectives
  investmentObjective: text("investment_objective"), // capital_preservation, income, balanced, growth, aggressive
  
  // Product knowledge (array of {product, knowledge, experience, transactions})
  productKnowledge: jsonb("product_knowledge").default([]),
  
  // Time horizon
  investmentTimeHorizon: text("investment_time_horizon"), // 0-1yr, 1-3yr, 3-5yr, 5-10yr, 10+yr
  timeHorizonScore: integer("time_horizon_score"),
  
  // Risk tolerance questions (1-5 scale typically)
  relianceOnAssets: integer("reliance_on_assets"), // 1=strongly agree (high reliance), 5=strongly disagree
  marketDeclineResponse: integer("market_decline_response"),
  portfolioDeclineTolerance: integer("portfolio_decline_tolerance"), // Percentage they can tolerate
  
  // Financial situation
  percentageOfNetWorth: integer("percentage_of_net_worth"), // What % of their net worth is being invested
  
  // Total suitability score (auto-calculated)
  totalScore: integer("total_score"),
  suitabilityRating: text("suitability_rating"), // conservative, moderate, balanced, growth, aggressive
  
  // Assessment metadata
  assessedBy: integer("assessed_by").references(() => users.id),
  approvedBy: integer("approved_by").references(() => users.id),
  
  version: integer("version").default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSuitabilityAssessmentSchema = createInsertSchema(suitabilityAssessments).omit({
  id: true,
  createdAt: true,
});
export type InsertSuitabilityAssessment = z.infer<typeof insertSuitabilityAssessmentSchema>;
export type SuitabilityAssessment = typeof suitabilityAssessments.$inferSelect;

// Client Classification (Professional vs Retail per DFSA)
export const clientClassification = pgTable("client_classification", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  classification: text("classification").notNull(), // professional, market_counterparty
  classificationBasis: text("classification_basis"), // Why they qualify
  
  // Criteria checks
  meetsNetWorthRequirement: boolean("meets_net_worth_requirement").default(false),
  meetsPortfolioRequirement: boolean("meets_portfolio_requirement").default(false),
  meetsExperienceRequirement: boolean("meets_experience_requirement").default(false),
  
  // Assessment
  classificationDate: date("classification_date").notNull(),
  classifiedBy: integer("classified_by").references(() => users.id),
  approvedBy: integer("approved_by").references(() => users.id),
  
  version: integer("version").default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClientClassificationSchema = createInsertSchema(clientClassification).omit({
  id: true,
  createdAt: true,
});
export type InsertClientClassification = z.infer<typeof insertClientClassificationSchema>;
export type ClientClassification = typeof clientClassification.$inferSelect;

// RM KYC Notes (Relationship Manager narratives)
export const rmKycNotes = pgTable("rm_kyc_notes", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  relationshipManagerId: integer("relationship_manager_id").notNull().references(() => users.id),
  
  noteType: text("note_type").notNull(), // initial, update, periodic_review
  noteDate: date("note_date").notNull(),
  
  // Narrative fields
  clientBackground: text("client_background"),
  relationshipWithRM: text("relationship_with_rm"),
  relationshipWithFirm: text("relationship_with_firm"),
  contactInitiationDetails: text("contact_initiation_details"),
  sourceOfWealthNarrative: text("source_of_wealth_narrative"),
  sourceOfFundsNarrative: text("source_of_funds_narrative"),
  investmentKnowledgeAssessment: text("investment_knowledge_assessment"),
  currentProfessionalActivities: text("current_professional_activities"),
  otherRelevantInformation: text("other_relevant_information"),
  
  // Signature
  signature: text("signature"),
  signedAt: timestamp("signed_at"),
  
  version: integer("version").default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertRmKycNoteSchema = createInsertSchema(rmKycNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRmKycNote = z.infer<typeof insertRmKycNoteSchema>;
export type RmKycNote = typeof rmKycNotes.$inferSelect;

// Client Approvals (Approval Committee workflow)
export const clientApprovals = pgTable("client_approvals", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  submittedBy: integer("submitted_by").notNull().references(() => users.id),
  submittedAt: timestamp("submitted_at").notNull(),
  
  // Approval criteria checks
  minimumAumMet: boolean("minimum_aum_met").default(false), // >= $3M
  experienceAlignedWithStrategy: boolean("experience_aligned_with_strategy").default(false),
  wealthCorroborationPercentage: integer("wealth_corroboration_percentage"), // Must be >= 90%
  
  // Committee votes (array of {userId, userName, vote, comments, votedAt})
  committeeMembers: jsonb("committee_members").default([]),
  
  // Decision
  decision: text("decision").default("pending"), // pending, approved, rejected, requires_more_info
  decisionDate: date("decision_date"),
  decisionRationale: text("decision_rationale"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertClientApprovalSchema = createInsertSchema(clientApprovals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClientApproval = z.infer<typeof insertClientApprovalSchema>;
export type ClientApproval = typeof clientApprovals.$inferSelect;

// Transaction Monitoring (Enhanced DD and ongoing monitoring)
export const transactionMonitoring = pgTable("transaction_monitoring", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  // Review period
  reviewPeriodStart: date("review_period_start").notNull(),
  reviewPeriodEnd: date("review_period_end").notNull(),
  reviewType: text("review_type").notNull(), // periodic, enhanced_dd, triggered
  triggerReason: text("trigger_reason"),
  
  // Activity analysis (JSON objects with {count, totalValue, largestTransaction})
  creditTransactions: jsonb("credit_transactions"),
  debitTransactions: jsonb("debit_transactions"),
  
  // Findings
  unusualActivityDetected: boolean("unusual_activity_detected").default(false),
  unusualActivityDetails: text("unusual_activity_details"),
  supportingDocumentsReviewed: boolean("supporting_documents_reviewed").default(false),
  largeTransactionsJustified: boolean("large_transactions_justified").default(false),
  
  // Assessment
  observations: text("observations"),
  actionTaken: text("action_taken"),
  recommendations: text("recommendations"),
  
  // Sign-offs
  preparedBy: integer("prepared_by").references(() => users.id),
  reviewedByCompliance: integer("reviewed_by_compliance").references(() => users.id),
  reviewDate: date("review_date"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransactionMonitoringSchema = createInsertSchema(transactionMonitoring).omit({
  id: true,
  createdAt: true,
});
export type InsertTransactionMonitoring = z.infer<typeof insertTransactionMonitoringSchema>;
export type TransactionMonitoring = typeof transactionMonitoring.$inferSelect;

// ============================================
// PORTFOLIO MONITORING SYSTEM
// ============================================

// Securities Master (Bloomberg-linked reference data)
export const securitiesMaster = pgTable("securities_master", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  // Identifiers (for cross-system linking)
  ticker: text("ticker"),
  isin: text("isin").unique(),
  cusip: text("cusip"),
  sedol: text("sedol"),
  bloombergId: text("bloomberg_id"),
  reutersRic: text("reuters_ric"),
  
  // Security core information
  securityName: text("security_name").notNull(),
  assetClass: text("asset_class").notNull(), // cash, fixed_income, equity, alternatives, structured_products, fx_commodities, swaps
  securityType: text("security_type"), // bond, stock, etf, fund, option, future, etc.
  productCategory: text("product_category"), // fiduciary_deposits, us_treasuries, single_line_equity, hedge_funds, etc.
  
  // Issuer information
  issuerName: text("issuer_name"),
  issuerCountry: text("issuer_country"),
  issuerSector: text("issuer_sector"),
  
  // Market data
  currency: text("currency").notNull().default("USD"),
  exchange: text("exchange"),
  country: text("country"),
  
  // Fixed income specific
  maturityDate: date("maturity_date"),
  couponRate: decimal("coupon_rate", { precision: 10, scale: 4 }),
  yieldToMaturity: decimal("yield_to_maturity", { precision: 10, scale: 4 }),
  duration: decimal("duration", { precision: 10, scale: 2 }),
  creditRating: text("credit_rating"), // AAA, AA, A, BBB, etc.
  
  // Risk metrics
  prr: integer("prr"), // Product Risk Rating 1-5
  beta: decimal("beta", { precision: 10, scale: 4 }),
  
  // Pricing
  lastPrice: decimal("last_price", { precision: 20, scale: 6 }),
  priceDate: date("price_date"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSecuritiesMasterSchema = createInsertSchema(securitiesMaster).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSecurityMaster = z.infer<typeof insertSecuritiesMasterSchema>;
export type SecurityMaster = typeof securitiesMaster.$inferSelect;

// Custodians
export const custodians = pgTable("custodians", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  
  name: text("name").notNull(), // LGT Geneva, Credit Suisse, etc.
  shortName: text("short_name"), // LGT, CS, etc.
  custodianType: text("custodian_type"), // bank, prime_broker, clearing_firm
  
  // Contact information
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  
  // Integration details
  apiEndpoint: text("api_endpoint"),
  ftpHost: text("ftp_host"),
  
  // Status
  status: text("status").notNull().default("active"), // active, inactive
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCustodianSchema = createInsertSchema(custodians).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCustodian = z.infer<typeof insertCustodianSchema>;
export type Custodian = typeof custodians.$inferSelect;

// Portfolios (Client portfolios - can have multiple custodians)
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  
  portfolioName: text("portfolio_name").notNull(),
  accountNumber: text("account_number"), // Primary account number
  
  // Investment profile
  investmentRiskProfile: text("investment_risk_profile"), // conservative, moderately_conservative, moderate, moderately_aggressive, aggressive
  investmentObjective: text("investment_objective"), // capital_preservation, income, growth, capital_growth, aggressive_growth
  
  // Benchmarks
  benchmarkIndex: text("benchmark_index"),
  
  // Portfolio metrics (updated daily/real-time)
  totalMarketValue: decimal("total_market_value", { precision: 20, scale: 2 }),
  totalCostBasis: decimal("total_cost_basis", { precision: 20, scale: 2 }),
  totalUnrealizedPnl: decimal("total_unrealized_pnl", { precision: 20, scale: 2 }),
  totalRealizedPnl: decimal("total_realized_pnl", { precision: 20, scale: 2 }),
  
  // Leverage metrics
  grossAssets: decimal("gross_assets", { precision: 20, scale: 2 }),
  totalLiabilities: decimal("total_liabilities", { precision: 20, scale: 2 }),
  netAssets: decimal("net_assets", { precision: 20, scale: 2 }),
  loanInterest: decimal("loan_interest", { precision: 10, scale: 4 }),
  weightedAvgLendingRate: decimal("weighted_avg_lending_rate", { precision: 10, scale: 4 }),
  
  // Status
  status: text("status").notNull().default("active"), // active, closed, suspended
  
  asOfDate: date("as_of_date"), // Portfolio valuation date
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;

// Positions (Holdings at security level across custodians)
export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  portfolioId: integer("portfolio_id").notNull().references(() => portfolios.id),
  custodianId: integer("custodian_id").notNull().references(() => custodians.id),
  securityId: integer("security_id").notNull().references(() => securitiesMaster.id),
  
  // Position details
  quantity: decimal("quantity", { precision: 20, scale: 6 }).notNull(),
  averageCost: decimal("average_cost", { precision: 20, scale: 6 }),
  costBasis: decimal("cost_basis", { precision: 20, scale: 2 }),
  
  // Market value
  currentPrice: decimal("current_price", { precision: 20, scale: 6 }),
  marketValue: decimal("market_value", { precision: 20, scale: 2 }),
  
  // P&L
  unrealizedPnl: decimal("unrealized_pnl", { precision: 20, scale: 2 }),
  realizedPnl: decimal("realized_pnl", { precision: 20, scale: 2 }),
  
  // Allocation
  allocationPercent: decimal("allocation_percent", { precision: 10, scale: 4 }),
  
  // Income (for bonds/dividends)
  annualCashflow: decimal("annual_cashflow", { precision: 20, scale: 2 }),
  indicativeLtv: decimal("indicative_ltv", { precision: 10, scale: 4 }), // Loan-to-value
  
  // Position dates
  positionDate: date("position_date").notNull(), // Snapshot date
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type Position = typeof positions.$inferSelect;

// ============================================
// ORCA RECON — RECONCILIATION ENGINE
// ============================================

// Reconciliation Runs (daily batches per custodian)
export const reconRuns = pgTable("recon_runs", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  custodianId: integer("custodian_id").notNull().references(() => custodians.id),

  runDate: date("run_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, running, completed, failed

  // Summary statistics
  totalPositions: integer("total_positions").default(0),
  matchedPositions: integer("matched_positions").default(0),
  breakCount: integer("break_count").default(0),
  cashBreakCount: integer("cash_break_count").default(0),
  toleranceBreachCount: integer("tolerance_breach_count").default(0),

  // Run metadata
  runDurationMs: integer("run_duration_ms"),
  notes: text("notes"),
  runBy: integer("run_by").references(() => users.id),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReconRunSchema = createInsertSchema(reconRuns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertReconRun = z.infer<typeof insertReconRunSchema>;
export type ReconRun = typeof reconRuns.$inferSelect;

// Reconciliation Breaks (individual exceptions)
export const reconBreaks = pgTable("recon_breaks", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  reconRunId: integer("recon_run_id").notNull().references(() => reconRuns.id),
  portfolioId: integer("portfolio_id").references(() => portfolios.id),
  custodianId: integer("custodian_id").notNull().references(() => custodians.id),
  securityId: integer("security_id").references(() => securitiesMaster.id),

  // Break classification
  breakType: text("break_type").notNull(), // position_quantity, price_mismatch, cash_break, missing_position, extra_position, corporate_action
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical

  // Orca (internal) side
  orcaQuantity: decimal("orca_quantity", { precision: 20, scale: 6 }),
  orcaPrice: decimal("orca_price", { precision: 20, scale: 6 }),
  orcaValue: decimal("orca_value", { precision: 20, scale: 2 }),

  // Custodian (external) side
  custodianQuantity: decimal("custodian_quantity", { precision: 20, scale: 6 }),
  custodianPrice: decimal("custodian_price", { precision: 20, scale: 6 }),
  custodianValue: decimal("custodian_value", { precision: 20, scale: 2 }),

  // Break metrics
  quantityDifference: decimal("quantity_difference", { precision: 20, scale: 6 }),
  valueDifference: decimal("value_difference", { precision: 20, scale: 2 }),
  differencePercent: decimal("difference_percent", { precision: 10, scale: 4 }),

  // Security info (denormalized for speed)
  securityName: text("security_name"),
  ticker: text("ticker"),
  portfolioName: text("portfolio_name"),
  custodianName: text("custodian_name"),

  // Resolution workflow
  status: text("status").notNull().default("open"), // open, acknowledged, investigating, resolved, escalated, suppressed
  resolutionNotes: text("resolution_notes"),
  rootCause: text("root_cause"), // data_entry_error, timing_difference, corporate_action, custodian_error, system_error
  resolvedById: integer("resolved_by_id").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  agingDays: integer("aging_days").default(0),

  breakDate: date("break_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReconBreakSchema = createInsertSchema(reconBreaks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertReconBreak = z.infer<typeof insertReconBreakSchema>;
export type ReconBreak = typeof reconBreaks.$inferSelect;

// ============================================
// ORCA CAPITAL — CAPITAL EVENT MANAGER
// ============================================

// Fund Structures (the fund entity)
export const fundStructures = pgTable("fund_structures", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),

  fundName: text("fund_name").notNull(),
  fundCode: text("fund_code"), // Short identifier e.g. "ORCA-I"
  strategyType: text("strategy_type"), // long_short_equity, macro, credit, multi_strat, real_estate, private_equity
  legalStructure: text("legal_structure"), // LP, LLC, open_ended, closed_ended, cayman_exempted
  currency: text("currency").notNull().default("USD"),
  vintage: integer("vintage"), // Inception year

  // Fund size
  targetFundSize: decimal("target_fund_size", { precision: 20, scale: 2 }),
  hardCap: decimal("hard_cap", { precision: 20, scale: 2 }),
  totalCommitments: decimal("total_commitments", { precision: 20, scale: 2 }).default("0"),
  calledCapital: decimal("called_capital", { precision: 20, scale: 2 }).default("0"),
  uncalledCapital: decimal("uncalled_capital", { precision: 20, scale: 2 }).default("0"),
  distributedCapital: decimal("distributed_capital", { precision: 20, scale: 2 }).default("0"),

  // Fee structure
  managementFeeRate: decimal("management_fee_rate", { precision: 10, scale: 4 }), // e.g. 0.0200 = 2%
  performanceFeeRate: decimal("performance_fee_rate", { precision: 10, scale: 4 }), // e.g. 0.2000 = 20%
  hurdleRate: decimal("hurdle_rate", { precision: 10, scale: 4 }), // e.g. 0.0800 = 8%
  highWaterMark: boolean("high_water_mark").default(true),

  // Fund admin & service providers
  fundAdministrator: text("fund_administrator"),
  auditor: text("auditor"),
  legalCounsel: text("legal_counsel"),
  primeBroker: text("prime_broker"),

  inceptionDate: date("inception_date"),
  firstCloseDate: date("first_close_date"),
  finalCloseDate: date("final_close_date"),
  investmentPeriodEnd: date("investment_period_end"),
  fundTermDate: date("fund_term_date"),

  status: text("status").notNull().default("fundraising"), // fundraising, investing, harvesting, liquidating, closed

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertFundStructureSchema = createInsertSchema(fundStructures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertFundStructure = z.infer<typeof insertFundStructureSchema>;
export type FundStructure = typeof fundStructures.$inferSelect;

// LP Commitments (investor commitment tracking)
export const lpCommitments = pgTable("lp_commitments", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  fundId: integer("fund_id").notNull().references(() => fundStructures.id),
  clientId: integer("client_id").references(() => clients.id), // Linked client record

  // LP details
  lpName: text("lp_name").notNull(),
  lpType: text("lp_type"), // individual, family_office, pension_fund, endowment, fund_of_funds, sovereign_wealth, corporate
  lpJurisdiction: text("lp_jurisdiction"),

  // Commitment financials
  committedCapital: decimal("committed_capital", { precision: 20, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  calledCapital: decimal("called_capital", { precision: 20, scale: 2 }).default("0"),
  uncalledCapital: decimal("uncalled_capital", { precision: 20, scale: 2 }),
  calledPercent: decimal("called_percent", { precision: 10, scale: 4 }).default("0"),

  // Distributions
  distributedCapital: decimal("distributed_capital", { precision: 20, scale: 2 }).default("0"),
  netContributions: decimal("net_contributions", { precision: 20, scale: 2 }),

  // Timeline
  commitmentDate: date("commitment_date").notNull(),
  firstCloseDate: date("first_close_date"),
  subscribedDate: date("subscribed_date"),

  // Administrative
  subscriptionDocsSigned: boolean("subscription_docs_signed").default(false),
  kycApproved: boolean("kyc_approved").default(false),
  wireReceived: boolean("wire_received").default(false),

  status: text("status").notNull().default("committed"), // committed, fully_called, partial, inactive, withdrawn

  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLpCommitmentSchema = createInsertSchema(lpCommitments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLpCommitment = z.infer<typeof insertLpCommitmentSchema>;
export type LpCommitment = typeof lpCommitments.$inferSelect;

// Capital Calls
export const capitalCalls = pgTable("capital_calls", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  fundId: integer("fund_id").notNull().references(() => fundStructures.id),

  callNumber: integer("call_number").notNull(), // Sequential: 1, 2, 3...
  callDate: date("call_date").notNull(),
  dueDate: date("due_date").notNull(),

  // Call financials
  callPercent: decimal("call_percent", { precision: 10, scale: 4 }), // % of total commitments
  callAmount: decimal("call_amount", { precision: 20, scale: 2 }).notNull(),

  // Purpose breakdown
  purpose: text("purpose").notNull(), // investment, management_fees, expenses, recallable_capital
  investmentAmount: decimal("investment_amount", { precision: 20, scale: 2 }),
  managementFeeAmount: decimal("management_fee_amount", { precision: 20, scale: 2 }),
  expensesAmount: decimal("expenses_amount", { precision: 20, scale: 2 }),

  // Collection tracking
  totalNoticed: decimal("total_noticed", { precision: 20, scale: 2 }),
  totalReceived: decimal("total_received", { precision: 20, scale: 2 }).default("0"),
  receiptPercent: decimal("receipt_percent", { precision: 10, scale: 4 }).default("0"),

  // Fund admin reference
  fundAdminReference: text("fund_admin_reference"),
  wireInstructions: text("wire_instructions"),

  status: text("status").notNull().default("draft"), // draft, sent, partially_received, fully_received, cancelled

  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCapitalCallSchema = createInsertSchema(capitalCalls).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCapitalCall = z.infer<typeof insertCapitalCallSchema>;
export type CapitalCall = typeof capitalCalls.$inferSelect;

// Capital Call LP Allocations (per-LP breakdown for each call)
export const capitalCallAllocations = pgTable("capital_call_allocations", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  capitalCallId: integer("capital_call_id").notNull().references(() => capitalCalls.id),
  lpCommitmentId: integer("lp_commitment_id").notNull().references(() => lpCommitments.id),

  lpName: text("lp_name").notNull(),
  allocatedAmount: decimal("allocated_amount", { precision: 20, scale: 2 }).notNull(),
  receivedAmount: decimal("received_amount", { precision: 20, scale: 2 }).default("0"),
  outstandingAmount: decimal("outstanding_amount", { precision: 20, scale: 2 }),

  receivedDate: date("received_date"),
  wireReference: text("wire_reference"),

  status: text("status").notNull().default("pending"), // pending, received, partial, overdue, waived

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCapitalCallAllocationSchema = createInsertSchema(capitalCallAllocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCapitalCallAllocation = z.infer<typeof insertCapitalCallAllocationSchema>;
export type CapitalCallAllocation = typeof capitalCallAllocations.$inferSelect;

// Capital Distributions
export const capitalDistributions = pgTable("capital_distributions", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  fundId: integer("fund_id").notNull().references(() => fundStructures.id),

  distributionNumber: integer("distribution_number").notNull(),
  distributionDate: date("distribution_date").notNull(),

  totalAmount: decimal("total_amount", { precision: 20, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),

  // Distribution type breakdown
  distributionType: text("distribution_type").notNull(), // return_of_capital, realized_gains, dividend, recallable, management_fee_rebate
  returnOfCapitalAmount: decimal("return_of_capital_amount", { precision: 20, scale: 2 }).default("0"),
  realizedGainsAmount: decimal("realized_gains_amount", { precision: 20, scale: 2 }).default("0"),

  // Per-LP allocations stored as JSON
  lpAllocations: jsonb("lp_allocations").default([]), // [{lpCommitmentId, lpName, amount, sentDate, wireRef}]

  // Fund admin reference
  fundAdminReference: text("fund_admin_reference"),
  relatedInvestment: text("related_investment"), // Which investment was monetized

  status: text("status").notNull().default("draft"), // draft, approved, sent, paid, cancelled

  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCapitalDistributionSchema = createInsertSchema(capitalDistributions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCapitalDistribution = z.infer<typeof insertCapitalDistributionSchema>;
export type CapitalDistribution = typeof capitalDistributions.$inferSelect;

// ============================================
// FUND ANALYTICS — NAV & PERFORMANCE
// ============================================

// NAV Records (fund-level NAV history)
export const navRecords = pgTable("nav_records", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  fundId: integer("fund_id").notNull().references(() => fundStructures.id),

  navDate: date("nav_date").notNull(),

  // AUM
  grossAum: decimal("gross_aum", { precision: 20, scale: 2 }).notNull(),
  netAum: decimal("net_aum", { precision: 20, scale: 2 }).notNull(),

  // NAV per share
  sharesOutstanding: decimal("shares_outstanding", { precision: 20, scale: 6 }),
  navPerShare: decimal("nav_per_share", { precision: 20, scale: 6 }),

  // Performance
  mtdReturn: decimal("mtd_return", { precision: 10, scale: 6 }), // e.g. 0.0234 = 2.34%
  qtdReturn: decimal("qtd_return", { precision: 10, scale: 6 }),
  ytdReturn: decimal("ytd_return", { precision: 10, scale: 6 }),
  inceptionReturn: decimal("inception_return", { precision: 10, scale: 6 }),

  // Fees & expenses
  grossReturn: decimal("gross_return", { precision: 10, scale: 6 }),
  managementFeeAccrual: decimal("management_fee_accrual", { precision: 20, scale: 2 }),
  performanceFeeAccrual: decimal("performance_fee_accrual", { precision: 20, scale: 2 }),
  totalExpenses: decimal("total_expenses", { precision: 20, scale: 2 }),

  // Capital flows
  capitalCalled: decimal("capital_called", { precision: 20, scale: 2 }).default("0"),
  capitalReturned: decimal("capital_returned", { precision: 20, scale: 2 }).default("0"),

  // Confirmation
  confirmedByFundAdmin: boolean("confirmed_by_fund_admin").default(false),
  confirmedAt: timestamp("confirmed_at"),
  confirmedBy: integer("confirmed_by").references(() => users.id),

  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNavRecordSchema = createInsertSchema(navRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertNavRecord = z.infer<typeof insertNavRecordSchema>;
export type NavRecord = typeof navRecords.$inferSelect;
