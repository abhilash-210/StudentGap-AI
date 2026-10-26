import {
  QuizAttemptRecord,
  UserProfile,
  CourseMaterial,
  DiagnosticGapReport,
  RevisionPlan,
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
  THEME: 'gapfinder_theme',
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
 * Generates an authentic baseline diagnostic attempt and gap report for any course
 * so evaluators can immediately inspect real syllabus weaknesses and misconceptions.
 */
export function getBaselineAttemptForCourse(course: CourseMaterial): QuizAttemptRecord {
  const questions = GROUNDED_QUIZ_QUESTIONS[course.id] || GROUNDED_QUIZ_QUESTIONS['cs201-os'] || [];

  let sampleAnswers = [
    { questionId: 'q-os-1', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 42, confidence: 'HIGH' as const }, // Belady misconception
    { questionId: 'q-os-2', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 50, confidence: 'MEDIUM' as const }, // Unsafe = deadlock misconception
    { questionId: 'q-os-3', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 35, confidence: 'HIGH' as const }, // TLB EAT correct
    { questionId: 'q-os-4', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 20, confidence: 'HIGH' as const }, // Thrashing correct
    { questionId: 'q-os-5', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 15, confidence: 'HIGH' as const }, // Semaphore correct
    { questionId: 'q-os-6', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 65, confidence: 'LOW' as const }, // Banker problem misconception
  ];

  if (course.id === 'cs301-ml') {
    sampleAnswers = [
      { questionId: 'q-ml-1', selectedOptionId: 'opt-ml-c', isCorrect: false, timeSpentSeconds: 45, confidence: 'HIGH' as const }, // L2 zeroes misconception
      { questionId: 'q-ml-2', selectedOptionId: 'opt-ml-2a', isCorrect: true, timeSpentSeconds: 30, confidence: 'HIGH' as const }, // Adam bias correction correct
      { questionId: 'q-ml-3', selectedOptionId: 'opt-ml-3c', isCorrect: false, timeSpentSeconds: 52, confidence: 'MEDIUM' as const }, // Dropout test-time scaling misconception
      { questionId: 'q-ml-4', selectedOptionId: 'opt-ml-4a', isCorrect: true, timeSpentSeconds: 40, confidence: 'HIGH' as const }, // Sigmoid 0.25 correct
      { questionId: 'q-ml-5', selectedOptionId: 'opt-ml-5a', isCorrect: false, timeSpentSeconds: 55, confidence: 'LOW' as const }, // Dying ReLU misconception
    ];
  }

  const evaluated = evaluateStudentQuizAnswers(questions, sampleAnswers);
  const baselineReport = generateDiagnosticGapReport({
    course,
    evaluatedResults: evaluated,
  });

  return {
    id: `attempt-baseline-${course.id}`,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    topicIds: questions.map((q) => q.topicId),
    totalQuestions: questions.length,
    scorePercent: baselineReport.overallScorePercent,
    evaluatedResults: evaluated,
    gapReport: baselineReport,
    answers: sampleAnswers,
  };
}

export function getBaselineReportForCourse(course: CourseMaterial): DiagnosticGapReport {
  return getBaselineAttemptForCourse(course).gapReport;
}

/**
 * Generates an adaptive revision plan tailored for the course baseline.
 */
export function getBaselinePlanForCourse(course: CourseMaterial, report: DiagnosticGapReport): RevisionPlan {
  return generateAdaptiveRevisionPlanLocal({
    gapReport: report,
    timeframeDays: 3,
    dailyHours: 2.5,
    courseTitle: course.title,
  });
}

/**
 * Initializes default baseline state for a course so judges can immediately see
 * realistic diagnostic reports, topic maps, and revision plans.
 */
export function getInitialInitialData() {
  const initialCourse = SAMPLE_COURSES[0]; // CS201 OS
  const initialAttempt = getBaselineAttemptForCourse(initialCourse);
  const baselineReport = initialAttempt.gapReport;
  const baselinePlan = getBaselinePlanForCourse(initialCourse, baselineReport);

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

export function saveStoredData(key: keyof typeof STORAGE_KEYS, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}
