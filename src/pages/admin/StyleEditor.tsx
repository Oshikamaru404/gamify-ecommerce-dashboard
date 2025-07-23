
import React from 'react';
import CSSStyleEditor from '@/components/admin/CSSStyleEditor';

const StyleEditor = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CSS Style Editor</h1>
        <p className="text-muted-foreground">
          Create and customize styles for cards and boxes across your application.
        </p>
      </div>
      
      <CSSStyleEditor />
    </div>
  );
};

export default StyleEditor;
