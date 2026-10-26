import {
  QuizQuestion,
  StudentAnswer,
  EvaluatedQuestionResult,
  DiagnosticGapReport,
  TopicGapDetail,
  MasteryLevel,
  CourseMaterial,
} from '@/types';

/**
 * Evaluates individual student answers against the grounded questions,
 * identifying specific misconceptions when chosen distractors were marked as misconception traps.
 */
export function evaluateStudentQuizAnswers(
  questions: QuizQuestion[],
  answers: StudentAnswer[]
): EvaluatedQuestionResult[] {
  const answerMap = new Map<string, StudentAnswer>();
  for (const ans of answers) {
    answerMap.set(ans.questionId, ans);
  }

  return questions.map((question) => {
    const studentAns = answerMap.get(question.id) || {
      questionId: question.id,
      selectedOptionId: '',
      isCorrect: false,
      timeSpentSeconds: 0,
      confidence: 'MEDIUM' as const,
    };

    const isCorrect = studentAns.selectedOptionId === question.correctOptionId;
    const chosenOption = question.options.find((opt) => opt.id === studentAns.selectedOptionId);

    let diagnosticFeedback = '';
    let identifiedMisconception: string | undefined = undefined;

    if (isCorrect) {
      diagnosticFeedback = `Correct! You demonstrated accurate understanding of "${question.topicTitle}". Citation: ${question.citation.documentName} (${question.citation.section}).`;
    } else {
      if (chosenOption?.isMisconception) {
        identifiedMisconception = chosenOption.misconceptionExplanation;
        diagnosticFeedback = `Identified Misconception: ${chosenOption.misconceptionExplanation || 'Conceptual confusion detected.'} Reference: ${question.citation.documentName} [Page ${question.citation.page || 'N/A'}].`;
      } else if (!studentAns.selectedOptionId) {
        diagnosticFeedback = `Question was unattempted. This topic was not tested in this run.`;
      } else {
        diagnosticFeedback = `Incorrect choice. The correct principle is: ${question.explanation}`;
      }
    }

    return {
      question,
      studentAnswer: { ...studentAns, isCorrect },
      isCorrect,
      diagnosticFeedback,
      identifiedMisconception,
    };
  });
}

/**
 * Aggregates evaluated quiz results into a Topic-Level Gap Analysis Report.
 */
export function generateDiagnosticGapReport({
  course,
  evaluatedResults,
}: {
  course: CourseMaterial;
  evaluatedResults: EvaluatedQuestionResult[];
}): DiagnosticGapReport {
  // Group results by topicId
  const topicStats = new Map<
    string,
    {
      total: number;
      correct: number;
      misconceptions: string[];
      topicTitle: string;
      unitTitle: string;
      cognitiveScores: { recall: number[]; conceptual: number[]; problemSolving: number[]; edgeCase: number[] };
    }
  >();

  // Pre-seed with all topics from course
  for (const unit of course.units) {
    for (const topic of unit.topics) {
      topicStats.set(topic.id, {
        total: 0,
        correct: 0,
        misconceptions: [...topic.detectedMisconceptions],
        topicTitle: topic.title,
        unitTitle: unit.title,
        cognitiveScores: { recall: [], conceptual: [], problemSolving: [], edgeCase: [] },
      });
    }
  }

  // Populate from evaluated quiz answers
  for (const res of evaluatedResults) {
    const stat = topicStats.get(res.question.topicId);
    if (stat) {
      stat.total++;
      if (res.isCorrect) stat.correct++;
      if (res.identifiedMisconception) {
        if (!stat.misconceptions.includes(res.identifiedMisconception)) {
          stat.misconceptions.push(res.identifiedMisconception);
        }
      }

      // Record cognitive score
      const score = res.isCorrect ? 100 : 0;
      if (res.question.cognitiveLevel === 'RECALL') stat.cognitiveScores.recall.push(score);
      else if (res.question.cognitiveLevel === 'CONCEPTUAL') stat.cognitiveScores.conceptual.push(score);
      else if (res.question.cognitiveLevel === 'PROBLEM_SOLVING') stat.cognitiveScores.problemSolving.push(score);
      else if (res.question.cognitiveLevel === 'EDGE_CASE') stat.cognitiveScores.edgeCase.push(score);
    }
  }

  const weakTopics: TopicGapDetail[] = [];
  const mediumTopics: TopicGapDetail[] = [];
  const strongTopics: TopicGapDetail[] = [];

  let totalQuestionsCount = 0;
  let totalCorrectCount = 0;

  // Find course topics
  const allCourseTopics = course.units.flatMap((u) => u.topics);

  for (const [topicId, stat] of topicStats.entries()) {
    const courseTopic = allCourseTopics.find((t) => t.id === topicId);
    const weightage = courseTopic?.examWeightagePercent || 15;

    let accuracy = stat.total > 0 ? (stat.correct / stat.total) * 100 : (courseTopic?.masteryScore || 50);
    // If not tested in this session, use prior baseline if available
    const effectiveMasteryScore = Math.round(stat.total > 0 ? accuracy : (courseTopic?.masteryScore || 50));

    let masteryLevel: MasteryLevel = 'MEDIUM';
    let primaryReason = '';
    let recommendedAction = '';

    if (effectiveMasteryScore < 50) {
      masteryLevel = 'WEAK';
      if (stat.misconceptions.length > 0) {
        primaryReason = `Critical misconception detected: ${stat.misconceptions[0]}`;
      } else {
        primaryReason = `Scored low on diagnostic problems (${stat.correct}/${stat.total} correct). Foundational definitions require reinforcement.`;
      }
      recommendedAction = `Prioritize immediate revision of core definitions and step-by-step problem traces before moving to mock tests.`;
    } else if (effectiveMasteryScore <= 75) {
      masteryLevel = 'MEDIUM';
      primaryReason = `Understands core concepts, but struggles with nuanced edge cases or calculation speed under timed conditions.`;
      recommendedAction = `Review past exam questions and edge-case exceptions in uploaded notes.`;
    } else {
      masteryLevel = 'STRONG';
      primaryReason = `Demonstrates rock-solid command of theory, invariants, and problem solving (${stat.correct}/${stat.total} questions correct).`;
      recommendedAction = `Maintain with quick periodic 5-minute active recall review.`;
    }

    const keySourcesToReview: { documentName: string; section: string; page?: number }[] = course.chunks
      .filter((c) => c.topics.includes(topicId))
      .slice(0, 2)
      .map((c) => ({
        documentName: c.documentName,
        section: c.section,
        page: c.page,
      }));

    if (keySourcesToReview.length === 0) {
      keySourcesToReview.push({
        documentName: course.documents[0]?.name || 'Course Material',
        section: `${stat.unitTitle} -> ${stat.topicTitle}`,
      });
    }

    const detail: TopicGapDetail = {
      topicId,
      topicTitle: stat.topicTitle,
      unitTitle: stat.unitTitle,
      masteryLevel,
      masteryScore: effectiveMasteryScore,
      examWeightagePercent: weightage,
      accuracyRate: Math.round(accuracy),
      totalQuestions: stat.total,
      correctQuestions: stat.correct,
      primaryReason,
      identifiedMisconceptions: stat.misconceptions,
      recommendedAction,
      keySourcesToReview,
    };

    if (masteryLevel === 'WEAK') weakTopics.push(detail);
    else if (masteryLevel === 'MEDIUM') mediumTopics.push(detail);
    else strongTopics.push(detail);

    totalQuestionsCount += stat.total;
    totalCorrectCount += stat.correct;
  }

  // Calculate overall readiness
  const overallScorePercent =
    totalQuestionsCount > 0
      ? Math.round((totalCorrectCount / totalQuestionsCount) * 100)
      : 60;

  let overallReadiness: 'CRITICAL_GAPS' | 'NEEDS_TARGETED_REVISION' | 'EXAM_READY' = 'NEEDS_TARGETED_REVISION';
  let summaryMessage = '';

  if (overallScorePercent < 55 || weakTopics.length >= 2) {
    overallReadiness = 'CRITICAL_GAPS';
    summaryMessage = `Diagnostic identified ${weakTopics.length} critical gap(s) directly impacting ${weakTopics.reduce((acc, t) => acc + t.examWeightagePercent, 0)}% of your target exam weightage. Targeted revision is urgently recommended.`;
  } else if (overallScorePercent < 80) {
    overallReadiness = 'NEEDS_TARGETED_REVISION';
    summaryMessage = `Solid foundational knowledge, but ${mediumTopics.length + weakTopics.length} topic(s) have conceptual blindspots or unaddressed edge cases. Focused practice will elevate your score significantly.`;
  } else {
    overallReadiness = 'EXAM_READY';
    summaryMessage = `Excellent mastery across evaluated modules! You are well-positioned for top percentiles. Focus on rapid formula recall and time management.`;
  }

  // High-Risk Danger Zones (Weak topics with exam weightage >= 15%)
  const highRiskDangerZones = weakTopics
    .filter((t) => t.examWeightagePercent >= 15)
    .map((t) => ({
      topicTitle: t.topicTitle,
      weightage: t.examWeightagePercent,
      reason: `Carries ${t.examWeightagePercent}% exam weightage with a low mastery score of ${t.masteryScore}%. Highly dangerous if untested in real exam!`,
    }));

  // Cognitive dimensions breakdown
  const avgDimension = (scores: number[], defaultVal: number) =>
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : defaultVal;

  const allRecall = evaluatedResults
    .filter((r) => r.question.cognitiveLevel === 'RECALL')
    .map((r) => (r.isCorrect ? 100 : 0));
  const allConceptual = evaluatedResults
    .filter((r) => r.question.cognitiveLevel === 'CONCEPTUAL')
    .map((r) => (r.isCorrect ? 100 : 0));
  const allProblemSolving = evaluatedResults
    .filter((r) => r.question.cognitiveLevel === 'PROBLEM_SOLVING')
    .map((r) => (r.isCorrect ? 100 : 0));
  const allEdgeCase = evaluatedResults
    .filter((r) => r.question.cognitiveLevel === 'EDGE_CASE')
    .map((r) => (r.isCorrect ? 100 : 0));

  return {
    id: `gap-report-${Date.now()}`,
    createdAt: new Date().toISOString(),
    quizAttemptId: `attempt-${Date.now()}`,
    overallScorePercent,
    overallReadiness,
    summaryMessage,
    weakTopics,
    mediumTopics,
    strongTopics,
    knowledgeDimensions: {
      theoretical: avgDimension(allRecall, 75),
      problemSolving: avgDimension(allProblemSolving, 45),
      edgeCases: avgDimension(allEdgeCase, 40),
      terminology: avgDimension(allConceptual, 80),
    },
    highRiskDangerZones,
  };
}
