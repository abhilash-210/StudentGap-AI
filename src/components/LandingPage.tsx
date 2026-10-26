'use client';

import React from 'react';
import { UserProfile } from '@/types';
import {
  BrainCircuit,
  BarChart3,
  CalendarCheck2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';
import {
  DEMO_PROFESSOR,
  DEMO_STUDENT_ALEX,
  DEMO_STUDENT_PRIYA,
} from '@/lib/storage';

interface LandingPageProps {
  onSelectUser: (user: UserProfile) => void;
  onOpenAuth: (defaultRole?: 'STUDENT' | 'TEACHER', defaultTab?: 'LOGIN' | 'REGISTER') => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectUser,
  onOpenAuth,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                GapFinder
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}
            <button
              onClick={() => onOpenAuth('STUDENT', 'LOGIN')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-lg transition"
            >
              Log In
            </button>
            <button
              onClick={() => onOpenAuth('STUDENT', 'REGISTER')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Proactive Knowledge Diagnosis Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Find What You Don&apos;t Know.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500">
              Fix It Before Your Exam.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-6 max-w-2xl mx-auto leading-relaxed font-normal">
            GapFinder AI analyzes your course materials, identifies your weak topics, and builds a personalized revision plan to help you study smarter.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              onClick={() => onOpenAuth('STUDENT', 'LOGIN')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <span>Continue as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuth('TEACHER', 'LOGIN')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs transition flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Continue as Professor</span>
            </button>
          </div>

          {/* 1-Click Evaluator Demonstration Logins */}
          <div className="mt-14 max-w-4xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Evaluator Fast-Track • 1-Click Instant Demo Access
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Pre-configured Accounts with Seeded Assessment Data
                </h3>
              </div>
              <span className="text-xs text-slate-500">Zero setup required</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Professor Card */}
              <div
                onClick={() => onSelectUser(DEMO_PROFESSOR)}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      Professor
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition">
                      1-Click &rarr;
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Dr. Sarah Williams
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    prof.sarah@gapfinder.demo
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    Manages 3 Courses: <strong>OS, DBMS, ML</strong> with cohort struggle heatmaps & student roster.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 font-mono">
                  Password: Professor@123
                </div>
              </div>

              {/* Student 1 Card */}
              <div
                onClick={() => onSelectUser(DEMO_STUDENT_ALEX)}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Student 1
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition">
                      1-Click &rarr;
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Alex Chen
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    alex.chen@gapfinder.demo
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    Enrolled in: <strong>CS201 (OS) &amp; CS202 (DBMS)</strong>. Weakness: Deadlocks &amp; Normalization.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 font-mono">
                  Password: Student@123
                </div>
              </div>

              {/* Student 2 Card */}
              <div
                onClick={() => onSelectUser(DEMO_STUDENT_PRIYA)}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-teal-50/40 dark:hover:bg-teal-950/30 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      Student 2
                    </span>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold group-hover:translate-x-0.5 transition">
                      1-Click &rarr;
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Priya Sharma
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    priya.sharma@gapfinder.demo
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    Enrolled in: <strong>CS201 (OS) &amp; CS301 (ML)</strong>. Weakness: Thrashing &amp; Regularization.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 font-mono">
                  Password: Student@123
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-slate-900/50 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How GapFinder AI Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              A 3-step structured learning cycle designed to expose hidden blindspots before exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload or Select Course
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Connect your syllabus, lecture notes, and past question papers. GapFinder chunks and indexes materials with source chapter and page metadata.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Take Grounded Diagnostic Quizzes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Answer questions grounded in your course materials. Every distractor is modeled around known cognitive flaws to pinpoint your exact misconceptions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Execute Targeted Revision Plan
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Get an adaptive, time-budgeted study schedule prioritizing high-weightage weak topics. Re-test to track your gaps shrinking towards exam day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Academic-Grade Intelligent Architecture
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Engineered with strict separation between deterministic retrieval and bounded generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <BookOpen className="w-6 h-6 text-indigo-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Grounded RAG Citations</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Zero hallucination. Every explanation and question cites the exact document title, section, and page number.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <BarChart3 className="w-6 h-6 text-rose-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Misconception Detection</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Distinguishes between lack of practice and deep conceptual flaws like equating unsafe state with deadlock.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <CalendarCheck2 className="w-6 h-6 text-purple-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Adaptive Revision Engine</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Synthesizes available hours and days until exam into an actionable daily task checklist.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <GraduationCap className="w-6 h-6 text-cyan-600 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Professor Cohort Analytics</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Course management workspaces, student enrollment rosters, and aggregated misconception heatmaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">GapFinder AI</span>
            <span>&bull; Intelligent Knowledge Diagnosis &amp; Adaptive Revision Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <span>CS201 Operating Systems</span>
            <span>&bull;</span>
            <span>CS202 DBMS</span>
            <span>&bull;</span>
            <span>CS301 Machine Learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
