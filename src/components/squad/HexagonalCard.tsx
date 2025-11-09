import { Plus } from "lucide-react";
import pixelLegendsLogo from "@/assets/pixel-legends-logo.png";

interface CardDetails {
  id: string;
  name: string;
  position: string;
  rarity: string;
  attack: number;
  control: number;
  defense: number;
  image_url: string | null;
}

interface HexagonalCardProps {
  position: string;
  cardDetails?: CardDetails;
  onClick: () => void;
  chemistry?: "perfect" | "good" | "poor";
}

export const HexagonalCard = ({
  position,
  cardDetails,
  onClick,
  chemistry = "perfect",
}: HexagonalCardProps) => {
  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: "from-gray-600 to-gray-700",
      rare: "from-blue-500 to-blue-600",
      epic: "from-purple-500 to-purple-600",
      legendary: "from-primary to-orange-600",
    };
    return colors[rarity.toLowerCase()] || colors.common;
  };

  const getChemistryBorder = () => {
    if (chemistry === "perfect") return "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]";
    if (chemistry === "good") return "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]";
    return "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]";
  };

  const getRating = (card: CardDetails) => {
    return Math.round((card.attack + card.control + card.defense) / 3);
  };

  if (!cardDetails) {
    // Empty slot
    return (
      <div
        onClick={onClick}
        className="relative w-24 h-28 cursor-pointer group transition-transform hover:scale-105"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-card/60 to-background/60 backdrop-blur-sm border-2 border-border/40 group-hover:border-primary/60 transition-colors">
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={pixelLegendsLogo}
              alt="Pixel Legends"
              className="w-10 h-10 opacity-30 group-hover:opacity-50 transition-opacity"
            />
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mt-2" />
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card/90 px-3 py-1 rounded text-xs font-bold border border-border">
          {position}
        </div>
      </div>
    );
  }

  // Filled slot
  const rating = getRating(cardDetails);

  return (
    <div
      onClick={onClick}
      className="relative w-24 h-28 cursor-pointer group transition-transform hover:scale-105"
      style={{
        clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
      }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(
          cardDetails.rarity
        )} border-2 ${getChemistryBorder()}`}
      >
        {/* Rating badge */}
        <div className="absolute top-1 left-2 text-white font-bold text-lg drop-shadow-lg z-10">
          {chemistry === "poor" ? Math.floor(rating * 0.75) : rating}
        </div>

        {/* Player image */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {cardDetails.image_url ? (
            <img
              src={cardDetails.image_url}
              alt={cardDetails.name}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-16 h-16 bg-background/40 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="absolute bottom-1 left-0 right-0 text-center px-1">
          <p className="text-white text-[10px] font-bold drop-shadow-lg truncate">
            {cardDetails.name}
          </p>
        </div>

        {/* Position badge */}
        <div className="absolute top-1 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
          {cardDetails.position}
        </div>
      </div>

      {/* Position label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card/90 px-3 py-1 rounded text-xs font-bold border border-border">
        {position}
      </div>
    </div>
  );
};
