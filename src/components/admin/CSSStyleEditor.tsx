
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StylePresets from './style-editor/StylePresets';
import StyleTabs from './style-editor/StyleTabs';
import StylePreview from './style-editor/StylePreview';
import StyleActions from './style-editor/StyleActions';

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

const shadowPresets = {
  none: { class: 'shadow-none', css: 'none' },
  sm: { class: 'shadow-sm', css: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  md: { class: 'shadow-md', css: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  lg: { class: 'shadow-lg', css: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
  xl: { class: 'shadow-xl', css: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
  '2xl': { class: 'shadow-2xl', css: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }
};

const CSSStyleEditor: React.FC = () => {
  const [styles, setStyles] = useState<StyleConfig>(defaultStyles);
  const [previewMode, setPreviewMode] = useState<'card' | 'box'>('card');
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  console.log('CSSStyleEditor rendered with styles:', styles);
  console.log('Preview mode:', previewMode, 'Is hovered:', isHovered);

  const updateStyle = (key: keyof StyleConfig, value: any) => {
    console.log('Updating style:', key, 'with value:', value);
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName: string) => {
    console.log('Applying preset:', presetName);
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
    console.log('Resetting styles to default');
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Style Editor Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            CSS Style Editor
          </CardTitle>
          <StylePresets
            selectedPreset={selectedPreset}
            onApplyPreset={applyPreset}
            onReset={resetStyles}
          />
        </CardHeader>
        <CardContent>
          <StyleTabs styles={styles} updateStyle={updateStyle} />
          
          <Separator className="my-6" />
          
          <StyleActions
            onCopyTailwind={() => copyToClipboard(generateTailwindClasses(), 'Tailwind')}
            onCopyCSS={() => copyToClipboard(generateCSS(), 'CSS')}
            onExport={exportStyles}
          />
        </CardContent>
      </Card>

      {/* Live Preview Panel */}
      <StylePreview
        styles={styles}
        previewMode={previewMode}
        isHovered={isHovered}
        onPreviewModeChange={setPreviewMode}
        onHoverChange={setIsHovered}
        generateCSS={generateCSS}
        generateTailwindClasses={generateTailwindClasses}
      />
    </div>
  );
};

export default CSSStyleEditor;
