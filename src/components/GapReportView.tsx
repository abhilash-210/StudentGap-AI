'use client';

import React from 'react';
import { DiagnosticGapReport, TopicGapDetail } from '@/types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  BookOpen,
  Sparkles,
  BarChart2,
  CalendarCheck2,
  RotateCcw,
  Zap,
  ShieldCheck,
  BrainCircuit,
} from 'lucide-react';

interface GapReportViewProps {
  report: DiagnosticGapReport;
  onGeneratePlan: () => void;
  onRetakeQuiz: () => void;
  onSelectTopicForExplain: (topicTitle: string) => void;
}

export const GapReportView: React.FC<GapReportViewProps> = ({
  report,
  onGeneratePlan,
  onRetakeQuiz,
  onSelectTopicForExplain,
}) => {
  const isUntested = report.overallReadiness === 'UNTESTED' || report.totalQuestionsEvaluated === 0;

  const getReadinessColor = (readiness: DiagnosticGapReport['overallReadiness']) => {
    switch (readiness) {
      case 'CRITICAL_GAPS':
        return {
          badge: 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
          title: 'Critical Knowledge Gaps Detected',
          bar: 'bg-rose-500',
        };
      case 'NEEDS_TARGETED_REVISION':
        return {
          badge: 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
          title: 'Targeted Revision Required',
          bar: 'bg-amber-500',
        };
      case 'EXAM_READY':
        return {
          badge: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
          title: 'Exam Ready / High Mastery',
          bar: 'bg-emerald-500',
        };
      case 'UNTESTED':
      default:
        return {
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          title: 'Baseline Diagnostic Needed',
          bar: 'bg-slate-400',
        };
    }
  };

  const statusMeta = getReadinessColor(report.overallReadiness);

  if (isUntested) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Diagnostic Assessment Completed Yet
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          GapFinder AI requires diagnostic evidence to identify your hidden weak areas, common misconceptions, and cognitive dimensions.
        </p>
        <button
          onClick={onRetakeQuiz}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Launch 6-Question Diagnostic Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Executive Diagnostic Summary Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                Step 2 • Gap Diagnosis
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.badge}`}>
                {statusMeta.title}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium hidden sm:inline">
                • {report.totalQuestionsEvaluated} Questions Evaluated
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Knowledge Gap Diagnosis Report
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {report.summaryMessage}
            </p>
          </div>

          {/* Overall Readiness Gauge Card */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-5 shrink-0 shadow-xs">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{report.overallScorePercent}%</span>
                  <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Readiness</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Diagnosis Summary:</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-rose-700 dark:text-rose-300 font-bold">{report.weakTopics.length} Weak</span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-700 dark:text-amber-300 font-bold">{report.mediumTopics.length} Medium</span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">{report.strongTopics.length} Strong</span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onGeneratePlan}
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-xs"
              >
                <CalendarCheck2 className="w-3.5 h-3.5" />
                <span>Build Adaptive Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* High-Risk Danger Zones Alert */}
        {report.highRiskDangerZones.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 p-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>High-Risk Danger Zones (High Exam Weight + Low Mastery):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.highRiskDangerZones.map((zone, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-white dark:bg-slate-950/60 border border-rose-200 dark:border-rose-900/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                        <span>{zone.topicTitle}</span>
                        <span className="text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 text-[10px]">
                          {zone.weightage}% Exam Weight
                        </span>
                      </div>
                      <p className="text-xs text-rose-900 dark:text-rose-200/90 leading-relaxed">{zone.reason}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-rose-100 dark:border-rose-950/60 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectTopicForExplain(zone.topicTitle)}
                        className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Explain & Review Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cognitive Dimensions Matrix & Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Dimensions Bars */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Cognitive Dimension Breakdown</span>
            </h2>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Diagnostic</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Theoretical Foundations</span>
                <span className="text-indigo-700 dark:text-indigo-400 font-bold">{report.knowledgeDimensions.theoretical}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.theoretical}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Problem Solving & Calculations</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{report.knowledgeDimensions.problemSolving}% (Gap)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.problemSolving}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Edge Cases & Exceptions</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{report.knowledgeDimensions.edgeCases}% (Low)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.edgeCases}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Terminology & Definitions</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{report.knowledgeDimensions.terminology}% (Strong)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.terminology}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-800 dark:text-slate-200">Key Takeaway:</strong> You know definitions well, but struggle when those definitions are combined into multi-step problems or non-trivial edge cases.
          </div>
        </div>

        {/* Action Center Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recommended Diagnostic Actions</h2>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Prioritized Engine</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Traditional study tools wait for you to ask what you don&apos;t understand. GapFinder AI has identified exactly where your revision effort will yield the highest exam return:
            </p>

            <div className="space-y-3">
              {report.weakTopics.slice(0, 2).map((topic) => (
                <div
                  key={topic.topicId}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-rose-200 dark:border-rose-900/40 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{topic.topicTitle}</span>
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-800/50">
                        {topic.examWeightagePercent}% Exam Weight
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{topic.primaryReason}</p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>Prescribed:</strong> {topic.recommendedAction}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTopicForExplain(topic.topicTitle)}
                    className="shrink-0 p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                    title="Explain topic in RAG assistant"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic Quiz</span>
            </button>

            <button
              type="button"
              onClick={onGeneratePlan}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
            >
              <span>Generate Dynamic Revision Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Weak, Medium, Strong Topic Breakdown */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Detailed Topic-Level Diagnosis</span>
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
            ({report.weakTopics.length + report.mediumTopics.length + report.strongTopics.length} topics evaluated)
          </span>
        </h2>

        {/* 1. Weak Topics Category */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Weak Topics ({report.weakTopics.length}) - Immediate Intervention Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.weakTopics.map((topic) => (
              <TopicCard
                key={topic.topicId}
                topic={topic}
                type="WEAK"
                onExplain={onSelectTopicForExplain}
              />
            ))}
          </div>
        </div>

        {/* 2. Medium Topics Category */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>Medium Topics ({report.mediumTopics.length}) - Reinforcement & Edge Case Practice</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.mediumTopics.map((topic) => (
              <TopicCard
                key={topic.topicId}
                topic={topic}
                type="MEDIUM"
                onExplain={onSelectTopicForExplain}
              />
            ))}
          </div>
        </div>

        {/* 3. Strong Topics Category */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Topics ({report.strongTopics.length}) - Retain via Spaced Retrieval</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.strongTopics.map((topic) => (
              <TopicCard
                key={topic.topicId}
                topic={topic}
                type="STRONG"
                onExplain={onSelectTopicForExplain}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TopicCardProps {
  topic: TopicGapDetail;
  type: 'WEAK' | 'MEDIUM' | 'STRONG';
  onExplain: (title: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, type, onExplain }) => {
  const borderClass =
    type === 'WEAK'
      ? 'border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900'
      : type === 'MEDIUM'
      ? 'border-amber-200 dark:border-amber-900/50 bg-white dark:bg-slate-900'
      : 'border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900';

  const scoreBadge =
    type === 'WEAK'
      ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
      : type === 'MEDIUM'
      ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
      : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';

  return (
    <div className={`rounded-xl border p-5 transition flex flex-col justify-between shadow-xs ${borderClass}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {topic.unitTitle}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{topic.topicTitle}</h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreBadge}`}>
              {topic.masteryScore}%
            </span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold">
              {topic.examWeightagePercent}% Weight
            </span>
          </div>
        </div>

        {/* Evidence Sufficiency & Sample Size */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>
            Evidence: <strong>{topic.totalQuestions || topic.sampleSize || 0} Questions Evaluated</strong> ({topic.correctQuestions} correct)
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
            {topic.confidenceLevel || 'HIGH'} Confidence
          </span>
        </div>

        {/* Diagnosis Reason */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <div className="font-semibold text-slate-800 dark:text-slate-300">Diagnosis:</div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{topic.primaryReason}</p>
        </div>

        {/* Misconception Alert if any */}
        {topic.identifiedMisconceptions.length > 0 && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs">
            <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Detected Student Misconception:
            </span>
            <p className="text-rose-900 dark:text-rose-200 text-[11px] leading-tight">
              {topic.identifiedMisconceptions[0]}
            </p>
          </div>
        )}

        {/* Citations to review */}
        {topic.keySourcesToReview.length > 0 && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">
              Grounding: <strong className="text-slate-700 dark:text-slate-300">{topic.keySourcesToReview[0].documentName}</strong> ({topic.keySourcesToReview[0].section})
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">
          Accuracy: {topic.accuracyRate}% ({topic.correctQuestions}/{topic.totalQuestions || 1})
        </span>

        <button
          type="button"
          onClick={() => onExplain(topic.topicTitle)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Explain Grounded Citations</span>
        </button>
      </div>
    </div>
  );
};
