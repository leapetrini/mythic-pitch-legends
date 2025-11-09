import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { StatsBar } from "./StatsBar";
import { PositionFilter } from "./PositionFilter";
import patternBg from "@/assets/pattern-bg.png";

interface UserCard {
  id: string;
  card_id: string;
  cards: {
    id: string;
    name: string;
    position: string;
    rarity: string;
    attack: number;
    control: number;
    defense: number;
    image_url: string | null;
  };
}

interface CardSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (cardId: string) => void;
  requiredPosition: string;
  userId: string;
  excludeCardIds?: string[];
}

export const CardSelectionModal = ({
  open,
  onClose,
  onSelect,
  requiredPosition,
  userId,
  excludeCardIds = [],
}: CardSelectionModalProps) => {
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(requiredPosition);

  useEffect(() => {
    if (open && userId) {
      fetchUserCards();
    }
  }, [open, userId]);

  const fetchUserCards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_cards")
      .select(`
        id,
        card_id,
        cards (
          id,
          name,
          position,
          rarity,
          attack,
          control,
          defense,
          image_url
        )
      `)
      .eq("user_id", userId);

    if (!error && data) {
      setUserCards(data as UserCard[]);
    }
    setLoading(false);
  };

  const getChemistryMatch = (cardPosition: string) => {
    // Exact match
    if (cardPosition === requiredPosition) return "perfect";
    
    // Position compatibility
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

  const allPositions = ["ALL", requiredPosition, "ST", "LW", "RW", "CAM", "CM", "CDM", "LM", "RM", "LB", "CB", "RB", "GK"];
  const uniquePositions = Array.from(new Set(allPositions));

  const filteredAndSortedCards = [...userCards]
    .filter((uc) => !excludeCardIds.includes(uc.card_id))
    .filter((uc) => {
      const matchesSearch = uc.cards.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = selectedFilter === "ALL" || uc.cards.position === selectedFilter;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      const aMatch = getChemistryMatch(a.cards.position);
      const bMatch = getChemistryMatch(b.cards.position);
      const order = { perfect: 0, good: 1, poor: 2 };
      return order[aMatch] - order[bMatch];
    });

  const handleSelect = (cardId: string) => {
    onSelect(cardId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 overflow-hidden"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundSize: "cover",
        }}
      >
        <div className="bg-background/95 backdrop-blur-sm">
          {/* Stats Bar */}
          <StatsBar
            cardCount={userCards.length}
            totalCards={100}
          />

          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/60 border-border"
              />
            </div>
          </div>

          <DialogHeader className="px-4 pt-3 pb-2">
            <DialogTitle className="text-lg">Select Card for {requiredPosition}</DialogTitle>
          </DialogHeader>

          {/* Position Filters */}
          <PositionFilter
            positions={uniquePositions}
            selectedPosition={selectedFilter}
            onSelect={setSelectedFilter}
          />

          {/* Cards Grid */}
          <ScrollArea className="h-[400px] px-4 pb-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading cards...</p>
            ) : filteredAndSortedCards.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No available cards</p>
            ) : (
              <div className="grid grid-cols-4 gap-4 pt-4">
                {filteredAndSortedCards.map((uc) => {
                  const chemistry = getChemistryMatch(uc.cards.position);
                  const rating = Math.round((uc.cards.attack + uc.cards.control + uc.cards.defense) / 3);
                  const displayRating = chemistry === "poor" ? Math.floor(rating * 0.75) : rating;

                  return (
                    <div
                      key={uc.id}
                      onClick={() => handleSelect(uc.card_id)}
                      className="relative border rounded-lg p-3 cursor-pointer hover:scale-105 transition-all bg-gradient-to-br from-card to-card/60 hover:shadow-[0_0_20px_rgba(255,102,0,0.3)]"
                    >
                      {/* Chemistry Badge */}
                      <Badge 
                        variant={chemistry === "perfect" ? "default" : chemistry === "good" ? "secondary" : "destructive"}
                        className="absolute -top-2 -right-2 z-10"
                      >
                        {chemistry === "perfect" ? "★" : chemistry === "good" ? "✓" : "⚠"}
                      </Badge>

                      {/* Rating */}
                      <div className="absolute top-2 left-2 text-2xl font-bold text-primary drop-shadow-lg">
                        {displayRating}
                      </div>

                      {/* Card Image */}
                      <div className="aspect-square flex items-center justify-center mb-2">
                        {uc.cards.image_url ? (
                          <img 
                            src={uc.cards.image_url} 
                            alt={uc.cards.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-3xl">
                            ⚽
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="text-center">
                        <h3 className="font-bold text-sm truncate">{uc.cards.name}</h3>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {uc.cards.position}
                          </Badge>
                          <span className="text-xs text-muted-foreground capitalize">
                            {uc.cards.rarity}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                        <div className="text-center">
                          <div className="text-muted-foreground">ATT</div>
                          <div className={`font-bold ${chemistry === "poor" ? "text-destructive" : "stat-attack"}`}>
                            {chemistry === "poor" ? Math.floor(uc.cards.attack * 0.75) : uc.cards.attack}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">CON</div>
                          <div className={`font-bold ${chemistry === "poor" ? "text-destructive" : "stat-control"}`}>
                            {chemistry === "poor" ? Math.floor(uc.cards.control * 0.75) : uc.cards.control}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">DEF</div>
                          <div className={`font-bold ${chemistry === "poor" ? "text-destructive" : "stat-defense"}`}>
                            {chemistry === "poor" ? Math.floor(uc.cards.defense * 0.75) : uc.cards.defense}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
