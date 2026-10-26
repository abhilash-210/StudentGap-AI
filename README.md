# 🎯 StudentGap AI (GapFinder AI)
### Proactive Knowledge Gap Diagnosis & Adaptive Revision Engine for Students

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase & pgvector](https://img.shields.io/badge/Database-Supabase%20%2F%20pgvector-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![Google Gemini API](https://img.shields.io/badge/AI%20Layer-Google%20Gemini-orange?style=flat&logo=google)](https://ai.google.dev/)

> **"Students often study everything equally and still miss what they don’t know. Traditional study tools wait for the student to ask a question, but a student cannot ask about a gap they do not know they have."**
>
> **StudentGap AI** reverses the traditional study paradigm. Instead of an unguided generic chatbot, it ingests a student's syllabus, textbook chapters, lecture notes, and past question papers, finds their hidden conceptual blindspots and misconceptions through grounded diagnostic testing, and builds an adaptive, time-budgeted revision plan.

---

## 🌟 Demo Credentials & Preloaded Courses (Ready for Evaluation)

StudentGap AI comes **preloaded with complete course curricula, lecture notes, past exam questions, and baseline diagnostic reports**, allowing evaluators and judges to experience the full application in 1 click without manual uploads:

| Role | Username / Email | Password | 1-Click UI Login | Key Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Student** | `student@gapfinder.ai` | `demo1234` | **"Alex Chen (Student)"** | Experience student diagnosis, quiz testing, gap reports, and dynamic revision plans |
| **Demo Professor** | `prof.sarah@university.edu` | `prof1234` | **"Prof. Sarah (Teacher)"** | Inspect class-level topic struggle heatmaps and cohort misconception analytics |

### Preloaded Benchmark Courses:
1. **`CS201: Operating Systems & Concurrency`**
   - **Syllabus:** Process synchronization, Semaphores, Deadlocks & Banker's Algorithm, Virtual Memory, TLB Effective Access Time (EAT), Page Replacement (FIFO vs LRU, Belady's Anomaly), Thrashing & Working Set.
   - **Notes Chunks:** Multi-page lecture notes with mathematical formulas and pseudocode.
   - **Past Exams:** Real University & GATE past paper problem sets (2022–2024).
2. **`CS301: Machine Learning & Deep Learning Foundations`**
   - **Syllabus:** Empirical risk minimization, Gradient descent variants, L1 Lasso vs L2 Ridge geometric sparsity, Regularization, and Neural Backpropagation.

---

## 🏗️ System Architecture Overview

StudentGap AI is built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**, powered by a **Dual-Mode AI Architecture** that pairs Retrieval-Augmented Generation (RAG) with diagnostic evaluation algorithms, backed by **PostgreSQL & Supabase Vector (`pgvector`)**.

```mermaid
flowchart TD
    subgraph Ingestion["1. Material Ingestion & Vector Storage"]
        A[Student Uploads: Syllabus, Notes, Past Exams] --> B[Semantic Chunker & Tokenizer]
        B --> C[(Supabase PostgreSQL / pgvector Store)]
        B --> D[Local In-Memory BM25 Vector Indexer]
    end

    subgraph Generation["2. Grounded Question Generation"]
        C & D --> E[Topic & Exam Weightage Mapper]
        E --> F[Grounded Question Generator]
        F --> G[Diagnostic Quiz with Distractor Misconceptions & Source Citations]
    end

    subgraph Evaluation["3. Answer Evaluation & Gap Analysis Engine"]
        G --> H[Student Answer Submission]
        H --> I{Answer Evaluator}
        I -->|Identifies Misconception| J[Misconception Classifier]
        I -->|Calculates Accuracy| K[Topic Mastery Scorer]
        J & K --> L[Diagnostic Gap Report]
    end

    subgraph Action["4. Adaptive Action & Persistence"]
        L --> M[High-Risk Danger Zone Detector]
        L --> N[Cognitive Dimensions Matrix]
        L --> O[Dynamic Revision Planner]
        O --> P[Day-by-Day Time-Budgeted Revision Schedule]
        C & D --> Q[Explain-This-Topic RAG Assistant with Citations]
        L & P --> R[(PostgreSQL Persistence Layer)]
    end
```

---

## 🔍 Retrieval vs. Generation: Architectural Separation

A fundamental design principle of StudentGap AI is the strict separation between deterministic retrieval and bounded generation:

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as StudentGap Interface
    participant RAG as RAG Retriever (Deterministic)
    participant LLM as Generative AI (Google Gemini / Engine)
    participant Evaluator as Diagnostic Rule Engine

    Note over RAG: RETRIEVAL ONLY (Zero Hallucination)
    Student->>UI: Selects Topic or Starts Diagnostic Quiz
    UI->>RAG: Query material index for syllabus & chapter chunks
    RAG-->>UI: Returns top-K snippets with exact citations (Doc, Section, Page)

    Note over LLM: GENERATION ONLY (Strictly Grounded)
    UI->>LLM: Injects retrieved chunks into strict system prompt
    LLM-->>UI: Generates question with misconception distractors & citations

    Student->>UI: Submits answer with confidence rating
    Note over Evaluator: EVALUATION & DIAGNOSIS
    UI->>Evaluator: Compare answer against ground truth & distractor tags
    Evaluator-->>UI: Detects specific misconception, updates topic mastery %, builds Gap Report

    UI->>Evaluator: Synthesizes time budget (e.g. 3 days, 2 hrs/day)
    Evaluator-->>Student: Renders day-by-day actionable prioritized revision plan
```

1. **Where Retrieval is Used (Deterministic):**
   - **Chunking & Indexing:** Notes and past papers are tokenized into 120-word semantic windows preserving source headers and page numbers.
   - **Similarity Search:** Scored using BM25 / TF-IDF or PostgreSQL `pgvector` cosine similarity (`match_chunks` stored procedure).
   - **Source Citations:** Answers and questions always link directly back to the physical source chunk (`[Operating_Systems_Lecture_Notes.pdf: Section 5.4, Page 78]`).

2. **Where Generation is Used (Bounded):**
   - **Misconception Distractors:** Plausible distractors modeled around real cognitive flaws (e.g. confusing FIFO with LRU stack property).
   - **Personalized RAG Explanations:** Explanations synthesized strictly from retrieved context passages.

3. **How They Are Kept Separate:**
   - The AI is never allowed to answer from ungrounded parametric memory. If retrieval finds insufficient context, the system alerts the user and requests supplementary notes.
   - Diagnostic grading is verified against exact chunk assertions and validated distractor metadata.

---

## 🚀 Major Features

### 1. 📊 Student Dashboard
- Real-time diagnostic readiness percentage gauge.
- Dynamically synthesized **Recommended Next Action** based on current test data or pending revision tasks.
- Critical Knowledge Gaps preview with direct 1-click "Explain concept" and "Practice topic" triggers.
- Active revision plan progress tracker.

### 2. 📂 Material Upload & RAG Chunking
- Supports `.txt`, `.md`, and `.json` documents with drag-and-drop.
- 5MB file-size validation and live chunk preview before indexing.
- 1-click sample presets for syllabus, lecture notes, and past question papers.

### 3. 🗺️ Syllabus Topic Map
- Hierarchical breakdown of units, topics, subtopics, and exam weightage percentages.
- **Honest Evidence Sufficiency Badges**: Differentiates between `HIGH_EVIDENCE` (tested on 3+ items), `LIMITED_EVIDENCE` (1-2 items), and `UNTESTED`.
- Direct action triggers to launch a topic-filtered quiz or request an explanation.

### 4. 🧪 Grounded Diagnostic Quiz
- Questions generated strictly from uploaded materials with verified source citations.
- Accidental double-submission prevention.
- Unanswered questions confirmation dialog.
- Answer preservation across question navigation dots.
- Confidence rating selector (Low / Medium / High) to detect accidental guesses.

### 5. 📉 Diagnostic Gap Report (Core Differentiator)
- Categorizes topics into Weak (<50%), Medium (50–74%), and Strong (≥75%) mastery based on actual evaluated answers.
- Identifies specific misconceptions and sample size limitations.
- High-Risk Danger Zones combining low mastery with high exam weightage.
- Cognitive Dimensions breakdown: Theoretical, Problem-Solving, Edge Cases, and Terminology.

### 6. 📅 Adaptive Dynamic Revision Plan
- Personalized study schedules tailored to available timeframe (3, 5, or 7 days) and daily hours (1 to 4 hrs/day).
- Interactive task checkboxes linked to live state and persistence.
- Recalculates completion percentage and study minutes in real-time.
- Task status filters: `ALL`, `PENDING`, and `COMPLETED`.
- 1-Click clean Markdown export.

### 7. 💡 Explain-This-Topic RAG Assistant
- Conversational tutor grounded exclusively in course notes and past papers.
- Expandable citation cards revealing verbatim text snippets.
- Copy message and clear chat history utilities.

### 8. 📈 Progress & Teacher Analytics
- Historical score progression across multiple diagnostic attempts.
- **Teacher View Toggle**: Visualizes class-level topic struggle heatmaps across 48 students, demonstrating future institutional LMS scalability without exposing individual student records.

---

## 🛠️ Complete Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) | Core web application architecture |
| **UI Library** | [React 19](https://react.dev/) | Component hierarchy & state |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end type safety |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Academic SaaS design system with dark mode |
| **Icons & Effects** | `lucide-react`, `canvas-confetti` | Accessible icons and celebratory micro-interactions |
| **AI Layer** | [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`) | Multimodal LLM synthesis with local BM25 fallback |
| **Database** | [Supabase](https://supabase.com/) / [PostgreSQL](https://www.postgresql.org/) | Relational persistence for courses, reports, and plans |
| **Vector Store** | [pgvector](https://github.com/pgvector/pgvector) | 768-dim vector embeddings with HNSW cosine search |
| **Authentication** | [Supabase Auth](https://supabase.com/docs/guides/auth) | Live email/password auth + 1-click judge demo logins |

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js v18+ (tested on v20 & v24)
- npm or pnpm
- Git

### 1. Clone & Install
```bash
git clone https://github.com/abhilash-210/StudentGap-AI.git
cd StudentGap-AI
npm install
```

### 2. Configure Environment Variables (Optional)
StudentGap AI features **Dual-Mode Zero-Setup Resilience**:
- **Without any API keys or database configured**, the application runs smoothly on its local BM25 vector indexer and local storage. No blank screens or connection errors!
- To connect to Google Gemini and Supabase:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase / PostgreSQL Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
DATABASE_URL=postgresql://postgres.your-project:password@aws-0-region.pooler.supabase.com:6543/postgres
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Database Setup (Supabase / PostgreSQL with `pgvector`)

To deploy with a live Supabase backend:
1. Create a project at [database.new](https://database.new) (Supabase).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open [`supabase/schema.sql`](./supabase/schema.sql), paste its contents into the editor, and click **Run**.
4. This script automatically:
   - Enables the `vector` extension (`pgvector`).
   - Creates tables: `profiles`, `courses`, `material_chunks`, `quiz_attempts`, `gap_reports`, and `revision_plans`.
   - Creates the `match_chunks` stored procedure for cosine similarity vector search.
   - Configures Row Level Security (RLS) policies.
5. Paste your `Project URL` and `Anon Key` into the application's **Settings Modal** or your `.env.local`.

---

## 🚢 Deployment to Vercel (1-Click)

1. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/abhilash-210/StudentGap-AI.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
3. Select your `StudentGap-AI` repository.
4. Next.js 16 is detected automatically.
5. (Optional) Add your `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under Environment Variables.
6. Click **Deploy**!

---

## 📄 License
Developed for educational evaluation and student knowledge empowerment. All sample course materials and question citations are crafted for academic demonstration.
