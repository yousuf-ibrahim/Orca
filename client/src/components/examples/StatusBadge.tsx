import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <div>
        <h3 className="font-semibold mb-2">KYC Status Badges</h3>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="DRAFT" type="kyc" />
          <StatusBadge status="SUBMITTED" type="kyc" />
          <StatusBadge status="UNDER_REVIEW" type="kyc" />
          <StatusBadge status="APPROVED" type="kyc" />
          <StatusBadge status="REJECTED" type="kyc" />
          <StatusBadge status="REQUIRES_UPDATE" type="kyc" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Risk Band Badges</h3>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="LOW" type="risk" />
          <StatusBadge status="MEDIUM" type="risk" />
          <StatusBadge status="HIGH" type="risk" />
        </div>
      </div>
    </div>
  );
}
