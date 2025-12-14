"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, FileText, User } from "lucide-react";

interface TimelineEvent {
  type: "created" | "approved" | "rejected" | "updated";
  timestamp: number;
  actor?: {
    id: number;
    name: string;
    role: string;
  };
  data?: {
    reason?: string;
  };
}

interface BATimelineProps {
  baData: {
    id: number;
    vendorId: number;
    createdAt: number;
    approvedAt: number | null;
    rejectedAt: number | null;
    approvedBy: number | null;
    rejectedBy: number | null;
    updatedAt: number;
    rejectionReason: string | null;
    status: string;
  };
}

export function BATimeline({ baData }: BATimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buildTimeline() {
      const timelineEvents: TimelineEvent[] = [];

      // 1. BA Created
      let creatorName = "Vendor";
      try {
        const vendorRes = await fetch(`/api/users/${baData.vendorId}`);
        const vendorData = await vendorRes.json();
        if (vendorData.success) {
          creatorName = `${vendorData.data.firstName} ${vendorData.data.lastName}`;
        }
      } catch (error) {
        console.error("Error fetching vendor:", error);
      }

      // Helper to convert timestamp to number for proper sorting
      const toTimestamp = (value: any): number => {
        if (typeof value === 'number') return value;
        if (value instanceof Date) return value.getTime();
        if (typeof value === 'string') return new Date(value).getTime();
        return 0;
      };

      const createdTimestamp = toTimestamp(baData.createdAt);
      const updatedTimestamp = toTimestamp(baData.updatedAt);
      const approvedTimestamp = baData.approvedAt ? toTimestamp(baData.approvedAt) : null;
      const rejectedTimestamp = baData.rejectedAt ? toTimestamp(baData.rejectedAt) : null;

      timelineEvents.push({
        type: "created",
        timestamp: createdTimestamp,
        actor: {
          id: baData.vendorId,
          name: creatorName,
          role: "Vendor",
        },
      });

      // 2. BA Updated (if different from created AND not same as approve/reject)
      // Don't show "updated" if the update was just approve/reject action
      const isApproveUpdate = approvedTimestamp && updatedTimestamp === approvedTimestamp;
      const isRejectUpdate = rejectedTimestamp && updatedTimestamp === rejectedTimestamp;
      
      if (
        updatedTimestamp && 
        updatedTimestamp !== createdTimestamp && 
        !isApproveUpdate && 
        !isRejectUpdate
      ) {
        timelineEvents.push({
          type: "updated",
          timestamp: updatedTimestamp,
          actor: {
            id: baData.vendorId,
            name: creatorName,
            role: "Vendor",
          },
        });
      }

      // 3. BA Approved
      if (approvedTimestamp && baData.approvedBy) {
        let approverName = "Direksi";
        try {
          const approverRes = await fetch(`/api/users/${baData.approvedBy}`);
          const approverData = await approverRes.json();
          if (approverData.success) {
            approverName = `${approverData.data.firstName} ${approverData.data.lastName}`;
          }
        } catch (error) {
          console.error("Error fetching approver:", error);
        }

        timelineEvents.push({
          type: "approved",
          timestamp: approvedTimestamp,
          actor: {
            id: baData.approvedBy,
            name: approverName,
            role: "Direksi",
          },
        });
      }

      // 4. BA Rejected (show even if status is now PENDING - for audit trail)
      if (rejectedTimestamp && baData.rejectedBy) {
        let rejecterName = "Direksi";
        try {
          const rejecterRes = await fetch(`/api/users/${baData.rejectedBy}`);
          const rejecterData = await rejecterRes.json();
          if (rejecterData.success) {
            rejecterName = `${rejecterData.data.firstName} ${rejecterData.data.lastName}`;
          }
        } catch (error) {
          console.error("Error fetching rejecter:", error);
        }

        timelineEvents.push({
          type: "rejected",
          timestamp: rejectedTimestamp,
          actor: {
            id: baData.rejectedBy,
            name: rejecterName,
            role: "Direksi",
          },
          data: {
            reason: baData.rejectionReason || undefined,
          },
        });
      }

      // Sort by timestamp (oldest first) - now using proper numeric comparison
      timelineEvents.sort((a, b) => a.timestamp - b.timestamp);
      setEvents(timelineEvents);
      setLoading(false);
    }

    buildTimeline();
  }, [baData]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "created":
        return { Icon: FileText, color: "text-blue-600", bg: "bg-blue-100" };
      case "approved":
        return { Icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" };
      case "rejected":
        return { Icon: XCircle, color: "text-red-600", bg: "bg-red-100" };
      case "updated":
        return { Icon: Clock, color: "text-amber-600", bg: "bg-amber-100" };
      default:
        return { Icon: Clock, color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const getEventTitle = (type: string) => {
    switch (type) {
      case "created":
        return "Berita Acara Dibuat";
      case "approved":
        return "Berita Acara Disetujui";
      case "rejected":
        return "Berita Acara Ditolak";
      case "updated":
        return "Berita Acara Diperbarui";
      default:
        return "Event";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const formatted = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    // Get timezone abbreviation dynamically based on browser timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let tzAbbr = "WIB"; // Default
    
    // Map common Indonesian timezones
    if (timeZone.includes("Makassar") || timeZone.includes("Singapore")) {
      tzAbbr = "WITA"; // UTC+8
    } else if (timeZone.includes("Jayapura")) {
      tzAbbr = "WIT"; // UTC+9
    } else if (timeZone.includes("Jakarta")) {
      tzAbbr = "WIB"; // UTC+7
    } else {
      // Fallback: calculate offset
      const offset = -date.getTimezoneOffset() / 60;
      if (offset === 8) tzAbbr = "WITA";
      else if (offset === 9) tzAbbr = "WIT";
      else if (offset === 7) tzAbbr = "WIB";
    }
    
    return { formatted, tzAbbr };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-gray-400 animate-pulse" />
          <h3 className="text-xl font-bold text-gray-900">Timeline Berita Acara</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Timeline Berita Acara</h3>
          <p className="text-sm text-gray-600">Riwayat perubahan dan aktivitas</p>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {events.map((event, index) => {
            const { Icon, color, bg } = getEventIcon(event.type);
            const isLast = index === events.length - 1;

            return (
              <div key={index} className="relative flex gap-4">
                {/* Icon */}
                <div className={`relative z-10 w-12 h-12 ${bg} rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-white`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {getEventTitle(event.type)}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {(() => {
                        const { formatted, tzAbbr } = formatDate(event.timestamp);
                        return `${formatted} ${tzAbbr}`;
                      })()}
                    </p>
                    {event.actor && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          <span className="font-medium">{event.actor.name}</span>
                          <span className="text-gray-500"> ({event.actor.role})</span>
                        </span>
                      </div>
                    )}
                    {event.data?.reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-900 mb-1">Alasan Penolakan:</p>
                        <p className="text-sm text-red-700">{event.data.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
