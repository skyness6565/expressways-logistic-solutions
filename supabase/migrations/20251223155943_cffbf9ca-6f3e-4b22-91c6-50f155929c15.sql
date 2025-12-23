-- Add additional fields to shipments table for package details
ALTER TABLE public.shipments 
ADD COLUMN IF NOT EXISTS sender_address text,
ADD COLUMN IF NOT EXISTS sender_country text,
ADD COLUMN IF NOT EXISTS recipient_address text,
ADD COLUMN IF NOT EXISTS recipient_country text,
ADD COLUMN IF NOT EXISTS package_value numeric,
ADD COLUMN IF NOT EXISTS package_description text,
ADD COLUMN IF NOT EXISTS shipping_fee numeric,
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS delivery_days integer;

-- Create index for faster tracking lookups
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);

-- Add INSERT policy for admin operations (using service role or no RLS check)
CREATE POLICY "Allow insert for admin operations"
ON public.shipments
FOR INSERT
WITH CHECK (true);

-- Add UPDATE policy for admin operations
CREATE POLICY "Allow update for admin operations"
ON public.shipments
FOR UPDATE
USING (true);

-- Add DELETE policy for admin operations
CREATE POLICY "Allow delete for admin operations"
ON public.shipments
FOR DELETE
USING (true);

-- Add INSERT policy for shipment_events
CREATE POLICY "Allow insert shipment events"
ON public.shipment_events
FOR INSERT
WITH CHECK (true);

-- Add UPDATE policy for shipment_events
CREATE POLICY "Allow update shipment events"
ON public.shipment_events
FOR UPDATE
USING (true);

-- Add DELETE policy for shipment_events
CREATE POLICY "Allow delete shipment events"
ON public.shipment_events
FOR DELETE
USING (true);