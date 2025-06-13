
-- Create a storage bucket for package images
INSERT INTO storage.buckets (id, name, public)
VALUES ('package-images', 'package-images', true);

-- Create a policy to allow public read access to package images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'package-images');

-- Create a policy to allow anyone to upload package images (for admin use)
CREATE POLICY "Anyone can upload package images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'package-images');

-- Create a policy to allow anyone to update package images (for admin use)
CREATE POLICY "Anyone can update package images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'package-images');

-- Create a policy to allow anyone to delete package images (for admin use)
CREATE POLICY "Anyone can delete package images"
ON storage.objects FOR DELETE
USING (bucket_id = 'package-images');
