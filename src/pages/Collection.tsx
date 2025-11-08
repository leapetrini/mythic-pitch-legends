import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "@/components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Collection = () => {
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        loadCards();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('rarity', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading cards",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const filteredCards = cards.filter(card => {
    if (filter === "all") return true;
    return card.position === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your legends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl glow-text">PIXEL LEGENDS</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/squad')}>
              <Users className="w-4 h-4 mr-2" />
              My Squad
            </Button>
            <Button variant="outline" onClick={() => navigate('/rankings')}>
              <Trophy className="w-4 h-4 mr-2" />
              Rankings
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl mb-2">Card Collection</h2>
          <p className="text-muted-foreground">
            {cards.length} legendary heroes available
          </p>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="GK">Goalkeeper</TabsTrigger>
            <TabsTrigger value="DEF">Defenders</TabsTrigger>
            <TabsTrigger value="MID">Midfielders</TabsTrigger>
            <TabsTrigger value="ATT">Attackers</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <div key={card.id} className="flex justify-center">
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

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No cards found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Collection;
