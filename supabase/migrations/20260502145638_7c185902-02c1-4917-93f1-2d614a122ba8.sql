
CREATE OR REPLACE FUNCTION public.update_blog_cron_schedule(new_schedule text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, cron, extensions
AS $$
DECLARE
  jid bigint;
BEGIN
  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'auto-blog-generation' LIMIT 1;
  IF jid IS NULL THEN
    RAISE EXCEPTION 'auto-blog-generation cron job not found';
  END IF;
  PERFORM cron.alter_job(job_id := jid, schedule := new_schedule);
  UPDATE public.blog_automation_config SET cron_schedule = new_schedule, updated_at = now();
END;
$$;
