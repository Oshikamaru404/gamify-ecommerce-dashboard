
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUrlChange: (url: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUrlChange,
  label = "Package Image"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading image:', fileName);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('package-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('package-images')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      setImageUrl(publicUrl);
      onImageUrlChange(publicUrl);
      toast.success('Image uploaded successfully');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    onImageUrlChange(url);
  };

  const clearImage = () => {
    setImageUrl('');
    onImageUrlChange('');
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Image Preview */}
      {imageUrl && (
        <div className="relative inline-block">
          <img 
            src={imageUrl} 
            alt="Package preview"
            className="w-24 h-24 rounded-lg object-cover border border-gray-200"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X size={12} />
          </Button>
        </div>
      )}

      {/* File Upload */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Image
              </>
            )}
          </Button>
        </div>
        <span className="text-sm text-gray-500">or</span>
      </div>

      {/* URL Input */}
      <div>
        <Input
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.png"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload an image or enter a direct image URL
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
