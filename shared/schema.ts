import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
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

// Clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  firmId: integer("firm_id").notNull().references(() => firms.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  riskScore: integer("risk_score"),
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
