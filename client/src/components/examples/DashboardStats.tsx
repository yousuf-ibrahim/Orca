import { DashboardStats } from "../DashboardStats";

export default function DashboardStatsExample() {
  const mockStats = {
    totalClients: 247,
    pendingReview: 18,
    approvedClients: 203,
    requiresAction: 12,
  };

  return (
    <div className="p-8">
      <DashboardStats stats={mockStats} />
    </div>
  );
}
