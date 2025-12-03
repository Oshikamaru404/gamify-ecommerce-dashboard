-- Enable RLS on feedbacks (should already be enabled)
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view approved feedbacks (public reviews)
CREATE POLICY "Anyone can view approved feedbacks"
ON public.feedbacks
FOR SELECT
USING (status = 'approved');

-- Allow anyone to submit feedback (will be pending by default)
CREATE POLICY "Anyone can submit feedback"
ON public.feedbacks
FOR INSERT
WITH CHECK (status = 'pending');

-- Admin users can manage all feedbacks
CREATE POLICY "Admin users can manage all feedbacks"
ON public.feedbacks
FOR ALL
USING (EXISTS (
  SELECT 1 FROM admin_users
  WHERE admin_users.user_id = auth.uid()
));