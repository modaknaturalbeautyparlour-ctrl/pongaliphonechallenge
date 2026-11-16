# Pongal Festival - Win an iPhone Contest Website

A modern, responsive single-page website for Pongal Festival iPhone contest registration with a real-time admin dashboard.

## 🎯 Features

### Public Features
- Beautiful Pongal-themed landing page
- iPhone giveaway promotion with countdown timer
- Registration modal with comprehensive form validation
- Indian phone number and email validation
- Duplicate registration prevention
- Success confirmation with unique registration ID

### Admin Features
- Secure admin authentication
- Real-time registration monitoring
- Live activity feed with consent-based tracking
- Registration statistics (total, today, this week)
- Search and filter registrations
- Export registrations to CSV
- View detailed registration information
- Delete registrations with confirmation
- 24/7 accessible dashboard
- IST (Indian Standard Time) timestamps

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Styling**: Tailwind CSS with custom Pongal theme

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account ([Create one for free](https://supabase.com))

### Step 1: Clone and Install Dependencies

\`\`\`bash
cd pongal-contest
npm install
\`\`\`

### Step 2: Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create the tables and policies

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Get your Supabase credentials:
   - Go to **Settings** → **API** in your Supabase dashboard
   - Copy the **Project URL** and **anon/public key**

3. Update `.env` with your values:
   \`\`\`env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_CONTEST_END_DATE=2026-01-20T23:59:59
   \`\`\`

### Step 4: Create Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** → **Create New User**
3. Enter admin email and password
4. Confirm the user via email or set as confirmed in dashboard

### Step 5: Enable Realtime (Optional but Recommended)

1. Go to **Database** → **Replication** in Supabase dashboard
2. Enable replication for:
   - `contest_registrations`
   - `registration_activity`

## 🚀 Running the Application

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

- **Public Landing Page**: `http://localhost:5173/`
- **Admin Dashboard**: `http://localhost:5173/admin`

### Production Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📱 Usage

### For Participants

1. Visit the landing page
2. Click **Register Now** button
3. Fill out the registration form:
   - Full Name
   - Mobile Number (Indian format)
   - Email Address
   - Complete Delivery Address
   - City, State, PIN Code
4. Check the privacy consent checkbox
5. Click **Submit Registration**
6. Save your unique Registration ID

### For Admins

1. Navigate to `/admin`
2. Login with admin credentials
3. View dashboard with:
   - Registration statistics
   - Live activity feed
   - Full registration list
4. Use search and filters to find registrations
5. Export data to CSV
6. View detailed registration information
7. Delete registrations if needed

## 🔒 Security Features

- Row Level Security (RLS) policies on all tables
- Authenticated access required for admin operations
- Anonymous users can only insert registrations
- No service-role keys exposed in frontend
- Duplicate registration prevention
- Secure authentication via Supabase Auth

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:

\`\`\`javascript
colors: {
  pongal: {
    orange: '#FF6B35',
    yellow: '#F7B731',
    cream: '#FFF8E7',
    green: '#2D5016',
    darkGreen: '#1A3009',
  },
}
\`\`\`

### Contest End Date

Update in `.env`:

\`\`\`env
VITE_CONTEST_END_DATE=2026-01-20T23:59:59
\`\`\`

## 📊 Database Schema

### contest_registrations
- `id` (UUID, Primary Key)
- `registration_number` (TEXT, Unique)
- `full_name` (TEXT)
- `phone_number` (TEXT)
- `email` (TEXT)
- `delivery_address` (TEXT)
- `city` (TEXT)
- `state` (TEXT)
- `pincode` (TEXT)
- `consent_given` (BOOLEAN)
- `registration_status` (TEXT)
- `created_at` (TIMESTAMP)

### registration_activity
- `id` (UUID, Primary Key)
- `registration_id` (TEXT)
- `activity_type` (TEXT)
- `activity_description` (TEXT)
- `created_at` (TIMESTAMP)

## 🚀 Deployment

### Recommended Platforms

1. **Vercel** (Recommended)
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`

2. **Netlify**
   - Connect your GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Supabase Hosting** (Coming soon)

### Environment Variables

Don't forget to add environment variables to your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CONTEST_END_DATE`

## 🐛 Troubleshooting

### Registration Form Not Submitting
- Check Supabase credentials in `.env`
- Verify RLS policies are created
- Check browser console for errors

### Admin Login Failed
- Ensure admin user is created in Supabase
- Verify user email is confirmed
- Check Supabase Auth is enabled

### Realtime Not Working
- Enable Realtime replication in Supabase
- Check if tables are added to publication
- Verify WebSocket connection in browser console

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Support

For issues or questions:
1. Check Supabase documentation
2. Review browser console for errors
3. Verify environment variables
4. Check Supabase dashboard logs

## 🎉 Credits

Built with love for Pongal Festival 2026! 🎍🫕🌺
