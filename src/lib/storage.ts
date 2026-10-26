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
  USER_PROFILE: 'gapfinder_user_profile',
  GEMINI_API_KEY: 'gapfinder_gemini_api_key',
  THEME: 'gapfinder_theme',
};

// Target Evaluator Demonstration Accounts
export const DEMO_PROFESSOR: UserProfile = {
  id: 'usr-prof-sarah',
  name: 'Dr. Sarah Williams',
  email: 'prof.sarah@gapfinder.demo',
  role: 'TEACHER',
  institution: 'Department of Computer Science & Engineering',
  isDemoUser: true,
  enrolledCourseIds: ['cs201-os', 'cs202-dbms', 'cs301-ml'],
};

export const DEMO_STUDENT_ALEX: UserProfile = {
  id: 'usr-student-alex',
  name: 'Alex Chen',
  email: 'alex.chen@gapfinder.demo',
  role: 'STUDENT',
  institution: 'School of Computing',
  isDemoUser: true,
  enrolledCourseIds: ['cs201-os', 'cs202-dbms'],
};

export const DEMO_STUDENT_PRIYA: UserProfile = {
  id: 'usr-student-priya',
  name: 'Priya Sharma',
  email: 'priya.sharma@gapfinder.demo',
  role: 'STUDENT',
  institution: 'School of Computing',
  isDemoUser: true,
  enrolledCourseIds: ['cs201-os', 'cs301-ml'],
};

// Aliases for backwards compatibility
export const DEMO_USER = DEMO_STUDENT_ALEX;
export const TEACHER_USER = DEMO_PROFESSOR;

export const PRELOADED_DEMO_USERS: UserProfile[] = [
  DEMO_STUDENT_ALEX,
  DEMO_STUDENT_PRIYA,
  DEMO_PROFESSOR,
];

/**
 * Preloaded authentic answers for each student to demonstrate distinct knowledge gaps
 */
function getPreloadedStudentAnswers(userId: string, courseId: string) {
  if (courseId === 'cs201-os') {
    if (userId === 'usr-student-alex') {
      // Alex: Weak on Deadlocks & Belady, Strong on TLB & Semaphores (Score: 50%)
      return [
        { questionId: 'q-os-1', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 40, confidence: 'HIGH' as const }, // Belady misconception
        { questionId: 'q-os-2', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 52, confidence: 'MEDIUM' as const }, // Unsafe = deadlock misconception
        { questionId: 'q-os-3', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 30, confidence: 'HIGH' as const }, // TLB EAT correct
        { questionId: 'q-os-4', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 22, confidence: 'HIGH' as const }, // Thrashing correct
        { questionId: 'q-os-5', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 18, confidence: 'HIGH' as const }, // Semaphore correct
        { questionId: 'q-os-6', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 60, confidence: 'LOW' as const }, // Banker misconception
      ];
    } else {
      // Priya: Strong on Deadlocks & Belady, Weak on Thrashing (Score: 83%)
      return [
        { questionId: 'q-os-1', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 28, confidence: 'HIGH' as const }, // Correct LRU
        { questionId: 'q-os-2', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 35, confidence: 'HIGH' as const }, // Correct Unsafe
        { questionId: 'q-os-3', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 25, confidence: 'HIGH' as const }, // Correct TLB
        { questionId: 'q-os-4', selectedOptionId: 'opt-a', isCorrect: false, timeSpentSeconds: 45, confidence: 'MEDIUM' as const }, // Thrashing misconception
        { questionId: 'q-os-5', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 14, confidence: 'HIGH' as const }, // Semaphore correct
        { questionId: 'q-os-6', selectedOptionId: 'opt-b', isCorrect: true, timeSpentSeconds: 40, confidence: 'HIGH' as const }, // Banker correct
      ];
    }
  }

  if (courseId === 'cs202-dbms') {
    // Alex in CS202: Score 67% (4/6 correct), Weak on Normalization BCNF trade-off
    return [
      { questionId: 'q-db-1', selectedOptionId: 'opt-db-1a', isCorrect: false, timeSpentSeconds: 48, confidence: 'HIGH' as const }, // BCNF dependency preservation misconception
      { questionId: 'q-db-2', selectedOptionId: 'opt-db-2a', isCorrect: false, timeSpentSeconds: 55, confidence: 'MEDIUM' as const }, // 2PL deadlock misconception
      { questionId: 'q-db-3', selectedOptionId: 'opt-db-3b', isCorrect: true, timeSpentSeconds: 25, confidence: 'HIGH' as const }, // Non-repeatable read correct
      { questionId: 'q-db-4', selectedOptionId: 'opt-db-4b', isCorrect: true, timeSpentSeconds: 32, confidence: 'HIGH' as const }, // Closure A+ correct
      { questionId: 'q-db-5', selectedOptionId: 'opt-db-5b', isCorrect: true, timeSpentSeconds: 20, confidence: 'HIGH' as const }, // WAL correct
      { questionId: 'q-db-6', selectedOptionId: 'opt-db-6c', isCorrect: true, timeSpentSeconds: 15, confidence: 'HIGH' as const }, // SQL 3VL correct
    ];
  }

  if (courseId === 'cs301-ml') {
    // Priya in CS301: Score 40% (2/5 correct), Weak on Regularization & Dying ReLU
    return [
      { questionId: 'q-ml-1', selectedOptionId: 'opt-ml-c', isCorrect: false, timeSpentSeconds: 45, confidence: 'HIGH' as const }, // L2 zeroes misconception
      { questionId: 'q-ml-2', selectedOptionId: 'opt-ml-2a', isCorrect: true, timeSpentSeconds: 30, confidence: 'HIGH' as const }, // Adam bias correction correct
      { questionId: 'q-ml-3', selectedOptionId: 'opt-ml-3c', isCorrect: false, timeSpentSeconds: 50, confidence: 'MEDIUM' as const }, // Dropout test-time scaling misconception
      { questionId: 'q-ml-4', selectedOptionId: 'opt-ml-4a', isCorrect: true, timeSpentSeconds: 38, confidence: 'HIGH' as const }, // Sigmoid 0.25 correct
      { questionId: 'q-ml-5', selectedOptionId: 'opt-ml-5a', isCorrect: false, timeSpentSeconds: 52, confidence: 'LOW' as const }, // Dying ReLU misconception
    ];
  }

  return [];
}

/**
 * Generates an authentic baseline diagnostic attempt for any student/course combination
 */
export function getBaselineAttemptForUserAndCourse(
  userId: string,
  course: CourseMaterial
): QuizAttemptRecord {
  const questions = GROUNDED_QUIZ_QUESTIONS[course.id] || GROUNDED_QUIZ_QUESTIONS['cs201-os'] || [];
  const sampleAnswers = getPreloadedStudentAnswers(userId, course.id);

  const evaluated = evaluateStudentQuizAnswers(questions, sampleAnswers);
  const baselineReport = generateDiagnosticGapReport({
    course,
    evaluatedResults: evaluated,
  });

  return {
    id: `attempt-baseline-${userId}-${course.id}`,
    userId,
    courseId: course.id,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    topicIds: questions.map((q) => q.topicId),
    totalQuestions: questions.length,
    scorePercent: baselineReport.overallScorePercent,
    evaluatedResults: evaluated,
    gapReport: baselineReport,
    answers: sampleAnswers,
  };
}

/**
 * Backwards compatibility baseline helper
 */
export function getBaselineAttemptForCourse(course: CourseMaterial): QuizAttemptRecord {
  return getBaselineAttemptForUserAndCourse('usr-student-alex', course);
}

export function getBaselineReportForCourse(course: CourseMaterial): DiagnosticGapReport {
  return getBaselineAttemptForCourse(course).gapReport;
}

export function getBaselinePlanForCourse(course: CourseMaterial, report: DiagnosticGapReport): RevisionPlan {
  return generateAdaptiveRevisionPlanLocal({
    gapReport: report,
    timeframeDays: 3,
    dailyHours: 2.5,
    courseTitle: course.title,
  });
}

/**
 * Retrieve user enrollments with persistent localStorage tracking
 */
export function getUserEnrollments(userId: string): string[] {
  if (typeof window === 'undefined') {
    if (userId === 'usr-student-alex') return ['cs201-os', 'cs202-dbms'];
    if (userId === 'usr-student-priya') return ['cs201-os', 'cs301-ml'];
    return ['cs201-os'];
  }

  try {
    const key = `gapfinder_enrollments_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    // Fall back to default demo enrollments
    let initial = ['cs201-os'];
    if (userId === 'usr-student-alex') initial = ['cs201-os', 'cs202-dbms'];
    else if (userId === 'usr-student-priya') initial = ['cs201-os', 'cs301-ml'];
    else if (userId === 'usr-prof-sarah') initial = ['cs201-os', 'cs202-dbms', 'cs301-ml'];

    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error('Failed to get enrollments:', err);
    return ['cs201-os'];
  }
}

/**
 * Enroll a student in a course
 */
export function enrollStudentInCourse(userId: string, courseId: string): string[] {
  const current = getUserEnrollments(userId);
  if (!current.includes(courseId)) {
    const updated = [...current, courseId];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`gapfinder_enrollments_${userId}`, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save enrollment:', err);
      }
    }
    return updated;
  }
  return current;
}

/**
 * Retrieve courses enrolled by a user
 */
export function getEnrolledCoursesForUser(user: UserProfile, allCourses: CourseMaterial[]): CourseMaterial[] {
  if (user.role === 'TEACHER') {
    return allCourses;
  }
  const enrolledIds = getUserEnrollments(user.id);
  return allCourses.filter((c) => enrolledIds.includes(c.id));
}

/**
 * Retrieve all quiz attempts for a specific user and optional course
 */
export function getUserQuizAttempts(userId: string, courseId?: string): QuizAttemptRecord[] {
  if (typeof window === 'undefined') {
    const osCourse = SAMPLE_COURSES[0];
    return [getBaselineAttemptForUserAndCourse(userId, osCourse)];
  }

  try {
    const key = `gapfinder_attempts_${userId}`;
    const stored = localStorage.getItem(key);
    let attempts: QuizAttemptRecord[] = [];

    if (stored) {
      attempts = JSON.parse(stored);
    } else {
      // Seed preloaded baseline attempt for this user's enrolled courses
      const userEnrollments = getUserEnrollments(userId);
      attempts = userEnrollments.map((cId) => {
        const courseObj = SAMPLE_COURSES.find((c) => c.id === cId) || SAMPLE_COURSES[0];
        return getBaselineAttemptForUserAndCourse(userId, courseObj);
      });
      localStorage.setItem(key, JSON.stringify(attempts));
    }

    if (courseId) {
      return attempts.filter((a) => a.courseId === courseId || a.topicIds.some((id) => id.includes(courseId.replace('-os', '').replace('-dbms', '').replace('-ml', ''))));
    }
    return attempts;
  } catch (err) {
    console.error('Failed to load user quiz attempts:', err);
    return [];
  }
}

/**
 * Save a new quiz attempt for a user
 */
export function saveUserQuizAttempt(userId: string, attempt: QuizAttemptRecord): QuizAttemptRecord[] {
  if (typeof window === 'undefined') return [attempt];
  try {
    const existing = getUserQuizAttempts(userId);
    const updated = [attempt, ...existing];
    localStorage.setItem(`gapfinder_attempts_${userId}`, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save quiz attempt:', err);
    return [attempt];
  }
}

/**
 * Load revision plan for user and course
 */
export function getUserRevisionPlan(userId: string, courseId: string, course?: CourseMaterial, report?: DiagnosticGapReport): RevisionPlan {
  const currentCourse = course || SAMPLE_COURSES.find((c) => c.id === courseId) || SAMPLE_COURSES[0];

  if (typeof window === 'undefined') {
    const rep = report || getBaselineReportForCourse(currentCourse);
    return getBaselinePlanForCourse(currentCourse, rep);
  }

  try {
    const key = `gapfinder_plan_${userId}_${courseId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    const rep = report || getBaselineReportForCourse(currentCourse);
    const initialPlan = getBaselinePlanForCourse(currentCourse, rep);
    localStorage.setItem(key, JSON.stringify(initialPlan));
    return initialPlan;
  } catch (err) {
    console.error('Failed to load revision plan:', err);
    const rep = report || getBaselineReportForCourse(currentCourse);
    return getBaselinePlanForCourse(currentCourse, rep);
  }
}

export function saveUserRevisionPlan(userId: string, courseId: string, plan: RevisionPlan): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`gapfinder_plan_${userId}_${courseId}`, JSON.stringify(plan));
  } catch (err) {
    console.error('Failed to save revision plan:', err);
  }
}

/**
 * Retrieve enrolled students for a specific course (used by Professor Dashboard)
 */
export interface CourseStudentData {
  student: UserProfile;
  attemptsCount: number;
  latestScorePercent: number;
  latestAttemptDate: string;
  weakTopicsCount: number;
  weakTopicTitles: string[];
  report: DiagnosticGapReport;
}

export function getEnrolledStudentsForCourse(courseId: string): CourseStudentData[] {
  const allStudents = [DEMO_STUDENT_ALEX, DEMO_STUDENT_PRIYA];
  const enrolledStudents = allStudents.filter((s) => {
    const enrolledIds = getUserEnrollments(s.id);
    return enrolledIds.includes(courseId);
  });

  const courseObj = SAMPLE_COURSES.find((c) => c.id === courseId) || SAMPLE_COURSES[0];

  return enrolledStudents.map((student) => {
    const attempts = getUserQuizAttempts(student.id, courseId);
    const latestAttempt = attempts[0] || getBaselineAttemptForUserAndCourse(student.id, courseObj);
    const report = latestAttempt.gapReport;

    return {
      student,
      attemptsCount: attempts.length,
      latestScorePercent: report.overallScorePercent,
      latestAttemptDate: latestAttempt.timestamp,
      weakTopicsCount: report.weakTopics.length,
      weakTopicTitles: report.weakTopics.map((t) => t.topicTitle),
      report,
    };
  });
}

/**
 * Initializes default application data
 */
export function getInitialInitialData() {
  const initialCourse = SAMPLE_COURSES[0]; // CS201 OS
  const initialUser = DEMO_STUDENT_ALEX;
  const initialAttempt = getBaselineAttemptForUserAndCourse(initialUser.id, initialCourse);
  const baselineReport = initialAttempt.gapReport;
  const baselinePlan = getBaselinePlanForCourse(initialCourse, baselineReport);

  return {
    courses: SAMPLE_COURSES,
    activeCourseId: 'cs201-os',
    attempts: [initialAttempt],
    latestReport: baselineReport,
    revisionPlan: baselinePlan,
    userProfile: initialUser,
  };
}

export function loadStoredData() {
  if (typeof window === 'undefined') {
    return getInitialInitialData();
  }

  try {
    const storedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
    const storedActiveCourseId = localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE_ID);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);

    const initial = getInitialInitialData();
    const user: UserProfile = storedUser ? JSON.parse(storedUser) : initial.userProfile;
    const courses: CourseMaterial[] = storedCourses ? JSON.parse(storedCourses) : initial.courses;
    const activeCourseId = storedActiveCourseId || initial.activeCourseId;
    const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

    const attempts = getUserQuizAttempts(user.id, activeCourse.id);
    const latestAttempt = attempts[0] || getBaselineAttemptForUserAndCourse(user.id, activeCourse);
    const latestReport = latestAttempt.gapReport;
    const revisionPlan = getUserRevisionPlan(user.id, activeCourse.id, activeCourse, latestReport);

    return {
      courses,
      activeCourseId,
      attempts,
      latestReport,
      revisionPlan,
      userProfile: user,
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
