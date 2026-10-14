-- SQL Schema implementation for Supabase Database in ConectaCerca

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  bio TEXT DEFAULT '',
  city TEXT DEFAULT '',
  area TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  max_distance_km INTEGER DEFAULT 10,
  latitude_approx NUMERIC(9,6),
  longitude_approx NUMERIC(9,6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INTERESTS TABLE
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL
);

-- 3. USER_INTERESTS TABLE
CREATE TABLE IF NOT EXISTS public.user_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  UNIQUE(user_id, interest_id)
);

-- 4. CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_distinct_users CHECK (sender_id <> receiver_id)
);

-- 5. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- 6. BLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_distinct_blocks CHECK (blocker_id <> blocked_id)
);

-- 7. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Anyone authenticated can read profiles, but only owner can insert/update/delete
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Interests: Read for all, insert by admin or authenticated
CREATE POLICY "Interests read policy" ON public.interests FOR SELECT USING (true);

-- User Interests: Read all, manage own
CREATE POLICY "User interests select" ON public.user_interests FOR SELECT USING (true);
CREATE POLICY "User interests manage" ON public.user_interests FOR ALL USING (auth.uid() = user_id);

-- Connections: Select if user is sender or receiver
CREATE POLICY "Connections select" ON public.connections FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Connections insert" ON public.connections FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Connections update" ON public.connections FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Messages: Select and insert only if user belongs to the connection
CREATE POLICY "Messages select" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.connections c 
    WHERE c.id = connection_id 
    AND (c.sender_id = auth.uid() OR c.receiver_id = auth.uid())
    AND c.status = 'accepted'
  )
);
CREATE POLICY "Messages insert" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.connections c 
    WHERE c.id = connection_id 
    AND (c.sender_id = auth.uid() OR c.receiver_id = auth.uid())
    AND c.status = 'accepted'
  )
);

-- Blocks: Manage own blocks
CREATE POLICY "Blocks select" ON public.blocks FOR SELECT USING (auth.uid() = blocker_id);
CREATE POLICY "Blocks insert" ON public.blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Blocks delete" ON public.blocks FOR DELETE USING (auth.uid() = blocker_id);

-- Reports: Insert own report
CREATE POLICY "Reports insert" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Insert Default Interests
INSERT INTO public.interests (name, category) VALUES
  ('Leer libros', 'Cultura & Lectura'),
  ('Tomar café', 'Social & Gastronomía'),
  ('Ver películas', 'Entretenimiento'),
  ('Escuchar música', 'Arte & Música'),
  ('Cocinar', 'Social & Gastronomía'),
  ('Hacer deporte', 'Salud & Bienestar'),
  ('Caminar', 'Aire libre'),
  ('Viajar', 'Aventura'),
  ('Fotografía', 'Arte & Música'),
  ('Videojuegos', 'Entretenimiento'),
  ('Arte', 'Cultura & Lectura'),
  ('Aprender idiomas', 'Educación')
ON CONFLICT (name) DO NOTHING;
