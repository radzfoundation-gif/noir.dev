# 🔧 Fix Duplicate Policy Error

## Error Message:
```
ERROR: 42710: policy "Users can update own presence" for table "user_presence" already exists
```

---

## ✅ Solusi Cepat (1 Langkah)

Copy dan paste SQL berikut ke **Supabase SQL Editor** dan run:

```sql
-- ============================================================================
-- FIX: Drop duplicate policies and triggers
-- ============================================================================

-- Drop duplicate user_presence policies
DROP POLICY IF EXISTS "Users can view presence" ON user_presence;
DROP POLICY IF EXISTS "Users can insert own presence" ON user_presence;
DROP POLICY IF EXISTS "Users can update own presence" ON user_presence;

-- Recreate user_presence policies with correct names
CREATE POLICY "Users can view presence"
    ON user_presence FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own presence"
    ON user_presence FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own presence"
    ON user_presence FOR UPDATE
    USING (user_id = auth.uid());

-- Drop and recreate triggers if needed
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_design_systems_updated_at ON design_systems;
DROP TRIGGER IF EXISTS update_user_design_preferences_updated_at ON user_design_preferences;
DROP TRIGGER IF EXISTS update_api_endpoints_updated_at ON api_endpoints;
DROP TRIGGER IF EXISTS update_database_schemas_updated_at ON database_schemas;
DROP TRIGGER IF EXISTS update_database_tables_updated_at ON database_tables;

-- Create triggers
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_design_systems_updated_at BEFORE UPDATE ON design_systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_design_preferences_updated_at BEFORE UPDATE ON user_design_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON api_endpoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_database_schemas_updated_at BEFORE UPDATE ON database_schemas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_database_tables_updated_at BEFORE UPDATE ON database_tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📋 Cara Menggunakan:

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project `noir-ai`
3. Klik **"SQL Editor"** di sidebar kiri
4. Klik **"New Query"**
5. **Copy** semua SQL di atas
6. **Paste** ke SQL Editor
7. Klik **"Run"**
8. ✅ Selesai!

---

## 🎯 Apa yang dilakukan script ini?

1. ✅ Drop semua duplicate policies pada `user_presence`
2. ✅ Recreate policies dengan nama yang benar
3. ✅ Drop semua duplicate triggers
4. ✅ Recreate semua triggers untuk auto-update `updated_at` field

---

## 💡 Tips untuk masa depan:

File `SETUP_DATABASE.md` sudah diperbarui dan sekarang menggunakan:
- `DROP POLICY IF EXISTS` sebelum setiap `CREATE POLICY`
- `DROP TRIGGER IF EXISTS` sebelum setiap `CREATE TRIGGER`

Ini berarti script bisa di-run berkali-kali tanpa error!

---

**Created:** 2025-02-05
**Purpose:** Fix duplicate policy/triggers error
