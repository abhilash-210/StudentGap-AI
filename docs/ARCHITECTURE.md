# GapFinder AI — System Architecture & Technical Specification

## 1. High-Level Architecture Overview

GapFinder AI is a proactive, role-based knowledge diagnosis and adaptive revision platform designed with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. It pairs grounded Retrieval-Augmented Generation (RAG) with multi-dimensional diagnostic evaluation algorithms, backed by **PostgreSQL & Supabase Vector (`pgvector`)** with seamless zero-config local fallback.

```mermaid
flowchart TD
    subgraph Client["Presentation & Workspaces (React 19 / Next.js 16)"]
        LP[Landing Page & Auth Modal]
        SD[Student Dashboard & Course Catalog]
        PD[Professor Management Workspace]
        DQ[Diagnostic Quiz & Citation Cards]
        GR[Diagnostic Gap Report & Danger Zones]
        RP[Adaptive Revision Plan Checklist]
        EA[RAG Explain Assistant]
    end

    subgraph API["Next.js Serverless API Layer"]
        QG[/api/diagnostic-quiz]
        EQ[/api/evaluate-quiz]
        ET[/api/explain-topic]
        GP[/api/generate-plan]
    end

    subgraph Logic["AI & Core Diagnostic Engines"]
        Chunker[Material Chunker & Tokenizer]
        Retriever[Hybrid BM25 / Vector Retriever]
        Analyzer[Diagnostic Gap Analyzer & Misconception Trap Classifier]
        Planner[Adaptive Revision Plan Generator]
        Gemini[Google Gemini 1.5 / 2.0 Flash SDK]
    end

    subgraph Persistence["Dual-Mode Data & Vector Layer"]
        Supabase[(Supabase PostgreSQL + pgvector)]
        Local[(Resilient Browser Storage & Seed Store)]
    end

    LP --> SD & PD
    SD --> DQ & GR & RP & EA
    PD -->|Inspect Roster & Reports| GR
    
    DQ --> EQ
    EA --> ET
    RP --> GP

    EQ --> Analyzer
    ET --> Retriever --> Gemini
    GP --> Planner

    Analyzer --> Supabase & Local
    Planner --> Supabase & Local
    Retriever --> Supabase & Local
```

---

## 2. Core Functional Subsystems

### 2.1 Role-Based Authentication & Workspaces
- **Landing Page**: Public entry point highlighting core capabilities, with evaluator 1-click login cards and role selectors (`Student` or `Professor`). Zero private student data or professor analytics is exposed before authentication.
- **Student Dashboard**: Shows enrolled courses, overall readiness score, weak topic alerts, recent quiz attempts, and course catalog allowing self-enrollment in additional courses.
- **Professor Workspace**: Allows assigned professors to manage courses, view the course roster, inspect individual student reports, review syllabus topics, and analyze class-level topic struggle heatmaps.

### 2.2 Grounded Retrieval-Augmented Generation (RAG) Pipeline
1. **Material Ingestion**: Parses lecture notes, syllabi, and past exam papers into semantic chunks with metadata (course ID, document name, section, page, owner, privacy status).
2. **Hybrid Search**: Chunks are indexed in Supabase `material_chunks` with `vector(768)` embeddings, queried via cosine similarity (`1 - (embedding <=> query_embedding)`). When unconfigured, a deterministic BM25/TF-IDF keyword retriever guarantees 100% offline availability.
3. **Grounded Generation**: Questions and explanations strictly ground themselves in retrieved evidence and cite exact document names, sections, and page numbers.

### 2.3 Diagnostic Gap & Misconception Evaluation Engine
Unlike generic quiz tools that record only binary percentages, GapFinder AI:
- Classifies errors as **Careless Mistakes** vs. **Identified Misconceptions** using distractor traps.
- Tracks four cognitive knowledge dimensions:
  - **Theoretical Principles** (Fundamental laws and definitions)
  - **Problem-Solving & Derivation** (Algorithms and step-by-step traces)
  - **Edge Cases & Boundary Conditions** (Corner cases, anomalies)
  - **Terminology & Vocabulary** (Technical nomenclature)
- Identifies **High-Risk Danger Zones**: Topics carrying high exam weightage ($\ge 15\%$) with low student mastery score ($< 50\%$).
- Categorizes evidence states honestly: `HIGH_EVIDENCE`, `LIMITED_EVIDENCE`, and `UNTESTED`.

### 2.4 Personalized Revision Scheduler
- Formulates a multi-day revision schedule based on time remaining until the examination and daily available study hours.
- Prioritizes topics using:
  $$\text{Priority Score} = (\text{Exam Weightage} \times 0.55) + ((100 - \text{Mastery Score}) \times 0.45)$$
- Generates structured daily themes and bite-sized actionable tasks (misconception clearing, active recall, past-paper drills).
- Supports interactive checkbox tracking and Markdown export.

---

## 3. Database & Schema Design

The production PostgreSQL database schema is defined in [supabase/schema.sql](file:///d:/AI%20PROJECTS/Hack-0n/supabase/schema.sql):

- **`profiles`**: User ID, email, full name, role (`STUDENT`, `TEACHER`, `ADMIN`), avatar URL.
- **`courses`**: Course code (`CS201`, `CS202`, `CS301`), title, description, target exam, units JSON, documents JSON.
- **`course_enrollments`**: Composite tracking of student enrollments (`user_id`, `course_id`, `status`).
- **`material_chunks`**: Source chunks, document metadata, `embedding vector(768)`, `owner_id`, `is_private`.
- **`quiz_attempts`**: Attempt timestamp, score, topic IDs, answers, and evaluated question results.
- **`gap_reports`**: Weak, medium, and strong topic summaries, readiness classification, and danger zones.
- **`revision_plans`**: Multi-day schedule and task checklist completion state.
- **Row Level Security (RLS)**: Enforces that private documents and student quiz records are readable only by their owner, while course professors access enrolled student results.
