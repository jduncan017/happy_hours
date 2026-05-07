-- Admins need to read every pending submission and update them on
-- approve/reject. Without these policies, the admin pending-review screen
-- only shows submissions the admin themselves submitted.

CREATE POLICY "Admins can view all submissions"
  ON public.restaurant_submissions
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any submission"
  ON public.restaurant_submissions
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete submissions"
  ON public.restaurant_submissions
  FOR DELETE
  USING (public.is_admin(auth.uid()));
