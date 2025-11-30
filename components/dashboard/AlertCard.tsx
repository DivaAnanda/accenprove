import Link from "next/link";

interface AlertCardProps {
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  variant?: "warning" | "info" | "success" | "error";
}

export default function AlertCard({
  title,
  description,
  actionText,
  actionHref,
  variant = "warning",
}: AlertCardProps) {
  const variantStyles = {
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
      iconBg: "bg-orange-100",
      text: "text-orange-900",
      subtext: "text-orange-700",
      button: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      text: "text-blue-900",
      subtext: "text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      iconBg: "bg-green-100",
      text: "text-green-900",
      subtext: "text-green-700",
      button: "bg-green-600 hover:bg-green-700 text-white",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      iconBg: "bg-red-100",
      text: "text-red-900",
      subtext: "text-red-700",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-xl p-6`}
    >
      <div className="flex items-start gap-4">
        <div className={`${styles.iconBg} p-3 rounded-lg flex-shrink-0`}>
          <svg
            className={`w-6 h-6 ${styles.icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {variant === "warning" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            )}
            {variant === "info" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
            {variant === "success" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
            {variant === "error" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${styles.text} mb-1`}>{title}</h3>
          <p className={`text-sm ${styles.subtext} mb-4`}>{description}</p>
          <Link
            href={actionHref}
            className={`inline-block px-4 py-2 rounded-lg font-medium text-sm transition-colors ${styles.button}`}
          >
            {actionText}
          </Link>
        </div>
      </div>
    </div>
  );
}
