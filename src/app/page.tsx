'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CourseMaterial,
  QuizAttemptRecord,
  DiagnosticGapReport,
  RevisionPlan,
  UserProfile,
  MaterialChunk,
  EvaluatedQuestionResult,
  StudentAnswer,
} from '@/types';
import {
  loadStoredData,
  saveStoredData,
  getUserEnrollments,
  enrollStudentInCourse,
  getEnrolledCoursesForUser,
  getUserQuizAttempts,
  saveUserQuizAttempt,
  getUserRevisionPlan,
  saveUserRevisionPlan,
  getBaselineAttemptForUserAndCourse,
  DEMO_STUDENT_ALEX,
} from '@/lib/storage';
import { GROUNDED_QUIZ_QUESTIONS } from '@/data/sampleCourses';
import { Navbar, NavTab } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { ProfessorDashboard } from '@/components/ProfessorDashboard';
import { StudentDashboard } from '@/components/StudentDashboard';
import { TopicMap } from '@/components/TopicMap';
import { DiagnosticQuiz } from '@/components/DiagnosticQuiz';
import { GapReportView } from '@/components/GapReportView';
import { RevisionPlanView } from '@/components/RevisionPlanView';
import { ExplainAssistant } from '@/components/ExplainAssistant';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { MaterialUploadModal } from '@/components/MaterialUploadModal';
import { SettingsModal } from '@/components/SettingsModal';
import { AuthModal } from '@/components/AuthModal';
import { generateAdaptiveRevisionPlanLocal } from '@/lib/gemini';
import { generateDiagnosticGapReport } from '@/lib/gapAnalyzer';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  saveQuizAttemptToSupabase,
  saveGapReportToSupabase,
  saveRevisionPlanToSupabase,
  syncCourseToSupabase,
} from '@/lib/supabaseDb';

const emptySubscribe = () => () => {};

export default function HomePage() {
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('gapfinder_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  // User state (null represents logged-out / Landing Page view)
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gapfinder_user_profile');
      if (stored) return JSON.parse(stored);
      return DEMO_STUDENT_ALEX;
    }
    return DEMO_STUDENT_ALEX;
  });

  const [courses, setCourses] = useState<CourseMaterial[]>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredData().courses;
    }
    return [];
  });

  const [activeCourseId, setActiveCourseId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredData().activeCourseId;
    }
    return 'cs201-os';
  });

  // State update counter for refreshing derived user quiz/plan/enrollment data
  const [dataVersion, setDataVersion] = useState(0);

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [authDefaultTab, setAuthDefaultTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Cross-component communication
  const [filterTopicForQuiz, setFilterTopicForQuiz] = useState<string | undefined>(undefined);
  const [initialTopicPrompt, setInitialTopicPrompt] = useState<string | undefined>(undefined);

  // Theme synchronization with DOM
  useEffect(() => {
    const storedTheme = (localStorage.getItem('gapfinder_theme') as 'light' | 'dark') || 'light';
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('gapfinder_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Pure derived state computations
  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === activeCourseId) || courses[0];
  }, [courses, activeCourseId]);

  const enrolledCourseIds = useMemo(() => {
    if (!user) return [];
    return getUserEnrollments(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dataVersion]);

  const attempts = useMemo(() => {
    if (!user || !activeCourse) return [];
    return getUserQuizAttempts(user.id, activeCourse.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeCourse, dataVersion]);

  const latestReport = useMemo<DiagnosticGapReport | null>(() => {
    if (!user || !activeCourse) return null;
    const latestAttempt = attempts[0] || getBaselineAttemptForUserAndCourse(user.id, activeCourse);
    return latestAttempt?.gapReport || null;
  }, [user, activeCourse, attempts]);

  const revisionPlan = useMemo<RevisionPlan | null>(() => {
    if (!user || !activeCourse || !latestReport) return null;
    return getUserRevisionPlan(user.id, activeCourse.id, activeCourse, latestReport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeCourse, latestReport, dataVersion]);

  // User Switcher handler
  const handleSelectUser = (selectedUser: UserProfile) => {
    setUser(selectedUser);
    saveStoredData('USER_PROFILE', selectedUser);

    const userEnrollments = getUserEnrollments(selectedUser.id);
    const newCourseId = (userEnrollments.includes(activeCourseId) || selectedUser.role === 'TEACHER')
      ? activeCourseId
      : userEnrollments[0] || 'cs201-os';

    setActiveCourseId(newCourseId);
    setDataVersion((v) => v + 1);
  };

  // Course switcher handler
  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    saveStoredData('ACTIVE_COURSE_ID', courseId);
    setFilterTopicForQuiz(undefined);
  };

  // Student Course Enrollment handler
  const handleEnrollCourse = (courseId: string) => {
    if (!user) return;
    enrollStudentInCourse(user.id, courseId);
    handleSelectCourse(courseId);
    setDataVersion((v) => v + 1);
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gapfinder_user_profile');
    }
  };

  // Open Auth with specific pre-selections
  const handleOpenAuth = (role: 'STUDENT' | 'TEACHER' = 'STUDENT', tab: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    setAuthDefaultRole(role);
    setAuthDefaultTab(tab);
    setIsAuthOpen(true);
  };

  // Topic map triggers
  const handleSelectTopicForQuiz = (topicId: string) => {
    setFilterTopicForQuiz(topicId);
    setActiveTab('diagnostic-quiz');
  };

  const handleSelectTopicForExplain = (topicTitle: string) => {
    setInitialTopicPrompt(topicTitle);
    setActiveTab('explain-assistant');
  };

  // Quiz completion handler
  const handleCompleteQuiz = (
    evaluatedResults: EvaluatedQuestionResult[],
    answers: StudentAnswer[]
  ) => {
    if (!activeCourse || !user) return;

    const newReport = generateDiagnosticGapReport({
      course: activeCourse,
      evaluatedResults,
    });

    const newAttempt: QuizAttemptRecord = {
      id: `attempt-${user.id}-${Date.now()}`,
      userId: user.id,
      courseId: activeCourse.id,
      timestamp: new Date().toISOString(),
      topicIds: evaluatedResults.map((r) => r.question.topicId),
      totalQuestions: evaluatedResults.length,
      scorePercent: newReport.overallScorePercent,
      evaluatedResults,
      gapReport: newReport,
      answers,
    };

    saveUserQuizAttempt(user.id, newAttempt);

    // Automatically update revision plan with new gaps
    const updatedPlan = generateAdaptiveRevisionPlanLocal({
      gapReport: newReport,
      timeframeDays: revisionPlan?.timeframeDays || 3,
      dailyHours: revisionPlan?.dailyHoursAvailable || 2.5,
      courseTitle: activeCourse.title,
    });
    saveUserRevisionPlan(user.id, activeCourse.id, updatedPlan);
    setDataVersion((v) => v + 1);

    // Sync to Supabase PostgreSQL when configured
    if (isSupabaseConfigured()) {
      saveQuizAttemptToSupabase(newAttempt, activeCourse.id);
      saveGapReportToSupabase(newReport, activeCourse.id);
      saveRevisionPlanToSupabase(updatedPlan, activeCourse.id);
    }
  };

  // Plan regeneration handler
  const handleRegeneratePlan = (timeframeDays: number, dailyHours: number) => {
    if (!latestReport || !activeCourse || !user) return;

    const newPlan = generateAdaptiveRevisionPlanLocal({
      gapReport: latestReport,
      timeframeDays,
      dailyHours,
      courseTitle: activeCourse.title,
    });

    saveUserRevisionPlan(user.id, activeCourse.id, newPlan);
    setDataVersion((v) => v + 1);
    if (isSupabaseConfigured()) {
      saveRevisionPlanToSupabase(newPlan, activeCourse.id);
    }
  };

  // Plan update handler (when student ticks tasks)
  const handleUpdatePlan = (updatedPlan: RevisionPlan) => {
    if (!user || !activeCourse) return;
    saveUserRevisionPlan(user.id, activeCourse.id, updatedPlan);
    setDataVersion((v) => v + 1);
    if (isSupabaseConfigured()) {
      saveRevisionPlanToSupabase(updatedPlan, activeCourse.id);
    }
  };

  // Material upload ingestion handler
  const handleAddMaterial = (
    documentName: string,
    documentType: 'syllabus' | 'notes' | 'textbook' | 'past_paper',
    rawText: string,
    newChunks: MaterialChunk[]
  ) => {
    if (!activeCourse || !user) return;

    const isPrivate = user.role === 'STUDENT';
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: documentName,
      type: documentType,
      uploadedAt: new Date().toISOString().split('T')[0],
      sizeKb: Math.round(rawText.length / 1024) || 12,
      chunkCount: newChunks.length,
      ownerId: user.id,
      isPrivate,
    };

    const taggedChunks = newChunks.map((c) => ({
      ...c,
      ownerId: user.id,
      isPrivate,
    }));

    const updatedCourse: CourseMaterial = {
      ...activeCourse,
      documents: [newDoc, ...activeCourse.documents],
      chunks: [...activeCourse.chunks, ...taggedChunks],
    };

    const updatedCourses = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    setCourses(updatedCourses);
    saveStoredData('COURSES', updatedCourses);
    if (isSupabaseConfigured()) {
      syncCourseToSupabase(updatedCourse);
    }
  };

  // Loading state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold">Initializing GapFinder AI Platform...</p>
        </div>
      </div>
    );
  }

  // 1. LANDING PAGE VIEW (When not logged in)
  if (!user) {
    return (
      <>
        <LandingPage
          onSelectUser={handleSelectUser}
          onOpenAuth={handleOpenAuth}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          currentUser={user}
          onSetUser={handleSelectUser}
          defaultRole={authDefaultRole}
          defaultTab={authDefaultTab}
        />
      </>
    );
  }

  // Filter courses visible to user
  const visibleCourses = getEnrolledCoursesForUser(user, courses);

  // Quiz questions selection
  let questionsToUse = GROUNDED_QUIZ_QUESTIONS[activeCourse.id] || GROUNDED_QUIZ_QUESTIONS['cs201-os'] || [];
  if (filterTopicForQuiz) {
    const filtered = questionsToUse.filter((q) => q.topicId === filterTopicForQuiz);
    if (filtered.length > 0) questionsToUse = filtered;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        courses={user.role === 'TEACHER' ? courses : visibleCourses}
        activeCourseId={activeCourseId}
        setActiveCourseId={handleSelectCourse}
        user={user}
        setUser={setUser}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2. PROFESSOR WORKSPACE */}
        {user.role === 'TEACHER' ? (
          <ProfessorDashboard
            user={user}
            courses={courses}
            activeCourseId={activeCourseId}
            onSelectCourse={handleSelectCourse}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        ) : (
          /* 3. STUDENT WORKSPACE */
          <>
            {activeTab === 'dashboard' && latestReport && revisionPlan && (
              <StudentDashboard
                course={activeCourse}
                report={latestReport}
                plan={revisionPlan}
                attempts={attempts}
                user={user}
                allCourses={courses}
                enrolledCourseIds={enrolledCourseIds}
                onSelectCourse={handleSelectCourse}
                onEnrollCourse={handleEnrollCourse}
                onNavigateTab={setActiveTab}
                onSelectTopicForQuiz={handleSelectTopicForQuiz}
                onSelectTopicForExplain={handleSelectTopicForExplain}
              />
            )}

            {activeTab === 'gap-report' && latestReport && (
              <GapReportView
                report={latestReport}
                onGeneratePlan={() => setActiveTab('revision-plan')}
                onRetakeQuiz={() => {
                  setFilterTopicForQuiz(undefined);
                  setActiveTab('diagnostic-quiz');
                }}
                onSelectTopicForExplain={handleSelectTopicForExplain}
              />
            )}

            {activeTab === 'topic-map' && (
              <TopicMap
                course={activeCourse}
                onSelectTopicForQuiz={handleSelectTopicForQuiz}
                onSelectTopicForExplain={handleSelectTopicForExplain}
              />
            )}

            {activeTab === 'diagnostic-quiz' && (
              <DiagnosticQuiz
                questions={questionsToUse}
                onCompleteQuiz={handleCompleteQuiz}
                onNavigateToReport={() => setActiveTab('gap-report')}
                onSelectTopicForExplain={handleSelectTopicForExplain}
              />
            )}

            {activeTab === 'revision-plan' && revisionPlan && latestReport && (
              <RevisionPlanView
                plan={revisionPlan}
                gapReport={latestReport}
                onUpdatePlan={handleUpdatePlan}
                onRegeneratePlan={handleRegeneratePlan}
                onSelectTopicForExplain={handleSelectTopicForExplain}
              />
            )}

            {activeTab === 'explain-assistant' && (
              <ExplainAssistant
                course={activeCourse}
                initialTopicPrompt={initialTopicPrompt}
                onClearInitialTopicPrompt={() => setInitialTopicPrompt(undefined)}
                onNavigateToQuiz={() => {
                  setFilterTopicForQuiz(undefined);
                  setActiveTab('diagnostic-quiz');
                }}
              />
            )}

            {activeTab === 'progress' && latestReport && (
              <ProgressDashboard
                attempts={attempts}
                latestReport={latestReport}
                course={activeCourse}
                user={user}
                onRetakeQuiz={() => {
                  setFilterTopicForQuiz(undefined);
                  setActiveTab('diagnostic-quiz');
                }}
                onNavigateToPlan={() => setActiveTab('revision-plan')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">GapFinder AI</span>
            <span>• Proactive Knowledge Gap Diagnosis &amp; Adaptive Revision Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Grounded RAG Active
            </span>
            <span>•</span>
            <span>Misconception Detection</span>
            <span>•</span>
            <span>Multi-Course Architecture</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MaterialUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddMaterial={handleAddMaterial}
        course={activeCourse}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onSetUser={handleSelectUser}
        defaultRole={authDefaultRole}
        defaultTab={authDefaultTab}
      />
    </div>
  );
}
