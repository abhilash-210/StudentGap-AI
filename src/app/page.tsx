'use client';

import React, { useState, useEffect } from 'react';
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
  getBaselineReportForCourse,
  getBaselinePlanForCourse,
} from '@/lib/storage';
import { GROUNDED_QUIZ_QUESTIONS } from '@/data/sampleCourses';
import { Navbar, NavTab } from '@/components/Navbar';
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
  const [attempts, setAttempts] = useState<QuizAttemptRecord[]>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredData().attempts;
    }
    return [];
  });
  const [latestReport, setLatestReport] = useState<DiagnosticGapReport | null>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredData().latestReport;
    }
    return null;
  });
  const [revisionPlan, setRevisionPlan] = useState<RevisionPlan | null>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredData().revisionPlan;
    }
    return null;
  });
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      return loadStoredData().userProfile;
    }
    return {
      id: 'usr-demo-1',
      name: 'Alex Chen',
      email: 'student@gapfinder.ai',
      role: 'STUDENT',
      isDemoUser: true,
    };
  });

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Cross-component communication
  const [filterTopicForQuiz, setFilterTopicForQuiz] = useState<string | undefined>(undefined);
  const [initialTopicPrompt, setInitialTopicPrompt] = useState<string | undefined>(undefined);

  // Hydration & DOM synchronization
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

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  // Course switcher handler
  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    saveStoredData('ACTIVE_COURSE_ID', courseId);
    setFilterTopicForQuiz(undefined);

    const targetCourse = courses.find((c) => c.id === courseId);
    if (targetCourse) {
      const topicIds = targetCourse.units.flatMap((u) => u.topics.map((t) => t.id));
      const existingAttempt = attempts.find((a) => a.topicIds.some((id) => topicIds.includes(id)));
      if (existingAttempt && existingAttempt.gapReport) {
        setLatestReport(existingAttempt.gapReport);
      } else {
        const freshReport = getBaselineReportForCourse(targetCourse);
        const freshPlan = getBaselinePlanForCourse(targetCourse, freshReport);
        setLatestReport(freshReport);
        setRevisionPlan(freshPlan);
        saveStoredData('LATEST_GAP_REPORT', freshReport);
        saveStoredData('REVISION_PLAN', freshPlan);
      }
    }
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
    if (!activeCourse) return;

    const newReport = generateDiagnosticGapReport({
      course: activeCourse,
      evaluatedResults,
    });

    const newAttempt: QuizAttemptRecord = {
      id: `attempt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      topicIds: evaluatedResults.map((r) => r.question.topicId),
      totalQuestions: evaluatedResults.length,
      scorePercent: newReport.overallScorePercent,
      evaluatedResults,
      gapReport: newReport,
      answers,
    };

    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    setLatestReport(newReport);

    // Automatically update revision plan with new gaps
    const updatedPlan = generateAdaptiveRevisionPlanLocal({
      gapReport: newReport,
      timeframeDays: revisionPlan?.timeframeDays || 3,
      dailyHours: revisionPlan?.dailyHoursAvailable || 2.5,
      courseTitle: activeCourse.title,
    });
    setRevisionPlan(updatedPlan);

    // Save to storage
    saveStoredData('QUIZ_ATTEMPTS', updatedAttempts);
    saveStoredData('LATEST_GAP_REPORT', newReport);
    saveStoredData('REVISION_PLAN', updatedPlan);

    // Sync to Supabase PostgreSQL when configured
    if (isSupabaseConfigured()) {
      saveQuizAttemptToSupabase(newAttempt, activeCourse.id);
      saveGapReportToSupabase(newReport, activeCourse.id);
      saveRevisionPlanToSupabase(updatedPlan, activeCourse.id);
    }
  };

  // Plan regeneration handler
  const handleRegeneratePlan = (timeframeDays: number, dailyHours: number) => {
    if (!latestReport || !activeCourse) return;

    const newPlan = generateAdaptiveRevisionPlanLocal({
      gapReport: latestReport,
      timeframeDays,
      dailyHours,
      courseTitle: activeCourse.title,
    });

    setRevisionPlan(newPlan);
    saveStoredData('REVISION_PLAN', newPlan);
    if (isSupabaseConfigured()) {
      saveRevisionPlanToSupabase(newPlan, activeCourse.id);
    }
  };

  // Plan update handler (e.g., when tasks are checked)
  const handleUpdatePlan = (updatedPlan: RevisionPlan) => {
    setRevisionPlan(updatedPlan);
    saveStoredData('REVISION_PLAN', updatedPlan);
    if (isSupabaseConfigured() && activeCourse) {
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
    if (!activeCourse) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: documentName,
      type: documentType,
      uploadedAt: new Date().toISOString().split('T')[0],
      sizeKb: Math.round(rawText.length / 1024) || 12,
      chunkCount: newChunks.length,
    };

    const updatedCourse: CourseMaterial = {
      ...activeCourse,
      documents: [newDoc, ...activeCourse.documents],
      chunks: [...activeCourse.chunks, ...newChunks],
    };

    const updatedCourses = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    setCourses(updatedCourses);
    saveStoredData('COURSES', updatedCourses);
    if (isSupabaseConfigured()) {
      syncCourseToSupabase(updatedCourse);
    }
  };

  if (!isMounted || !activeCourse || !latestReport || !revisionPlan) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold">Initializing GapFinder AI Platform...</p>
        </div>
      </div>
    );
  }

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
        courses={courses}
        activeCourseId={activeCourseId}
        setActiveCourseId={handleSelectCourse}
        user={user}
        setUser={setUser}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <StudentDashboard
            course={activeCourse}
            report={latestReport}
            plan={revisionPlan}
            attempts={attempts}
            user={user}
            onNavigateTab={setActiveTab}
            onSelectTopicForQuiz={handleSelectTopicForQuiz}
            onSelectTopicForExplain={handleSelectTopicForExplain}
          />
        )}

        {activeTab === 'gap-report' && (
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

        {activeTab === 'revision-plan' && (
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

        {activeTab === 'progress' && (
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">StudentGap AI</span>
            <span>• Intelligent Knowledge Diagnosis & Personalized Revision Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Grounded RAG Active
            </span>
            <span>•</span>
            <span>Misconception Detection</span>
            <span>•</span>
            <span>Adaptive Planner</span>
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
        onSetUser={setUser}
      />
    </div>
  );
}
