'use client';

import React from 'react';
import { CourseMaterial, UserProfile } from '@/types';
import {
  Compass,
  FileText,
  BrainCircuit,
  BarChart3,
  CalendarCheck2,
  Sparkles,
  Key,
  User,
  GraduationCap,
  Upload,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'topic-map' | 'diagnostic-quiz' | 'gap-report' | 'revision-plan' | 'explain-assistant' | 'progress';
  setActiveTab: (tab: 'topic-map' | 'diagnostic-quiz' | 'gap-report' | 'revision-plan' | 'explain-assistant' | 'progress') => void;
  courses: CourseMaterial[];
  activeCourseId: string;
  setActiveCourseId: (id: string) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  courses,
  activeCourseId,
  setActiveCourseId,
  user,
  setUser,
  onOpenUpload,
  onOpenSettings,
  onOpenAuth,
}) => {
  const currentCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Top Bar with Demo Indicator & Course Switcher */}
      <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-slate-800/60 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Placement Drive Demo Evaluation:</span>
          <span className="font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            Preloaded Syllabus & RAG Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => setUser({ ...user, role: 'STUDENT' })}
              className={`px-2 py-1 rounded text-xs font-medium transition ${
                user.role === 'STUDENT'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => setUser({ ...user, role: 'TEACHER' })}
              className={`px-2 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                user.role === 'TEACHER'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Teacher Analytics
            </button>
          </div>

          {/* Quick API Key Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded border border-slate-700/60 transition"
            title="Configure Gemini API Key"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>AI Config</span>
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded border border-slate-700/60 transition"
          >
            <User className="w-3 h-3 text-indigo-400" />
            <span className="font-medium">{user.name}</span>
            <span className="text-slate-500 text-[10px]">({user.isDemoUser ? 'Demo' : 'Auth'})</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('gap-report')}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">GapFinder</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Diagnostic Knowledge Engine</p>
              </div>
            </div>

            {/* Course Selector Dropdown */}
            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-800">
              <label htmlFor="course-select" className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Course:
              </label>
              <select
                id="course-select"
                value={activeCourseId}
                onChange={(e) => setActiveCourseId(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code}: {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('gap-report')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'gap-report'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-rose-400" />
              <span>Gap Diagnosis</span>
            </button>

            <button
              onClick={() => setActiveTab('topic-map')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'topic-map'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Topic Map</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostic-quiz')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'diagnostic-quiz'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('revision-plan')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'revision-plan'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4 text-purple-400" />
              <span>Revision Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('explain-assistant')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'explain-assistant'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explain Topic</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'progress'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Analytics</span>
            </button>

            {/* Upload Material Button */}
            <button
              onClick={onOpenUpload}
              className="ml-2 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition"
              title="Upload syllabus, notes, or past papers"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Upload Material</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
