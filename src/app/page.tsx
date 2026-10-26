'use client';

import React, { useState, useEffect } from 'react';
import {
  CourseMaterial,
  QuizAttemptRecord,
  DiagnosticGapReport,
  RevisionPlan,
  UserProfile,
  MaterialChunk,
  QuizQuestion,
  EvaluatedQuestionResult,
  StudentAnswer,
} from '@/types';
import { loadStoredData, saveStoredData } from '@/lib/storage';
import { GROUNDED_QUIZ_QUESTIONS } from '@/data/sampleCourses';
import { Navbar } from '@/components/Navbar';
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

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'gap-report' | 'topic-map' | 'diagnostic-quiz' | 'revision-plan' | 'explain-assistant' | 'progress'
  >('gap-report');

  const [courses, setCourses] = useState<CourseMaterial[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string>('cs201-os');
  const [attempts, setAttempts] = useState<QuizAttemptRecord[]>([]);
  const [latestReport, setLatestReport] = useState<DiagnosticGapReport | null>(null);
  const [revisionPlan, setRevisionPlan] = useState<RevisionPlan | null>(null);
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-demo-1',
    name: 'Alex Chen',
    email: 'student@gapfinder.ai',
    role: 'STUDENT',
    isDemoUser: true,
  });

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Cross-component communication
  const [filterTopicForQuiz, setFilterTopicForQuiz] = useState<string | undefined>(undefined);
  const [initialTopicPrompt, setInitialTopicPrompt] = useState<string | undefined>(undefined);

  // Hydration & Initial data load
  useEffect(() => {
    const data = loadStoredData();
    setCourses(data.courses);
    setActiveCourseId(data.activeCourseId);
    setAttempts(data.attempts);
    setLatestReport(data.latestReport);
    setRevisionPlan(data.revisionPlan);
    setUser(data.userProfile);
    setMounted(true);
  }, []);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  // Course switcher handler
  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    saveStoredData('ACTIVE_COURSE_ID', courseId);
    setFilterTopicForQuiz(undefined);
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
  };

  // Plan update handler (e.g., when tasks are checked)
  const handleUpdatePlan = (updatedPlan: RevisionPlan) => {
    setRevisionPlan(updatedPlan);
    saveStoredData('REVISION_PLAN', updatedPlan);
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
  };

  if (!mounted || !activeCourse || !latestReport || !revisionPlan) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium">Initializing GapFinder AI Knowledge Base...</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">GapFinder AI</span>
            <span>• Built for Placement Drive Submission</span>
            <span>• Next.js App Router & TypeScript</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Retrieval-Augmented Generation (RAG)</span>
            <span>•</span>
            <span>Grounded Citations</span>
            <span>•</span>
            <span>Adaptive Revision</span>
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
