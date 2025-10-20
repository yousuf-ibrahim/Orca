import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type KYCStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "REQUIRES_UPDATE";
export type RiskBand = "LOW" | "MEDIUM" | "HIGH";

interface StatusBadgeProps {
  status: KYCStatus | RiskBand;
  type?: "kyc" | "risk";
}

const kycStatusConfig = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
  SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  APPROVED: { label: "Approved", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  REQUIRES_UPDATE: { label: "Requires Update", className: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
};

const riskBandConfig = {
  LOW: { label: "Low Risk", className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  MEDIUM: { label: "Medium Risk", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  HIGH: { label: "High Risk", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

export function StatusBadge({ status, type = "kyc" }: StatusBadgeProps) {
  const config = type === "kyc" ? kycStatusConfig[status as KYCStatus] : riskBandConfig[status as RiskBand];
  
  if (!config) return null;

  return (
    <Badge 
      variant="secondary" 
      className={cn("font-medium", config.className)}
      data-testid={`badge-status-${status.toLowerCase()}`}
    >
      {config.label}
    </Badge>
  );
}
