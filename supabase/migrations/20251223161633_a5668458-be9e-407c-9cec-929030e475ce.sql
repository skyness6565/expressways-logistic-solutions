-- Add customs_hold field to shipments table
ALTER TABLE public.shipments
ADD COLUMN IF NOT EXISTS customs_hold boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS package_images text[];

-- Create storage bucket for package images
INSERT INTO storage.buckets (id, name, public)
VALUES ('package-images', 'package-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for package images
CREATE POLICY "Package images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'package-images');

CREATE POLICY "Anyone can upload package images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'package-images');

CREATE POLICY "Anyone can update package images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'package-images');

CREATE POLICY "Anyone can delete package images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'package-images');