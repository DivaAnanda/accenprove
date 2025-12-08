/**
 * Database Seed Script
 * Creates demo users with different roles for testing
 * 
 * Usage: node --import tsx scripts/seed.ts
 * Or: npm run db:seed (after adding script to package.json)
 */

import bcrypt from "bcryptjs";
import { db } from "../drizzle/db";
import { users } from "../drizzle/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const demoUsers = [
    {
      firstName: "Admin",
      lastName: "Accenprove",
      email: "admin@accenprove.com",
      password: "admin123",
      role: "admin" as const,
      isVerified: true,
    },
    {
      firstName: "Direktur",
      lastName: "Utama",
      email: "direksi@accenprove.com",
      password: "direksi123",
      role: "direksi" as const,
      isVerified: true,
    },
    {
      firstName: "Kepala",
      lastName: "Keuangan",
      email: "dk@accenprove.com",
      password: "dk123",
      role: "dk" as const,
      isVerified: true,
    },
    {
      firstName: "PT Vendor",
      lastName: "Indonesia",
      email: "vendor@accenprove.com",
      password: "vendor123",
      role: "vendor" as const,
      isVerified: true,
    },
    {
      firstName: "PT Supplier",
      lastName: "Teknologi",
      email: "vendor2@accenprove.com",
      password: "vendor123",
      role: "vendor" as const,
      isVerified: true,
    },
  ];

  for (const user of demoUsers) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await db.insert(users).values({
        ...user,
        password: hashedPassword,
      });

      console.log(`✅ Created: ${user.email} (${user.role})`);
    } catch (error: any) {
      if (error.message?.includes("UNIQUE constraint failed")) {
        console.log(`⚠️  User already exists: ${user.email}`);
      } else {
        console.error(`❌ Error creating ${user.email}:`, error);
      }
    }
  }

  console.log("\n🎉 Seeding completed!");
  console.log("\n📋 Demo Accounts:");
  console.log("================================");
  demoUsers.forEach((u) => {
    console.log(`${u.role.toUpperCase().padEnd(10)} | ${u.email.padEnd(30)} | ${u.password}`);
  });
  console.log("================================\n");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
