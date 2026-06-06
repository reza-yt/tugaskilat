-- ============================================================
-- Fix handle_new_user trigger to handle Google OAuth properly
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credits)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    3  -- 3 free credits on signup
  );

  -- Record welcome bonus transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 3, 'bonus', 'Kredit selamat datang');

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists (edge case), just return
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log but don't block signup
    RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Blog / Articles System
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'TugasKilat Team',
  category TEXT DEFAULT 'tips',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookup
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Authenticated users can manage (admin check in app)
CREATE POLICY "Authenticated can manage blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- LLM Usage / Cost Tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS llm_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  cost_usd NUMERIC(10, 6) DEFAULT 0,
  duration_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_llm_usage_created ON llm_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_llm_usage_user ON llm_usage(user_id);

ALTER TABLE llm_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read llm_usage" ON llm_usage
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert llm_usage" ON llm_usage
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Rate Limiting Table
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,  -- user_id or IP
  action TEXT NOT NULL,      -- 'generate', 'login', etc.
  count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
  ON rate_limits(identifier, action, window_start);

-- Auto-cleanup old rate limit records (run via cron)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < now() - interval '1 hour';
END;
$$;

-- ============================================================
-- Seed blog posts for SEO
-- ============================================================

INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, is_published, published_at, meta_title, meta_description) VALUES
(
  'cara-membuat-makalah-yang-baik-dan-benar',
  'Cara Membuat Makalah yang Baik dan Benar: Panduan Lengkap 2025',
  'Pelajari struktur makalah yang benar, tips penulisan, dan cara mendapatkan nilai A untuk tugas makalah SMA dan kuliah.',
  '# Cara Membuat Makalah yang Baik dan Benar

## Pendahuluan

Makalah adalah salah satu tugas akademik yang paling sering diberikan kepada siswa SMA maupun mahasiswa. Menulis makalah yang baik membutuhkan pemahaman tentang struktur, gaya penulisan, dan metodologi penelitian yang tepat.

## Struktur Makalah yang Benar

### 1. Halaman Judul
Halaman judul berisi informasi dasar tentang makalah:
- Judul makalah
- Nama penulis
- Institusi/sekolah
- Tahun pembuatan

### 2. Kata Pengantar
Berisi ucapan terima kasih dan pengantar singkat tentang makalah.

### 3. Daftar Isi
Memuat semua bagian makalah beserta nomor halamannya.

### 4. BAB I - Pendahuluan
- **Latar Belakang**: Jelaskan mengapa topik ini penting
- **Rumusan Masalah**: Pertanyaan yang akan dijawab
- **Tujuan**: Apa yang ingin dicapai

### 5. BAB II - Pembahasan
Bagian utama yang berisi analisis dan pembahasan mendalam tentang topik.

### 6. BAB III - Penutup
- **Kesimpulan**: Rangkuman temuan
- **Saran**: Rekomendasi untuk pembaca

### 7. Daftar Pustaka
Referensi yang digunakan dalam format yang konsisten (APA, MLA, dll).

## Tips Menulis Makalah yang Baik

1. **Pilih topik yang menarik** - Topik yang kamu sukai akan lebih mudah diteliti
2. **Riset mendalam** - Gunakan minimal 5 sumber referensi
3. **Gunakan bahasa formal** - Sesuai PUEBI (Pedoman Umum Ejaan Bahasa Indonesia)
4. **Hindari plagiarisme** - Selalu cantumkan sumber kutipan
5. **Review dan edit** - Baca ulang minimal 2 kali sebelum submit

## Kesimpulan

Membuat makalah yang baik membutuhkan perencanaan dan dedikasi. Dengan mengikuti struktur yang benar dan tips di atas, kamu bisa menghasilkan makalah berkualitas tinggi.

---

*Butuh bantuan membuat makalah? [TugasKilat](https://tugaskilat.web.id) bisa membantu generate makalah lengkap dalam hitungan menit!*',
  'tips',
  ARRAY['makalah', 'tugas', 'akademik', 'sma', 'kuliah'],
  true,
  now(),
  'Cara Membuat Makalah yang Baik dan Benar [Panduan 2025]',
  'Panduan lengkap cara membuat makalah yang baik dan benar untuk SMA dan kuliah. Pelajari struktur, tips penulisan, dan contoh makalah.'
),
(
  'tips-menulis-essay-argumentatif',
  'Tips Menulis Essay Argumentatif yang Meyakinkan',
  'Kuasai teknik menulis essay argumentatif yang kuat dengan contoh dan panduan langkah demi langkah.',
  '# Tips Menulis Essay Argumentatif yang Meyakinkan

## Apa itu Essay Argumentatif?

Essay argumentatif adalah jenis tulisan akademik yang bertujuan meyakinkan pembaca tentang suatu sudut pandang tertentu melalui argumen yang logis dan didukung bukti.

## Struktur Essay Argumentatif

### Paragraf Pembuka (Introduction)
- Hook: kalimat pembuka yang menarik perhatian
- Background: konteks tentang topik
- Thesis statement: pernyataan posisi yang jelas

### Body Paragraphs (3-5 paragraf)
Setiap paragraf berisi:
- Topic sentence
- Evidence (data, fakta, kutipan)
- Analysis (penjelasan hubungan bukti dengan argumen)
- Transition ke paragraf berikutnya

### Counter-argument
Akui argumen lawan dan jelaskan mengapa posisimu lebih kuat.

### Kesimpulan
- Restate thesis dengan kata berbeda
- Rangkum poin utama
- Call to action atau pemikiran akhir

## 7 Tips Menulis Essay yang Kuat

1. **Tentukan posisi yang jelas** sejak awal
2. **Riset dari berbagai sumber** untuk memperkuat argumen
3. **Gunakan data dan statistik** sebagai bukti
4. **Hindari logical fallacies** (ad hominem, straw man, dll)
5. **Variasikan struktur kalimat** agar tidak monoton
6. **Gunakan transitional phrases** antar paragraf
7. **Proofread** minimal 2 kali

## Contoh Thesis Statement yang Kuat

❌ Lemah: "Pendidikan itu penting."
✅ Kuat: "Pendidikan STEM harus menjadi prioritas kurikulum nasional karena terbukti meningkatkan daya saing ekonomi dan inovasi teknologi."

---

*Perlu bantuan menulis essay? [TugasKilat](https://tugaskilat.web.id) menggunakan AI untuk membantu kamu menulis essay argumentatif yang terstruktur dan meyakinkan.*',
  'tips',
  ARRAY['essay', 'argumentatif', 'menulis', 'akademik'],
  true,
  now(),
  'Tips Menulis Essay Argumentatif yang Meyakinkan [Panduan]',
  'Pelajari cara menulis essay argumentatif yang kuat dan meyakinkan. Panduan lengkap dengan contoh thesis statement dan struktur essay.'
),
(
  'panduan-laporan-praktikum-lengkap',
  'Panduan Membuat Laporan Praktikum yang Lengkap dan Sistematis',
  'Format laporan praktikum standar untuk siswa SMA dan mahasiswa sains. Lengkap dengan contoh dan template.',
  '# Panduan Membuat Laporan Praktikum yang Lengkap

## Mengapa Laporan Praktikum Penting?

Laporan praktikum adalah dokumentasi ilmiah dari kegiatan eksperimen di laboratorium. Laporan yang baik menunjukkan kemampuan analitis dan pemahaman konsep sains.

## Format Standar Laporan Praktikum

### 1. Judul Percobaan
Judul harus spesifik dan menggambarkan inti percobaan.

### 2. Tujuan
Nyatakan dengan jelas apa yang ingin dicapai dari percobaan ini.

### 3. Dasar Teori
Jelaskan teori yang mendasari percobaan. Sertakan rumus jika ada.

### 4. Alat dan Bahan
Daftar lengkap alat dan bahan yang digunakan beserta spesifikasinya.

### 5. Prosedur/Langkah Kerja
Langkah-langkah percobaan secara kronologis dan detail.

### 6. Data Hasil Pengamatan
Sajikan data dalam bentuk tabel atau grafik yang rapi.

### 7. Pembahasan
- Analisis data yang diperoleh
- Bandingkan dengan teori
- Jelaskan penyimpangan jika ada
- Identifikasi sumber error

### 8. Kesimpulan
Rangkuman hasil percobaan yang menjawab tujuan.

### 9. Daftar Pustaka
Sumber referensi yang digunakan.

## Tips Membuat Laporan Praktikum A+

1. **Catat data saat praktikum** - jangan mengandalkan ingatan
2. **Gunakan tabel yang rapi** untuk data pengamatan
3. **Analisis dengan kritis** - jangan hanya menyajikan data
4. **Jelaskan error** dan cara meminimalisirnya
5. **Gunakan bahasa ilmiah** yang formal dan objektif

---

*Kesulitan menulis laporan praktikum? [TugasKilat](https://tugaskilat.web.id) bisa membantu generate template laporan lengkap sesuai format standar!*',
  'tips',
  ARRAY['laporan', 'praktikum', 'laboratorium', 'sains', 'kuliah'],
  true,
  now(),
  'Panduan Laporan Praktikum Lengkap [Format & Template]',
  'Panduan lengkap format laporan praktikum untuk SMA dan kuliah. Struktur standar, tips penulisan, dan template yang bisa langsung dipakai.'
),
(
  'ai-dalam-pendidikan-masa-depan-belajar',
  'AI dalam Pendidikan: Masa Depan Cara Belajar Siswa Indonesia',
  'Bagaimana artificial intelligence mengubah cara siswa belajar dan mengerjakan tugas di era digital.',
  '# AI dalam Pendidikan: Masa Depan Cara Belajar

## Revolusi AI di Dunia Pendidikan

Artificial Intelligence (AI) telah mengubah banyak aspek kehidupan, termasuk pendidikan. Di Indonesia, adopsi teknologi AI dalam pembelajaran semakin meningkat, membuka peluang baru bagi siswa dan guru.

## Bagaimana AI Membantu Siswa?

### 1. Personalized Learning
AI dapat menyesuaikan materi pembelajaran sesuai kemampuan dan kecepatan belajar masing-masing siswa.

### 2. Tutor Virtual 24/7
Tidak perlu menunggu jam pelajaran untuk bertanya. AI bisa menjadi tutor kapan saja.

### 3. Membantu Pemahaman Konsep
AI bisa menjelaskan konsep sulit dengan berbagai cara sampai siswa benar-benar paham.

### 4. Efisiensi Waktu
Tugas yang biasanya memakan waktu berjam-jam bisa diselesaikan lebih cepat dengan bantuan AI sebagai starting point.

## Etika Penggunaan AI untuk Tugas

Penting untuk diingat:
- AI adalah **alat bantu**, bukan pengganti belajar
- Selalu **review dan edit** hasil AI
- **Pahami materinya** - jangan hanya copy-paste
- Gunakan AI untuk **belajar**, bukan hanya menyelesaikan tugas
- Cek kebijakan sekolah/kampus tentang penggunaan AI

## Masa Depan Pendidikan Indonesia

Dengan kemajuan AI, pendidikan di Indonesia akan semakin:
- Accessible - semua siswa bisa mendapat bantuan berkualitas
- Personalized - pembelajaran disesuaikan individu
- Efficient - waktu belajar lebih produktif
- Interactive - pembelajaran lebih engaging

## Kesimpulan

AI bukan ancaman bagi pendidikan, melainkan alat yang bisa memperkaya proses belajar jika digunakan dengan bijak dan etis.

---

*[TugasKilat](https://tugaskilat.web.id) menggunakan AI Google Gemini untuk membantu siswa SMA dan mahasiswa mengerjakan tugas dengan lebih efisien. Daftar gratis dan dapatkan 3 kredit!*',
  'education',
  ARRAY['ai', 'pendidikan', 'teknologi', 'belajar', 'siswa'],
  true,
  now(),
  'AI dalam Pendidikan: Masa Depan Belajar di Indonesia',
  'Bagaimana AI mengubah cara siswa Indonesia belajar. Manfaat, etika penggunaan, dan masa depan pendidikan berbasis artificial intelligence.'
),
(
  'cara-menyelesaikan-soal-matematika-dengan-cepat',
  '5 Strategi Menyelesaikan Soal Matematika dengan Cepat dan Tepat',
  'Teknik dan strategi jitu untuk mengerjakan soal matematika SMA dan kuliah dengan lebih efisien.',
  '# 5 Strategi Menyelesaikan Soal Matematika dengan Cepat

## Kenapa Matematika Terasa Sulit?

Banyak siswa merasa kesulitan dengan matematika bukan karena tidak mampu, tapi karena belum menemukan strategi yang tepat.

## 5 Strategi Jitu

### 1. Pahami Konsep, Bukan Hafal Rumus
Jika kamu memahami darimana rumus berasal, kamu tidak perlu menghafalnya. Pahami logikanya.

### 2. Identifikasi Pola Soal
Setiap bab punya pola soal yang berulang. Latihan banyak soal akan membuatmu mengenali pola ini.

### 3. Kerjakan dari yang Mudah
Saat ujian, kerjakan soal yang kamu yakin dulu. Ini membangun confidence dan menghemat waktu.

### 4. Tulis Langkah-Langkah
Jangan langkah di kepala. Tulis setiap step penyelesaian. Ini mengurangi error dan memudahkan review.

### 5. Cek Ulang dengan Substitusi
Setelah dapat jawaban, substitusi kembali ke soal awal untuk memverifikasi.

## Tips Tambahan

- **Latihan konsisten** lebih baik dari belajar marathon
- **Gunakan multiple approach** - ada lebih dari satu cara menyelesaikan soal
- **Jangan takut salah** - kesalahan adalah guru terbaik
- **Minta bantuan** saat stuck - teman, guru, atau AI

## Topik Matematika yang Sering Keluar

| SMA | Kuliah |
|-----|--------|
| Trigonometri | Kalkulus |
| Statistika | Aljabar Linear |
| Logaritma | Probabilitas |
| Geometri | Persamaan Diferensial |

---

*Butuh bantuan menyelesaikan soal matematika step-by-step? [TugasKilat](https://tugaskilat.web.id) bisa menyelesaikan soal dengan penjelasan detail di setiap langkah!*',
  'tips',
  ARRAY['matematika', 'kalkulus', 'soal', 'strategi', 'sma', 'kuliah'],
  true,
  now(),
  '5 Strategi Menyelesaikan Soal Matematika dengan Cepat',
  'Teknik jitu mengerjakan soal matematika SMA dan kuliah dengan cepat dan tepat. Strategi, tips, dan cara belajar matematika efektif.'
)
ON CONFLICT (slug) DO NOTHING;
