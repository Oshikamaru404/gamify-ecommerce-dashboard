CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Remove existing schedule if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-blog-generation') THEN
    PERFORM cron.unschedule('auto-blog-generation');
  END IF;
END $$;

SELECT cron.schedule(
  'auto-blog-generation',
  '0 9 * * 1,3,5',
  $$
  SELECT net.http_post(
    url := 'https://jtsnspszgsmkqxuoqywm.supabase.co/functions/v1/generate-blog-article',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0c25zcHN6Z3Nta3F4dW9xeXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTg0NzUsImV4cCI6MjA2NTIzNDQ3NX0.k4gAV17UWzVPCnHeXnqCfdJT12bTkK5ELKBuLvYIm_Q'
    ),
    body := jsonb_build_object('trigger', 'cron', 'time', now()::text)
  );
  $$
);
