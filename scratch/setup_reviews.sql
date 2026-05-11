-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id BIGINT REFERENCES public.shoes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Anyone can read reviews
CREATE POLICY "Anyone can read reviews" ON public.reviews
    FOR SELECT USING (true);

-- 2. Authenticated users can insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Users can only update/delete their own reviews
CREATE POLICY "Users can manage their own reviews" ON public.reviews
    FOR ALL USING (auth.uid() = user_id);
