import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { Swords, Users, Trophy } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl mb-6 glow-text animate-fade-in">
            PIXEL LEGENDS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/90 font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Build legendary squads. Command mythic heroes. Dominate the field.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6 glow-box hover:scale-105 transition-transform"
            >
              Build Your Squad Now
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full p-1">
            <div className="w-1 h-3 bg-primary rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-16 glow-text">
            Your Legend Begins Now
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-glow bg-card p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Swords className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl mb-4">Mythic Collection</h3>
              <p className="text-muted-foreground">
                Collect legendary heroes from myth, lore, and legend. Each card tells an epic story.
              </p>
            </div>

            <div className="card-glow bg-card p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl mb-4">Tactical Mastery</h3>
              <p className="text-muted-foreground">
                Build strategic formations. Master Attack, Control, and Defense stats.
              </p>
            </div>

            <div className="card-glow bg-card p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl mb-4">Epic Battles</h3>
              <p className="text-muted-foreground">
                Face rivals in turn-based duels. Climb the leaderboard to legendary status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Ready to Forge Your Legacy?
          </h2>
          <p className="text-xl mb-8 text-foreground/80">
            Join thousands of legends building their ultimate squads.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg px-12 py-6 glow-box"
          >
            Start Playing Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
