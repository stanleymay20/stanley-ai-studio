-- Add policy to allow uploads to the portfolio-assets bucket
-- Since admin uses secret-based auth (not Supabase auth), we need to allow uploads for the uploads folder

CREATE POLICY "Allow public uploads to portfolio-assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow public updates to portfolio-assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'portfolio-assets')
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Allow public deletes from portfolio-assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-assets');