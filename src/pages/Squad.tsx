import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";
import { FormationSelector, FormationType } from "@/components/squad/FormationSelector";
import { SquadFieldLayout } from "@/components/squad/SquadFieldLayout";
import { CardSelectionModal } from "@/components/squad/CardSelectionModal";
import { SquadHeader } from "@/components/squad/SquadHeader";
import { useToast } from "@/hooks/use-toast";

const Squad = () => {
  const [user, setUser] = useState<any>(null);
  const [formation, setFormation] = useState<FormationType>("4-4-2");
  const [positions, setPositions] = useState<Record<string, string>>({});
  const [cardDetails, setCardDetails] = useState<Record<string, any>>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [squadId, setSquadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        loadSquad(session.user.id);
      }
    });
  }, [navigate]);

  const loadSquad = async (userId: string) => {
    setLoading(true);
    const { data: squad } = await supabase
      .from("squads")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (squad) {
      setSquadId(squad.id);
      setFormation(squad.formation as FormationType);
      
      const positionsData = squad.positions as Record<string, string> || {};
      setPositions(positionsData);
      
      // Load card details
      const cardIds = Object.values(positionsData).filter(Boolean) as string[];
      if (cardIds.length > 0) {
        const { data: cards } = await supabase
          .from("cards")
          .select("id, name, position, rarity, attack, control, defense, image_url")
          .in("id", cardIds);
        
        if (cards) {
          const details: Record<string, any> = {};
          cards.forEach(card => {
            details[card.id] = card;
          });
          setCardDetails(details);
        }
      }
    }
    setLoading(false);
  };

  const handleSlotClick = (position: string) => {
    setSelectedSlot(position);
  };

  const handleCardSelect = async (cardId: string) => {
    const { data: card } = await supabase
      .from("cards")
      .select("id, name, position, rarity, attack, control, defense, image_url")
      .eq("id", cardId)
      .single();

    if (card && selectedSlot) {
      setPositions(prev => ({ ...prev, [selectedSlot]: cardId }));
      setCardDetails(prev => ({ ...prev, [cardId]: card }));
      setSelectedSlot(null);
    }
  };

  const calculateRating = () => {
    const filledCards = Object.values(positions)
      .filter(Boolean)
      .map(cardId => cardDetails[cardId])
      .filter(Boolean);
    
    if (filledCards.length === 0) return 0;
    
    const totalRating = filledCards.reduce((sum, card) => {
      return sum + Math.round((card.attack + card.control + card.defense) / 3);
    }, 0);
    
    return Math.round(totalRating / filledCards.length);
  };

  const calculateChemistry = () => {
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

    const filledSlots = Object.entries(positions).filter(([_, cardId]) => cardId);
    if (filledSlots.length === 0) return 0;

    let totalPoints = 0;
    filledSlots.forEach(([position, cardId]) => {
      const card = cardDetails[cardId];
      if (!card) return;
      
      const chemistry = getChemistryMatch(card.position, position);
      if (chemistry === "perfect") totalPoints += 10;
      else if (chemistry === "good") totalPoints += 6;
    });

    return Math.round((totalPoints / (11 * 10)) * 100);
  };

  const handleSave = async () => {
    if (!user) return;

    const filledSlots = Object.keys(positions).filter(key => positions[key]);
    if (filledSlots.length !== 11) {
      toast({
        title: "Incomplete Squad",
        description: `You need 11 players. Current: ${filledSlots.length}/11`,
        variant: "destructive",
      });
      return;
    }

    const squadData = {
      user_id: user.id,
      formation,
      positions,
      is_active: true,
    };

    if (squadId) {
      const { error } = await supabase
        .from("squads")
        .update(squadData)
        .eq("id", squadId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update squad",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Squad Saved",
          description: "Your formation has been updated",
        });
      }
    } else {
      const { data, error } = await supabase
        .from("squads")
        .insert(squadData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create squad",
          variant: "destructive",
        });
      } else {
        setSquadId(data.id);
        toast({
          title: "Squad Created",
          description: "Your formation has been saved",
        });
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Squad Header with Rating/Chemistry */}
      <SquadHeader rating={calculateRating()} chemistry={calculateChemistry()} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Formation Selector and Save Button */}
          <div className="flex justify-between items-center mb-6">
            <FormationSelector value={formation} onChange={(val) => setFormation(val as FormationType)} />
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                SBC CONDITIONS
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Squad
              </Button>
            </div>
          </div>

          {/* Field Layout */}
          <SquadFieldLayout
            formation={formation}
            positions={positions}
            onSlotClick={handleSlotClick}
            cardDetails={cardDetails}
          />

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Click on position slots to assign cards. Chemistry bonus applies when card position matches slot.
            </p>
          </div>
        </div>
      </main>

      {/* Card Selection Modal */}
      {selectedSlot && user && (
        <CardSelectionModal
          open={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSelect={handleCardSelect}
          requiredPosition={selectedSlot}
          userId={user.id}
          excludeCardIds={Object.values(positions).filter(Boolean)}
        />
      )}
    </div>
  );
};

export default Squad;
