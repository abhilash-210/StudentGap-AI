'use client';

import React from 'react';
import {
  CourseMaterial,
  DiagnosticGapReport,
  RevisionPlan,
  QuizAttemptRecord,
  UserProfile,
} from '@/types';
import {
  Compass,
  BrainCircuit,
  BarChart3,
  CalendarCheck2,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';

interface StudentDashboardProps {
  course: CourseMaterial;
  report: DiagnosticGapReport;
  plan: RevisionPlan;
  attempts: QuizAttemptRecord[];
  user: UserProfile;
  onNavigateTab: (
    tab: 'dashboard' | 'gap-report' | 'topic-map' | 'diagnostic-quiz' | 'revision-plan' | 'explain-assistant' | 'progress'
  ) => void;
  onSelectTopicForQuiz: (topicId: string) => void;
  onSelectTopicForExplain: (topicTitle: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  course,
  report,
  plan,
  attempts,
  user,
  onNavigateTab,
  onSelectTopicForQuiz,
  onSelectTopicForExplain,
}) => {
  const hasAttempts = attempts.length > 0 && report.hasSufficientEvidence;
  const latestAttempt = attempts[0];

  // Calculate pending revision tasks
  const allTasks = plan.schedules.flatMap((s) => s.tasks);
  const nextPendingTask = allTasks.find((t) => !t.completed);

  type TargetTab = 'dashboard' | 'gap-report' | 'topic-map' | 'diagnostic-quiz' | 'revision-plan' | 'explain-assistant' | 'progress';

  // Recommended next action derived from real application data
  let nextAction: {
    title: string;
    description: string;
    buttonLabel: string;
    targetTab: TargetTab;
    topicId?: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  } = {
    title: 'Complete Baseline Diagnostic Quiz',
    description: `Take a targeted assessment to identify your knowledge gaps and misconceptions in ${course.code}.`,
    buttonLabel: 'Launch Diagnostic Quiz',
    targetTab: 'diagnostic-quiz',
    topicId: undefined,
    badge: 'Step 1 • Discover Gaps',
    icon: BrainCircuit,
    color: 'indigo',
  };

  if (report.weakTopics.length > 0) {
    const highestPriorityWeak = report.weakTopics.reduce((prev, curr) =>
      curr.examWeightagePercent > prev.examWeightagePercent ? curr : prev
    );
    nextAction = {
      title: `Priority Gap: ${highestPriorityWeak.topicTitle}`,
      description: `${highestPriorityWeak.examWeightagePercent}% Exam Weightage • Root Misconception: ${highestPriorityWeak.primaryReason}`,
      buttonLabel: 'Review & Practice Topic',
      targetTab: 'diagnostic-quiz' as const,
      topicId: highestPriorityWeak.topicId,
      badge: 'High-Impact Priority',
      icon: AlertTriangle,
      color: 'rose',
    };
  } else if (nextPendingTask) {
    nextAction = {
      title: `Day ${nextPendingTask.dayNumber} Task: ${nextPendingTask.title}`,
      description: `${nextPendingTask.durationMinutes} mins target • Focus: ${nextPendingTask.instruction}`,
      buttonLabel: 'Open Revision Plan',
      targetTab: 'revision-plan' as const,
      topicId: undefined,
      badge: 'Active Study Sprint',
      icon: CalendarCheck2,
      color: 'purple',
    };
  }

  return (
    <div className="space-y-6 w-full">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                Active Course: {course.code}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                • Target: {course.targetExam}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user.name}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Intelligent syllabus gap analysis, root-cause misconception detection, and personalized revision schedules for <strong className="text-slate-900 dark:text-white font-semibold">{course.title}</strong>.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('diagnostic-quiz')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Take Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => onNavigateTab('explain-assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evaluator Interactive Workflow Stepper */}
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Evaluator Quickstart • 3-Step Diagnostic Workflow
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Click any step to inspect live system state
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div
            onClick={() => onNavigateTab('diagnostic-quiz')}
            className="cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-sm transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Step 1 • Diagnostic Test
                </span>
                <BrainCircuit className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Take Grounded Quiz
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                Test concepts against uploaded materials. Questions target classic student misconceptions, not trivial recall.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition">
              <span>Launch Quiz</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigateTab('gap-report')}
            className="cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-400 hover:shadow-sm transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                  Step 2 • Misconception Analysis
                </span>
                <BarChart3 className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Inspect Diagnosed Gaps
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                View root-cause misconceptions detected with citation snippets, exam weightage, and high-confidence errors.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 group-hover:translate-x-0.5 transition">
              <span>View Gap Report</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigateTab('revision-plan')}
            className="cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-sm transition group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                  Step 3 • Targeted Revision
                </span>
                <CalendarCheck2 className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Follow Adaptive Plan
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                Follow an automated daily schedule allocating study time directly to diagnosed weak topics with task tracking.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-0.5 transition">
              <span>Open Daily Plan</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Next Action Callout */}
      <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-rose-950/30 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <Zap className="w-3.5 h-3.5" />
                {nextAction.badge}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {nextAction.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {nextAction.description}
            </p>
          </div>

          <button
            onClick={() => {
              if (nextAction.topicId) {
                onSelectTopicForQuiz(nextAction.topicId);
              } else {
                onNavigateTab(nextAction.targetTab);
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition shrink-0"
          >
            <span>{nextAction.buttonLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Core Diagnostic Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Diagnostic Readiness Gauge Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Diagnostic Readiness</span>
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {hasAttempts ? 'Assessed' : 'Baseline'}
              </span>
            </div>

            <div className="flex items-center gap-4 my-3">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center bg-indigo-50 dark:bg-slate-800 shrink-0">
                <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                  {report.overallScorePercent}%
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {report.overallReadiness.replace(/_/g, ' ')}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {report.totalQuestionsEvaluated > 0
                    ? `Based on ${report.totalQuestionsEvaluated} diagnostic answers${latestAttempt ? ` (Last run: ${latestAttempt.scorePercent}%)` : ''}`
                    : 'Initial benchmark loaded'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
              {report.summaryMessage}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => onNavigateTab('gap-report')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View In-Depth Gap Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Weak Topics to Prioritize */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Critical Knowledge Gaps</span>
              </h2>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60">
                {report.weakTopics.length} Weak Topics
              </span>
            </div>

            <div className="space-y-3 my-2">
              {report.weakTopics.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-slate-400 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                  No critical weak topics identified. Keep reviewing!
                </div>
              ) : (
                report.weakTopics.slice(0, 2).map((topic) => (
                  <div
                    key={topic.topicId}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate pr-2">
                        {topic.topicTitle}
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 shrink-0">
                        {topic.masteryScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {topic.primaryReason}
                    </p>
                    <div className="flex items-center gap-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTopicForExplain(topic.topicTitle);
                          onNavigateTab('explain-assistant');
                        }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Explain</span>
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTopicForQuiz(topic.topicId);
                          onNavigateTab('diagnostic-quiz');
                        }}
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <BrainCircuit className="w-3 h-3" />
                        <span>Practice</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => onNavigateTab('topic-map')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Full Topic Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Adaptive Revision Progress Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CalendarCheck2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Revision Plan Progress</span>
              </h2>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-900/60">
                {plan.timeframeDays} Days
              </span>
            </div>

            <div className="space-y-2 my-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Task Completion</span>
                <span>{plan.completionPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all"
                  style={{ width: `${plan.completionPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                {plan.completedMinutes} of {plan.totalEstimatedMinutes} estimated minutes completed.
              </div>
            </div>

            {nextPendingTask && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span className="truncate">Next: {nextPendingTask.title}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={() => onNavigateTab('revision-plan')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View Daily Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Feature Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
        <button
          onClick={() => onNavigateTab('topic-map')}
          className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition group shadow-xs"
        >
          <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">Topic Map</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Syllabus breakdown</div>
        </button>

        <button
          onClick={() => onNavigateTab('diagnostic-quiz')}
          className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition group shadow-xs"
        >
          <BrainCircuit className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">Diagnostic Quiz</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Misconception test</div>
        </button>

        <button
          onClick={() => onNavigateTab('gap-report')}
          className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500 dark:hover:border-rose-500 text-left transition group shadow-xs"
        >
          <BarChart3 className="w-5 h-5 text-rose-600 dark:text-rose-400 mb-2 group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">Gap Diagnosis</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Misconception report</div>
        </button>

        <button
          onClick={() => onNavigateTab('explain-assistant')}
          className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500 dark:hover:border-amber-500 text-left transition group shadow-xs"
        >
          <Sparkles className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">AI Assistant</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">RAG citations</div>
        </button>
      </div>
    </div>
  );
};
