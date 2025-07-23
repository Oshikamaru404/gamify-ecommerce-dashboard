
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
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const shadowPresets = {
    none: { class: 'shadow-none', css: 'none' },
    sm: { class: 'shadow-sm', css: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    md: { class: 'shadow-md', css: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
    lg: { class: 'shadow-lg', css: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
    xl: { class: 'shadow-xl', css: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
    '2xl': { class: 'shadow-2xl', css: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }
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
      toast({
        title: 'Preset Applied',
        description: `${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset has been applied.`,
      });
    }
  };

  const resetStyles = () => {
    setStyles(defaultStyles);
    setSelectedPreset('default');
    toast({
      title: 'Styles Reset',
      description: 'All styles have been reset to default values.',
    });
  };

  const generateCSS = () => {
    const shadowCss = shadowPresets[styles.shadowSize as keyof typeof shadowPresets]?.css || 'none';
    const hoverShadowCss = shadowPresets[styles.hoverShadow as keyof typeof shadowPresets]?.css || shadowCss;
    
    const css = `
.custom-card {
  width: ${styles.width};
  height: ${styles.height};
  padding: ${styles.padding};
  margin: ${styles.margin};
  background-color: ${styles.backgroundColor}${Math.round(styles.backgroundOpacity * 2.55).toString(16).padStart(2, '0')};
  border-radius: ${styles.borderRadius};
  border: ${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor};
  box-shadow: ${shadowCss};
  color: ${styles.textColor};
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  transition: all ${styles.transition} ease-in-out;
  cursor: pointer;
}

.custom-card:hover {
  transform: scale(${styles.hoverScale / 100});
  box-shadow: ${hoverShadowCss};
}
    `.trim();
    
    return css;
  };

  const generateTailwindClasses = () => {
    const paddingClass = styles.padding === '0.5rem' ? 'p-2' : 
                        styles.padding === '1rem' ? 'p-4' : 
                        styles.padding === '1.5rem' ? 'p-6' : 'p-8';
    
    const radiusClass = styles.borderRadius === '0' ? 'rounded-none' :
                       styles.borderRadius === '0.25rem' ? 'rounded-sm' :
                       styles.borderRadius === '0.5rem' ? 'rounded-lg' :
                       styles.borderRadius === '0.75rem' ? 'rounded-xl' :
                       styles.borderRadius === '1rem' ? 'rounded-2xl' :
                       styles.borderRadius === '1.5rem' ? 'rounded-3xl' : 'rounded-xl';
    
    const shadowClass = shadowPresets[styles.shadowSize as keyof typeof shadowPresets]?.class || 'shadow-md';
    const hoverShadowClass = shadowPresets[styles.hoverShadow as keyof typeof shadowPresets]?.class || 'shadow-lg';
    
    const classes = [
      paddingClass,
      radiusClass,
      shadowClass,
      'bg-white',
      'border',
      'border-gray-200',
      'transition-all',
      'duration-200',
      'cursor-pointer',
      `hover:scale-${styles.hoverScale === 105 ? '105' : '102'}`,
      `hover:${hoverShadowClass}`
    ].filter(Boolean);
    
    return classes.join(' ');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: `${type} code has been copied to your clipboard.`,
      });
    }).catch(() => {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard. Please try again.',
        variant: 'destructive'
      });
    });
  };

  const exportStyles = () => {
    const data = {
      css: generateCSS(),
      tailwind: generateTailwindClasses(),
      config: styles,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `card-styles-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Styles Exported',
      description: 'Style configuration has been downloaded as JSON.',
    });
  };

  const getPreviewStyles = () => {
    const shadowCss = shadowPresets[styles.shadowSize as keyof typeof shadowPresets]?.css || 'none';
    const hoverShadowCss = shadowPresets[styles.hoverShadow as keyof typeof shadowPresets]?.css || shadowCss;
    
    return {
      width: styles.width,
      height: styles.height === 'auto' ? (previewMode === 'box' ? '120px' : 'auto') : styles.height,
      padding: styles.padding,
      margin: styles.margin,
      backgroundColor: `${styles.backgroundColor}${Math.round(styles.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`,
      borderRadius: styles.borderRadius,
      border: styles.borderWidth === '0px' ? 'none' : `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`,
      boxShadow: isHovered ? hoverShadowCss : shadowCss,
      color: styles.textColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      transform: isHovered ? `scale(${styles.hoverScale / 100})` : 'scale(1)',
      transition: `all ${styles.transition} ease-in-out`,
      cursor: 'pointer'
    };
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
              <Button onClick={() => copyToClipboard(generateTailwindClasses(), 'Tailwind')} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Tailwind
              </Button>
              <Button onClick={() => copyToClipboard(generateCSS(), 'CSS')} variant="outline" className="flex-1">
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
                style={getPreviewStyles()}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
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
                style={getPreviewStyles()}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center justify-center"
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
