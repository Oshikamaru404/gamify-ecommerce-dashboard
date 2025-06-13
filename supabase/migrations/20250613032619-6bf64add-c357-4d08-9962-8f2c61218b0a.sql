
-- Create function to delete all published feedback
CREATE OR REPLACE FUNCTION public.delete_all_published_feedback()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.feedbacks 
  WHERE status = 'approved';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Create function to reset product sales
CREATE OR REPLACE FUNCTION public.reset_product_sales()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  reset_count INTEGER;
BEGIN
  -- Reset sales metrics to zero
  UPDATE public.dashboard_metrics 
  SET metric_value = 0 
  WHERE metric_name IN ('total_sales', 'monthly_sales', 'weekly_sales');
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$;
