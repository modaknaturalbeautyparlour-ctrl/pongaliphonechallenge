# Quick Setup Guide - Pongal Contest Website

## 🚀 5-Minute Setup

### 1. Create Supabase Project (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Enter project details:
   - Name: `pongal-contest`
   - Database Password: (save this securely)
   - Region: Choose closest to India
4. Wait for project to initialize (~2 minutes)

### 2. Set Up Database (1 minute)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire content from `supabase-schema.sql` file
4. Click **Run** (bottom right)
5. You should see: "Success. No rows returned"

### 3. Get API Credentials (30 seconds)

1. Go to **Settings** → **API** (gear icon in sidebar)
2. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

### 4. Configure Environment Variables (30 seconds)

1. In project folder, create `.env` file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Edit `.env` and paste your credentials:
   \`\`\`env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_CONTEST_END_DATE=2026-01-20T23:59:59
   \`\`\`

### 5. Create Admin Account (1 minute)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter:
   - Email: `admin@example.com` (or your email)
   - Password: Create a strong password
4. Toggle **Auto Confirm User** to ON
5. Click **Create User**

### 6. Enable Realtime (30 seconds)

1. Go to **Database** → **Replication**
2. Find `contest_registrations` table
3. Toggle it to **enabled**
4. Find `registration_activity` table
5. Toggle it to **enabled**

### 7. Run the Application (30 seconds)

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit:
- **Public Site**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin

## ✅ Verify Setup

### Test Public Registration
1. Go to http://localhost:5173
2. Click "Register Now"
3. Fill the form and submit
4. You should see success message with registration ID

### Test Admin Dashboard
1. Go to http://localhost:5173/admin
2. Login with admin credentials
3. You should see the registration you just made
4. Check the live activity feed

## 🎉 That's It!

Your Pongal Contest website is now ready!

## 🔧 Common Issues

### "Missing Supabase environment variables"
- Double-check `.env` file exists
- Verify no spaces around `=` in `.env`
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Admin login failed"
- Verify admin user is created in Supabase
- Check user is confirmed (green checkmark in Users tab)
- Try password reset if needed

### "Registration not appearing in dashboard"
- Refresh the page
- Check Supabase **Table Editor** → `contest_registrations`
- Verify RLS policies are created (check SQL Editor)

### "No realtime updates"
- Enable Realtime replication (Step 6)
- Check browser console for WebSocket errors
- Refresh the admin dashboard

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Check Supabase **Logs** tab for backend errors
3. Review `README.md` for detailed documentation
4. Verify all steps above were completed

## 🚀 Ready to Deploy?

Once everything works locally:

1. **Push to GitHub**
2. **Deploy to Vercel**:
   - Connect GitHub repo
   - Add environment variables
   - Deploy!
3. **Share your contest link** 🎉

---

**Happy Pongal! 🎍🫕🌺**
