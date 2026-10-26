'use client';

import React from 'react';
import { QuizAttemptRecord, DiagnosticGapReport, CourseMaterial, UserProfile } from '@/types';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Award,
  Users,
  GraduationCap,
  Info,
} from 'lucide-react';

interface ProgressDashboardProps {
  attempts: QuizAttemptRecord[];
  latestReport: DiagnosticGapReport;
  course: CourseMaterial;
  user: UserProfile;
  onRetakeQuiz: () => void;
  onNavigateToPlan: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  attempts,
  latestReport,
  course,
  user,
  onRetakeQuiz,
  onNavigateToPlan,
}) => {
  const isTeacherView = user.role === 'TEACHER';

  // Explicitly labeled synthetic cohort data for demonstrating teacher view scalability
  const classTopicStruggles = [
    { topic: "Page Replacement & Belady's Anomaly", failureRate: 68, highMisconception: "Confused FIFO with LRU stack property", urgency: 'CRITICAL' },
    { topic: "Deadlocks & Banker's Safety Trace", failureRate: 62, highMisconception: "Equated unsafe state with immediate deadlock", urgency: 'CRITICAL' },
    { topic: "Paging & TLB Access Calculations", failureRate: 45, highMisconception: "Omitted secondary memory read on TLB miss", urgency: 'MEDIUM' },
    { topic: "Thrashing & Working Set Window", failureRate: 35, highMisconception: "Increased multiprogramming during thrashing", urgency: 'LOW' },
    { topic: "Semaphores & Classical IPC", failureRate: 28, highMisconception: "Believed wait() was non-blocking", urgency: 'LOW' },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              {isTeacherView ? 'Class Cohort Analytics (Simulated)' : 'Student Progress & Mastery Trend'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              • {course.code}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isTeacherView ? 'Cohort Diagnostic Insights' : 'Progress & Mastery Tracking'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isTeacherView
              ? 'Aggregated diagnostic heatmap across 48 enrolled students. Identifies class-wide conceptual gaps before final exams.'
              : 'Tracks how your knowledge gaps diminish across repeated diagnostic attempts and revision cycles.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-xs"
          >
            New Diagnostic Assessment
          </button>
        </div>
      </div>

      {/* TEACHER VIEW (Demonstration of Future Scalability for Educators) */}
      {isTeacherView ? (
        <div className="space-y-6">
          {/* Honest Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
              <span className="font-bold">Demonstration Notice: </span>
              <span>
                Cohort analytics below display simulated aggregate data from 48 students for demonstration purposes. Individual student records are anonymized to protect student privacy and adhere to academic data protection standards.
              </span>
            </div>
          </div>

          {/* Class Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Enrolled Cohort</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">48 Students</div>
              <div className="text-[11px] text-slate-500 mt-0.5">100% completed diagnostic benchmark</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Cohort Avg Score</span>
              </div>
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">61.4%</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">+8.2% from baseline attempt</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Critical Class Gaps</span>
              </div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">2 Topics</div>
              <div className="text-[11px] text-rose-600 dark:text-rose-300/80 mt-0.5">&gt;60% failure rate in cohort</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Plan Adherence</span>
              </div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">74%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Completed prescribed tasks</div>
            </div>
          </div>

          {/* Class-level topic struggle heatmap */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Class Topic Struggle Heatmap & Top Misconceptions</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Helps instructors prioritize what to re-teach in lecture before exams.
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                Sorted by Failure Rate
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {classTopicStruggles.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{item.topic}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.urgency === 'CRITICAL'
                            ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                            : item.urgency === 'MEDIUM'
                            ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                            : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                        }`}
                      >
                        {item.failureRate}% Failure Rate
                      </span>
                    </div>

                    <div className="text-xs text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span><strong>Predominant Class Misconception:</strong> {item.highMisconception}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 shrink-0">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Struggle Index</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{item.failureRate}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${item.failureRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* STUDENT VIEW (Based strictly on actual student attempts) */
        <div className="space-y-6">
          {/* Attempt Comparison Cards */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recorded Diagnostic Runs ({attempts.length})
              </h2>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Latest Readiness: {latestReport.overallScorePercent}% ({latestReport.overallReadiness.replace(/_/g, ' ')})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {attempts.map((attempt, idx) => (
                <div
                  key={attempt.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Diagnostic Run #{idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{attempt.scorePercent}%</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Readiness Score</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {attempt.gapReport.summaryMessage}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{attempt.totalQuestions} Questions Tested</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {attempt.gapReport.weakTopics.length} Gaps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Progression Matrix */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Topic Mastery Progression</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  See how targeted revision converted Weak topics into Medium and Strong mastery.
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToPlan}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline transition"
              >
                View Active Revision Plan →
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {course.units.flatMap((u) => u.topics).map((topic) => {
                const isWeak = topic.masteryLevel === 'WEAK';
                const isMedium = topic.masteryLevel === 'MEDIUM';

                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{topic.title}</span>
                        <span className="text-xs text-slate-500">• {topic.unitTitle}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{topic.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-32">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          <span>Mastery</span>
                          <span className={isWeak ? 'text-rose-600 dark:text-rose-400' : isMedium ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                            {topic.masteryScore}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isWeak ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${topic.masteryScore}%` }}
                          />
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isWeak
                            ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                            : isMedium
                            ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                            : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                        }`}
                      >
                        {topic.masteryLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
