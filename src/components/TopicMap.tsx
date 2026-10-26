'use client';

import React, { useState } from 'react';
import { CourseMaterial, TopicItem, MasteryLevel } from '@/types';
import {
  Layers,
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

  const getMasteryBadge = (level: MasteryLevel, score: number) => {
    switch (level) {
      case 'WEAK':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            Weak ({score}%)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Medium ({score}%)
          </span>
        );
      case 'STRONG':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Strong ({score}%)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
            <HelpCircle className="w-3 h-3" />
            Untested
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Syllabus Topic Map
              </span>
              <span className="text-slate-400 text-xs">• {course.code}</span>
              <span className="text-slate-400 text-xs">• Target: {course.targetExam}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Synthesized from your uploaded syllabus, textbook chapters, and past exam papers.
              Each topic is mapped to its exam weightage and live mastery rating.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedFilter(selectedFilter === 'WEAK' ? 'ALL' : 'WEAK')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFilter === 'WEAK'
                  ? 'bg-rose-950/50 border-rose-500/50 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Weak Topics
              </div>
              <div className="text-xl font-bold text-rose-300 mt-0.5">{weakCount}</div>
              <div className="text-[10px] text-slate-400">Needs urgent work</div>
            </button>

            <button
              onClick={() => setSelectedFilter(selectedFilter === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFilter === 'MEDIUM'
                  ? 'bg-amber-950/50 border-amber-500/50 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Medium Topics
              </div>
              <div className="text-xl font-bold text-amber-300 mt-0.5">{mediumCount}</div>
              <div className="text-[10px] text-slate-400">Near threshold</div>
            </button>

            <button
              onClick={() => setSelectedFilter(selectedFilter === 'STRONG' ? 'ALL' : 'STRONG')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFilter === 'STRONG'
                  ? 'bg-emerald-950/50 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Strong Topics
              </div>
              <div className="text-xl font-bold text-emerald-300 mt-0.5">{strongCount}</div>
              <div className="text-[10px] text-slate-400">Mastered</div>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, formulas, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400">Filter by status:</span>
            {(['ALL', 'WEAK', 'MEDIUM', 'STRONG'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  selectedFilter === filter
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
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
              className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition shadow-sm"
            >
              {/* Unit Header */}
              <div
                onClick={() => toggleUnit(unit.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/40 select-none border-b border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-md bg-slate-800 text-slate-300">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        Unit {unit.number}
                      </span>
                      <span className="text-slate-600">•</span>
                      <h2 className="text-base font-semibold text-white">{unit.title}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{unit.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
                    {unit.topics.length} Topics
                  </span>
                </div>
              </div>

              {/* Topics Grid */}
              {isExpanded && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40">
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4 hover:border-slate-700 transition flex flex-col justify-between group"
                    >
                      <div>
                        {/* Topic Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                            {topic.title}
                          </h3>
                          {getMasteryBadge(topic.masteryLevel, topic.masteryScore)}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                          {topic.description}
                        </p>

                        {/* Exam Weightage & Time */}
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
                          <div className="flex items-center gap-1 text-indigo-300 font-semibold">
                            <Award className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{topic.examWeightagePercent}% Exam Weight</span>
                          </div>
                          <span className="text-slate-700">|</span>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>~{topic.estimatedStudyMins} mins</span>
                          </div>
                        </div>

                        {/* Key Concepts Tags */}
                        <div className="space-y-1 mb-3">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                            Key Concepts:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {topic.keyConcepts.map((concept, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] bg-slate-800/70 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                              >
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Detected Misconception Warning */}
                        {topic.detectedMisconceptions.length > 0 && (
                          <div className="mb-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs">
                            <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Detected Student Misconception:</span>
                            </div>
                            <p className="text-rose-300/90 text-[11px] leading-tight">
                              {topic.detectedMisconceptions[0]}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onSelectTopicForExplain(topic.title)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Explain with Citations</span>
                        </button>

                        <button
                          onClick={() => onSelectTopicForQuiz(topic.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white transition shadow-sm"
                        >
                          <span>Test Topic</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
