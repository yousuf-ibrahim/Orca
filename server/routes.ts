import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, 
  insertKycApplicationSchema, 
  insertDocumentSchema,
  insertWealthInformationSchema,
  insertBeneficialOwnershipSchema,
  insertRiskAssessmentSchema,
  insertSuitabilityAssessmentSchema,
  insertClientClassificationSchema,
  insertRmKycNoteSchema,
  insertClientApprovalSchema,
  insertTransactionMonitoringSchema
} from "@shared/schema";
import { z } from "zod";

const FIRM_ID = 1; // Hardcoded for demo - in production would come from auth session

export async function registerRoutes(app: Express): Promise<Server> {
  // Clients
  app.get("/api/clients", async (req: Request, res: Response) => {
    try {
      const clients = await storage.getClients(FIRM_ID);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id, FIRM_ID);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req: Request, res: Response) => {
    try {
      const data = insertClientSchema.parse({ ...req.body, firmId: FIRM_ID });
      const client = await storage.createClient(data);
      
      // Create audit log
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "client",
        entityId: client.id,
        action: "create",
        changes: { ...data },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.patch("/api/clients/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.updateClient(id, FIRM_ID, req.body);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "client",
        entityId: client.id,
        action: "update",
        changes: req.body,
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // KYC Applications
  app.get("/api/kyc-applications", async (req: Request, res: Response) => {
    try {
      const applications = await storage.getKycApplications(FIRM_ID);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching KYC applications:", error);
      res.status(500).json({ error: "Failed to fetch KYC applications" });
    }
  });

  app.get("/api/kyc-applications/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getKycApplication(id, FIRM_ID);
      if (!application) {
        return res.status(404).json({ error: "KYC application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching KYC application:", error);
      res.status(500).json({ error: "Failed to fetch KYC application" });
    }
  });

  app.get("/api/clients/:clientId/kyc", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const application = await storage.getKycApplicationByClient(clientId, FIRM_ID);
      if (!application) {
        return res.status(404).json({ error: "KYC application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching KYC application:", error);
      res.status(500).json({ error: "Failed to fetch KYC application" });
    }
  });

  app.post("/api/kyc-applications", async (req: Request, res: Response) => {
    try {
      const data = insertKycApplicationSchema.parse({ ...req.body, firmId: FIRM_ID });
      const application = await storage.createKycApplication(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "kyc_application",
        entityId: application.id,
        action: "create",
        changes: { status: data.status, step: data.step },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating KYC application:", error);
      res.status(500).json({ error: "Failed to create KYC application" });
    }
  });

  app.patch("/api/kyc-applications/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const oldApp = await storage.getKycApplication(id, FIRM_ID);
      const application = await storage.updateKycApplication(id, FIRM_ID, req.body);
      
      if (!application) {
        return res.status(404).json({ error: "KYC application not found" });
      }
      
      // Create detailed audit log for status changes
      const changes: any = {};
      if (oldApp && req.body.status && oldApp.status !== req.body.status) {
        changes.status = { from: oldApp.status, to: req.body.status };
      }
      if (req.body.step !== undefined) {
        changes.step = { from: oldApp?.step, to: req.body.step };
      }
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: req.body.reviewedBy || null,
        entityType: "kyc_application",
        entityId: application.id,
        action: req.body.status === "approved" ? "approve" : req.body.status === "rejected" ? "reject" : "update",
        changes,
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(application);
    } catch (error) {
      console.error("Error updating KYC application:", error);
      res.status(500).json({ error: "Failed to update KYC application" });
    }
  });

  // Documents
  app.get("/api/kyc-applications/:kycId/documents", async (req: Request, res: Response) => {
    try {
      const kycId = parseInt(req.params.kycId);
      const documents = await storage.getDocuments(kycId, FIRM_ID);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const data = insertDocumentSchema.parse({ ...req.body, firmId: FIRM_ID });
      const document = await storage.createDocument(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "document",
        entityId: document.id,
        action: "upload",
        changes: { type: data.type, filename: data.filename },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.patch("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.updateDocument(id, FIRM_ID, req.body);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      if (req.body.verified !== undefined) {
        await storage.createAuditLog({
          firmId: FIRM_ID,
          userId: req.body.verifiedBy || null,
          entityType: "document",
          entityId: document.id,
          action: req.body.verified ? "verify" : "unverify",
          changes: { verified: req.body.verified },
          ipAddress: req.ip || null,
          userAgent: req.get("user-agent") || null,
        });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats(FIRM_ID);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Audit Logs
  app.get("/api/audit-logs", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getAuditLogs(FIRM_ID, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Wealth Information
  app.get("/api/clients/:clientId/wealth", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const wealth = await storage.getWealthInformation(clientId, FIRM_ID);
      res.json(wealth || null);
    } catch (error) {
      console.error("Error fetching wealth information:", error);
      res.status(500).json({ error: "Failed to fetch wealth information" });
    }
  });

  app.post("/api/clients/:clientId/wealth", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertWealthInformationSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID 
      });
      const wealth = await storage.createWealthInformation(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: req.body.verifiedBy || null,
        entityType: "wealth_information",
        entityId: wealth.id,
        action: "create",
        changes: { totalNetWorth: data.totalNetWorth },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(wealth);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating wealth information:", error);
      res.status(500).json({ error: "Failed to create wealth information" });
    }
  });

  app.patch("/api/wealth/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const wealth = await storage.updateWealthInformation(id, FIRM_ID, req.body);
      
      if (!wealth) {
        return res.status(404).json({ error: "Wealth information not found" });
      }
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: req.body.verifiedBy || null,
        entityType: "wealth_information",
        entityId: wealth.id,
        action: "update",
        changes: req.body,
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(wealth);
    } catch (error) {
      console.error("Error updating wealth information:", error);
      res.status(500).json({ error: "Failed to update wealth information" });
    }
  });

  // Beneficial Ownership
  app.get("/api/clients/:clientId/beneficial-ownership", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const owners = await storage.getBeneficialOwnership(clientId, FIRM_ID);
      res.json(owners);
    } catch (error) {
      console.error("Error fetching beneficial ownership:", error);
      res.status(500).json({ error: "Failed to fetch beneficial ownership" });
    }
  });

  app.post("/api/clients/:clientId/beneficial-ownership", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertBeneficialOwnershipSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID 
      });
      const owner = await storage.createBeneficialOwnership(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "beneficial_ownership",
        entityId: owner.id,
        action: "create",
        changes: { ownerName: data.ownerName, ownershipPercentage: data.ownershipPercentage },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(owner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating beneficial ownership:", error);
      res.status(500).json({ error: "Failed to create beneficial ownership" });
    }
  });

  app.patch("/api/beneficial-ownership/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const owner = await storage.updateBeneficialOwnership(id, FIRM_ID, req.body);
      
      if (!owner) {
        return res.status(404).json({ error: "Beneficial ownership not found" });
      }
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "beneficial_ownership",
        entityId: owner.id,
        action: "update",
        changes: req.body,
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(owner);
    } catch (error) {
      console.error("Error updating beneficial ownership:", error);
      res.status(500).json({ error: "Failed to update beneficial ownership" });
    }
  });

  app.delete("/api/beneficial-ownership/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBeneficialOwnership(id, FIRM_ID);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "beneficial_ownership",
        entityId: id,
        action: "delete",
        changes: {},
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting beneficial ownership:", error);
      res.status(500).json({ error: "Failed to delete beneficial ownership" });
    }
  });

  // Risk Assessments
  app.get("/api/clients/:clientId/risk-assessments", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const assessments = await storage.getRiskAssessments(clientId, FIRM_ID);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching risk assessments:", error);
      res.status(500).json({ error: "Failed to fetch risk assessments" });
    }
  });

  app.get("/api/clients/:clientId/risk-assessments/latest", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const assessment = await storage.getLatestRiskAssessment(clientId, FIRM_ID);
      res.json(assessment || null);
    } catch (error) {
      console.error("Error fetching latest risk assessment:", error);
      res.status(500).json({ error: "Failed to fetch latest risk assessment" });
    }
  });

  app.post("/api/clients/:clientId/risk-assessments", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertRiskAssessmentSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID 
      });
      const assessment = await storage.createRiskAssessment(data);
      
      // Update client's risk score and band
      await storage.updateClient(clientId, FIRM_ID, {
        riskScore: data.totalRiskScore || undefined,
        riskBand: data.riskBand || undefined,
      });
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: data.assessedBy || null,
        entityType: "risk_assessment",
        entityId: assessment.id,
        action: "create",
        changes: { totalRiskScore: data.totalRiskScore, riskBand: data.riskBand },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating risk assessment:", error);
      res.status(500).json({ error: "Failed to create risk assessment" });
    }
  });

  // Suitability Assessments
  app.get("/api/clients/:clientId/suitability-assessments", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const assessments = await storage.getSuitabilityAssessments(clientId, FIRM_ID);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching suitability assessments:", error);
      res.status(500).json({ error: "Failed to fetch suitability assessments" });
    }
  });

  app.get("/api/clients/:clientId/suitability-assessments/latest", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const assessment = await storage.getLatestSuitabilityAssessment(clientId, FIRM_ID);
      res.json(assessment || null);
    } catch (error) {
      console.error("Error fetching latest suitability assessment:", error);
      res.status(500).json({ error: "Failed to fetch latest suitability assessment" });
    }
  });

  app.post("/api/clients/:clientId/suitability-assessments", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertSuitabilityAssessmentSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID 
      });
      const assessment = await storage.createSuitabilityAssessment(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: data.assessedBy || null,
        entityType: "suitability_assessment",
        entityId: assessment.id,
        action: "create",
        changes: { totalScore: data.totalScore, suitabilityRating: data.suitabilityRating },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating suitability assessment:", error);
      res.status(500).json({ error: "Failed to create suitability assessment" });
    }
  });

  // Client Classification
  app.get("/api/clients/:clientId/classification", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const classification = await storage.getClientClassification(clientId, FIRM_ID);
      res.json(classification || null);
    } catch (error) {
      console.error("Error fetching client classification:", error);
      res.status(500).json({ error: "Failed to fetch client classification" });
    }
  });

  app.post("/api/clients/:clientId/classification", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertClientClassificationSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID 
      });
      const classification = await storage.createClientClassification(data);
      
      // Update client's category
      await storage.updateClient(clientId, FIRM_ID, {
        clientCategory: data.classification,
      });
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: data.classifiedBy || null,
        entityType: "client_classification",
        entityId: classification.id,
        action: "create",
        changes: { classification: data.classification },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(classification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating client classification:", error);
      res.status(500).json({ error: "Failed to create client classification" });
    }
  });

  // RM KYC Notes
  app.get("/api/clients/:clientId/rm-notes", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const notes = await storage.getRmKycNotes(clientId, FIRM_ID);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching RM KYC notes:", error);
      res.status(500).json({ error: "Failed to fetch RM KYC notes" });
    }
  });

  app.post("/api/clients/:clientId/rm-notes", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertRmKycNoteSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID 
      });
      const note = await storage.createRmKycNote(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: data.relationshipManagerId,
        entityType: "rm_kyc_note",
        entityId: note.id,
        action: "create",
        changes: { noteType: data.noteType },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating RM KYC note:", error);
      res.status(500).json({ error: "Failed to create RM KYC note" });
    }
  });

  app.patch("/api/rm-notes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.updateRmKycNote(id, FIRM_ID, req.body);
      
      if (!note) {
        return res.status(404).json({ error: "RM KYC note not found" });
      }
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: req.body.relationshipManagerId || null,
        entityType: "rm_kyc_note",
        entityId: note.id,
        action: "update",
        changes: req.body,
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(note);
    } catch (error) {
      console.error("Error updating RM KYC note:", error);
      res.status(500).json({ error: "Failed to update RM KYC note" });
    }
  });

  // Client Approvals
  app.get("/api/clients/:clientId/approval", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const approval = await storage.getClientApproval(clientId, FIRM_ID);
      res.json(approval || null);
    } catch (error) {
      console.error("Error fetching client approval:", error);
      res.status(500).json({ error: "Failed to fetch client approval" });
    }
  });

  app.post("/api/clients/:clientId/approval", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertClientApprovalSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID,
        submittedAt: new Date(),
      });
      const approval = await storage.createClientApproval(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: data.submittedBy,
        entityType: "client_approval",
        entityId: approval.id,
        action: "submit_for_approval",
        changes: { decision: "pending" },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(approval);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating client approval:", error);
      res.status(500).json({ error: "Failed to create client approval" });
    }
  });

  app.patch("/api/approvals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const approval = await storage.updateClientApproval(id, FIRM_ID, req.body);
      
      if (!approval) {
        return res.status(404).json({ error: "Client approval not found" });
      }
      
      // If decision changed, update client status
      if (req.body.decision === "approved") {
        await storage.updateClient(approval.clientId, FIRM_ID, {
          status: "approved",
        });
      } else if (req.body.decision === "rejected") {
        await storage.updateClient(approval.clientId, FIRM_ID, {
          status: "rejected",
        });
      }
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: null,
        entityType: "client_approval",
        entityId: approval.id,
        action: req.body.decision === "approved" ? "approve" : req.body.decision === "rejected" ? "reject" : "update",
        changes: req.body,
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(approval);
    } catch (error) {
      console.error("Error updating client approval:", error);
      res.status(500).json({ error: "Failed to update client approval" });
    }
  });

  // Transaction Monitoring
  app.get("/api/clients/:clientId/transaction-monitoring", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const monitoring = await storage.getTransactionMonitoring(clientId, FIRM_ID);
      res.json(monitoring);
    } catch (error) {
      console.error("Error fetching transaction monitoring:", error);
      res.status(500).json({ error: "Failed to fetch transaction monitoring" });
    }
  });

  app.post("/api/clients/:clientId/transaction-monitoring", async (req: Request, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const data = insertTransactionMonitoringSchema.parse({ 
        ...req.body, 
        clientId, 
        firmId: FIRM_ID 
      });
      const monitoring = await storage.createTransactionMonitoring(data);
      
      await storage.createAuditLog({
        firmId: FIRM_ID,
        userId: data.preparedBy || null,
        entityType: "transaction_monitoring",
        entityId: monitoring.id,
        action: "create",
        changes: { reviewType: data.reviewType, unusualActivityDetected: data.unusualActivityDetected },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(monitoring);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating transaction monitoring:", error);
      res.status(500).json({ error: "Failed to create transaction monitoring" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
