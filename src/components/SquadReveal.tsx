import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/PlayerCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Card {
  id: string;
  name: string;
  character_type: string;
  attack: number;
  control: number;
  defense: number;
  position: string;
  rarity: string;
  lore: string;
  image_url?: string;
}

interface SquadRevealProps {
  userId: string;
  onComplete: () => void;
}

const FORMATION_442 = {
  GK: 1,
  DEF: 4, // 2 CB, 1 LB, 1 RB
  MID: 4, // 3 CM-like, can be LM/CM/RM
  ATT: 2  // 2 ST/Wingers
};

export const SquadReveal = ({ userId, onComplete }: SquadRevealProps) => {
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    generateStarterSquad();
  }, []);

  const generateStarterSquad = async () => {
    try {
      // Get Greek cards by position
      const { data: gkCards } = await supabase
        .from('cards')
        .select('*')
        .eq('character_type', 'greek')
        .eq('position', 'GK')
        .limit(10);

      const { data: defCards } = await supabase
        .from('cards')
        .select('*')
        .eq('character_type', 'greek')
        .eq('position', 'DEF')
        .limit(20);

      const { data: midCards } = await supabase
        .from('cards')
        .select('*')
        .eq('character_type', 'greek')
        .eq('position', 'MID')
        .limit(20);

      const { data: attCards } = await supabase
        .from('cards')
        .select('*')
        .eq('character_type', 'greek')
        .eq('position', 'ATT')
        .limit(20);

      const squad: Card[] = [];

      // Pick 1 GK
      if (gkCards && gkCards.length > 0) {
        squad.push(gkCards[Math.floor(Math.random() * gkCards.length)]);
      }

      // Pick 4 DEF (2 CB + 2 FB)
      if (defCards && defCards.length >= 4) {
        const shuffled = [...defCards].sort(() => Math.random() - 0.5);
        squad.push(...shuffled.slice(0, 4));
      }

      // Pick 4 MID
      if (midCards && midCards.length >= 4) {
        const shuffled = [...midCards].sort(() => Math.random() - 0.5);
        squad.push(...shuffled.slice(0, 4));
      }

      // Pick 2 ATT
      if (attCards && attCards.length >= 2) {
        const shuffled = [...attCards].sort(() => Math.random() - 0.5);
        squad.push(...shuffled.slice(0, 2));
      }

      setRevealedCards(squad);
      startRevealAnimation(squad.length);
    } catch (error) {
      console.error('Error generating squad:', error);
      toast({
        title: "Error",
        description: "Failed to generate your starter squad",
        variant: "destructive",
      });
    }
  };

  const startRevealAnimation = (totalCards: number) => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setCurrentIndex(index);
      
      if (index >= totalCards) {
        clearInterval(interval);
        setIsRevealing(false);
      }
    }, 600); // Reveal one card every 600ms
  };

  const saveSquad = async () => {
    if (revealedCards.length === 0) return;
    
    setIsSaving(true);
    try {
      // Save cards to user_cards
      const userCardsData = revealedCards.map(card => ({
        user_id: userId,
        card_id: card.id,
      }));

      const { error: userCardsError } = await supabase
        .from('user_cards')
        .insert(userCardsData);

      if (userCardsError) throw userCardsError;

      // Create positions JSON for squad
      const positions: Record<string, string> = {};
      let gkIndex = 0, defIndex = 0, midIndex = 0, attIndex = 0;

      revealedCards.forEach(card => {
        if (card.position === 'GK') {
          positions['GK'] = card.id;
          gkIndex++;
        } else if (card.position === 'DEF') {
          if (defIndex === 0) positions['LB'] = card.id;
          else if (defIndex === 1) positions['CB1'] = card.id;
          else if (defIndex === 2) positions['CB2'] = card.id;
          else if (defIndex === 3) positions['RB'] = card.id;
          defIndex++;
        } else if (card.position === 'MID') {
          if (midIndex === 0) positions['LM'] = card.id;
          else if (midIndex === 1) positions['CM1'] = card.id;
          else if (midIndex === 2) positions['CM2'] = card.id;
          else if (midIndex === 3) positions['RM'] = card.id;
          midIndex++;
        } else if (card.position === 'ATT') {
          if (attIndex === 0) positions['ST1'] = card.id;
          else if (attIndex === 1) positions['ST2'] = card.id;
          attIndex++;
        }
      });

      // Save squad
      const { error: squadError } = await supabase
        .from('squads')
        .insert({
          user_id: userId,
          formation: '4-4-2',
          positions: positions,
          is_active: true,
        });

      if (squadError) throw squadError;

      toast({
        title: "Squad Created!",
        description: "Your Greek Legends are ready for battle",
      });

      onComplete();
    } catch (error: any) {
      console.error('Error saving squad:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background via-background/95 to-primary/5">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
          YOUR GREEK LEGENDS
        </h1>
        <p className="text-muted-foreground text-lg">
          {isRevealing 
            ? `Revealing ${currentIndex} of ${revealedCards.length}...` 
            : "Your starting eleven awaits your command"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl w-full mb-8">
        {revealedCards.map((card, index) => (
          <div
            key={card.id}
            className={`transition-all duration-500 ${
              index < currentIndex
                ? "opacity-100 scale-100 animate-scale-in"
                : "opacity-0 scale-95"
            }`}
          >
            <PlayerCard
              name={card.name}
              characterType={card.character_type}
              attack={card.attack}
              control={card.control}
              defense={card.defense}
              position={card.position}
              rarity={card.rarity}
              lore={card.lore}
              imageUrl={card.image_url}
            />
          </div>
        ))}
      </div>

      {!isRevealing && (
        <div className="flex gap-4 animate-fade-in">
          <Button
            size="lg"
            onClick={saveSquad}
            disabled={isSaving}
            className="text-lg px-8"
          >
            {isSaving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Begin Your Journey
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={generateStarterSquad}
            disabled={isSaving}
            className="text-lg px-8"
          >
            Randomize Again
          </Button>
        </div>
      )}
    </div>
  );
};
