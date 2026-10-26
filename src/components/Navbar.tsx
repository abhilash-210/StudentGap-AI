'use client';

import React, { useState } from 'react';
import { CourseMaterial, UserProfile } from '@/types';
import {
  LayoutDashboard,
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
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'gap-report'
  | 'topic-map'
  | 'diagnostic-quiz'
  | 'revision-plan'
  | 'explain-assistant'
  | 'progress';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  courses: CourseMaterial[];
  activeCourseId: string;
  setActiveCourseId: (id: string) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
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
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logical evaluator & student workflow: Dashboard -> Quiz (Step 1) -> Gaps (Step 2) -> Revision Plan (Step 3) -> Topic Map -> AI Tutor -> Analytics
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-indigo-600 dark:text-indigo-400',
      step: null,
    },
    {
      id: 'diagnostic-quiz' as const,
      label: 'Diagnostic Quiz',
      icon: BrainCircuit,
      color: 'text-emerald-600 dark:text-emerald-400',
      step: '1',
    },
    {
      id: 'gap-report' as const,
      label: 'Gap Report',
      icon: BarChart3,
      color: 'text-rose-600 dark:text-rose-400',
      step: '2',
    },
    {
      id: 'revision-plan' as const,
      label: 'Revision Plan',
      icon: CalendarCheck2,
      color: 'text-purple-600 dark:text-purple-400',
      step: '3',
    },
    {
      id: 'topic-map' as const,
      label: 'Topic Map',
      icon: Compass,
      color: 'text-blue-600 dark:text-blue-400',
      step: null,
    },
    {
      id: 'explain-assistant' as const,
      label: 'AI Tutor',
      icon: Sparkles,
      color: 'text-amber-500',
      step: null,
    },
    {
      id: 'progress' as const,
      label: 'Analytics',
      icon: FileText,
      color: 'text-cyan-600 dark:text-cyan-400',
      step: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200 shadow-xs">
      {/* Top Header Bar: Brand, Course Selector, and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between gap-4">
          {/* Brand + Course Switcher */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  StudentGap
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  AI
                </span>
              </div>
            </div>

            {/* Course Selector Dropdown */}
            <div className="hidden sm:flex items-center pl-4 border-l border-slate-200 dark:border-slate-800 min-w-0">
              <label
                htmlFor="course-select-nav"
                className="text-xs text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1.5 font-medium shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Course:</span>
              </label>
              <select
                id="course-select-nav"
                value={activeCourseId}
                onChange={(e) => setActiveCourseId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer max-w-[200px] md:max-w-[300px] lg:max-w-[360px] truncate"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code}: {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Tools & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Upload Material CTA */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition"
              title="Upload syllabus, lecture notes, or past papers"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Upload Material</span>
            </button>

            {/* Role Switcher: Student vs Teacher */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setUser({ ...user, role: 'STUDENT' })}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  user.role === 'STUDENT'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setUser({ ...user, role: 'TEACHER' })}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition flex items-center gap-1 ${
                  user.role === 'TEACHER'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Teacher</span>
              </button>
            </div>

            {/* AI Config */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1"
              title="Configure Gemini AI Key & Settings"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-medium hidden lg:inline">AI Config</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>

            {/* User Profile */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 transition text-xs font-semibold"
            >
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="max-w-[85px] sm:max-w-none truncate">{user.name}</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:hidden rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Course Switcher */}
        <div className="sm:hidden mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <select
            value={activeCourseId}
            onChange={(e) => setActiveCourseId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 p-1.5 truncate"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code}: {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workflow Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                  {item.step && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      Step {item.step}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* RAG Status Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
              Grounded RAG Diagnostics Active
            </span>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Role View</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setUser({ ...user, role: 'STUDENT' })}
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    user.role === 'STUDENT' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => setUser({ ...user, role: 'TEACHER' })}
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    user.role === 'TEACHER' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Teacher
                </button>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.step && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Step {item.step}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
