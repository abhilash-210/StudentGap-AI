export type MasteryLevel = 'UNTESTED' | 'WEAK' | 'MEDIUM' | 'STRONG';

export interface DocumentSource {
  id: string;
  name: string;
  type: 'syllabus' | 'notes' | 'textbook' | 'past_paper';
  pageOrSection?: string;
  chunkId?: string;
  snippet?: string;
}

export interface MaterialChunk {
  id: string;
  documentId: string;
  documentName: string;
  documentType: 'syllabus' | 'notes' | 'textbook' | 'past_paper';
  section: string;
  page?: number;
  content: string;
  topics: string[]; // Topic IDs this chunk is relevant to
  wordCount: number;
}

export interface TopicItem {
  id: string;
  unitId: string;
  unitTitle: string;
  title: string;
  description: string;
  examWeightagePercent: number; // e.g. 25 = 25% of exam weight
  estimatedStudyMins: number;
  prerequisites?: string[];
  keyConcepts: string[];
  masteryLevel: MasteryLevel;
  masteryScore: number; // 0 to 100
  lastTestedAt?: string;
  questionsAttempted: number;
  questionsCorrect: number;
  detectedMisconceptions: string[];
}

export interface UnitItem {
  id: string;
  number: number;
  title: string;
  description: string;
  topics: TopicItem[];
}

export interface CourseMaterial {
  id: string;
  code: string;
  title: string;
  description: string;
  subject: string;
  targetExam: string;
  examDate?: string;
  units: UnitItem[];
  documents: {
    id: string;
    name: string;
    type: 'syllabus' | 'notes' | 'textbook' | 'past_paper';
    uploadedAt: string;
    sizeKb: number;
    chunkCount: number;
  }[];
  chunks: MaterialChunk[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  unitTitle: string;
  questionText: string;
  options: {
    id: string;
    text: string;
    isMisconception?: boolean;
    misconceptionExplanation?: string;
  }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  cognitiveLevel: 'RECALL' | 'CONCEPTUAL' | 'PROBLEM_SOLVING' | 'EDGE_CASE';
  citation: {
    documentName: string;
    section: string;
    page?: number;
    sourceSnippet: string;
  };
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface EvaluatedQuestionResult {
  question: QuizQuestion;
  studentAnswer: StudentAnswer;
  isCorrect: boolean;
  diagnosticFeedback: string;
  identifiedMisconception?: string;
}

export interface TopicGapDetail {
  topicId: string;
  topicTitle: string;
  unitTitle: string;
  masteryLevel: MasteryLevel;
  masteryScore: number;
  examWeightagePercent: number;
  accuracyRate: number;
  totalQuestions: number;
  correctQuestions: number;
  primaryReason: string;
  identifiedMisconceptions: string[];
  recommendedAction: string;
  keySourcesToReview: {
    documentName: string;
    section: string;
    page?: number;
  }[];
}

export interface DiagnosticGapReport {
  id: string;
  createdAt: string;
  quizAttemptId: string;
  overallScorePercent: number;
  overallReadiness: 'CRITICAL_GAPS' | 'NEEDS_TARGETED_REVISION' | 'EXAM_READY';
  summaryMessage: string;
  weakTopics: TopicGapDetail[];
  mediumTopics: TopicGapDetail[];
  strongTopics: TopicGapDetail[];
  knowledgeDimensions: {
    theoretical: number; // 0-100
    problemSolving: number; // 0-100
    edgeCases: number; // 0-100
    terminology: number; // 0-100
  };
  highRiskDangerZones: {
    topicTitle: string;
    weightage: number;
    reason: string;
  }[];
}

export interface RevisionTask {
  id: string;
  dayNumber: number;
  topicId: string;
  topicTitle: string;
  unitTitle: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  taskType: 'CORE_CONCEPT_REVISION' | 'MISCONCEPTION_CLEARING' | 'PAST_PAPER_DRILL' | 'SELF_TEST';
  title: string;
  instruction: string;
  durationMinutes: number;
  citationReference: string;
  completed: boolean;
  completedAt?: string;
}

export interface DailyRevisionSchedule {
  dayNumber: number;
  dateLabel: string;
  theme: string;
  estimatedMinutes: number;
  tasks: RevisionTask[];
}

export interface RevisionPlan {
  id: string;
  courseId: string;
  generatedAt: string;
  timeframeDays: number;
  dailyHoursAvailable: number;
  totalEstimatedMinutes: number;
  completedMinutes: number;
  completionPercent: number;
  schedules: DailyRevisionSchedule[];
}

export interface QuizAttemptRecord {
  id: string;
  timestamp: string;
  topicIds: string[];
  totalQuestions: number;
  scorePercent: number;
  evaluatedResults: EvaluatedQuestionResult[];
  gapReport: DiagnosticGapReport;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citations?: {
    documentName: string;
    section: string;
    page?: number;
    snippet: string;
  }[];
  suggestedFollowups?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER';
  avatar?: string;
  isDemoUser: boolean;
}
