import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react";

const Rankings = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'legend':
        return <Trophy className="w-6 h-6 text-accent" />;
      case 'gold':
        return <Award className="w-6 h-6 text-control" />;
      case 'silver':
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      default:
        return <Medal className="w-6 h-6 text-destructive" />;
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/collection')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>
          <h1 className="text-2xl md:text-3xl glow-text">RANKINGS</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Global Leaderboard</h2>
            <p className="text-muted-foreground">
              Climb the ranks and become a legend
            </p>
          </div>

          {/* Tier badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-glow bg-card p-4 text-center rounded-lg">
              <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm font-bold">Legend</p>
              <p className="text-xs text-muted-foreground">Top 100</p>
            </div>
            <div className="card-glow bg-card p-4 text-center rounded-lg">
              <Award className="w-8 h-8 text-control mx-auto mb-2" />
              <p className="text-sm font-bold">Gold</p>
              <p className="text-xs text-muted-foreground">Top 1000</p>
            </div>
            <div className="card-glow bg-card p-4 text-center rounded-lg">
              <Medal className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold">Silver</p>
              <p className="text-xs text-muted-foreground">Top 10k</p>
            </div>
            <div className="card-glow bg-card p-4 text-center rounded-lg">
              <Medal className="w-8 h-8 text-destructive mx-auto mb-2" />
              <p className="text-sm font-bold">Bronze</p>
              <p className="text-xs text-muted-foreground">Everyone</p>
            </div>
          </div>

          {/* Placeholder leaderboard */}
          <div className="card-glow bg-card rounded-lg p-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground mb-2">
                Leaderboard Coming Soon
              </p>
              <p className="text-sm text-muted-foreground">
                Start building your squad and prepare for competitive matches!
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => navigate('/collection')}>
              Return to Collection
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rankings;
