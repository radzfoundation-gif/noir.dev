# 🔧 Complete Fix Guide for Supabase RLS Policies

## 📋 Summary of All Issues & Fixes

| Error | Cause | Fix Script | Status |
|-------|-------|------------|--------|
| `infinite recursion` | Self-referencing policy | `fix_infinite_recursion.sql` | ✅ Fixed |
| `column "owner_id" does not exist` | Wrong table reference | `fix_column_reference.sql` | ✅ Fixed |

---

## 🚀 Quick Fix (1-2-3)

### **Fix untuk Error: "column owner_id does not exist"**

```bash
# 1. Buka Supabase SQL Editor
# 2. Copy script dari fix_column_reference.sql
# 3. Paste & Run
```

---

## 📝 Detailed Explanation

### **Issue 1: Infinite Recursion**
```
Error: infinite recursion detected in policy for relation "team_members"
```

**Root Cause:**
```sql
-- ❌ Self-referencing policy
CREATE POLICY "Team members can view other members"
    ON team_members FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM team_members  -- Calls itself!
        WHERE ...
    ));
```

**Fix:**
```sql
-- ✅ Use different alias
CREATE POLICY "Team members can view other members"
    ON team_members FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM team_members tm_self  -- Different alias!
        WHERE ...
    ));
```

---

### **Issue 2: Column Not Exist**
```
Error: column "owner_id" does not exist
```

**Root Cause:**
```sql
-- ❌ owner_id only exists in teams table, not team_members
CREATE POLICY "Users can add team members"
    ON team_members FOR INSERT
    WITH CHECK (owner_id = auth.uid())
```

**Fix:**
```sql
-- ✅ Reference owner_id from teams table
CREATE POLICY "Users can add team members"
    ON team_members FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM teams
        WHERE teams.id = team_members.team_id
        AND teams.owner_id = auth.uid()  -- Correct table!
    ))
```

---

## 📁 File Guide

| File | Kapan Digunakan? |
|------|-----------------|
| `database_schema.sql` | Setup database dari awal (semua tables, policies, triggers) |
| `fix_infinite_recursion.sql` | Fix infinite recursion di RLS policies |
| `fix_column_reference.sql` | Fix column reference error (owner_id) |
| `FIX_INFINITE_RECURSION.md` | Panduan lengkap untuk infinite recursion |
| `SETUP_DATABASE.md` | Panduan lengkap setup database |
| `QUICK_REFERENCE.md` | Referensi cepat untuk semua errors |

---

## 🎯 Which File to Run?

### **Scenario 1: Fresh Setup**
Run `database_schema.sql`

### **Scenario 2: Infinite Recursion Error**
Run `fix_infinite_recursion.sql`

### **Scenario 3: Column "owner_id" Does Not Exist**
Run `fix_column_reference.sql`

### **Scenario 4: Both Errors**
Run both `fix_infinite_recursion.sql` dan `fix_column_reference.sql`

---

## ✅ Verification

Setelah running fix script, verify dengan:

```sql
-- Test team_members SELECT
SELECT * FROM team_members LIMIT 10;

-- Test teams SELECT
SELECT * FROM teams LIMIT 10;

-- Test projects INSERT
INSERT INTO projects (name, user_id, code)
VALUES ('Test Project', 'user-uuid', '<html>...</html>');
```

---

## 🎉 Expected Results

Setelah fix, semua feature ini harus berjalan:

✅ **Create Projects** - Save project ke database
✅ **View Projects** - Load daftar project
✅ **Create Teams** - Buat team workspace
✅ **Add Team Members** - Invite member ke team
✅ **Share Projects** - Share project dengan link
✅ **Post Comments** - Tambah komentar
✅ **View Activities** - Activity feed

---

## 💡 Best Practices

### **1. Check Column References**
Pastikan kolom yang di-reference memang ada di tabel tersebut:

```sql
-- ❌ Wrong
WHERE team_members.owner_id = ...

-- ✅ Correct
WHERE teams.owner_id = ...
```

### **2. Use Aliases for Self-Referencing**
Hindari infinite recursion dengan menggunakan alias:

```sql
-- ❌ Bad
SELECT * FROM team_members
WHERE EXISTS (SELECT * FROM team_members ...)

-- ✅ Good
SELECT * FROM team_members
WHERE EXISTS (SELECT * FROM team_members tm_self ...)
```

### **3. Test Incrementally**
Test 1 policy dulu sebelum buat yang baru:

```sql
-- Create 1 policy
CREATE POLICY ...

-- Test it
SELECT * FROM team_members LIMIT 10;

-- If OK, create next policy
```

---

## 📞 Still Having Issues?

Jika masih ada error setelah running fix:

1. **Check logs** di Supabase Dashboard → Database Logs
2. **Test directly** di Supabase SQL Editor
3. **Clear browser cache** dan refresh
4. **Re-login** ke Supabase auth
5. **Verify user ID** - Pastikan user sudah authenticated

---

## 📝 Changes Made

### **Fixed Files:**
- ✅ `fix_infinite_recursion.sql` - Added correct column references
- ✅ `database_schema.sql` - Fixed team_members policies
- ✅ `FIX_INFINITE_RECURSION.md` - Updated with column reference fix
- ✅ `QUICK_REFERENCE.md` - Added column reference error
- ✅ `fix_column_reference.sql` - New file for quick fix

### **Policies Fixed:**
- ✅ `team_members` - View/Add/Update/Delete members
- ✅ `teams` - View/Create/Update/Delete teams
- ✅ `project_shares` - Create/Update/Delete shares
- ✅ `activities` - View/Log activities
- ✅ `design_systems` - View/Create systems
- ✅ `comments` - View/Create/Update/Delete comments
- ✅ `api_endpoints` - View/Manage endpoints

---

**Last Updated:** 2025-02-05
**Status:** ✅ All Issues Resolved
