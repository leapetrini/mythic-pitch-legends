import { formations } from "./FormationSelector";
import { HexagonalCard } from "./HexagonalCard";
import grassTexture from "@/assets/grass-texture.jpg";

interface SquadFieldLayoutProps {
  formation: string;
  positions: Record<string, string>;
  onSlotClick: (position: string) => void;
  cardDetails: Record<string, any>;
}

export const SquadFieldLayout = ({
  formation,
  positions,
  onSlotClick,
  cardDetails,
}: SquadFieldLayoutProps) => {
  const formationPositions = formations[formation];

  const getChemistryMatch = (cardPosition: string, requiredPosition: string) => {
    if (cardPosition === requiredPosition) return "perfect";
    
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

    if (compatible[requiredPosition]?.includes(cardPosition)) return "good";
    return "poor";
  };

  return (
    <div
      className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-2xl"
      style={{
        backgroundImage: `url(${grassTexture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Field lines overlay */}
      <div className="absolute inset-0 opacity-40">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full" />
        {/* Center line */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white" />
        {/* Top penalty area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 border-2 border-white border-t-0" />
        {/* Bottom penalty area */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 border-2 border-white border-b-0" />
      </div>

      {/* Dark overlay for better card visibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Position slots */}
      <div className="absolute inset-0 pt-8">
        {Object.entries(formationPositions).map(([pos, coords]: [string, any]) => {
          const cardId = positions[pos];
          const card = cardId ? cardDetails[cardId] : undefined;
          const chemistry = card ? getChemistryMatch(card.position, pos) : "perfect";

          return (
            <div
              key={pos}
              className="absolute"
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <HexagonalCard
                position={pos}
                cardDetails={card}
                onClick={() => onSlotClick(pos)}
                chemistry={chemistry}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
