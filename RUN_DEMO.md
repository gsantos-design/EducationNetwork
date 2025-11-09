# Run EdConnect Demo Locally (NO DEPLOYMENT NEEDED!)

## Easiest Option - Run on Your Computer

You don't need to deploy anywhere! Just run this app on your local computer for your demo.

### Option 1: Double-Click Method (Easiest)

1. Find the file: `QUICKSTART.bat` in this folder
2. Double-click it
3. Wait for it to install and start
4. Open your browser to: http://localhost:5000
5. Demo the app!

### Option 2: Command Line

```bash
cd "c:\Users\gisel\OneDrive\Documents\jc\EducationNetwork"
npm install
npm run dev
```

Then open: http://localhost:5000

---

## For Demo Purposes

**You don't need a database!** The app will work without it - some features just won't persist data between sessions.

**Your API key is already configured** in the `.env` file, so the AI tutor will work immediately.

---

## If You Still Want to Deploy Online

### Vercel (You have it installed - Easiest online option)

```bash
cd "c:\Users\gisel\OneDrive\Documents\jc\EducationNetwork"
vercel
```

Follow the prompts:
- Login to Vercel (opens browser)
- Set up project (press Enter for defaults)
- Add environment variables when prompted:
  - ANTHROPIC_API_KEY
  - SESSION_SECRET
  - DATABASE_URL (can skip for demo)

Vercel will give you a live URL in ~2 minutes.

---

## Database Setup (Optional)

If you want data to persist:

1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Add to `.env` file as `DATABASE_URL`

---

## The Bottom Line

**For Monday's demo:** Just run `QUICKSTART.bat` and demo from localhost:5000. No deployment, no database, no hassle. The AI tutor will work perfectly!
