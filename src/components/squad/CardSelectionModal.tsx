import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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

  const sortedCards = [...userCards]
    .filter((uc) => !excludeCardIds.includes(uc.card_id))
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Card for {requiredPosition}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading cards...</p>
          ) : sortedCards.length === 0 ? (
            <p className="text-center text-muted-foreground">No available cards</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {sortedCards.map((uc) => {
                const chemistry = getChemistryMatch(uc.cards.position);
                return (
                  <div
                    key={uc.id}
                    onClick={() => handleSelect(uc.card_id)}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{uc.cards.name}</h3>
                      <Badge variant={chemistry === "perfect" ? "default" : chemistry === "good" ? "secondary" : "destructive"}>
                        {uc.cards.position}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>ATT:</span>
                        <span className={chemistry === "poor" ? "text-destructive" : ""}>
                          {chemistry === "poor" ? Math.floor(uc.cards.attack * 0.75) : uc.cards.attack}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>CON:</span>
                        <span className={chemistry === "poor" ? "text-destructive" : ""}>
                          {chemistry === "poor" ? Math.floor(uc.cards.control * 0.75) : uc.cards.control}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>DEF:</span>
                        <span className={chemistry === "poor" ? "text-destructive" : ""}>
                          {chemistry === "poor" ? Math.floor(uc.cards.defense * 0.75) : uc.cards.defense}
                        </span>
                      </div>
                      {chemistry === "poor" && (
                        <p className="text-xs text-destructive mt-2">⚠️ -25% stats (poor chemistry)</p>
                      )}
                      {chemistry === "good" && (
                        <p className="text-xs text-secondary mt-2">✓ Compatible position</p>
                      )}
                      {chemistry === "perfect" && (
                        <p className="text-xs text-primary mt-2">★ Perfect chemistry</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
