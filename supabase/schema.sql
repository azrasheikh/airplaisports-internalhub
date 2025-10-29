-- Airplai Sports Hub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create pages table
CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  parent_id TEXT REFERENCES public.pages(id) ON DELETE CASCADE,
  icon TEXT DEFAULT 'FileText',
  components JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  page_id TEXT REFERENCES public.pages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create version_history table
CREATE TABLE IF NOT EXISTS public.version_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id TEXT REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  components JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create navigation_items table
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT DEFAULT 'FileText',
  page_id TEXT REFERENCES public.pages(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON public.pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_created_by ON public.pages(created_by);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_version_history_page_id ON public.version_history(page_id);
CREATE INDEX IF NOT EXISTS idx_version_history_created_at ON public.version_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.version_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Pages policies (everyone can read, only editors and admins can write)
CREATE POLICY "Pages are viewable by authenticated users"
  ON public.pages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors and admins can insert pages"
  ON public.pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can update pages"
  ON public.pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Only admins can delete pages"
  ON public.pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Activity logs policies
CREATE POLICY "Activity logs are viewable by authenticated users"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Version history policies
CREATE POLICY "Version history is viewable by authenticated users"
  ON public.version_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors and admins can insert version history"
  ON public.version_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Navigation items policies
CREATE POLICY "Navigation items are viewable by authenticated users"
  ON public.navigation_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors and admins can manage navigation items"
  ON public.navigation_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email),
    'viewer'  -- Default role, change first user to 'admin' manually
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_pages
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default pages
INSERT INTO public.pages (id, title, parent_id, icon, components) VALUES
  ('home', 'Welcome to Airplai Sports Hub', NULL, 'Home',
   '[{"id": 1, "type": "heading", "content": "Welcome to the Team", "level": 1},
     {"id": 2, "type": "text", "content": "This is your central hub for all company documentation, resources, and information."}]'::jsonb),
  ('getting-started', 'Getting Started', NULL, 'BookOpen',
   '[{"id": 1, "type": "heading", "content": "Getting Started Guide", "level": 1},
     {"id": 2, "type": "text", "content": "Welcome to Airplai Sports! Here you will find everything you need to get started."}]'::jsonb),
  ('documentation', 'Documentation', NULL, 'FileText',
   '[{"id": 1, "type": "heading", "content": "Technical Documentation", "level": 1},
     {"id": 2, "type": "text", "content": "Find all technical documentation and resources here."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert default navigation items
INSERT INTO public.navigation_items (id, label, icon, page_id, position) VALUES
  ('home', 'Home', 'Home', 'home', 1),
  ('getting-started', 'Getting Started', 'BookOpen', 'getting-started', 2),
  ('documentation', 'Documentation', 'FileText', 'documentation', 3)
ON CONFLICT (id) DO NOTHING;
