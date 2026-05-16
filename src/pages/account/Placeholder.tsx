import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface Props { title: string; description?: string; }

const Placeholder: React.FC<Props> = ({ title, description }) => (
  <div className="space-y-4">
    <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
    <Card className="p-10 text-center">
      <Sparkles className="h-10 w-10 mx-auto text-primary mb-3" />
      <p className="text-muted-foreground">{description || 'Coming soon — we are working on this feature.'}</p>
    </Card>
  </div>
);

export default Placeholder;
