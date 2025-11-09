import { Coins, TrendingUp, User } from "lucide-react";

interface StatsBarProps {
  username?: string;
  level?: number;
  coins?: number;
  cardCount?: number;
  totalCards?: number;
}

export const StatsBar = ({
  username = "Player",
  level = 1,
  coins = 0,
  cardCount = 0,
  totalCards = 100,
}: StatsBarProps) => {
  const completionPercentage = totalCards > 0 ? Math.round((cardCount / totalCards) * 100) : 0;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card/40 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">{username}</span>
        </div>
        <div className="flex items-center gap-1 bg-background/60 px-2 py-1 rounded">
          <TrendingUp className="w-3 h-3 text-secondary" />
          <span className="text-xs font-bold">LVL {level}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-background/60 px-3 py-1 rounded">
          <Coins className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">{coins.toLocaleString()}</span>
        </div>
        <div className="text-xs">
          <span className="font-bold text-secondary">{cardCount}</span>
          <span className="text-muted-foreground">/{totalCards}</span>
          <span className="text-muted-foreground ml-1">({completionPercentage}%)</span>
        </div>
      </div>
    </div>
  );
};
