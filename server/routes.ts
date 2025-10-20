import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertKycApplicationSchema, insertDocumentSchema } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
