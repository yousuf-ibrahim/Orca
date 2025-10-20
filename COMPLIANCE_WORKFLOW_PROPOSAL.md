# Orca Compliance Workflow Digitization Proposal

## Executive Summary

This document outlines a comprehensive plan to digitize Fiducia Capital's nine-folder KYC/compliance framework, transforming Word/Excel-based workflows into native, database-driven workflows within Orca.

**Goals:**
- Eliminate manual PDF/Word/Excel document management
- Create structured, searchable, auditable client records
- Implement approval workflows and periodic review cycles
- Ensure DFSA regulatory compliance with full audit trail
- Enable real-time collaboration between RMs and compliance officers

---

## 1. Database Schema Extensions

### 1.1 Core Client Data (Already Exists - Enhance)

**Existing `clients` table** - Extend with:
```typescript
// Additional fields needed:
- clientType: 'individual' | 'joint' | 'entity' | 'trust'
- isPep: boolean
- pepDetails: jsonb (role, country, relationship)
- isUsPersonholder: boolean
- usTin: varchar (if applicable)
- taxResidencies: jsonb[] (country, TIN pairs)
- dateOfBirth: date
- placeOfBirth: varchar
- currentOccupation: varchar
- employer: varchar
- sector: varchar
- relationshipStartDate: date
- lastReviewDate: date
- nextReviewDate: date
- enhancedDueDiligence: boolean
```

### 1.2 New Table: `wealth_information`

Captures source of wealth and source of funds narratives:

```typescript
{
  id: serial
  clientId: integer (FK to clients)
  sourceOfWealthNarrative: text  // Detailed story of wealth constitution
  sourceOfFundsNarrative: text   // Detailed story of funds to be invested
  totalNetWorth: decimal
  liquidAssets: decimal
  illiquidAssets: decimal
  liabilities: decimal
  annualIncome: decimal
  incomeSource: varchar
  wealthVerificationStatus: 'pending' | 'verified' | 'requires_additional_info'
  verificationPercentage: integer (0-100)
  verifiedBy: integer (FK to users)
  verifiedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
  version: integer
}
```

### 1.3 New Table: `beneficial_ownership`

For entity clients - tracks multi-layer ownership structures:

```typescript
{
  id: serial
  clientId: integer (FK to clients - entity)
  layer: integer  // 1 = direct, 2 = one level up, etc.
  ownerType: 'natural_person' | 'corporation' | 'trust' | 'nominee'
  ownerName: varchar
  ownershipPercentage: decimal
  nationality: varchar
  dateOfBirth: date (if natural person)
  passportNumber: varchar (if natural person)
  residentialAddress: text
  companyRegistrationNumber: varchar (if corporation)
  countryOfIncorporation: varchar (if corporation)
  isUltimateBeneficialOwner: boolean
  isPep: boolean
  documentIds: integer[] (FK to documents)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 1.4 New Table: `risk_assessments`

Replaces Excel-based risk scoring:

```typescript
{
  id: serial
  clientId: integer (FK to clients)
  assessmentType: 'initial' | 'periodic_review' | 'enhanced_dd'
  assessmentDate: date
  
  // Risk factors
  countryRisk: integer (1-5 scale)
  occupationRisk: integer
  productRisk: integer
  channelRisk: integer
  pepRisk: integer
  sourceOfWealthRisk: integer
  transactionPatternRisk: integer
  
  // Calculated scores
  totalRiskScore: integer (sum of above)
  riskBand: 'low' | 'medium' | 'high' | 'prohibited'
  
  // Compliance officer assessment
  assessedBy: integer (FK to users)
  assessmentNotes: text
  approvedBy: integer (FK to users)
  approvedAt: timestamp
  
  createdAt: timestamp
  version: integer
}
```

### 1.5 New Table: `suitability_assessments`

Investment suitability questionnaire responses:

```typescript
{
  id: serial
  clientId: integer (FK to clients)
  assessmentDate: date
  
  // Investment objectives
  investmentObjective: 'capital_preservation' | 'income' | 'balanced' | 'growth' | 'aggressive'
  
  // Product knowledge (array of objects)
  productKnowledge: jsonb[]  
  // [{product: 'bonds', knowledge: 'good', experience: true, transactions: 5}, ...]
  
  // Time horizon
  investmentTimeHorizon: '0-1yr' | '1-3yr' | '3-5yr' | '5-10yr' | '10+yr'
  timeHorizonScore: integer
  
  // Reliance on assets
  relianceOnAssets: integer (1-5 scale, strongly agree to strongly disagree)
  
  // Market behavior
  marketDeclineResponse: integer (1-5 scale)
  
  // Risk capacity
  portfolioDeclineTolerance: integer (% they can tolerate)
  
  // Total suitability score
  totalScore: integer
  suitabilityRating: 'conservative' | 'moderate' | 'balanced' | 'growth' | 'aggressive'
  
  assessedBy: integer (FK to users)
  approvedBy: integer (FK to users)
  createdAt: timestamp
  version: integer
}
```

### 1.6 New Table: `client_classification`

DFSA client classification (Professional vs Retail):

```typescript
{
  id: serial
  clientId: integer (FK to clients)
  classification: 'professional' | 'market_counterparty'
  classificationBasis: text  // Why they qualify
  meetsNetWorthRequirement: boolean
  meetsPortfolioRequirement: boolean
  meetsExperienceRequirement: boolean
  classificationDate: date
  classifiedBy: integer (FK to users)
  approvedBy: integer (FK to users)
  createdAt: timestamp
  version: integer
}
```

### 1.7 New Table: `rm_kyc_notes`

Relationship Manager's narrative assessments:

```typescript
{
  id: serial
  clientId: integer (FK to clients)
  relationshipManagerId: integer (FK to users)
  noteType: 'initial' | 'update' | 'periodic_review'
  noteDate: date
  
  // Narrative fields
  clientBackground: text
  relationshipWithRM: text
  relationshipWithFirm: text
  contactInitiationDetails: text
  sourceOfWealthNarrative: text
  sourceOfFundsNarrative: text
  investmentKnowledgeAssessment: text
  currentProfessionalActivities: text
  otherRelevantInformation: text
  
  signature: varchar
  signedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
  version: integer
}
```

### 1.8 New Table: `client_approvals`

Client approval committee workflow:

```typescript
{
  id: serial
  clientId: integer (FK to clients)
  submittedBy: integer (FK to users - RM)
  submittedAt: timestamp
  
  // Approval criteria
  minimumAumMet: boolean (>= $3M)
  experienceAlignedWithStrategy: boolean
  wealthCorroborationPercentage: integer (must be >= 90%)
  
  // Committee votes
  committeeMembers: jsonb[]  
  // [{userId: 1, vote: 'approve', comments: '...', votedAt: '...'}, ...]
  
  // Decision
  decision: 'pending' | 'approved' | 'rejected' | 'requires_more_info'
  decisionDate: date
  decisionRationale: text
  
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 1.9 New Table: `transaction_monitoring`

Ongoing monitoring and enhanced due diligence:

```typescript
{
  id: serial
  clientId: integer (FK to clients)
  reviewPeriodStart: date
  reviewPeriodEnd: date
  reviewType: 'periodic' | 'enhanced_dd' | 'triggered'
  triggerReason: text (if triggered)
  
  // Activity analysis
  creditTransactions: jsonb  // {count, totalValue, largestTransaction}
  debitTransactions: jsonb
  unusualActivityDetected: boolean
  unusualActivityDetails: text
  
  // Supporting documents
  supportingDocumentsReviewed: boolean
  largeTransactionsJustified: boolean
  
  // Findings
  observations: text
  actionTaken: text
  recommendations: text
  
  // Sign-offs
  preparedBy: integer (FK to users)
  reviewedByCompliance: integer (FK to users)
  reviewDate: date
  
  createdAt: timestamp
}
```

### 1.10 Enhanced `documents` Table

Add categorization and verification fields:

```typescript
// Add to existing documents table:
- category: 'passport' | 'proof_of_address' | 'proof_of_income' | 
            'corporate_registration' | 'memorandum_of_association' | 
            'beneficial_ownership_certificate' | 'tax_certificate' | 
            'bank_statement' | 'wealth_source_evidence' | 'other'
- documentSubtype: varchar (e.g., "utility bill", "bank reference letter")
- expiryDate: date (for passports, certificates)
- verified: boolean
- verifiedBy: integer (FK to users)
- verifiedAt: timestamp
- verificationNotes: text
- linkedEntityType: 'client' | 'beneficial_owner' | 'director' | 'shareholder'
- linkedEntityId: integer
- complianceFlag: boolean
- flagReason: text
```

### 1.11 Enhanced `audit_logs` Table

Comprehensive version control:

```typescript
// Add to existing audit_logs:
- recordType: varchar (table name)
- recordId: integer (ID in that table)
- fieldChanged: varchar (which field was modified)
- oldValue: jsonb
- newValue: jsonb
- changeReason: text (required for sensitive fields)
- reviewedBy: integer (FK to users - compliance officer who approved change)
- reviewedAt: timestamp
```

---

## 2. Form Structures (Replacing Word/Excel Templates)

### 2.1 Client Information Pack - Individual/Joint

**Multi-step form replacing 13-page PDF:**

**Step 1: Personal Information**
- Full name, DOB, residential address
- Nationality, tax residency (with TIN)
- Contact details
- Designated representatives

**Step 2: Status Declaration**
- PEP screening (self, spouse, family)
- US person determination (7 questions)
- US TIN collection if applicable

**Step 3: Background**
- Beneficial ownership declaration
- Current employment (status, function, employer, sector)
- Former employment
- Family/dependents information

**Step 4: Wealth & Income**
- Assets breakdown (liquid, illiquid)
- Liabilities
- Net worth calculation
- Income sources and amounts
- Expenditure patterns

**Step 5: FATCA/CRS Self-Certification**
- Tax residency declarations
- Entity classification (for joint accounts with entities)
- Controlling person identification

### 2.2 Client Information Pack - Entity

**Additional steps for entities:**

**Step 1: Company Information**
- Registered name, registration number
- Incorporation date/place, registered address
- Company type (LLC, partnership, trust, etc.)
- Purpose (investment company, operating company, SPV, etc.)
- Parent company details if applicable

**Step 2: Director Information**
- Natural person directors (full details + ID docs)
- Corporate directors (full statutory docs)
- For each corporate director → shareholder breakdown

**Step 3: Shareholder Information**
- Natural person shareholders (>25% ownership)
- Corporate shareholders (with recursive breakdown to UBOs)
- Trust shareholders (deed, beneficiaries, trustee details)
- Nominee arrangements (with nominee agreements)

**Step 4: Beneficial Ownership Map**
- Visual ownership structure diagram
- Ultimate beneficial owner identification
- Percentage ownership calculations
- PEP screening for all UBOs

### 2.3 RM KYC Notes Form

**Narrative assessment form:**
- Client background (story)
- How relationship began
- Firm's connection to client
- Source of wealth narrative (detailed story of wealth building)
- Source of funds narrative (specific funds being invested)
- Investment knowledge assessment (conversational)
- Current professional activities
- RM signature and date

**Features:**
- Rich text editor for narratives
- Auto-save drafts
- Version history
- Required before client approval submission

### 2.4 Risk Assessment Form

**Scoring matrix (replacing Excel):**

| Risk Factor | Weight | Score (1-5) | Weighted Score |
|-------------|--------|-------------|----------------|
| Country of residence | 20% | [dropdown] | Calculated |
| Occupation type | 15% | [dropdown] | Calculated |
| Product complexity | 15% | [dropdown] | Calculated |
| Delivery channel | 10% | [dropdown] | Calculated |
| PEP status | 25% | [auto] | Calculated |
| Source of wealth clarity | 15% | [dropdown] | Calculated |

**Total Risk Score:** Auto-calculated
**Risk Band:** Auto-assigned (Low <30, Medium 30-60, High >60)

**Features:**
- Guided scoring with explanatory tooltips
- Auto-calculation of totals
- Compliance officer review/override
- Justification required for overrides

### 2.5 Suitability Assessment Form

**Investment appropriateness questionnaire:**

**Section 1: Investment Objectives** (radio buttons)
- Capital preservation
- Income generation
- Balanced growth & income
- Growth
- Aggressive/speculative

**Section 2: Product Knowledge** (table)
For each product type (deposits, bonds, equities, derivatives, etc.):
- Knowledge level: Limited/Moderate/Good
- Have you traded this? Yes/No
- Transactions in last 24 months: [number input]

**Section 3: Risk Tolerance Questions**
- Investment time horizon (1yr, 1-3yr, 3-5yr, 5-10yr, 10+yr)
- Reliance on assets (5-point scale)
- Response to market decline (5-point scale)
- Portfolio decline tolerance (%, 0-40%+ range)

**Section 4: Financial Situation**
- Percentage of net worth being invested
- Other investment accounts

**Suitability Score:** Auto-calculated
**Recommendation:** Conservative/Moderate/Balanced/Growth/Aggressive

### 2.6 Enhanced Due Diligence Report

**Monitoring report form:**

**Client & Account Details** (auto-populated)
- Name, nationality, occupation
- Account types, balances, inception date
- Last EDD date

**Transaction Analysis**
- Period selector (date range)
- Auto-populated transaction summaries:
  - Credit transactions (count, total value)
  - Debit transactions (count, total value)
- Identified large transactions (flagged list)

**Observations Checklist**
- [ ] Satisfactory KYC documents obtained
- [ ] Large deposits justified with supporting docs
- [ ] Large transfers justified with rationale
- [ ] No PEPs involved (or details if yes)

**Investigation & Analysis** (text area)
**Action Taken** (text area)
**Recommendations** (text area)

**Sign-offs:**
- Prepared by (RM)
- Reviewed by (Compliance Officer)

---

## 3. Workflow Design

### 3.1 Client Onboarding Flow

```
1. RM initiates new client prospect
   ↓
2. RM completes RM KYC Notes (narrative assessment)
   ↓
3. Client fills/RM enters Client Information Pack
   - Personal details
   - PEP/US person screening
   - Wealth information
   - FATCA/CRS declaration
   ↓
4. RM uploads supporting documents
   - Passport, proof of address
   - Corporate docs (if entity)
   - Beneficial ownership evidence
   - Wealth source documentation
   ↓
5. System auto-generates Risk Assessment (pre-filled scores)
   ↓
6. Compliance Officer reviews & finalizes Risk Assessment
   ↓
7. Client completes Suitability Questionnaire
   ↓
8. System auto-calculates suitability score
   ↓
9. RM submits to Client Approval Committee
   - All forms attached
   - AUM confirmation (>$3M)
   - Wealth corroboration % (must be >90%)
   ↓
10. Committee members vote (unanimous required)
   ↓
11a. If approved → Client onboarded, KYC status = APPROVED
11b. If rejected → Return to RM with feedback
11c. If "needs more info" → RM updates and resubmits
```

### 3.2 Periodic Review Flow

```
System triggers review based on:
- Annual anniversary
- Risk band (High = quarterly, Medium = semi-annual, Low = annual)
- Material change in circumstances
- Regulatory requirement

1. System creates review task assigned to RM
   ↓
2. RM completes KYC Update Form
   - What's changed since last review?
   - Updated narratives
   ↓
3. Client confirms/updates personal information
   ↓
4. RM uploads new supporting documents if needed
   ↓
5. Compliance Officer re-runs Risk Assessment
   ↓
6. If risk band increased → Enhanced DD triggered
   ↓
7. Sign-off by Compliance
   ↓
8. Next review date automatically set
```

### 3.3 Enhanced Due Diligence (EDD) Flow

```
Triggered by:
- High risk client classification
- Unusual transaction patterns
- PEP involvement
- Regulatory request

1. Compliance Officer initiates EDD
   ↓
2. System pulls transaction data for review period
   ↓
3. Officer analyzes:
   - Transaction patterns
   - Large/unusual transactions
   - Supporting documentation
   ↓
4. Officer completes EDD Report
   - Observations
   - Findings
   - Recommendations
   ↓
5. Actions taken:
   - Request additional docs
   - Update risk assessment
   - Escalate to senior management
   - File SAR (if suspicious)
   - Continue monitoring
   ↓
6. EDD saved to client record
   ↓
7. Next EDD date scheduled based on outcome
```

### 3.4 Transaction Monitoring Flow

```
Automated + Manual Process:

Automated:
- System tracks all transactions
- Flags based on rules:
  - Single transaction > $50K
  - Monthly volume > $500K
  - Pattern deviation from stated investment objective
  - High-risk country involvement

Manual:
- RM reviews flagged transactions
- Adds justification/rationale
- Uploads supporting documentation

Compliance:
- Quarterly review of all flagged transactions
- Enhanced DD for persistent flags
- SAR filing if warranted
```

---

## 4. Document Management System

### 4.1 Document Categories

**Client Documents:**
- Identity (passport, national ID, driver's license)
- Address proof (utility bill, bank statement, lease)
- Income proof (salary slip, bank statements, tax returns)
- Wealth source evidence (sale agreements, inheritance docs, business valuations)

**Entity Documents:**
- Certificate of incorporation
- Memorandum & articles of association
- Register of directors
- Register of members/shareholders
- Certificate of incumbency (<3 months)
- Certificate of good standing (<3 months)
- Audited financials (if operating company)

**Beneficial Owner Documents** (for each UBO):
- Passport copy
- Proof of address
- Nominee agreements (if applicable)

**Compliance Documents:**
- FATCA/CRS self-certifications
- PEP declarations
- Suitability questionnaires (completed)
- Risk assessments (signed)
- Client agreements (executed)

### 4.2 Document Upload & Verification Workflow

```
1. RM/Client uploads document
   - Select category
   - Select subtype
   - Link to client/beneficial owner/entity
   - Add expiry date (if applicable)
   ↓
2. Document appears in client file as "Pending Verification"
   ↓
3. Compliance Officer reviews document
   - Checks quality, validity, expiry
   - Verifies against stated information
   ↓
4. Officer marks as:
   - Verified ✓
   - Rejected (with reason) ✗
   - Requires clarification ⚠
   ↓
5. If verified → Document status = "Verified"
   If rejected → RM notified to re-upload
   If clarification needed → Task created for RM
   ↓
6. Document expiry tracking:
   - System alerts 30 days before expiry
   - Auto-flags client for document update
```

### 4.3 Document Storage & Tagging

**Metadata captured:**
- Upload date/time
- Uploaded by (user)
- Client/entity/UBO link
- Category & subtype
- Expiry date
- Verification status
- Verified by (user)
- Verification date
- Compliance flags
- Version (if replaced)

**Search & Filtering:**
- By client
- By document type
- By expiry date range
- By verification status
- By uploaded date
- By uploader

---

## 5. Version Control & Audit Trail

### 5.1 Change Tracking

**All data changes logged with:**
- Timestamp (down to the second)
- User who made change
- Table/record affected
- Field changed
- Old value → New value
- Reason for change (required for sensitive fields)
- IP address
- Compliance officer approval (for certain changes)

**Sensitive fields requiring approval:**
- Risk scores (manual overrides)
- Client classification
- Beneficial ownership structures
- Tax residency information
- PEP status

### 5.2 Point-in-Time Recovery

**View historical state:**
- "View client as of [date]" feature
- Shows exactly what information was recorded at any past date
- Critical for regulatory audits

### 5.3 Audit Reports

**System can generate:**
- Complete client file history
- All changes to specific client
- All actions by specific user
- All documents uploaded in date range
- All risk assessment changes
- All approval committee decisions

**Export formats:**
- PDF (for DFSA submission)
- Excel (for analysis)
- JSON (for system integration)

---

## 6. Implementation Phases

### Phase 1: Core KYC Digitization (Weeks 1-3)
- Extend database schema
- Build Client Information Pack forms (Individual & Entity)
- Implement RM KYC Notes form
- Create document upload system with categorization
- Basic version control

### Phase 2: Risk & Suitability (Weeks 4-5)
- Build Risk Assessment scoring engine
- Create Suitability Questionnaire
- Implement auto-calculation logic
- Compliance officer review workflow

### Phase 3: Approval Workflow (Week 6)
- Client Approval Committee system
- Voting mechanism
- Decision tracking
- Notification system

### Phase 4: Beneficial Ownership (Week 7-8)
- Multi-layer ownership tracking
- UBO identification
- Visual ownership diagrams
- Corporate structure management

### Phase 5: Monitoring & Periodic Review (Week 9-10)
- Transaction monitoring dashboards
- Enhanced Due Diligence workflow
- Periodic review scheduling
- Alert/notification system

### Phase 6: Advanced Features (Week 11-12)
- Point-in-time recovery
- Audit report generation
- Document expiry tracking
- Bulk operations
- API integrations (custodians, data providers)

---

## 7. User Experience Considerations

### 7.1 Progressive Disclosure
- Don't overwhelm users with all fields at once
- Show relevant sections based on client type
- Conditional fields (e.g., UBO details only for entities)

### 7.2 Auto-Save & Drafts
- All forms auto-save every 30 seconds
- "Save as draft" vs "Submit for review"
- Resume where you left off

### 7.3 Smart Defaults
- Pre-populate from previous clients where appropriate
- Remember RM's preferences
- Learn from patterns (e.g., most common occupations)

### 7.4 Validation & Guidance
- Real-time validation
- Helpful error messages
- Tooltips explaining regulatory requirements
- Examples of good vs bad narratives

### 7.5 Mobile Considerations
- RMs may want to complete notes on iPad
- Clients may fill forms on mobile
- Responsive design critical

---

## 8. Regulatory Compliance Notes

### 8.1 DFSA Requirements Met
- Professional client classification
- Suitability assessment
- Risk-based approach to due diligence
- PEP identification
- Source of funds verification
- Ongoing monitoring
- Record retention (7 years minimum)

### 8.2 FATCA/CRS Compliance
- Self-certification forms digitized
- Controlling person identification
- Reportable account flagging
- Annual reporting data extraction

### 8.3 AML Compliance
- Enhanced DD for high-risk clients
- Transaction monitoring
- Suspicious activity detection
- SAR filing workflow (future enhancement)

---

## 9. Success Metrics

**Efficiency Gains:**
- Client onboarding time: 2-3 weeks → 3-5 days
- Document retrieval: 10 minutes → 10 seconds
- Compliance review time: 4 hours → 1 hour
- Audit preparation: 2 weeks → 2 days

**Quality Improvements:**
- Zero missing documents (system enforces)
- 100% data completeness (required fields)
- Reduced errors (validation rules)
- Full audit trail (regulatory confidence)

**User Satisfaction:**
- RMs: Streamlined workflow, mobile access
- Compliance: Centralized view, automation
- Clients: Professional experience, transparency
- Management: Real-time oversight, reporting

---

## 10. Next Steps

1. **Review & Feedback:** Stakeholder review of this proposal
2. **Prioritization:** Decide which phases are MVP vs nice-to-have
3. **Design Mockups:** Create UI/UX designs for key forms
4. **Technical Architecture:** Detailed API design, database optimization
5. **Development:** Begin Phase 1 implementation
6. **Testing:** Pilot with 1-2 live clients
7. **Training:** RM and compliance officer onboarding
8. **Rollout:** Gradual migration of existing clients
9. **Continuous Improvement:** Gather feedback, iterate

---

## Appendix A: Data Migration Plan

**Existing clients in Word/Excel:**
- Extract data using OCR + manual verification
- Bulk import into new system
- Flag for "needs verification"
- Compliance officer spot-checks

**Documents:**
- Current PDFs remain in document management
- Tagged with categories retroactively
- New uploads follow new workflow

**Historical records:**
- Maintain read-only archive of old files
- Link to new digital records
- 7-year retention policy

---

## Appendix B: Integration Opportunities

**Potential integrations:**
- **Custodians (BNY Mellon, UBS, etc.):** Auto-import transaction data
- **Sanctions Screening:** Real-time PEP/sanctions checks
- **Document Verification:** Automated ID verification (Onfido, Jumio)
- **AML Tools:** Transaction monitoring (NICE Actimize, SAS)
- **Reporting:** Automated DFSA reporting
- **CRM:** Sync with Salesforce/HubSpot if used
- **E-signature:** DocuSign for client agreements
