import { db } from "@/drizzle/db";
import { auditLogs } from "@/drizzle/schema";

/**
 * Audit Log Categories
 */
export type AuditCategory = "authentication" | "profile" | "ba" | "admin" | "system";

/**
 * Audit Log Status
 */
export type AuditStatus = "success" | "failed" | "error";

/**
 * Audit Log Parameters
 */
export interface LogAuditParams {
  // Who did the action
  userId?: number | null;
  userEmail?: string;
  userRole?: string;

  // What action was performed
  action: string;
  category: AuditCategory;
  description: string;

  // Target of the action (optional)
  targetType?: string;
  targetId?: number;
  targetIdentifier?: string;

  // Context information (optional)
  ipAddress?: string;
  userAgent?: string;

  // Additional metadata (optional)
  metadata?: Record<string, any>;

  // Result
  status?: AuditStatus;
  errorMessage?: string;
}

/**
 * Log an audit entry
 * 
 * @example
 * // Login success
 * await logAudit({
 *   userId: 1,
 *   userEmail: "admin@example.com",
 *   userRole: "admin",
 *   action: "user.login",
 *   category: "authentication",
 *   description: "User logged in successfully",
 *   ipAddress: "192.168.1.1",
 *   userAgent: "Mozilla/5.0...",
 *   status: "success"
 * });
 * 
 * // BA creation
 * await logAudit({
 *   userId: 5,
 *   userEmail: "vendor@example.com",
 *   userRole: "vendor",
 *   action: "ba.create",
 *   category: "ba",
 *   description: "Created new BA: BA-001",
 *   targetType: "ba",
 *   targetId: 123,
 *   targetIdentifier: "BA-001",
 *   metadata: {
 *     jenisBA: "BAPB",
 *     vendor: "PT ABC",
 *     nomorKontrak: "K-001"
 *   },
 *   status: "success"
 * });
 */
export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: params.userId || null,
      userEmail: params.userEmail || null,
      userRole: params.userRole || null,
      action: params.action,
      category: params.category,
      description: params.description,
      targetType: params.targetType || null,
      targetId: params.targetId || null,
      targetIdentifier: params.targetIdentifier || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      status: params.status || "success",
      errorMessage: params.errorMessage || null,
    });
  } catch (error) {
    // Don't throw error to avoid breaking the main flow
    // Just log to console for debugging
    console.error("Failed to log audit:", error);
  }
}

/**
 * Helper to extract IP and User-Agent from NextRequest
 */
export function getRequestContext(request: Request) {
  const ipAddress = 
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
    
  const userAgent = request.headers.get("user-agent") || "unknown";

  return { ipAddress, userAgent };
}
