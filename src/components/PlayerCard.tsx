import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import cardBack from "@/assets/card-back.jpg";
import { Swords, Target, Shield } from "lucide-react";

interface PlayerCardProps {
  name: string;
  characterType: string;
  attack: number;
  control: number;
  defense: number;
  position: string;
  rarity: string;
  lore?: string;
  imageUrl?: string;
}

const rarityColors = {
  common: "bg-muted",
  rare: "bg-secondary",
  epic: "bg-primary",
  legendary: "bg-accent",
};

const positionColors = {
  GK: "bg-defense",
  DEF: "bg-defense",
  MID: "bg-control",
  ATT: "bg-attack",
};

export const PlayerCard = ({ 
  name, 
  characterType, 
  attack, 
  control, 
  defense, 
  position, 
  rarity,
  lore,
  imageUrl 
}: PlayerCardProps) => {
  return (
    <Card className="card-glow overflow-hidden cursor-pointer group relative aspect-[2/3] max-w-[280px]">
      {/* Card Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
        style={{ backgroundImage: `url(${cardBack})` }}
      />

      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${positionColors[position as keyof typeof positionColors]} text-xs font-bold`}>
            {position}
          </Badge>
          <Badge variant="outline" className={`${rarityColors[rarity as keyof typeof rarityColors]} text-xs capitalize`}>
            {rarity}
          </Badge>
        </div>

        {/* Card Image Area */}
        <div className="flex-1 flex items-center justify-center my-4">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="max-h-32 object-contain"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 flex items-center justify-center">
              <span className="text-4xl">⚔️</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-center mb-1 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
        
        {/* Character Type */}
        <p className="text-xs text-muted-foreground text-center capitalize mb-3">
          {characterType}
        </p>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 stat-attack" />
            <span className="text-xs text-muted-foreground">Attack</span>
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-attack transition-all"
                style={{ width: `${attack}%` }}
              />
            </div>
            <span className="text-sm font-bold stat-attack w-8 text-right">{attack}</span>
          </div>

          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 stat-control" />
            <span className="text-xs text-muted-foreground">Control</span>
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-control transition-all"
                style={{ width: `${control}%` }}
              />
            </div>
            <span className="text-sm font-bold stat-control w-8 text-right">{control}</span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 stat-defense" />
            <span className="text-xs text-muted-foreground">Defense</span>
            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-defense transition-all"
                style={{ width: `${defense}%` }}
              />
            </div>
            <span className="text-sm font-bold stat-defense w-8 text-right">{defense}</span>
          </div>
        </div>

        {/* Lore (on hover) */}
        {lore && (
          <div className="absolute inset-0 bg-card/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-center justify-center">
            <p className="text-sm text-center">{lore}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
