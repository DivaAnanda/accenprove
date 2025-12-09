import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * Users Table - Authentication & Authorization
 * Adapted from teammate's MySQL schema + added role field for Accenprove
 */
export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role", { enum: ["admin", "direksi", "dk", "vendor"] })
      .notNull()
      .default("vendor"),
    
    // Profile fields
    phone: text("phone"),
    address: text("address"),
    photo: text("photo"), // Path to uploaded photo or null for default
    
    // Account status
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    
    isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
    verificationToken: text("verification_token"),
    resetToken: text("reset_token"),
    resetTokenExpires: integer("reset_token_expires", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    verificationTokenIdx: index("verification_token_idx").on(table.verificationToken),
    resetTokenIdx: index("reset_token_idx").on(table.resetToken),
  })
);

/**
 * Login History Table - Security & Audit Trail
 */
export const loginHistory = sqliteTable(
  "login_history",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    deviceInfo: text("device_info"),
    loginAt: integer("login_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

/**
 * Berita Acara Table - Core Business Logic
 * Migrated from localStorage (lib/ba-storage.ts)
 */
export const beritaAcara = sqliteTable(
  "berita_acara",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nomorBA: text("nomor_ba").notNull().unique(),
    jenisBA: text("jenis_ba", { enum: ["BAPB", "BAPP"] }).notNull(),
    nomorKontrak: text("nomor_kontrak").notNull(),
    namaVendor: text("nama_vendor").notNull(),
    
    // Vendor User ID (foreign key)
    vendorId: integer("vendor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    
    // Inspection Details
    tanggalPemeriksaan: text("tanggal_pemeriksaan").notNull(),
    lokasiPemeriksaan: text("lokasi_pemeriksaan").notNull(),
    
    // PIC Information
    namaPIC: text("nama_pic").notNull(),
    jabatanPIC: text("jabatan_pic").notNull(),
    
    // Item Details
    deskripsiBarang: text("deskripsi_barang").notNull(),
    jumlahBarang: text("jumlah_barang").notNull(),
    kondisiBarang: text("kondisi_barang").notNull(),
    keterangan: text("keterangan"),
    
    // Digital Signatures (Base64 PNG)
    signatureVendor: text("signature_vendor").notNull(),
    signatureDireksi: text("signature_direksi"),
    
    // Status & Approval
    status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] })
      .notNull()
      .default("PENDING"),
    rejectionReason: text("rejection_reason"),
    
    // Direksi who approved/rejected
    approvedBy: integer("approved_by").references(() => users.id),
    rejectedBy: integer("rejected_by").references(() => users.id),
    
    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    approvedAt: integer("approved_at", { mode: "timestamp" }),
    rejectedAt: integer("rejected_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    nomorBAIdx: index("nomor_ba_idx").on(table.nomorBA),
    vendorIdIdx: index("vendor_id_idx").on(table.vendorId),
    statusIdx: index("status_idx").on(table.status),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  })
);

/**
 * Audit Logs Table - Comprehensive Action Tracking
 * Tracks all user actions for compliance and security monitoring
 */
export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    
    // Who did the action
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    userEmail: text("user_email"), // Preserved even if user deleted
    userRole: text("user_role"), // Role at the time of action
    
    // What action was performed
    action: text("action").notNull(), // e.g., "ba.create", "user.login"
    category: text("category", { 
      enum: ["authentication", "profile", "ba", "admin", "system"] 
    }).notNull(),
    description: text("description").notNull(), // Human-readable description
    
    // Target of the action (if applicable)
    targetType: text("target_type"), // e.g., "ba", "user", "profile"
    targetId: integer("target_id"), // ID of affected resource
    targetIdentifier: text("target_identifier"), // Additional identifier (email, BA number, etc.)
    
    // Context information
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    
    // Additional metadata (JSON string)
    metadata: text("metadata"), // Store as JSON string
    
    // Result of the action
    status: text("status", { enum: ["success", "failed", "error"] }).notNull().default("success"),
    errorMessage: text("error_message"), // If status is "failed" or "error"
    
    // Timestamp
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    userIdIdx: index("audit_user_id_idx").on(table.userId),
    actionIdx: index("audit_action_idx").on(table.action),
    categoryIdx: index("audit_category_idx").on(table.category),
    statusIdx: index("audit_status_idx").on(table.status),
    createdAtIdx: index("audit_created_at_idx").on(table.createdAt),
    targetTypeIdx: index("audit_target_type_idx").on(table.targetType),
    targetIdIdx: index("audit_target_id_idx").on(table.targetId),
  })
);

/**
 * Type Exports for TypeScript
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type LoginHistory = typeof loginHistory.$inferSelect;
export type NewLoginHistory = typeof loginHistory.$inferInsert;

export type BeritaAcara = typeof beritaAcara.$inferSelect;
export type NewBeritaAcara = typeof beritaAcara.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type BeritaAcara = typeof beritaAcara.$inferSelect;
export type NewBeritaAcara = typeof beritaAcara.$inferInsert;
