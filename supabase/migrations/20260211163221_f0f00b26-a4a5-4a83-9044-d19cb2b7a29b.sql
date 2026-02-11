
-- Banner config table (public, no auth needed - it's a site-wide setting)
CREATE TABLE public.banner_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  text TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  link_url TEXT NOT NULL DEFAULT '',
  link_text TEXT NOT NULL DEFAULT '',
  schedule_start TIME,
  schedule_end TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.banner_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read the banner (it's public content)
CREATE POLICY "Banner is publicly readable"
ON public.banner_config
FOR SELECT
USING (true);

-- Anyone can insert/update/delete (no auth in this app)
CREATE POLICY "Banner is publicly writable"
ON public.banner_config
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert default row
INSERT INTO public.banner_config (enabled, text, image, link_url, link_text)
VALUES (false, '', '', '', '');
