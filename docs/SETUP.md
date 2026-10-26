# GapFinder AI — Setup & Deployment Guide

This guide provides reproducible instructions for running GapFinder AI locally or connecting it to a live Supabase and Google Gemini instance.

---

## 1. Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **Package Manager**: `npm` (comes with Node.js) or `pnpm`
- **Git**: Installed and configured

---

## 2. Quick Start (Zero-Configuration Local Mode)

GapFinder AI is built with an offline-resilient architecture. You can run the entire platform immediately without configuring external databases or API keys:

```bash
# 1. Clone the repository
git clone https://github.com/abhilash-210/StudentGap-AI.git
cd StudentGap-AI

# 2. Install dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

Open your browser to: **`http://localhost:3000`**

---

## 3. Evaluator Demo Accounts

The project includes three pre-configured demonstration accounts accessible via 1-click login buttons on the landing page or by entering the credentials below:

| Role | Name | Email | Password | Pre-enrolled Courses |
|---|---|---|---|---|
| **Professor** | Dr. Sarah Williams | `prof.sarah@gapfinder.demo` | `Professor@123` | CS201 (OS), CS202 (DBMS), CS301 (ML) |
| **Student 1** | Alex Chen | `alex.chen@gapfinder.demo` | `Student@123` | CS201 (OS), CS202 (DBMS) |
| **Student 2** | Priya Sharma | `priya.sharma@gapfinder.demo` | `Student@123` | CS201 (OS), CS301 (ML) |

*Note: These credentials are demonstration accounts pre-seeded with synthetic benchmark data. Do not store sensitive personal information.*

---

## 4. Connecting to Supabase (Optional)

To enable live cloud PostgreSQL database persistence and pgvector semantic search:

### Step 1: Create a Supabase Project
1. Log in to [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Click **New Project** and choose a project name and database password.

### Step 2: Apply Database Schema
1. In the Supabase dashboard, navigate to the **SQL Editor** (`>_` icon in the left sidebar).
2. Click **+ New query**.
3. Copy the contents of `supabase/schema.sql` from your project and paste it into the query editor.
4. Click **Run**. The script will automatically enable `pgvector` and establish all tables, procedures, and Row Level Security policies.

### Step 3: Configure Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key-here

# Optional: Google Gemini AI API Key
GEMINI_API_KEY=your-gemini-api-key-here
```

Restart your dev server:
```bash
npm run dev
```

---

## 5. Build and Quality Verification Commands

```bash
# Run ESLint validation
npm run lint

# Build the production bundle
npm run build

# Start production server
npm run start
```
