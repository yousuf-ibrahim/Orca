import { db } from "../db";
import { firms, users, clients, kycApplications, documents, auditLogs } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create a demo firm
  const [firm] = await db.insert(firms).values({
    name: "Acme Capital Partners",
    domain: "acme-capital.com",
    status: "active",
  }).returning();

  console.log(`✅ Created firm: ${firm.name}`);

  // Create demo users
  const [user1] = await db.insert(users).values({
    firmId: firm.id,
    email: "alex.morgan@acme-capital.com",
    name: "Alex Morgan",
    role: "compliance_officer",
  }).returning();

  const [user2] = await db.insert(users).values({
    firmId: firm.id,
    email: "jordan.lee@acme-capital.com",
    name: "Jordan Lee",
    role: "analyst",
  }).returning();

  console.log(`✅ Created users: ${user1.name}, ${user2.name}`);

  // Create demo clients
  const clientsData = [
    {
      firmId: firm.id,
      name: "Blackstone Family Office",
      email: "contact@blackstone-fo.com",
      phone: "+1 (212) 555-0123",
      type: "Family Office",
      status: "approved",
      riskScore: 25,
    },
    {
      firmId: firm.id,
      name: "Singapore Sovereign Fund",
      email: "ops@singapore-sovereign.sg",
      phone: "+65 6555 0100",
      type: "Institutional",
      status: "approved",
      riskScore: 15,
    },
    {
      firmId: firm.id,
      name: "Emirates Investment Group",
      email: "kyc@emirates-inv.ae",
      phone: "+971 4 555 0200",
      type: "Institutional",
      status: "under_review",
      riskScore: 42,
    },
    {
      firmId: firm.id,
      name: "Zurich Private Wealth",
      email: "client@zurich-pw.ch",
      phone: "+41 44 555 0300",
      type: "Individual",
      status: "pending",
      riskScore: null,
    },
  ];

  const insertedClients = await db.insert(clients).values(clientsData).returning();
  console.log(`✅ Created ${insertedClients.length} clients`);

  // Create KYC applications for clients
  for (const client of insertedClients) {
    const kycData = {
      clientId: client.id,
      firmId: firm.id,
      status: client.status === "approved" ? "approved" : client.status === "under_review" ? "submitted" : "draft",
      step: client.status === "approved" ? 5 : client.status === "under_review" ? 5 : 2,
      data: {
        personalInfo: {
          fullName: client.name,
          email: client.email,
          phone: client.phone,
          dateOfBirth: "1980-05-15",
          nationality: "US",
        },
        entityInfo: {
          entityType: client.type,
          registrationNumber: `REG${Math.floor(Math.random() * 100000)}`,
          jurisdiction: client.type === "Individual" ? "Switzerland" : "Singapore",
        },
        financialInfo: {
          investmentAmount: Math.floor(Math.random() * 50000000) + 5000000,
          sourceOfFunds: "Business Income",
          investmentObjective: "Capital Growth",
        },
      },
      reviewedBy: client.status === "approved" ? user1.id : null,
      reviewedAt: client.status === "approved" ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : null,
      reviewNotes: client.status === "approved" ? "All documents verified. Low risk profile." : null,
      submittedAt: client.status !== "pending" ? new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) : null,
    };

    const [kycApp] = await db.insert(kycApplications).values(kycData).returning();

    // Add documents for submitted/approved applications
    if (client.status !== "pending") {
      await db.insert(documents).values([
        {
          kycApplicationId: kycApp.id,
          firmId: firm.id,
          type: "passport",
          filename: "passport.pdf",
          filesize: 2048576,
          url: `/uploads/passport_${kycApp.id}.pdf`,
          verified: client.status === "approved",
          verifiedBy: client.status === "approved" ? user1.id : null,
          verifiedAt: client.status === "approved" ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : null,
        },
        {
          kycApplicationId: kycApp.id,
          firmId: firm.id,
          type: "proof_of_address",
          filename: "utility_bill.pdf",
          filesize: 1024768,
          url: `/uploads/address_${kycApp.id}.pdf`,
          verified: client.status === "approved",
          verifiedBy: client.status === "approved" ? user1.id : null,
          verifiedAt: client.status === "approved" ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : null,
        },
      ]);
    }
  }

  console.log(`✅ Created KYC applications and documents`);

  // Create sample audit logs
  await db.insert(auditLogs).values([
    {
      firmId: firm.id,
      userId: user1.id,
      entityType: "kyc_application",
      entityId: insertedClients[0].id,
      action: "approve",
      changes: { status: { from: "submitted", to: "approved" } },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0",
    },
    {
      firmId: firm.id,
      userId: user2.id,
      entityType: "client",
      entityId: insertedClients[2].id,
      action: "update",
      changes: { riskScore: { from: null, to: 42 } },
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0",
    },
  ]);

  console.log(`✅ Created audit logs`);
  console.log("🎉 Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
