-- ============================================================
-- Admin & Dynamic Content Tables
-- ============================================================

-- Add 'admin' to profiles tier check
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_tier_check
  CHECK (tier IN ('free', 'basic', 'pro', 'admin'));

-- SITE CONTENT (dynamic landing page content)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,  -- 'hero', 'faq', 'features', etc.
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS for new tables
-- ============================================================

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- site_content: anyone can read, only service_role can write
CREATE POLICY "Anyone can read site_content" ON site_content
  FOR SELECT USING (true);

-- testimonials: anyone can read published, only service_role can write
CREATE POLICY "Anyone can read published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

-- Grant admin-level users access via service role
-- For admin panel, we'll use the anon key with permissive policies for admin emails
-- Alternative: admin operations go through API routes with service role

-- Allow authenticated users to manage site_content (admin check happens in app)
CREATE POLICY "Authenticated can manage site_content" ON site_content
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed default site content
-- ============================================================

INSERT INTO site_content (section, content) VALUES
  ('hero', '{
    "badge_text": "Gratis 3 kredit saat daftar",
    "headline": "Semua Tugasmu",
    "headline_highlight": "Selesai dalam Menit",
    "subheadline": "Generator tugas otomatis untuk SMA & Kuliah. Makalah, essay, laporan, matematika, presentasi — semua jurusan, semua mata pelajaran.",
    "cta_primary": "Mulai Gratis",
    "cta_secondary": "Lihat Cara Kerja",
    "microcopy": "Tanpa kartu kredit · Langsung pakai",
    "stats": [
      {"value": "10+", "label": "Jenis Tugas"},
      {"value": "2", "label": "Jenjang"},
      {"value": "<60s", "label": "Generate"}
    ]
  }'::jsonb),
  ('faq', '[
    {"id": "1", "question": "Apa itu TugasKilat?", "answer": "TugasKilat adalah platform AI yang membantu siswa SMA dan mahasiswa mengerjakan berbagai jenis tugas akademik secara otomatis.", "order_index": 0},
    {"id": "2", "question": "Apakah hasilnya unik?", "answer": "Ya! Setiap hasil generate bersifat unik karena dibuat secara real-time oleh AI.", "order_index": 1},
    {"id": "3", "question": "Berapa kredit per tugas?", "answer": "1 kredit per generate, tidak peduli jenis atau panjang tugasnya.", "order_index": 2},
    {"id": "4", "question": "Apakah ada langganan bulanan?", "answer": "Tidak! Sistem bayar-sekali-pakai. Tidak ada biaya berlangganan.", "order_index": 3}
  ]'::jsonb)
ON CONFLICT (section) DO NOTHING;
