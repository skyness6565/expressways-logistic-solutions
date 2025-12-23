-- Create shipments table for tracking
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'processing',
  origin_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  current_location TEXT,
  estimated_delivery DATE,
  weight_kg NUMERIC,
  service_type TEXT NOT NULL DEFAULT 'standard',
  sender_name TEXT,
  sender_email TEXT,
  recipient_name TEXT,
  recipient_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipment_events table for tracking history
CREATE TABLE public.shipment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  origin TEXT,
  destination TEXT,
  weight_kg NUMERIC,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to shipments (by tracking number)
CREATE POLICY "Anyone can view shipments by tracking number"
ON public.shipments
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view shipment events"
ON public.shipment_events
FOR SELECT
USING (true);

-- Create policy for quote submission (anyone can submit)
CREATE POLICY "Anyone can submit quote requests"
ON public.quote_requests
FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster tracking number lookups
CREATE INDEX idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX idx_shipment_events_shipment_id ON public.shipment_events(shipment_id);