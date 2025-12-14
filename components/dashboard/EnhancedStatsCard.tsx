"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  href?: string;
}

export function EnhancedStatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  loading,
  href,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  // Animated counter
  useEffect(() => {
    if (loading || typeof value !== "number") return;

    const duration = 1000; // 1 second
    const steps = 60;
    const increment = value / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      setDisplayValue(Math.min(Math.floor(increment * currentStep), value));

      if (currentStep < steps) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, loading]);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[100px] mb-2" />
          <Skeleton className="h-4 w-[180px]" />
        </CardContent>
      </Card>
    );
  }

  const CardWrapper = href ? "a" : "div";
  const cardProps = href ? { href } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 group cursor-pointer min-h-[178px]",
          "hover:shadow-lg hover:-translate-y-1",
          "bg-gradient-to-br from-white to-gray-50/50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glassmorphism overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div
            className={cn(
              "p-2 rounded-lg bg-primary-100 text-primary-600 transition-all duration-300",
              "group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            {typeof value === "number" ? displayValue.toLocaleString() : value}
          </div>

          {description && (
            <p className="text-xs text-gray-500 mb-2">{description}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1 text-xs font-medium">
              <span
                className={cn(
                  "flex items-center gap-0.5",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500">from last month</span>
            </div>
          )}
        </CardContent>

        {/* Bottom accent line */}
        <div
          className={cn(
            "h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform origin-left transition-transform duration-300",
            "absolute inset-x-0 bottom-0",
            isHovered ? "scale-x-100" : "scale-x-0"
          )}
        />
      </Card>
    </CardWrapper>
  );
}
