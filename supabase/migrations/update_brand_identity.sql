-- NOIR AI: BRAND IDENTITY MIGRATION
-- Jalankan skrip ini di SQL Editor Supabase untuk mengaktifkan fitur Brand Identity

-- 1. Tambahkan kolom brand_identity ke tabel projects jika belum ada
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='brand_identity') THEN
        ALTER TABLE projects ADD COLUMN brand_identity JSONB DEFAULT '{
            "primaryColor": "#bef264",
            "secondaryColor": "#171717",
            "backgroundColor": "#0a0a0a",
            "fontFamily": "Inter",
            "borderRadius": "md",
            "styleMode": "glassmorphism"
        }'::jsonb;
        
        RAISE NOTICE 'Kolom brand_identity berhasil ditambahkan ke tabel projects.';
    ELSE
        RAISE NOTICE 'Kolom brand_identity sudah ada.';
    END IF;
END $$;

-- 2. Berikan izin akses (RLS) untuk memastikan kolom bisa dibaca/tulis
-- (Biasanya otomatis jika RLS projects sudah aktif, tapi ini untuk memastikan)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. Verifikasi: Update semua proyek lama yang memiliki brand_identity NULL dengan nilai default
UPDATE projects 
SET brand_identity = '{
    "primaryColor": "#bef264",
    "secondaryColor": "#171717",
    "backgroundColor": "#0a0a0a",
    "fontFamily": "Inter",
    "borderRadius": "md",
    "styleMode": "glassmorphism"
}'::jsonb
WHERE brand_identity IS NULL;
