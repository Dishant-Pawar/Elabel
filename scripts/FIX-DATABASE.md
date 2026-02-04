# Fix Database Connection

## Steps to Fix:

### 1. Get New Credentials from Supabase

Visit: https://supabase.com/dashboard/project/yzttpuccauzhjcoazjlu/settings/database

### 2. Reset Password
- Click "Reset database password"
- Choose a strong password (e.g., `NewPassword123!`)
- Click "Reset Password"

### 3. Get Connection Strings
After resetting, copy:
- **Pooler (Transaction mode)** for DATABASE_URL
- **Session mode** or **Direct connection** for DIRECT_URL

They will look like:
```
postgresql://postgres.yzttpuccauzhjcoazjlu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
postgresql://postgres.yzttpuccauzhjcoazjlu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### 4. Update .env File

Replace the lines in `.env`:

**Old:**
```env
DATABASE_URL=postgresql://postgres.yzttpuccauzhjcoazjlu:Ravan%40008elabel@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:Ravan%40008elabel@db.yzttpuccauzhjcoazjlu.supabase.co:5432/postgres
```

**New:** (replace [YOUR-PASSWORD] with your actual new password)
```env
DATABASE_URL=postgresql://postgres.yzttpuccauzhjcoazjlu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.yzttpuccauzhjcoazjlu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

**Important:** If your password has special characters, URL-encode them:
- `@` becomes `%40`
- `!` becomes `%21`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`

Example:
```
Password: MyPass@123!
Encoded:  MyPass%40123%21
```

### 5. Restart Dev Server

After updating `.env`:
1. Stop the dev server (Ctrl+C in terminal)
2. Run: `pnpm dev:next`
3. Wait for it to compile
4. Try submitting the form again

---

## Alternative: Quick Test with Mock Data (No Database)

If you just want to test the form filling script without fixing the database, I can create a version that saves to localStorage instead.

Would you like me to:
- [ ] Wait for you to fix Supabase connection
- [ ] Create a mock version that saves to localStorage (no database needed)
