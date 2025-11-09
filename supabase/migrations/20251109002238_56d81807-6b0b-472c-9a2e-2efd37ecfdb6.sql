-- Update character_type constraint to include 'greek'
ALTER TABLE public.cards DROP CONSTRAINT IF EXISTS cards_character_type_check;
ALTER TABLE public.cards ADD CONSTRAINT cards_character_type_check 
  CHECK (character_type IN ('pirate', 'beast', 'myth', 'legend', 'greek'));