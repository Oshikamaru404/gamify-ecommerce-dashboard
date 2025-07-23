
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';

interface StyleActionsProps {
  onCopyTailwind: () => void;
  onCopyCSS: () => void;
  onExport: () => void;
}

const StyleActions: React.FC<StyleActionsProps> = ({
  onCopyTailwind,
  onCopyCSS,
  onExport
}) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button onClick={onCopyTailwind} className="flex-1">
          <Copy className="h-4 w-4 mr-2" />
          Copy Tailwind
        </Button>
        <Button onClick={onCopyCSS} variant="outline" className="flex-1">
          <Copy className="h-4 w-4 mr-2" />
          Copy CSS
        </Button>
      </div>
      <Button onClick={onExport} variant="outline" className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Export Styles
      </Button>
    </div>
  );
};

export default StyleActions;
