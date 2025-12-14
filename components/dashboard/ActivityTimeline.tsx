"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, XCircle, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface Activity {
  id: number;
  type: "ba_created" | "ba_approved" | "ba_rejected" | "user_created";
  title: string;
  description: string;
  timestamp: string;
  href?: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
}

const activityIcons = {
  ba_created: { icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
  ba_approved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  ba_rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  user_created: { icon: User, color: "text-purple-600", bg: "bg-purple-100" },
};

export function ActivityTimeline({ activities, loading }: ActivityTimelineProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity, index) => {
            const { icon: Icon, color, bg } = activityIcons[activity.type];
            const isLast = index === activities.length - 1;

            return (
              <div key={activity.id} className="relative">
                <Link
                  href={activity.href || "#"}
                  className={cn(
                    "flex gap-4 p-3 rounded-lg transition-colors duration-200",
                    "hover:bg-gray-50 group cursor-pointer"
                  )}
                >
                  {/* Icon */}
                  <div className={cn("flex-shrink-0 relative z-10")}>
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center transition-transform duration-200",
                        bg,
                        "group-hover:scale-110"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", color)} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getRelativeTime(activity.timestamp)}
                    </p>
                  </div>

                  {/* Arrow indicator on hover */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-[29px] top-[52px] bottom-[-8px] w-px bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
