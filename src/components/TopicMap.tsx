'use client';

import React, { useState } from 'react';
import { CourseMaterial, MasteryLevel } from '@/types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronRight,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TopicMapProps {
  course: CourseMaterial;
  onSelectTopicForQuiz: (topicId: string) => void;
  onSelectTopicForExplain: (topicTitle: string) => void;
}

export const TopicMap: React.FC<TopicMapProps> = ({
  course,
  onSelectTopicForQuiz,
  onSelectTopicForExplain,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'WEAK' | 'MEDIUM' | 'STRONG'>('ALL');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'unit-1': true,
    'unit-2': true,
    'unit-3': true,
    'unit-ml-1': true,
    'unit-ml-2': true,
  });

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const getMasteryBadge = (level: MasteryLevel, score: number, questionsAttempted: number) => {
    if (questionsAttempted === 0) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <HelpCircle className="w-3 h-3" />
          Untested
        </span>
      );
    }

    switch (level) {
      case 'WEAK':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            Weak ({score}%)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <Clock className="w-3 h-3" />
            Medium ({score}%)
          </span>
        );
      case 'STRONG':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Strong ({score}%)
          </span>
        );
    }
  };

  // Filter topics
  const allTopics = course.units.flatMap((u) => u.topics);
  const weakCount = allTopics.filter((t) => t.masteryLevel === 'WEAK').length;
  const mediumCount = allTopics.filter((t) => t.masteryLevel === 'MEDIUM').length;
  const strongCount = allTopics.filter((t) => t.masteryLevel === 'STRONG').length;

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Syllabus Topic Map
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">• {course.code}</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">• Target: {course.targetExam}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Synthesized from your uploaded syllabus, textbook chapters, and past exam papers.
              Each topic is mapped to its exam weightage, diagnostic evidence sufficiency, and live mastery rating.
            </p>
          </div>

          {/* Quick Metrics Filter Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedFilter(selectedFilter === 'WEAK' ? 'ALL' : 'WEAK')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFilter === 'WEAK'
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-500/50 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Weak
              </div>
              <div className="text-xl font-black text-rose-800 dark:text-rose-300 mt-0.5">{weakCount}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Needs work</div>
            </button>

            <button
              onClick={() => setSelectedFilter(selectedFilter === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFilter === 'MEDIUM'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-500/50 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Medium
              </div>
              <div className="text-xl font-black text-amber-800 dark:text-amber-300 mt-0.5">{mediumCount}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Review</div>
            </button>

            <button
              onClick={() => setSelectedFilter(selectedFilter === 'STRONG' ? 'ALL' : 'STRONG')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFilter === 'STRONG'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-500/50 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Strong
              </div>
              <div className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-0.5">{strongCount}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Mastered</div>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, topics, or definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 dark:text-slate-400">Filter:</span>
            {(['ALL', 'WEAK', 'MEDIUM', 'STRONG'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  selectedFilter === filter
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Units & Topics Accordion */}
      <div className="space-y-4">
        {course.units.map((unit) => {
          const filteredTopics = unit.topics.filter((topic) => {
            const matchesQuery =
              topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              topic.keyConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesFilter = selectedFilter === 'ALL' || topic.masteryLevel === selectedFilter;

            return matchesQuery && matchesFilter;
          });

          if (filteredTopics.length === 0 && (searchQuery || selectedFilter !== 'ALL')) {
            return null;
          }

          const isExpanded = expandedUnits[unit.id] ?? true;

          return (
            <div
              key={unit.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
            >
              {/* Unit Header */}
              <div
                onClick={() => toggleUnit(unit.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none border-b border-slate-100 dark:border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Unit {unit.number}
                      </span>
                      <span className="text-slate-400">•</span>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{unit.title}</h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{unit.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    {unit.topics.length} Topics
                  </span>
                </div>
              </div>

              {/* Topics Grid */}
              {isExpanded && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-950/40">
                  {filteredTopics.map((topic) => {
                    const chunksCount = course.chunks.filter((c) => c.topics.includes(topic.id)).length;

                    return (
                      <div
                        key={topic.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-5 hover:border-indigo-300 dark:hover:border-slate-700 transition flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          {/* Topic Header & Mastery */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {topic.title}
                            </h3>
                            {getMasteryBadge(topic.masteryLevel, topic.masteryScore, topic.questionsAttempted)}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                            {topic.description}
                          </p>

                          {/* Exam Weightage & Evidence Sufficiency */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 font-semibold">
                              <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>{topic.examWeightagePercent}% Weight</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>~{topic.estimatedStudyMins} mins</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            <div className="flex items-center gap-1 text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>
                                {topic.questionsAttempted > 0
                                  ? `${topic.questionsAttempted} Qs Evaluated`
                                  : 'Untested'}
                              </span>
                            </div>
                          </div>

                          {/* Key Concepts Tags */}
                          <div className="space-y-1 mb-3">
                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                              Key Concepts:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {topic.keyConcepts.map((concept, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Detected Misconception Warning */}
                          {topic.detectedMisconceptions.length > 0 && (
                            <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs">
                              <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold mb-0.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Detected Student Misconception:</span>
                              </div>
                              <p className="text-rose-900 dark:text-rose-300 text-[11px] leading-tight">
                                {topic.detectedMisconceptions[0]}
                              </p>
                            </div>
                          )}

                          {/* Grounded Source References */}
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                            <BookOpen className="w-3 h-3 text-indigo-500" />
                            <span>
                              {chunksCount > 0
                                ? `${chunksCount} grounded excerpts in notes & past exams`
                                : `Mapped in syllabus`}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => onSelectTopicForExplain(topic.title)}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Explain Topic</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectTopicForQuiz(topic.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-xs"
                          >
                            <span>Test Topic</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
