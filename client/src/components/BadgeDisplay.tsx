import { Award, CheckCircle2, Target, TrendingUp, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "award" | "check" | "target" | "trending" | "users" | "shield";
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedDate?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface BadgeDisplayProps {
  badge: Badge;
  size?: "sm" | "md" | "lg";
}

const iconMap = {
  award: Award,
  check: CheckCircle2,
  target: Target,
  trending: TrendingUp,
  users: Users,
  shield: Shield,
};

const rarityConfig = {
  common: {
    gradient: "from-gray-400 to-gray-600",
    glow: "shadow-gray-500/20",
    border: "border-gray-500/30",
  },
  rare: {
    gradient: "from-blue-400 to-blue-600",
    glow: "shadow-blue-500/30",
    border: "border-blue-500/30",
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    glow: "shadow-purple-500/30",
    border: "border-purple-500/30",
  },
  legendary: {
    gradient: "from-amber-400 to-amber-600",
    glow: "shadow-amber-500/40",
    border: "border-amber-500/40",
  },
};

export function BadgeDisplay({ badge, size = "md" }: BadgeDisplayProps) {
  const Icon = iconMap[badge.icon];
  const config = rarityConfig[badge.rarity];
  
  const sizeClasses = {
    sm: "w-16 h-20",
    md: "w-24 h-28",
    lg: "w-32 h-36",
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", sizeClasses[size])}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg border-2 transition-all",
          config.border,
          badge.earned ? cn("bg-gradient-to-br", config.gradient, config.glow, "shadow-lg") : "bg-muted border-border grayscale opacity-40",
          "aspect-square w-full"
        )}
        data-testid={`badge-${badge.id}`}
      >
        <Icon className={cn(iconSizes[size], badge.earned ? "text-white" : "text-muted-foreground")} />
        {!badge.earned && badge.progress !== undefined && badge.maxProgress && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-2 py-0.5">
            <span className="text-xs font-mono">
              {badge.progress}/{badge.maxProgress}
            </span>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className={cn("text-xs font-medium", badge.earned ? "text-foreground" : "text-muted-foreground")}>
          {badge.name}
        </p>
        {badge.earned && badge.earnedDate && size !== "sm" && (
          <p className="text-xs text-muted-foreground">
            {new Date(badge.earnedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Achievements</h3>
          <span className="text-sm text-muted-foreground">
            {badges.filter(b => b.earned).length} / {badges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <BadgeDisplay key={badge.id} badge={badge} size="md" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
