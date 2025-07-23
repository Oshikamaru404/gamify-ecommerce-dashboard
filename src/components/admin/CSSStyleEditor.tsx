
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Square, 
  RotateCcw, 
  Save, 
  Eye,
  Copy,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StyleConfig {
  // Layout
  width: string;
  height: string;
  padding: string;
  margin: string;
  
  // Background
  backgroundColor: string;
  backgroundOpacity: number;
  
  // Border
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  borderStyle: string;
  
  // Shadow
  shadowSize: string;
  shadowColor: string;
  shadowOpacity: number;
  
  // Text
  textColor: string;
  fontSize: string;
  fontWeight: string;
  
  // Hover effects
  hoverScale: number;
  hoverShadow: string;
  transition: string;
}

const defaultStyles: StyleConfig = {
  width: 'auto',
  height: 'auto',
  padding: '1.5rem',
  margin: '0',
  backgroundColor: '#ffffff',
  backgroundOpacity: 100,
  borderRadius: '0.75rem',
  borderWidth: '1px',
  borderColor: '#e5e7eb',
  borderStyle: 'solid',
  shadowSize: 'md',
  shadowColor: '#000000',
  shadowOpacity: 10,
  textColor: '#111827',
  fontSize: '1rem',
  fontWeight: '400',
  hoverScale: 105,
  hoverShadow: 'lg',
  transition: '0.2s'
};

const CSSStyleEditor: React.FC = () => {
  const [styles, setStyles] = useState<StyleConfig>(defaultStyles);
  const [previewMode, setPreviewMode] = useState<'card' | 'box'>('card');
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const { toast } = useToast();

  const shadowPresets = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const presets = {
    default: defaultStyles,
    minimal: {
      ...defaultStyles,
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      shadowSize: 'sm',
      padding: '1rem'
    },
    modern: {
      ...defaultStyles,
      backgroundColor: '#f8fafc',
      borderRadius: '1rem',
      shadowSize: 'lg',
      borderWidth: '0px',
      hoverScale: 102
    },
    dark: {
      ...defaultStyles,
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      borderColor: '#374151',
      shadowSize: 'xl'
    }
  };

  const updateStyle = (key: keyof StyleConfig, value: any) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName: string) => {
    if (presets[presetName as keyof typeof presets]) {
      setStyles(presets[presetName as keyof typeof presets]);
      setSelectedPreset(presetName);
    }
  };

  const resetStyles = () => {
    setStyles(defaultStyles);
    setSelectedPreset('default');
  };

  const generateCSS = () => {
    const css = `
.custom-card {
  width: ${styles.width};
  height: ${styles.height};
  padding: ${styles.padding};
  margin: ${styles.margin};
  background-color: ${styles.backgroundColor}${Math.round(styles.backgroundOpacity * 2.55).toString(16).padStart(2, '0')};
  border-radius: ${styles.borderRadius};
  border: ${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor};
  box-shadow: var(--tw-${styles.shadowSize});
  color: ${styles.textColor};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  transition: all ${styles.transition} ease-in-out;
}

.custom-card:hover {
  transform: scale(${styles.hoverScale / 100});
  box-shadow: var(--tw-${styles.hoverShadow});
}
    `.trim();
    
    return css;
  };

  const generateTailwindClasses = () => {
    const classes = [
      styles.padding === '1rem' ? 'p-4' : styles.padding === '1.5rem' ? 'p-6' : 'p-8',
      styles.borderRadius === '0.5rem' ? 'rounded-lg' : styles.borderRadius === '0.75rem' ? 'rounded-xl' : 'rounded-2xl',
      shadowPresets[styles.shadowSize as keyof typeof shadowPresets] || 'shadow-md',
      'bg-white',
      'border',
      'border-gray-200',
      'transition-all',
      'duration-200',
      `hover:scale-${styles.hoverScale}`,
      `hover:${shadowPresets[styles.hoverShadow as keyof typeof shadowPresets] || 'shadow-lg'}`
    ];
    
    return classes.join(' ');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Style code has been copied to your clipboard.',
    });
  };

  const exportStyles = () => {
    const data = {
      css: generateCSS(),
      tailwind: generateTailwindClasses(),
      config: styles
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'card-styles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Style Editor Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            CSS Style Editor
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedPreset} onValueChange={applyPreset}>
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
            <Button variant="outline" size="sm" onClick={resetStyles}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          <Separator className="my-6" />

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(generateTailwindClasses())} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Tailwind
              </Button>
              <Button onClick={() => copyToClipboard(generateCSS())} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy CSS
              </Button>
            </div>
            <Button onClick={exportStyles} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Styles
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={previewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('card')}
            >
              Card Preview
            </Button>
            <Button
              variant={previewMode === 'box' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('box')}
            >
              Box Preview
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg min-h-64">
            {previewMode === 'card' ? (
              <div
                className="transition-all duration-200 cursor-pointer"
                style={{
                  width: styles.width,
                  height: styles.height,
                  padding: styles.padding,
                  margin: styles.margin,
                  backgroundColor: `${styles.backgroundColor}${Math.round(styles.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  borderRadius: styles.borderRadius,
                  border: `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`,
                  boxShadow: `var(--tw-shadow-${styles.shadowSize})`,
                  color: styles.textColor,
                  fontSize: styles.fontSize,
                  fontWeight: styles.fontWeight,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `scale(${styles.hoverScale / 100})`;
                  e.currentTarget.style.boxShadow = `var(--tw-shadow-${styles.hoverShadow})`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `var(--tw-shadow-${styles.shadowSize})`;
                }}
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Sample Card</h3>
                  <p className="text-sm opacity-70">
                    This is a preview of how your styled card will look. Hover to see the effects.
                  </p>
                  <div className="flex gap-2">
                    <Badge>Feature 1</Badge>
                    <Badge variant="outline">Feature 2</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="transition-all duration-200 cursor-pointer flex items-center justify-center"
                style={{
                  width: styles.width,
                  height: styles.height || '120px',
                  padding: styles.padding,
                  margin: styles.margin,
                  backgroundColor: `${styles.backgroundColor}${Math.round(styles.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  borderRadius: styles.borderRadius,
                  border: `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`,
                  boxShadow: `var(--tw-shadow-${styles.shadowSize})`,
                  color: styles.textColor,
                  fontSize: styles.fontSize,
                  fontWeight: styles.fontWeight,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `scale(${styles.hoverScale / 100})`;
                  e.currentTarget.style.boxShadow = `var(--tw-shadow-${styles.hoverShadow})`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `var(--tw-shadow-${styles.shadowSize})`;
                }}
              >
                <div className="text-center">
                  <Square className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Sample Box</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <Label>Generated Tailwind Classes:</Label>
              <div className="bg-gray-100 p-3 rounded-md text-sm font-mono">
                {generateTailwindClasses()}
              </div>
            </div>
            
            <div>
              <Label>Generated CSS:</Label>
              <div className="bg-gray-100 p-3 rounded-md text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {generateCSS()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSSStyleEditor;
