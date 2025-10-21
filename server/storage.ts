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
  type InsertTransactionMonitoring
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
}

export const storage = new DbStorage();
