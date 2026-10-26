'use client';

import React, { useState } from 'react';
import { RevisionPlan, DiagnosticGapReport } from '@/types';
import {
  Clock,
  Sparkles,
  BookOpen,
  Sliders,
  Download,
  Check,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RevisionPlanViewProps {
  plan: RevisionPlan;
  gapReport: DiagnosticGapReport;
  onUpdatePlan: (updatedPlan: RevisionPlan) => void;
  onRegeneratePlan: (timeframeDays: number, dailyHours: number) => void;
  onSelectTopicForExplain: (topicTitle: string) => void;
}

export const RevisionPlanView: React.FC<RevisionPlanViewProps> = ({
  plan,
  gapReport,
  onUpdatePlan,
  onRegeneratePlan,
  onSelectTopicForExplain,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(plan.timeframeDays || 3);
  const [selectedHours, setSelectedHours] = useState(plan.dailyHoursAvailable || 2.5);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [copied, setCopied] = useState(false);

  // Toggle task completion
  const handleToggleTask = (dayNumber: number, taskId: string) => {
    const updatedSchedules = plan.schedules.map((schedule) => {
      if (schedule.dayNumber !== dayNumber) return schedule;

      const updatedTasks = schedule.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const newStatus = !task.completed;
        return {
          ...task,
          completed: newStatus,
          completedAt: newStatus ? new Date().toISOString() : undefined,
        };
      });

      return {
        ...schedule,
        tasks: updatedTasks,
      };
    });

    const allTasks = updatedSchedules.flatMap((s) => s.tasks);
    const completedTasks = allTasks.filter((t) => t.completed);
    const completedMinutes = completedTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
    const completionPercent = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;

    const updatedPlan: RevisionPlan = {
      ...plan,
      schedules: updatedSchedules,
      completedMinutes,
      completionPercent,
    };

    onUpdatePlan(updatedPlan);

    // If day completed, trigger celebration
    const currentSchedule = updatedSchedules.find((s) => s.dayNumber === dayNumber);
    if (currentSchedule && currentSchedule.tasks.every((t) => t.completed)) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleApplyConfig = () => {
    onRegeneratePlan(selectedTimeframe, selectedHours);
    setIsConfiguring(false);
  };

  const handleExportMarkdown = () => {
    let md = `# GapFinder AI - Personalized Revision Plan\n\n`;
    md += `Generated: ${new Date(plan.generatedAt).toLocaleDateString()}\n`;
    md += `Timeframe: ${plan.timeframeDays} Days | Daily Target: ${plan.dailyHoursAvailable} Hours\n`;
    md += `Status: ${plan.completionPercent}% Completed (${plan.completedMinutes} / ${plan.totalEstimatedMinutes} mins)\n\n`;

    for (const schedule of plan.schedules) {
      md += `## ${schedule.dateLabel}: ${schedule.theme}\n`;
      md += `Target Duration: ${schedule.estimatedMinutes} minutes\n\n`;
      for (const task of schedule.tasks) {
        md += `- [${task.completed ? 'x' : ' '}] **${task.title}** (${task.durationMinutes} mins - Priority: ${task.priority})\n`;
        md += `  * Focus: ${task.instruction}\n`;
        md += `  * Grounding Citation: ${task.citationReference}\n`;
      }
      md += `\n`;
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Plan Header & Timeframe Adjuster */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                Personalized Adaptive Plan
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                • {plan.timeframeDays}-Day Sprint
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                • {plan.dailyHoursAvailable} hrs/day
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                • Targeting {gapReport.weakTopics.length} weak areas
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Prioritized Revision Schedule
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dynamically synthesized from your Gap Report. High-yield weak topics and misconceptions are prioritized first, allocating exact daily time blocks to maximize exam return.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsConfiguring(!isConfiguring)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Adjust Time Budget</span>
            </button>

            <button
              type="button"
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              title="Copy plan to Markdown clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
              <span>{copied ? 'Copied Markdown!' : 'Export Plan'}</span>
            </button>
          </div>
        </div>

        {/* Time Budget Configuration Drawer */}
        {isConfiguring && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/40 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Configure Your Available Revision Budget:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Exam Countdown (Days):
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[2, 3, 5, 7, 14].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setSelectedTimeframe(days)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedTimeframe === days
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Daily Study Hours:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[1.5, 2, 2.5, 3, 4, 6].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setSelectedHours(hrs)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedHours === hrs
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {hrs} hrs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfiguring(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyConfig}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs"
              >
                Apply & Regenerate Plan
              </button>
            </div>
          </div>
        )}

        {/* Live Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Overall Plan Progress</span>
            </span>
            <span className="text-purple-700 dark:text-purple-300 font-bold">
              {plan.completionPercent}% Completed ({plan.completedMinutes} / {plan.totalEstimatedMinutes} mins)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${plan.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Task Filter Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter tasks:</span>
            {(['ALL', 'PENDING', 'COMPLETED'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTaskFilter(f)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                  taskFilter === f
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Schedules List */}
      <div className="space-y-6">
        {plan.schedules.map((schedule) => {
          const filteredTasks = schedule.tasks.filter((t) => {
            if (taskFilter === 'PENDING') return !t.completed;
            if (taskFilter === 'COMPLETED') return t.completed;
            return true;
          });

          const completedDayTasks = schedule.tasks.filter((t) => t.completed).length;
          const isDayComplete = completedDayTasks === schedule.tasks.length && schedule.tasks.length > 0;

          if (filteredTasks.length === 0 && taskFilter !== 'ALL') return null;

          return (
            <div
              key={schedule.dayNumber}
              className={`rounded-2xl border transition shadow-xs overflow-hidden ${
                isDayComplete
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-slate-900/90'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Day Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                      isDayComplete
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    D{schedule.dayNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{schedule.dateLabel}</h2>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{schedule.theme}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Target: ~{schedule.estimatedMinutes} minutes ({schedule.tasks.length} targeted tasks)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      isDayComplete
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {completedDayTasks} / {schedule.tasks.length} Completed
                  </span>
                </div>
              </div>

              {/* Day Tasks */}
              <div className="p-5 space-y-3">
                {filteredTasks.map((task) => {
                  const isHigh = task.priority === 'HIGH';

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(schedule.dayNumber, task.id)}
                      className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 cursor-pointer select-none ${
                        task.completed
                          ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 opacity-75'
                          : isHigh
                          ? 'border-rose-200 dark:border-rose-900/40 bg-slate-50 dark:bg-slate-950/70 hover:border-rose-300 dark:hover:border-rose-800'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Interactive Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition shrink-0 ${
                            task.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-sm font-bold transition ${
                                task.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {task.title}
                            </span>

                            {isHigh && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                                High Priority
                              </span>
                            )}

                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {task.taskType.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{task.instruction}</p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                              <BookOpen className="w-3 h-3" />
                              <span>{task.citationReference}</span>
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{task.durationMinutes} mins</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Explain trigger button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTopicForExplain(task.topicTitle);
                        }}
                        className="shrink-0 p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
                        title="Explain topic using RAG"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
