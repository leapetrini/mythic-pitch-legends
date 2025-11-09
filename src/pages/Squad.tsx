import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { FormationSelector, FormationType } from "@/components/squad/FormationSelector";
import { SquadFieldLayout } from "@/components/squad/SquadFieldLayout";
import { CardSelectionModal } from "@/components/squad/CardSelectionModal";
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
          .select("id, name, position, rarity")
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
      .select("id, name, position, rarity")
      .eq("id", cardId)
      .single();

    if (card && selectedSlot) {
      setPositions(prev => ({ ...prev, [selectedSlot]: cardId }));
      setCardDetails(prev => ({ ...prev, [cardId]: card }));
      setSelectedSlot(null);
    }
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
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/collection')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>
          <h1 className="text-2xl md:text-3xl glow-text">MY SQUAD</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl mb-2">Formation Builder</h2>
              <p className="text-muted-foreground">
                Build your tactical masterpiece
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <FormationSelector value={formation} onChange={(val) => setFormation(val as FormationType)} />
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Squad
              </Button>
            </div>
          </div>

          <SquadFieldLayout
            formation={formation}
            positions={positions}
            onSlotClick={handleSlotClick}
            cardDetails={cardDetails}
          />

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Click on position slots to assign cards. Chemistry bonus applies when card position matches slot.
            </p>
          </div>
        </div>
      </main>

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
