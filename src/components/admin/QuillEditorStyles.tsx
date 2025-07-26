
import React, { useEffect } from 'react';

const QuillEditorStyles: React.FC = () => {
  useEffect(() => {
    // Create style element and inject CSS
    const style = document.createElement('style');
    style.textContent = `
      .ql-toolbar {
        border-top: 1px solid #ccc !important;
        border-left: 1px solid #ccc !important;
        border-right: 1px solid #ccc !important;
        background: #f8f9fa !important;
      }
      
      .ql-container {
        border-bottom: 1px solid #ccc !important;
        border-left: 1px solid #ccc !important;
        border-right: 1px solid #ccc !important;
        background: white !important;
      }
      
      .ql-toolbar .ql-picker-label {
        border: 1px solid transparent !important;
        padding: 2px 4px !important;
      }
      
      .ql-toolbar .ql-picker-label:hover {
        background: #e9ecef !important;
        border-color: #ccc !important;
      }
      
      .ql-toolbar button {
        border: 1px solid transparent !important;
        margin: 1px !important;
      }
      
      .ql-toolbar button:hover {
        background: #e9ecef !important;
        border-color: #ccc !important;
      }
      
      .ql-toolbar button.ql-active {
        background: #007bff !important;
        color: white !important;
        border-color: #0056b3 !important;
      }
      
      .ql-editor {
        min-height: 350px !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      
      .ql-picker-options {
        background: white !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        max-height: 200px !important;
        overflow-y: auto !important;
      }
      
      .ql-picker-item:hover {
        background: #f8f9fa !important;
      }
      
      .ql-color-picker .ql-picker-options {
        width: 200px !important;
        padding: 8px !important;
      }
      
      .ql-toolbar .ql-formats {
        margin-right: 8px !important;
      }
      
      .ql-toolbar .ql-formats:not(:last-child) {
        border-right: 1px solid #ddd !important;
        padding-right: 8px !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Cleanup function to remove the style when component unmounts
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
};

export default QuillEditorStyles;
