-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  squad_name TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'legend')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create cards table (master card data)
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  character_type TEXT NOT NULL CHECK (character_type IN ('myth', 'pirate', 'beast', 'legend')),
  attack INTEGER NOT NULL CHECK (attack >= 1 AND attack <= 99),
  control INTEGER NOT NULL CHECK (control >= 1 AND control <= 99),
  defense INTEGER NOT NULL CHECK (defense >= 1 AND defense <= 99),
  position TEXT NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'ATT')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  lore TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on cards
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Cards are viewable by everyone
CREATE POLICY "Cards are viewable by everyone"
  ON public.cards FOR SELECT
  USING (true);

-- Create user_cards table (cards owned by users)
CREATE TABLE public.user_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Enable RLS on user_cards
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;

-- User cards policies
CREATE POLICY "Users can view their own cards"
  ON public.user_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
  ON public.user_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON public.user_cards FOR DELETE
  USING (auth.uid() = user_id);

-- Create squads table (user formations)
CREATE TABLE public.squads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  formation TEXT NOT NULL DEFAULT '4-4-2',
  positions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on squads
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

-- Squads policies
CREATE POLICY "Users can view their own squads"
  ON public.squads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own squads"
  ON public.squads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own squads"
  ON public.squads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own squads"
  ON public.squads FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, squad_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'squad_name', 'Team Legends')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_squads_updated_at
  BEFORE UPDATE ON public.squads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some starter cards
INSERT INTO public.cards (name, character_type, attack, control, defense, position, rarity, lore) VALUES
  ('Zeus Striker', 'myth', 92, 75, 68, 'ATT', 'legendary', 'Thunder god who strikes with divine power'),
  ('Poseidon Guardian', 'myth', 70, 82, 88, 'DEF', 'epic', 'Sea lord who defends like crashing waves'),
  ('Blackbeard Raider', 'pirate', 85, 78, 72, 'MID', 'epic', 'Fearsome pirate captain with tactical cunning'),
  ('Phoenix Keeper', 'beast', 65, 70, 95, 'GK', 'legendary', 'Immortal guardian who rises from ashes'),
  ('Odin Tactician', 'myth', 78, 90, 75, 'MID', 'legendary', 'All-seeing strategist who controls the field'),
  ('Kraken Defender', 'beast', 72, 68, 90, 'DEF', 'epic', 'Sea monster with impenetrable defense'),
  ('Athena General', 'myth', 80, 88, 85, 'MID', 'epic', 'Goddess of wisdom and tactical warfare'),
  ('Dragon Striker', 'beast', 90, 72, 70, 'ATT', 'legendary', 'Fierce dragon with devastating attacks'),
  ('Spartan Wall', 'legend', 68, 75, 92, 'DEF', 'rare', 'Unbreakable defender of ancient glory'),
  ('Viking Raider', 'legend', 88, 70, 68, 'ATT', 'rare', 'Fearless warrior with relentless aggression'),
  ('Medusa Striker', 'myth', 85, 73, 65, 'ATT', 'epic', 'Petrifying gaze that freezes opponents'),
  ('Hercules Champion', 'myth', 87, 80, 82, 'MID', 'legendary', 'Demigod of strength and heroism'),
  ('Siren Midfielder', 'beast', 75, 85, 70, 'MID', 'rare', 'Enchanting presence that controls the tempo'),
  ('Cyclops Bastion', 'beast', 70, 65, 88, 'DEF', 'rare', 'One-eyed giant with crushing strength'),
  ('Valkyrie Winger', 'legend', 83, 88, 72, 'MID', 'epic', 'Swift warrior who chooses the victorious');
