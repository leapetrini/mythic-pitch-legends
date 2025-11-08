import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Squad = () => {
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

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/collection')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Button>
          <h1 className="text-2xl md:text-3xl glow-text">MY SQUAD</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Formation Builder</h2>
            <p className="text-muted-foreground">
              Build your tactical masterpiece (Coming Soon)
            </p>
          </div>

          {/* Football Field Placeholder */}
          <div className="aspect-[3/4] bg-gradient-to-b from-green-900/20 to-green-950/20 rounded-lg border-2 border-green-700/30 relative overflow-hidden">
            {/* Field Lines */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-green-700/50" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-green-700/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-0 left-1/2 w-48 h-24 border-2 border-green-700/50 border-t-0 -translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-48 h-24 border-2 border-green-700/50 border-b-0 -translate-x-1/2" />
            </div>

            {/* Formation Preview (4-4-2) */}
            <div className="absolute inset-0 p-8">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Formation: 4-4-2</p>
                <p className="text-xs mt-2">Drag and drop your legends here</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Squad building feature coming in the next update. Stay tuned!
            </p>
            <Button onClick={() => navigate('/collection')}>
              Return to Collection
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Squad;
