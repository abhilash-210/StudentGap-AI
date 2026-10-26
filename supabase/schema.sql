-- GapFinder AI: Production PostgreSQL & Supabase Database Schema
-- Includes pgvector extension for grounded document chunk semantic search,
-- complete relational schema for courses, diagnostic attempts, gap reports, revision plans,
-- and Row Level Security (RLS) policies.

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles Table (extending Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_exam TEXT NOT NULL,
  units JSONB NOT NULL DEFAULT '[]'::jsonb,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Material Chunks & pgvector Embedding Table
CREATE TABLE IF NOT EXISTS public.material_chunks (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('syllabus', 'notes', 'textbook', 'past_paper')),
  section TEXT NOT NULL,
  page INTEGER,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_private BOOLEAN NOT NULL DEFAULT false,
  -- 768-dimensional vector matching text-embedding-004 or 1536-dim for text-embedding-3-small
  embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create HNSW or IVFFlat Index for high-performance approximate nearest neighbor (ANN) vector search
CREATE INDEX IF NOT EXISTS material_chunks_embedding_idx 
ON public.material_chunks 
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS material_chunks_course_id_idx 
ON public.material_chunks (course_id);

-- 5. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_questions INTEGER NOT NULL,
  score_percent INTEGER NOT NULL,
  topic_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  evaluated_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 6. Diagnostic Gap Reports Table
CREATE TABLE IF NOT EXISTS public.gap_reports (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  quiz_attempt_id TEXT REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  overall_score_percent INTEGER NOT NULL,
  overall_readiness TEXT NOT NULL,
  has_sufficient_evidence BOOLEAN NOT NULL DEFAULT true,
  total_questions_evaluated INTEGER NOT NULL,
  summary_message TEXT NOT NULL,
  weak_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  medium_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  strong_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  knowledge_dimensions JSONB NOT NULL DEFAULT '{}'::jsonb,
  high_risk_danger_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Revision Plans Table
CREATE TABLE IF NOT EXISTS public.revision_plans (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  gap_report_id TEXT REFERENCES public.gap_reports(id) ON DELETE CASCADE,
  timeframe_days INTEGER NOT NULL,
  daily_hours_available NUMERIC NOT NULL,
  total_estimated_minutes INTEGER NOT NULL,
  completed_minutes INTEGER NOT NULL DEFAULT 0,
  completion_percent INTEGER NOT NULL DEFAULT 0,
  schedules JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Course Enrollments Table (Student-Course mapping)
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 9. Stored Procedure for Cosine Distance Vector Match (RAG retrieval)
CREATE OR REPLACE FUNCTION public.match_chunks (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 5,
  p_course_id text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id text,
  course_id text,
  document_name text,
  document_type text,
  section text,
  page integer,
  chunk_index integer,
  content text,
  word_count integer,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id,
    mc.course_id,
    mc.document_name,
    mc.document_type,
    mc.section,
    mc.page,
    mc.chunk_index,
    mc.content,
    mc.word_count,
    1 - (mc.embedding <=> query_embedding) AS similarity
  FROM public.material_chunks mc
  WHERE (p_course_id IS NULL OR mc.course_id = p_course_id)
    AND (mc.is_private = false OR mc.owner_id = p_user_id OR mc.owner_id IS NULL)
    AND (mc.embedding IS NOT NULL)
    AND (1 - (mc.embedding <=> query_embedding) > match_threshold)
  ORDER BY mc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 10. Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gap_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access to courses (Idempotent policy creation)
DROP POLICY IF EXISTS "Public courses are readable" ON public.courses;
CREATE POLICY "Public courses are readable" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can manage own enrollments" ON public.course_enrollments FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Public or owned chunks are readable" ON public.material_chunks;
CREATE POLICY "Public or owned chunks are readable" ON public.material_chunks FOR SELECT USING (is_private = false OR auth.uid() = owner_id OR owner_id IS NULL);

DROP POLICY IF EXISTS "Users can manage own attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage own attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage own gap reports" ON public.gap_reports;
CREATE POLICY "Users can manage own gap reports" ON public.gap_reports FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage own revision plans" ON public.revision_plans;
CREATE POLICY "Users can manage own revision plans" ON public.revision_plans FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);


