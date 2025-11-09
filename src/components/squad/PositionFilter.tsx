interface PositionFilterProps {
  positions: string[];
  selectedPosition: string;
  onSelect: (position: string) => void;
}

export const PositionFilter = ({
  positions,
  selectedPosition,
  onSelect,
}: PositionFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4">
      {positions.map((pos) => (
        <button
          key={pos}
          onClick={() => onSelect(pos)}
          className={`min-w-[60px] h-[60px] rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            selectedPosition === pos
              ? "bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(0,184,212,0.5)] scale-110"
              : "bg-card/60 text-muted-foreground hover:bg-card hover:scale-105"
          }`}
        >
          {pos}
        </button>
      ))}
    </div>
  );
};
