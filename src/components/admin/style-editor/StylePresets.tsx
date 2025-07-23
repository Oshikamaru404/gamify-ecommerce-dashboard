
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface StyleConfig {
  width: string;
  height: string;
  padding: string;
  margin: string;
  backgroundColor: string;
  backgroundOpacity: number;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  borderStyle: string;
  shadowSize: string;
  shadowColor: string;
  shadowOpacity: number;
  textColor: string;
  fontSize: string;
  fontWeight: string;
  hoverScale: number;
  hoverShadow: string;
  transition: string;
}

interface StylePresetsProps {
  selectedPreset: string;
  onApplyPreset: (presetName: string) => void;
  onReset: () => void;
}

const StylePresets: React.FC<StylePresetsProps> = ({
  selectedPreset,
  onApplyPreset,
  onReset
}) => {
  return (
    <div className="flex gap-2">
      <Select value={selectedPreset} onValueChange={onApplyPreset}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Choose preset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="minimal">Minimal</SelectItem>
          <SelectItem value="modern">Modern</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StylePresets;
