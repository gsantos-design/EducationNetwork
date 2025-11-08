# EdConnect Setup Instructions
## Get this running by Monday for your $50K Board of Education Contract! 🚀

### What Changed
✅ **Switched from OpenAI to Anthropic (Claude)** - Now using YOUR $1000 Anthropic credits!
✅ **Warm, encouraging AI tutor messaging** - No more intimidating language for vulnerable kids
✅ **Curriculum-aligned welcome prompts** - All 16 subjects tailored to NYC advanced 9th grade
✅ **FERPA compliance built-in** - PII redaction for student privacy

---

## Prerequisites (Check These First!)

### 1. Node.js (Required)
**Check if you have it:**
```bash
node --version
```
You need Node.js **v18 or higher**. If you don't have it:
- Download from: https://nodejs.org/
- Install the LTS (Long Term Support) version

### 2. PostgreSQL Database (Required)
You have two options:

**Option A: Use Neon (Cloud Database - EASIEST)**
1. Go to: https://neon.tech/
2. Sign up for free
3. Create a new project called "EdConnect"
4. Copy the connection string (looks like: postgresql://username:password@hostname/database)

**Option B: Install PostgreSQL locally**
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`

### 3. Your Anthropic API Key (Required)
1. Go to: https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Copy the key (starts with "sk-ant-...")
4. **IMPORTANT:** This uses your $1000 credits!

---

## Installation Steps

### Step 1: Extract and Navigate
1. Extract this folder to your Desktop or Documents
2. Open Command Prompt or Terminal
3. Navigate to the folder:
```bash
cd C:\Users\gisel\Desktop\EducationNetwork
```
(Adjust path based on where you extracted it)

### Step 2: Install Dependencies
```bash
npm install
```
This will take 2-3 minutes. It installs all required packages including the Anthropic SDK.

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```
(On Mac/Linux: `cp .env.example .env`)

2. Open `.env` in Notepad and fill in:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
DATABASE_URL=your_database_connection_string_here
SESSION_SECRET=make_this_a_long_random_string
```

**To generate a random SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Setup Database
```bash
npm run db:push
```
This creates all the tables needed for EdConnect.

### Step 5: Run EdConnect!
```bash
npm run dev
```

You should see:
```
Server running on port 5000
Database connected successfully
```

### Step 6: Open in Browser
Go to: http://localhost:5000

---

## Testing Before Monday Delivery

### Test Checklist:
1. ✅ Can you create an account?
2. ✅ Can you log in?
3. ✅ Does the AI Tutor load?
4. ✅ Click on "Chemistry" - Does the warm welcome appear?
5. ✅ Ask the tutor a question - Do you get a response?
6. ✅ Try Focus Timer - Do the ambient sounds work?
7. ✅ Check Study Tools - Do the tabs work?

### Test with Ella:
- Have her create an account
- Try Chemistry (her subject!)
- Try Geometry
- Try Spanish
- Get her feedback on the interface

---

## Troubleshooting

### "Command not found: node"
→ You need to install Node.js (see Prerequisites)

### "Cannot find module '@anthropic-ai/sdk'"
→ Run `npm install` again

### "Invalid API key"
→ Check your ANTHROPIC_API_KEY in `.env` file
→ Make sure there are no spaces around the key

### "Database connection failed"
→ Check your DATABASE_URL in `.env`
→ Make sure PostgreSQL is running (if using local)
→ Make sure Neon database is active (if using cloud)

### Port 5000 already in use
→ Close any other apps using port 5000
→ Or change port in `server/index.ts` (line 15)

### AI Tutor not responding
→ Check Anthropic API console: https://console.anthropic.com/
→ Make sure you have credits remaining ($1000 should be plenty!)
→ Check browser console (F12) for error messages

---

## Production Deployment (After Pilot Success)

When you're ready to deploy for the 10 students:

### Option 1: Replit (Easiest)
1. Push code to GitHub
2. Import to Replit
3. Add environment variables in Replit Secrets
4. Deploy!

### Option 2: Vercel/Netlify
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

---

## Monday Delivery Checklist

Before submitting to Board of Education:

- [ ] Test all 16 subjects
- [ ] Test AI Tutor with at least 5 different questions per subject
- [ ] Test Focus Timer and ambient sounds
- [ ] Test Progress Tracker
- [ ] Create demo account for Board of Ed: 
  - Username: demo@boardofed.nyc
  - Password: EdConnect2025!
- [ ] Create 10 student accounts for pilot
- [ ] Test on both Chrome and Safari/Edge
- [ ] Take screenshots of key features
- [ ] Write brief user guide for students

---

## Getting Help

**If you run into issues:**
1. Check the error message in terminal
2. Check browser console (F12 in browser)
3. Come back to Claude - share the error message and I'll help you fix it!

---

## What's Next (After $50K Secured)

**Phase 2 Features to Build:**
1. 6 Working Learning Games
2. "Build Apps with AI" lesson plans
3. Multi-model AI collaboration (Claude + ChatGPT + Gemini)
4. Fabric Plexus integration for child safety
5. Parent dashboard
6. Teacher dashboard
7. Progress reports and analytics

But first: **GET THAT $50K!** 💰

---

## Quick Reference

**Start EdConnect:**
```bash
npm run dev
```

**Stop EdConnect:**
Press `Ctrl+C` in terminal

**Update Database:**
```bash
npm run db:push
```

**Check for errors:**
```bash
npm run check
```

**View in browser:**
http://localhost:5000

---

You've got this, Giselle! Let's get EdConnect running and earn that $50K! 🎉

Then we can focus on the Google meeting (Nov 13) and your $500M-$1.5B acquisition! 🚀
