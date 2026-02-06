# ⚡ Quick Reference: Supabase Setup

## 🎯 3 Langkah Cepat

### 1️⃣ Buat Project
```
Supabase Dashboard → New Project → "noir-ai" → Create
```

### 2️⃣ Run SQL
```
Dashboard → SQL Editor → New Query
→ Copy SQL dari SETUP_DATABASE.md
→ Paste → Run
```

### 3️⃣ Copy Environment Variables
```
Dashboard → Settings → API
→ Copy Project URL & anon/public key
→ Paste ke file .env
```

---

## 🔑 Environment Variables

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 📋 Checklist Tabel

| Status | Tabel | Deskripsi |
|--------|-------|----------|
| ✅ | `projects` | Project utama |
| ✅ | `project_versions` | Version history |
| ✅ | `teams` | Team workspaces |
| ✅ | `team_members` | Anggota team |
| ✅ | `project_shares` | Share project |
| ✅ | `comments` | Komentar |
| ✅ | `waitlist` | Waitlist signups |
| ✅ | `activities` | Activity feed |
| ✅ | `api_keys` | API management |
| ✅ | `webhooks` | Webhook config |

---

## 🚨 Common Errors & Fixes

### Error: `infinite recursion detected in policy for relation "team_members"`
**Fix:** Jalankan `fix_infinite_recursion.sql` di Supabase SQL Editor

### Error: `column "owner_id" does not exist`
**Fix:** Jalankan `fix_column_reference.sql` di Supabase SQL Editor

### Error: `new row violates row-level security policy`
**Fix:** Jalankan full SQL script di SETUP_DATABASE.md (versi terbaru)

### Error: `policy "..." already exists`
**Fix:** Jangan khawatir, script sudah menggunakan `DROP POLICY IF EXISTS`. Ini normal.

### Error: `permission denied for table`
**Fix:** Check apakah RLS policies sudah dibuat dengan benar

### Error: `relation does not exist`
**Fix:** Jalankan SQL script sampai selesai, jangan stop di tengah

### Error: `trigger already exists`
**Fix:** Script sudah menggunakan `DROP TRIGGER IF EXISTS`. Safe to re-run.

---

## 🔗 Useful Commands

### Check Table Exists
```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'public';
```

### Check RLS Policies
```sql
SELECT * FROM pg_policies
WHERE schemaname = 'public';
```

### Enable Realtime
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE table_name;
```

---

## 📞 Need Help?

1. 📖 Baca `SETUP_DATABASE.md` untuk panduan lengkap
2. 🐛 Check Supabase Dashboard → Database Logs
3. 🌐 Supabase Docs: https://supabase.com/docs

---

**Created:** 2025-02-05
**Project:** NOIR AI
