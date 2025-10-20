import { db } from "./db";
import { 
  clients, 
  kycApplications, 
  documents, 
  auditLogs,
  type Client,
  type InsertClient,
  type KycApplication,
  type InsertKycApplication,
  type Document,
  type InsertDocument,
  type AuditLog,
  type InsertAuditLog
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
}

export const storage = new DbStorage();
