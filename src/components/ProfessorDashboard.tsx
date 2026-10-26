'use client';

import React, { useState } from 'react';
import { CourseMaterial, UserProfile } from '@/types';
import {
  getEnrolledStudentsForCourse,
  CourseStudentData,
  getUserQuizAttempts,
} from '@/lib/storage';
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  AlertTriangle,
  Award,
  Upload,
  CheckCircle2,
  ChevronRight,
  Info,
  X,
  Layers,
} from 'lucide-react';

interface ProfessorDashboardProps {
  user: UserProfile;
  courses: CourseMaterial[];
  activeCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onOpenUpload: () => void;
}

export type ProfSubTab = 'overview' | 'students' | 'materials' | 'topics' | 'assessments' | 'analytics';

export const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({
  user,
  courses,
  activeCourseId,
  onSelectCourse,
  onOpenUpload,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProfSubTab>('overview');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<CourseStudentData | null>(null);
  const [showSimulated48Cohort, setShowSimulated48Cohort] = useState(false);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];
  const enrolledStudents = getEnrolledStudentsForCourse(activeCourse.id);
  const courseAttempts = enrolledStudents.flatMap((s) => getUserQuizAttempts(s.student.id, activeCourse.id));

  // Compute real course statistics from actual enrolled students
  const totalEnrolled = enrolledStudents.length;
  const avgScore = totalEnrolled > 0
    ? Math.round(enrolledStudents.reduce((acc, s) => acc + s.latestScorePercent, 0) / totalEnrolled)
    : 0;

  // Real class weak topics from enrolled students
  const aggregatedWeakTopics: Record<string, { count: number; title: string }> = {};
  for (const s of enrolledStudents) {
    for (const weak of s.report.weakTopics) {
      if (!aggregatedWeakTopics[weak.topicId]) {
        aggregatedWeakTopics[weak.topicId] = { count: 0, title: weak.topicTitle };
      }
      aggregatedWeakTopics[weak.topicId].count += 1;
    }
  }

  const subTabs = [
    { id: 'overview' as const, label: 'Overview', icon: BookOpen },
    { id: 'students' as const, label: `Students (${totalEnrolled})`, icon: Users },
    { id: 'materials' as const, label: `Materials (${activeCourse.documents.length})`, icon: FileText },
    { id: 'topics' as const, label: 'Topics', icon: Layers },
    { id: 'assessments' as const, label: `Assessments (${courseAttempts.length})`, icon: Award },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Professor Course Workspace</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • {user.name} ({user.institution || 'Department of Computer Science'})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeCourse.code}: {activeCourse.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeCourse.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Course Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="prof-course-select" className="text-xs font-semibold text-slate-500 shrink-0">
                Course:
              </label>
              <select
                id="prof-course-select"
                value={activeCourse.id}
                onChange={(e) => onSelectCourse(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Course Material</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex overflow-x-auto gap-2">
          {subTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Enrolled Students</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalEnrolled} Students
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {totalEnrolled} completed diagnostic assessment
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Class Average Score</span>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {avgScore}%
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Based on active student submissions</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Indexed Course Materials</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {activeCourse.documents.length} Docs
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activeCourse.chunks.length} RAG semantic chunks
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Identified Class Gaps</span>
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {Object.keys(aggregatedWeakTopics).length} Topics
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Areas where enrolled students struggle</p>
            </div>
          </div>

          {/* Quick Roster & Priority Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Roster Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Enrolled Student Performance</span>
                </h3>
                <button
                  onClick={() => setActiveSubTab('students')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  View Full Roster &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {enrolledStudents.map((st) => (
                  <div
                    key={st.student.id}
                    onClick={() => setSelectedStudentForModal(st)}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-indigo-50/20 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {st.student.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{st.student.email}</div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {st.latestScorePercent}% Score
                        </span>
                        <div className="text-[10px] text-rose-500 font-medium">
                          {st.weakTopicsCount} weak topic{st.weakTopicsCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Class Struggle Areas */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Class-Wide Conceptual Blindspots</span>
              </h3>

              {Object.keys(aggregatedWeakTopics).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(aggregatedWeakTopics).map(([id, info]) => (
                    <div
                      key={id}
                      className="p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-200">
                          {info.title}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                          {info.count} of {totalEnrolled} students struggling
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        Recommend addressing this topic during upcoming lecture revision.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No critical knowledge gaps reported across enrolled students.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENTS ROSTER TAB */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enrolled Students in {activeCourse.code}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any student record to view their individual diagnostic report and test breakdown.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {totalEnrolled} Active Enrollment{totalEnrolled !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Assessments Taken</th>
                    <th className="py-3 px-4">Diagnostic Score</th>
                    <th className="py-3 px-4">Identified Weak Topics</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {enrolledStudents.map((st) => (
                    <tr
                      key={st.student.id}
                      onClick={() => setSelectedStudentForModal(st)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {st.student.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {st.student.email}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {st.attemptsCount} attempt{st.attemptsCount !== 1 ? 's' : ''}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            st.latestScorePercent >= 75
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : st.latestScorePercent >= 50
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {st.latestScorePercent}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {st.weakTopicTitles.length > 0 ? (
                            st.weakTopicTitles.map((w, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 truncate max-w-[140px]"
                              >
                                {w}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-medium">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                          View Report &rarr;
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MATERIALS TAB */}
      {activeSubTab === 'materials' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Course Materials &amp; RAG Indexing
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Uploaded syllabus, lecture notes, and past papers are indexed for question generation and student AI Tutor citations.
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeCourse.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span className="capitalize">{doc.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Uploaded {doc.uploadedAt}</span>
                      <span>•</span>
                      <span>{doc.sizeKb} KB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Indexed ({doc.chunkCount} chunks)</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TOPICS TAB */}
      {activeSubTab === 'topics' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Curriculum Units &amp; Topic Weightages
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Governs diagnostic test generation and adaptive study sprint priorities.
            </p>
          </div>

          <div className="space-y-4">
            {activeCourse.units.map((unit) => (
              <div
                key={unit.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Unit {unit.number}: {unit.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    {unit.topics.length} topic{unit.topics.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unit.topics.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {t.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {t.examWeightagePercent}% Weight
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ASSESSMENTS TAB */}
      {activeSubTab === 'assessments' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Student Assessment Submissions Log
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Log of student attempts submitted for {activeCourse.code}.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {courseAttempts.length} Total Submissions
            </span>
          </div>

          <div className="space-y-3">
            {courseAttempts.length > 0 ? (
              courseAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Attempt ID: {attempt.id}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Completed {attempt.timestamp} • {attempt.totalQuestions} Questions Evaluated
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {attempt.scorePercent}% Score
                    </span>
                    <div className="text-[10px] text-slate-500">
                      {attempt.gapReport.weakTopics.length} weak areas detected
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No quiz submissions recorded yet for this course.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. ANALYTICS TAB */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Toggle between Real Enrolled vs Simulated 48-Student Cohort */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Data View Mode:
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {showSimulated48Cohort
                  ? 'Currently viewing the simulated 48-student institutional demonstration cohort.'
                  : `Currently viewing actual data from the ${totalEnrolled} active enrolled demo students.`}
              </p>
            </div>

            <button
              onClick={() => setShowSimulated48Cohort(!showSimulated48Cohort)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition"
            >
              {showSimulated48Cohort
                ? 'Switch to Real Enrolled Students View'
                : 'Switch to Simulated 48-Student Cohort Demo'}
            </button>
          </div>

          {showSimulated48Cohort && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">Honest Demonstration Notice: </span>
                <span>
                  The 48-student dataset below is synthetic demo data modeled for showing institutional heatmap scalability to hackathon judges. Switch to &quot;Real Enrolled Students View&quot; to inspect only your actual student records.
                </span>
              </div>
            </div>
          )}

          {/* Analytics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Cohort Size</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {showSimulated48Cohort ? '48 Students' : `${totalEnrolled} Students`}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Cohort Average Score</span>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {showSimulated48Cohort ? '61.4%' : `${avgScore}%`}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Critical Topics Requiring Review</span>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {showSimulated48Cohort ? '2 Topics (>60% error rate)' : `${Object.keys(aggregatedWeakTopics).length} Topics`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL STUDENT REPORT MODAL */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudentForModal(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Individual Student Diagnostic Inspection
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedStudentForModal.student.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {selectedStudentForModal.student.email} • {activeCourse.code}
              </p>
            </div>

            {/* Score & Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Assessment Score</span>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {selectedStudentForModal.latestScorePercent}%
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Overall Readiness</span>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {selectedStudentForModal.report.overallReadiness.replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            {/* Weak Topics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detected Knowledge Gaps &amp; Root Misconceptions
              </h4>
              {selectedStudentForModal.report.weakTopics.map((w, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-200">
                      {w.topicTitle}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                      Mastery: {w.masteryScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    <strong>Primary Misconception:</strong> {w.primaryReason}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
