import {
  CourseMaterial,
  QuizAttemptRecord,
  DiagnosticGapReport,
  RevisionPlan,
  UserProfile,
} from '@/types';
import { SAMPLE_COURSES, GROUNDED_QUIZ_QUESTIONS } from '@/data/sampleCourses';
import { generateDiagnosticGapReport, evaluateStudentQuizAnswers } from './gapAnalyzer';
import { generateAdaptiveRevisionPlanLocal } from './gemini';

const STORAGE_KEYS = {
  COURSES: 'gapfinder_courses',
  ACTIVE_COURSE_ID: 'gapfinder_active_course_id',
  QUIZ_ATTEMPTS: 'gapfinder_quiz_attempts',
  LATEST_GAP_REPORT: 'gapfinder_latest_gap_report',
  REVISION_PLAN: 'gapfinder_revision_plan',
  USER_PROFILE: 'gapfinder_user_profile',
  GEMINI_API_KEY: 'gapfinder_gemini_api_key',
};

export const DEMO_USER: UserProfile = {
  id: 'usr-demo-1',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  role: 'STUDENT',
  isDemoUser: true,
};

export const TEACHER_USER: UserProfile = {
  id: 'usr-prof-1',
  name: 'Prof. Sarah Jenkins',
  email: 's.jenkins@university.edu',
  role: 'TEACHER',
  isDemoUser: true,
};

/**
 * Initializes default baseline state for a course so judges can immediately see
 * realistic diagnostic reports, topic maps, and revision plans.
 */
export function getInitialInitialData() {
  const initialCourse = SAMPLE_COURSES[0]; // CS201 OS
  const questions = GROUNDED_QUIZ_QUESTIONS['cs201-os'] || [];

  // Generate an initial simulated baseline attempt so judges see diagnostic data right away
  const sampleAnswers = [
    { questionId: 'q-os-1', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 42, confidence: 'HIGH' as const }, // Belady misconception
    { questionId: 'q-os-2', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 50, confidence: 'MEDIUM' as const }, // Unsafe = deadlock misconception
    { questionId: 'q-os-3', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 35, confidence: 'HIGH' as const }, // TLB EAT correct
    { questionId: 'q-os-4', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 20, confidence: 'HIGH' as const }, // Thrashing correct
    { questionId: 'q-os-5', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 15, confidence: 'HIGH' as const }, // Semaphore correct
    { questionId: 'q-os-6', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 65, confidence: 'LOW' as const }, // Banker problem misconception
  ];

  const evaluated = evaluateStudentQuizAnswers(questions, sampleAnswers);
  const baselineReport = generateDiagnosticGapReport({
    course: initialCourse,
    evaluatedResults: evaluated,
  });

  const baselinePlan = generateAdaptiveRevisionPlanLocal({
    gapReport: baselineReport,
    timeframeDays: 3,
    dailyHours: 2.5,
    courseTitle: initialCourse.title,
  });

  const initialAttempt: QuizAttemptRecord = {
    id: 'attempt-baseline-1',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    topicIds: questions.map((q) => q.topicId),
    totalQuestions: questions.length,
    scorePercent: baselineReport.overallScorePercent,
    evaluatedResults: evaluated,
    gapReport: baselineReport,
  };

  return {
    courses: SAMPLE_COURSES,
    activeCourseId: 'cs201-os',
    attempts: [initialAttempt],
    latestReport: baselineReport,
    revisionPlan: baselinePlan,
    userProfile: DEMO_USER,
  };
}

export function loadStoredData() {
  if (typeof window === 'undefined') {
    return getInitialInitialData();
  }

  try {
    const storedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
    const storedActiveCourseId = localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE_ID);
    const storedAttempts = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    const storedReport = localStorage.getItem(STORAGE_KEYS.LATEST_GAP_REPORT);
    const storedPlan = localStorage.getItem(STORAGE_KEYS.REVISION_PLAN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);

    const initial = getInitialInitialData();

    return {
      courses: storedCourses ? JSON.parse(storedCourses) : initial.courses,
      activeCourseId: storedActiveCourseId || initial.activeCourseId,
      attempts: storedAttempts ? JSON.parse(storedAttempts) : initial.attempts,
      latestReport: storedReport ? JSON.parse(storedReport) : initial.latestReport,
      revisionPlan: storedPlan ? JSON.parse(storedPlan) : initial.revisionPlan,
      userProfile: storedUser ? JSON.parse(storedUser) : initial.userProfile,
    };
  } catch (err) {
    console.error('Error loading stored GapFinder data, falling back to defaults:', err);
    return getInitialInitialData();
  }
}

export function saveStoredData(key: keyof typeof STORAGE_KEYS, value: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}
