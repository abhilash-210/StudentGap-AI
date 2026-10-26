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
  const getReadinessColor = (readiness: DiagnosticGapReport['overallReadiness']) => {
    switch (readiness) {
      case 'CRITICAL_GAPS':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          title: 'Critical Knowledge Gaps Detected',
          bar: 'bg-rose-500',
        };
      case 'NEEDS_TARGETED_REVISION':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          title: 'Targeted Revision Required',
          bar: 'bg-amber-500',
        };
      case 'EXAM_READY':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          title: 'Exam Ready / High Mastery',
          bar: 'bg-emerald-500',
        };
    }
  };

  const statusMeta = getReadinessColor(report.overallReadiness);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Executive Diagnostic Summary Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/70 p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.badge}`}>
                {statusMeta.title}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                • Diagnostic Attempt #{report.id.slice(-4)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Knowledge Gap Diagnosis
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              {report.summaryMessage}
            </p>
          </div>

          {/* Overall Readiness Gauge Card */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-5 flex items-center gap-5 shrink-0 shadow-lg">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-900">
                <div className="text-center">
                  <span className="text-2xl font-black text-white">{report.overallScorePercent}%</span>
                  <div className="text-[9px] uppercase font-bold text-slate-400">Readiness</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">Diagnosis Summary:</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-rose-300 font-semibold">{report.weakTopics.length} Weak</span>
                <span className="text-slate-600">|</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-300 font-semibold">{report.mediumTopics.length} Medium</span>
                <span className="text-slate-600">|</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-300 font-semibold">{report.strongTopics.length} Strong</span>
              </div>

              {/* Action Button */}
              <button
                onClick={onGeneratePlan}
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
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
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="rounded-xl bg-rose-950/40 border border-rose-800/40 p-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>High-Risk Danger Zones (High Exam Weight + Low Mastery):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.highRiskDangerZones.map((zone, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950/60 border border-rose-900/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                        <span>{zone.topicTitle}</span>
                        <span className="text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800 text-[10px]">
                          {zone.weightage}% Exam Weight
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/80 leading-relaxed">{zone.reason}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-rose-950/60 flex justify-end">
                      <button
                        onClick={() => onSelectTopicForExplain(zone.topicTitle)}
                        className="text-[11px] font-semibold text-rose-300 hover:text-white flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>Cognitive Dimension Breakdown</span>
            </h2>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Diagnostic</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Theoretical Foundations</span>
                <span className="text-indigo-400">{report.knowledgeDimensions.theoretical}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.theoretical}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Problem Solving & Calculations</span>
                <span className="text-rose-400">{report.knowledgeDimensions.problemSolving}% (Gap)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.problemSolving}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Edge Cases & Pathological Scenarios</span>
                <span className="text-amber-400">{report.knowledgeDimensions.edgeCases}% (Low)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.edgeCases}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Terminology & Definitions</span>
                <span className="text-emerald-400">{report.knowledgeDimensions.terminology}% (Strong)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${report.knowledgeDimensions.terminology}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-200">Key Takeaway:</strong> You know definitions well, but struggle when those definitions are combined into multi-step problems or non-trivial edge cases.
          </div>
        </div>

        {/* Action Center Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Recommended Diagnostic Actions</h2>
              </div>
              <span className="text-xs text-indigo-400 font-semibold">Prioritized Engine</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Traditional study tools wait for you to ask what you don't understand. GapFinder AI has identified exactly where your revision effort will yield the highest exam return:
            </p>

            <div className="space-y-3">
              {report.weakTopics.slice(0, 2).map((topic) => (
                <div
                  key={topic.topicId}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/40 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-xs font-bold text-white">{topic.topicTitle}</span>
                      <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-800/50">
                        {topic.examWeightagePercent}% Exam Weight
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{topic.primaryReason}</p>
                    <div className="text-[11px] text-slate-400">
                      <strong>Prescribed:</strong> {topic.recommendedAction}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTopicForExplain(topic.topicTitle)}
                    className="shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Explain topic in RAG assistant"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onRetakeQuiz}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic Quiz</span>
            </button>

            <button
              onClick={onGeneratePlan}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-600/30 ring-1 ring-white/20"
            >
              <span>Generate Dynamic Revision Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Weak, Medium, Strong Topic Breakdown */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Detailed Topic-Level Diagnosis</span>
          <span className="text-xs font-normal text-slate-400">({report.weakTopics.length + report.mediumTopics.length + report.strongTopics.length} topics evaluated)</span>
        </h2>

        {/* 1. Weak Topics Category */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
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
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
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
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
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
      ? 'border-rose-900/50 hover:border-rose-700/80 bg-slate-900/90'
      : type === 'MEDIUM'
      ? 'border-amber-900/50 hover:border-amber-700/80 bg-slate-900/90'
      : 'border-emerald-900/50 hover:border-emerald-700/80 bg-slate-900/90';

  const scoreBadge =
    type === 'WEAK'
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      : type === 'MEDIUM'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

  return (
    <div className={`rounded-xl border p-5 transition flex flex-col justify-between shadow-md ${borderClass}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {topic.unitTitle}
            </span>
            <h3 className="text-base font-bold text-white">{topic.topicTitle}</h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreBadge}`}>
              {topic.masteryScore}%
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-semibold">
              {topic.examWeightagePercent}% Weight
            </span>
          </div>
        </div>

        {/* Diagnosis Reason */}
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
          <div className="font-semibold text-slate-300">Diagnosis:</div>
          <p className="text-slate-400 leading-relaxed">{topic.primaryReason}</p>
        </div>

        {/* Misconception Alert if any */}
        {topic.identifiedMisconceptions.length > 0 && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs">
            <span className="font-bold text-rose-400 flex items-center gap-1 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Detected Student Misconception:
            </span>
            <p className="text-rose-200/90 text-[11px] leading-tight">
              {topic.identifiedMisconceptions[0]}
            </p>
          </div>
        )}

        {/* Citations to review */}
        {topic.keySourcesToReview.length > 0 && (
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">
              Grounding: <strong className="text-slate-300">{topic.keySourcesToReview[0].documentName}</strong> ({topic.keySourcesToReview[0].section})
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">
          Accuracy: {topic.accuracyRate}% ({topic.correctQuestions}/{topic.totalQuestions || 1})
        </span>

        <button
          onClick={() => onExplain(topic.topicTitle)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Explain Grounded Citations</span>
        </button>
      </div>
    </div>
  );
};
