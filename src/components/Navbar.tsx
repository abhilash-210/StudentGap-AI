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

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'gap-report' as const, label: 'Gap Diagnosis', icon: BarChart3, color: 'text-rose-600 dark:text-rose-400' },
    { id: 'topic-map' as const, label: 'Topic Map', icon: Compass, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'diagnostic-quiz' as const, label: 'Diagnostic Quiz', icon: BrainCircuit, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'revision-plan' as const, label: 'Revision Plan', icon: CalendarCheck2, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'explain-assistant' as const, label: 'Explain Topic', icon: Sparkles, color: 'text-amber-500' },
    { id: 'progress' as const, label: 'Analytics', icon: FileText, color: 'text-cyan-600 dark:text-cyan-400' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      {/* Top Banner with Demo Mode & Controls */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 text-xs border-b border-slate-200/80 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Evaluation Demo:</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded text-[11px]">
            Preloaded Syllabus & RAG Active
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-0">
          {/* Light / Dark Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-300 dark:border-slate-700/60">
            <button
              onClick={() => setUser({ ...user, role: 'STUDENT' })}
              className={`px-2 py-1 rounded text-xs font-semibold transition ${
                user.role === 'STUDENT'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Student View
            </button>
            <button
              onClick={() => setUser({ ...user, role: 'TEACHER' })}
              className={`px-2 py-1 rounded text-xs font-semibold transition flex items-center gap-1 ${
                user.role === 'TEACHER'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Teacher Analytics
            </button>
          </div>

          {/* Quick API Key Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition"
            title="Configure Gemini API Key"
          >
            <Key className="w-3 h-3 text-amber-500" />
            <span className="hidden sm:inline">AI Config</span>
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition"
          >
            <User className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-[11px] truncate max-w-[100px] sm:max-w-none">
              {user.name}
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    GapFinder
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Diagnostic Knowledge Engine
                </p>
              </div>
            </div>

            {/* Course Selector Dropdown */}
            <div className="hidden lg:flex items-center ml-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <label htmlFor="course-select-nav" className="text-xs text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Course:
              </label>
              <select
                id="course-select-nav"
                value={activeCourseId}
                onChange={(e) => setActiveCourseId(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code}: {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Upload Material Button */}
            <button
              onClick={onOpenUpload}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition"
              title="Upload syllabus, notes, or past papers"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Upload Material</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              title="Upload Material"
            >
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <div className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
              <label htmlFor="course-select-mobile" className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                Select Course:
              </label>
              <select
                id="course-select-mobile"
                value={activeCourseId}
                onChange={(e) => {
                  setActiveCourseId(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 p-2"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code}: {course.title}
                  </option>
                ))}
              </select>
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
