import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  FileText, 
  Download,
  Calendar,
  Users,
  Zap
} from "lucide-react";
import { Link } from "wouter";

interface ComplianceTask {
  id: string;
  title: string;
  dueDate: Date;
  status: "overdue" | "due_soon" | "on_track";
  type: "review" | "report" | "document";
}

interface ComplianceInsightsWidgetProps {
  totalClients?: number;
  pendingReviews?: number;
  documentsExpiring?: number;
}

function getUpcomingTasks(): ComplianceTask[] {
  const today = new Date();
  return [
    {
      id: "1",
      title: "Q4 LP Performance Report",
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: "due_soon",
      type: "report"
    },
    {
      id: "2", 
      title: "Annual KYC Reviews (3 clients)",
      dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: "on_track",
      type: "review"
    },
    {
      id: "3",
      title: "DFSA Regulatory Filing",
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: "on_track",
      type: "document"
    }
  ];
}

function formatDueDate(date: Date): string {
  const today = new Date();
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return `Due ${date.toLocaleDateString()}`;
}

function TaskIcon({ type }: { type: "review" | "report" | "document" }) {
  switch (type) {
    case "review": return <Users className="h-4 w-4" />;
    case "report": return <FileText className="h-4 w-4" />;
    case "document": return <FileCheck className="h-4 w-4" />;
  }
}

function StatusBadge({ status }: { status: "overdue" | "due_soon" | "on_track" }) {
  switch (status) {
    case "overdue":
      return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
    case "due_soon":
      return <Badge className="text-xs bg-yellow-500 hover:bg-yellow-600">Due Soon</Badge>;
    case "on_track":
      return <Badge variant="secondary" className="text-xs">On Track</Badge>;
  }
}

export function ComplianceInsightsWidget({ 
  totalClients = 12, 
  pendingReviews = 3,
  documentsExpiring = 2 
}: ComplianceInsightsWidgetProps) {
  const tasks = getUpcomingTasks();
  const completionRate = Math.round(((totalClients - pendingReviews) / totalClients) * 100);
  
  return (
    <Card data-testid="widget-compliance-insights">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Compliance Dashboard
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-2xl font-bold text-primary">{totalClients}</p>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingReviews}</p>
            <p className="text-xs text-muted-foreground">Pending Reviews</p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 text-center">
            <p className="text-2xl font-bold text-red-600">{documentsExpiring}</p>
            <p className="text-xs text-muted-foreground">Docs Expiring</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>KYC Completion Rate</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Tasks
          </p>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
              <div className="flex items-center gap-2">
                <TaskIcon type={task.type} />
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDueDate(task.dueDate)}
                  </p>
                </div>
              </div>
              <StatusBadge status={task.status} />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Link href="/compliance/reports" className="flex-1">
            <Button variant="outline" className="w-full" size="sm" data-testid="button-generate-report">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button variant="default" className="w-full" size="sm" data-testid="button-view-all">
              View All
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
