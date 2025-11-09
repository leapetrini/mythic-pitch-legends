import { Plus } from "lucide-react";
import { formations, FormationType } from "./FormationSelector";
import { Badge } from "@/components/ui/badge";

interface SquadFieldLayoutProps {
  formation: FormationType;
  positions: Record<string, string>;
  onSlotClick: (position: string) => void;
  cardDetails: Record<string, {
    name: string;
    position: string;
    rarity: string;
  }>;
}

export const SquadFieldLayout = ({
  formation,
  positions,
  onSlotClick,
  cardDetails,
}: SquadFieldLayoutProps) => {
  const layout = formations[formation];

  const getChemistryColor = (slotPosition: string, cardId: string) => {
    if (!cardId || !cardDetails[cardId]) return "border-border";
    
    const cardPosition = cardDetails[cardId].position;
    if (cardPosition === slotPosition) return "border-primary";
    
    const compatible: Record<string, string[]> = {
      ST: ["ST", "CF", "LW", "RW"],
      LW: ["LW", "ST", "LM"],
      RW: ["RW", "ST", "RM"],
      CAM: ["CAM", "CM", "LM", "RM"],
      CM: ["CM", "CAM", "CDM"],
      CDM: ["CDM", "CM", "CB"],
      LM: ["LM", "LW", "LB"],
      RM: ["RM", "RW", "RB"],
      LB: ["LB", "LM", "CB"],
      RB: ["RB", "RM", "CB"],
      CB: ["CB", "CDM"],
      GK: ["GK"],
    };

    if (compatible[slotPosition]?.includes(cardPosition)) return "border-secondary";
    return "border-destructive";
  };

  return (
    <div className="aspect-[3/4] bg-gradient-to-b from-green-900/20 to-green-950/20 rounded-lg border-2 border-green-700/30 relative overflow-hidden">
      {/* Field Lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-green-700/50" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-green-700/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 left-1/2 w-48 h-24 border-2 border-green-700/50 border-t-0 -translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-48 h-24 border-2 border-green-700/50 border-b-0 -translate-x-1/2" />
      </div>

      {/* Position Slots */}
      <div className="absolute inset-0">
        {Object.entries(layout).map(([position, coords]) => {
          const cardId = positions[position];
          const card = cardId ? cardDetails[cardId] : null;
          
          return (
            <div
              key={position}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            >
              <div
                onClick={() => onSlotClick(position)}
                className={`w-20 h-28 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 flex flex-col items-center justify-center p-2 ${
                  card 
                    ? `${getChemistryColor(position, cardId)} bg-card/90 backdrop-blur-sm` 
                    : "border-dashed border-border bg-background/50 backdrop-blur-sm hover:bg-accent/50"
                }`}
              >
                {card ? (
                  <>
                    <Badge variant="outline" className="text-xs mb-1">
                      {position}
                    </Badge>
                    <p className="text-xs font-bold text-center line-clamp-2">
                      {card.name}
                    </p>
                    <Badge className="text-xs mt-1">
                      {card.position}
                    </Badge>
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6 mb-1 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">{position}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
