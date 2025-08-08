
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUpload?: (imageUrl: string) => void;
  onCancel?: () => void;
  currentImageUrl?: string;
  onImageUrlChange?: (url: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  onCancel, 
  currentImageUrl,
  onImageUrlChange,
  label = "Upload image" 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('package-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('package-images')
        .getPublicUrl(filePath);

      // Use the appropriate callback
      if (onImageUrlChange) {
        onImageUrlChange(data.publicUrl);
      } else if (onImageUpload) {
        onImageUpload(data.publicUrl);
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadImage(files[0]);
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Show current image if available */}
      {currentImageUrl && (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <img 
            src={currentImageUrl} 
            alt="Current" 
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Current image</p>
            <p className="text-xs text-gray-500">{currentImageUrl}</p>
          </div>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Image className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              {uploading ? 'Uploading...' : label || 'Upload image or drag and drop'}
            </span>
            <span className="mt-1 block text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </span>
          </Label>
          <Input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>
        <div className="mt-4">
          <Button type="button" disabled={uploading} asChild>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Choose file'}
            </Label>
          </Button>
        </div>
      </div>

      {onCancel && (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
