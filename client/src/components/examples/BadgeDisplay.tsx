import { BadgeGrid, type Badge } from "../BadgeDisplay";

const mockBadges: Badge[] = [
  {
    id: "1",
    name: "First Review",
    description: "Complete your first KYC review",
    icon: "check",
    earned: true,
    rarity: "common",
    earnedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Speed Demon",
    description: "Process 10 applications in one day",
    icon: "trending",
    earned: true,
    rarity: "rare",
    earnedDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Compliance Master",
    description: "Achieve 100% approval rate for 50 reviews",
    icon: "shield",
    earned: true,
    rarity: "epic",
    earnedDate: "2024-02-01",
  },
  {
    id: "4",
    name: "Team Player",
    description: "Collaborate on 25 applications",
    icon: "users",
    earned: false,
    rarity: "common",
    progress: 18,
    maxProgress: 25,
  },
  {
    id: "5",
    name: "Perfect Month",
    description: "Complete a month with zero rejections",
    icon: "target",
    earned: false,
    rarity: "legendary",
  },
  {
    id: "6",
    name: "Century Club",
    description: "Review 100 applications",
    icon: "award",
    earned: false,
    rarity: "epic",
    progress: 73,
    maxProgress: 100,
  },
];

export default function BadgeDisplayExample() {
  return (
    <div className="p-8">
      <BadgeGrid badges={mockBadges} />
    </div>
  );
}
