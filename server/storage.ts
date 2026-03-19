import { db } from "./db";
import {
  clients,
  kycApplications,
  documents,
  auditLogs,
  wealthInformation,
  beneficialOwnership,
  riskAssessments,
  suitabilityAssessments,
  clientClassification,
  rmKycNotes,
  clientApprovals,
  transactionMonitoring,
  securitiesMaster,
  custodians,
  portfolios,
  positions,
  reconRuns,
  reconBreaks,
  fundStructures,
  lpCommitments,
  capitalCalls,
  capitalCallAllocations,
  capitalDistributions,
  navRecords,
  type Client,
  type InsertClient,
  type KycApplication,
  type InsertKycApplication,
  type Document,
  type InsertDocument,
  type AuditLog,
  type InsertAuditLog,
  type WealthInformation,
  type InsertWealthInformation,
  type BeneficialOwnership,
  type InsertBeneficialOwnership,
  type RiskAssessment,
  type InsertRiskAssessment,
  type SuitabilityAssessment,
  type InsertSuitabilityAssessment,
  type ClientClassification,
  type InsertClientClassification,
  type RmKycNote,
  type InsertRmKycNote,
  type ClientApproval,
  type InsertClientApproval,
  type TransactionMonitoring,
  type InsertTransactionMonitoring,
  type SecurityMaster,
  type InsertSecurityMaster,
  type Custodian,
  type InsertCustodian,
  type Portfolio,
  type InsertPortfolio,
  type Position,
  type InsertPosition,
  type ReconRun,
  type InsertReconRun,
  type ReconBreak,
  type InsertReconBreak,
  type FundStructure,
  type InsertFundStructure,
  type LpCommitment,
  type InsertLpCommitment,
  type CapitalCall,
  type InsertCapitalCall,
  type CapitalCallAllocation,
  type InsertCapitalCallAllocation,
  type CapitalDistribution,
  type InsertCapitalDistribution,
  type NavRecord,
  type InsertNavRecord,
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // Clients
  getClients(firmId: number): Promise<Client[]>;
  getClient(id: number, firmId: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, firmId: number, data: Partial<InsertClient>): Promise<Client | undefined>;
  
  // KYC Applications
  getKycApplications(firmId: number): Promise<KycApplication[]>;
  getKycApplication(id: number, firmId: number): Promise<KycApplication | undefined>;
  getKycApplicationByClient(clientId: number, firmId: number): Promise<KycApplication | undefined>;
  createKycApplication(application: InsertKycApplication): Promise<KycApplication>;
  updateKycApplication(id: number, firmId: number, data: Partial<InsertKycApplication>): Promise<KycApplication | undefined>;
  
  // Documents
  getDocuments(kycApplicationId: number, firmId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, firmId: number, data: Partial<InsertDocument>): Promise<Document | undefined>;
  
  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(firmId: number, limit?: number): Promise<AuditLog[]>;
  
  // Dashboard Stats
  getDashboardStats(firmId: number): Promise<{
    totalClients: number;
    pendingReviews: number;
    approvedThisMonth: number;
    avgProcessingDays: number;
  }>;
  
  // Wealth Information
  getWealthInformation(clientId: number, firmId: number): Promise<WealthInformation | undefined>;
  createWealthInformation(data: InsertWealthInformation): Promise<WealthInformation>;
  updateWealthInformation(id: number, firmId: number, data: Partial<InsertWealthInformation>): Promise<WealthInformation | undefined>;
  
  // Beneficial Ownership
  getBeneficialOwnership(clientId: number, firmId: number): Promise<BeneficialOwnership[]>;
  createBeneficialOwnership(data: InsertBeneficialOwnership): Promise<BeneficialOwnership>;
  updateBeneficialOwnership(id: number, firmId: number, data: Partial<InsertBeneficialOwnership>): Promise<BeneficialOwnership | undefined>;
  deleteBeneficialOwnership(id: number, firmId: number): Promise<void>;
  
  // Risk Assessments
  getRiskAssessments(clientId: number, firmId: number): Promise<RiskAssessment[]>;
  getLatestRiskAssessment(clientId: number, firmId: number): Promise<RiskAssessment | undefined>;
  createRiskAssessment(data: InsertRiskAssessment): Promise<RiskAssessment>;
  
  // Suitability Assessments
  getSuitabilityAssessments(clientId: number, firmId: number): Promise<SuitabilityAssessment[]>;
  getLatestSuitabilityAssessment(clientId: number, firmId: number): Promise<SuitabilityAssessment | undefined>;
  createSuitabilityAssessment(data: InsertSuitabilityAssessment): Promise<SuitabilityAssessment>;
  
  // Client Classification
  getClientClassification(clientId: number, firmId: number): Promise<ClientClassification | undefined>;
  createClientClassification(data: InsertClientClassification): Promise<ClientClassification>;
  
  // RM KYC Notes
  getRmKycNotes(clientId: number, firmId: number): Promise<RmKycNote[]>;
  createRmKycNote(data: InsertRmKycNote): Promise<RmKycNote>;
  updateRmKycNote(id: number, firmId: number, data: Partial<InsertRmKycNote>): Promise<RmKycNote | undefined>;
  
  // Client Approvals
  getClientApproval(clientId: number, firmId: number): Promise<ClientApproval | undefined>;
  createClientApproval(data: InsertClientApproval): Promise<ClientApproval>;
  updateClientApproval(id: number, firmId: number, data: Partial<InsertClientApproval>): Promise<ClientApproval | undefined>;
  
  // Transaction Monitoring
  getTransactionMonitoring(clientId: number, firmId: number): Promise<TransactionMonitoring[]>;
  createTransactionMonitoring(data: InsertTransactionMonitoring): Promise<TransactionMonitoring>;
  
  // Securities Master
  getSecurities(firmId: number): Promise<SecurityMaster[]>;
  getSecurity(id: number, firmId: number): Promise<SecurityMaster | undefined>;
  createSecurity(data: InsertSecurityMaster): Promise<SecurityMaster>;
  updateSecurity(id: number, firmId: number, data: Partial<InsertSecurityMaster>): Promise<SecurityMaster | undefined>;
  
  // Custodians
  getCustodians(firmId: number): Promise<Custodian[]>;
  getCustodian(id: number, firmId: number): Promise<Custodian | undefined>;
  createCustodian(data: InsertCustodian): Promise<Custodian>;
  updateCustodian(id: number, firmId: number, data: Partial<InsertCustodian>): Promise<Custodian | undefined>;
  
  // Portfolios
  getPortfolios(firmId: number): Promise<Portfolio[]>;
  getPortfolio(id: number, firmId: number): Promise<Portfolio | undefined>;
  getPortfoliosByClient(clientId: number, firmId: number): Promise<Portfolio[]>;
  createPortfolio(data: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, firmId: number, data: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  
  // Positions
  getPositions(portfolioId: number, firmId: number): Promise<Position[]>;
  getPosition(id: number, firmId: number): Promise<Position | undefined>;
  createPosition(data: InsertPosition): Promise<Position>;
  updatePosition(id: number, firmId: number, data: Partial<InsertPosition>): Promise<Position | undefined>;
  deletePosition(id: number, firmId: number): Promise<void>;

  // Recon Runs
  getReconRuns(firmId: number): Promise<ReconRun[]>;
  getReconRun(id: number, firmId: number): Promise<ReconRun | undefined>;
  createReconRun(data: InsertReconRun): Promise<ReconRun>;
  updateReconRun(id: number, firmId: number, data: Partial<InsertReconRun>): Promise<ReconRun | undefined>;

  // Recon Breaks
  getReconBreaks(firmId: number, reconRunId?: number): Promise<ReconBreak[]>;
  getReconBreak(id: number, firmId: number): Promise<ReconBreak | undefined>;
  createReconBreak(data: InsertReconBreak): Promise<ReconBreak>;
  updateReconBreak(id: number, firmId: number, data: Partial<InsertReconBreak>): Promise<ReconBreak | undefined>;
  getOpenReconBreaks(firmId: number): Promise<ReconBreak[]>;

  // Fund Structures
  getFundStructures(firmId: number): Promise<FundStructure[]>;
  getFundStructure(id: number, firmId: number): Promise<FundStructure | undefined>;
  createFundStructure(data: InsertFundStructure): Promise<FundStructure>;
  updateFundStructure(id: number, firmId: number, data: Partial<InsertFundStructure>): Promise<FundStructure | undefined>;

  // LP Commitments
  getLpCommitments(firmId: number, fundId?: number): Promise<LpCommitment[]>;
  getLpCommitment(id: number, firmId: number): Promise<LpCommitment | undefined>;
  createLpCommitment(data: InsertLpCommitment): Promise<LpCommitment>;
  updateLpCommitment(id: number, firmId: number, data: Partial<InsertLpCommitment>): Promise<LpCommitment | undefined>;

  // Capital Calls
  getCapitalCalls(firmId: number, fundId?: number): Promise<CapitalCall[]>;
  getCapitalCall(id: number, firmId: number): Promise<CapitalCall | undefined>;
  createCapitalCall(data: InsertCapitalCall): Promise<CapitalCall>;
  updateCapitalCall(id: number, firmId: number, data: Partial<InsertCapitalCall>): Promise<CapitalCall | undefined>;

  // Capital Call Allocations
  getCapitalCallAllocations(capitalCallId: number, firmId: number): Promise<CapitalCallAllocation[]>;
  createCapitalCallAllocation(data: InsertCapitalCallAllocation): Promise<CapitalCallAllocation>;
  updateCapitalCallAllocation(id: number, firmId: number, data: Partial<InsertCapitalCallAllocation>): Promise<CapitalCallAllocation | undefined>;

  // Capital Distributions
  getCapitalDistributions(firmId: number, fundId?: number): Promise<CapitalDistribution[]>;
  getCapitalDistribution(id: number, firmId: number): Promise<CapitalDistribution | undefined>;
  createCapitalDistribution(data: InsertCapitalDistribution): Promise<CapitalDistribution>;
  updateCapitalDistribution(id: number, firmId: number, data: Partial<InsertCapitalDistribution>): Promise<CapitalDistribution | undefined>;

  // NAV Records
  getNavRecords(firmId: number, fundId?: number): Promise<NavRecord[]>;
  getLatestNavRecord(fundId: number, firmId: number): Promise<NavRecord | undefined>;
  createNavRecord(data: InsertNavRecord): Promise<NavRecord>;
  updateNavRecord(id: number, firmId: number, data: Partial<InsertNavRecord>): Promise<NavRecord | undefined>;
}

export class DbStorage implements IStorage {
  // Clients
  async getClients(firmId: number): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.firmId, firmId)).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number, firmId: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(
      and(eq(clients.id, id), eq(clients.firmId, firmId))
    );
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async updateClient(id: number, firmId: number, data: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db.update(clients)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(clients.id, id), eq(clients.firmId, firmId)))
      .returning();
    return result[0];
  }

  // KYC Applications
  async getKycApplications(firmId: number): Promise<KycApplication[]> {
    return db.select().from(kycApplications).where(eq(kycApplications.firmId, firmId)).orderBy(desc(kycApplications.createdAt));
  }

  async getKycApplication(id: number, firmId: number): Promise<KycApplication | undefined> {
    const result = await db.select().from(kycApplications).where(
      and(eq(kycApplications.id, id), eq(kycApplications.firmId, firmId))
    );
    return result[0];
  }

  async getKycApplicationByClient(clientId: number, firmId: number): Promise<KycApplication | undefined> {
    const result = await db.select().from(kycApplications).where(
      and(eq(kycApplications.clientId, clientId), eq(kycApplications.firmId, firmId))
    ).orderBy(desc(kycApplications.createdAt));
    return result[0];
  }

  async createKycApplication(application: InsertKycApplication): Promise<KycApplication> {
    const result = await db.insert(kycApplications).values(application).returning();
    return result[0];
  }

  async updateKycApplication(id: number, firmId: number, data: Partial<InsertKycApplication>): Promise<KycApplication | undefined> {
    const result = await db.update(kycApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(kycApplications.id, id), eq(kycApplications.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Documents
  async getDocuments(kycApplicationId: number, firmId: number): Promise<Document[]> {
    return db.select().from(documents).where(
      and(eq(documents.kycApplicationId, kycApplicationId), eq(documents.firmId, firmId))
    ).orderBy(desc(documents.createdAt));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(document).returning();
    return result[0];
  }

  async updateDocument(id: number, firmId: number, data: Partial<InsertDocument>): Promise<Document | undefined> {
    const result = await db.update(documents)
      .set(data)
      .where(and(eq(documents.id, id), eq(documents.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Audit Logs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values(log).returning();
    return result[0];
  }

  async getAuditLogs(firmId: number, limit: number = 50): Promise<AuditLog[]> {
    return db.select().from(auditLogs)
      .where(eq(auditLogs.firmId, firmId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // Dashboard Stats
  async getDashboardStats(firmId: number): Promise<{
    totalClients: number;
    pendingReviews: number;
    approvedThisMonth: number;
    avgProcessingDays: number;
  }> {
    const totalResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(clients)
      .where(eq(clients.firmId, firmId));
    
    const pendingResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(kycApplications)
      .where(and(
        eq(kycApplications.firmId, firmId),
        eq(kycApplications.status, "submitted")
      ));
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const approvedResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(kycApplications)
      .where(and(
        eq(kycApplications.firmId, firmId),
        eq(kycApplications.status, "approved"),
        sql`${kycApplications.reviewedAt} >= ${monthStart}`
      ));
    
    return {
      totalClients: totalResult[0]?.count || 0,
      pendingReviews: pendingResult[0]?.count || 0,
      approvedThisMonth: approvedResult[0]?.count || 0,
      avgProcessingDays: 3.2,
    };
  }

  // Wealth Information
  async getWealthInformation(clientId: number, firmId: number): Promise<WealthInformation | undefined> {
    const result = await db.select().from(wealthInformation).where(
      and(eq(wealthInformation.clientId, clientId), eq(wealthInformation.firmId, firmId))
    ).orderBy(desc(wealthInformation.createdAt));
    return result[0];
  }

  async createWealthInformation(data: InsertWealthInformation): Promise<WealthInformation> {
    const result = await db.insert(wealthInformation).values(data).returning();
    return result[0];
  }

  async updateWealthInformation(id: number, firmId: number, data: Partial<InsertWealthInformation>): Promise<WealthInformation | undefined> {
    const result = await db.update(wealthInformation)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(wealthInformation.id, id), eq(wealthInformation.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Beneficial Ownership
  async getBeneficialOwnership(clientId: number, firmId: number): Promise<BeneficialOwnership[]> {
    return db.select().from(beneficialOwnership).where(
      and(eq(beneficialOwnership.clientId, clientId), eq(beneficialOwnership.firmId, firmId))
    ).orderBy(beneficialOwnership.layer);
  }

  async createBeneficialOwnership(data: InsertBeneficialOwnership): Promise<BeneficialOwnership> {
    const result = await db.insert(beneficialOwnership).values(data).returning();
    return result[0];
  }

  async updateBeneficialOwnership(id: number, firmId: number, data: Partial<InsertBeneficialOwnership>): Promise<BeneficialOwnership | undefined> {
    const result = await db.update(beneficialOwnership)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(beneficialOwnership.id, id), eq(beneficialOwnership.firmId, firmId)))
      .returning();
    return result[0];
  }

  async deleteBeneficialOwnership(id: number, firmId: number): Promise<void> {
    await db.delete(beneficialOwnership).where(
      and(eq(beneficialOwnership.id, id), eq(beneficialOwnership.firmId, firmId))
    );
  }

  // Risk Assessments
  async getRiskAssessments(clientId: number, firmId: number): Promise<RiskAssessment[]> {
    return db.select().from(riskAssessments).where(
      and(eq(riskAssessments.clientId, clientId), eq(riskAssessments.firmId, firmId))
    ).orderBy(desc(riskAssessments.assessmentDate));
  }

  async getLatestRiskAssessment(clientId: number, firmId: number): Promise<RiskAssessment | undefined> {
    const result = await db.select().from(riskAssessments).where(
      and(eq(riskAssessments.clientId, clientId), eq(riskAssessments.firmId, firmId))
    ).orderBy(desc(riskAssessments.assessmentDate)).limit(1);
    return result[0];
  }

  async createRiskAssessment(data: InsertRiskAssessment): Promise<RiskAssessment> {
    const result = await db.insert(riskAssessments).values(data).returning();
    return result[0];
  }

  // Suitability Assessments
  async getSuitabilityAssessments(clientId: number, firmId: number): Promise<SuitabilityAssessment[]> {
    return db.select().from(suitabilityAssessments).where(
      and(eq(suitabilityAssessments.clientId, clientId), eq(suitabilityAssessments.firmId, firmId))
    ).orderBy(desc(suitabilityAssessments.assessmentDate));
  }

  async getLatestSuitabilityAssessment(clientId: number, firmId: number): Promise<SuitabilityAssessment | undefined> {
    const result = await db.select().from(suitabilityAssessments).where(
      and(eq(suitabilityAssessments.clientId, clientId), eq(suitabilityAssessments.firmId, firmId))
    ).orderBy(desc(suitabilityAssessments.assessmentDate)).limit(1);
    return result[0];
  }

  async createSuitabilityAssessment(data: InsertSuitabilityAssessment): Promise<SuitabilityAssessment> {
    const result = await db.insert(suitabilityAssessments).values(data).returning();
    return result[0];
  }

  // Client Classification
  async getClientClassification(clientId: number, firmId: number): Promise<ClientClassification | undefined> {
    const result = await db.select().from(clientClassification).where(
      and(eq(clientClassification.clientId, clientId), eq(clientClassification.firmId, firmId))
    ).orderBy(desc(clientClassification.createdAt));
    return result[0];
  }

  async createClientClassification(data: InsertClientClassification): Promise<ClientClassification> {
    const result = await db.insert(clientClassification).values(data).returning();
    return result[0];
  }

  // RM KYC Notes
  async getRmKycNotes(clientId: number, firmId: number): Promise<RmKycNote[]> {
    return db.select().from(rmKycNotes).where(
      and(eq(rmKycNotes.clientId, clientId), eq(rmKycNotes.firmId, firmId))
    ).orderBy(desc(rmKycNotes.noteDate));
  }

  async createRmKycNote(data: InsertRmKycNote): Promise<RmKycNote> {
    const result = await db.insert(rmKycNotes).values(data).returning();
    return result[0];
  }

  async updateRmKycNote(id: number, firmId: number, data: Partial<InsertRmKycNote>): Promise<RmKycNote | undefined> {
    const result = await db.update(rmKycNotes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(rmKycNotes.id, id), eq(rmKycNotes.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Client Approvals
  async getClientApproval(clientId: number, firmId: number): Promise<ClientApproval | undefined> {
    const result = await db.select().from(clientApprovals).where(
      and(eq(clientApprovals.clientId, clientId), eq(clientApprovals.firmId, firmId))
    ).orderBy(desc(clientApprovals.createdAt));
    return result[0];
  }

  async createClientApproval(data: InsertClientApproval): Promise<ClientApproval> {
    const result = await db.insert(clientApprovals).values(data).returning();
    return result[0];
  }

  async updateClientApproval(id: number, firmId: number, data: Partial<InsertClientApproval>): Promise<ClientApproval | undefined> {
    const result = await db.update(clientApprovals)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(clientApprovals.id, id), eq(clientApprovals.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Transaction Monitoring
  async getTransactionMonitoring(clientId: number, firmId: number): Promise<TransactionMonitoring[]> {
    return db.select().from(transactionMonitoring).where(
      and(eq(transactionMonitoring.clientId, clientId), eq(transactionMonitoring.firmId, firmId))
    ).orderBy(desc(transactionMonitoring.reviewDate));
  }

  async createTransactionMonitoring(data: InsertTransactionMonitoring): Promise<TransactionMonitoring> {
    const result = await db.insert(transactionMonitoring).values(data).returning();
    return result[0];
  }

  // Securities Master
  async getSecurities(firmId: number): Promise<SecurityMaster[]> {
    return db.select().from(securitiesMaster).where(eq(securitiesMaster.firmId, firmId)).orderBy(desc(securitiesMaster.createdAt));
  }

  async getSecurity(id: number, firmId: number): Promise<SecurityMaster | undefined> {
    const result = await db.select().from(securitiesMaster).where(
      and(eq(securitiesMaster.id, id), eq(securitiesMaster.firmId, firmId))
    );
    return result[0];
  }

  async createSecurity(data: InsertSecurityMaster): Promise<SecurityMaster> {
    const result = await db.insert(securitiesMaster).values(data).returning();
    return result[0];
  }

  async updateSecurity(id: number, firmId: number, data: Partial<InsertSecurityMaster>): Promise<SecurityMaster | undefined> {
    const result = await db.update(securitiesMaster)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(securitiesMaster.id, id), eq(securitiesMaster.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Custodians
  async getCustodians(firmId: number): Promise<Custodian[]> {
    return db.select().from(custodians).where(eq(custodians.firmId, firmId)).orderBy(desc(custodians.createdAt));
  }

  async getCustodian(id: number, firmId: number): Promise<Custodian | undefined> {
    const result = await db.select().from(custodians).where(
      and(eq(custodians.id, id), eq(custodians.firmId, firmId))
    );
    return result[0];
  }

  async createCustodian(data: InsertCustodian): Promise<Custodian> {
    const result = await db.insert(custodians).values(data).returning();
    return result[0];
  }

  async updateCustodian(id: number, firmId: number, data: Partial<InsertCustodian>): Promise<Custodian | undefined> {
    const result = await db.update(custodians)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(custodians.id, id), eq(custodians.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Portfolios
  async getPortfolios(firmId: number): Promise<Portfolio[]> {
    return db.select().from(portfolios).where(eq(portfolios.firmId, firmId)).orderBy(desc(portfolios.createdAt));
  }

  async getPortfolio(id: number, firmId: number): Promise<Portfolio | undefined> {
    const result = await db.select().from(portfolios).where(
      and(eq(portfolios.id, id), eq(portfolios.firmId, firmId))
    );
    return result[0];
  }

  async getPortfoliosByClient(clientId: number, firmId: number): Promise<Portfolio[]> {
    return db.select().from(portfolios).where(
      and(eq(portfolios.clientId, clientId), eq(portfolios.firmId, firmId))
    ).orderBy(desc(portfolios.createdAt));
  }

  async createPortfolio(data: InsertPortfolio): Promise<Portfolio> {
    const result = await db.insert(portfolios).values(data).returning();
    return result[0];
  }

  async updatePortfolio(id: number, firmId: number, data: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const result = await db.update(portfolios)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(portfolios.id, id), eq(portfolios.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Positions
  async getPositions(portfolioId: number, firmId: number): Promise<Position[]> {
    return db.select().from(positions).where(
      and(eq(positions.portfolioId, portfolioId), eq(positions.firmId, firmId))
    ).orderBy(desc(positions.positionDate));
  }

  async getPosition(id: number, firmId: number): Promise<Position | undefined> {
    const result = await db.select().from(positions).where(
      and(eq(positions.id, id), eq(positions.firmId, firmId))
    );
    return result[0];
  }

  async createPosition(data: InsertPosition): Promise<Position> {
    const result = await db.insert(positions).values(data).returning();
    return result[0];
  }

  async updatePosition(id: number, firmId: number, data: Partial<InsertPosition>): Promise<Position | undefined> {
    const result = await db.update(positions)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(positions.id, id), eq(positions.firmId, firmId)))
      .returning();
    return result[0];
  }

  async deletePosition(id: number, firmId: number): Promise<void> {
    await db.delete(positions).where(
      and(eq(positions.id, id), eq(positions.firmId, firmId))
    );
  }

  // Recon Runs
  async getReconRuns(firmId: number): Promise<ReconRun[]> {
    return db.select().from(reconRuns).where(eq(reconRuns.firmId, firmId)).orderBy(desc(reconRuns.runDate));
  }

  async getReconRun(id: number, firmId: number): Promise<ReconRun | undefined> {
    const result = await db.select().from(reconRuns).where(and(eq(reconRuns.id, id), eq(reconRuns.firmId, firmId)));
    return result[0];
  }

  async createReconRun(data: InsertReconRun): Promise<ReconRun> {
    const result = await db.insert(reconRuns).values(data).returning();
    return result[0];
  }

  async updateReconRun(id: number, firmId: number, data: Partial<InsertReconRun>): Promise<ReconRun | undefined> {
    const result = await db.update(reconRuns)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(reconRuns.id, id), eq(reconRuns.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Recon Breaks
  async getReconBreaks(firmId: number, reconRunId?: number): Promise<ReconBreak[]> {
    if (reconRunId) {
      return db.select().from(reconBreaks).where(
        and(eq(reconBreaks.firmId, firmId), eq(reconBreaks.reconRunId, reconRunId))
      ).orderBy(desc(reconBreaks.createdAt));
    }
    return db.select().from(reconBreaks).where(eq(reconBreaks.firmId, firmId)).orderBy(desc(reconBreaks.createdAt));
  }

  async getReconBreak(id: number, firmId: number): Promise<ReconBreak | undefined> {
    const result = await db.select().from(reconBreaks).where(and(eq(reconBreaks.id, id), eq(reconBreaks.firmId, firmId)));
    return result[0];
  }

  async createReconBreak(data: InsertReconBreak): Promise<ReconBreak> {
    const result = await db.insert(reconBreaks).values(data).returning();
    return result[0];
  }

  async updateReconBreak(id: number, firmId: number, data: Partial<InsertReconBreak>): Promise<ReconBreak | undefined> {
    const result = await db.update(reconBreaks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(reconBreaks.id, id), eq(reconBreaks.firmId, firmId)))
      .returning();
    return result[0];
  }

  async getOpenReconBreaks(firmId: number): Promise<ReconBreak[]> {
    return db.select().from(reconBreaks).where(
      and(eq(reconBreaks.firmId, firmId), eq(reconBreaks.status, "open"))
    ).orderBy(desc(reconBreaks.createdAt));
  }

  // Fund Structures
  async getFundStructures(firmId: number): Promise<FundStructure[]> {
    return db.select().from(fundStructures).where(eq(fundStructures.firmId, firmId)).orderBy(desc(fundStructures.createdAt));
  }

  async getFundStructure(id: number, firmId: number): Promise<FundStructure | undefined> {
    const result = await db.select().from(fundStructures).where(and(eq(fundStructures.id, id), eq(fundStructures.firmId, firmId)));
    return result[0];
  }

  async createFundStructure(data: InsertFundStructure): Promise<FundStructure> {
    const result = await db.insert(fundStructures).values(data).returning();
    return result[0];
  }

  async updateFundStructure(id: number, firmId: number, data: Partial<InsertFundStructure>): Promise<FundStructure | undefined> {
    const result = await db.update(fundStructures)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(fundStructures.id, id), eq(fundStructures.firmId, firmId)))
      .returning();
    return result[0];
  }

  // LP Commitments
  async getLpCommitments(firmId: number, fundId?: number): Promise<LpCommitment[]> {
    if (fundId) {
      return db.select().from(lpCommitments).where(
        and(eq(lpCommitments.firmId, firmId), eq(lpCommitments.fundId, fundId))
      ).orderBy(desc(lpCommitments.commitmentDate));
    }
    return db.select().from(lpCommitments).where(eq(lpCommitments.firmId, firmId)).orderBy(desc(lpCommitments.commitmentDate));
  }

  async getLpCommitment(id: number, firmId: number): Promise<LpCommitment | undefined> {
    const result = await db.select().from(lpCommitments).where(and(eq(lpCommitments.id, id), eq(lpCommitments.firmId, firmId)));
    return result[0];
  }

  async createLpCommitment(data: InsertLpCommitment): Promise<LpCommitment> {
    const result = await db.insert(lpCommitments).values(data).returning();
    return result[0];
  }

  async updateLpCommitment(id: number, firmId: number, data: Partial<InsertLpCommitment>): Promise<LpCommitment | undefined> {
    const result = await db.update(lpCommitments)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(lpCommitments.id, id), eq(lpCommitments.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Capital Calls
  async getCapitalCalls(firmId: number, fundId?: number): Promise<CapitalCall[]> {
    if (fundId) {
      return db.select().from(capitalCalls).where(
        and(eq(capitalCalls.firmId, firmId), eq(capitalCalls.fundId, fundId))
      ).orderBy(desc(capitalCalls.callDate));
    }
    return db.select().from(capitalCalls).where(eq(capitalCalls.firmId, firmId)).orderBy(desc(capitalCalls.callDate));
  }

  async getCapitalCall(id: number, firmId: number): Promise<CapitalCall | undefined> {
    const result = await db.select().from(capitalCalls).where(and(eq(capitalCalls.id, id), eq(capitalCalls.firmId, firmId)));
    return result[0];
  }

  async createCapitalCall(data: InsertCapitalCall): Promise<CapitalCall> {
    const result = await db.insert(capitalCalls).values(data).returning();
    return result[0];
  }

  async updateCapitalCall(id: number, firmId: number, data: Partial<InsertCapitalCall>): Promise<CapitalCall | undefined> {
    const result = await db.update(capitalCalls)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(capitalCalls.id, id), eq(capitalCalls.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Capital Call Allocations
  async getCapitalCallAllocations(capitalCallId: number, firmId: number): Promise<CapitalCallAllocation[]> {
    return db.select().from(capitalCallAllocations).where(
      and(eq(capitalCallAllocations.capitalCallId, capitalCallId), eq(capitalCallAllocations.firmId, firmId))
    ).orderBy(capitalCallAllocations.lpName);
  }

  async createCapitalCallAllocation(data: InsertCapitalCallAllocation): Promise<CapitalCallAllocation> {
    const result = await db.insert(capitalCallAllocations).values(data).returning();
    return result[0];
  }

  async updateCapitalCallAllocation(id: number, firmId: number, data: Partial<InsertCapitalCallAllocation>): Promise<CapitalCallAllocation | undefined> {
    const result = await db.update(capitalCallAllocations)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(capitalCallAllocations.id, id), eq(capitalCallAllocations.firmId, firmId)))
      .returning();
    return result[0];
  }

  // Capital Distributions
  async getCapitalDistributions(firmId: number, fundId?: number): Promise<CapitalDistribution[]> {
    if (fundId) {
      return db.select().from(capitalDistributions).where(
        and(eq(capitalDistributions.firmId, firmId), eq(capitalDistributions.fundId, fundId))
      ).orderBy(desc(capitalDistributions.distributionDate));
    }
    return db.select().from(capitalDistributions).where(eq(capitalDistributions.firmId, firmId)).orderBy(desc(capitalDistributions.distributionDate));
  }

  async getCapitalDistribution(id: number, firmId: number): Promise<CapitalDistribution | undefined> {
    const result = await db.select().from(capitalDistributions).where(and(eq(capitalDistributions.id, id), eq(capitalDistributions.firmId, firmId)));
    return result[0];
  }

  async createCapitalDistribution(data: InsertCapitalDistribution): Promise<CapitalDistribution> {
    const result = await db.insert(capitalDistributions).values(data).returning();
    return result[0];
  }

  async updateCapitalDistribution(id: number, firmId: number, data: Partial<InsertCapitalDistribution>): Promise<CapitalDistribution | undefined> {
    const result = await db.update(capitalDistributions)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(capitalDistributions.id, id), eq(capitalDistributions.firmId, firmId)))
      .returning();
    return result[0];
  }

  // NAV Records
  async getNavRecords(firmId: number, fundId?: number): Promise<NavRecord[]> {
    if (fundId) {
      return db.select().from(navRecords).where(
        and(eq(navRecords.firmId, firmId), eq(navRecords.fundId, fundId))
      ).orderBy(desc(navRecords.navDate));
    }
    return db.select().from(navRecords).where(eq(navRecords.firmId, firmId)).orderBy(desc(navRecords.navDate));
  }

  async getLatestNavRecord(fundId: number, firmId: number): Promise<NavRecord | undefined> {
    const result = await db.select().from(navRecords).where(
      and(eq(navRecords.fundId, fundId), eq(navRecords.firmId, firmId))
    ).orderBy(desc(navRecords.navDate)).limit(1);
    return result[0];
  }

  async createNavRecord(data: InsertNavRecord): Promise<NavRecord> {
    const result = await db.insert(navRecords).values(data).returning();
    return result[0];
  }

  async updateNavRecord(id: number, firmId: number, data: Partial<InsertNavRecord>): Promise<NavRecord | undefined> {
    const result = await db.update(navRecords)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(navRecords.id, id), eq(navRecords.firmId, firmId)))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
