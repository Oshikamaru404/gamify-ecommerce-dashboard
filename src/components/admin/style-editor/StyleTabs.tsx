
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

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

interface StyleTabsProps {
  styles: StyleConfig;
  updateStyle: (key: keyof StyleConfig, value: any) => void;
}

const StyleTabs: React.FC<StyleTabsProps> = ({ styles, updateStyle }) => {
  return (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="background">Background</TabsTrigger>
        <TabsTrigger value="border">Border</TabsTrigger>
        <TabsTrigger value="effects">Effects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="layout" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Padding</Label>
            <Select value={styles.padding} onValueChange={(value) => updateStyle('padding', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5rem">Small (0.5rem)</SelectItem>
                <SelectItem value="1rem">Medium (1rem)</SelectItem>
                <SelectItem value="1.5rem">Large (1.5rem)</SelectItem>
                <SelectItem value="2rem">XLarge (2rem)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Margin</Label>
            <Select value={styles.margin} onValueChange={(value) => updateStyle('margin', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="0.5rem">Small</SelectItem>
                <SelectItem value="1rem">Medium</SelectItem>
                <SelectItem value="1.5rem">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="background" className="space-y-4">
        <div>
          <Label>Background Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={styles.backgroundColor}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="w-16 h-10"
            />
            <Input
              value={styles.backgroundColor}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label>Opacity: {styles.backgroundOpacity}%</Label>
          <Slider
            value={[styles.backgroundOpacity]}
            onValueChange={([value]) => updateStyle('backgroundOpacity', value)}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="border" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Border Radius</Label>
            <Select value={styles.borderRadius} onValueChange={(value) => updateStyle('borderRadius', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                <SelectItem value="0.25rem">Small</SelectItem>
                <SelectItem value="0.5rem">Medium</SelectItem>
                <SelectItem value="0.75rem">Large</SelectItem>
                <SelectItem value="1rem">XLarge</SelectItem>
                <SelectItem value="1.5rem">2XLarge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Border Width</Label>
            <Select value={styles.borderWidth} onValueChange={(value) => updateStyle('borderWidth', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0px">None</SelectItem>
                <SelectItem value="1px">Thin</SelectItem>
                <SelectItem value="2px">Medium</SelectItem>
                <SelectItem value="4px">Thick</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Border Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="color"
              value={styles.borderColor}
              onChange={(e) => updateStyle('borderColor', e.target.value)}
              className="w-16 h-10"
            />
            <Input
              value={styles.borderColor}
              onChange={(e) => updateStyle('borderColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="effects" className="space-y-4">
        <div>
          <Label>Shadow Size</Label>
          <Select value={styles.shadowSize} onValueChange={(value) => updateStyle('shadowSize', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">XLarge</SelectItem>
              <SelectItem value="2xl">2XLarge</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Hover Scale: {styles.hoverScale}%</Label>
          <Slider
            value={[styles.hoverScale]}
            onValueChange={([value]) => updateStyle('hoverScale', value)}
            min={100}
            max={110}
            step={1}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Hover Shadow</Label>
          <Select value={styles.hoverShadow} onValueChange={(value) => updateStyle('hoverShadow', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">XLarge</SelectItem>
              <SelectItem value="2xl">2XLarge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default StyleTabs;
