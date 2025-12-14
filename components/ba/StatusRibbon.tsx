import { Clock, CheckCircle, XCircle } from "lucide-react";

interface StatusRibbonProps {
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export function StatusRibbon({ status }: StatusRibbonProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "PENDING":
        return {
          Icon: Clock,
          text: "Menunggu Persetujuan Direksi",
          bgColor: "bg-gradient-to-r from-amber-50 to-orange-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
          iconColor: "text-amber-600",
        };
      case "APPROVED":
        return {
          Icon: CheckCircle,
          text: "Berita Acara Telah Disetujui",
          bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          iconColor: "text-green-600",
        };
      case "REJECTED":
        return {
          Icon: XCircle,
          text: "Berita Acara Ditolak",
          bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          iconColor: "text-red-600",
        };
    }
  };

  const { Icon, text, bgColor, borderColor, textColor, iconColor } = getStatusConfig();

  return (
    <div className={`${bgColor} border ${borderColor} rounded-t-xl px-6 py-4 flex items-center justify-center gap-3`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span className={`font-semibold text-base ${textColor}`}>{text}</span>
    </div>
  );
}
