import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const formations = {
  "4-4-2": {
    GK: { x: 50, y: 90 },
    LB: { x: 15, y: 70 },
    CB1: { x: 35, y: 70 },
    CB2: { x: 65, y: 70 },
    RB: { x: 85, y: 70 },
    LM: { x: 15, y: 45 },
    CM1: { x: 40, y: 45 },
    CM2: { x: 60, y: 45 },
    RM: { x: 85, y: 45 },
    ST1: { x: 35, y: 15 },
    ST2: { x: 65, y: 15 },
  },
  "4-3-3": {
    GK: { x: 50, y: 90 },
    LB: { x: 15, y: 70 },
    CB1: { x: 35, y: 70 },
    CB2: { x: 65, y: 70 },
    RB: { x: 85, y: 70 },
    CDM: { x: 50, y: 50 },
    CM1: { x: 30, y: 45 },
    CM2: { x: 70, y: 45 },
    LW: { x: 15, y: 15 },
    ST: { x: 50, y: 15 },
    RW: { x: 85, y: 15 },
  },
  "3-5-2": {
    GK: { x: 50, y: 90 },
    CB1: { x: 25, y: 70 },
    CB2: { x: 50, y: 70 },
    CB3: { x: 75, y: 70 },
    LM: { x: 10, y: 45 },
    CM1: { x: 30, y: 45 },
    CDM: { x: 50, y: 50 },
    CM2: { x: 70, y: 45 },
    RM: { x: 90, y: 45 },
    ST1: { x: 35, y: 15 },
    ST2: { x: 65, y: 15 },
  },
  "4-2-3-1": {
    GK: { x: 50, y: 90 },
    LB: { x: 15, y: 70 },
    CB1: { x: 35, y: 70 },
    CB2: { x: 65, y: 70 },
    RB: { x: 85, y: 70 },
    CDM1: { x: 35, y: 55 },
    CDM2: { x: 65, y: 55 },
    LW: { x: 15, y: 30 },
    CAM: { x: 50, y: 30 },
    RW: { x: 85, y: 30 },
    ST: { x: 50, y: 15 },
  },
};

export type FormationType = keyof typeof formations;

export const FormationSelector = ({ value, onChange }: FormationSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select formation" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="4-4-2">4-4-2</SelectItem>
        <SelectItem value="4-3-3">4-3-3</SelectItem>
        <SelectItem value="3-5-2">3-5-2</SelectItem>
        <SelectItem value="4-2-3-1">4-2-3-1</SelectItem>
      </SelectContent>
    </Select>
  );
};
