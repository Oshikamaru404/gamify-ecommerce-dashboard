
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Eye, Square } from 'lucide-react';

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

interface StylePreviewProps {
  styles: StyleConfig;
  previewMode: 'card' | 'box';
  isHovered: boolean;
  onPreviewModeChange: (mode: 'card' | 'box') => void;
  onHoverChange: (hovered: boolean) => void;
  generateCSS: () => string;
  generateTailwindClasses: () => string;
}

const shadowPresets = {
  none: { class: 'shadow-none', css: 'none' },
  sm: { class: 'shadow-sm', css: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  md: { class: 'shadow-md', css: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  lg: { class: 'shadow-lg', css: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
  xl: { class: 'shadow-xl', css: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
  '2xl': { class: 'shadow-2xl', css: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }
};

const StylePreview: React.FC<StylePreviewProps> = ({
  styles,
  previewMode,
  isHovered,
  onPreviewModeChange,
  onHoverChange,
  generateCSS,
  generateTailwindClasses
}) => {
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
            onClick={() => onPreviewModeChange('card')}
          >
            Card Preview
          </Button>
          <Button
            variant={previewMode === 'box' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPreviewModeChange('box')}
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
              onMouseEnter={() => onHoverChange(true)}
              onMouseLeave={() => onHoverChange(false)}
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
              onMouseEnter={() => onHoverChange(true)}
              onMouseLeave={() => onHoverChange(false)}
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
            <div className="bg-gray-100 p-3 rounded-md text-sm font-mono break-all">
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
  );
};

export default StylePreview;
