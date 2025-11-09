import { ArrowLeft, MoreVertical, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface SquadHeaderProps {
  rating: number;
  chemistry: number;
}

export const SquadHeader = ({ rating, chemistry }: SquadHeaderProps) => {
  const navigate = useNavigate();
  
  const getStarCount = (rating: number) => {
    if (rating >= 90) return 5;
    if (rating >= 80) return 4;
    if (rating >= 70) return 3;
    if (rating >= 60) return 2;
    return 1;
  };

  const stars = getStarCount(rating);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-card/90 to-background/90 border-b border-border">
      <button
        onClick={() => navigate("/collection")}
        className="p-2 hover:bg-accent rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-6">
        {/* RATING */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground font-bold tracking-wider">RATING</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{rating}</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < stars
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CHEMISTRY */}
        <div className="flex flex-col items-center gap-1 min-w-[140px]">
          <span className="text-xs text-muted-foreground font-bold tracking-wider">CHEMISTRY</span>
          <div className="flex items-center gap-2 w-full">
            <Progress value={chemistry} className="h-2 flex-1" />
            <span className="text-sm font-bold text-secondary">{chemistry}</span>
          </div>
        </div>
      </div>

      <button className="p-2 hover:bg-accent rounded-lg transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
};
